# Quickstart Validation: Flutter TLS MitM Security Blog Article

**Feature**: `001-flutter-tls-mitm-article`  
**Date**: 2026-11-04

## Prerequisites

- Node.js installed (per repo README)
- Dependencies installed (`npm install`)
- Feature content registered per [contracts/blog-post-registration.md](./contracts/blog-post-registration.md)
- Article bodies follow [contracts/article-content-outline.md](./contracts/article-content-outline.md)
- Cover asset present at `src/assets/images/blog/flutter-mitm-security-alert.jpg` (1024×558, illustration-only)

## Setup

```bash
npm install
npm run lint
npm run dev
```

Open the local URL printed by Vite (default port **3000**).

## Validation scenarios

### V1 — Listing discoverability (SC-001, User Story 1/3)

1. Open `/` and scroll to the blog section (or navigate however the portfolio surfaces posts).
2. Confirm a post titled for the Flutter TLS / MitM alert appears (prefer first in list).
3. Confirm date shows **Nov 04, 2026**, category Security, and a unique cover image.
4. Click through to `/blog/flutter-mitm-security-alert`.

**Pass**: Post visible with cover; article route loads within a normal navigation.

### V2 — English article substance (SC-002, SC-005, FR-002–FR-007, FR-014)

1. With locale English, open `/blog/flutter-mitm-security-alert`.
2. Verify cover in header (illustration-only; no title text in image).
3. Skim body for: eMudhra root cause; Android/Windows/Linux vs Web/iOS/macOS scope; rebuild requirement; Flutter 3.47.8+ / Dart 3.13.7+; Firestore section; focused upgrade-friction; 1–2 Mermaid diagrams rendered; reference links.

**Pass**: All required topics present; no platform/version contradictions vs advisories; read time metadata in 12–14 min band.

### V3 — Spanish parity (SC-003, User Story 2)

1. Switch site language to Spanish (`portfolio-locale` / language toggle).
2. Open the same slug `/blog/flutter-mitm-security-alert`.
3. Confirm Spanish title, excerpt, body, diagram captions; same remediation checklist items as EN.

**Pass**: No major section missing vs English; facts aligned.

### V4 — Loader / unknown slug (edge cases)

1. Visit `/blog/not-a-real-slug` (or equivalent).
2. Confirm existing not-found behavior still applies.
3. Confirm `npm run lint` still passes.

**Pass**: Unknown slug unchanged; typecheck clean.

### V5 — Cover consistency (SC-004)

1. Compare new cover side-by-side with `rasp-mobile-security.jpg` (or another blog cover).
2. Check landscape proportion and dark neon mood; no readable overlay text.

**Pass**: Visually consistent; unique asset.

## Done checklist

- [ ] V1–V5 passed
- [ ] ≥90% of User Stories 1–3 acceptance scenarios exercised (SC-006)
- [ ] No new runtime dependencies added
- [ ] EN + ES metadata and HTML committed together
