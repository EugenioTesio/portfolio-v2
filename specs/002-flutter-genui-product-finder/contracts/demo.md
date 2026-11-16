# Demo contract

Article `/blog/flutter-a2ui-playground`. Dedicated page `/blog/flutter-a2ui-playground/demo`. Runtime `/demos/flutter-a2ui-playground/index.html?lng=en|es`. Download `/downloads/flutter-a2ui-playground.zip`.

The iframe posts `{ "type": "flutter-demo-ready" }` to the parent origin. The parent checks `event.origin` and `event.source`. Changing `lng` keeps the iframe mounted and reloads it.

Replay labels are `REPLAY · Recorded` and `REPRODUCCIÓN · Grabado`. The three chips submit the localized prompts. Other text in replay explains that a key is required. Reset clears the transcript and the key field.

Hosting: `Cache-Control: no-cache` on `/demos/flutter-a2ui-playground/**`. No service worker file is shipped. A missing `flutter_service_worker.js` can still fall through to the SPA rewrite.
