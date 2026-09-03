# Migrating Monoliths to Flutter Micro-App & App Shell Architecture

**Published:** October 18, 2024  
**Author:** Eugenio Tesio  
**Read Time:** 7 min read  
**Topic:** Flutter Architecture & Enterprise Scale  

---

When scaling mobile engineering from a single squad to **50+ engineers** working across cross-functional streams (such as retail banking, enterprise accounts, loans, and investments), the classic monolithic Flutter project quickly collapses under its own weight. 

At **ueno bank**, our core challenge was decoupling high-velocity feature teams while preserving a unified, rock-solid security and design foundation. Here is how we designed and executed the migration from a monolith to a **Micro-App & App Shell Architecture**.

```
                   +-----------------------------+
                   |       App Shell             |
                   |  (Routing, Auth, Security)  |
                   +--------------+--------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
+--------v--------+      +--------v--------+      +--------v--------+
|  Micro-App:     |      |  Micro-App:     |      |  Micro-App:     |
|  Retail Banking |      |  Corporate Core |      |  Payments & QR  |
+--------+--------+      +--------+--------+      +--------+--------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                   +--------------v--------------+
                   |      Core Shared Kit        |
                   |  (Design System, Network)   |
                   +-----------------------------+
```

## Why Monoliths Break at Scale

1. **Merge Conflicts & PR Bottlenecks:** Multiple teams touching the same route registry, theme files, and global dependency trees.
2. **Build Times:** A change in an isolated corporate loans screen forced full re-indexing and long CI test suites across the whole codebase.
3. **Architectural Drift:** Different squads inevitably introduced conflicting state management decisions (such as BLoC vs Riverpod) without a clear boundary.

## The Solution: The App Shell Pattern

The **App Shell** is the single compile-target application that orchestrates:
- Global authentication tokens and session lifecycles.
- Deep linking, navigation orchestration, and route guards.
- Core telemetry (New Relic, Instabug) and RASP security monitors.

Each business domain is extracted into an autonomous **Micro-App package** housed in a multi-repo ecosystem.

### Architectural Rules for Micro-Apps

- **Zero Cross-Micro-App Dependencies:** Micro-App A (Retail) can never import Micro-App B (Corporate).
- **Communication via Contracts:** Inter-module communication occurs exclusively via events or abstract interfaces published in a shared contract library.
- **Independent Compilability:** Each micro-app has an internal `example/` runner allowing developers to boot, hot-reload, and run golden widget tests on their module in under 3 seconds.

```dart
abstract class PaymentMicroAppContract {
  Future<PaymentResult> initiateTransfer({
    required String recipientId,
    required double amount,
    required String currency,
  });
}
```

## Harmonizing BLoC and Riverpod

One of our biggest achievements was unifying two distinct developer ecosystems: squads that mastered **BLoC** (for event-driven transactional flows) and squads utilizing **Riverpod** (for reactive state and dependency injection).

By formalizing adapter boundaries at the App Shell level, both paradigms co-exist gracefully without memory leaks or state collisions.

## Key Outcomes

- **Deployment Velocity:** Squads run their own PR pipelines with specialized GitHub Actions in under **4 minutes**.
- **Onboarding Speed:** New mobile engineers start shipping code within their targeted micro-app on day two without navigating a million-line monolith.
- **Release Predictability:** Feature freezes are isolated to specific versioned packages, fueling our **15-day Release Train**.
