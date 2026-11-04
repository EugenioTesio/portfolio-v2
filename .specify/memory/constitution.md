<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Bilingual Content Parity
  - [PRINCIPLE_2_NAME] → II. Typed Content as Source of Truth
  - [PRINCIPLE_3_NAME] → III. Accessible by Default
  - [PRINCIPLE_4_NAME] → IV. Intentional Experience
  - [PRINCIPLE_5_NAME] → V. Simplicity & Lean Dependencies
- Added sections:
  - Technology Stack & Constraints (was [SECTION_2_NAME])
  - Spec-Driven Development Workflow (was [SECTION_3_NAME])
  - Governance (concrete rules)
- Removed sections: none (scaffold placeholders replaced)
- Follow-up TODOs: none
-->

# Portfolio V2 Constitution

## Core Principles

### I. Bilingual Content Parity
Every user-facing string, portfolio datum, CV field, blog metadata label,
and UI copy MUST exist in both `en` and `es` before a change is considered
complete. Locale files and `src/data/portfolio/{en,es}.ts` MUST stay
structurally aligned (same keys/shape). Shipping a locale-only delta that
leaves the other language missing or stale is forbidden.

Rationale: The site is a bilingual personal brand surface; asymmetry
breaks trust and SEO/OG consistency across audiences.

### II. Typed Content as Source of Truth
Portfolio, CV, and structured content MUST live in typed TypeScript modules
(or typed loaders), not hardcoded JSX copy. Components consume data and
i18n keys; they MUST NOT own long-form narrative text. Adding a content
field REQUIRES updating types and both locale sources in the same change.

Rationale: Separating content from presentation keeps edits reviewable,
enables reuse (site + PDF CV), and prevents drift between surfaces.

### III. Accessible by Default
Interactive controls MUST be keyboard operable and have accessible names.
Decorative visuals (glow layers, ambient motion) MUST use `aria-hidden`
(or equivalent) and MUST NOT trap focus or block content. Semantic HTML
landmarks and heading order MUST be preserved on portfolio and blog routes.
Color and motion MUST NOT be the sole means of conveying meaning.

Rationale: A public portfolio is a professional front door; accessibility
is non-negotiable baseline quality, not a later polish pass.

### IV. Intentional Experience
Visual hierarchy, typography, motion, and brand color usage MUST reinforce
one coherent composition per viewport—especially the hero. Motion MUST
serve presence or hierarchy (enter, focus, feedback), not decoration noise.
New UI MUST match the existing dark, high-contrast neon accent language
unless a constitution amendment explicitly changes the design direction.

Rationale: Generic or cluttered layouts dilute personal brand; intentional
design is part of the product.

### V. Simplicity & Lean Dependencies
Prefer the existing Vite + React + TypeScript + Tailwind stack. New runtime
dependencies MUST justify a concrete gap the current stack cannot cover.
Avoid premature abstraction, unused config, and features that are not
needed for the portfolio, blog, or CV surfaces (YAGNI). Complexity in PRs
MUST be justified in the change description.

Rationale: A personal site stays maintainable when the dependency and
abstraction surface stays small.

## Technology Stack & Constraints

- **Runtime UI**: React 19, React Router, Vite.
- **Language**: TypeScript strict enough that `npm run lint` (`tsc --noEmit`)
  MUST pass before merge.
- **Styling**: Tailwind CSS utility classes; shared tokens/atmosphere via
  existing global CSS (e.g. glow utilities)—do not introduce a second CSS
  framework.
- **i18n**: `i18next` / `react-i18next` with `en` and `es`; detection via
  localStorage key `portfolio-locale`.
- **Documents**: CV PDF via `@react-pdf/renderer` driven from shared content.
- **Secrets**: API keys and env secrets MUST stay in `.env.local` (or host
  env); only `.env.example` is committed. Never commit real keys.
- **Deploy**: Prefer the project's established deploy path (`deploy.sh` /
  hosting config already in repo); do not add a parallel hosting stack
  without an amendment.

## Spec-Driven Development Workflow

- Non-trivial features MUST follow Spec Kit flow: specify → plan → tasks →
  implement (skills under `.cursor/skills/speckit-*`), unless the change is
  a trivial fix, content-only tweak, or dependency patch.
- Specs, plans, and tasks live under `.specify/` (and related feature
  artifacts) and MUST stay consistent with this constitution.
- Before merge, the change MUST: typecheck cleanly, preserve EN/ES parity
  for touched strings, and keep routes (`/`, `/blog/:slug`) working.
- Prefer small, reviewable diffs over large mixed content+refactor PRs.

## Governance

This constitution supersedes informal habits and ad-hoc README notes when
they conflict. Amendments MUST update `.specify/memory/constitution.md`,
bump **Version** using semver (MAJOR: remove/redefine principles;
MINOR: add/expand principle or section; PATCH: clarify wording), set
**Last Amended** to the amendment date (ISO `YYYY-MM-DD`), and include a
temporary Sync Impact Report HTML comment for human review (remove before
commit if desired).

Compliance: authors and reviewers MUST check PRs against Core Principles
and Technology Stack & Constraints. Exceptions require an explicit note in
the PR describing the deviation and a follow-up plan. Runtime feature
guidance comes from Spec Kit specs/plans; this file is the governance
source of truth.

**Version**: 1.0.0 | **Ratified**: 2026-11-04 | **Last Amended**: 2026-11-04
