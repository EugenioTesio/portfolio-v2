*How an agent learns your component catalog, composes an interface, and hands it to Flutter to render.*

“Help me choose a plan.”

An application might answer that request with a comparison, a few selectable options, and a button to continue. The pieces are familiar. The interesting possibility is letting an agent decide how to assemble them for the person asking.

For a Flutter developer, that raises some useful questions. Where do those components come from? How does the model know which ones exist? Who turns its answer into widgets? And what happens when someone presses the button?

**A2UI connects those decisions through a shared description of the interface.** Your application defines the building blocks and their behavior. The agent composes an answer using that vocabulary. Flutter brings it to the screen.

Let's follow that relationship from the catalog to a working interaction. There is a small playground at the end to make the ideas tangible.

## What A2UI describes

A2UI provides an open protocol and supporting libraries for describing interactive interfaces with structured messages. In the component-based approach covered here, an agent sends information about layout, content, and data bindings. The receiving application renders that information using components it already implements. The [official overview](https://a2ui.org/concepts/overview/) introduces this agent-to-renderer flow.

Three concepts make the rest easier to follow:

- A **catalog** defines the component types available to the agent, their properties, and any supported functions or usage instructions.
- A **surface** is one rendered interface with its own component structure and data model. It could occupy a chat reply or a region of an existing screen.
- A **message** creates a surface, updates its components or data, or carries an interaction back to the application or agent.

For example, a plan-selection surface could contain a title, a comparison of plans, a choice picker, and a continue button. The agent decides which supported pieces to use and how to connect them. Your application supplies their visual implementations and handles their effects.

That gives the model room to adapt the presentation while the application retains ownership of the components people actually use.

## How the Flutter libraries divide the work

The Dart implementation separates the protocol, the agent integration, and the Flutter renderer. Understanding that split helps you see where each decision belongs.

**`a2ui_core` manages the interface description and its state.** Its `MessageProcessor` applies protocol messages, validates payloads, and maintains surfaces, component records, and data. Its resolution layer follows component relationships and resolves data bindings. It can do this without building a Flutter widget. See the [core package](https://pub.dev/packages/a2ui_core).

**`a2ui_flutter` connects that description to Flutter.** It supplies the `A2uiSurface` widget, component builders, and a basic catalog with Material implementations. A surface becomes a widget subtree inside your application, using the builders registered for its component types. See the [Flutter package](https://pub.dev/packages/a2ui_flutter).

**`a2ui_agent` helps the model speak A2UI.** It works out which configured catalogs the renderer supports, produces instructions describing those catalogs and the expected output format, and parses the model's response into protocol messages. Your agent code still calls the model through a provider library. See the [agent package](https://pub.dev/packages/a2ui_agent).

The companion implementation uses `dartantic_ai` for its Gemini connection. That is the model client chosen for this example; the A2UI packages handle the interface contract around that call.

The examples below target protocol **1.0**, with `a2ui_core` **0.7.0**, `a2ui_flutter` **0.3.0**, and `a2ui_agent` **0.3.0**. Keeping the versions explicit matters because message formats and binding syntax differ across protocol versions.

## Where the components come from

The model needs a vocabulary your application can actually render. You can start with the supplied basic catalog, provide your own components, or combine the two.

### Start with the basic catalog

The Flutter package's `basicCatalog()` includes ready-made component implementations. Familiar names such as `Column`, `Row`, `Text`, `Card`, and `Button` are available alongside inputs and other controls.

You can derive a smaller catalog for a particular experience. This example keeps enough components for comparisons and forms:

```dart
const catalogId = 'https://example.com/catalogs/onboarding-v1.json';

final catalog = basicCatalog().derive(
  catalogId: catalogId,
  components: const {
    'Column', 'Row', 'Text', 'Card', 'Button',
    'TextField', 'ChoicePicker', 'Divider',
  },
  functions: const [],
  instructions:
      'Use ChoicePicker for plan selection. '
      'Bind input values with @path. '
      'Use event actions for buttons.',
);
```

`components` selects the implementations to retain. `functions: const []` exposes no catalog functions. The instructions describe how to use this vocabulary, and the new `catalogId` identifies the contract shared by the agent and renderer.

The resulting catalog is registered in application code. Writing its ID into a message selects that registered catalog; it does not download widget implementations from the URL.

### Bring your own design system

Suppose your app already has a carefully designed plan card. You could expose it as a `PlanCard` component with properties such as a plan name, a price label, and a list of benefits.

There are two parts to that integration:

1. **Describe its public interface.** Define a schema with the component's name, supported properties, required values, and useful descriptions.
2. **Provide its Flutter implementation.** Register a builder that reads those properties and returns your existing widget.

In the Flutter SDK, `ComponentImplementation` pairs a component's schema with its builder. You can add that implementation to a derived catalog through `addComponents`. The [catalog guide](https://a2ui.org/concepts/catalogs/) explains the shared contract between the agent and renderer.

This is an explicit integration. Adding a widget to your codebase alone does not make it available to the agent. You decide what to expose and what each property means.

That decision is also a design opportunity. A reusable `PlanCard` can carry your typography, spacing, accessibility behavior, and product conventions, while the agent chooses where it belongs in an answer.

## How the agent learns what it can use

The catalog needs to reach both sides of the interaction. The renderer registers implementations. The agent receives descriptions of their APIs and guidance about how to compose them.

With the Dart agent SDK, the setup looks like this, using the catalog defined above:

```dart
final generator = A2uiGenerator(
  catalogs: [CatalogConfig(catalog)],
  inferenceFormatFactory: const DirectJsonFormatFactory(),
);

final agentProcessor = generator.createProcessor(
  A2uiRendererCapabilities.forCatalogIds(
    [catalogId],
    version: A2uiProtocolVersion.v1_0,
  ),
);

final catalogInstructions = agentProcessor.promptSnippet;
```

The renderer capabilities identify the catalogs and protocol version the client supports. The generator selects compatible configured catalogs. `promptSnippet` then describes the available components, functions, instructions, and output format. Your application includes that snippet in the model's prompt alongside the user's request and any relevant application data.

The model can now interpret “help me choose a plan” using a concrete vocabulary. With basic components, it might compose cards, text, and a choice picker. With a custom `PlanCard`, it has a more specific building block available. It sees the public component descriptions; it does not need your widgets' Dart source.

The model still makes a probabilistic choice. **Catalog instructions guide generation; validation checks the result.** A prompt that lists eight components does not guarantee the model will always produce a valid interface. The parser and renderer must check the messages against the supported contract, and the application must handle rejected or incomplete answers.

The choice of inference format affects how the model writes its response. This example asks for Direct JSON and parses it with `openStream()`. That stream can produce A2UI messages as the response arrives, before the entire answer is finished.

## How messages become Flutter widgets

Once the agent has described an interface, the renderer needs to know where it belongs and how its pieces connect.

In this example, `createSurface` establishes a surface and identifies the catalog it will use. `updateComponents` supplies component descriptions. `updateDataModel` changes the values that components can bind to. These are three central operations in the [A2UI message model](https://a2ui.org/concepts/messages/).

After creating a surface called `planAnswer` with the onboarding catalog, the agent could send this small layout:

```json
{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "planAnswer",
    "components": [
      { "id": "root", "component": "Column", "children": ["title", "plan"] },
      { "id": "title", "component": "Text", "text": "Your plan options", "variant": "body" },
      { "id": "plan", "component": "Card", "child": "planName" },
      { "id": "planName", "component": "Text", "text": "Studio", "variant": "body" }
    ]
  }
}
```

The list is flat, but the relationships form a tree. `root` contains `title` and `plan`; the card named `plan` contains `planName`. An ID identifies an instance, while `component` identifies its type in the catalog.

The rendering path has three steps:

1. **Apply the message.** `MessageProcessor` updates the surface's component records and checks the payload.
2. **Resolve the relationships.** The resolution layer follows child IDs from the root and connects properties to their bound data.
3. **Build the widgets.** `A2uiSurface` uses the registered component implementations to build the corresponding Flutter subtree and respond to updates.

That is how a component name becomes a widget: the renderer finds an implementation you registered for that name. No generated Dart needs to be compiled or executed in this flow.

Because messages address surfaces and components by ID, later messages can update an existing answer. A form can become a confirmation within the same surface, while the surrounding application stays in place.

## How inputs and actions complete the conversation

An interface becomes useful when people can interact with it. A2UI separates component structure from the values that change during that interaction.

Each surface has a data model. A text field can bind its value to a path such as `{"@path": "/name"}`. The application or agent initializes the data, and the field's implementation writes edits back through that binding. Components connected to the value can react to the change. The [data-binding guide](https://a2ui.org/concepts/data-binding/) explains this relationship.

For a plan-selection form, the data might hold a name and the selected plan. Typing into the field updates local state; it does not require the model to generate a new answer for every keystroke.

A button provides an explicit point to send an interaction back. Its action can include the current values through bindings:

```json
{
  "event": {
    "name": "choosePlan",
    "context": {
      "name": { "@path": "/name" },
      "plan": { "@path": "/plan" }
    }
  }
}
```

When the user presses the button, the renderer resolves those paths and emits an action with the current values. Application code handles the event. It can perform an operation, send the action to the agent, or combine the two before returning an update to the surface.

A real subscription flow still needs your application's validation, permissions, and backend operation. Showing a button or generating a confirmation does not establish that the operation succeeded. The agent should receive the actual outcome when composing the next response.

**The UI contract defines what can be expressed. Your application decides what those interactions do.**

## Design a catalog around the experience

The catalog is one of the most consequential parts of an A2UI integration. It shapes the choices available to the agent and the interfaces your users can receive.

Start with a particular task. For plan selection, decide which information matters, which choices are allowed, and what a successful interaction should produce. Then choose components that make those decisions clear.

Basic components offer flexibility. Product-specific components package established design decisions into a smaller public interface. You might let the agent arrange several `PlanCard` instances while each card owns its internal layout. These are different levels of composition, and you can use both in the same experience.

Give components precise property descriptions and examples. Keep business data connected to a reliable source: a well-formed price label can still contain an incorrect price. Exercise the entire interaction, including unavailable options, invalid responses, and failed operations.

A useful first experiment is a single bounded task with a few components. Follow it from the user's request, through the chosen layout, to one action and its result. That is enough to discover where your catalog helps the agent and where its vocabulary needs more care.

## See the pieces working together

The playground below is a compact example of this architecture. It uses eight basic components, adds a bar chart for the sales dashboard, and shows the Flutter surface beside the A2UI messages behind it.

Press **Run demo** and choose a dashboard, a headphone comparison, or a signup form. The default **REPLAY · Recorded** mode applies prepared messages without calling a model. Try submitting the form: its button sends an event, and the app updates the same surface with a confirmation. The figures are illustrative and no account is created.

For your own prompts, choose **Use my Gemini key**. Live requests use your Google account and may incur charges; submitted form values also go to the model. The key stays in memory until you reset or reload. On a narrow screen, **UI / A2UI** switches between the result and its messages.

[Open the full playground](/blog/flutter-a2ui-playground/demo?lng=en) or [download the companion source](/downloads/flutter-a2ui-playground.zip) to trace the catalog, agent instructions, renderer, and action handling in one implementation.
