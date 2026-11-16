# Feature Specification: Flutter A2UI playground

**Created**: 2026-11-16
**Status**: Implemented
**Input**: Replace the backpack product finder with a Flutter A2UI playground. A chat paints each answer as a surface and shows the A2UI payload beside it. Public replay of three recorded prompts, optional visitor Gemini key. Rewrite the English and Spanish articles. Keep the existing embed and build pipeline.

## User Scenarios & Testing

### User Story 1 — Watch a prompt become UI (Priority: P1)
A visitor plays a recorded prompt and sees a Flutter surface under the message, with the A2UI payload listed one component per line.
**Why this priority**: The playground is the example the article teaches.
**Independent Test**: With no key, run the dashboard, the headphone comparison, and the signup form in English and Spanish.
**Acceptance Scenarios**:
1. Given replay, each of the three prompts renders a surface and source lines. Any other prompt says free-form requests need a key.
2. Given the signup button, replay applies a recorded confirmation that includes the submitted name and does not create an account.
3. Given a narrow width, UI / A2UI swaps the transcript and the source pane.

### User Story 2 — Read the tutorial (Priority: P1)
An English- or Spanish-speaking developer reads a practical article about the GenUI-to-A2UI change, the narrowed catalog, recorded messages, the source pane, actions, live Gemini, and failure handling.
**Why this priority**: The article is the published explanation of the playground.
**Independent Test**: Open either locale and find the cover, the flow diagram, and three replay screenshots with localized captions.
**Acceptance Scenarios**:
1. Both articles teach the same behavior and cite the CopilotKit playground as the interaction and the pinned Flutter packages as the implementation.
2. Screenshots are from the running replay and show the replay label.
3. The source download and the compiled demo contain no key.

### User Story 3 — Run it in the blog (Priority: P2)
A visitor starts the inline demo or opens the dedicated page, in either language.
**Why this priority**: Readers can try the playground without installing Flutter.
**Independent Test**: Run the demo, switch language while it is mounted, reset, and open the dedicated page.
**Acceptance Scenarios**:
1. The article stays on the preview until Run demo.
2. The dedicated page starts the iframe immediately.
3. Changing language keeps the iframe mounted and reloads a fresh session, discarding any key.

### Edge Cases
Unknown replay prompt, invalid or incomplete A2UI, malformed model output, interrupted streams, overlapping requests, missing demo slug, narrow layout, language change, and key removal on reset or reload.

## Requirements
### Functional Requirements
- Replay is the default and is labeled. Live mode uses a masked in-memory Gemini key, `gemini-3.6-flash` unless `GEMINI_MODEL` is set, and Direct JSON.
- The catalog is the v1.0 basic catalog narrowed to Column, Row, Text, Card, Button, TextField, ChoicePicker, and Divider.
- Recorded copy is marked illustrative. There is no inventory tool.
- Invalid or incomplete payloads show a recoverable error and do not expose provider exception text.
- The demo is served at `/demos/flutter-a2ui-playground/index.html` and the source zip at `/downloads/flutter-a2ui-playground.zip`.

## Success Criteria
- `flutter analyze` and `flutter test` pass on Flutter 3.47.9 / Dart 3.13.7.
- `npm run lint` and `npm run build` pass.
- Browser checks cover all three replay prompts in both languages, the signup action, reset, language switch, the dedicated page, and a narrow width.
- Live Gemini stays unverified unless a key is already available.
