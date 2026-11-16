import 'dart:async';
import 'dart:convert';

import 'package:a2ui_core/a2ui_core.dart';
import 'package:flutter_a2ui_playground/catalog.dart';
import 'package:flutter_a2ui_playground/scenarios.dart';
import 'package:flutter_a2ui_playground/session.dart';
import 'package:flutter_test/flutter_test.dart';

String response(String id, {bool create = true, String text = 'Hello'}) =>
    '<a2ui-json>${jsonEncode([
      if (create)
        {
          'version': '1.0',
          'createSurface': {'surfaceId': id, 'catalogId': catalogId},
        },
      {
        'version': '1.0',
        'updateComponents': {
          'surfaceId': id,
          'components': [
            {'id': 'root', 'component': 'Text', 'text': text, 'variant': 'body'},
          ],
        },
      },
    ])}</a2ui-json>';

String surfaceIdOf(String prompt) =>
    RegExp(r'answer-\d+').firstMatch(prompt)!.group(0)!;

void main() {
  test('replay prompts render and other prompts ask for a key', () async {
    final session = PlaygroundSession(es: false);
    for (final prompt in replayPrompts(false)) {
      await session.ask(prompt);
      expect(session.turns.last.note, isNull);
      expect(session.turns.last.surface, isNotNull);
    }
    expect(session.turns.map((turn) => turn.surface!.id).toSet(), hasLength(3));
    expect(
      sourceLines(session.turns.first.messages).any((line) => line.contains('BarChart')),
      isTrue,
    );
    expect(
      sourceLines(session.turns[1].messages).any((line) => line.contains('Card')),
      isTrue,
    );
    await session.ask('draw a map of the office');
    expect(session.turns.last.surface, isNull);
    expect(session.turns.last.note, contains('Gemini'));
    expect(session.busy, isFalse);
    session.dispose();
  });

  test('Spanish replay uses the localized prompt', () async {
    final session = PlaygroundSession(es: true);
    await session.ask(signupPrompt(true));
    expect(session.turns.single.surface, isNotNull);
    expect(session.turns.single.note, isNull);
    final lines = sourceLines(session.turns.single.messages).join('\n');
    expect(lines, contains('Nombre'));
    expect(lines, contains('ChoicePicker'));
    session.dispose();
  });

  test('live parser streams a surface and sends an action back', () async {
    final seen = <String>[];
    final session = PlaygroundSession(
      es: false,
      generateReply: (prompt, history) async* {
        seen.add(prompt);
        final id = surfaceIdOf(prompt);
        final text = response(id, create: prompt.contains('Create surface'));
        for (var i = 0; i < text.length; i += 19) {
          yield text.substring(i, (i + 19).clamp(0, text.length));
        }
      },
    );
    session.connect('SENTINEL_KEY_VALUE');
    await session.ask('hello');
    expect(session.turns.single.note, isNull);
    expect(session.turns.single.surface?.id, 'answer-1');
    expect(session.turns.single.raw.toString(), contains('<a2ui-json>'));
    expect(jsonEncode(seen), isNot(contains('SENTINEL_KEY_VALUE')));
    session.dispose();
  });

  test('live action follow-up updates the same surface', () async {
    String? followUp;
    final session = PlaygroundSession(
      es: false,
      generateReply: (prompt, _) async* {
        final id = surfaceIdOf(prompt);
        if (prompt.contains('Create surface')) {
          yield response(id, text: 'Form');
          return;
        }
        followUp = prompt;
        yield response(id, create: false, text: 'Confirmed');
      },
    );
    await session.ask('make a form');
    final surface = session.turns.single.surface!;
    session.handleAction(
      A2uiRendererAction(
        name: 'signup',
        surfaceId: surface.id,
        sourceComponentId: 'submit',
        timestamp: DateTime.utc(2026, 11, 16),
        context: const {'name': 'Ada', 'plan': 'team'},
      ),
    );
    await _untilIdle(session);
    expect(followUp, contains('signup'));
    expect(followUp, contains('Ada'));
    expect(followUp, isNot(contains('Create surface')));
    expect(session.turns, hasLength(1));
    expect(session.turns.single.surface?.id, surface.id);
    session.dispose();
  });

  test('failed and incomplete replies stay recoverable', () async {
    var mode = 'fail';
    final session = PlaygroundSession(
      es: false,
      generateReply: (prompt, _) async* {
        if (mode == 'fail') throw StateError('PRIVATE_REQUEST_DETAIL');
        if (mode == 'broken') {
          yield '<a2ui-json>{broken</a2ui-json>';
          return;
        }
        if (mode == 'incomplete') {
          final id = surfaceIdOf(prompt);
          yield '<a2ui-json>${jsonEncode([
            {
              'version': '1.0',
              'createSurface': {'surfaceId': id, 'catalogId': catalogId},
            },
          ])}</a2ui-json>';
          return;
        }
        yield response(surfaceIdOf(prompt));
      },
    );
    await session.ask('one');
    expect(session.turns.single.note, isNotNull);
    expect(session.turns.single.note, isNot(contains('PRIVATE_REQUEST_DETAIL')));
    expect(session.busy, isFalse);
    mode = 'broken';
    await session.ask('two');
    expect(session.turns.last.note, isNot(contains('FormatException')));
    mode = 'incomplete';
    await session.ask('three');
    expect(session.turns.last.surface, isNull);
    expect(session.turns.last.note, isNotNull);
    mode = 'ok';
    await session.ask('four');
    expect(session.turns.last.note, isNull);
    expect(session.turns.last.surface, isNotNull);
    session.dispose();
  });

  test('disposal cancels an active request and rejects overlap', () async {
    final controller = StreamController<String>();
    var calls = 0;
    final session = PlaygroundSession(
      es: false,
      generateReply: (_, _) {
        calls++;
        return controller.stream;
      },
    );
    final pending = session.ask('one');
    await session.ask('two');
    expect(calls, 1);
    session.dispose();
    await pending;
    await controller.close();
    expect(session.client, isNull);
    expect(session.history, isEmpty);
  });
}

Future<void> _untilIdle(PlaygroundSession session) async {
  if (!session.busy) return;
  final done = Completer<void>();
  void listener() {
    if (!session.busy && !done.isCompleted) done.complete();
  }

  session.addListener(listener);
  await done.future;
  session.removeListener(listener);
}
