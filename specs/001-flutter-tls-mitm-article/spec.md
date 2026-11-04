# Feature Specification: Flutter TLS MitM Security Blog Article

**Feature Branch**: `001-flutter-tls-mitm-article`

**Created**: 2026-11-04

**Status**: Clarified

**Input**: User description: "add a new blog article about topic https://lnkd.in/p/dJjFXhwg. Make a further research to verify and enhace it. Create the image asswell following the same image concept from the other blog articles."

## Clarifications

### Session 2026-11-04

- Q: Which publish date should the new article show on the blog listing and article page? → A: Feature work date: 2026-11-04
- Q: How much upgrade-friction detail (Gradle/Kotlin bumps, minSdk/iOS minimums, user-base impact) should the article include beyond the security fix itself? → A: Focused section: key upgrade friction + user-impact caveat (required)
- Q: Should the new blog cover image include baked-in title or label text, or stay illustration-only like a pure visual mood piece? → A: Illustration-only: no title/label text on the cover
- Q: Should the article include architecture/flow diagrams (like the existing RASP security post), or stay prose-and-lists only? → A: Light diagrams: 1–2 figures (trust path and/or remediation flow) with captions
- Q: What URL slug should this article use? → A: `flutter-mitm-security-alert`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read verified security alert article (Priority: P1)

A visitor opens the portfolio blog, sees a new security article about the October 2026 Flutter/Dart TLS MitM issue (eMudhra intermediate CA compromise), and can read a full article that is more accurate and complete than the original LinkedIn summary—covering what happened, who is affected, what to do, and migration/user-impact trade-offs.

**Why this priority**: The article itself is the deliverable; without publishable EN content the feature has no value.

**Independent Test**: Open the blog listing, find the new post by title/category, open the article route, and confirm the body covers verified remediation steps and platform scope without contradictory claims.

**Acceptance Scenarios**:

1. **Given** the portfolio blog listing is open, **When** the visitor scans recent posts, **Then** they see a new Security-category post whose title and excerpt clearly signal a Flutter/Dart TLS MitM / certificate-trust alert.
2. **Given** the visitor opens the new article, **When** they read the body, **Then** they learn the root cause (compromised eMudhra intermediate CAs), that OS updates alone do not fix already-installed app binaries, and the minimum patched Flutter/Dart versions required to rebuild.
3. **Given** the visitor finishes the article, **When** they look for actionable next steps, **Then** they find a clear remediation checklist (upgrade SDK, rebuild, redeploy, urge users to update), Firestore-specific guidance when Cloud Firestore is in use, a focused upgrade-friction caveat (tooling/min-OS bumps and user-impact)—not a full migration playbook—and **1–2** diagrams that clarify trust path and/or remediation flow.

---

### User Story 2 - Bilingual parity for Spanish audience (Priority: P2)

A Spanish-speaking visitor (or someone who switches the site language to Spanish) can read the same article with equivalent depth, structure, and accuracy—not a truncated or stale translation.

**Why this priority**: Project governance requires EN/ES parity for all user-facing content; Spanish was also the language of the source LinkedIn post.

**Independent Test**: Switch locale to Spanish, open the same slug, and compare section coverage and factual claims against the English version.

**Acceptance Scenarios**:

1. **Given** the site language is Spanish, **When** the visitor opens the new article slug, **Then** they see Spanish title, excerpt, tags/labels as applicable, and a full Spanish article body with the same factual claims as English.
2. **Given** either locale, **When** comparing key facts (affected platforms, patched versions, Firestore note), **Then** neither locale contradicts the other or omits a major remediation path present in the other.

---

### User Story 3 - Cover image consistent with blog visual language (Priority: P2)

A visitor sees a dedicated cover image for the new article in the blog listing and article header that matches the visual concept of existing blog covers (dark, atmospheric tech illustration; neon accent language; same landscape proportions).

**Why this priority**: Covers are part of the blog’s brand signal; a mismatched or missing image breaks visual consistency.

**Independent Test**: Compare the new cover side-by-side with existing blog covers for aspect ratio, mood, and brand accent language; confirm it appears on listing and article views.

**Acceptance Scenarios**:

1. **Given** the blog listing is open, **When** the new post card/row is visible, **Then** it shows a unique cover image (not a reuse of another article’s cover).
2. **Given** the article page is open, **When** the visitor views the header/hero media, **Then** the same cover appears and reads as thematically related to TLS/MitM/mobile security (e.g. certificates, encrypted traffic, threat interception)—illustration-only, with no baked-in title or label text.

---

### Edge Cases

- Visitor opens an unknown or mistyped slug: existing not-found behavior remains unchanged; the new article only resolves under its registered slug.
- Visitor switches language mid-read: content for the new article remains available in both locales for the same slug.
- Article metadata (date, read time, tags) must not claim facts that contradict the verified advisory (e.g. must not imply iOS/macOS/Web dart:io apps need the SDK patch for the same reason as Android when advisories say otherwise)—platform nuance MUST be accurate.
- If Cloud Firestore is not used by a reader’s app, remediation still must be understandable without requiring Firestore upgrades.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portfolio MUST publish one new blog article derived from the LinkedIn security alert (`https://lnkd.in/p/dJjFXhwg`), expanded and fact-checked against primary sources (Dart/Flutter security advisory GHSA-frr6-h895-5pxp and Firebase eMudhra remediation guidance).
- **FR-002**: The article MUST state the root cause in plain language: intermediate CA certificates issued by eMudhra were compromised (weak key entropy disclosed October 2026), enabling forged TLS certificates and MitM on the network path.
- **FR-003**: The article MUST accurately scope platform impact for Flutter/Dart `dart:io` TLS validation: Android, Windows, and unpatched/containerized Linux are in scope; Web, iOS, and macOS are not affected for that SDK path because they use browser or Apple system certificate verification.
- **FR-004**: The article MUST explain why operating-system or browser trust-store updates alone do not protect already-installed Flutter/Dart binaries that embed TLS validation, and that teams MUST rebuild and redeploy, then encourage users to update the app.
- **FR-005**: The article MUST list verified minimum remediations: Flutter stable 3.47.8+ (or corresponding patched beta) and Dart stable 3.13.7+ (or corresponding patched beta), then rebuild and redeploy affected targets.
- **FR-006**: The article MUST include a Cloud Firestore section: apps using Cloud Firestore on Apple or Windows platforms need an updated `cloud_firestore` plugin (prefer 7.1.0 / current BoM with the fix; note that backported 6.10.1 / 6.10.2 fixes exist for teams not yet on the latest major), then rebuild and republish.
- **FR-007**: The article MUST include a focused upgrade-friction section covering typical tooling/min-SDK bumps when jumping from older Flutter lines to a patched 3.47.8+ baseline, plus the product risk of raising minimum OS versions (possible user drop-off)—without presenting those bumps as the vulnerability itself and without expanding into a full end-to-end Flutter migration playbook.
- **FR-008**: The article MAY mention transitional mitigations (temporary AGP/Kotlin flags when blocked, Firestore backport versions, additional pinning) only as short-term aids, not as substitutes for shipping a patched rebuild.
- **FR-009**: Article metadata (title, excerpt, date, read time, category, tags, author, slug, filename) MUST be registered for both English and Spanish portfolio blog listings with bilingual parity of meaning. The displayed publish date MUST be **2026-11-04**. The article slug MUST be **`flutter-mitm-security-alert`** (filenames and cover mapping MUST use this identity).
- **FR-010**: Full article bodies MUST exist in English and Spanish, in the same content format used by existing long-form posts, with comparable section structure and depth.
- **FR-014**: The article MUST include **1–2** diagrams (e.g. trust-path / who-must-rebuild or remediation flow) with captions; both locales MUST include the same figures with localized captions. Diagram count MUST stay light—not a diagram-heavy architecture deep dive.
- **FR-011**: A new cover image MUST be created specifically for this article, matching the existing blog cover concept: same landscape proportion as current covers, dark atmospheric tech illustration, neon/high-contrast accent language consistent with the set, topic-aligned (TLS / certificates / MitM / mobile security), and shown on both the blog listing and the article page for this post only. The cover MUST be **illustration-only**—no baked-in title, subtitle, or readable label text (UI copy remains outside the image).
- **FR-012**: The article MUST cite or link primary references readers can verify (at minimum the Dart/Flutter advisory and Firebase eMudhra remediation guide; optionally the author’s LinkedIn alert as the original prompt).
- **FR-013**: Tone MUST match existing security/architecture posts: practitioner field guide, precise and non-alarmist, no unverified claims of active exploitation against specific apps.

### Key Entities

- **Blog Article**: Long-form post with slug, bilingual title/excerpt/body, category (Security), tags, publish date, estimated read time, author, and cover image.
- **Security Advisory Facts**: Verified claims (root cause, severity class High / CWE-295 context, affected platforms, patched versions, remediation steps) sourced from official advisories.
- **Cover Image Asset**: Unique visual for slug `flutter-mitm-security-alert`, same conceptual family as existing blog covers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can discover and open the new article from the blog listing in under 10 seconds on a typical portfolio visit (visible title + category + cover).
- **SC-002**: 100% of the critical factual claims in FR-002 through FR-006 match the cited official advisories (no contradictory platform or version statements).
- **SC-003**: English and Spanish versions both present the same remediation checklist items; a bilingual reviewer finds no missing major section in either locale.
- **SC-004**: Cover image is present on listing and article views, uses the same landscape proportion as existing covers, and is judged visually consistent with the current blog set in a side-by-side review.
- **SC-005**: Estimated read time falls in the same band as existing long-form posts (about 10–15 minutes), signaling comparable depth rather than a short social reshare.
- **SC-006**: At least 90% of acceptance scenarios in User Stories 1–3 pass in a manual walkthrough before release.

## Assumptions

- Primary topic is the October 2026 eMudhra intermediate CA compromise impacting Flutter/Dart TLS on Android/Windows/Linux and Firebase Cloud Firestore trust bundles on certain platforms—not a generic “Flutter HTTPS tips” piece.
- Source LinkedIn post (`https://lnkd.in/p/dJjFXhwg`) is the prompt/outline; official Dart advisory GHSA-frr6-h895-5pxp and Firebase’s “compromised eMudhra intermediate CA” guide are the sources of truth where they diverge or add detail.
- Research corrections vs. the LinkedIn summary to bake into the article:
  - Name eMudhra / weak key entropy and approximate disclosure window (Google awareness ~19 Oct 2026; Dart advisory published ~23 Oct 2026).
  - Clarify Web/iOS/macOS are out of scope for the `dart:io` BoringSSL path, while Firestore on Apple/Windows still needs a plugin update.
  - Prefer stating patched versions as floors (3.47.8+ / 3.13.7+) rather than implying a single exact build forever.
  - Treat LinkedIn migration notes (Java 17, Gradle, minSdk 24, iOS 15, declarative plugins) as material for a **required but focused** upgrade-friction section when moving from older Flutter lines—not as the vulnerability definition and not as a deep migration guide.
- Category: Security; author: Eugenio Tesio; format: same long-form HTML style as existing posts, including light Mermaid-style diagrams where other security posts use them (1–2 figures max).
- Publish date is fixed to **2026-11-04** (feature work date), not the advisory disclosure week.
- Canonical slug is locked to **`flutter-mitm-security-alert`** (no alternate slug without a new clarification).
- Cover art follows existing JPG covers at 1024×558; illustration-only (no title/label text in the image); no new illustration system or stock-photo collage style.
- No changes to blog routing, i18n machinery, or hosting are required beyond registering the new post and assets the way existing posts are registered.
- Out of scope: changing older articles, adding comments/newsletter signup, or claiming CVEs beyond what official advisories publish.
