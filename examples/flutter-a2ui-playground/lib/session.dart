import 'dart:async';

import 'package:a2ui_agent/a2ui_agent.dart';
import 'package:a2ui_core/a2ui_core.dart';
import 'package:a2ui_flutter/a2ui_flutter.dart';
import 'package:dartantic_ai/dartantic_ai.dart' as ai;
import 'package:flutter/foundation.dart';

import 'catalog.dart';
import 'scenarios.dart';

typedef ReplyGenerator = Stream<String> Function(
  String prompt,
  List<ai.ChatMessage> history,
);

enum NoteKind { hint, error }

class PlaygroundTurn {
  PlaygroundTurn(this.prompt);
  final String prompt;
  final List<Map<String, Object?>> messages = [];
  final StringBuffer raw = StringBuffer();
  SurfaceModel<ComponentImplementation>? surface;
  String? note;
  NoteKind kind = NoteKind.hint;
  bool streaming = false;
  bool confirmed = false;
}

class PlaygroundSession extends ChangeNotifier {
  PlaygroundSession({required this.es, this.generateReply}) {
    final catalog = playgroundCatalog();
    processor = MessageProcessor<ComponentImplementation>(
      catalogs: [catalog],
      defaultVersion: A2uiProtocolVersion.v1_0,
    );
    agentProcessor = A2uiGenerator(
      catalogs: [CatalogConfig(catalog)],
      inferenceFormatFactory: const DirectJsonFormatFactory(),
    ).createProcessor(
      A2uiRendererCapabilities.forCatalogIds([
        catalogId,
      ], version: A2uiProtocolVersion.v1_0),
    );
    rendererState = agentProcessor.createState();
    processor.model.onSurfaceCreated.subscribe((surface) {
      final turn = _pending;
      if (turn == null || turn.surface != null) return;
      turn.surface = surface;
    });
    processor.model.onAction.subscribe(handleAction);
  }

  final bool es;
  final ReplyGenerator? generateReply;
  late final MessageProcessor<ComponentImplementation> processor;
  late final A2uiRequestProcessor agentProcessor;
  late final RendererState rendererState;
  ai.Agent? client;
  final List<PlaygroundTurn> turns = [];
  final List<ai.ChatMessage> history = [];
  int selected = -1;
  bool busy = false;
  bool disposed = false;
  int _ids = 0;
  PlaygroundTurn? _pending;
  StreamIterator<String>? reading;

  bool get live => client != null || generateReply != null;

  void connect(String apiKey) {
    final key = apiKey.trim();
    if (key.isEmpty || disposed) return;
    client = ai.Agent.forProvider(
      ai.GoogleProvider(apiKey: key),
      chatModelName: const String.fromEnvironment(
        'GEMINI_MODEL',
        defaultValue: 'gemini-3.6-flash',
      ),
    );
    _notify();
  }

  Future<void> ask(String prompt) async {
    final text = prompt.trim();
    if (text.isEmpty || busy || disposed) return;
    final turn = PlaygroundTurn(text);
    turns.add(turn);
    selected = turns.length - 1;
    busy = true;
    _notify();
    try {
      if (!live) {
        final recorded = recordedMessages(text, es, 'answer-${++_ids}');
        if (recorded == null) {
          turn.note = freeformNote(es);
          turn.kind = NoteKind.hint;
        } else {
          _ingest(turn, recorded);
        }
      } else {
        await _completeLive(
          turn,
          text,
          create: true,
          surfaceId: 'answer-${++_ids}',
        );
      }
    } catch (_) {
      if (!disposed) _fail(turn, live ? liveError(es) : renderError(es));
    } finally {
      turn.streaming = false;
      _pending = null;
      await _stopReading();
      if (!disposed) {
        busy = false;
        _notify();
      }
    }
  }

  void handleAction(A2uiRendererAction action) {
    if (disposed || busy) return;
    final turn = _turnFor(action.surfaceId);
    if (turn == null) return;
    if (!live) {
      if (action.name != 'signup' || turn.confirmed) return;
      turn.confirmed = true;
      _ingest(
        turn,
        confirmationMessages(es, action.surfaceId, action.context),
      );
      _notify();
      return;
    }
    busy = true;
    _notify();
    unawaited(_followUp(turn, action));
  }

  Future<void> _followUp(PlaygroundTurn turn, A2uiRendererAction action) async {
    try {
      await _completeLive(
        turn,
        actionPrompt(es, action.name, action.context),
        create: false,
        surfaceId: action.surfaceId,
      );
    } catch (_) {
      if (!disposed) _fail(turn, liveError(es), hide: !_usable(turn));
    } finally {
      turn.streaming = false;
      await _stopReading();
      if (!disposed) {
        busy = false;
        _notify();
      }
    }
  }

  Future<void> _stopReading() async {
    final current = reading;
    reading = null;
    if (current == null) return;
    try {
      await current.cancel();
    } catch (_) {}
  }

  void _ingest(PlaygroundTurn turn, List<Map<String, Object?>> messages) {
    try {
      _pending = turn;
      processor.processMessages(messages);
      turn.messages.addAll(messages);
      if (!_usable(turn)) _fail(turn, renderError(es));
    } catch (_) {
      _fail(turn, renderError(es));
    } finally {
      _pending = null;
    }
  }

  Future<void> _completeLive(
    PlaygroundTurn turn,
    String userText, {
    required bool create,
    required String surfaceId,
  }) async {
    turn.streaming = true;
    turn.raw.clear();
    final system =
        'You write A2UI 1.0 for a Flutter playground. Reply in ${es ? 'Spanish' : 'English'}. '
        'Use only Column, Row, Text, Card, Button, TextField, ChoicePicker, Divider, and BarChart. '
        'Use BarChart when the answer compares quantities. '
        'Text variants are body or caption. Mark sample figures as illustrative in a caption. '
        'Do not invent a backend. ${agentProcessor.promptSnippet}';
    final instruction = create
        ? 'Create surface "$surfaceId" with catalogId "$catalogId".'
        : 'Update surface "$surfaceId" only. Do not create another surface. catalogId "$catalogId".';
    final user = '$userText\n$instruction';
    final prior = [ai.ChatMessage.system(system), ...history];
    final response = generateReply != null
        ? generateReply!(user, prior)
        : client!
              .sendStream(user, history: prior)
              .map((chunk) => chunk.output);
    final stream = agentProcessor.openStream(state: rendererState);
    final reply = StringBuffer();
    final iterator = reading = StreamIterator(
      response.timeout(const Duration(seconds: 45)),
    );
    while (await iterator.moveNext()) {
      if (disposed) return;
      final chunk = iterator.current;
      reply.write(chunk);
      turn.raw.write(chunk);
      _notify();
      _applyParts(turn, stream.feed(chunk));
    }
    if (disposed) return;
    _applyParts(turn, stream.close());
    if (!_usable(turn)) {
      _fail(turn, liveError(es));
      return;
    }
    turn.note = null;
    history.addAll([
      ai.ChatMessage.user(user),
      ai.ChatMessage.model(reply.toString()),
    ]);
    if (history.length > 12) history.removeRange(0, history.length - 12);
  }

  void _applyParts(PlaygroundTurn turn, List<ResponsePart> parts) {
    for (final part in parts) {
      if (part is! A2uiPart) continue;
      for (final message in part.a2ui) {
        _pending = turn;
        processor.processMessages(AgentToRendererMessagePayload.of(message));
        turn.messages.add(Map<String, Object?>.from(message.toJson()));
      }
    }
  }

  bool _usable(PlaygroundTurn turn) {
    final surface = turn.surface;
    if (surface == null || !surface.componentsModel.has(surface.rootId)) {
      return false;
    }
    for (final component in surface.componentsModel.all) {
      if (!allowedComponents.contains(component.type)) return false;
    }
    return true;
  }

  void _fail(PlaygroundTurn turn, String message, {bool hide = true}) {
    turn.note = message;
    turn.kind = NoteKind.error;
    if (hide) turn.surface = null;
  }

  PlaygroundTurn? _turnFor(String surfaceId) {
    for (final turn in turns) {
      if (turn.surface?.id == surfaceId) return turn;
    }
    return null;
  }

  void select(int index) {
    if (index < 0 || index >= turns.length || index == selected) return;
    selected = index;
    _notify();
  }

  void _notify() {
    if (!disposed) notifyListeners();
  }

  @override
  void dispose() {
    disposed = true;
    unawaited(_stopReading());
    client = null;
    history.clear();
    processor.dispose();
    super.dispose();
  }
}
