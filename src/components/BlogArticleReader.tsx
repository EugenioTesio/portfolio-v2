import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { PluggableList } from 'unified';
import dart from 'highlight.js/lib/languages/dart';
import typescript from 'highlight.js/lib/languages/typescript';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { BlogPost } from '../types';
import { Locale } from '../data/portfolio';
import { getBlogArticleUrl } from '../utils/blogUrls';
import HtmlArticleBody from './HtmlArticleBody';

const markdownRehypePlugins: PluggableList = [
  [
    rehypeHighlight,
    {
      languages: {
        dart,
        typescript,
        ts: typescript,
      },
    },
  ],
];

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const hasLanguage = typeof className === 'string' && /\blanguage-/.test(className);
    const isBlock = hasLanguage || String(children).includes('\n');
    const resolvedClassName = hasLanguage
      ? className
      : isBlock
        ? 'language-dart hljs'
        : className;

    return (
      <code className={resolvedClassName} {...props}>
        {children}
      </code>
    );
  },
};

interface BlogArticleReaderProps {
  post: BlogPost;
  backHref?: string;
  onClose?: () => void;
}

const DEFAULT_TITLE = 'Eugenio Tesio Portfolio';

export default function BlogArticleReader({
  post,
  backHref = '/#blog',
  onClose,
}: BlogArticleReaderProps) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = `${post.title} | Eugenio Tesio`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [post.title]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getBlogArticleUrl(post.slug, locale));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }
    window.location.href = backHref;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-5 mb-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-lg font-medium text-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('blog.backToArticles')}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-lg font-medium text-muted hover:text-ink"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t('blog.copied')}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>{t('blog.share')}</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-base text-faint">
          {post.category}
          <span className="mx-2">·</span>
          {post.date}
          <span className="mx-2">·</span>
          {post.readTime}
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-[1.1] max-w-[65ch]">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <p className="text-base text-faint">{post.tags.join(' · ')}</p>
        )}
      </div>

      {post.coverImage && (
        <div className="overflow-hidden rounded-2xl border border-line mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-48 sm:h-64 w-full object-cover"
          />
        </div>
      )}

      {post.format === 'html' ? (
        <HtmlArticleBody html={post.content || ''} />
      ) : (
        <div className="html-article">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={markdownRehypePlugins}
            components={markdownComponents}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>
      )}

      <div className="pt-8 mt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-lg font-medium text-ink">{post.author}</p>
          <p className="text-base text-faint">{t('blog.authorRole')}</p>
        </div>

        <button
          onClick={handleBack}
          className="px-4 py-2.5 rounded-lg bg-accent text-page text-lg font-medium"
        >
          {t('blog.doneReading')}
        </button>
      </div>
    </div>
  );
}
