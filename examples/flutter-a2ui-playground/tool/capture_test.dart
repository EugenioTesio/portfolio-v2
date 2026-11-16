// Optional deterministic capture:
// SCREENSHOT_OUTPUT=/absolute/path.png
// SCREENSHOT_STEP=dashboard|signup|source
// SCREENSHOT_LANG=en|es
// flutter test tool/capture_test.dart
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_a2ui_playground/main.dart';
import 'package:flutter_a2ui_playground/scenarios.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> _load(String family, List<String> paths) async {
  final loader = FontLoader(family);
  for (final path in paths) {
    final file = File(path);
    if (!file.existsSync()) continue;
    loader.addFont(Future.value(ByteData.sublistView(file.readAsBytesSync())));
  }
  await loader.load();
}

void main() {
  testWidgets('capture the running replay', (tester) async {
    final output = Platform.environment['SCREENSHOT_OUTPUT'];
    if (output == null) return;
    final fonts = Platform.environment['FLUTTER_ROOT'] ?? '/Users/Apple/fvm/versions/stable';
    final material = '$fonts/bin/cache/artifacts/material_fonts';
    await _load('Roboto', [
      '$material/Roboto-Regular.ttf',
      '$material/Roboto-Medium.ttf',
      '$material/Roboto-Bold.ttf',
    ]);
    await _load('MaterialIcons', ['$material/MaterialIcons-Regular.otf']);
    await _load('monospace', ['/System/Library/Fonts/Supplemental/Courier New.ttf']);
    final es = Platform.environment['SCREENSHOT_LANG'] == 'es';
    final step = Platform.environment['SCREENSHOT_STEP'] ?? 'dashboard';
    tester.view.physicalSize = Size(step == 'source' ? 720 : 1100, step == 'source' ? 860 : 700);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final key = GlobalKey();
    await tester.pumpWidget(
      RepaintBoundary(
        key: key,
        child: PlaygroundApp(es: es),
      ),
    );
    final prompt = switch (step) {
      'signup' => signupPrompt(es),
      'source' => dashboardPrompt(es),
      _ => dashboardPrompt(es),
    };
    await tester.tap(find.text(prompt));
    await tester.pumpAndSettle();
    if (step == 'source') {
      await tester.tap(find.text('A2UI'));
      await tester.pumpAndSettle();
    }
    await tester.runAsync(() async {
      final image = await (key.currentContext!.findRenderObject()
              as RenderRepaintBoundary)
          .toImage();
      final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
      await File(output).writeAsBytes(bytes!.buffer.asUint8List());
      image.dispose();
    });
  });
}
