import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  X,
} from 'lucide-react';
import { BlogPost } from '../types';
import { Locale } from '../data/portfolio';
import { getBlogArticleUrl } from '../utils/blogUrls';
import HtmlArticleBody from './HtmlArticleBody';

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
    <div className="relative w-full max-w-4xl mx-auto rounded-[24px] bg-[#050505]/95 border border-white/15 shadow-2xl p-6 sm:p-10 space-y-8 text-slate-200 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-5 sticky top-0 bg-[#050505]/95 backdrop-blur-xl -mt-2 pt-2 z-20">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4 text-[#00F5FF]" />
          <span>{t('blog.backToArticles')}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00F5FF]" />
                <span className="text-[#00F5FF] font-bold">{t('blog.copied')}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#00F5FF]" />
                <span>{t('blog.share')}</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              id="close-reader-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#A0A0A0] hover:text-white border border-white/10 transition-colors"
              aria-label={t('blog.closeReader')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
            {post.category}
          </span>
          <span className="text-[#A0A0A0] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#00F5FF]" />
            {post.date}
          </span>
          <span className="text-[#A0A0A0] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#9D00FF]" />
            {post.readTime}
          </span>
          <span className="text-[#00F5FF] font-mono text-[10px] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-[#00F5FF]/30 font-bold">
            {t('blog.loadedFrom', { filename: post.filename })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {post.coverImage && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
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
        <div className="markdown-body prose prose-invert max-w-none prose-headings:text-white prose-headings:font-extrabold prose-h1:text-2xl prose-h2:text-xl prose-h2:text-[#00F5FF] prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-[#9D00FF] prose-p:text-slate-300 prose-p:leading-relaxed prose-code:text-[#00F5FF] prose-code:bg-white/[0.05] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-xs prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:text-xs prose-li:text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content || ''}
          </ReactMarkdown>
        </div>
      )}

      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-[#00F5FF]/40 flex items-center justify-center font-bold text-[#00F5FF] font-mono text-sm shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            ET
          </div>
          <div>
            <div className="text-xs font-bold text-white">{post.author}</div>
            <div className="text-[11px] text-[#A0A0A0] font-mono">{t('blog.authorRole')}</div>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="px-6 py-2.5 rounded-xl bg-[#00F5FF] text-black text-xs font-extrabold uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
        >
          {t('blog.doneReading')}
        </button>
      </div>
    </div>
  );
}
