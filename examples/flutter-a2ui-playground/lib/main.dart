import 'package:a2ui_flutter/a2ui_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'ready.dart';
import 'scenarios.dart';
import 'session.dart';

void main() => runApp(PlaygroundApp(es: Uri.base.queryParameters['lng'] == 'es'));

class PlaygroundApp extends StatelessWidget {
  const PlaygroundApp({super.key, this.es = false});
  final bool es;

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    locale: Locale(es ? 'es' : 'en'),
    supportedLocales: const [Locale('en'), Locale('es')],
    localizationsDelegates: GlobalMaterialLocalizations.delegates,
    theme: ThemeData(
      brightness: Brightness.dark,
      colorSchemeSeed: const Color(0xFF7DD3FC),
      scaffoldBackgroundColor: const Color(0xFF0B1220),
      useMaterial3: true,
      visualDensity: VisualDensity.compact,
      cardTheme: const CardThemeData(color: Color(0xFF172238), elevation: 0),
    ),
    home: PlaygroundPage(es: es),
  );
}

class PlaygroundPage extends StatefulWidget {
  const PlaygroundPage({super.key, required this.es});
  final bool es;

  @override
  State<PlaygroundPage> createState() => _PlaygroundPageState();
}

class _PlaygroundPageState extends State<PlaygroundPage> {
  late PlaygroundSession session;
  final prompt = TextEditingController();
  final keyInput = TextEditingController();
  final transcript = ScrollController();
  bool showKey = false;
  bool showSource = false;
  int shownTurns = 0;

  String tr(String en, String es) => widget.es ? es : en;

  @override
  void initState() {
    super.initState();
    session = PlaygroundSession(es: widget.es);
    WidgetsBinding.instance.addPostFrameCallback((_) => notifyReady());
  }

  @override
  void dispose() {
    session.dispose();
    prompt.dispose();
    keyInput.dispose();
    transcript.dispose();
    super.dispose();
  }

  void reset() {
    session.dispose();
    prompt.clear();
    keyInput.clear();
    setState(() {
      session = PlaygroundSession(es: widget.es);
      showKey = false;
      showSource = false;
      shownTurns = 0;
    });
  }

  Future<void> send(String value) async {
    prompt.clear();
    await session.ask(value);
  }

  void connect() {
    final key = keyInput.text;
    keyInput.clear();
    session.connect(key);
    setState(() => showKey = false);
  }

  void _followTranscript() {
    if (session.turns.length == shownTurns) return;
    shownTurns = session.turns.length;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!transcript.hasClients) return;
      transcript.jumpTo(transcript.position.maxScrollExtent);
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: session,
      builder: (context, _) {
        _followTranscript();
        return Scaffold(
          body: SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final narrow = constraints.maxWidth < 760;
                final showUi = !narrow || !showSource;
                final showPayload = !narrow || showSource;
                return Column(
                  children: [
                    _header(narrow),
                    if (showKey) _keyForm(),
                    if (narrow) _paneSwitch(),
                    Expanded(
                      child: Row(
                        children: [
                          if (showUi)
                            Expanded(child: _transcript()),
                          if (!narrow)
                            const VerticalDivider(width: 1, color: Color(0xFF243049)),
                          if (showPayload)
                            narrow
                                ? Expanded(child: _source())
                                : SizedBox(
                                    width: (constraints.maxWidth * 0.36).clamp(280, 420),
                                    child: _source(),
                                  ),
                        ],
                      ),
                    ),
                    _composer(),
                  ],
                );
              },
            ),
          ),
        );
      },
    );
  }

  Widget _header(bool narrow) {
    final title = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          tr('A2UI Playground', 'Playground A2UI'),
          style: Theme.of(context).textTheme.titleLarge,
        ),
        Text(
          tr(
            'Watch a prompt become an interface.',
            'Mirá cómo un pedido se vuelve una interfaz.',
          ),
          style: const TextStyle(color: Color(0xFF93A4BD)),
        ),
      ],
    );
    final actions = Wrap(
      spacing: 8,
      runSpacing: 8,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        _status(),
        TextButton(
          onPressed: () => setState(() => showKey = !showKey),
          child: Text(tr('Use my Gemini key', 'Usar mi clave de Gemini')),
        ),
        TextButton(
          onPressed: reset,
          child: Tooltip(
            message: tr('Reset and clear key', 'Reiniciar y borrar clave'),
            child: Text(tr('Reset', 'Reiniciar')),
          ),
        ),
      ],
    );
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: narrow
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [title, const SizedBox(height: 8), actions],
            )
          : Row(children: [Expanded(child: title), actions]),
    );
  }

  Widget _status() {
    final live = session.live;
    final label = live
        ? tr('LIVE · Gemini', 'EN VIVO · Gemini')
        : tr('REPLAY · Recorded', 'REPRODUCCIÓN · Grabado');
    return Container(
      key: const Key('status'),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: live ? const Color(0xFF3B2A12) : const Color(0xFF123024),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: live ? const Color(0xFFFBBF24) : const Color(0xFF86EFAC),
        ),
      ),
      child: Text(label),
    );
  }

  Widget _keyForm() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              key: const Key('gemini-key'),
              controller: keyInput,
              obscureText: true,
              autocorrect: false,
              enableSuggestions: false,
              decoration: InputDecoration(
                labelText: tr('Gemini API key', 'Clave de API de Gemini'),
                isDense: true,
              ),
              onSubmitted: (_) => connect(),
            ),
          ),
          const SizedBox(width: 8),
          FilledButton(
            onPressed: connect,
            child: Text(tr('Enable live mode', 'Activar modo en vivo')),
          ),
        ],
      ),
    );
  }

  Widget _paneSwitch() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: SegmentedButton<bool>(
        segments: const [
          ButtonSegment(value: false, label: Text('UI')),
          ButtonSegment(value: true, label: Text('A2UI'), enabled: true),
        ],
        selected: {showSource},
        onSelectionChanged: (value) => setState(() => showSource = value.single),
      ),
    );
  }

  Widget _transcript() {
    if (session.turns.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            tr(
              'Pick a prepared prompt, or write your own.',
              'Elegí un pedido preparado, o escribí el tuyo.',
            ),
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFF93A4BD)),
          ),
        ),
      );
    }
    return ListView.builder(
      controller: transcript,
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      itemCount: session.turns.length,
      itemBuilder: (context, index) => _turn(session.turns[index], index),
    );
  }

  Widget _turn(PlaygroundTurn turn, int index) {
    final selected = index == session.selected;
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => session.select(index),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: selected ? const Color(0xFF7DD3FC) : const Color(0xFF243049),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    constraints: const BoxConstraints(maxWidth: 480),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(turn.prompt),
                  ),
                ),
                if (turn.note != null) ...[
                  const SizedBox(height: 10),
                  Text(
                    turn.note!,
                    style: TextStyle(
                      color: turn.kind == NoteKind.error
                          ? const Color(0xFFFDA4AF)
                          : const Color(0xFF93A4BD),
                    ),
                  ),
                ],
                if (turn.surface != null) ...[
                  const SizedBox(height: 10),
                  A2uiSurface(surface: turn.surface!),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _source() {
    final turn = session.selected < 0 || session.selected >= session.turns.length
        ? null
        : session.turns[session.selected];
    final lines = turn == null ? const <String>[] : sourceLines(turn.messages);
    return ColoredBox(
      color: const Color(0xFF101827),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Text(
              turn != null && turn.streaming
                  ? tr('A2UI · streaming', 'A2UI · llegando')
                  : 'A2UI',
              style: const TextStyle(color: Color(0xFF7DD3FC)),
            ),
          ),
          Expanded(
            child: turn == null
                ? Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      tr(
                        'Send a prompt to see the A2UI payload.',
                        'Enviá un pedido para ver el mensaje A2UI.',
                      ),
                      style: const TextStyle(color: Color(0xFF93A4BD)),
                    ),
                  )
                : turn.streaming
                ? SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: SelectableText(
                      turn.raw.toString(),
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                    ),
                  )
                : lines.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      turn.note ??
                          tr(
                            'This turn has no A2UI payload.',
                            'Este turno no tiene un mensaje A2UI.',
                          ),
                      style: const TextStyle(color: Color(0xFF93A4BD)),
                    ),
                  )
                : Scrollbar(
                    child: ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      itemCount: lines.length,
                      itemBuilder: (context, index) => SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: SelectableText(
                          lines[index],
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            height: 1.45,
                          ),
                        ),
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _composer() {
    return Material(
      color: const Color(0xFF121A2B),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final label in replayPrompts(widget.es))
                  ActionChip(
                    label: Text(label),
                    onPressed: session.busy ? null : () => send(label),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    key: const Key('prompt'),
                    controller: prompt,
                    enabled: !session.busy,
                    minLines: 1,
                    maxLines: 3,
                    textInputAction: TextInputAction.send,
                    decoration: InputDecoration(
                      isDense: true,
                      hintText: tr(
                        'Prepared prompts, or your own',
                        'Pedidos preparados, o el tuyo',
                      ),
                    ),
                    onSubmitted: session.busy ? null : send,
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: session.busy ? null : () => send(prompt.text),
                  child: Text(tr('Send', 'Enviar')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
