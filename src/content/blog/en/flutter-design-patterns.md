You pull to refresh your banking app just as the train enters a tunnel. A coffee charge that was on the screen a second ago disappears. *No transactions yet*, the app says.

Somewhere in the data layer, a well-meaning `catch (_) { return []; }` turned a failed request into a successful empty result. By the time Flutter calls `build()`, the widget has lost the one fact it needs to tell those stories apart.

Let’s follow that coffee through a read-only transaction feed for one US-dollar account. The feed reads a legacy ledger, keeps a snapshot on the phone, and offers two sort orders. **Adapter, Repository, Strategy, and Observer** each solve a different part of the problem.

## Adapter gives a debit the right sign

The ledger sends the coffee as `425` cents with a debit flag. The app represents it as `-425` cents. The ledger also timestamps transactions in seconds, while the Dart constructor we’re using expects milliseconds. A missed conversion can send a perfectly recent coffee back to 1970.

An **Adapter** lets the app call the interface it expects. Here, `TransactionSource.fetch(accountId)` promises app-owned entries. Only the adapter needs to know what the legacy client calls a posting.

```dart
class LedgerAdapter implements TransactionSource {
  LedgerAdapter(this.ledger);
  final LegacyLedger ledger;

  @override
  Future<List<Entry>> fetch(String accountId) async {
    final postings = await ledger.postingsFor(accountId);
    return [
      for (final p in postings)
        Entry(
          id: p.id,
          label: p.description,
          cents: p.isDebit ? -p.cents : p.cents,
          bookedAt: DateTime.fromMillisecondsSinceEpoch(
            p.epochSeconds * 1000, isUtc: true,
          ),
        ),
    ];
  }
}
```

If the ledger starts sending signed cents, this is the one conversion to revisit. Flutter uses the same pattern in its own layout system. An ordinary box widget can sit among the slivers of a `CustomScrollView` through [SliverToBoxAdapter][sliver].

## Repository decides what survives a failed refresh

The view model asks for `repository.load(accountId)`. The **Repository** decides which data can answer that request. A successful result carries the entries, the time of the last successful fetch, and whether this read used the cache. Flutter puts this responsibility in the data layer and describes several ways to read saved data. [Architecture guide][architecture] · [Offline-first support][offline]

![A successful fetch replaces the account snapshot, even with zero rows. On a connectivity failure, a saved snapshot is shown with its original time. Without a saved snapshot, the feed offers Retry.](/blog/flutter-design-patterns/refresh-en.png)

Say the last successful fetch was at **09:15**. The rider loses signal at 09:18. Showing the coffee with *Last updated 09:15* is honest. Stamping the cached rows with 09:18 would make old data look freshly verified.

```dart
Future<FeedSnapshot> load(String accountId) async {
  final List<Entry> rows;
  try {
    rows = await remote.fetch(accountId);
  } on ConnectionUnavailable {
    final saved = await cache.read(accountId);
    if (saved == null) rethrow;
    return saved.asCached();
  }
  final fresh = FeedSnapshot.fresh(rows, now().toUtc());
  await cache.write(accountId, fresh);
  return fresh;
}
```

A saved snapshot with zero rows still counts as a cache hit. A decoding error follows its own error path. Only a connectivity failure triggers the fallback in this design.

## Strategy makes sorting a local decision

The coffee is the most recent purchase. The bookshop charge is the largest. Tapping *Largest first* should move the bookshop to the top even in the tunnel. For this single-currency feed, “largest” means the greatest absolute amount, so a refund competes with a purchase on size.

A **Strategy** is an interchangeable rule. Dart’s `Comparator<Entry>` already has the shape we need. The view model passes the selected function to `ordered`. [Strategy pattern][strategy]

```dart
int newestFirst(Entry a, Entry b) {
  final time = b.bookedAt.compareTo(a.bookedAt);
  return time != 0 ? time : a.id.compareTo(b.id);
}

int largestFirst(Entry a, Entry b) {
  final size = b.cents.abs().compareTo(a.cents.abs());
  return size != 0 ? size : newestFirst(a, b);
}

List<Entry> ordered(List<Entry> rows, Comparator<Entry> by) =>
    List<Entry>.unmodifiable([...rows]..sort(by));
```

![The 09:15 snapshot lists Coffee at −$4.25, Bookshop at −$32.00, and Refund at +$18.00, newest first. Sorting by amount moves Bookshop first, then Refund, then Coffee.](/blog/flutter-design-patterns/sort-en.png)

`sort` mutates its list, so the code orders a copy. Dart also allows equal items to change relative order during a sort. Falling back to booking time and then a unique ID gives tied transactions a predictable place. [Dart’s List.sort documentation][sort]

## Observer keeps the widget in sync

Both a refresh and a sort can change what the rider sees. The view model keeps the active comparator and applies it whenever new entries arrive. It publishes each result through a `ValueNotifier<FeedState>` and exposes a read-only `ValueListenable<FeedState>` to the view.

That subscription is the **Observer** pattern. The model can publish a new state without knowing which widget is listening. Making `FeedState` a sealed Dart class also means the widget must handle every case.

```dart
ValueListenableBuilder<FeedState>(
  valueListenable: model.state,
  builder: (context, feed, child) => switch (feed) {
    FeedReady(:final snapshot) => TransactionList(
      entries: snapshot.entries,
      cachedAt: snapshot.fromCache ? snapshot.syncedAt : null,
    ),
    FeedUnavailable() => RetryButton(onPressed: model.refresh),
    FeedFailed(:final message) => FeedError(message: message),
    FeedLoading() => const CircularProgressIndicator(),
  },
)
```

An empty `FeedReady` can now say *No transactions yet*. `FeedUnavailable` offers a retry. `ValueNotifier` checks equality when you assign its value. Mutating a list inside the existing state skips that check. Assign a new, unequal state with the reordered entries and the builder receives the update. [ValueNotifier][notifier] · [ValueListenableBuilder][builder]

## Two tests I’d keep

- **Refresh the same account twice.** Seed a 09:15 snapshot containing the coffee. Make the remote source fail offline and assert that the coffee and 09:15 survive. Then return a successful empty list and assert that the coffee disappears from both the screen and the cache.
- **Change the order in the tunnel.** Starting from those three cached entries, select *Largest first*. Assert that the bookshop moves to the top, the last-updated time stays at 09:15, and the remote call count stays unchanged.

If the screen only offered newest first, I’d leave its comparison next to the list. I’d still keep the first test. The rider should be able to finish the trip with that coffee charge in view.

[sliver]: https://api.flutter.dev/flutter/widgets/SliverToBoxAdapter-class.html
[architecture]: https://docs.flutter.dev/app-architecture/guide
[offline]: https://docs.flutter.dev/app-architecture/design-patterns/offline-first
[strategy]: https://refactoring.guru/design-patterns/strategy
[sort]: https://api.dart.dev/dart-core/List/sort.html
[notifier]: https://api.flutter.dev/flutter/package-listen_listen/ValueNotifier-class.html
[builder]: https://api.flutter.dev/flutter/widgets/ValueListenableBuilder-class.html
