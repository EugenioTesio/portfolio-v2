import { Children, isValidElement, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { getBlogArticleUrl, getBlogIndexPath } from '../utils/blogUrls';
import { ensureMermaid } from '../utils/mermaidClient';

const HtmlArticleBody = lazy(() => import('./HtmlArticleBody'));

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

function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    el.textContent = chart;
    el.removeAttribute('data-processed');

    const renderDiagram = async () => {
      const mermaid = await ensureMermaid();
      if (cancelled || !ref.current) return;
      try {
        await mermaid.run({ nodes: [ref.current] });
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          console.error('Mermaid diagram failed to render', message);
        }
      }
    };

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div className="diagram-frame">
      <div ref={ref} className="mermaid">
        {chart}
      </div>
    </div>
  );
}

function nodeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement(child)) {
        return nodeText((child.props as { children?: ReactNode }).children);
      }
      return '';
    })
    .join('');
}

const markdownComponents: Components = {
  pre({ children }) {
    const codeNode = Children.toArray(children).find(
      (node) =>
        isValidElement(node) &&
        typeof (node.props as { className?: string }).className === 'string'
    );
    if (isValidElement(codeNode)) {
      const className = (codeNode.props as { className?: string }).className ?? '';
      if (/\blanguage-mermaid\b/.test(className)) {
        const chart = nodeText(
          (codeNode.props as { children?: ReactNode }).children
        ).replace(/\n$/, '');
        return <MermaidBlock chart={chart} />;
      }
    }
    return <pre>{children}</pre>;
  },
  code({ className, children, ...props }) {
    const source = String(children).replace(/\n$/, '');
    const hasLanguage = typeof className === 'string' && /\blanguage-/.test(className);
    const isBlock = hasLanguage || source.includes('\n');
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
  backHref,
  onClose,
}: BlogArticleReaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const resolvedBackHref = backHref ?? getBlogIndexPath(locale);
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
    navigate(resolvedBackHref);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-5 mb-8">
        <Link
          to={resolvedBackHref}
          onClick={(event) => {
            if (onClose) {
              event.preventDefault();
              onClose();
            }
          }}
          className="inline-flex items-center gap-2 text-lg font-medium text-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('blog.backToArticles')}</span>
        </Link>

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
            className="w-full h-auto"
          />
        </div>
      )}

      {post.format === 'html' ? (
        <Suspense fallback={null}>
          <HtmlArticleBody html={post.content || ''} />
        </Suspense>
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
