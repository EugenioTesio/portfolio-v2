import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, X } from 'lucide-react';
import { getBlogPosts } from '../data/blogLoader';
import { Locale } from '../data/portfolio';
import { BlogPost } from '../types';
import { getBlogArticlePath } from '../utils/blogUrls';

interface BlogPostListProps {
  limit?: number;
  showFilters?: boolean;
  openInNewTab?: boolean;
}

function PostCard({
  post,
  locale,
  openInNewTab,
  readLabel,
}: {
  post: BlogPost;
  locale: Locale;
  openInNewTab: boolean;
  readLabel: string;
}) {
  const href = getBlogArticlePath(post.slug, locale);
  const linkClassName =
    'mt-auto inline-flex items-center gap-1.5 text-lg font-medium text-accent';

  return (
    <article className="rounded-2xl bg-surface border border-line overflow-hidden flex flex-col">
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden border-b border-line">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <p className="text-base text-faint">
          {post.category}
          <span className="mx-2">·</span>
          {post.readTime}
        </p>
        <h3 className="text-2xl font-semibold text-ink leading-snug">{post.title}</h3>
        <p className="text-lg leading-relaxed text-muted">{post.excerpt}</p>
        {openInNewTab ? (
          <a
            id={`read-article-btn-${post.slug}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <span>{readLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <Link
            id={`read-article-btn-${post.slug}`}
            to={href}
            className={linkClassName}
          >
            <span>{readLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </article>
  );
}

export default function BlogPostList({
  limit,
  showFilters = true,
  openInNewTab = false,
}: BlogPostListProps) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allPosts = useMemo(() => getBlogPosts(locale), [locale]);

  useEffect(() => {
    setSelectedCategory('all');
  }, [locale]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPosts.map((p) => p.category)));
    return ['all', ...cats];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    const posts = allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });

    return typeof limit === 'number' ? posts.slice(0, limit) : posts;
  }, [allPosts, selectedCategory, searchQuery, limit]);

  const readLabel = t('blog.readArticle');

  return (
    <div>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-base font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-accent text-page'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {cat === 'all' ? t('blog.allCategories') : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-surface border border-line text-base text-ink placeholder:text-faint focus:outline-none focus:border-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
                aria-label={t('blog.resetFilters')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            locale={locale}
            openInNewTab={openInNewTab}
            readLabel={readLabel}
          />
        ))}
      </div>

      {showFilters && filteredPosts.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-lg text-muted">
            {t('blog.noResults', { query: searchQuery })}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-lg font-medium text-accent underline underline-offset-4"
          >
            {t('blog.resetFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
