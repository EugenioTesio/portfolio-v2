A growing Flutter application brings a familiar challenge: more features, more teams, and more changes competing for the same codebase. A small update to Accounts can unexpectedly affect Transfers. Testing one flow can require starting the entire application, signing in, and reproducing a very specific user state.

Modular architecture gives each feature a clear boundary. Teams develop self-contained **micro apps**, while a parent application—the **App Shell**—assembles them into one product and coordinates navigation and user journeys. The idea is similar to micro frontends composed by a web application. In this mobile architecture, however, the modules are packaged into the same application and share its dependency resolution and native build.

Independence still requires collaboration. Transfers might need information owned by Accounts, even when different teams maintain them. Both might need the same design system, authentication context, and analytics capabilities. The architecture must support these relationships without requiring one feature to import another feature’s implementation.

The approach below separates **what a module needs** from **how the application provides it**. Foundations defines shared contracts and UI building blocks. Core supplies reusable implementations. The App Shell and standalone examples choose how those implementations are configured.

## The architecture

![Modular Flutter architecture diagram: the App Shell and examples bootstrap Core and host micro apps; micro apps depend on Foundations; Core implements abstractions and uses third-party packages and SDKs.](/blog/modular-flutter-architecture/architecture.jpg)

Arrows show the main package dependency directions. The App Shell and examples compose features and bootstrap Core. Micro apps depend on Foundations; Core implements its abstractions. The three items inside Foundations are responsibilities within that package, rather than additional implementation packages.

**The key boundary:** a micro app knows the capabilities it can use, but does not know which SDK or concrete implementation provides them.

## Component breakdown

![Section 01 — App Shell: assemble modules and orchestrate the product experience.](/blog/modular-flutter-architecture/01-app-shell.jpg)

The App Shell is the parent application and the composition root: the place where concrete implementations are selected and connected to their consumers.

It assembles micro apps, coordinates application startup, and orchestrates navigation and journeys that span multiple features. It uses the **Core Package bootstrap** to configure shared dependencies for development, staging, or production.

The shell also obtains the inter-module communication implementation from Core and makes it available before initializing the micro apps. Each micro app then registers its own request handlers and widget factories during its bootstrap. The shell coordinates this lifecycle; exposed behavior and UI remain owned by the feature that provides them.

![Section 02 — Micro Apps: own a feature and keep a clear boundary.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

A micro app encapsulates a business capability, such as Accounts or Transfers. It owns its presentation, feature logic, and internal models, and exposes the integration points the shell needs: routes, localization delegates, initialization hooks, and endpoint registration.

Micro apps depend on Foundations for shared capabilities and UI. Their feature packages do not import Core or another micro app’s implementation. This makes it possible to develop and test a feature independently while preserving a clear integration boundary.

Within each micro app, teams can apply an appropriate internal architecture and state management approach. Package boundaries complement the separation of UI, data access, and business responsibilities described in [Flutter’s architecture guidance](https://docs.flutter.dev/app-architecture/recommendations).

![Section 03 — Micro App Examples: run a feature and reproduce hard-to-reach flows.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

Each micro app has a standalone example application. The example acts as a small host: it runs Core’s bootstrap, selects the dependencies it needs, and mounts the feature.

Examples make manual testing practical. Developers and reviewers can open a particular screen, select a scenario, or trigger a flow that would otherwise require a feature flag or a difficult sequence of actions in the full application.

An example may compose additional micro apps, such as Authentication and Accounts, to demonstrate real authenticated requests. Those dependencies belong to the example application. The feature package retains its own boundary.

Examples use the **same Core package and SDK adapters** as the App Shell. Configuration can replace analytics and crash reporting with console or no-op implementations, avoiding unnecessary reporting initialization while keeping the rest of the setup representative.

![Section 04 — Foundations: shared contracts and a common visual language.](/blog/modular-flutter-architecture/04-foundations.jpg)

Foundations contains the application-owned contracts and shared UI capabilities that micro apps consume. Its main responsibilities are **abstractions**, the integrated **Design System**, and the **InterModuleCommunication** abstraction.

Shared concerns such as authentication context and permissions can have explicit, strongly typed contracts here. Feature-specific models remain with their owning modules, so changing an Accounts response does not automatically require changing Foundations.

Because Foundations affects every consumer, its public surface should stay deliberate and stable.

![Section 05 — Abstractions: own the contract and choose the implementation.](/blog/modular-flutter-architecture/05-abstractions.jpg)

An abstraction describes a capability in the application’s language. It can cover analytics, storage, application information, camera access, or navigation without exposing a vendor’s API to every feature.

For example, an **AppInfo** abstraction might expose the application version. An adapter in Core can retrieve that value using [package_info_plus](https://pub.dev/packages/package_info_plus). Micro apps consume AppInfo and remain unaware of the package behind it.

Injecting these contracts supports inversion of control: the host supplies implementations, and tests can supply fakes. Replacing an SDK then primarily affects its adapter, provided the application-owned contract still fits the new implementation.

Apply this selectively. Wrapping every Flutter widget or reproducing the entire API of Riverpod or BLoC can create more maintenance than value. Introduce a boundary where it protects a meaningful application capability.

![Section 06 — Design System: consistent components and flexible themes.](/blog/modular-flutter-architecture/06-design-system.jpg)

Integrated into Foundations, the Design System provides reusable UI components, themes, typography, spacing, and other design tokens.

Primitive tokens hold base values, such as a color palette. Semantic tokens express intent, such as an error background or primary action. Components consume those semantic roles so the application can change themes or brands through a consistent configuration mechanism.

Atoms, molecules, organisms, and templates can organize components as the system grows. The goal is a coherent experience across features, with accessibility and interaction behavior built into shared components.

![Section 07 — Inter-module communication: register capabilities and request data or widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

InterModuleCommunication is the communication mechanism between isolated micro apps. Each micro app owns its feature logic, internal models, and UI, and its feature package does not import another micro app’s implementation. This mechanism lets them collaborate through explicit public contracts while preserving those boundaries.

For example, Transfers may need account details owned by Accounts. Transfers sends a request through the shared communication abstraction; Accounts handles it using its own logic and returns the agreed result. Transfers knows what it can request and what response to expect, while Accounts keeps control of how that request is fulfilled.

The interaction has three parts:

1. The provider registers a capability. During bootstrap, Accounts registers a handler under a versioned endpoint and declares its required parameters.
2. The consumer calls the shared contract. Transfers uses the abstraction in Foundations, supplying the endpoint and parameters without importing Accounts.
3. Core connects the two. Its registry locates the handler, checks required parameters, and dispatches the call. The result returns to Transfers in a common response envelope.

The same boundary supports two kinds of collaboration:

- Request data or an operation with `request`. A micro app asks another to perform a feature-owned action or return information.
- Request a ready-made widget with `getWidget`. A micro app composes UI supplied and maintained by another team.

A federated Home illustrates the second case. Cards registers a banner factory at `/cards/v1/home-banner`. Home requests that widget and places it in its layout without importing Cards’ concrete banner class. Cards owns the banner’s behavior, data loading, and interactions; Home owns its placement and fallback.

![Federated Home: independent micro apps compose one experience; Home obtains Cards’ banner through InterModuleCommunication at /cards/v1/home-banner.](/blog/modular-flutter-architecture/federated-home.jpg)

Both methods receive an `InterModuleEndpoint` with a `url` and `parameters`, and return an `InterModuleCommunicationResponse<T>`. Status codes make outcomes explicit, including `400` for missing or invalid required parameters and `404` when an endpoint is unavailable. A standalone example can register a compatible stub to exercise the consumer independently.

The isolation is at the package and implementation boundary. These micro apps are composed into the same application, and communication happens in process. Teams still coordinate the public endpoint contracts—their parameters, results, and versions—while remaining free to change the implementations behind them.

Use this mechanism for collaboration around feature-owned capabilities. Shared application context, such as session state or current-user information, belongs behind dedicated Foundations abstractions.

InterModuleCommunication is a descriptive name used in this article for an application-owned abstraction.

![Section 08 — Core Package: shared adapters and configurable bootstrap.](/blog/modular-flutter-architecture/08-core-package.jpg)

Core contains reusable implementations of the Foundations abstractions: third-party SDK adapters, the communication registry and dispatcher, and shared initialization logic.

Its bootstrap creates and connects these implementations according to host configuration. Both the App Shell and every example call this same bootstrap, selecting the appropriate environment and reporting behavior. Feature packages do not bootstrap Core themselves.

The communication implementation maintains request-handler and widget-factory registries keyed by URL, rejecting duplicate URLs within each registry. For both paths, Core first resolves the URL (`404` if unregistered), then checks the provider’s declared required parameters (`400` if a key is absent or its value is null), and only then invokes the handler or factory. Providers validate types, formats, and business rules, returning `400` for invalid values. Core translates unexpected handler or factory exceptions into `500` responses while recording diagnostic details internally. Errors during a returned widget’s later build or asynchronous loading belong to that component’s own error handling. Core manages dispatch; each micro app supplies its own handlers and widget factories.

![Section 09 — Third-party packages and SDKs: reuse adapters and keep dependency versions aligned.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

External packages sit behind Core’s adapters for the capabilities abstracted by Foundations. Examples and the App Shell reuse those adapters rather than maintaining separate implementations that can drift apart.

Sharing a package does not, by itself, guarantee identical resolved dependency versions. A [Dart Pub workspace](https://dart.dev/tools/pub/workspaces) provides one dependency resolution and a shared lockfile for its member packages. Include the shell and examples in that workspace to keep their Dart dependencies aligned. Native build settings and platform dependencies still require coordinated configuration and integration checks.

## Inter-module communication in practice

Consider Micro App A requesting details owned by Micro App B. Module B owns `/module-b/v1/details`, including the meaning of its `id` field and the structure of its response.

The following Dart snippets illustrate an application-owned API. They show the Foundations contract, a request between two modules, and a federated Home that obtains a Cards banner. The Core implementation and Flutter startup code are omitted for clarity.

### Define the contract in Foundations

The endpoint and response envelope belong to Foundations. `InterModuleEndpoint` groups the destination URL, optional call parameters, and the required parameter names providers declare at registration; the URL is an in-process registry key, not a network address. Providers pass that same type when registering, so consumers cannot bypass validation by omitting the declaration. Parameter schemas use primitive values, lists, and maps rather than provider-specific Dart objects.

The generic response preserves the result type: operations return provider-owned data maps, while widget factories return Flutter widgets. Foundations does not define Module B’s business model or Cards’ concrete banner class.

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

For both dispatch methods, Core checks the `requiredParameters` stored from registration before calling the provider. If any declared key is absent or null, it returns a response of the corresponding result type with `statusCode: 400`, `errorCode: 'missing_required_parameters'`, and no data. An empty string is present but may still be invalid according to the provider’s schema. Successful responses in these examples use `200` and include non-null data.

The `.instance` accessor keeps the usage example concise. In application code, passing the abstraction into constructors makes dependencies explicit and tests easier to isolate. The singleton is a wiring choice, not a requirement of this architecture.

### Register the endpoint inside Micro App B

The host invokes Module B’s bootstrap, which calls this registration function. Module B supplies the handler; Core stores it in the registry.

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

Register handlers before dependent flows become available. If an example includes Module B, it invokes Module B’s own bootstrap. If it uses a substitute, the example registers a compatible stub instead of the real handler for that endpoint.

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

Micro App A imports Foundations and understands Module B’s published schema. It does not import Module B’s feature package or know how Core locates the handler. The example returns simple text to keep the interaction visible; a real feature can map these outcomes into its own state and localized UI.

### Give every outcome a clear meaning

Both `request` and `getWidget` use the following convention, borrowing familiar meanings from [HTTP status codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) for this in-process API. These are application-level statuses, not actual HTTP responses.

| Status | Meaning in this design | Produced by |
| --- | --- | --- |
| `200` | The call succeeded; `data` contains the result map or widget. | The module handler or widget factory. |
| `400` | Required parameters are missing/null (`missing_required_parameters`), or supplied values are invalid (for example, `invalid_id` or `invalid_card_id`). | Core for required-parameter checks; the provider for value validation. |
| `404` | The endpoint is not registered, or the requested item does not exist. `errorCode` distinguishes the cases. | Core or the provider. |
| `500` | An unexpected failure prevented completion. | Core when a handler or factory throws an unexpected exception. |

When Module B is absent, Core returns `404` with `errorCode: 'endpoint_not_registered'`. That behavior lets Micro App A offer an intentional fallback. Raw exceptions and internal implementation details should stay in diagnostics rather than becoming the public response.

Endpoint versioning, parameter validation, and contract tests help both teams evolve safely. A versioned path provides a place to introduce an incompatible contract; compatibility still depends on how providers and consumers maintain it.

### Compose a federated Home with a Cards banner

During bootstrap, the Cards micro app registers a factory for its ready-made banner. `CardsHomeBanner` represents an existing widget owned by that team; its implementation stays inside Cards. In this example, its constructor accepts a `cardId` to select which card to display.

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

The Home micro app requests the component through Foundations and adds it to its layout:

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

For example, a call without the required configuration produces a structured failure:

```dart
final response = InterModuleCommunication.instance.getWidget(
  endpoint: const InterModuleEndpoint(url: '/cards/v1/home-banner'),
);
// With Cards registered:
// response.statusCode == 400
// response.errorCode == 'missing_required_parameters'
// response.data == null
```

Core invokes the registered factory synchronously. The component in a successful response joins [Flutter’s widget tree](https://api.flutter.dev/flutter/widgets/Widget-class.html) normally; any asynchronous data loading and its loading or error UI remain inside the Cards component. Its factory or widget must provide any Cards-specific dependencies it needs, and the teams agree on layout constraints, navigation, and required host context. Home imports Foundations and Flutter, without importing `CardsHomeBanner`.

If Cards is absent, `getWidget` returns `404` with `endpoint_not_registered`. Omitting `cardId` or supplying null returns `400` with `missing_required_parameters` before the factory runs; an empty or incorrectly typed `cardId` returns `400` with `invalid_card_id` from Cards. Home omits the banner on failure in this example; it can instead map each status to a fallback. A standalone Home example can register a compatible stub factory under the same URL. The composition uses modules packaged into the same application; no widget code is downloaded at runtime.

## Make the boundaries work for the team

The value of this structure comes from a repeatable workflow: implement a feature behind a clear boundary, exercise it in a standalone example, and integrate it through the App Shell using the same shared adapters.

Foundations gives teams a stable vocabulary. Core connects that vocabulary to concrete technology. Micro apps retain ownership of their feature behavior and contracts, while the host decides how the product is assembled.

That gives modularity a practical purpose: teams can change, test, and understand their part of the application with greater confidence about how it connects to the rest.
