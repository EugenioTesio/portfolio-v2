A growing Flutter application brings a familiar challenge: more features, more teams, and more changes competing for the same codebase. A small update to **Accounts** can unexpectedly affect **Transfers**. Testing one flow can mean starting the whole application, signing in, and reproducing a very specific user state.

**Modular architecture** gives each feature a clear boundary. Teams build self-contained **micro apps**, and a parent application—the **App Shell**—assembles them into one product and coordinates navigation and user journeys. The idea is close to **micro frontends**. On mobile, the modules are packaged into the same application and share its dependency resolution and native build.

Independence still needs collaboration. Transfers may need information that Accounts owns, even when different teams maintain them. Both may need the same **design system**, authentication context, and analytics. The architecture has to support those relationships without one feature importing another feature’s implementation.

What follows separates **what a module needs** from **how the application provides it**. **Foundations** defines shared contracts and UI building blocks. **Core** supplies reusable implementations. The App Shell and standalone examples decide how those implementations are configured.

## The architecture

![Modular Flutter architecture diagram: the App Shell and examples bootstrap Core and host micro apps; micro apps depend on Foundations; Core implements abstractions and uses third-party packages and SDKs.](/blog/modular-flutter-architecture/architecture.jpg)

Arrows show the main package dependency directions. The App Shell and examples compose features and bootstrap Core. Micro apps depend on Foundations; Core implements its abstractions. The three items inside Foundations are responsibilities of that package, not separate implementation packages.

> **The key boundary:** a micro app knows the capabilities it can use, but not which SDK or concrete implementation provides them.

## Component breakdown

![Section 01 — App Shell: assemble modules and orchestrate the product experience.](/blog/modular-flutter-architecture/01-app-shell.jpg)

The **App Shell** is the **composition root**: it chooses concrete implementations and connects them to their consumers. It assembles **micro apps**, starts the product, and orchestrates journeys that cross features. The **Core Package bootstrap** configures shared dependencies for development, staging, or production, and installs inter-module communication before those micro apps initialize. Each one then registers its **request handlers** and **widget factories**. Exposed behavior and UI stay with the feature that provides them.

![Section 02 — Micro Apps: own a feature and keep a clear boundary.](/blog/modular-flutter-architecture/02-micro-apps.jpg)

A **micro app** owns one capability, such as Accounts or Transfers: its presentation, logic, and models. It exposes **routes**, localization delegates, initialization hooks, and endpoint registration. The feature package depends on Foundations and does not import Core or another micro app, so the team can build and test it alone, with the internal architecture and state management that fit. That boundary complements the UI, data, and business split in [Flutter’s architecture guidance](https://docs.flutter.dev/app-architecture/recommendations).

![Section 03 — Micro App Examples: run a feature and reproduce hard-to-reach flows.](/blog/modular-flutter-architecture/03-micro-app-examples.jpg)

A **standalone example** is a small host. It runs Core’s bootstrap, selects dependencies, and mounts the feature, so a reviewer can open one screen or a flow that would otherwise need a feature flag. It may compose Authentication and Accounts for real authenticated requests; those dependencies belong to the example, not the feature package. Examples use the **same Core package and SDK adapters** as the App Shell, and can swap analytics and crash reporting for console or no-op implementations.

![Section 04 — Foundations: shared contracts and a common visual language.](/blog/modular-flutter-architecture/04-foundations.jpg)

**Foundations** is the shared surface every micro app consumes: **abstractions**, the **Design System**, and **InterModuleCommunication**. Authentication and permissions get strongly typed contracts here. Feature models stay in the owning module, so an Accounts change does not change Foundations. Its public surface should stay deliberate and stable.

![Section 05 — Abstractions: own the contract and choose the implementation.](/blog/modular-flutter-architecture/05-abstractions.jpg)

An **abstraction** names a capability in the application’s language—analytics, storage, app information, camera, or navigation—not a vendor API. **AppInfo** can expose the version; a Core adapter reads it with [package_info_plus](https://pub.dev/packages/package_info_plus), and micro apps never see that package. Injecting the contract is **inversion of control**: the host supplies the implementation, tests supply a fake, and an SDK change stays in the adapter. Apply it where it protects a real capability, not on every Flutter widget or a copy of Riverpod or BLoC.

![Section 06 — Design System: consistent components and flexible themes.](/blog/modular-flutter-architecture/06-design-system.jpg)

The **Design System**, inside Foundations, provides components, themes, typography, spacing, and **design tokens**. **Primitive tokens** hold base values, such as a palette. **Semantic tokens** hold intent, such as an error background or a primary action. Components consume those roles, so a theme or brand changes in one place. Atoms, molecules, organisms, and templates can organize the system, with accessibility built into the shared components.

![Section 07 — Inter-module communication: register capabilities and request data or widgets.](/blog/modular-flutter-architecture/07-inter-module-communication.jpg)

**InterModuleCommunication** lets micro apps collaborate without importing each other. Each one still owns its logic, models, and UI. Transfers can ask Accounts for account details through that contract: Transfers knows the request and the response, and Accounts decides how to fulfill it.

1. **Register.** During bootstrap, Accounts registers a handler on a versioned endpoint and declares the required parameters.
2. **Call.** Transfers uses the Foundations contract and does not import Accounts.
3. **Dispatch.** Core’s registry finds the handler, checks those parameters, and returns one response envelope.

- **`request`** asks for data or a feature-owned operation.
- **`getWidget`** asks for a widget another team builds and maintains.

A **federated Home** uses the second. Cards registers a banner factory at `/cards/v1/home-banner`. Home places that widget without importing Cards’ class. Cards owns behavior, loading, and interactions. Home owns placement and the fallback.

![Federated Home: independent micro apps compose one experience; Home obtains Cards’ banner through InterModuleCommunication at /cards/v1/home-banner.](/blog/modular-flutter-architecture/federated-home.jpg)

Both methods take an `InterModuleEndpoint` (`url` and `parameters`) and return an `InterModuleCommunicationResponse<T>`. `400` means missing or invalid parameters. `404` means the endpoint is unavailable. A standalone example can register a stub and exercise the consumer alone. Communication is **in process**, inside one packaged application. Teams agree on parameters, results, and versions, and can change the code behind that contract. **InterModuleCommunication** is this article’s name for it. Session state and the current user belong on their own Foundations abstractions.

![Section 08 — Core Package: shared adapters and configurable bootstrap.](/blog/modular-flutter-architecture/08-core-package.jpg)

**Core** implements Foundations: SDK adapters, the communication registry and dispatcher, and shared startup. **Bootstrap** builds them from the host’s configuration. The App Shell and every example call it; feature packages do not. Registries are keyed by URL and reject duplicates. Core resolves the URL (`404` if missing), checks required parameters (`400` if a key is absent or null), then invokes the handler or factory. Providers return `400` for invalid values. Unexpected exceptions become `500`, with the diagnostic kept inside Core. Later build or loading errors belong to the returned widget.

![Section 09 — Third-party packages and SDKs: reuse adapters and keep dependency versions aligned.](/blog/modular-flutter-architecture/09-third-party-sdks.jpg)

External packages sit behind those adapters, so the shell and the examples share one implementation. Include both in a [Dart Pub workspace](https://dart.dev/tools/pub/workspaces) so they share one resolution and one lockfile. Native build settings and platform dependencies still need coordinated configuration.

## Inter-module communication in practice

Micro App A asks Module B for `/module-b/v1/details`. Module B owns the meaning of `id` and the response shape. The snippets are the Foundations contract, one cross-module request, and a federated Home. Core and Flutter startup are omitted.

### Define the contract in Foundations

`InterModuleEndpoint` carries the URL—an in-process registry key, not a network address—the call parameters, and the required names declared at registration. Providers register with that same type, so a consumer cannot skip the check. Parameters are primitives, lists, and maps. The generic response keeps the result type: a data map, or a Flutter widget. Foundations does not define Module B’s model or Cards’ banner class.

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

Core checks the stored `requiredParameters` before calling the provider. A missing or null key is `400` with `missing_required_parameters` and no data. An empty string counts as present and may still be invalid. Success here is `200` with non-null data. Pass the abstraction through constructors in application code. `.instance` only keeps these samples short, and the singleton is a wiring choice, not part of the architecture.

### Register the endpoint inside Micro App B

Module B’s bootstrap registers the handler. Core stores it.

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

Register handlers before dependent flows. An example either runs Module B’s bootstrap or registers a compatible stub.

### Request it from Micro App A

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

Micro App A imports Foundations and Module B’s published schema, not Module B’s package. A real feature maps each outcome into its own state and UI.

### Give every outcome a clear meaning

`request` and `getWidget` borrow [HTTP status codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) for this in-process API. They are application statuses, not HTTP responses.

| Status | Meaning in this design | Produced by |
| --- | --- | --- |
| `200` | The call succeeded; `data` contains the result map or widget. | The module handler or widget factory. |
| `400` | Required parameters are missing/null (`missing_required_parameters`), or supplied values are invalid (for example, `invalid_id` or `invalid_card_id`). | Core for required-parameter checks; the provider for value validation. |
| `404` | The endpoint is not registered, or the requested item does not exist. `errorCode` distinguishes the cases. | Core or the provider. |
| `500` | An unexpected failure prevented completion. | Core when a handler or factory throws an unexpected exception. |

A missing Module B is `404` with `endpoint_not_registered`, so the caller can fall back on purpose. Exceptions stay in diagnostics. Version the path, validate parameters, and cover the contract with **contract tests**.

### Compose a federated Home with a Cards banner

Cards registers a factory for `CardsHomeBanner`, which stays inside Cards and takes a `cardId`.

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

Home requests the component through Foundations and adds it to its layout:

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

Omitting `cardId` is `400` with `missing_required_parameters` before the factory runs. Core calls the factory synchronously. The widget joins [Flutter’s widget tree](https://api.flutter.dev/flutter/widgets/Widget-class.html) as usual, and async loading stays inside it. The teams agree on layout, navigation, dependencies, and host context. Home imports Foundations and Flutter, not `CardsHomeBanner`.

A missing Cards module is `404` with `endpoint_not_registered`. A bad `cardId` is `400` with `invalid_card_id`. Home can omit the banner or map each status to a fallback, and a standalone example can register a stub at the same URL. No widget code is downloaded at runtime.

## Make the boundaries work for the team

Implement a feature behind a clear boundary, exercise it in a **standalone example**, and integrate it through the **App Shell** with the same adapters. **Foundations** is the shared vocabulary. **Core** connects it to concrete technology. **Micro apps** keep their behavior and their contracts, so a team can change its part of the product and still see how that part connects to the rest.
