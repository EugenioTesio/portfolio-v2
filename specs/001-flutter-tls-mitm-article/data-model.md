# Data Model: Flutter TLS MitM Security Blog Article

**Feature**: `001-flutter-tls-mitm-article`  
**Date**: 2026-11-04

## Entities

### BlogPost (metadata)

Existing TypeScript interface `BlogPost` in `src/types.ts`. One new instance per locale module (`en` / `es`) with identical non-copy fields.

| Field | Type | Rules for this feature |
|-------|------|------------------------|
| `slug` | string | MUST be `flutter-mitm-security-alert` |
| `title` | string | Locale-specific; signals Flutter/Dart TLS MitM / cert-trust alert |
| `excerpt` | string | Locale-specific; 1–2 sentences; no contradictory platform claims |
| `date` | string | Display form **`Nov 04, 2026`** (publish date 2026-11-04) |
| `readTime` | string | Band **12–14 min read** (e.g. `13 min read`) |
| `category` | string | `Security` (ES may use localized category label if existing posts do; keep consistent with sibling Security posts) |
| `tags` | string[] | Include Flutter, security/TLS-related tags; parity of meaning EN/ES |
| `author` | string | `Eugenio Tesio` |
| `filename` | string | `flutter-mitm-security-alert.html` |
| `format` | `'html'` | Required |
| `content` | string? | Filled at load time by `getBlogPosts` from HTML file |
| `coverImage` | string? | Filled from `BLOG_COVERS[slug]` |

**Identity**: `slug` is the unique key across listing, route `/blog/:slug`, cover map, and content filenames.

**Relationships**:
- `BlogPost.filename` → file at `src/content/blog/{locale}/{filename}`
- `BlogPost.slug` → cover at `BLOG_COVERS[slug]` → `src/assets/images/blog/flutter-mitm-security-alert.jpg`

### ArticleBody (content)

Not a separate TypeScript type; raw HTML string loaded via `import.meta.glob`.

| Attribute | Rules |
|-----------|--------|
| Locale | Exact parallel files: `en/` and `es/` |
| Structure | Long-form sections covering FR-002–FR-008, FR-012–FR-014 |
| Diagrams | 1–2 `figure.diagram-frame` blocks with `pre.mermaid` + localized `figcaption` |
| Tone | Practitioner field guide; non-alarmist; no unverified exploitation claims |
| Citations | Links to GHSA-frr6-h895-5pxp and Firebase eMudhra guide (LinkedIn optional) |

### CoverImageAsset

| Attribute | Rules |
|-----------|--------|
| Path | `src/assets/images/blog/flutter-mitm-security-alert.jpg` |
| Dimensions | 1024×558 (match existing covers) |
| Style | Dark atmospheric tech; neon accents; TLS/MitM/certificate theme |
| Text | None (illustration-only) |
| Uniqueness | Must not reuse another article’s file |

### SecurityAdvisoryFacts (editorial constraints)

Logical entity constraining body copy (not stored as JSON):

| Claim area | Allowed values |
|------------|----------------|
| Root cause | eMudhra intermediate CA compromise / weak key entropy |
| `dart:io` in scope | Android, Windows, unpatched/containerized Linux |
| `dart:io` out of scope | Web, iOS, macOS |
| Flutter floor | 3.47.8+ |
| Dart floor | 3.13.7+ |
| Firestore | 7.1.0+ preferred; 6.10.1 / 6.10.2 backports noted |

## Validation rules

1. EN and ES `BlogPost` objects MUST share `slug`, `filename`, `format`, `date`, `author`, and equivalent `readTime` / tag meaning.
2. Both HTML files MUST exist before merge; missing file falls back to excerpt-only (unacceptable for release).
3. `BLOG_COVERS` MUST include `flutter-mitm-security-alert` or listing/article show no cover (fails SC-004).
4. Body MUST NOT claim iOS/macOS/Web need the Dart/Flutter SDK patch for the same `dart:io` reason as Android.
5. Diagram count ∈ {1, 2}; captions localized.

## State / lifecycle

```text
Draft content → Registered in en+es + cover mapped → Lint clean → Manual quickstart pass → Published (deployed SPA)
```

No runtime state machine; static content only.
