Una aplicación Flutter que crece trae un desafío conocido: más features, más equipos y más cambios que compiten por el mismo código. Una actualización pequeña de **Accounts** puede afectar a **Transfers** sin que nadie lo espere. Probar un flujo puede exigir arrancar toda la aplicación, iniciar sesión y reproducir un estado de usuario muy concreto.

La **arquitectura modular** le da a cada feature un límite claro. Los equipos desarrollan **micro apps** autocontenidas, y una aplicación padre—el **App Shell**—las ensambla en un solo producto y coordina la navegación y los recorridos. La idea se parece a los **micro frontends**. En mobile, los módulos se empaquetan en la misma aplicación y comparten su resolución de dependencias y su build nativo.

La independencia sigue exigiendo colaboración. Transfers puede necesitar información de Accounts, aunque los mantengan equipos distintos. Los dos pueden necesitar el mismo **design system**, el mismo contexto de autenticación y las mismas capacidades de analytics. La arquitectura tiene que sostener esas relaciones sin que una feature importe la implementación de otra.

El enfoque separa **lo que un módulo necesita** de **cómo se lo provee la aplicación**. **Foundations** define los contratos compartidos y las piezas de UI. **Core** aporta implementaciones reutilizables. El App Shell y los ejemplos independientes eligen cómo se configuran esas implementaciones.

## La arquitectura

![Diagrama de arquitectura modular en Flutter: el App Shell y los ejemplos inicializan Core y alojan micro apps; las micro apps dependen de Foundations; Core implementa abstracciones y usa paquetes y SDKs de terceros.](/blog/modular-flutter-architecture/architecture.jpg)

Las flechas muestran las direcciones principales de dependencia entre paquetes. El App Shell y los ejemplos componen las features e inicializan Core. Las micro apps dependen de Foundations; Core implementa sus abstracciones. Los tres elementos dentro de Foundations son responsabilidades de ese paquete, no paquetes de implementación adicionales.

> **El límite clave:** una micro app conoce las capacidades que puede usar, pero no qué SDK ni qué implementación concreta las provee.

## Desglose de componentes

![Sección 01 — App Shell: ensamblar módulos y orquestar la experiencia del producto.](/blog/modular-flutter-architecture/01-app-shell.jpg)

El **App Shell** es el **composition root**: elige las implementaciones concretas y las conecta con quienes las consumen. Ensambla las **micro apps**, arranca el producto y orquesta los recorridos que cruzan varias features. El **bootstrap del Core Package** configura las dependencias compartidas de development, staging o production, e instala la comunicación entre módulos antes de que esas micro apps se inicialicen. Cada una registra entonces sus **handlers de request** y sus **factories de widgets**. El comportamiento expuesto y la UI se quedan en la feature que los provee.

![Sección 02 — Micro Apps: ser dueñas de una feature y mantener un límite claro.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

Una **micro app** es dueña de una capacidad, como Accounts o Transfers: su presentación, su lógica y sus modelos. Expone **rutas**, localization delegates, hooks de inicialización y registro de endpoints. El paquete de la feature depende de Foundations y no importa Core ni otra micro app, así que el equipo puede construirla y probarla sola, con la arquitectura interna y el state management que le sirvan. Ese límite complementa la separación de UI, datos y negocio de la [guía de arquitectura de Flutter](https://docs.flutter.dev/app-architecture/recommendations).

![Sección 03 — Ejemplos de micro app: ejecutar una feature y reproducir flujos difíciles de alcanzar.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

Un **ejemplo independiente** es un host pequeño. Ejecuta el bootstrap de Core, selecciona dependencias y monta la feature, así quien revisa puede abrir una pantalla o un flujo que, de otro modo, exigiría un feature flag. Puede componer Authentication y Accounts para requests autenticados de verdad; esas dependencias pertenecen al ejemplo, no al paquete de la feature. Los ejemplos usan el **mismo paquete Core y los mismos adaptadores de SDK** que el App Shell, y pueden cambiar analytics y crash reporting por implementaciones de consola o no-op.

![Sección 04 — Foundations: contratos compartidos y un lenguaje visual común.](/blog/modular-flutter-architecture/04-foundations.jpg)

**Foundations** es la superficie compartida que consume cada micro app: **abstracciones**, el **Design System** e **InterModuleCommunication**. La autenticación y los permisos tienen aquí contratos fuertemente tipados. Los modelos de una feature se quedan en su módulo, así que un cambio de Accounts no cambia Foundations. Su superficie pública debería mantenerse deliberada y estable.

![Sección 05 — Abstractions: ser dueñas del contrato y elegir la implementación.](/blog/modular-flutter-architecture/05-abstractions.jpg)

Una **abstracción** nombra una capacidad en el lenguaje de la aplicación—analytics, storage, información de la aplicación, cámara o navegación—y no la API de un proveedor. **AppInfo** puede exponer la versión; un adaptador de Core la lee con [package_info_plus](https://pub.dev/packages/package_info_plus), y las micro apps no ven ese paquete. Inyectar el contrato es **inversión de control**: el host aporta la implementación, los tests aportan un fake y un cambio de SDK se queda en el adaptador. Aplícalo donde proteja una capacidad real, no en cada widget de Flutter ni en una copia de Riverpod o BLoC.

![Sección 06 — Design System: componentes consistentes y themes flexibles.](/blog/modular-flutter-architecture/06-design-system.jpg)

El **Design System**, dentro de Foundations, aporta componentes, themes, tipografía, spacing y **design tokens**. Los **tokens primitivos** guardan valores de base, como una paleta. Los **tokens semánticos** guardan una intención, como el fondo de un error o una acción primaria. Los componentes consumen esos roles, así que un theme o una marca cambian en un solo lugar. Atoms, molecules, organisms y templates pueden organizar el sistema, con la accesibilidad incorporada en los componentes compartidos.

![Sección 07 — Comunicación entre módulos: registrar capacidades y solicitar datos o widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

**InterModuleCommunication** permite que las micro apps colaboren sin importarse entre sí. Cada una sigue siendo dueña de su lógica, de sus modelos y de su UI. Transfers puede pedirle a Accounts detalles de cuenta a través de ese contrato: Transfers conoce el request y la respuesta, y Accounts decide cómo cumplirlo.

1. **Registrar.** Durante el bootstrap, Accounts registra un handler en un endpoint versionado y declara los parámetros requeridos.
2. **Llamar.** Transfers usa el contrato de Foundations y no importa Accounts.
3. **Despachar.** El registry de Core encuentra el handler, controla esos parámetros y devuelve un solo sobre de respuesta.

- **`request`** pide datos o una operación propia de la feature.
- **`getWidget`** pide un widget que otro equipo construye y mantiene.

Un **Home federado** usa el segundo. Cards registra una factory de banner en `/cards/v1/home-banner`. Home ubica ese widget sin importar la clase de Cards. Cards es dueña del comportamiento, de la carga y de las interacciones. Home es dueña de la ubicación y del fallback.

![Home federado: micro apps independientes componen una sola experiencia; Home obtiene el banner de Cards mediante InterModuleCommunication en `/cards/v1/home-banner`.](/blog/modular-flutter-architecture/federated-home.jpg)

Los dos métodos reciben un `InterModuleEndpoint` (`url` y `parameters`) y devuelven un `InterModuleCommunicationResponse<T>`. `400` significa parámetros faltantes o inválidos. `404` significa que el endpoint no está disponible. Un ejemplo independiente puede registrar un stub y ejercitar al consumidor solo. La comunicación ocurre **dentro del proceso**, en una sola aplicación empaquetada. Los equipos acuerdan parámetros, resultados y versiones, y pueden cambiar el código que hay detrás de ese contrato. **InterModuleCommunication** es el nombre que le da este artículo. El estado de sesión y el usuario actual van en sus propias abstracciones de Foundations.

![Sección 08 — Core Package: adaptadores compartidos y bootstrap configurable.](/blog/modular-flutter-architecture/08-core-package.jpg)

**Core** implementa Foundations: adaptadores de SDK, el registry y el dispatcher de la comunicación, y el arranque compartido. El **bootstrap** los arma según la configuración del host. El App Shell y cada ejemplo lo llaman; los paquetes de feature, no. Los registries se indexan por URL y rechazan duplicados. Core resuelve la URL (`404` si falta), controla los parámetros requeridos (`400` si falta una clave o si su valor es null) y después invoca el handler o la factory. Los proveedores devuelven `400` cuando los valores son inválidos. Una excepción inesperada se convierte en `500`, y el diagnóstico se queda dentro de Core. Los errores posteriores de build o de carga pertenecen al widget devuelto.

![Sección 09 — Paquetes y SDK de terceros: reutilizar adaptadores y mantener alineadas las versiones de dependencias.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

Los paquetes externos quedan detrás de esos adaptadores, así que el shell y los ejemplos comparten una sola implementación. Incluye a los dos en un [workspace de Dart Pub](https://dart.dev/tools/pub/workspaces) para que compartan una sola resolución y un solo lockfile. La configuración del build nativo y las dependencias de plataforma siguen necesitando coordinación.

## La comunicación entre módulos, en la práctica

Micro App A le pide a Micro App B `/module-b/v1/details`. El módulo B es dueño del significado de `id` y de la forma de la respuesta. Los fragmentos son el contrato de Foundations, un request entre módulos y un Home federado. Core y el arranque de Flutter quedan afuera.

### Definir el contrato en Foundations

`InterModuleEndpoint` lleva la URL—una clave del registry dentro del proceso, no una dirección de red—, los parámetros de la llamada y los nombres requeridos que se declaran al registrarse. Los proveedores se registran con ese mismo tipo, así que quien consume no puede saltear el control. Los parámetros son primitivos, listas y mapas. La respuesta genérica conserva el tipo del resultado: un mapa de datos, o un widget de Flutter. Foundations no define el modelo del módulo B ni la clase del banner de Cards.

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

Core controla los `requiredParameters` guardados antes de llamar al proveedor. Una clave faltante o null es `400` con `missing_required_parameters` y sin data. Un string vacío cuenta como presente y puede seguir siendo inválido. El éxito, en estos ejemplos, es `200` con data que no es null. En el código de la aplicación, pasa la abstracción por los constructores. `.instance` solo acorta estos ejemplos, y el singleton es una decisión de wiring, no parte de la arquitectura.

### Registrar el endpoint dentro de Micro App B

El bootstrap del módulo B registra el handler. Core lo guarda.

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

Registra los handlers antes de los flujos que dependen de ellos. Un ejemplo ejecuta el bootstrap del módulo B, o registra un stub compatible.

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

Micro App A importa Foundations y el esquema publicado del módulo B, no el paquete del módulo B. Una feature real mapea cada resultado a su propio estado y a su UI.

### Darle un significado claro a cada resultado

`request` y `getWidget` toman los [códigos de estado HTTP](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) para esta API dentro del proceso. Son estados de la aplicación, no respuestas HTTP.

| Status | Significado en este diseño | Lo produce |
| --- | --- | --- |
| `200` | La llamada tuvo éxito; `data` contiene el mapa del resultado o el widget. | El handler del módulo o la factory de widgets. |
| `400` | Faltan parámetros requeridos o son null (`missing_required_parameters`), o los valores enviados son inválidos (por ejemplo, `invalid_id` o `invalid_card_id`). | Core, en el control de parámetros requeridos; el proveedor, en la validación de valores. |
| `404` | El endpoint no está registrado, o el ítem pedido no existe. `errorCode` distingue los casos. | Core o el proveedor. |
| `500` | Una falla inesperada impidió completar la llamada. | Core, cuando un handler o una factory lanza una excepción inesperada. |

Si falta el módulo B, la respuesta es `404` con `endpoint_not_registered`, y quien llama puede ofrecer un fallback a propósito. Las excepciones se quedan en el diagnóstico. Un path versionado, la validación de parámetros y los **contract tests** les permiten a los dos equipos evolucionar el contrato.

### Componer un Home federado con un banner de Cards

Cards registra una factory para `CardsHomeBanner`, que se queda dentro de Cards y recibe un `cardId`.

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

Home pide el componente a través de Foundations y lo agrega a su layout:

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

Omitir `cardId` es `400` con `missing_required_parameters`, antes de que la factory se ejecute. Core llama a la factory de forma sincrónica. El widget entra como siempre en el [árbol de widgets de Flutter](https://api.flutter.dev/flutter/widgets/Widget-class.html), y la carga asíncrona se queda dentro de ese widget. Los equipos acuerdan layout, navegación, dependencias y contexto de host. Home importa Foundations y Flutter, no `CardsHomeBanner`.

Si falta el módulo Cards, la respuesta es `404` con `endpoint_not_registered`. Un `cardId` inválido es `400` con `invalid_card_id`. Home puede omitir el banner o mapear cada status a un fallback, y un ejemplo independiente puede registrar un stub en la misma URL. No se descarga código de widgets en runtime.

## Hacer que los límites le sirvan al equipo

El valor está en un flujo que se puede repetir: implementar una feature detrás de un límite claro, ejercitarla en un **ejemplo independiente** e integrarla por el **App Shell** con los mismos adaptadores. **Foundations** es el vocabulario compartido. **Core** lo conecta con una tecnología concreta. Las **micro apps** conservan su comportamiento y sus contratos, así un equipo puede cambiar su parte del producto y seguir viendo cómo se conecta con el resto.
