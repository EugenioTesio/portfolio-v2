# Contract: Article Content Outline

**Feature**: `001-flutter-tls-mitm-article`  
**Audience**: Content implementers / reviewers  
**Date**: 2026-11-04

## Purpose

Ensure EN and ES bodies satisfy FR-002–FR-008, FR-012–FR-014 with shared structure (localized copy, same facts).

## Required section map

Order may vary slightly for flow, but all of the following MUST appear in both locales:

| # | Section intent | Spec refs |
|---|----------------|-----------|
| 1 | Hook / why this alert matters (non-alarmist) | FR-013 |
| 2 | What happened (eMudhra / weak entropy / MitM) | FR-002 |
| 3 | Who is affected (`dart:io` platforms in/out) | FR-003 |
| 4 | Why OS updates alone are insufficient | FR-004 |
| 5 | Remediation checklist (Flutter/Dart floors, rebuild, redeploy, urge update) | FR-005 |
| 6 | Cloud Firestore note (versions + rebuild) | FR-006 |
| 7 | Focused upgrade-friction + user-impact | FR-007 |
| 8 | Optional short transitional mitigations (if included: clearly temporary) | FR-008 |
| 9 | References (advisory + Firebase guide; LinkedIn optional) | FR-012 |

## Diagrams

Exactly **1 or 2** figures, both locales:

```html
<figure class="diagram-frame">
  <figcaption><!-- localized caption --></figcaption>
  <pre class="mermaid">
  <!-- diagram source; node labels MAY be English technical terms if captions carry locale meaning;
       prefer localized labels when short -->
  </pre>
</figure>
```

Suggested pair:
1. Trust path / exposure boundary  
2. Remediation flow  

## Markup conventions (match existing posts)

- Prefer semantic `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<aside class="callout">` as used in RASP article.
- External links: absolute HTTPS URLs to primary sources.
- No baked-in cover imagery inside the HTML body header (cover is metadata/UI).

## Acceptance probe

A bilingual reviewer can check off each row in the section map for EN and ES without finding contradictory version/platform statements (SC-002, SC-003).
