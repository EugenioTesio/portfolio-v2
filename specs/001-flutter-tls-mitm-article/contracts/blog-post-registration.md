# Contract: Blog Post Registration

**Feature**: `001-flutter-tls-mitm-article`  
**Consumers**: `getBlogPosts` / `getBlogPostBySlug` → `BlogSection`, `BlogArticlePage`  
**Date**: 2026-11-04

## Purpose

Define the stable registration surface for the new article so listing and detail views resolve metadata, body, and cover without code changes outside the registration points.

## Metadata object (per locale)

Both `src/data/portfolio/en.ts` and `src/data/portfolio/es.ts` MUST export a `BLOG_POSTS` entry conforming to:

```ts
{
  slug: 'flutter-mitm-security-alert',
  title: string,           // locale-specific
  excerpt: string,         // locale-specific
  date: 'Nov 04, 2026',
  readTime: string,        // e.g. '13 min read' / ES equivalent
  category: string,        // Security (or established ES equivalent)
  tags: string[],
  author: 'Eugenio Tesio',
  filename: 'flutter-mitm-security-alert.html',
  format: 'html'
}
```

**Invariants**:
- `slug` and `filename` identical across locales.
- Entry SHOULD appear first in `BLOG_POSTS` for discoverability.

## Content files

| Locale | Path |
|--------|------|
| en | `src/content/blog/en/flutter-mitm-security-alert.html` |
| es | `src/content/blog/es/flutter-mitm-security-alert.html` |

Loader resolution: path ends with `/${filename}` under the locale glob. Format inferred as `html` via `format` or `.html` suffix.

## Cover map

`src/data/blogLoader.ts` MUST include:

```ts
'flutter-mitm-security-alert': /* imported jpg module URL */
```

Asset path: `src/assets/images/blog/flutter-mitm-security-alert.jpg`.

## Runtime resolution contract

| Call | Expected |
|------|----------|
| `getBlogPosts('en')` | Includes post with slug `flutter-mitm-security-alert`, non-empty `content`, defined `coverImage` |
| `getBlogPosts('es')` | Same slug; Spanish title/excerpt/body; same cover URL |
| `getBlogPostBySlug('flutter-mitm-security-alert', locale)` | Defined for `en` and `es` |
| `getBlogPostBySlug('unknown', locale)` | `undefined` (unchanged) |

## Out of contract

- HTTP APIs, CMS, or remote fetch.
- Changes to React Router path shape (`/blog/:slug` remains).
