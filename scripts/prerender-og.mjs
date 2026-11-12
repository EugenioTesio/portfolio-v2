#!/usr/bin/env node
/**
 * After `vite build`, write per-route HTML shells so crawlers (LinkedIn, etc.)
 * see article-specific Open Graph tags. Firebase serves these files before the SPA rewrite.
 *
 * Keep titles/excerpts in sync with src/data/portfolio/en.ts via src/data/blogSocialMeta.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const metaPath = path.join(root, 'src/data/blogSocialMeta.json');

const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/$/, '') ||
  JSON.parse(fs.readFileSync(metaPath, 'utf8')).siteUrlDefault.replace(/\/$/, '');

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${p}`;
}

function replaceMeta(html, { title, description, url, image, imageAlt, type }) {
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);
  const safeUrl = escapeAttr(url);
  const safeImage = escapeAttr(image);
  const safeAlt = escapeAttr(imageAlt);
  const safeType = escapeAttr(type);

  let out = html;

  out = out.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);

  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${safeDesc}" />`
  );

  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${safeUrl}" />`
  );

  const ogReplacements = [
    [/property="og:type" content="[^"]*"/, `property="og:type" content="${safeType}"`],
    [/property="og:url" content="[^"]*"/, `property="og:url" content="${safeUrl}"`],
    [/property="og:title" content="[^"]*"/, `property="og:title" content="${safeTitle}"`],
    [/property="og:description" content="[^"]*"/, `property="og:description" content="${safeDesc}"`],
    [/property="og:image" content="[^"]*"/, `property="og:image" content="${safeImage}"`],
    [/property="og:image:secure_url" content="[^"]*"/, `property="og:image:secure_url" content="${safeImage}"`],
    [/property="og:image:alt" content="[^"]*"/, `property="og:image:alt" content="${safeAlt}"`],
  ];

  for (const [pattern, replacement] of ogReplacements) {
    out = out.replace(pattern, replacement);
  }

  const twitterReplacements = [
    [/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${safeTitle}"`],
    [/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${safeDesc}"`],
    [/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${safeImage}"`],
    [/name="twitter:image:alt" content="[^"]*"/, `name="twitter:image:alt" content="${safeAlt}"`],
  ];

  for (const [pattern, replacement] of twitterReplacements) {
    out = out.replace(pattern, replacement);
  }

  return out;
}

function writeShell(relativeDir, html) {
  const dir = path.join(distDir, relativeDir);
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

function assertOgImageExists(ogImagePath) {
  const filePath = path.join(distDir, ogImagePath.replace(/^\//, ''));
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing OG image in dist: ${ogImagePath} (expected ${filePath})`);
  }
}

function main() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`dist/index.html not found. Run vite build first.`);
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const template = fs.readFileSync(indexHtmlPath, 'utf8');

  const blogIndexPath = meta.blogIndex.path.replace(/^\//, '');
  assertOgImageExists(meta.blogIndex.ogImage);
  const blogIndexHtml = replaceMeta(template, {
    title: meta.blogIndex.title,
    description: meta.blogIndex.description,
    url: absoluteUrl(meta.blogIndex.path),
    image: absoluteUrl(meta.blogIndex.ogImage),
    imageAlt: meta.blogIndex.title,
    type: 'website',
  });
  const blogIndexOut = writeShell(blogIndexPath, blogIndexHtml);
  console.log(`prerender-og: ${blogIndexOut}`);

  for (const post of meta.posts) {
    assertOgImageExists(post.ogImage);
    const pagePath = `blog/${post.slug}`;
    const html = replaceMeta(template, {
      title: `${post.title} | Eugenio Tesio`,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      image: absoluteUrl(post.ogImage),
      imageAlt: post.title,
      type: 'article',
    });
    const out = writeShell(pagePath, html);
    console.log(`prerender-og: ${out}`);
  }

  console.log(`prerender-og: done (${meta.posts.length} articles + blog index) → ${SITE_URL}`);
}

main();
