*Cómo encajan MVC, MVP, MVVM, MVI y la gestión de estado—y cómo elegir límites que sobrevivan un cambio de paquete.*

“Usamos BLoC.”

Eso es información útil en una discusión de arquitectura. Dice algo sobre cómo el equipo representa cambios y entrega estado a los widgets. Deja varias preguntas abiertas:

- ¿Quién es dueño de los datos de la aplicación?
- ¿Dónde viven las reglas de negocio reutilizables?
- ¿Cómo se comunican las features?
- ¿Qué ocurre cuando dos requests terminan fuera de orden?

Las discusiones de Flutter suelen comprimir estas decisiones en una sola elección: Provider, Riverpod, BLoC, MobX o GetX. Eso facilita comparar paquetes, pero hace menos precisas las conversaciones de diseño.

Arquitectura y gestión de estado son preocupaciones distintas con un solapamiento real. Un paquete aporta mecanismos y puede incentivar una estructura. La aplicación sigue necesitando responsabilidades, dependencias y reglas de ownership explícitas.

## 1. Separar cuatro decisiones de diseño

Antes de elegir un paquete, separa las preguntas que tu diseño debe responder.

| Decisión                  | Pregunta                                                            | Ejemplos                                               |
|---------------------------|---------------------------------------------------------------------|--------------------------------------------------------|
| Arquitectura de aplicación | ¿Dónde viven las responsabilidades y qué dependencias están permitidas? | Capas UI/datos, repositorios, lógica de dominio opcional |
| Arquitectura de presentación | ¿Cómo colaboran la UI y la lógica de presentación?                | MVC, MVP, MVVM, MVI                                    |
| Mecanismos de estado      | ¿Cómo se almacena, cambia, observa y dispone el estado?             | ChangeNotifier, Riverpod, Bloc/Cubit, MobX             |
| Organización del código   | ¿Cómo se agrupa y se posee la implementación?                       | Carpetas por feature, paquetes, módulos independientes |

Esta es una taxonomía práctica, no un estándar universal. En particular, MVC y sus parientes describen sobre todo relaciones de presentación; sus nombres no resuelven cada dependencia de toda la aplicación.

Un proyecto orientado a features puede usar MVVM en la capa de presentación, Riverpod para estado y acceso a dependencias, y repositorios detrás de interfaces estables. Otro proyecto puede conservar los mismos límites de feature y usar BLoC.

La guía de arquitectura de Flutter ofrece un punto de partida concreto: views y view models en la capa UI, repositorios y servicios en la capa de datos, con una capa de dominio cuando su complejidad lo justifica. Trátalo como un diseño a adaptar, no como una estructura de carpetas a copiar mecánicamente. [1](https://docs.flutter.dev/app-architecture/guide)

![Diagrama de dependencias con una vista, un dueño de estado de presentación, un caso de uso opcional, un contrato de repositorio y un repositorio concreto conectado a una fuente de datos.](/blog/flutter-presentation-architecture-vs-state-management/01_boundaries.png)

*Figura 1. Un posible diseño de dependencias. Las flechas sólidas significan “depende de”; la flecha discontinua significa “implementa.” Una feature puede usar un repositorio directamente, a través de un caso de uso, o ambos. La composition root de la aplicación conecta el contrato con su implementación. Es un diseño ilustrativo, no una plantilla obligatoria de Flutter.*

La prueba útil es concreta: ¿podrías reemplazar la fuente de datos remota sin reescribir la lógica de presentación de la pantalla? ¿Podrías testear esa lógica con un repositorio falso? Esas preguntas revelan más que el nombre del paquete de estado.

## 2. Cómo se ve cada arquitectura de presentación en Flutter

La forma más útil de comparar MVC, MVP, MVVM y MVI es seguir una interacción: el usuario toca **Refresh** en una pantalla de historial de transacciones. ¿Qué componente recibe el input? ¿Quién pide datos al repositorio? ¿Quién es dueño del estado que renderiza la pantalla? ¿Y cómo se entera la vista de que algo cambió?

El patrón de presentación define esas relaciones. Un mecanismo de state management implementa las notificaciones, suscripciones o transiciones de estado dentro de ellas. El mismo árbol de widgets de Flutter puede participar en diseños muy distintos.

### MVC — el controller maneja el input; la vista observa el modelo

![Interacción MVC: el usuario dispara la vista, la vista llama a un controller, el controller invoca el modelo observable, el modelo pide al repositorio y la vista observa el estado del modelo.](/blog/flutter-presentation-architecture-vs-state-management/02_mvc.png)

*MVC: el controller maneja el input mientras la vista observa cambios en el modelo.*

- **View:** `TransactionsScreen` renderiza los datos actuales del modelo y reenvía interacciones.
- **Controller:** `TransactionsController.refresh()` interpreta el input y le dice al modelo qué hacer.
- **Model:** un `TransactionsModel` observable guarda los datos o el estado orientado a pantalla que leen las vistas.
- **Cableado posible en Flutter:** el modelo expone un `ValueNotifier`, `ChangeNotifier` o `stream`; la vista usa `ValueListenableBuilder`, `Provider` o `StreamBuilder` para observarlo.

**MVC usando ValueNotifier**

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

La vista observa `model.state`; `controller.refresh()` pide datos. El controller no necesita actualizar widgets directamente. [2](https://martinfowler.com/eaaDev/uiArchs.html)

### MVP — el presenter dirige un contrato de vista

![Interacción MVP: el usuario dispara la vista, la vista llama al presenter, el presenter pide al repositorio y llama render con estado a través del contrato de vista.](/blog/flutter-presentation-architecture-vs-state-management/03_mvp.png)

*MVP: el presenter coordina la interacción y actualiza la vista a través de su contrato.*

- **View:** `TransactionsScreen` implementa una interfaz pequeña `TransactionsView`, por ejemplo `render(TransactionsState state)`.
- **Presenter:** `TransactionsPresenter.refresh()` coordina la presentación y llama al contrato de vista cuando cambia el estado.
- **Entrega de estado:** el adaptador del widget puede guardar el estado recibido y llamar `setState`; también puede adaptar el contrato a un notifier o stream.
- **Cableado posible en Flutter:** `setState` alcanza para el adaptador; Provider puede construir y delimitar el presenter, pero no reemplaza el contrato explícito de vista.

**MVP usando setState**

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

El presenter llama `render`; la vista actualiza su estado. Desconecta la vista cuando se dispone. [3](https://martinfowler.com/eaaDev/PassiveScreen.html)

### MVVM — la vista observa el estado expuesto por un ViewModel

![Interacción MVVM: el usuario dispara la vista, la vista invoca el ViewModel, el ViewModel pide al repositorio y la vista observa el estado del ViewModel.](/blog/flutter-presentation-architecture-vs-state-management/04_mvvm.png)

*MVVM: la vista llama al ViewModel y observa el estado de presentación que expone.*

- **View:** `TransactionsScreen` lee el estado de presentación y llama acciones como `viewModel.load()`.
- **ViewModel:** `TransactionsViewModel` es dueño del estado de pantalla y coordina carga, mapeo y manejo de errores.
- **Entrega de estado:** el ViewModel publica cambios; la vista se suscribe y reconstruye los widgets relevantes.
- **Cableado posible en Flutter:** `ChangeNotifier` con Provider, un `Notifier`/`AsyncNotifier` de Riverpod, un Cubit como ViewModel, u observables de MobX con `Observer`.

**MVVM usando Riverpod**

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

`ref.watch` observa el estado; `load()` llama al ViewModel. MVVM también admite flujo unidireccional de datos. [4](https://docs.flutter.dev/app-architecture/recommendations) [5](https://docs.flutter.dev/app-architecture/concepts)

### MVI — la vista envía intents y renderiza snapshots de estado

![Interacción inspirada en MVI: el usuario dispara la vista, la vista envía un intent o evento a un procesador de estado, el procesador pide al repositorio y publica el siguiente estado a la vista.](/blog/flutter-presentation-architecture-vs-state-management/05_mvi.png)

*MVI: la vista envía un intent y renderiza el snapshot resultante del estado de la feature.*

- **View:** `TransactionsScreen` despacha un intent como `TransactionsRequested` y renderiza un snapshot de estado de feature.
- **Procesador de estado:** un event handler, update function o reducer traduce inputs y resultados al siguiente estado.
- **Entrega de estado:** los suscriptores observan un único modelo inmutable de la feature. Un refresh pone `status` en `loading` y conserva los `items` actuales; `ready` y `failure` reemplazan o retienen esa lista de forma explícita.
- **Cableado posible en Flutter:** eventos de Bloc más `BlocBuilder`, o acciones/reducers de Redux más un store connector. Un notifier de Riverpod también puede seguir un diseño basado en intents si el equipo aplica esa disciplina de forma explícita.

**MVI usando Bloc**

```dart
sealed class TransactionsEvent {
  const TransactionsEvent();
}

final class TransactionsRequested extends TransactionsEvent {
  const TransactionsRequested();
}

enum TransactionsStatus { initial, loading, ready, failure }

class TransactionsState {
  const TransactionsState({
    this.status = TransactionsStatus.initial,
    this.items = const [],
    this.error,
  });

  final TransactionsStatus status;
  final List<Transaction> items;
  final Object? error;
}

class TransactionsBloc extends Bloc<TransactionsEvent, TransactionsState> {
  TransactionsBloc(this._repo) : super(const TransactionsState()) {
    on<TransactionsRequested>(
      _onRequested,
      transformer: restartable(),
    );
  }

  final TransactionsRepository _repo;

  Future<void> _onRequested(
    TransactionsRequested event,
    Emitter<TransactionsState> emit,
  ) async {
    // Keep the previous rows; loading is a field of the same model.
    emit(TransactionsState(
      status: TransactionsStatus.loading,
      items: state.items,
    ));
    try {
      final items = await _repo.fetch();
      emit(TransactionsState(
        status: TransactionsStatus.ready,
        items: items,
      ));
    } catch (error) {
      emit(TransactionsState(
        status: TransactionsStatus.failure,
        items: state.items,
        error: error,
      ));
    }
  }
}

class TransactionsScreen extends StatelessWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // View dispatches an intent and renders the feature-state model.
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

La vista agrega `TransactionsRequested` y renderiza `TransactionsState`. Loading y failure copian los `items` previos, así que el refresh sigue siendo un solo modelo. `restartable`, de `package:bloc_concurrency`, es la política de concurrencia de este intent: solo el refresh más reciente puede emitir. Bloc puede alojar ese contrato; el intent sellado, el modelo único y el transformer son lo que hace que el ejemplo sea MVI. [6](https://hannesdorfmann.com/android/mosby3-mvi-1/) [7](https://bloclibrary.dev/bloc-concepts/) [8](https://redux.js.org/understanding/thinking-in-redux/three-principles)

![Un bucle de flujo unidireccional: los widgets envían un input a un dueño de estado; el dueño pide datos a un repositorio, recibe un resultado y publica estado de vuelta a los widgets.](/blog/flutter-presentation-architecture-vs-state-management/06_state_flow.png)

*Figura 2. El bucle general de input-a-estado es especialmente visible en implementaciones estilo MVVM y MVI. La diferencia arquitectónica es el contrato alrededor de ese bucle—métodos y estado observado del ViewModel, por ejemplo, versus intents explícitos y transiciones de estado. Las flechas describen comunicación en runtime, no necesariamente dependencias de código.*

## 3. Una comparación más útil

Estas son interpretaciones comunes, no reglas exclusivas de compatibilidad. Los tradeoffs de Flutter abajo son juicios de ingeniería derivados de las responsabilidades que introduce cada patrón.

| Patrón | Relación principal                                                  | Tradeoff práctico en Flutter                                                                        |
|--------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| MVC    | El controller maneja el input; los cambios del modelo pueden notificar vistas. | Viable con responsabilidades claras; acuerden la variante de MVC porque la etiqueta es ambigua. |
| MVP    | El presenter coordina el comportamiento a través de un contrato de vista. | Interacciones explícitas y testeables; el tamaño del contrato y el lifecycle de la vista requieren cuidado. |
| MVVM   | La vista observa estado de presentación e invoca acciones del ViewModel. | Encaja bien con widgets driven by state; evita que el ViewModel absorba toda responsabilidad de negocio. |
| MVI    | Los inputs llevan a transiciones controladas y snapshots de estado renderizados. | Útil para razonar sobre eventos que interactúan; exige políticas claras de concurrencia y efectos. |

Las elecciones de paquete son igual de flexibles:

- **Provider + ChangeNotifier:** el notifier es dueño de las notificaciones de cambio; Provider expone objetos, gestiona su lifecycle acotado y soporta el consumo. Es una implementación común de MVVM, no una arquitectura completa por sí sola. [9](https://pub.dev/packages/provider)
- **Riverpod:** los providers ofrecen dependencias reactivas, valores en caché y facilidades de lifecycle. Un `Notifier` o `AsyncNotifier` puede ocupar el rol de ViewModel, pero Riverpod no exige que la aplicación use esa etiqueta ni siga MVVM. [10](https://riverpod.dev/docs/concepts2/providers)
- **Bloc/Cubit:** ambos exponen estado; sus APIs de input difieren. Cualquiera puede ocupar el límite de lógica de presentación. Elegir Bloc para procesar eventos no resuelve el ownership del repositorio. [7](https://bloclibrary.dev/bloc-concepts/)
- **MobX:** observables, actions, computed values y reactions forman su modelo central. Pueden soportar un modelo de presentación reactivo. Llamar a MobX un pairing MVI estándar es engañoso: no exige por sí un único objeto inmutable de estado de pantalla. [11](https://mobx.netlify.app/concepts)
- **GetX:** `Obx` observa valores reactivos, mientras `GetBuilder` responde a llamadas explícitas a `update()`. Un `GetxController` puede llenar un rol tipo ViewModel, pero su nombre de clase no establece por sí un límite arquitectónico. El paquete más amplio también incluye routing y dependencias. [12](https://github.com/jonataslaw/getx/blob/master/documentation/en_US/state_management.md)[13](https://github.com/jonataslaw/getx)

------------------------------------------------------------------------

### Fuentes

Fuentes técnicas revisadas el 11 de noviembre de 2026. Las comparaciones y el consejo de selección son la síntesis de ingeniería del autor; los enlaces abajo respaldan el comportamiento del framework y de los paquetes.

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
