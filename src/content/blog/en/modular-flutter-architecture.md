As a Flutter application grows, more features and teams share the same codebase. An Accounts update can affect Transfers, while testing one flow may require navigating the entire application.

**Modular architecture** gives each feature a clear boundary. Teams build self-contained **micro apps**, and an **App Shell** assembles them into one product. Like web micro frontends, they separate ownership; here, modules are packaged into the same application and share dependency resolution and native builds.

Transfers may still need Accounts data, while both use the same design system, authentication context, and analytics. Those relationships need explicit contracts.

The architecture separates **what a module needs** from **how it is provided**: Foundations defines contracts and shared UI, Core implements them, and hosts configure them. Features collaborate without importing each other’s implementations.

## The architecture

![Modular Flutter architecture diagram: the App Shell and examples bootstrap Core and host micro apps; micro apps depend on Foundations; Core implements abstractions and uses third-party packages and SDKs.](/blog/modular-flutter-architecture/architecture.jpg)

Arrows show **package dependencies**: the App Shell and examples host micro apps and bootstrap Core; micro apps depend on Foundations; Core implements its abstractions. Foundations’ three responsibilities belong to one package, rather than additional implementation packages.

**The key boundary:** micro apps know the capabilities they consume, without knowing the SDKs that provide them.

## Component breakdown

![Section 01 — App Shell: assemble modules and orchestrate the product experience.](/blog/modular-flutter-architecture/01-app-shell.jpg)

The **App Shell** is the parent application and **composition root**, where implementations connect to their consumers. It assembles micro apps, coordinates startup, and orchestrates navigation and journeys across features.

It runs **Core’s bootstrap** for development, staging, or production, making communication available before modules initialize. Each micro app then registers its handlers and widget factories. The shell coordinates the lifecycle; features own the exposed behavior and UI.

![Section 02 — Micro Apps: own a feature and keep a clear boundary.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

A **micro app** owns a business capability—such as Accounts or Transfers—including presentation, logic, and internal models. It exposes routes, localization delegates, initialization hooks, and endpoint registration.

Feature packages depend on **Foundations**, without importing Core or other micro apps’ implementations. Teams can develop and test independently, choosing their internal architecture and state management. These package boundaries complement [Flutter’s separation of UI, data, and business responsibilities](https://docs.flutter.dev/app-architecture/recommendations).

![Section 03 — Micro App Examples: run a feature and reproduce hard-to-reach flows.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

A **standalone example** is a small host that bootstraps Core and mounts a feature. It lets developers and reviewers open screens or reproduce scenarios otherwise hidden behind feature flags or complex journeys.

Examples can compose other modules, such as Authentication and Accounts; those dependencies belong to the host. They reuse the **same Core and SDK adapters** as the App Shell, with configurable console or no-op analytics and crash reporting.

This avoids unnecessary reporting initialization during manual testing while keeping the remaining setup representative of the full application.

![Section 04 — Foundations: shared contracts and a common visual language.](/blog/modular-flutter-architecture/04-foundations.jpg)

**Foundations** provides application-owned **abstractions**, the **Design System**, and the **InterModuleCommunication** contract. Shared concerns such as authentication context and permissions have explicit, strongly typed contracts; feature-specific models stay with their modules.

An Accounts response can evolve without moving its feature models into Foundations. Because every consumer depends on Foundations, keep its **public surface stable and deliberate**.

![Section 05 — Abstractions: own the contract and choose the implementation.](/blog/modular-flutter-architecture/05-abstractions.jpg)

An **abstraction** describes analytics, storage, app information, camera access, or navigation in the application’s language, without exposing vendor APIs.

For example, **AppInfo** exposes the app version; a Core adapter retrieves it through [package_info_plus](https://pub.dev/packages/package_info_plus). Hosts inject implementations and tests inject fakes: **inversion of control** keeps SDK replacement mostly within the adapter, provided the contract still fits.

Apply boundaries selectively. Wrapping every Flutter widget or reproducing Riverpod’s or BLoC’s entire API adds maintenance without necessarily protecting a meaningful capability.

![Section 06 — Design System: consistent components and flexible themes.](/blog/modular-flutter-architecture/06-design-system.jpg)

The **Design System** supplies reusable components, themes, typography, spacing, and design tokens through Foundations.

**Primitive tokens** hold base values, such as palette colors; **semantic tokens** express intent, such as error backgrounds. Components consume semantic roles to support consistent theme or brand changes.

Atoms, molecules, organisms, and templates can organize growth, while shared components carry **accessibility and interaction behavior** across features.

![Section 07 — Inter-module communication: register capabilities and request data or widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

**InterModuleCommunication connects isolated micro apps through explicit public contracts.** Transfers can request Accounts data without importing its implementation; Accounts retains control over how it fulfills the request.

The interaction has three steps:

1. **Register:** the provider declares a versioned endpoint, required parameters, and a handler during bootstrap.
2. **Request:** the consumer supplies the endpoint and parameters through Foundations.
3. **Dispatch:** Core resolves the handler, validates required parameters, and returns its result in a common response envelope.

Two methods support collaboration: **`request`** obtains data or performs a feature-owned operation; **`getWidget`** obtains ready-made UI maintained by another team.

A **federated Home** requests Cards’ banner at `/cards/v1/home-banner`. Cards owns its behavior, data loading, and interactions; Home owns placement and fallback, without importing the concrete banner class.

![Federated Home: independent micro apps compose one experience; Home obtains Cards’ banner through InterModuleCommunication at /cards/v1/home-banner.](/blog/modular-flutter-architecture/federated-home.jpg)

Both methods accept an **`InterModuleEndpoint`** and return an **`InterModuleCommunicationResponse<T>`** with explicit outcomes. Standalone examples can register compatible stubs.

This is **package and implementation isolation**: communication happens **in process**, within one application. Teams coordinate endpoint parameters, results, and versions while evolving implementations independently. Shared session or current-user context belongs behind dedicated Foundations abstractions.

InterModuleCommunication is a descriptive name for an application-owned abstraction.

![Section 08 — Core Package: shared adapters and configurable bootstrap.](/blog/modular-flutter-architecture/08-core-package.jpg)

**Core** implements Foundations contracts through SDK adapters, communication registries, and shared initialization. The App Shell and examples run its configurable bootstrap; feature packages do not.

Separate request-handler and widget-factory registries use URLs as keys and reject duplicates within each registry. Core resolves the URL, checks the provider’s required parameters, then invokes the handler or factory. Providers validate types, formats, and business rules; the status table below defines each outcome.

Core translates unexpected handler or factory exceptions into **`500` responses**, keeping diagnostic details internal. Errors during a returned widget’s later build or asynchronous loading remain that component’s responsibility. Features supply the handlers and factories; Core manages dispatch.

![Section 09 — Third-party packages and SDKs: reuse adapters and keep dependency versions aligned.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

External packages sit behind **Core’s adapters** for abstracted capabilities. Sharing adapters prevents implementation drift, but does not guarantee identical dependency versions.

A [**Dart Pub workspace**](https://dart.dev/tools/pub/workspaces) gives the shell and examples **one dependency resolution and shared lockfile**. Native build settings and platform dependencies still need coordinated configuration and integration checks.

## Inter-module communication in practice

Micro App B owns `/module-b/v1/details`, its `id` parameter, and response schema. These illustrative Dart snippets cover the shared contract, a request from Micro App A, and a Cards banner. Core’s implementation and Flutter startup code are omitted.

### Define the contract in Foundations

**`InterModuleEndpoint`** groups a URL, call parameters, and required parameter names declared at registration. The URL is an **in-process registry key**. Core uses the provider’s stored declaration, so consumers cannot bypass validation. Parameter schemas use primitives, lists, and maps instead of provider-specific objects.

The **generic response** carries a data map or Flutter widget; Foundations defines neither Module B’s business model nor Cards’ banner class.

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

Missing or null required parameters produce **`400`**, `missing_required_parameters`, and no data before the provider runs. Empty strings require provider validation. These examples return non-null data on **`200`**.

The **`.instance` accessor** keeps examples concise. Constructor injection makes dependencies explicit and tests easier to isolate; a singleton is optional.

### Register the endpoint inside Micro App B

Module B’s bootstrap registers its handler with Core before dependent flows become available:

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

Standalone hosts invoke Module B’s bootstrap or register a **compatible stub** for the endpoint.

### Make the request from Micro App A

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

Micro App A imports **Foundations** and understands the published schema, without importing Module B or knowing how Core finds its handler. A real feature maps these outcomes into its state and localized UI.

### Give every outcome a clear meaning

Both methods borrow [**HTTP status meanings**](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) for an **in-process API**. These are application-level statuses, not actual HTTP responses:

| Status | Meaning | Produced by |
| --- | --- | --- |
| **`200`** | Success; `data` contains the result map or widget. | Provider. |
| **`400`** | Missing/null required parameters (`missing_required_parameters`) or invalid values (`invalid_id`, `invalid_card_id`). | Core checks presence; the provider validates values. |
| **`404`** | Unregistered endpoint (`endpoint_not_registered`) or missing item; `errorCode` distinguishes them. | Core or provider. |
| **`500`** | Unexpected handler or factory exception. | Core; internal details stay in diagnostics. |

An absent module produces a predictable response that lets the consumer choose a **fallback**. **Versioned endpoints**, validation, and **contract tests** help teams evolve safely; a versioned path alone does not guarantee compatibility. Breaking changes can use a new path while teams maintain existing consumers.

### Compose a federated Home with a Cards banner

Cards registers a factory during bootstrap. Its existing **`CardsHomeBanner`** widget accepts a `cardId`; the implementation stays inside Cards.

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

Missing configuration produces a structured failure:

```dart
final response = InterModuleCommunication.instance.getWidget(
  endpoint: const InterModuleEndpoint(url: '/cards/v1/home-banner'),
);
// With Cards registered:
// response.statusCode == 400
// response.errorCode == 'missing_required_parameters'
// response.data == null
```

Core invokes the factory **synchronously**, returning a widget without waiting for its data to load. The returned component joins [Flutter’s widget tree](https://api.flutter.dev/flutter/widgets/Widget-class.html); Cards handles asynchronous loading and its loading or error UI. The factory or widget supplies Cards-specific dependencies, and teams agree on layout constraints, navigation, and required host context.

Home imports Foundations and Flutter. It omits the banner on failure here, but can map statuses to a fallback: **`404`** when Cards is absent, **`400`** for missing/null `cardId`, or **`400`** with `invalid_card_id` for an empty or incorrectly typed value. A standalone Home can register a compatible stub factory. All modules ship together; **no widget code is downloaded at runtime**.

## Make the boundaries work for the team

The workflow is repeatable: build a feature behind a **clear boundary**, test it in a **standalone example**, and integrate it through the **App Shell** using shared adapters.

Foundations supplies stable contracts, Core connects them to technology, and micro apps retain feature ownership. Hosts assemble the product, giving teams confidence to change and test their part independently.
