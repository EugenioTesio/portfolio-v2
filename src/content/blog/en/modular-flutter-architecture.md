When a Flutter application grows, more features and teams share the same code. A change in Accounts can affect Transfers, and testing a flow can mean walking through the whole application and reproducing a specific state.

**Modular architecture** gives each feature a clear boundary. Teams build self-contained **micro apps**, and the **App Shell** assembles them into one product. The idea shares the separation of responsibilities of web **micro frontends**; here, the modules are packaged into the same application and share dependency resolution and the native build.

Independence also requires collaboration: Transfers may need data from Accounts, while both use the same **design system**, authentication context, and analytics. Those relationships need explicit contracts.

The approach separates **what a module needs** from **how the application provides it**: **Foundations** defines shared contracts and UI, **Core** implements them, and the hosts configure them. Features collaborate without importing one another’s implementations.

## The architecture

![Modular Flutter architecture diagram: the App Shell and examples bootstrap Core and host micro apps; micro apps depend on Foundations; Core implements abstractions and uses third-party packages and SDKs.](/blog/modular-flutter-architecture/architecture.jpg)

Arrows show the **package dependencies**: the **App Shell** and the examples host **micro apps** and initialize **Core**; **micro apps** depend on **Foundations**; **Core** implements its **abstractions**. The three responsibilities of **Foundations** belong to that same package, not to extra implementation packages.

**The key boundary:** a **micro app** knows the capabilities it consumes, without knowing which SDK or concrete implementation provides them.

## Component breakdown

![Section 01 — App Shell: assemble modules and orchestrate the product experience.](/blog/modular-flutter-architecture/01-app-shell.jpg)

The **App Shell** is the parent application and the **composition root**: the place where implementations are selected and connected to their consumers. It assembles **micro apps**, coordinates startup, and orchestrates navigation and journeys across features.

It runs the **Core bootstrap** for development, staging, or production, and makes communication available before the modules initialize. Each **micro app** then registers its handlers and widget factories. The shell coordinates the lifecycle; features keep ownership of the behavior and UI they expose.

![Section 02 — Micro Apps: own a feature and keep a clear boundary.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

A **micro app** owns a business capability, such as Accounts or Transfers: presentation, logic, and internal models. It exposes routes, localization delegates, initialization hooks, and endpoint registration so the shell can integrate it.

Feature packages depend on **Foundations**, and do not import **Core** or another **micro app**’s implementation. Each team can develop and test on its own, choosing its internal architecture and state management. These boundaries complement [Flutter’s separation of UI, data, and business responsibilities](https://docs.flutter.dev/app-architecture/recommendations).

![Section 03 — Micro App Examples: run a feature and reproduce hard-to-reach flows.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

Each **micro app** has a **standalone example**: a small host that initializes **Core**, selects dependencies, and mounts the feature. It opens screens and reproduces scenarios that, in the full application, would need feature flags or long paths.

An example can compose other modules, such as Authentication and Accounts, to exercise authenticated requests. Those dependencies belong to the host; the feature package keeps its boundary.

Examples reuse the **same Core package and SDK adapters** as the **App Shell**. Configuration can switch analytics and crash reporting to console or no-op implementations, so manual testing skips unnecessary initialization while the rest of the setup stays representative.

![Section 04 — Foundations: shared contracts and a common visual language.](/blog/modular-flutter-architecture/04-foundations.jpg)

**Foundations** provides application-owned contracts through **abstractions**, the integrated **Design System**, and the **InterModuleCommunication** contract. Authentication context and permissions have explicit, strongly typed contracts; feature-specific models stay in their modules.

An Accounts response can evolve without moving its models into **Foundations**. Because every consumer depends on this package, its **public surface should stay stable and deliberate**.

![Section 05 — Abstractions: own the contract and choose the implementation.](/blog/modular-flutter-architecture/05-abstractions.jpg)

An **abstraction** describes capabilities such as analytics, storage, application information, camera, or navigation in the application’s language, without exposing a vendor API to every feature.

**AppInfo**, for example, exposes the application version, and a **Core** adapter reads it with [package_info_plus](https://pub.dev/packages/package_info_plus). The host injects implementations and tests can inject fakes: **inversion of control** keeps an SDK replacement inside its adapter, as long as the contract still fits.

Apply these boundaries selectively. Wrapping every Flutter widget, or reproducing the whole Riverpod or BLoC API, adds maintenance without necessarily protecting a meaningful capability.

![Section 06 — Design System: consistent components and flexible themes.](/blog/modular-flutter-architecture/06-design-system.jpg)

The **Design System** provides reusable components, themes, typography, spacing, and **design tokens** from **Foundations**.

**Primitive tokens** hold base values, such as a color palette; **semantic tokens** express intent, such as an error background or a primary action. Components consume those roles so a theme or brand changes through one configuration.

Atoms, molecules, organisms, and templates can organize the system as it grows. Shared components include **accessibility and interaction behavior** so the experience stays coherent across features.

![Section 07 — Inter-module communication: register capabilities and request data or widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

**InterModuleCommunication** connects isolated **micro apps** through explicit public contracts. Transfers can ask Accounts for data without importing its implementation; Accounts keeps control of how the request is fulfilled and returns the agreed result.

The interaction has three steps:

1. **Register.** During **bootstrap**, the provider declares a versioned endpoint, its required parameters, and a handler.
2. **Call.** The consumer sends the endpoint and parameters through the **abstraction** in **Foundations**.
3. **Dispatch.** **Core** finds the handler, checks the required parameters, and returns the result in a common response.

Two methods share that boundary: **`request`** asks for data or a feature-owned operation; **`getWidget`** asks for ready-made UI that another team provides and maintains.

A **federated Home** requests the Cards banner at `/cards/v1/home-banner`. Cards owns its behavior, data loading, and interactions; Home decides where to place it and which fallback to show, without importing the banner’s concrete class.

![Federated Home: independent micro apps compose one experience; Home obtains Cards’ banner through InterModuleCommunication at /cards/v1/home-banner.](/blog/modular-flutter-architecture/federated-home.jpg)

Both methods take an **`InterModuleEndpoint`** and return an **`InterModuleCommunicationResponse<T>`** with an explicit result. **Standalone examples** can register a compatible stub and exercise the consumer on its own.

Isolation is a **package and implementation** boundary: communication happens **in the same process**, inside one application. Teams agree on endpoint parameters, results, and versions, and can change the implementations behind them. Shared session or current-user context belongs to dedicated **abstractions** in **Foundations**.

**InterModuleCommunication** is a descriptive name for an application-owned **abstraction**.

![Section 08 — Core Package: shared adapters and configurable bootstrap.](/blog/modular-flutter-architecture/08-core-package.jpg)

**Core** implements the **Foundations** contracts with SDK adapters, communication registries, and shared startup. The **App Shell** and the examples run its configurable **bootstrap**; feature packages do not initialize it themselves.

Separate handler and widget-factory registries use URLs as keys and reject duplicates inside each registry. **Core** resolves the URL, checks the provider’s required parameters, and only then invokes the handler or factory. The provider validates types, formats, and business rules; the status table spells out each result.

**Core** turns unexpected handler or factory exceptions into **`500` responses**, and keeps the details in internal diagnostics. Later errors, during build or async loading of a returned widget, belong to that component. Features supply handlers and factories; **Core** manages dispatch.

![Section 09 — Third-party packages and SDKs: reuse adapters and keep dependency versions aligned.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

External packages sit behind **Core adapters** for the capabilities **Foundations** abstracts. Reusing adapters avoids implementations that drift apart, but it does not by itself guarantee identical dependency versions.

A [**Dart Pub workspace**](https://dart.dev/tools/pub/workspaces) gives the shell and the examples **one dependency resolution and a shared lockfile**. Native build settings and platform dependencies still need coordination and integration checks.

## Inter-module communication in practice

**Micro App** B owns `/module-b/v1/details`, the meaning of `id`, and the response schema. These Dart samples show the shared contract, a request from **Micro App** A, and a Cards banner. **Core**’s implementation and Flutter startup are omitted.

### Define the contract in **Foundations**

**`InterModuleEndpoint`** groups the URL, the call parameters, and the required parameter names declared at registration. The URL is an **in-process registry key**. **Core** uses the provider’s stored declaration, so a consumer cannot skip it to bypass validation. Schemas use primitive values, lists, and maps rather than the provider’s own objects.

The **generic response** keeps the result type: a data map, or a Flutter widget. **Foundations** does not define Module B’s business model or the Cards banner class.

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


Missing or null required parameters produce **`400`**, `missing_required_parameters`, and no data before the provider is called. An empty string still needs the provider’s validation. The **`200`** responses in these examples include non-null data.

The **`.instance` accessor** keeps the sample short. Constructor injection makes dependencies explicit and tests easier to isolate; the singleton is optional.

### Register the endpoint inside **Micro App** B

**Micro App** B’s **bootstrap** registers its handler in **Core** before the flows that depend on it are available:

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


A standalone host either runs **Micro App** B’s **bootstrap** or registers a **compatible stub** for that endpoint.

### Request it from **Micro App** A

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


**Micro App** A imports **Foundations** and knows the published schema. It does not import Module B, and it does not know how **Core** finds the handler. A real feature can map these outcomes into its own state and localized UI.

### Give every outcome a clear meaning

Both methods borrow the meanings of [**HTTP status codes**](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) for an **in-process API**. They are application statuses, not real HTTP responses:

| Status | Meaning | Produced by |
| --- | --- | --- |
| **`200`** | Success; `data` contains the result map or the widget. | The provider. |
| **`400`** | Required parameters are missing or null (`missing_required_parameters`), or values are invalid (`invalid_id`, `invalid_card_id`). | **Core** checks presence; the provider validates values. |
| **`404`** | The endpoint is not registered (`endpoint_not_registered`), or the item does not exist; `errorCode` distinguishes the cases. | **Core** or the provider. |
| **`500`** | The handler or factory threw an unexpected exception. | **Core**; internal details stay in diagnostics. |

A missing module produces a predictable response, so the caller can choose a **fallback**. **Versioned endpoints**, validation, and **contract tests** let both teams evolve safely; versioning a path does not guarantee compatibility. Incompatible changes can use a new path while the teams keep existing consumers working.

### Compose a federated Home with a Cards banner

Cards registers a factory during its **bootstrap**. Its **`CardsHomeBanner`** widget takes a `cardId` to choose the card; the implementation stays inside Cards.

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


Home requests the component through **Foundations** and adds it to its layout:

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


A call without the required configuration fails in a structured way:

```dart
final response = InterModuleCommunication.instance.getWidget(
  endpoint: const InterModuleEndpoint(url: '/cards/v1/home-banner'),
);
// With Cards registered:
// response.statusCode == 400
// response.errorCode == 'missing_required_parameters'
// response.data == null
```


**Core** invokes the factory **synchronously** and returns the widget without waiting for its data to load. The component joins the [Flutter widget tree](https://api.flutter.dev/flutter/widgets/Widget-class.html); Cards owns async loading and its loading or error UI. The factory or the widget supplies Cards-specific dependencies, and the teams agree on layout constraints, navigation, and the host context that is required.

Home imports **Foundations** and Flutter. Here it omits the banner when the call fails, though it can choose a fallback from the status: **`404`** when Cards is absent, **`400`** when `cardId` is missing or null, and **`400`** with `invalid_card_id` when it is empty or has the wrong type. A Home **standalone example** can register a compatible stub factory. Every module is packaged into the same application; **no widget code is downloaded at runtime**.

## Make the boundaries work for the team

The workflow can be repeated: implement a feature behind a **clear boundary**, exercise it in a **standalone example**, and integrate it through the **App Shell** with the same shared adapters.

**Foundations** provides stable contracts, **Core** connects them to concrete technology, and **micro apps** keep ownership of their features. Hosts assemble the product, so each team can change, test, and understand its part of the application.
