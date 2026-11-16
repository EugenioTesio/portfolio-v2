# Plan: Flutter A2UI playground

Companion in `examples/flutter-a2ui-playground`. Articles in `src/content/blog/{en,es}/flutter-a2ui-playground.md`. Figures in `public/blog/flutter-a2ui-playground/`. Cover in `src/assets/images/blog/`. Social image in `public/og/flutter-a2ui-playground.jpg`.

The embed stays the existing `BlogDemo` iframe, the `/blog/:slug/demo` route, and the locale reload that keeps the iframe mounted. `scripts/build-demo.mjs` builds this example with `--base-href /demos/flutter-a2ui-playground/` and `--pwa-strategy=none`, then deletes `flutter_service_worker.js`. Generated `public/demos/flutter-a2ui-playground/` and the zip are gitignored. Firebase sends `Cache-Control: no-cache` for that demo path.

Pins: `a2ui_flutter` 0.3.0, `a2ui_core` 0.7.0, `a2ui_agent` 0.3.0, `dartantic_ai` 3.4.2, protocol 1.0, Flutter 3.47.9 / Dart 3.13.7. The model writes Direct JSON. There is no CopilotKit server, design-system picker, chart, or map.

Replay messages live in `scenarios.dart`. The session attaches each surface to its turn, lists the applied payload one component per line, and sends live actions back to the model. The signup action is handled by the app.
