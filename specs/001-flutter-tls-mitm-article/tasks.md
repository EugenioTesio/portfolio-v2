# Tasks: Flutter TLS MitM Security Blog Article

**Input**: Design documents from `/specs/001-flutter-tls-mitm-article/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification — manual validation via `quickstart.md` only (no automated test tasks).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Vite/React portfolio)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Orient to existing blog pipeline; no greenfield project init

- [X] T001 Review `specs/001-flutter-tls-mitm-article/research.md` and `contracts/article-content-outline.md` and note required section map + locked advisory floors (Flutter 3.47.8+, Dart 3.13.7+, Firestore 7.1.0+ / 6.10.1–6.10.2)
- [X] T002 [P] Confirm existing Mermaid HTML pattern in `src/content/blog/en/rasp-mobile-security.html` and rendering via `src/components/HtmlArticleBody.tsx` (no new dependencies)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reserve slug identity and EN registration scaffold so `/blog/flutter-mitm-security-alert` resolves before story bodies/covers are finished

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create HTML skeleton `src/content/blog/en/flutter-mitm-security-alert.html` with `h2` stubs for every required section in `contracts/article-content-outline.md` (hook, what happened, who affected, OS updates, remediation, Firestore, upgrade friction, references) plus two empty `figure.diagram-frame` placeholders
- [X] T004 Prepend `BlogPost` metadata to `BLOG_POSTS` in `src/data/portfolio/en.ts` with `slug` MUST be `flutter-mitm-security-alert`, `filename` MUST be `flutter-mitm-security-alert.html`, `format` MUST be `html`, `date` MUST be `Nov 04, 2026`, `author` MUST be `Eugenio Tesio`, `category` Security, `readTime` in 12–14 min band (e.g. `13 min read`), draft EN `title`/`excerpt`/`tags` aligned to TLS MitM alert

**Checkpoint**: Foundation ready — `getBlogPostBySlug('flutter-mitm-security-alert', 'en')` resolves with skeleton content

---

## Phase 3: User Story 1 - Read verified security alert article (Priority: P1) 🎯 MVP

**Goal**: English long-form article is complete, advisory-accurate, with remediation checklist, Firestore note, focused upgrade friction, 1–2 Mermaid diagrams, and citations

**Independent Test**: Open `/blog/flutter-mitm-security-alert` in English; verify FR-002–FR-007, FR-012–FR-014 topics; Mermaid figures render; facts match research.md (no contradictory platform/version claims)

### Implementation for User Story 1

- [X] T005 [US1] Write full English prose for root cause (eMudhra / weak entropy / MitM) and `dart:io` platform scope (Android/Windows/unpatched Linux in; Web/iOS/macOS out) in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T006 [US1] Add remediation checklist (Flutter stable 3.47.8+, Dart stable 3.13.7+, rebuild, redeploy, urge users to update) and why OS updates alone are insufficient in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T007 [US1] Add Cloud Firestore section (prefer `cloud_firestore` 7.1.0+ / current BoM; note backports 6.10.1 iOS/macOS and 6.10.2 Windows) in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T008 [US1] Add focused upgrade-friction section (tooling/min-SDK bumps when jumping older Flutter → 3.47.8+; user-impact of raising OS floors)—not a full migration playbook—in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T009 [P] [US1] Implement Mermaid diagram 1 (trust path / exposure boundary) with English `figcaption` in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T010 [P] [US1] Implement Mermaid diagram 2 (remediation flow) with English `figcaption` in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T011 [US1] Add References section linking GHSA-frr6-h895-5pxp and Firebase eMudhra remediation guide (LinkedIn `https://lnkd.in/p/dJjFXhwg` optional) in `src/content/blog/en/flutter-mitm-security-alert.html`
- [X] T012 [US1] Finalize EN `title`, `excerpt`, and `tags` in `src/data/portfolio/en.ts` so listing signals Flutter/Dart TLS MitM / certificate-trust alert; keep `date` `Nov 04, 2026` and `readTime` 12–14 min band
- [X] T013 [US1] Optionally add short transitional-mitigations note (AGP/Kotlin flags, Firestore backports, pinning) clearly labeled temporary—not a substitute for patched rebuild—in `src/content/blog/en/flutter-mitm-security-alert.html` (FR-008 MAY)

**Checkpoint**: User Story 1 fully readable and fact-checkable in English without Spanish or final cover

---

## Phase 4: User Story 2 - Bilingual parity for Spanish audience (Priority: P2)

**Goal**: Spanish metadata and full HTML body with same facts, sections, and 1–2 diagrams (localized captions)

**Independent Test**: Switch locale to Spanish; open `/blog/flutter-mitm-security-alert`; compare section coverage and remediation checklist to English (SC-003)

### Implementation for User Story 2

- [X] T014 [P] [US2] Prepend matching `BlogPost` metadata to `BLOG_POSTS` in `src/data/portfolio/es.ts` with identical `slug` `flutter-mitm-security-alert`, `filename` `flutter-mitm-security-alert.html`, `format` `html`, `date` `Nov 04, 2026`, `author` `Eugenio Tesio`; Spanish `title`/`excerpt`/`tags`/`category`/`readTime` with parity of meaning to `en.ts`
- [X] T015 [US2] Create `src/content/blog/es/flutter-mitm-security-alert.html` translating all required sections from the English article (same factual claims for platforms, versions, Firestore, upgrade friction)
- [X] T016 [P] [US2] Localize both Mermaid `figcaption`s (and diagram labels where practical) in `src/content/blog/es/flutter-mitm-security-alert.html` so diagram count remains 1–2 matching EN
- [X] T017 [US2] Localize References link labels in `src/content/blog/es/flutter-mitm-security-alert.html` while keeping the same primary-source URLs

**Checkpoint**: EN and ES both complete for substance; covers may still be missing

---

## Phase 5: User Story 3 - Cover image consistent with blog visual language (Priority: P2)

**Goal**: Unique illustration-only cover at 1024×558 registered for the slug on listing and article views

**Independent Test**: Listing and `/blog/flutter-mitm-security-alert` show the new cover; side-by-side with `src/assets/images/blog/rasp-mobile-security.jpg` for mood/proportion; no baked-in title text

### Implementation for User Story 3

- [X] T018 [US3] Create illustration-only cover `src/assets/images/blog/flutter-mitm-security-alert.jpg` at 1024×558, dark atmospheric neon tech style, TLS/MitM/certificate motif, **no readable title/label text**
- [X] T019 [US3] Import the cover and add `'flutter-mitm-security-alert'` entry to `BLOG_COVERS` in `src/data/blogLoader.ts`
- [X] T020 [US3] Verify listing (`src/components/BlogSection.tsx`) and article header (`src/components/BlogArticleReader.tsx`) receive `coverImage` for the slug via `getBlogPosts` / `getBlogPostBySlug` (no component API changes expected)

**Checkpoint**: All three user stories independently demonstrable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates across locales and registration

- [X] T021 [P] Fact-check EN+ES bodies in `src/content/blog/{en,es}/flutter-mitm-security-alert.html` against `specs/001-flutter-tls-mitm-article/research.md` (platform scope + version floors)
- [X] T022 [P] Confirm EN/ES `BlogPost` field parity (`slug`, `filename`, `format`, `date`, `author`) in `src/data/portfolio/en.ts` and `src/data/portfolio/es.ts`
- [X] T023 Run `npm run lint` at repository root and fix any type errors from new imports/metadata
- [X] T024 Execute manual scenarios V1–V5 in `specs/001-flutter-tls-mitm-article/quickstart.md` (listing, EN substance, ES parity, unknown slug, cover consistency)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP
- **User Story 2 (Phase 4)**: Depends on Foundational; ideally after US1 body exists for accurate translation (T015 depends on T005–T011 content)
- **User Story 3 (Phase 5)**: Depends on Foundational; can run in parallel with US1/US2 (different files: jpg + `blogLoader.ts`)
- **Polish (Phase 6)**: Depends on US1–US3 complete

### User Story Dependencies

- **User Story 1 (P1)**: After Phase 2 — no dependency on US2/US3
- **User Story 2 (P2)**: After Phase 2; translation quality depends on completed EN article (US1)
- **User Story 3 (P2)**: After Phase 2 — independent of article prose; parallelizable with US1/US2

### Within Each User Story

- US1: Prose sections before or interleaved with diagrams; finalize metadata after body tone is clear
- US2: Metadata can start in parallel with translation; captions after body exists
- US3: Create JPG before `BLOG_COVERS` registration

### Parallel Opportunities

- T001 and T002 in Setup
- T009 and T010 (diagrams) once section structure exists
- T014 (ES metadata) while T015 starts after EN is stable
- T016 captions parallelizable once ES body scaffold exists
- T018 cover creation parallel with US1 writing
- T021 and T022 in Polish

---

## Parallel Example: User Story 1

```bash
# After T005–T008 section prose exists, launch diagrams together:
Task: "T009 Implement Mermaid diagram 1 (trust path) in src/content/blog/en/flutter-mitm-security-alert.html"
Task: "T010 Implement Mermaid diagram 2 (remediation flow) in src/content/blog/en/flutter-mitm-security-alert.html"
```

## Parallel Example: User Story 3 alongside US1

```bash
# Different files — safe parallel after Phase 2:
Task: "T005 Write EN root-cause/platform prose in src/content/blog/en/flutter-mitm-security-alert.html"
Task: "T018 Create cover src/assets/images/blog/flutter-mitm-security-alert.jpg"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (EN skeleton + metadata)
3. Complete Phase 3: User Story 1 (full EN article)
4. **STOP and VALIDATE**: English article route + facts
5. Demo MVP (cover/ES can follow)

### Incremental Delivery

1. Setup + Foundational → slug resolves
2. US1 → EN article MVP
3. US3 → cover on listing/article (can swap order with US2)
4. US2 → Spanish parity
5. Polish → lint + quickstart V1–V5

### Parallel Team Strategy

1. Shared: Phase 1–2
2. Then: Author A → US1; Author B → US3 cover; after EN stable → Author B/C → US2
3. Together: Phase 6 polish

---

## Notes

- [P] tasks = different files or non-overlapping edits; T009/T010 share one HTML file — coordinate or sequence if single agent
- No automated tests by design; use `quickstart.md`
- Do not change `BlogSection.tsx`, `BlogArticlePage.tsx`, or add npm packages
- Commit after each phase or story checkpoint
