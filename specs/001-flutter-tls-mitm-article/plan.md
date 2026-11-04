# Implementation Plan: Flutter TLS MitM Security Blog Article

**Branch**: `001-flutter-tls-mitm-article` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-flutter-tls-mitm-article/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Publish one verified, bilingual long-form Security blog post (`flutter-mitm-security-alert`) about the October 2026 eMudhra intermediate CA compromise affecting Flutter/Dart TLS (and Cloud Firestore trust bundles on some platforms). Extend the author’s LinkedIn alert with advisory-accurate platform scope, remediation floors, a focused upgrade-friction section, 1–2 Mermaid diagrams, primary-source citations, and a new illustration-only cover (1024×558) registered like existing posts—without changing blog routing or adding dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.8 + React 19 (existing portfolio app)

**Primary Dependencies**: Vite 6, React Router 7, i18next / react-i18next, Tailwind 4, Mermaid (already used by `HtmlArticleBody`)

**Storage**: Static content files + typed portfolio modules (no database)

**Testing**: Manual walkthrough per `quickstart.md`; `npm run lint` (`tsc --noEmit`) as merge gate

**Target Platform**: Static SPA (portfolio + `/blog/:slug`); desktop and mobile browsers

**Project Type**: Content feature inside existing single-page web app (Vite/React)

**Performance Goals**: Article and cover load with existing blog UX; Mermaid diagrams render without blocking primary readable content

**Constraints**: EN/ES parity mandatory; no new runtime dependencies; no blog framework/routing changes; cover illustration-only; facts MUST match GHSA-frr6-h895-5pxp + Firebase eMudhra guide; slug locked to `flutter-mitm-security-alert`; publish date `2026-11-04`

**Scale/Scope**: 1 new post × 2 locales + 1 cover asset + metadata registration in `en.ts` / `es.ts` + one `BLOG_COVERS` map entry

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Bilingual Content Parity | PASS | EN + ES metadata and full HTML bodies required in same change |
| II. Typed Content as Source of Truth | PASS | Register via existing `BlogPost` entries in `src/data/portfolio/{en,es}.ts`; bodies in `src/content/blog/{en,es}/` |
| III. Accessible by Default | PASS | Reuse existing article reader landmarks; cover needs meaningful `alt` from title; diagrams via existing Mermaid path |
| IV. Intentional Experience | PASS | Cover matches dark neon blog set; illustration-only; no new visual system |
| V. Simplicity & Lean Dependencies | PASS | No new packages; extend `BLOG_COVERS` + content files only |
| Stack / lint / routes | PASS | Vite+React+Tailwind unchanged; `/blog/:slug` unchanged; `tsc --noEmit` before merge |

**Post-design re-check**: Still PASS — design uses only established blog registration patterns (`data-model.md`, `contracts/`).

## Project Structure

### Documentation (this feature)

```text
specs/001-flutter-tls-mitm-article/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── assets/images/blog/
│   └── flutter-mitm-security-alert.jpg    # NEW cover (1024×558, illustration-only)
├── content/blog/
│   ├── en/
│   │   └── flutter-mitm-security-alert.html   # NEW
│   └── es/
│       └── flutter-mitm-security-alert.html   # NEW
├── data/
│   ├── blogLoader.ts                      # ADD BLOG_COVERS map entry
│   └── portfolio/
│       ├── en.ts                          # ADD BLOG_POSTS[0] (or prepend) metadata
│       └── es.ts                          # ADD matching ES metadata
├── components/
│   ├── BlogSection.tsx                    # unchanged (consumes loader)
│   ├── BlogArticleReader.tsx              # unchanged
│   └── HtmlArticleBody.tsx                # unchanged (Mermaid already supported)
└── pages/
    └── BlogArticlePage.tsx                # unchanged (`/blog/:slug`)
```

**Structure Decision**: Single Vite/React portfolio app. Feature is content + asset registration only—extend the existing blog content pipeline; do not add services, APIs, or parallel blog systems.

## Complexity Tracking

> No constitution violations requiring justification.
