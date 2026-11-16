import 'dart:convert';

import 'catalog.dart';

const dashboardPromptEn = 'Q3 sales by region as a dashboard';
const comparePromptEn = 'Compare three noise-cancelling headphones';
const signupPromptEn = 'A signup form with a plan choice';
const dashboardPromptEs =
    'Ventas del tercer trimestre por región, como un tablero';
const comparePromptEs = 'Compará tres auriculares con cancelación de ruido';
const signupPromptEs = 'Un formulario de registro con elección de plan';

String dashboardPrompt(bool es) => es ? dashboardPromptEs : dashboardPromptEn;
String comparePrompt(bool es) => es ? comparePromptEs : comparePromptEn;
String signupPrompt(bool es) => es ? signupPromptEs : signupPromptEn;

List<String> replayPrompts(bool es) => [
  dashboardPrompt(es),
  comparePrompt(es),
  signupPrompt(es),
];

String freeformNote(bool es) => es
    ? 'Las consultas libres necesitan una clave de Gemini. La reproducción ejecuta los tres pedidos preparados.'
    : 'Free-form requests need a Gemini key. Replay plays the three prepared prompts.';

String renderError(bool es) => es
    ? 'No se pudo dibujar esta respuesta. Probá con otro pedido.'
    : 'This answer could not be rendered. Try another prompt.';

String liveError(bool es) => es
    ? 'No se pudo completar la respuesta. Revisá la clave y la conexión, y reintentá.'
    : 'Could not complete the response. Check your key and connection, then retry.';

String illustrative(bool es) =>
    es ? 'Datos ilustrativos.' : 'Illustrative data.';

String _norm(String value) => value
    .trim()
    .toLowerCase()
    .replaceAll(RegExp(r'\s+'), ' ')
    .replaceAll(RegExp(r'[.!?]+$'), '');

List<Map<String, Object?>>? recordedMessages(
  String prompt,
  bool es,
  String surfaceId,
) {
  final text = _norm(prompt);
  if (text == _norm(dashboardPrompt(es))) return dashboardMessages(es, surfaceId);
  if (text == _norm(comparePrompt(es))) return compareMessages(es, surfaceId);
  if (text == _norm(signupPrompt(es))) return signupMessages(es, surfaceId);
  return null;
}

Map<String, Object?> _bind(String path) => {'@path': path};

Map<String, Object?> _create(String surfaceId) => {
  'version': '1.0',
  'createSurface': {'surfaceId': surfaceId, 'catalogId': catalogId},
};

Map<String, Object?> _components(
  String surfaceId,
  List<Map<String, Object?>> components,
) => {
  'version': '1.0',
  'updateComponents': {'surfaceId': surfaceId, 'components': components},
};

Map<String, Object?> _data(String surfaceId, Object? value) => {
  'version': '1.0',
  'updateDataModel': {'surfaceId': surfaceId, 'path': '/', 'value': value},
};

Map<String, Object?> _text(String id, String value, {String variant = 'body'}) =>
    {'id': id, 'component': 'Text', 'text': value, 'variant': variant};

Map<String, Object?> _card(String id, String child) => {
  'id': id,
  'component': 'Card',
  'child': child,
};

List<Map<String, Object?>> dashboardMessages(bool es, String surfaceId) {
  final bars = es
      ? [
          {'label': 'EMEA', 'value': 4.2, 'caption': '4,2 millones USD'},
          {'label': 'América', 'value': 3.6, 'caption': '3,6 millones USD'},
          {'label': 'APAC', 'value': 2.1, 'caption': '2,1 millones USD'},
        ]
      : [
          {'label': 'EMEA', 'value': 4.2, 'caption': 'USD 4.2M'},
          {'label': 'Americas', 'value': 3.6, 'caption': 'USD 3.6M'},
          {'label': 'APAC', 'value': 2.1, 'caption': 'USD 2.1M'},
        ];
  return [
    _create(surfaceId),
    _components(surfaceId, [
      {
        'id': 'root',
        'component': 'Column',
        'children': ['title', 'chart', 'note'],
      },
      _text('title', es ? 'Ventas del tercer trimestre' : 'Third-quarter sales'),
      {'id': 'chart', 'component': 'BarChart', 'bars': bars},
      _text('note', illustrative(es), variant: 'caption'),
    ]),
  ];
}

List<Map<String, Object?>> compareMessages(bool es, String surfaceId) {
  final items = [
    ('nimbus', 'Nimbus ANC', es ? 'USD 249 · 30 h' : 'USD 249 · 30 h'),
    ('harbor', 'Harbor Quiet', es ? 'USD 189 · 24 h' : 'USD 189 · 24 h'),
    ('field', 'Field One', es ? 'USD 129 · 20 h' : 'USD 129 · 20 h'),
  ];
  return [
    _create(surfaceId),
    _components(surfaceId, [
      {
        'id': 'root',
        'component': 'Column',
        'children': ['title', for (final item in items) item.$1, 'note'],
      },
      _text(
        'title',
        es ? 'Auriculares con cancelación de ruido' : 'Noise-cancelling headphones',
      ),
      for (final item in items) ...[
        _card(item.$1, '${item.$1}Copy'),
        _text('${item.$1}Copy', '${item.$2} · ${item.$3}'),
      ],
      _text('note', illustrative(es), variant: 'caption'),
    ]),
  ];
}

List<Map<String, Object?>> signupMessages(bool es, String surfaceId) => [
  _create(surfaceId),
  _data(surfaceId, {
    'name': '',
    'email': '',
    'plan': <String>[],
  }),
  _components(surfaceId, [
    {
      'id': 'root',
      'component': 'Column',
      'children': ['title', 'name', 'email', 'divider', 'plan', 'submit', 'note'],
    },
    _text('title', es ? 'Crear una cuenta' : 'Create an account'),
    {
      'id': 'name',
      'component': 'TextField',
      'label': es ? 'Nombre' : 'Name',
      'value': _bind('/name'),
    },
    {
      'id': 'email',
      'component': 'TextField',
      'label': 'Email',
      'value': _bind('/email'),
    },
    {'id': 'divider', 'component': 'Divider'},
    {
      'id': 'plan',
      'component': 'ChoicePicker',
      'label': es ? 'Plan' : 'Plan',
      'variant': 'mutuallyExclusive',
      'displayStyle': 'chips',
      'options': [
        {'label': 'Studio', 'value': 'studio'},
        {'label': 'Team', 'value': 'team'},
        {'label': 'Enterprise', 'value': 'enterprise'},
      ],
      'value': _bind('/plan'),
    },
    {
      'id': 'submit',
      'component': 'Button',
      'child': 'submitLabel',
      'variant': 'primary',
      'action': {
        'event': {
          'name': 'signup',
          'context': {
            'name': _bind('/name'),
            'email': _bind('/email'),
            'plan': _bind('/plan'),
          },
        },
      },
    },
    _text('submitLabel', es ? 'Crear cuenta' : 'Create account'),
    _text('note', illustrative(es), variant: 'caption'),
  ]),
];

String _readable(Object? value) {
  if (value is List) {
    return value.map(_readable).where((part) => part.isNotEmpty).join(', ');
  }
  if (value == null) return '';
  final text = value.toString().trim();
  return switch (text) {
    'studio' => 'Studio',
    'team' => 'Team',
    'enterprise' => 'Enterprise',
    _ => text,
  };
}

String confirmationCopy(bool es, Map<String, dynamic> context) {
  final name = _readable(context['name']);
  final email = _readable(context['email']);
  final plan = _readable(context['plan']);
  if (es) {
    final who = name.isEmpty ? 'el pedido' : 'el pedido de $name';
    final extra = [
      if (plan.isNotEmpty) 'plan $plan',
      if (email.isNotEmpty) email,
    ].join(', ');
    final tail = extra.isEmpty ? '' : ' ($extra)';
    return 'Recibimos $who$tail. Datos ilustrativos. No se creó una cuenta.';
  }
  final who = name.isEmpty ? '' : ' for $name';
  final extra = [
    if (plan.isNotEmpty) 'on the $plan plan',
    if (email.isNotEmpty) email,
  ].join(', ');
  final tail = extra.isEmpty ? '' : ' ($extra)';
  return 'Request received$who$tail. Illustrative data. No account was created.';
}

List<Map<String, Object?>> confirmationMessages(
  bool es,
  String surfaceId,
  Map<String, dynamic> context,
) => [
  _components(surfaceId, [
    {
      'id': 'root',
      'component': 'Column',
      'children': ['done', 'note'],
    },
    _text('done', confirmationCopy(es, context)),
    _text('note', illustrative(es), variant: 'caption'),
  ]),
];

String actionPrompt(bool es, String name, Map<String, dynamic> context) {
  final encoded = jsonEncode(context);
  return es
      ? 'El visitante ejecutó la acción $name. Contexto: $encoded. Actualizá la misma superficie con una confirmación. No inventes una cuenta real.'
      : 'The visitor ran action $name. Context: $encoded. Update the same surface with a confirmation. Do not invent a real account.';
}

/// One compact JSON line per component, with other messages kept whole.
List<String> sourceLines(List<Map<String, Object?>> messages) {
  final lines = <String>[];
  for (final message in messages) {
    final update = message['updateComponents'];
    if (update is Map && update['components'] is List) {
      for (final component in update['components'] as List) {
        lines.add(jsonEncode(component));
      }
    } else {
      lines.add(jsonEncode(message));
    }
  }
  return lines;
}
