import 'dart:js_interop';

import 'package:web/web.dart' as web;

void notifyReady() {
  web.window.parent?.postMessage(
    {'type': 'flutter-demo-ready'}.jsify(),
    web.window.location.origin.toJS,
  );
}
