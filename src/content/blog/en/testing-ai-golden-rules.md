*Turn engineering guidance into repeatable evaluations, test the evaluator, and understand what a passing result actually tells you.*

A team writes down its golden rules: keep business logic independent of infrastructure, inject dependencies, test observable behavior. The coding assistant receives those instructions. Its next answer looks sensible, and an evaluation report turns green.

Confidence depends on what passed. A rule can be clear and still be a poor fit. An assistant can repeat the rule while violating it in code. An evaluator can approve the right vocabulary without checking the behavior it describes.

The private [`flutter-golden-rules`](https://github.com/EugenioTesio/flutter-golden-rules) repository is a concrete starting point: written rules, scenarios, saved responses, and a scoring script. The examples use Flutter, but the same problem applies to any coding assistant and language. The samples below are self-contained adaptations. The links point at the source inspected on November 17, 2026, for readers with access. Proposed improvements are marked as such.

## Start with a rule you can observe

A golden rule is a documented engineering expectation. It gives an assistant a default: where responsibilities belong, which dependencies are allowed, or what a useful test must show.

> Application logic receives external dependencies through contracts. The application bootstrap supplies concrete implementations, and tests can substitute fakes.

That is more testable than “use clean architecture.” You can inspect a constructor, follow a dependency, and rerun the operation with a fake.

Scope matters. The bootstrap has to construct concrete dependencies. A rule that forbids that construction everywhere would reject the wiring it requires. Before writing scenarios, record where the rule applies, why it exists, and which exceptions are valid.

Then separate three questions:

- **Compliance:** does the assistant follow the documented boundary?
- **Usefulness:** does that boundary help produce a correct, maintainable solution?
- **Evaluator accuracy:** does the check accept valid solutions and reject violations?

A high compliance score settles neither of the others. You can enforce an unnecessary abstraction faithfully, or measure a useful rule with a weak checker.

## Turn the expectation into an eval

An evaluation, or **eval**, gives the assistant a task and checks the response, or the resulting work, against defined expectations. The task, the environment, and the grading method decide what the result means.

For dependency injection, use an ordinary request: implement checkout with an existing payment contract. Define success first. Checkout must receive the gateway, charge the requested amount, and stay testable without a live payment service.

This abridged YAML borrows the repository’s [scenario structure](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/golden_rules/evals/datasets/ioc.eval.yaml). It illustrates a definition. It is not a dataset the runner can execute as-is.

```yaml
id: "architecture.checkout.inject_gateway"
input:
  prompt: >
    Implement checkout using the existing PaymentGateway contract.
    Include a unit test using a fake.
  context: "The application bootstrap owns dependency construction."
expected:
  behavior: >
    Checkout receives PaymentGateway through its constructor.
    A test supplies a fake and verifies the charge request.
  must_contain:
    - "PaymentGateway"
    - "constructor"
criteria:
  - description: "Checkout does not construct or locate its gateway"
    type: "must_pass"
    weight: 1.0
```

Mentioning `PaymentGateway` and `constructor` says very little about the implementation. The behavior description is the target, and the grader has to earn the right to stand in for it. Keep that expected answer out of the assistant’s input. Give it the task and the rules it would see in normal work.

## Cover the decisions, including exceptions

One passing checkout is one observation. Ask for a valid implementation, a review of a violation, and a review of code that already follows the rule. Treat the bootstrap’s concrete gateway as a legitimate exception. A reviewer that flags every concrete type can otherwise look effective.

Change the wording without changing the intent. “Make checkout testable without the payment service” should hit the same boundary without the rule’s vocabulary. A task that also asks for error handling can drop one rule while assembling the feature.

Explaining why a global lookup is a problem tests review. Replacing that lookup without breaking checkout tests implementation. Also separate **rule application** from **rule delivery**. A scenario that includes the rule tests application. To test delivery, start from a representative task and confirm the configured guidance actually reaches the assistant. File selection can fail before any design reasoning begins.

## Follow the repository's actual workflow

Rules live in `.mdc` files. Scenarios live in YAML datasets that name the rule and describe inputs, expected behavior, text checks, and criteria. The [README](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/README.md) documents the commands. After installing the Python dependencies, from the repository root:

```bash
./eval list
./eval extract .
```

Extraction writes `eval-test-runner/eval_prompts.json` and, when that file is missing, a starter `eval_responses.json`. **Extraction does not call a model.** Another step has to generate each answer from the referenced rule, prompt, context, and any code snippet.

Save the answer as a string under its scenario ID. This shows the file shape, not a complete answer:

```json
{
  "flutter.ioc.no_injector_in_build": "Pass the use case through the constructor; build uses the supplied dependency."
}
```

Then run:

```bash
./eval score .
```

The [runner](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/eval-test-runner/run_evals.py) reads those stored responses and writes Markdown reports under `golden_rules/evals/reports/`. Its checks are case-insensitive substring matches. Every `must_contain` phrase must appear, and no `must_not_contain` phrase may appear. Each dataset’s `common_anti_patterns` join the forbidden list.

On the current datasets the score is binary: 100 or 0. Reports list weighted criteria, but those judgments default to passing once the substring checks pass. The runner does not compile code, run tests, or decide whether the architecture is right.

## Test the evaluator before trusting its score

Score examples whose verdict you already know: a correct response, an obvious violation, a valid paraphrase, and a wrong answer that contains every expected phrase. Inspect disagreements before editing the rule to raise the score.

A **false pass** accepts a violation. “The constructor should locate PaymentGateway globally” contains both example terms and recommends the behavior the rule rejects.

A **false failure** rejects a valid answer. Constructor injection can be expressed entirely in code, without the word “constructor.” The datasets also forbid phrases such as “looks good,” so quoting that phrase to criticize a shallow review can fail a correct conclusion.

Tests create a related trap. This fragment uses familiar testing words and never calls checkout or checks a result:

```python
def test_checkout_charges_gateway():
    # GIVEN / WHEN / THEN
    gateway = FakeGateway()
    checkout = Checkout(gateway)
```

A meaningful test acts and checks the outcome:

```python
checkout.pay(amount=25)
assert gateway.charges == [25]
```

For graders that make judgments, compare them with independently labeled examples and track both missed failures and false alarms. Hamel Husain and Shreya Shankar explain how to keep development examples separate from the final test in [their guide to trusting automated evals](https://hamel.dev/blog/posts/evals-faq/how-do-i-know-if-i-can-trust-my-automated-eval.html).

## Build stronger evidence in layers

These checks go beyond the current runner. Structural inspection can catch a gateway constructed inside checkout. An executable test can pass a fake, verify the charge, and cover a declined payment. In an isolated fixture, remove that gateway call. If the behavior test still passes, it is not protecting the requirement, and a green result should not count as complete success.

A person can judge whether a new abstraction is proportionate. A model can review an open design choice when it has a rubric and its decisions are calibrated against expert judgment. Another model is not an independent authority by default. Anthropic describes how code, model, and human graders fit together in [its evaluation guidance](https://www.anthropic.com/research/demystifying-evals-for-ai-agents).

To see whether the rules help, run the same tasks with no extra rules, the current rules, and a proposed revision. Hold the model, tools, starting repository, and requirements constant, and remove hints that reveal the answer. Use fresh sessions, repeat tasks so failures stay visible, and keep unseen tasks back until the revision is finished. Rescoring a saved response checks the scorer again. It says nothing new about the assistant. Once those held-back results drive another revision, keep a new unseen set.

## Report what the score cannot say

Say what you tested, how many tasks and attempts you planned, how many finished, and what failed. Show failures by rule. A strong average can hide one boundary that always breaks.

In this runner, missing response IDs are skipped and left out of the scored total, and the individual reports do not carry those omissions. Compare the report with the dataset before calling a run complete. Record the model, generation settings, rule revision, dataset revision, grader version, and starting environment with the outputs. The optional model label only renames files. It does not call or verify that model, and a new trial should not overwrite an earlier one.

For usefulness, look past compliance: does the feature work, can the dependency be replaced without rewriting application logic, and how much review did the result need? Familiar tasks say little about unfamiliar work, and repeats measure consistency rather than coverage.

## Put it to work

Start with one rule that matters and a small, varied set of realistic tasks:

1. Write its scope, the observable behavior, and the valid exceptions.
2. Define success, then create known-good and known-bad examples.
3. Check that the grader separates those examples fairly.
4. Run fresh trials with and without the rule, in equivalent conditions.
5. Read the code, the test results, and the failures next to the scores.
6. Change the rule or the evaluator according to the cause you found, then try unseen tasks.

A golden rule is an engineering decision with evidence behind it. The confidence worth stating is specific: which behaviors improve, under which conditions, and which failures the evaluation can actually detect.
