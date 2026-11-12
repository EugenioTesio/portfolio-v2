Una aplicación Flutter que crece trae un desafío conocido: más features, más equipos y más cambios que compiten por el mismo código. Una actualización pequeña de Accounts puede afectar a Transfers sin que nadie lo espere. Probar un flujo puede exigir arrancar toda la aplicación, iniciar sesión y reproducir un estado de usuario muy concreto.

La arquitectura modular le da a cada feature un límite claro. Los equipos desarrollan **micro apps** autocontenidas, mientras una aplicación padre—el **App Shell**—las ensambla en un solo producto y coordina la navegación y los recorridos de la persona que usa la app. La idea se parece a los micro frontends que compone una aplicación web. En esta arquitectura mobile, sin embargo, los módulos se empaquetan en la misma aplicación y comparten su resolución de dependencias y su build nativo.

La independencia sigue exigiendo colaboración. Transfers puede necesitar información que pertenece a Accounts, aunque los mantengan equipos distintos. Los dos pueden necesitar el mismo design system, el mismo contexto de autenticación y las mismas capacidades de analytics. La arquitectura tiene que sostener esas relaciones sin obligar a una feature a importar la implementación de otra.

El enfoque que sigue separa **lo que un módulo necesita** de **cómo se lo provee la aplicación**. Foundations define los contratos compartidos y las piezas de UI. Core aporta implementaciones reutilizables. El App Shell y los ejemplos independientes eligen cómo se configuran esas implementaciones.

## La arquitectura

![Diagrama de arquitectura modular en Flutter: el App Shell y los ejemplos inicializan Core y alojan micro apps; las micro apps dependen de Foundations; Core implementa abstracciones y usa paquetes y SDKs de terceros.](/blog/modular-flutter-architecture/architecture.jpg)

Las flechas muestran las direcciones principales de dependencia entre paquetes. El App Shell y los ejemplos componen las features e inicializan Core. Las micro apps dependen de Foundations; Core implementa sus abstracciones. Los tres elementos dentro de Foundations son responsabilidades de ese paquete, no paquetes de implementación adicionales.

**El límite clave:** una micro app conoce las capacidades que puede usar, pero no sabe qué SDK o qué implementación concreta las provee.

## Desglose de componentes

![Sección 01 — App Shell: ensamblar módulos y orquestar la experiencia del producto.](/blog/modular-flutter-architecture/01-app-shell.jpg)

El App Shell es la aplicación padre y el composition root: el lugar donde se eligen las implementaciones concretas y se conectan con quienes las consumen.

Ensambla las micro apps, coordina el arranque de la aplicación y orquesta la navegación y los recorridos que cruzan varias features. Usa el **bootstrap del Core Package** para configurar las dependencias compartidas de development, staging o production.

El shell también obtiene de Core la implementación de la comunicación entre módulos y la deja disponible antes de inicializar las micro apps. Cada micro app registra entonces sus propios handlers de request y sus factories de widgets durante su bootstrap. El shell coordina ese ciclo de vida; el comportamiento expuesto y la UI siguen perteneciendo a la feature que los provee.

![Sección 02 — Micro Apps: ser dueñas de una feature y mantener un límite claro.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

Una micro app encapsula una capacidad de negocio, como Accounts o Transfers. Es dueña de su presentación, de la lógica de la feature y de sus modelos internos, y expone los puntos de integración que el shell necesita: rutas, localization delegates, hooks de inicialización y registro de endpoints.

Las micro apps dependen de Foundations para las capacidades compartidas y la UI. Sus paquetes de feature no importan Core ni la implementación de otra micro app. Eso permite desarrollar y probar una feature por separado y, al mismo tiempo, conservar un límite de integración claro.

Dentro de cada micro app, los equipos pueden aplicar la arquitectura interna y el enfoque de state management que correspondan. Los límites entre paquetes complementan la separación de UI, acceso a datos y responsabilidades de negocio que describe la [guía de arquitectura de Flutter](https://docs.flutter.dev/app-architecture/recommendations).

![Sección 03 — Ejemplos de micro app: ejecutar una feature y reproducir flujos difíciles de alcanzar.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

Cada micro app tiene una aplicación de ejemplo independiente. El ejemplo actúa como un host pequeño: ejecuta el bootstrap de Core, selecciona las dependencias que necesita y monta la feature.

Los ejemplos vuelven práctico el testing manual. Quien desarrolla o revisa puede abrir una pantalla concreta, elegir un escenario o disparar un flujo que, de otro modo, exigiría un feature flag o una secuencia difícil de acciones en la aplicación completa.

Un ejemplo puede componer micro apps adicionales, como Authentication y Accounts, para demostrar requests autenticados de verdad. Esas dependencias pertenecen a la aplicación de ejemplo. El paquete de la feature conserva su propio límite.

Los ejemplos usan el **mismo paquete Core y los mismos adaptadores de SDK** que el App Shell. La configuración puede reemplazar analytics y crash reporting por implementaciones de consola o no-op, y así evitar una inicialización de reporting que no hace falta, sin dejar de mantener representativo el resto del setup.

![Sección 04 — Foundations: contratos compartidos y un lenguaje visual común.](/blog/modular-flutter-architecture/04-foundations.jpg)

Foundations contiene los contratos que pertenecen a la aplicación y las capacidades de UI compartida que consumen las micro apps. Sus responsabilidades principales son las **abstracciones**, el **Design System** integrado y la abstracción **InterModuleCommunication**.

Las preocupaciones compartidas, como el contexto de autenticación y los permisos, pueden tener aquí contratos explícitos y fuertemente tipados. Los modelos propios de una feature se quedan en el módulo dueño, así que cambiar una respuesta de Accounts no exige, por sí solo, cambiar Foundations.

Como Foundations afecta a cada consumidor, su superficie pública debería mantenerse deliberada y estable.

![Sección 05 — Abstractions: ser dueñas del contrato y elegir la implementación.](/blog/modular-flutter-architecture/05-abstractions.jpg)

Una abstracción describe una capacidad en el lenguaje de la aplicación. Puede cubrir analytics, storage, información de la aplicación, acceso a la cámara o navegación, sin exponer la API de un proveedor a cada feature.

Por ejemplo, una abstracción **AppInfo** puede exponer la versión de la aplicación. Un adaptador en Core puede obtener ese valor con [package_info_plus](https://pub.dev/packages/package_info_plus). Las micro apps consumen AppInfo y no saben qué paquete hay detrás.

Inyectar estos contratos sostiene la inversión de control: el host aporta las implementaciones, y los tests pueden aportar fakes. Reemplazar un SDK afecta sobre todo a su adaptador, siempre que el contrato de la aplicación siga encajando con la implementación nueva.

Aplícalo de forma selectiva. Envolver cada widget de Flutter, o reproducir toda la API de Riverpod o de BLoC, puede crear más mantenimiento que valor. Introduce un límite allí donde proteja una capacidad significativa de la aplicación.

![Sección 06 — Design System: componentes consistentes y themes flexibles.](/blog/modular-flutter-architecture/06-design-system.jpg)

Integrado en Foundations, el Design System aporta componentes de UI reutilizables, themes, tipografía, spacing y el resto de los design tokens.

Los tokens primitivos guardan valores de base, como una paleta de color. Los tokens semánticos expresan una intención, como el fondo de un error o una acción primaria. Los componentes consumen esos roles semánticos, de modo que la aplicación puede cambiar de theme o de marca con un mecanismo de configuración consistente.

Atoms, molecules, organisms y templates pueden organizar los componentes a medida que el sistema crece. El objetivo es una experiencia coherente entre features, con la accesibilidad y el comportamiento de interacción incorporados en los componentes compartidos.

![Sección 07 — Comunicación entre módulos: registrar capacidades y solicitar datos o widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

InterModuleCommunication es el mecanismo de comunicación entre micro apps aisladas. Cada micro app es dueña de la lógica de su feature, de sus modelos internos y de su UI, y su paquete de feature no importa la implementación de otra micro app. Este mecanismo les permite colaborar mediante contratos públicos explícitos y, al mismo tiempo, conservar esos límites.

Por ejemplo, Transfers puede necesitar detalles de cuenta que pertenecen a Accounts. Transfers envía un request a través de la abstracción compartida de comunicación; Accounts lo atiende con su propia lógica y devuelve el resultado acordado. Transfers sabe qué puede solicitar y qué respuesta esperar, mientras Accounts conserva el control de cómo se cumple esa petición.

La interacción tiene tres partes:

1. El proveedor registra una capacidad. Durante el bootstrap, Accounts registra un handler bajo un endpoint versionado y declara sus parámetros requeridos.
2. El consumidor llama al contrato compartido. Transfers usa la abstracción en Foundations, aportando el endpoint y los parámetros sin importar Accounts.
3. Core conecta los dos. Su registry localiza el handler, comprueba los parámetros requeridos y despacha la llamada. El resultado vuelve a Transfers en un sobre de respuesta común.

El mismo límite soporta dos tipos de colaboración:

- Solicitar datos u una operación con `request`. Una micro app le pide a otra que ejecute una acción propia de la feature o que devuelva información.
- Solicitar un widget listo con `getWidget`. Una micro app compone UI que otro equipo provee y mantiene.

Un Home federado ilustra el segundo caso. Cards registra una factory de banner en `/cards/v1/home-banner`. Home solicita ese widget y lo ubica en su layout sin importar la clase concreta del banner de Cards. Cards es dueña del comportamiento del banner, de la carga de datos y de las interacciones; Home es dueña de la ubicación y del fallback.

![Home federado: micro apps independientes componen una sola experiencia; Home obtiene el banner de Cards mediante InterModuleCommunication en `/cards/v1/home-banner`.](/blog/modular-flutter-architecture/federated-home.jpg)

Ambos métodos reciben un `InterModuleEndpoint` con una `url` y `parameters`, y devuelven un `InterModuleCommunicationResponse<T>`. Los status codes hacen explícitos los resultados, incluido `400` cuando faltan parámetros requeridos o son inválidos y `404` cuando un endpoint no está disponible. Un ejemplo independiente puede registrar un stub compatible para ejercitar al consumidor por separado.

El aislamiento está en el límite del paquete y de la implementación. Estas micro apps se componen en la misma aplicación, y la comunicación ocurre dentro del proceso. Los equipos siguen coordinando los contratos públicos de los endpoints—sus parámetros, resultados y versiones—mientras pueden cambiar libremente las implementaciones detrás de ellos.

Usa este mecanismo para colaborar en torno a capacidades propias de una feature. El contexto compartido de la aplicación, como el estado de sesión o la información del usuario actual, pertenece a abstracciones dedicadas en Foundations.

InterModuleCommunication es un nombre descriptivo que usa este artículo para una abstracción que pertenece a la aplicación.

![Sección 08 — Core Package: adaptadores compartidos y bootstrap configurable.](/blog/modular-flutter-architecture/08-core-package.jpg)

Core contiene implementaciones reutilizables de las abstracciones de Foundations: adaptadores de SDK de terceros, el registry y el dispatcher de la comunicación, y la lógica compartida de inicialización.

Su bootstrap crea y conecta esas implementaciones según la configuración del host. Tanto el App Shell como cada ejemplo llaman a ese mismo bootstrap, y eligen el entorno y el comportamiento de reporting que corresponden. Los paquetes de feature no hacen el bootstrap de Core por su cuenta.

La implementación de la comunicación mantiene registries de handlers de request y de factories de widgets, indexados por URL, y rechaza las URLs duplicadas dentro de cada registry. En los dos caminos, Core primero resuelve la URL (`404` si no está registrada), después controla los parámetros requeridos que declaró el proveedor (`400` si falta una clave o si su valor es null) y solo entonces invoca el handler o la factory. Los proveedores validan tipos, formatos y reglas de negocio, y devuelven `400` cuando los valores son inválidos. Core traduce las excepciones inesperadas de un handler o de una factory en respuestas `500`, y guarda el diagnóstico por dentro. Los errores que aparecen después, durante el build o la carga asíncrona de un widget ya devuelto, pertenecen al manejo de errores de ese componente. Core administra el dispatch; cada micro app aporta sus propios handlers y sus propias factories de widgets.

![Sección 09 — Paquetes y SDK de terceros: reutilizar adaptadores y mantener alineadas las versiones de dependencias.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

Los paquetes externos quedan detrás de los adaptadores de Core, para las capacidades que Foundations abstrae. Los ejemplos y el App Shell reutilizan esos adaptadores, en lugar de mantener implementaciones separadas que pueden irse separando.

Compartir un paquete no garantiza, por sí solo, que las versiones resueltas de las dependencias sean las mismas. Un [workspace de Dart Pub](https://dart.dev/tools/pub/workspaces) aporta una sola resolución de dependencias y un lockfile compartido para los paquetes que lo integran. Incluye el shell y los ejemplos en ese workspace para mantener alineadas sus dependencias de Dart. La configuración del build nativo y las dependencias de plataforma siguen exigiendo una configuración coordinada y controles de integración.

## La comunicación entre módulos, en la práctica

Considera el caso de Micro App A pidiendo detalles que pertenecen a Micro App B. El módulo B es dueño de `/module-b/v1/details`, incluido el significado de su campo `id` y la estructura de su respuesta.

Los fragmentos de Dart que siguen ilustran una API que pertenece a la aplicación. Muestran el contrato de Foundations, un request entre dos módulos y un Home federado que obtiene un banner de Cards. La implementación de Core y el código de arranque de Flutter quedan afuera, para que el ejemplo se lea con claridad.

### Definir el contrato en Foundations

El endpoint y el sobre de la respuesta pertenecen a Foundations. `InterModuleEndpoint` agrupa la URL de destino, los parámetros opcionales de la llamada y los nombres de los parámetros requeridos que los proveedores declaran al registrarse; la URL es una clave del registry dentro del proceso, no una dirección de red. Los proveedores pasan ese mismo tipo al registrarse, así que quien consume no puede saltear la validación omitiendo esa declaración. Los esquemas de parámetros usan valores primitivos, listas y mapas, y no objetos Dart propios del proveedor.

La respuesta genérica conserva el tipo del resultado: las operaciones devuelven mapas de datos que pertenecen al proveedor, y las factories de widgets devuelven widgets de Flutter. Foundations no define el modelo de negocio del módulo B ni la clase concreta del banner de Cards.

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

En los dos métodos de dispatch, Core controla los `requiredParameters` guardados al registrarse antes de llamar al proveedor. Si alguna clave declarada falta o es null, devuelve una respuesta del tipo de resultado que corresponda, con `statusCode: 400`, `errorCode: 'missing_required_parameters'` y sin data. Un string vacío está presente, pero igual puede ser inválido según el esquema del proveedor. Las respuestas exitosas de estos ejemplos usan `200` e incluyen data que no es null.

El accessor `.instance` mantiene breve el ejemplo de uso. En el código de la aplicación, pasar la abstracción por los constructores vuelve explícitas las dependencias y hace más fácil aislar los tests. El singleton es una decisión de wiring, no un requisito de esta arquitectura.

### Registrar el endpoint dentro de Micro App B

El host invoca el bootstrap del módulo B, y ese bootstrap llama a esta función de registro. El módulo B aporta el handler; Core lo guarda en el registry.

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

Registra los handlers antes de que queden disponibles los flujos que dependen de ellos. Si un ejemplo incluye el módulo B, invoca el bootstrap propio del módulo B. Si usa un sustituto, el ejemplo registra un stub compatible, en lugar del handler real de ese endpoint.

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

Micro App A importa Foundations y entiende el esquema publicado del módulo B. No importa el paquete de feature del módulo B, ni sabe cómo hace Core para localizar el handler. El ejemplo devuelve texto simple para que la interacción se vea; una feature real puede mapear estos resultados a su propio estado y a su UI localizada.

### Darle un significado claro a cada resultado

Tanto `request` como `getWidget` usan la convención que sigue, y toman significados conocidos de los [códigos de estado HTTP](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) para esta API dentro del proceso. Son estados de la aplicación, no respuestas HTTP reales.

| Status | Significado en este diseño | Lo produce |
| --- | --- | --- |
| `200` | La llamada tuvo éxito; `data` contiene el mapa del resultado o el widget. | El handler del módulo o la factory de widgets. |
| `400` | Faltan parámetros requeridos o son null (`missing_required_parameters`), o los valores enviados son inválidos (por ejemplo, `invalid_id` o `invalid_card_id`). | Core, en el control de parámetros requeridos; el proveedor, en la validación de valores. |
| `404` | El endpoint no está registrado, o el ítem pedido no existe. `errorCode` distingue los casos. | Core o el proveedor. |
| `500` | Una falla inesperada impidió completar la llamada. | Core, cuando un handler o una factory lanza una excepción inesperada. |

Cuando el módulo B no está, Core devuelve `404` con `errorCode: 'endpoint_not_registered'`. Ese comportamiento le permite a Micro App A ofrecer un fallback elegido a propósito. Las excepciones en crudo y los detalles internos de la implementación deberían quedarse en el diagnóstico, y no convertirse en la respuesta pública.

Versionar los endpoints, validar los parámetros y tener contract tests ayuda a los dos equipos a evolucionar con seguridad. Un path versionado ofrece un lugar para introducir un contrato incompatible; la compatibilidad sigue dependiendo de cómo la sostengan quien provee y quien consume.

### Componer un Home federado con un banner de Cards

Durante el bootstrap, la micro app Cards registra una factory para su banner ya armado. `CardsHomeBanner` representa un widget que ya existe y que pertenece a ese equipo; su implementación se queda dentro de Cards. En este ejemplo, su constructor acepta un `cardId` para elegir qué tarjeta mostrar.

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

La micro app Home pide el componente a través de Foundations y lo agrega a su layout:

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

Por ejemplo, una llamada sin la configuración requerida produce una falla estructurada:

```dart
final response = InterModuleCommunication.instance.getWidget(
  endpoint: const InterModuleEndpoint(url: '/cards/v1/home-banner'),
);
// With Cards registered:
// response.statusCode == 400
// response.errorCode == 'missing_required_parameters'
// response.data == null
```

Core invoca de forma sincrónica la factory registrada. El componente de una respuesta exitosa entra con normalidad en el [árbol de widgets de Flutter](https://api.flutter.dev/flutter/widgets/Widget-class.html); cualquier carga asíncrona de datos, y su UI de carga o de error, permanecen dentro del componente de Cards. Su factory o su widget tienen que proveer las dependencias específicas de Cards que necesiten, y los equipos acuerdan las restricciones de layout, la navegación y el contexto de host que hace falta. Home importa Foundations y Flutter, y no importa `CardsHomeBanner`.

Si Cards no está, `getWidget` devuelve `404` con `endpoint_not_registered`. Omitir `cardId`, o pasar null, devuelve `400` con `missing_required_parameters` antes de que la factory se ejecute; un `cardId` vacío o de un tipo incorrecto devuelve `400` con `invalid_card_id`, desde Cards. En este ejemplo, Home omite el banner cuando la llamada falla; también puede mapear cada status a un fallback. Un ejemplo independiente de Home puede registrar una stub factory compatible bajo la misma URL. La composición usa módulos empaquetados en la misma aplicación; no se descarga código de widgets en runtime.

## Hacer que los límites le sirvan al equipo

El valor de esta estructura está en un flujo que se puede repetir: implementar una feature detrás de un límite claro, ejercitarla en un ejemplo independiente e integrarla por medio del App Shell, usando los mismos adaptadores compartidos.

Foundations les da a los equipos un vocabulario estable. Core conecta ese vocabulario con una tecnología concreta. Las micro apps conservan la propiedad de su comportamiento y de sus contratos, y el host decide cómo se ensambla el producto.

Eso le da a la modularidad un propósito práctico: los equipos pueden cambiar, probar y entender su parte de la aplicación con más confianza sobre el modo en que se conecta con el resto.
