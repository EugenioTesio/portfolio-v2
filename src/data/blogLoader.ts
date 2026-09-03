import { BlogPost } from '../types';
import { BLOG_POSTS } from './portfolioData';

// Vite eager raw markdown glob
const markdownModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  eager: true,
  import: 'default'
}) as Record<string, string>;

export function getBlogPosts(): BlogPost[] {
  return BLOG_POSTS.map(post => {
    // Find matching markdown file content
    const matchedPath = Object.keys(markdownModules).find(path => 
      path.endsWith(`/${post.filename}`) || path.endsWith(post.filename)
    );
    const content = matchedPath ? markdownModules[matchedPath] : '';
    return {
      ...post,
      content: content || `# ${post.title}\n\n${post.excerpt}`
    };
  });
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find(p => p.slug === slug);
}
