import { BlogPost } from '../types';
import { BLOG_POSTS } from './portfolioData';

const markdownModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  eager: true,
  import: 'default'
}) as Record<string, string>;

const htmlModules = import.meta.glob('../content/blog/*.html', {
  query: '?raw',
  eager: true,
  import: 'default'
}) as Record<string, string>;

const articleModules = { ...markdownModules, ...htmlModules };

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

export function getBlogPosts(): BlogPost[] {
  return BLOG_POSTS.map(post => {
    const format = resolveFormat(post);
    const matchedPath = Object.keys(articleModules).find(path =>
      path.endsWith(`/${post.filename}`) || path.endsWith(post.filename)
    );
    const content = matchedPath ? articleModules[matchedPath] : '';
    return {
      ...post,
      format,
      content: content || fallbackContent(post, format)
    };
  });
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find(p => p.slug === slug);
}
