# Research: Flutter A2UI playground

**Date**: 2026-11-16

Flutter’s `genui` package is deprecated in favor of `a2ui_core`, `a2ui_agent`, and `a2ui_flutter`. The API is not a rename of `GenUiConversation`. This example uses protocol 1.0.

`basicCatalog()` in `a2ui_flutter` 0.3.0 is the v1.0 basic catalog. `derive` can keep a subset of components and drop every function. v1.0 bindings use `@path`. `Text.variant` is `body` or `caption`. Component ids must be UAX #31 identifiers.

The CopilotKit A2UI playground is the interaction being adapted: chat, inline rendered answer, payload beside it, and a recorded run before any key is spent. That app’s default encoding is Express, and it includes a design-system picker, charts, and maps. This Flutter example does not port those. It follows the official `a2ui_flutter` example, which prompts and parses Direct JSON with `gemini-3.6-flash`.

`MessageProcessor` applies a list of messages and emits `onSurfaceCreated` and `onAction`. `A2uiSurface` renders a surface. Streaming uses `A2uiRequestProcessor.openStream` and `AgentToRendererMessagePayload.of`. The processor’s default graph checks allow a surface to arrive across messages; the session still requires a known root after the stream closes.

No site-owned model key is available. Live Gemini stays unverified unless a visitor key is supplied at runtime. The key stays in the `Agent` and is dropped on reset, dispose, or iframe reload.
