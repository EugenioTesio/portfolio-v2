import 'dart:math' as math;

import 'package:a2ui_core/a2ui_core.dart';
import 'package:a2ui_flutter/a2ui_flutter.dart';
import 'package:flutter/material.dart';
import 'package:json_schema_builder/json_schema_builder.dart';

/// A horizontal bar chart. `bars` is a list of `{label, value, caption}`.
/// `value` sets the length. `caption` is the text shown beside the label.
ComponentImplementation barChart() => ComponentImplementation(
  name: 'BarChart',
  schema: Schema.fromMap(const <String, Object?>{
    'type': 'object',
    'description':
        'A horizontal bar chart. Each bar has a label, a number that sets its length, and a caption.',
    'properties': <String, Object?>{
      'component': <String, Object?>{'const': 'BarChart'},
      'bars': <String, Object?>{
        'type': 'array',
        'description': 'The bars. The largest value is drawn full width.',
        'items': <String, Object?>{
          'type': 'object',
          'properties': <String, Object?>{
            'label': <String, Object?>{
              'type': 'string',
              'description': 'The category name.',
            },
            'value': <String, Object?>{
              'type': 'number',
              'description': 'The quantity that sets the bar length.',
            },
            'caption': <String, Object?>{
              'type': 'string',
              'description': 'The quantity as shown, such as USD 4.2M.',
            },
          },
          'required': <Object?>['label', 'value'],
        },
      },
    },
    'required': <Object?>['component', 'bars'],
  }),
  builder: buildBarChart,
);

Widget buildBarChart(
  BuildContext context,
  ComponentNode<ComponentImplementation> node,
  ComponentProps props,
  ChildWidgetBuilder buildChild,
) {
  final bars = <({String label, double value, String caption})>[];
  for (final item in props.list('bars')) {
    if (item is! Map) continue;
    final label = ComponentProps.asString(item['label']);
    final value = ComponentProps.asNumber(item['value']);
    if (label == null || value == null) continue;
    bars.add((
      label: label,
      value: value,
      caption: ComponentProps.asString(item['caption']) ?? '',
    ));
  }
  final maxValue = bars.fold<double>(0, (max, bar) => math.max(max, bar.value));
  final color = Theme.of(context).colorScheme.primary;
  return Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      for (var i = 0; i < bars.length; i++)
        Padding(
          padding: EdgeInsets.only(bottom: i == bars.length - 1 ? 0 : 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(child: Text(bars[i].label)),
                  Text(bars[i].caption),
                ],
              ),
              const SizedBox(height: 6),
              LayoutBuilder(
                builder: (context, constraints) {
                  final span = constraints.maxWidth.isFinite ? constraints.maxWidth : 280.0;
                  final width = maxValue <= 0 ? 0.0 : span * (bars[i].value / maxValue);
                  return Stack(
                    children: [
                      Container(
                        height: 12,
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(99),
                        ),
                      ),
                      Container(
                        height: 12,
                        width: width,
                        decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(99),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
    ],
  );
}
