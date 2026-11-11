*How MVC, MVP, MVVM, MVI, and state management fit together—and how to choose boundaries that survive a package change.*

“We use BLoC.”

That is useful information in an architecture discussion. It tells us something about how the team represents changes and delivers state to widgets. It leaves several questions open:

- Who owns application data?
- Where do reusable business rules live?
- How do features communicate?
- What happens when two requests finish out of order?

Flutter discussions often compress these decisions into one choice: Provider, Riverpod, BLoC, MobX, or GetX. That makes package comparisons easier, but design conversations less precise.

Architecture and state management are different concerns with a meaningful overlap. A package provides mechanisms and may encourage a particular structure. The application still needs explicit responsibilities, dependencies, and ownership rules.

## 1. Separate four design decisions

Before choosing a package, separate the questions your design must answer.

| Decision                  | Question                                                            | Examples                                               |
|---------------------------|---------------------------------------------------------------------|--------------------------------------------------------|
| Application architecture  | Where do responsibilities live, and which dependencies are allowed? | UI/data layers, repositories, optional domain logic    |
| Presentation architecture | How do the UI and presentation logic collaborate?                   | MVC, MVP, MVVM, MVI                                    |
| State mechanisms          | How is state stored, changed, observed, and disposed?               | ChangeNotifier, Riverpod, Bloc/Cubit, MobX             |
| Code organization         | How is the implementation grouped and owned?                        | Feature folders, packages, independent feature modules |

This is a practical taxonomy, not a universal standard. In particular, MVC and its relatives primarily describe presentation relationships; their names do not settle every dependency across an entire application.

A feature-oriented project can use MVVM in its presentation layer, Riverpod for state and dependency access, and repositories behind stable interfaces. A different project can retain the same feature boundaries while using BLoC.

Flutter’s architecture guide gives a concrete starting point: views and view models in the UI layer, repositories and services in the data layer, with a domain layer when its complexity justifies it. Treat that as a design to adapt, rather than a folder structure to copy mechanically. [1](https://docs.flutter.dev/app-architecture/guide)

![Dependency diagram showing a view, a presentation state owner, an optional use case, a repository contract, and a concrete repository connected to a data source.](/blog/flutter-presentation-architecture-vs-state-management/01_boundaries.png)

*Figure 1. One possible dependency design. Solid arrows mean “depends on”; the dashed arrow means “implements.” A feature can use a repository directly, through a use case, or both. The application’s composition root connects the contract to its implementation. This is an illustrative design, not a mandatory Flutter template.*

The useful test is concrete: could you replace the remote data source without rewriting the screen’s presentation logic? Could you test that logic with a fake repository? These questions reveal more than the name of the state package.

## 2. What each presentation architecture looks like in Flutter

The most useful way to compare MVC, MVP, MVVM, and MVI is to follow one interaction: the user taps **Refresh** on a transaction-history screen. Which component receives the input? Who asks the repository for data? Who owns the state the screen renders? And how does the view learn that something changed?

The presentation pattern defines those relationships. A state-management mechanism implements the notifications, subscriptions, or state transitions inside them. The same Flutter widget tree can participate in very different designs.

### MVC — the controller handles input; the view observes the model

![MVC interaction: the user triggers the view, the view calls a controller, the controller invokes the observable model, the model requests the repository, and the view observes model state.](/blog/flutter-presentation-architecture-vs-state-management/02_mvc.png)

*MVC: the controller handles input while the view observes changes in the model.*

- **View:** `TransactionsScreen` renders the model's current data and forwards interactions.
- **Controller:** `TransactionsController.refresh()` interprets the input and tells the model what to do.
- **Model:** an observable `TransactionsModel` holds the data or screen-facing state that views read.
- **Possible Flutter wiring:** the model exposes a `ValueNotifier`, `ChangeNotifier`, or `stream`; the view uses `ValueListenableBuilder`, `Provider`, or `StreamBuilder` to observe it.

**Example: MVC + ValueNotifier**

```dart
class TransactionsState {
  const TransactionsState({
    this.isLoading = false,
    this.items = const [],
  });

  const TransactionsState.initial() : this();
  const TransactionsState.loading() : this(isLoading: true);

  final bool isLoading;
  final List<Transaction> items;
}

class TransactionsModel {
  final state = ValueNotifier(const TransactionsState.initial());
  // repository updates `state.value` after fetch
}

class TransactionsController {
  TransactionsController(this._model);
  final TransactionsModel _model;

  Future<void> refresh() => _model.load(); // model owns the data change
}

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  late final model = TransactionsModel(/* repo */);
  late final controller = TransactionsController(model);

  @override
  Widget build(BuildContext context) {
    // View observes the model; input goes to the controller.
    return ValueListenableBuilder<TransactionsState>(
      valueListenable: model.state,
      builder: (context, state, _) => Column(
        children: [
          TextButton(onPressed: controller.refresh, child: const Text('Refresh')),
          Expanded(child: TransactionsBody(state: state)),
        ],
      ),
    );
  }
}
```

The view watches `model.state`; `controller.refresh()` requests data. The controller does not need to update widgets directly. [2](https://martinfowler.com/eaaDev/uiArchs.html)

### MVP — the presenter drives a view contract

![MVP interaction: the user triggers the view, the view calls the presenter, the presenter requests the repository and calls render with state through the view contract.](/blog/flutter-presentation-architecture-vs-state-management/03_mvp.png)

*MVP: the presenter coordinates the interaction and updates the view through its contract.*

- **View:** `TransactionsScreen` implements a small `TransactionsView` interface, such as `render(TransactionsState state)`.
- **Presenter:** `TransactionsPresenter.refresh()` performs presentation coordination and calls the view contract when state changes.
- **State delivery:** the widget adapter can save the supplied state and call `setState`; alternatively it can adapt the contract to a notifier or stream.
- **Possible Flutter wiring:** `setState` is sufficient for the adapter; Provider may construct and scope the presenter, but it does not replace the explicit view contract.

**Example: MVP + setState**

```dart
abstract interface class TransactionsView {
  void render(TransactionsState state);
}

class TransactionsPresenter {
  TransactionsPresenter(this._view, this._repo);
  final TransactionsView _view;
  final TransactionsRepository _repo;

  Future<void> refresh() async {
    _view.render(const TransactionsState.loading());
    _view.render(await _repo.fetch());
  }
}

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen>
    implements TransactionsView {
  late final presenter = TransactionsPresenter(this, repo);
  TransactionsState state = const TransactionsState.initial();

  @override
  Widget build(BuildContext context) => Column(
    children: [
      TextButton(onPressed: presenter.refresh, child: const Text('Refresh')),
      Expanded(child: TransactionsBody(state: state)),
    ],
  );

  @override
  void render(TransactionsState next) {
    if (!mounted) return;
    setState(() => state = next);
  }
}
```

The presenter calls `render`; the view updates its state. Detach the view when it is disposed. [3](https://martinfowler.com/eaaDev/PassiveScreen.html)

### MVVM — the view observes state exposed by a ViewModel

![MVVM interaction: the user triggers the view, the view invokes the ViewModel, the ViewModel requests the repository, and the view observes ViewModel state.](/blog/flutter-presentation-architecture-vs-state-management/04_mvvm.png)

*MVVM: the view calls the ViewModel and observes the presentation state it exposes.*

- **View:** `TransactionsScreen` reads presentation state and calls actions such as `viewModel.load()`.
- **ViewModel:** `TransactionsViewModel` owns screen state and coordinates loading, mapping, and error handling.
- **State delivery:** the ViewModel publishes changes; the view subscribes and rebuilds the relevant widgets.
- **Possible Flutter wiring:** `ChangeNotifier` with Provider, a Riverpod `Notifier`/`AsyncNotifier`, a Cubit serving as the ViewModel, or MobX observables and `Observer`.

**Example: MVVM + Riverpod**

```dart
class TransactionsViewModel extends Notifier<TransactionsState> {
  @override
  TransactionsState build() => const TransactionsState.initial();

  Future<void> load() async {
    state = const TransactionsState.loading();
    state = await ref.read(transactionsRepoProvider).fetch();
  }
}

final transactionsVmProvider =
    NotifierProvider<TransactionsViewModel, TransactionsState>(
  TransactionsViewModel.new,
);

class TransactionsScreen extends ConsumerWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // View observes ViewModel state; actions call the ViewModel.
    final state = ref.watch(transactionsVmProvider);

    return Column(
      children: [
        TextButton(
          onPressed: () => ref.read(transactionsVmProvider.notifier).load(),
          child: const Text('Refresh'),
        ),
        Expanded(child: TransactionsBody(state: state)),
      ],
    );
  }
}
```

`ref.watch` observes state; `load()` calls the ViewModel. MVVM also supports unidirectional data flow. [4](https://docs.flutter.dev/app-architecture/recommendations) [5](https://docs.flutter.dev/app-architecture/concepts)

### MVI — the view sends intents and renders state snapshots

![MVI-inspired interaction: the user triggers the view, the view sends an intent or event to a state processor, the processor requests the repository and publishes the next state to the view.](/blog/flutter-presentation-architecture-vs-state-management/05_mvi.png)

*MVI: the view sends an intent and renders the resulting feature-state snapshot.*

- **View:** `TransactionsScreen` dispatches an intent such as `TransactionsRequested` and renders a feature-state snapshot.
- **State processor:** an event handler, update function, or reducer translates inputs and results into the next state.
- **State delivery:** subscribers observe a sequence of states such as `Initial`, `Loading`, `Loaded`, and `Failure`.
- **Possible Flutter wiring:** Bloc events plus `BlocBuilder`, or Redux actions/reducers plus a store connector. A Riverpod notifier can also follow an intent-driven design if the team implements that discipline explicitly.

**Example: MVI-inspired + Bloc**

```dart
class TransactionsBloc extends Bloc<TransactionsEvent, TransactionsState> {
  TransactionsBloc(this._repo) : super(const TransactionsState.initial()) {
    on<TransactionsRequested>((event, emit) async {
      emit(const TransactionsState.loading());
      emit(await _repo.fetch());
    });
  }

  final TransactionsRepository _repo;
}

class TransactionsScreen extends StatelessWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // View dispatches an intent and renders emitted state snapshots.
    return BlocBuilder<TransactionsBloc, TransactionsState>(
      builder: (context, state) => Column(
        children: [
          TextButton(
            onPressed: () => context.read<TransactionsBloc>().add(
              const TransactionsRequested(),
            ),
            child: const Text('Refresh'),
          ),
          Expanded(child: TransactionsBody(state: state)),
        ],
      ),
    );
  }
}
```

The view dispatches an event and renders the emitted state. Bloc can support MVI without enforcing a strict implementation. [6](https://hannesdorfmann.com/android/mosby3-mvi-1/) [7](https://bloclibrary.dev/bloc-concepts/) [8](https://redux.js.org/understanding/thinking-in-redux/three-principles)

![A unidirectional flow loop: widgets send an input to a state owner; the owner requests data from a repository, receives a result, and publishes state back to widgets.](/blog/flutter-presentation-architecture-vs-state-management/06_state_flow.png)

*Figure 2. The general input-to-state loop is especially visible in MVVM and MVI-style implementations. The architectural difference is the contract around that loop—methods and observed ViewModel state, for example, versus explicit intents and state transitions. Arrows describe runtime communication, not necessarily code dependencies.*

## 3. A more useful comparison

These are common interpretations, not exclusive compatibility rules. The Flutter tradeoffs below are engineering judgments derived from the responsibilities each pattern introduces.

| Pattern | Primary relationship                                                | Practical Flutter tradeoff                                                                          |
|---------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| MVC     | Controller handles input; model changes can notify views.           | Viable with clear responsibilities; agree on the MVC variant because the label is ambiguous.        |
| MVP     | Presenter coordinates behavior through a view contract.             | Explicit interactions are testable; contract size and view lifecycle require care.                  |
| MVVM    | View observes presentation state and invokes ViewModel actions.     | Fits state-driven widgets well; prevent the ViewModel from absorbing every business responsibility. |
| MVI     | Inputs lead to controlled transitions and rendered state snapshots. | Useful for reasoning about interacting events; requires clear concurrency and effect policies.      |

Package choices are similarly flexible:

- **Provider + ChangeNotifier:** the notifier owns change notifications; Provider exposes objects, manages their scoped lifecycle, and supports consumption. This is a common MVVM implementation, not a complete architecture by itself. [9](https://pub.dev/packages/provider)
- **Riverpod:** providers offer reactive dependencies, cached values, and lifecycle facilities. A `Notifier` or `AsyncNotifier` can play the ViewModel role, but Riverpod does not require the application to use that label or follow MVVM. [10](https://riverpod.dev/docs/concepts2/providers)
- **Bloc/Cubit:** both expose state; their input APIs differ. Either can occupy the presentation-logic boundary. Choosing Bloc for event processing does not settle repository ownership. [7](https://bloclibrary.dev/bloc-concepts/)
- **MobX:** observables, actions, computed values, and reactions form its core model. Those can support a reactive presentation model. Calling MobX a standard MVI pairing is misleading: it does not inherently require a single immutable screen-state object. [11](https://mobx.netlify.app/concepts)
- **GetX:** `Obx` observes reactive values, while `GetBuilder` responds to explicit `update()` calls. A `GetxController` can fill a ViewModel-like role, but its class name alone establishes no architectural boundary. The wider package also includes routing and dependency facilities. [12](https://github.com/jonataslaw/getx/blob/master/documentation/en_US/state_management.md)[13](https://github.com/jonataslaw/getx)

------------------------------------------------------------------------

### Sources

Technical sources checked on November 11, 2026. The comparisons and selection advice are the author’s engineering synthesis; the links below support the underlying framework and package behavior.

1.  [Flutter — Guide to app architecture](https://docs.flutter.dev/app-architecture/guide)
2.  [Martin Fowler — GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html)
3.  [Martin Fowler — Passive View](https://martinfowler.com/eaaDev/PassiveScreen.html)
4.  [Flutter — Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations)
5.  [Flutter — Common architecture concepts](https://docs.flutter.dev/app-architecture/concepts)
6.  [Hannes Dorfmann — Reactive Apps with Model-View-Intent, Part 1](https://hannesdorfmann.com/android/mosby3-mvi-1/)
7.  [Bloc — Core concepts](https://bloclibrary.dev/bloc-concepts/)
8.  [Redux — Three principles](https://redux.js.org/understanding/thinking-in-redux/three-principles)
9.  [Provider — Package documentation](https://pub.dev/packages/provider)
10. [Riverpod — Providers](https://riverpod.dev/docs/concepts2/providers)
11. [MobX.dart — Core concepts](https://mobx.netlify.app/concepts)
12. [GetX — State management documentation](https://github.com/jonataslaw/getx/blob/master/documentation/en_US/state_management.md)
13. [GetX — Official repository and package overview](https://github.com/jonataslaw/getx)
