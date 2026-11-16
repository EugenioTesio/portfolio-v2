import 'package:flutter/material.dart';
import 'package:flutter_a2ui_playground/main.dart';
import 'package:flutter_a2ui_playground/scenarios.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('replay dashboard and source lines render together', (tester) async {
    tester.view.physicalSize = const Size(1200, 1400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const PlaygroundApp());
    expect(find.text('REPLAY · Recorded'), findsOneWidget);
    await tester.tap(find.text(dashboardPromptEn));
    await tester.pumpAndSettle();
    expect(find.text('EMEA'), findsOneWidget);
    expect(find.text('USD 4.2M'), findsOneWidget);
    expect(find.text('Illustrative data.'), findsWidgets);
    expect(find.textContaining('"component":"BarChart"'), findsWidgets);
  });

  testWidgets('signup action confirms the name that was entered', (tester) async {
    tester.view.physicalSize = const Size(1200, 1600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const PlaygroundApp());
    await tester.tap(find.text(signupPromptEn));
    await tester.pumpAndSettle();
    await tester.enterText(_field('Name'), 'Ada');
    await tester.tap(find.text('Team'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Create account'));
    await tester.pumpAndSettle();
    expect(find.textContaining('Request received for Ada'), findsWidgets);
    expect(find.textContaining('Team'), findsWidgets);
  });

  testWidgets('a narrow viewport swaps the UI and A2UI panes', (tester) async {
    tester.view.physicalSize = const Size(420, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const PlaygroundApp());
    await tester.tap(find.text(comparePromptEn));
    await tester.pumpAndSettle();
    expect(find.text('Nimbus ANC · USD 249 · 30 h'), findsOneWidget);
    await tester.tap(find.text('A2UI'));
    await tester.pumpAndSettle();
    expect(find.text('Nimbus ANC · USD 249 · 30 h'), findsNothing);
    expect(find.textContaining('"component":"Card"'), findsWidgets);
    await tester.tap(find.text('UI'));
    await tester.pumpAndSettle();
    expect(find.text('Nimbus ANC · USD 249 · 30 h'), findsOneWidget);
  });

  testWidgets('Spanish controls and reset remove the live credential field', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1200, 1400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const PlaygroundApp(es: true));
    expect(find.text('REPRODUCCIÓN · Grabado'), findsOneWidget);
    await tester.tap(find.text('Usar mi clave de Gemini'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const Key('gemini-key')), 'TEST_ONLY_NOT_A_REAL_KEY');
    await tester.tap(find.text('Activar modo en vivo'));
    await tester.pumpAndSettle();
    expect(find.text('EN VIVO · Gemini'), findsOneWidget);
    expect(find.text('TEST_ONLY_NOT_A_REAL_KEY'), findsNothing);
    await tester.tap(find.text('Reiniciar'));
    await tester.pumpAndSettle();
    expect(find.text('REPRODUCCIÓN · Grabado'), findsOneWidget);
    await tester.tap(find.text('Usar mi clave de Gemini'));
    await tester.pumpAndSettle();
    expect(
      tester.widget<TextField>(find.byKey(const Key('gemini-key'))).controller!.text,
      isEmpty,
    );
  });
}

Finder _field(String label) => find.byWidgetPredicate(
  (widget) => widget is TextField && widget.decoration?.labelText == label,
);
