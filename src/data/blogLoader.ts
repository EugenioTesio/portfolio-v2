import { BlogPost } from '../types';
import { getPortfolioData, Locale } from './portfolio';
import iotCover from '../assets/images/blog/iot-rs485-to-cloud.jpg';
import raspCover from '../assets/images/blog/rasp-mobile-security.jpg';
import flutterBankingCover from '../assets/images/blog/large-scale-flutter-banking-architecture.jpg';

const BLOG_COVERS: Record<string, string> = {
  'iot-rs485-to-cloud': iotCover,
  'rasp-mobile-security': raspCover,
  'large-scale-flutter-banking-architecture': flutterBankingCover,
};

const markdownModulesEn = import.meta.glob('../content/blog/en/*.md', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

const htmlModulesEn = import.meta.glob('../content/blog/en/*.html', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

const markdownModulesEs = import.meta.glob('../content/blog/es/*.md', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

const htmlModulesEs = import.meta.glob('../content/blog/es/*.html', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

function getArticleModules(locale: Locale) {
  if (locale === 'es') {
    return { ...markdownModulesEs, ...htmlModulesEs };
  }
  return { ...markdownModulesEn, ...htmlModulesEn };
}

function resolveFormat(post: BlogPost): 'markdown' | 'html' {
  if (post.format) return post.format;
  return post.filename.endsWith('.html') ? 'html' : 'markdown';
}

function fallbackContent(post: BlogPost, format: 'markdown' | 'html'): string {
  if (format === 'html') {
    return `<p>${post.excerpt}</p>`;
  }
  return `# ${post.title}\n\n${post.excerpt}`;
}

export function getBlogPosts(locale: Locale = 'en'): BlogPost[] {
  const { BLOG_POSTS } = getPortfolioData(locale);
  const articleModules = getArticleModules(locale);

  return BLOG_POSTS.map((post) => {
    const format = resolveFormat(post);
    const matchedPath = Object.keys(articleModules).find(
      (path) => path.endsWith(`/${post.filename}`) || path.endsWith(post.filename)
    );
    const content = matchedPath ? articleModules[matchedPath] : '';
    return {
      ...post,
      format,
      coverImage: BLOG_COVERS[post.slug],
      content: content || fallbackContent(post, format),
    };
  });
}

export function getBlogPostBySlug(slug: string, locale: Locale = 'en'): BlogPost | undefined {
  return getBlogPosts(locale).find((p) => p.slug === slug);
}
