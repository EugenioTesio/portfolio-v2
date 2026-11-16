# Verification: Flutter A2UI playground

Recorded: 2026-11-16.

## Commands

- `flutter --version` in `examples/flutter-a2ui-playground`: Flutter 3.47.9, Dart 3.13.7, engine revision 89c39edfdf. Exit 0.
- `flutter analyze`: `No issues found!` Exit 0.
- `flutter test`: 10 tests passed (`session_test.dart`, `widget_test.dart`). Exit 0. Coverage includes the three replay prompts, the free-form key hint, Spanish signup copy, chunked Direct JSON, the live signup follow-up, recoverable schema and incomplete payloads, disposal, the narrow UI / A2UI swap, and clearing the masked key on reset.
- `npm run lint` (`tsc --noEmit`): Exit 0.
- `npm run build` (`build:demo`, Vite, `prerender-og.mjs`): Exit 0. Flutter web release compiled with `--base-href /demos/flutter-a2ui-playground/` and `--pwa-strategy=none`. The script reported `Prepared demo and source ZIP: flutter-a2ui-playground`. Prerender wrote `dist/blog/flutter-a2ui-playground/index.html`. The build printed the existing non-fatal notices: deprecated `--pwa-strategy`, a missing CupertinoIcons font, and the wasm dry run.

## Language reload

`BlogArticlePage` clears the article only when the slug changes. `BlogDemo` is not remounted with a locale key. The iframe key remains `` `${locale}-${attempt}` ``.

Checked on `http://localhost:3000/blog/flutter-a2ui-playground?lng=en` after **Run demo**:

- Switching to Spanish kept a single iframe mounted. **Run demo** did not return. `src` became `/demos/flutter-a2ui-playground/index.html?lng=es`.
- The article title became “Playground de A2UI en Flutter: mirá cómo un agente escribe la interfaz”.
- The reloaded Flutter session was empty and labeled `REPRODUCCIÓN · Grabado`.

## Replay in the embedded English demo

On the same article, after the ready message dismissed “Loading the Flutter demo…”:

- Status read `REPLAY · Recorded`.
- **Q3 sales by region as a dashboard** showed EMEA USD 4.2M, Americas USD 3.6M, APAC USD 2.1M, and the illustrative caption.
- **Compare three noise-cancelling headphones** showed Nimbus ANC · USD 249 · 30 h, Harbor Quiet · USD 189 · 24 h, and Field One · USD 129 · 20 h.
- **A signup form with a plan choice**, then **Team** and **Create account**, replaced the form with `Request received (on the Team plan). Illustrative data. No account was created.`
- **Reset and clear key** cleared the transcript and left the status on `REPLAY · Recorded`.

The name field was not filled from the browser. Synthetic DOM input does not update Flutter’s text controller. The widget test enters “Ada” and expects `Request received for Ada (on the Team plan)`.

## Replay in Spanish

After the language switch, in the fresh replay session:

- **Ventas del tercer trimestre por región, como un tablero** showed the localized amounts, including América 3,6 millones USD and APAC 2,1 millones USD.
- **Compará tres auriculares con cancelación de ruido** showed the same three headphones.
- **Un formulario de registro con elección de plan**, then **Team** and **Crear cuenta**, showed `Recibimos el pedido (plan Team). Datos ilustrativos. No se creó una cuenta.`

## Routes and layout

- Dedicated page `http://localhost:3000/blog/flutter-a2ui-playground/demo?lng=es` opened the iframe immediately, titled “Probá el playground de A2UI | Eugenio Tesio”, with “Volver al artículo”, “Descargar código” (`/downloads/flutter-a2ui-playground.zip`), and “Abrir la app de Flutter directamente”. A fresh navigation to that URL kept the route and the iframe. The Spanish dashboard chip rendered there.
- At a 390×844 viewport, the dedicated Spanish page had no horizontal overflow (`scrollWidth` 390 matched `clientWidth`). The iframe was 364px wide and showed the **UI** / **A2UI** control. Choosing **A2UI** hid the dashboard text, and **UI** restored it. The iframe itself did not overflow.
- The English article at the same viewport had no horizontal overflow, and no image, figure, code block, or iframe was wider than the page.
- Device metrics were cleared after the narrow check.
- `navigator.serviceWorker.getRegistrations()` was empty. `localStorage` held the portrait path and `portfolio-locale` only. `sessionStorage` was empty. The URL contained no key.

## Credentials and download

The ZIP contains 27 entries and only `lib/`, `test/`, `tool/`, `web/`, `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, `README.md`, and `LICENSE`. A scan of the ZIP and of `public/demos/flutter-a2ui-playground` and `dist/demos/flutter-a2ui-playground` found no `AIza…`, `sk-…`, or `GEMINI_API_KEY=` values. The three `apiKey` hits in the ZIP are the `connect(String apiKey)` parameter, `apiKey.trim()`, and `GoogleProvider(apiKey: key)`. `flutter_service_worker.js` is absent from the demo output. `index.html` has `<base href="/demos/flutter-a2ui-playground/">`.

`GEMINI_API_KEY`, `GOOGLE_API_KEY`, `GOOGLE_GENAI_API_KEY`, and `GEMINI_KEY` were unset. Live Gemini was not exercised. The session tests cover the parser and the action follow-up with a fake stream, and the widget test checks that a typed test key disappears from the tree.

`firebase.json` sends `Cache-Control: no-cache` for `/demos/flutter-a2ui-playground/**`. The hosting emulator was not started again for this pass.

## Social metadata

`public/og/flutter-a2ui-playground.jpg` is 1200×630. `dist/blog/flutter-a2ui-playground/index.html` includes `og:title` “Flutter A2UI Playground: Watch an Agent Write UI | Eugenio Tesio”, `og:image` `https://eugenio-tesio-porfolio.web.app/og/flutter-a2ui-playground.jpg`, and `og:image:width` / `height` 1200 / 630.
