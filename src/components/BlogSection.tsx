import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  FileCode2,
  X,
} from 'lucide-react';
import { getBlogPosts } from '../data/blogLoader';
import { Locale } from '../data/portfolio';
import { getBlogArticlePath } from '../utils/blogUrls';

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allPosts = useMemo(() => getBlogPosts(locale), [locale]);

  useEffect(() => {
    setSelectedCategory('all');
  }, [locale]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPosts.map(p => p.category)));
    return ['all', ...cats];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  return (
    <section id="blog" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-bold tracking-[2px]">{t('blog.sectionBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('blog.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">{t('blog.titleHighlight')}</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
              {t('blog.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#A0A0A0] self-start md:self-auto backdrop-blur-md">
            <FileCode2 className="w-4 h-4 text-[#00F5FF]" />
            <span>{t('blog.sourceIndicator', { locale })}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5FF]/50 transition-colors font-mono backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-[24px] bg-white/[0.03] border border-white/10 hover:border-[#00F5FF]/40 p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 shadow-2xl hover:shadow-[0_0_35px_rgba(0,245,255,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#A0A0A0] font-mono mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A0A0A0]" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00F5FF] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#A0A0A0] flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#00F5FF]" />
                  {post.date}
                </span>

                <a
                  id={`read-article-btn-${post.slug}`}
                  href={getBlogArticlePath(post.slug, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white transition-colors group/btn"
                >
                  <span>{t('blog.readArticle')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#00F5FF]" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 p-8 rounded-[24px] bg-white/[0.02] border border-white/10 text-[#A0A0A0] space-y-3 backdrop-blur-xl">
            <p className="text-sm">{t('blog.noResults', { query: searchQuery })}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F5FF] underline underline-offset-4"
            >
              {t('blog.resetFilters')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
