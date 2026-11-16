# Data model: Flutter A2UI playground

There is no inventory. Recorded prompts carry their own illustrative copy.

## Turn
- `prompt`: the visitor’s text.
- `messages`: the A2UI envelopes that were applied.
- `raw`: the live model text while it streams.
- `surface`: the Flutter surface for that turn, if one was created and is usable.
- `note` / `kind`: a hint (free-form replay) or a recoverable error.
- `streaming`, `confirmed`.

## Replay prompts
- Dashboard: `createSurface` plus a `Column` of `Card` / `Row` / `Text`, with an illustrative caption.
- Headphones: three cards, Nimbus ANC, Harbor Quiet, and Field One.
- Signup: data model `{name, email, plan}`, two text fields, a chip `ChoicePicker`, and a `signup` button.

## Signup action
Context resolves `/name`, `/email`, and `/plan` at the tap. Replay replaces the root with a confirmation that says no account was created. Live mode sends the action name and context back to the model and asks it to update the same surface id.

## Catalog
Id `https://eugeniotesio.dev/catalogs/a2ui-playground-v1.json`. Components: Column, Row, Text, Card, Button, TextField, ChoicePicker, Divider. No functions.

## Session
Replay is the default. Live holds an in-memory Gemini client. History is capped at 12 messages. Disposal cancels the stream and drops the client.
