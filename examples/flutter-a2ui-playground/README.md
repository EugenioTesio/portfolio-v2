# Flutter A2UI playground / Playground de A2UI

A bilingual chat that renders answers as A2UI surfaces and shows the payload beside them. Flutter 3.47.9 / Dart 3.13.7. Protocol 1.0.

## Run / Ejecutar

```sh
flutter pub get --enforce-lockfile
flutter run -d chrome
flutter analyze
flutter test
```

Use `?lng=es` in the browser URL for Spanish. Usá `?lng=es` para español.

Replay is the public default. It plays three recorded prompts: a regional sales dashboard, a comparison of three headphones, and a signup form. The figures are illustrative. Any other prompt explains that free-form requests need a Gemini key. The signup button is an application-handled action; replay answers it with a recorded confirmation. No account is created.

La reproducción es el modo público. Ejecuta tres pedidos grabados: un tablero de ventas por región, una comparación de tres auriculares y un formulario de registro. Las cifras son ilustrativas. Cualquier otro pedido explica que las consultas libres necesitan una clave de Gemini. El botón de registro es una acción de la aplicación; la reproducción responde con una confirmación grabada. No se crea una cuenta.

## Optional live Gemini / Gemini opcional

Select Use my Gemini key and enter your own key. Requests go directly to Google using your account and may incur usage charges. The key remains only in memory; reset or reload removes the session. No site-owned key is included. Do not distribute a build containing a private key. The model is `gemini-3.6-flash` unless `GEMINI_MODEL` is set, and it writes Direct JSON.

Seleccioná Usar mi clave de Gemini e ingresá tu propia clave. Las consultas van directamente a Google con tu cuenta y pueden consumir saldo. La clave queda solo en memoria; reiniciar o recargar elimina la sesión. No se incluye una clave del sitio. No distribuyas builds con claves privadas. El modelo es `gemini-3.6-flash`, salvo que definas `GEMINI_MODEL`, y escribe Direct JSON.

```sh
flutter run -d chrome --dart-define=GEMINI_MODEL=gemini-3.6-flash
```

A request failure shows a generic retry message. Raw provider exceptions are not shown, because they can contain sensitive request information.

Un error muestra un mensaje genérico para reintentar. No se muestran excepciones del proveedor, porque pueden contener información sensible de la consulta.

## Structure / Estructura

- `catalog.dart`: the basic catalog narrowed to Column, Row, Text, Card, Button, TextField, ChoicePicker, and Divider, plus a BarChart.
- `scenarios.dart`: recorded A2UI 1.0 messages and the signup confirmation.
- `session.dart`: replay, the Direct JSON Gemini stream, actions, and disposal.
- `main.dart`: transcript, source pane, and the in-memory key.

El catálogo básico queda reducido a Column, Row, Text, Card, Button, TextField, ChoicePicker y Divider, más un BarChart. Los mensajes grabados y la confirmación están en `scenarios.dart`. La sesión alterna reproducción y Gemini. La interfaz muestra la transcripción, el mensaje A2UI y la clave solo en memoria.

## Sources / Fuentes

A2UI Playground: https://a2ui-playground.copilotkit.ai/

Official Flutter example / Ejemplo oficial de Flutter: https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_flutter/example
