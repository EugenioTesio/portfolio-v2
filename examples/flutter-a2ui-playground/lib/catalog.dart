import 'package:a2ui_flutter/a2ui_flutter.dart';
import 'package:a2ui_flutter/basic_catalog.dart';

import 'bar_chart.dart';

const catalogId = 'https://eugeniotesio.dev/catalogs/a2ui-playground-v1.json';

const allowedComponents = {
  'Column',
  'Row',
  'Text',
  'Card',
  'Button',
  'TextField',
  'ChoicePicker',
  'Divider',
  'BarChart',
};

CatalogImplementation playgroundCatalog() => basicCatalog().derive(
  catalogId: catalogId,
  components: allowedComponents.where((name) => name != 'BarChart'),
  addComponents: [barChart()],
  functions: const [],
  instructions:
      'Render only Column, Row, Text, Card, Button, TextField, ChoicePicker, Divider, and BarChart. '
      'Use BarChart for a comparison of quantities: each bar has label, value, and caption. '
      'Bind field values with @path. A button raises an event action. '
      'Text variants are body or caption. Mark sample figures as illustrative in a caption.',
);
