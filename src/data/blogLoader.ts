import { BlogPost } from '../types';
import { getPortfolioData, Locale } from './portfolio';
import iotCover from '../assets/images/blog/iot-rs485-to-cloud.jpg';
import flutterMitmCover from '../assets/images/blog/flutter-mitm-security-alert.jpg';
import flutterArchitectureCover from '../assets/images/blog/flutter-presentation-architecture-vs-state-management-cover.jpg';

const BLOG_COVERS: Record<string, string> = {
  'iot-rs485-to-cloud': iotCover,
  'flutter-mitm-security-alert': flutterMitmCover,
  'flutter-presentation-architecture-vs-state-management': flutterArchitectureCover,
};

type ArticleLoader = () => Promise<string>;

const markdownModulesEn = import.meta.glob('../content/blog/en/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, ArticleLoader>;

const htmlModulesEn = import.meta.glob('../content/blog/en/*.html', {
  query: '?raw',
  import: 'default',
}) as Record<string, ArticleLoader>;

const markdownModulesEs = import.meta.glob('../content/blog/es/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, ArticleLoader>;

const htmlModulesEs = import.meta.glob('../content/blog/es/*.html', {
  query: '?raw',
  import: 'default',
}) as Record<string, ArticleLoader>;

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

function findArticleLoader(
  articleModules: Record<string, ArticleLoader>,
  filename: string
): ArticleLoader | undefined {
  const matchedPath = Object.keys(articleModules).find(
    (path) => path.endsWith(`/${filename}`) || path.endsWith(filename)
  );
  return matchedPath ? articleModules[matchedPath] : undefined;
}

/** Listing metadata only — article bodies stay in separate chunks. */
export function getBlogPosts(locale: Locale = 'en'): BlogPost[] {
  const { BLOG_POSTS } = getPortfolioData(locale);

  return BLOG_POSTS.map((post) => {
    const format = resolveFormat(post);
    return {
      ...post,
      format,
      coverImage: BLOG_COVERS[post.slug],
    };
  });
}

export async function getBlogPostBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<BlogPost | undefined> {
  const post = getBlogPosts(locale).find((p) => p.slug === slug);
  if (!post) return undefined;

  const format = resolveFormat(post);
  const loader = findArticleLoader(getArticleModules(locale), post.filename);
  const content = loader ? await loader() : '';

  return {
    ...post,
    format,
    content: content || fallbackContent(post, format),
  };
}
