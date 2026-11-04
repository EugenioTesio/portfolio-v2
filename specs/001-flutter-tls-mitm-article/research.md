# Research: Flutter TLS MitM Security Blog Article

**Feature**: `001-flutter-tls-mitm-article`  
**Date**: 2026-11-04

## 1. Advisory facts (source of truth)

**Decision**: Treat Dart advisory GHSA-frr6-h895-5pxp and Firebase’s eMudhra remediation guide as authoritative; use LinkedIn post `https://lnkd.in/p/dJjFXhwg` as outline/prompt only.

**Rationale**: Official advisories name root cause (compromised eMudhra intermediate CAs / weak key entropy), severity (High, CWE-295), platform scope, and patched floors. The LinkedIn summary is directionally correct but omits naming eMudhra and under-specifies the separate Firestore/Apple trust-bundle path.

**Alternatives considered**:
- Publish LinkedIn text nearly verbatim — rejected (incomplete / risk of inaccurate iOS messaging).
- Rely only on secondary blogs — rejected (drift from vendor floors).

### Locked facts for article body

| Topic | Fact |
|-------|------|
| Root cause | eMudhra intermediate CA keys compromised (weak entropy); forged TLS certs → MitM |
| Timeline | Google awareness ~2026-10-19; Dart advisory ~2026-10-23 |
| `dart:io` affected | Android, Windows, unpatched/containerized Linux |
| `dart:io` not affected | Web, iOS, macOS (browser / Security.framework) |
| Why OS update ≠ fix | Trust logic compiled into app binary; rebuild + redeploy + user update required |
| Flutter floor | Stable **3.47.8+** (beta path also exists) |
| Dart floor | Stable **3.13.7+** |
| Firestore | Apple/Windows Cloud Firestore clients need plugin trust-store fix: prefer **7.1.0+** / current BoM; backports **6.10.1** (iOS/macOS) / **6.10.2** (Windows) |
| Upgrade friction | Focused: Java/Gradle/Kotlin/minSdk/iOS floors when jumping old Flutter → 3.47.8+; user drop-off risk — not a full migration guide |

## 2. Content format & diagrams

**Decision**: Ship HTML bodies under `src/content/blog/{en,es}/flutter-mitm-security-alert.html` with `format: 'html'`, using existing `figure.diagram-frame` + `pre.mermaid` pattern (1–2 diagrams).

**Rationale**: Matches RASP and banking architecture posts; `HtmlArticleBody` already initializes Mermaid—no new dependency.

**Alternatives considered**:
- Markdown-only — works via glob, but long-form security posts in this repo are HTML with Mermaid.
- Static SVG diagrams — more asset churn; Mermaid keeps EN/ES caption localization in HTML.

### Suggested figures (max 2)

1. **Trust path**: OS/browser trust store vs embedded BoringSSL / plugin trust bundle → who is exposed.
2. **Remediation flow**: Upgrade SDK (and Firestore if needed) → rebuild → redeploy → users update.

## 3. Metadata & listing order

**Decision**: Prepend the new `BlogPost` entry at the top of `BLOG_POSTS` in both `en.ts` and `es.ts` so the listing surfaces it first. Date string style: `Nov 04, 2026` (match existing `Mon DD, YYYY` pattern). Read time target: **12–14 min read**. Category: `Security`. Author: `Eugenio Tesio`.

**Rationale**: Existing array order drives listing order; newest editorial content should lead. Spec locks calendar date 2026-11-04.

**Alternatives considered**:
- Sort by parsed date at runtime — out of scope (would change blog machinery).
- Append at end — weaker discoverability for SC-001.

## 4. Cover image

**Decision**: Create `src/assets/images/blog/flutter-mitm-security-alert.jpg` at **1024×558**, dark atmospheric tech illustration with neon accents, TLS/MitM/certificate motif, **no readable title/label text**. Register in `BLOG_COVERS` keyed by slug.

**Rationale**: All existing covers share that size and mood; UI already shows title; bilingual UI would fight baked-in English text.

**Alternatives considered**:
- Reuse RASP cover — fails FR unique-cover requirement.
- Text-heavy LinkedIn-style graphic — rejected by clarification (illustration-only).

## 5. Registration pipeline

**Decision**: Extend only: portfolio `BLOG_POSTS` (en/es), `blogLoader` `BLOG_COVERS` import/map, content HTML files, cover JPG. No changes to routes, `BlogSection`, or `BlogArticlePage`.

**Rationale**: Constitution V + existing glob loader already pick up `*.html` by filename.

**Alternatives considered**:
- CMS or remote MD fetch — unjustified complexity for one post.
- New blog package — violates lean-dependencies gate.
