Cuando una aplicación Flutter crece, más features y equipos comparten el mismo código. Un cambio en Accounts puede afectar a Transfers, y probar un flujo puede exigir recorrer toda la aplicación y reproducir un estado específico.

La **arquitectura modular** le da a cada feature un límite claro. Los equipos desarrollan **micro apps** autocontenidas y el **App Shell** las ensambla en un solo producto. La idea comparte la separación de responsabilidades de los micro frontends web; aquí, los módulos se empaquetan en la misma aplicación y comparten la resolución de dependencias y el build nativo.

La independencia también requiere colaboración: Transfers puede necesitar datos de Accounts, mientras ambos usan el mismo design system, contexto de autenticación y analytics. Esas relaciones necesitan contratos explícitos.

El enfoque separa **lo que un módulo necesita** de **cómo se lo provee la aplicación**: Foundations define contratos y UI compartida, Core los implementa y los hosts los configuran. Así, las features colaboran sin importar las implementaciones de las demás.

## La arquitectura

![Diagrama de arquitectura modular en Flutter: el App Shell y los ejemplos inicializan Core y alojan micro apps; las micro apps dependen de Foundations; Core implementa abstracciones y usa paquetes y SDKs de terceros.](/blog/modular-flutter-architecture/architecture.jpg)

Las flechas muestran las **dependencias entre paquetes**: el App Shell y los ejemplos alojan micro apps e inicializan Core; las micro apps dependen de Foundations; Core implementa sus abstracciones. Las tres responsabilidades de Foundations pertenecen al mismo paquete, no a paquetes de implementación adicionales.

**El límite clave:** una micro app conoce las capacidades que consume, sin conocer el SDK o la implementación concreta que las provee.

## Desglose de componentes

![Sección 01 — App Shell: ensamblar módulos y orquestar la experiencia del producto.](/blog/modular-flutter-architecture/01-app-shell.jpg)

El **App Shell** es la aplicación padre y el **composition root**: el lugar donde se seleccionan las implementaciones y se conectan con sus consumidores. Ensambla las micro apps, coordina el arranque y orquesta la navegación y los recorridos entre features.

Ejecuta el **bootstrap de Core** para development, staging o production, y deja disponible la comunicación antes de inicializar los módulos. Cada micro app registra entonces sus handlers y factories de widgets. El shell coordina el ciclo de vida; las features conservan la propiedad del comportamiento y de la UI que exponen.

![Sección 02 — Micro Apps: ser dueñas de una feature y mantener un límite claro.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

Una **micro app** es dueña de una capacidad de negocio, como Accounts o Transfers: presentación, lógica y modelos internos. Expone rutas, localization delegates, hooks de inicialización y registro de endpoints para integrarse con el shell.

Los paquetes de feature dependen de **Foundations**, sin importar Core ni implementaciones de otras micro apps. Cada equipo puede desarrollar y probar por separado, eligiendo su arquitectura interna y su state management. Estos límites complementan la [separación de UI, datos y responsabilidades de negocio de Flutter](https://docs.flutter.dev/app-architecture/recommendations).

![Sección 03 — Ejemplos de micro app: ejecutar una feature y reproducir flujos difíciles de alcanzar.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

Cada micro app tiene un **ejemplo independiente**: un host pequeño que inicializa Core, selecciona dependencias y monta la feature. Permite abrir pantallas y reproducir escenarios que, en la aplicación completa, exigirían feature flags o recorridos complejos.

Los ejemplos pueden componer otros módulos, como Authentication y Accounts, para probar requests autenticados. Esas dependencias pertenecen al host; el paquete de la feature conserva su límite.

Reutilizan el **mismo Core y los mismos adaptadores de SDK** que el App Shell. La configuración permite usar analytics y crash reporting de consola o no-op, evitando inicializaciones innecesarias durante las pruebas manuales y manteniendo representativo el resto del entorno.

![Sección 04 — Foundations: contratos compartidos y un lenguaje visual común.](/blog/modular-flutter-architecture/04-foundations.jpg)

**Foundations** aporta contratos propios de la aplicación mediante **abstracciones**, el **Design System** integrado y el contrato **InterModuleCommunication**. El contexto de autenticación y los permisos tienen contratos explícitos y fuertemente tipados; los modelos específicos permanecen en sus módulos.

Una respuesta de Accounts puede evolucionar sin trasladar sus modelos a Foundations. Como todos los consumidores dependen de este paquete, su **superficie pública debe ser estable y deliberada**.

![Sección 05 — Abstractions: ser dueñas del contrato y elegir la implementación.](/blog/modular-flutter-architecture/05-abstractions.jpg)

Una **abstracción** describe capacidades como analytics, almacenamiento, información de la aplicación, cámara o navegación en el lenguaje de la aplicación, sin exponer APIs de proveedores a cada feature.

Por ejemplo, **AppInfo** expone la versión de la app y un adaptador de Core la obtiene con [package_info_plus](https://pub.dev/packages/package_info_plus). El host inyecta implementaciones y los tests pueden inyectar fakes: la **inversión de control** concentra el impacto de reemplazar un SDK en su adaptador, siempre que el contrato siga siendo compatible.

Conviene aplicar estos límites de forma selectiva. Envolver cada widget de Flutter o reproducir toda la API de Riverpod o BLoC agrega mantenimiento sin necesariamente proteger una capacidad significativa.

![Sección 06 — Design System: componentes consistentes y themes flexibles.](/blog/modular-flutter-architecture/06-design-system.jpg)

El **Design System** aporta componentes reutilizables, themes, tipografía, espaciado y design tokens desde Foundations.

Los **tokens primitivos** contienen valores base, como una paleta de colores; los **tokens semánticos** expresan intención, como el fondo de un error o una acción principal. Los componentes consumen esos roles para cambiar de theme o marca mediante una configuración consistente.

Atoms, molecules, organisms y templates pueden organizar el crecimiento del sistema. Los componentes compartidos incorporan **accesibilidad y comportamiento de interacción** para mantener una experiencia coherente entre features.

![Sección 07 — Comunicación entre módulos: registrar capacidades y solicitar datos o widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

**InterModuleCommunication conecta micro apps aisladas mediante contratos públicos explícitos.** Transfers puede solicitar datos de Accounts sin importar su implementación; Accounts conserva el control de cómo resuelve la petición y devuelve el resultado acordado.

La interacción tiene tres pasos:

1. **Registrar:** durante el bootstrap, el proveedor declara un endpoint versionado, sus parámetros requeridos y un handler.
2. **Solicitar:** el consumidor envía el endpoint y los parámetros mediante la abstracción de Foundations.
3. **Despachar:** Core localiza el handler, comprueba los parámetros requeridos y devuelve el resultado en una respuesta común.

Dos métodos permiten colaborar: **`request`** obtiene datos o ejecuta una operación propia de una feature; **`getWidget`** obtiene UI lista para usar, provista y mantenida por otro equipo.

Un **Home federado** solicita el banner de Cards en `/cards/v1/home-banner`. Cards es responsable de su comportamiento, carga de datos e interacciones; Home decide dónde ubicarlo y qué fallback mostrar, sin importar la clase concreta del banner.

![Home federado: micro apps independientes componen una sola experiencia; Home obtiene el banner de Cards mediante InterModuleCommunication en `/cards/v1/home-banner`.](/blog/modular-flutter-architecture/federated-home.jpg)

Ambos métodos reciben un **`InterModuleEndpoint`** y devuelven un **`InterModuleCommunicationResponse<T>`** con resultados explícitos. Los ejemplos independientes pueden registrar stubs compatibles para ejercitar al consumidor por separado.

El aislamiento está en los **paquetes y las implementaciones**: la comunicación ocurre **dentro del mismo proceso**, en una sola aplicación. Los equipos coordinan parámetros, resultados y versiones de los endpoints mientras evolucionan sus implementaciones independientemente. El contexto compartido de sesión o del usuario actual pertenece a abstracciones dedicadas de Foundations.

InterModuleCommunication es un nombre descriptivo para una abstracción propia de la aplicación.

![Sección 08 — Core Package: adaptadores compartidos y bootstrap configurable.](/blog/modular-flutter-architecture/08-core-package.jpg)

**Core** implementa los contratos de Foundations mediante adaptadores de SDK, registros de comunicación y lógica compartida de inicialización. El App Shell y los ejemplos ejecutan su bootstrap configurable; los paquetes de feature no lo inicializan por su cuenta.

Los registros separados de handlers y factories de widgets usan URLs como claves y rechazan duplicados dentro de cada registro. Core resuelve la URL, comprueba los parámetros requeridos del proveedor y después invoca el handler o la factory. El proveedor valida tipos, formatos y reglas de negocio; la tabla de estados detalla cada resultado.

Core convierte las excepciones inesperadas de handlers o factories en **respuestas `500`**, conservando los detalles en el diagnóstico interno. Los errores posteriores, durante el build o la carga asíncrona de un widget devuelto, son responsabilidad del componente. Las features aportan handlers y factories; Core administra el dispatch.

![Sección 09 — Paquetes y SDK de terceros: reutilizar adaptadores y mantener alineadas las versiones de dependencias.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

Los paquetes externos quedan detrás de los **adaptadores de Core** para las capacidades abstraídas. Reutilizar adaptadores evita mantener implementaciones divergentes, pero no garantiza versiones de dependencias idénticas.

Un [**workspace de Dart Pub**](https://dart.dev/tools/pub/workspaces) proporciona al shell y a los ejemplos **una resolución de dependencias y un lockfile compartidos**. La configuración del build nativo y las dependencias de plataforma siguen requiriendo coordinación y controles de integración.

## La comunicación entre módulos, en la práctica

Micro App B es dueña de `/module-b/v1/details`, del significado de `id` y del esquema de respuesta. Estos fragmentos ilustrativos de Dart muestran el contrato compartido, una petición desde Micro App A y un banner de Cards. Se omiten la implementación de Core y el arranque de Flutter.

### Definir el contrato en Foundations

**`InterModuleEndpoint`** agrupa la URL, los parámetros de la llamada y los nombres de parámetros requeridos declarados al registrarse. La URL es una **clave del registro dentro del proceso**. Core usa la declaración almacenada del proveedor, así que el consumidor no puede omitirla para evitar la validación. Los esquemas usan valores primitivos, listas y mapas en lugar de objetos propios del proveedor.

La **respuesta genérica** conserva el tipo del resultado: un mapa de datos o un widget de Flutter. Foundations no define el modelo de negocio del módulo B ni la clase del banner de Cards.

```dart
import 'package:flutter/widgets.dart';

class InterModuleEndpoint {
  const InterModuleEndpoint({
    required this.url,
    this.parameters = const {},
    this.requiredParameters = const {},
  });

  final String url;
  final Map<String, Object?> parameters;
  final Set<String> requiredParameters;
}

class InterModuleCommunicationResponse<T> {
  const InterModuleCommunicationResponse({
    required this.statusCode,
    this.data,
    this.errorCode,
  });

  final int statusCode;
  final T? data;
  final String? errorCode;

  bool get isSuccess => statusCode >= 200 && statusCode < 300;
}

typedef InterModuleHandler
    = Future<InterModuleCommunicationResponse<Map<String, Object?>>>
        Function(Map<String, Object?> parameters);

typedef InterModuleWidgetFactory
    = InterModuleCommunicationResponse<Widget> Function(
        Map<String, Object?> parameters,
      );

abstract class InterModuleCommunication {
  // Assigned by the host through Core's bootstrap, before modules start.
  static late InterModuleCommunication instance;

  void register({
    required InterModuleEndpoint endpoint,
    required InterModuleHandler handler,
  });

  Future<InterModuleCommunicationResponse<Map<String, Object?>>> request({
    required InterModuleEndpoint endpoint,
  });

  void registerWidget({
    required InterModuleEndpoint endpoint,
    required InterModuleWidgetFactory factory,
  });

  InterModuleCommunicationResponse<Widget> getWidget({
    required InterModuleEndpoint endpoint,
  });
}
```

Los parámetros requeridos ausentes o null producen **`400`**, `missing_required_parameters` y ningún dato antes de llamar al proveedor. Un string vacío requiere validación del proveedor. Las respuestas **`200`** de estos ejemplos incluyen datos no nulos.

El **accessor `.instance`** mantiene breve el ejemplo. La inyección por constructor hace explícitas las dependencias y facilita aislar los tests; el singleton es opcional.

### Registrar el endpoint dentro de Micro App B

El bootstrap del módulo B registra su handler en Core antes de habilitar los flujos que dependen de él:

```dart
void registerModuleBEndpoints(InterModuleCommunication communication) {
  communication.register(
    endpoint: const InterModuleEndpoint(
      url: '/module-b/v1/details',
      requiredParameters: {'id'},
    ),
    handler: (parameters) async {
      final id = parameters['id'];

      if (id is! String || id.trim().isEmpty) {
        return const InterModuleCommunicationResponse<Map<String, Object?>>(
          statusCode: 400,
          errorCode: 'invalid_id',
        );
      }

      // Sample data for the article. A real handler calls Module B's
      // use case or repository and maps its result to this public schema.
      if (id != '123') {
        return const InterModuleCommunicationResponse<Map<String, Object?>>(
          statusCode: 404,
          errorCode: 'details_not_found',
        );
      }

      return InterModuleCommunicationResponse<Map<String, Object?>>(
        statusCode: 200,
        data: {'id': id, 'name': 'Example details'},
      );
    },
  );
}
```

Los hosts independientes invocan el bootstrap del módulo B o registran un **stub compatible** para ese endpoint.

### Hacer el request desde Micro App A

```dart
Future<String> loadModuleBDetails() async {
  final response = await InterModuleCommunication.instance.request(
    endpoint: const InterModuleEndpoint(
      url: '/module-b/v1/details',
      parameters: {'id': '123'},
    ),
  );

  // The declared return type makes response an
  // InterModuleCommunicationResponse<Map<String, Object?>>.
  if (response.statusCode == 200) {
    final name = response.data?['name'];
    return name is String ? name : 'Unexpected response format';
  }

  if (response.statusCode == 400) {
    return 'A valid id is required to load details.';
  }

  if (response.statusCode == 404) {
    return response.errorCode == 'endpoint_not_registered'
        ? 'This feature is unavailable in this application.'
        : 'The requested details were not found.';
  }

  return 'Unable to load details. Please try again.';
}
```

Micro App A importa **Foundations** y conoce el esquema publicado, sin importar el módulo B ni saber cómo Core encuentra el handler. Una feature real puede convertir estos resultados en su propio estado y en UI localizada.

### Darle un significado claro a cada resultado

Ambos métodos toman los significados de los [**códigos de estado HTTP**](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) para una **API dentro del proceso**. Son estados de la aplicación, no respuestas HTTP reales:

| Status | Significado | Lo produce |
| --- | --- | --- |
| **`200`** | Éxito; `data` contiene el mapa de resultados o el widget. | El proveedor. |
| **`400`** | Parámetros requeridos ausentes/null (`missing_required_parameters`) o valores inválidos (`invalid_id`, `invalid_card_id`). | Core comprueba presencia; el proveedor valida valores. |
| **`404`** | Endpoint sin registrar (`endpoint_not_registered`) o ítem inexistente; `errorCode` distingue ambos casos. | Core o el proveedor. |
| **`500`** | Excepción inesperada del handler o de la factory. | Core; los detalles internos quedan en el diagnóstico. |

La ausencia de un módulo produce una respuesta predecible que permite elegir un **fallback**. Los **endpoints versionados**, la validación y los **contract tests** ayudan a evolucionar con seguridad; versionar una ruta no garantiza compatibilidad. Los cambios incompatibles pueden usar una ruta nueva mientras los equipos mantienen los consumidores existentes.

### Componer un Home federado con un banner de Cards

Cards registra una factory durante su bootstrap. Su widget **`CardsHomeBanner`** recibe un `cardId` para elegir la tarjeta; la implementación permanece dentro de Cards.

```dart
void registerCardsWidgets(InterModuleCommunication communication) {
  communication.registerWidget(
    endpoint: const InterModuleEndpoint(
      url: '/cards/v1/home-banner',
      requiredParameters: {'cardId'},
    ),
    factory: (parameters) {
      final cardId = parameters['cardId'];
      if (cardId is! String || cardId.trim().isEmpty) {
        return const InterModuleCommunicationResponse<Widget>(
          statusCode: 400,
          errorCode: 'invalid_card_id',
        );
      }

      return InterModuleCommunicationResponse<Widget>(
        statusCode: 200,
        data: CardsHomeBanner(cardId: cardId),
      );
    },
  );
}
```

Home solicita el componente mediante **Foundations** y lo agrega a su layout:

```dart
Widget buildHome() {
  final response = InterModuleCommunication.instance.getWidget(
    endpoint: const InterModuleEndpoint(
      url: '/cards/v1/home-banner',
      parameters: {'cardId': 'card-123'},
    ),
  );
  final cardsBanner = response.isSuccess ? response.data : null;

  return ListView(
    children: [
      if (cardsBanner != null) cardsBanner,
      // Other sections supplied by participating micro apps.
    ],
  );
}
```

La falta de configuración requerida produce una falla estructurada:

```dart
final response = InterModuleCommunication.instance.getWidget(
  endpoint: const InterModuleEndpoint(url: '/cards/v1/home-banner'),
);
// With Cards registered:
// response.statusCode == 400
// response.errorCode == 'missing_required_parameters'
// response.data == null
```

Core invoca la factory **de forma sincrónica**, devolviendo el widget sin esperar a que cargue sus datos. El componente se incorpora al [árbol de widgets de Flutter](https://api.flutter.dev/flutter/widgets/Widget-class.html); Cards gestiona la carga asíncrona y su UI de carga o error. La factory o el widget aportan las dependencias específicas de Cards, y los equipos acuerdan restricciones de layout, navegación y contexto necesario del host.

Home importa Foundations y Flutter. Aquí omite el banner cuando falla la llamada, aunque puede elegir un fallback según el estado: **`404`** si Cards está ausente, **`400`** si falta `cardId` o es null, y **`400`** con `invalid_card_id` si está vacío o tiene un tipo incorrecto. Un ejemplo independiente de Home puede registrar una factory stub compatible. Todos los módulos se empaquetan juntos; **no se descarga código de widgets en runtime**.

## Hacer que los límites le sirvan al equipo

El flujo se puede repetir: implementar una feature detrás de un **límite claro**, probarla en un **ejemplo independiente** e integrarla mediante el **App Shell** usando adaptadores compartidos.

Foundations aporta contratos estables, Core los conecta con la tecnología y las micro apps conservan la propiedad de sus features. Los hosts ensamblan el producto, dando a cada equipo confianza para cambiar, probar y entender su parte de la aplicación.
