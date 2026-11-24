Deslizás para actualizar la app del banco justo cuando el tren entra en un túnel. El café que pagaste hace un rato desaparece de la pantalla. *Todavía no hay movimientos*, dice la app.

En algún lugar de la capa de datos, un `catch (_) { return []; }` convirtió una petición fallida en una respuesta vacía exitosa. Cuando Flutter llama a `build()`, el widget ya perdió el dato que necesitaba para distinguir qué pasó.

Sigamos ese café por el historial de una cuenta en dólares. La pantalla consulta movimientos contabilizados, guarda una copia en el teléfono y permite ordenarlos de dos maneras. **Adapter, Repository, Strategy y Observer** resuelven problemas distintos en esa funcionalidad.

## Adapter le da el signo correcto a un débito

El sistema bancario heredado envía el café como `425` centavos con un indicador de débito. La app lo representa como `-425` centavos. La fecha llega en segundos y el constructor de Dart espera milisegundos. Si salteamos la conversión, el café de esta mañana puede terminar en 1970.

Un **Adapter** permite que la app use la interfaz que espera. Acá, `TransactionSource.fetch(accountId)` devuelve movimientos con el modelo de la aplicación. El único que necesita conocer el formato del sistema heredado es el adaptador.

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

Si mañana el sistema empieza a enviar importes con signo, alcanza con revisar esa conversión. Flutter aplica la misma idea al layout. Un widget convencional puede ocupar un lugar entre los slivers de un `CustomScrollView` mediante [SliverToBoxAdapter][sliver].

## Repository decide qué queda visible al perder la conexión

El modelo de vista llama a `repository.load(accountId)`. El **Repository** decide con qué datos responder. Cuando hay un resultado, incluye los movimientos, la hora de la última consulta exitosa y un indicador de si esta lectura salió de la caché. Flutter ubica esa responsabilidad en la capa de datos y describe varias formas de leer la copia local. [Guía de arquitectura][architecture] · [Soporte sin conexión][offline]

![Una consulta exitosa reemplaza la copia guardada de la cuenta, aunque tenga cero movimientos. Sin conexión, se muestra la copia con su hora original. Si no hay copia, se ofrece reintentar.](/blog/flutter-design-patterns/refresh-es.png)

La última consulta exitosa fue a las **09:15**. El teléfono pierde señal a las 09:18. El café sigue ahí, con la leyenda *Última actualización 09:15*. Mostrar las 09:18 sugeriría que el banco acaba de confirmar el movimiento.

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

Una copia con cero movimientos sigue siendo válida. Un error al decodificar la respuesta tiene su propio tratamiento. La app recurre a la caché únicamente ante una falla de conectividad.

## Strategy permite ordenar sin volver a consultar

El café es la compra más reciente. El gasto en la librería es el de mayor importe. Al tocar *Mayor importe*, la librería debería subir al primer puesto incluso dentro del túnel. Como esta cuenta opera en una sola moneda, comparamos el importe absoluto. Un reintegro también puede aparecer primero.

Una **Strategy** es una regla intercambiable. El tipo `Comparator<Entry>` de Dart ya tiene la firma que necesitamos. El modelo de vista le pasa a `ordered` la función elegida. [Patrón Strategy][strategy]

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

![La copia de las 09:15 muestra Café por −$4,25, Librería por −$32,00 y Reintegro por +$18,00, del más reciente al más antiguo. Por importe quedan Librería, Reintegro y Café.](/blog/flutter-design-patterns/sort-es.png)

`sort` modifica la lista que recibe. Por eso el código ordena una copia. Dart también permite que los elementos empatados cambien de posición relativa. Desempatar por fecha y después por un identificador único le da a cada movimiento un lugar predecible. [Documentación de List.sort][sort]

## Observer mantiene actualizado el widget

Tanto una actualización como un cambio de orden pueden modificar lo que ves. El modelo de vista conserva el comparador elegido y lo vuelve a aplicar cuando llegan movimientos nuevos. Publica cada resultado mediante un `ValueNotifier<FeedState>` y expone a la vista un `ValueListenable<FeedState>` de solo lectura.

Esa suscripción es el patrón **Observer**. El modelo puede publicar un estado sin saber qué widget lo está escuchando. Al definir `FeedState` como una clase sellada de Dart, el widget también queda obligado a contemplar todos los casos.

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

Un `FeedReady` vacío puede mostrar *Todavía no hay movimientos*. `FeedUnavailable` permite reintentar. `ValueNotifier` compara los valores al asignarlos. Modificar una lista dentro del estado existente saltea esa comparación. Asigná un estado distinto con los movimientos reordenados y el builder recibirá la actualización. [ValueNotifier][notifier] · [ValueListenableBuilder][builder]

## Dos pruebas que conservaría

- **Actualizá la misma cuenta dos veces.** Partí de una copia de las 09:15 que incluya el café. Simulá una falla de conexión y verificá que se conserven el café y las 09:15. Después devolvé una lista vacía exitosa y verificá que el café desaparezca de la pantalla y de la caché.
- **Cambiá el orden dentro del túnel.** Con los tres movimientos guardados, elegí *Mayor importe*. Verificá que la librería suba al primer puesto, que la hora siga siendo 09:15 y que el contador de llamadas al servidor quede igual.

Si la pantalla solo ofreciera el orden por fecha, dejaría la comparación junto a la lista. Igual conservaría la primera prueba. Quien viaja debería poder llegar a destino con el cargo del café todavía a la vista.

[sliver]: https://api.flutter.dev/flutter/widgets/SliverToBoxAdapter-class.html
[architecture]: https://docs.flutter.dev/app-architecture/guide
[offline]: https://docs.flutter.dev/app-architecture/design-patterns/offline-first
[strategy]: https://refactoring.guru/design-patterns/strategy
[sort]: https://api.dart.dev/dart-core/List/sort.html
[notifier]: https://api.flutter.dev/flutter/package-listen_listen/ValueNotifier-class.html
[builder]: https://api.flutter.dev/flutter/widgets/ValueListenableBuilder-class.html
