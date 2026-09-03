import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Tag,
  FileCode2,
  X,
  Sparkles
} from 'lucide-react';
import { getBlogPosts, getBlogPostBySlug } from '../data/blogLoader';
import { BlogPost } from '../types';

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const allPosts = useMemo(() => getBlogPosts(), []);

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
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <section id="blog" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-bold tracking-[2px]">04. TECHNICAL BLOG & REPOSITORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Notes Rendered from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">Local Markdown</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
              Practical guides on micro-apps, 15-day release trains, RASP hardening, and 100% backend test coverage parsed directly from repository markdown files.
            </p>
          </div>

          {/* Local Repository Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#A0A0A0] self-start md:self-auto backdrop-blur-md">
            <FileCode2 className="w-4 h-4 text-[#00F5FF]" />
            <span>Source: /src/content/blog/*.md</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
          {/* Category Tabs */}
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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & tags..."
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

        {/* Blog Posts Grid */}
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
                {/* Meta Row */}
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

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00F5FF] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tag Pills */}
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

              {/* Bottom Trigger */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#A0A0A0] flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#00F5FF]" />
                  {post.date}
                </span>

                <button
                  id={`read-article-btn-${post.slug}`}
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white transition-colors group/btn"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#00F5FF]" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 p-8 rounded-[24px] bg-white/[0.02] border border-white/10 text-[#A0A0A0] space-y-3 backdrop-blur-xl">
            <p className="text-sm">No articles matched your search query "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F5FF] underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Markdown Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[24px] bg-[#050505]/95 border border-white/15 shadow-2xl p-6 sm:p-10 space-y-8 text-slate-200 backdrop-blur-2xl"
            >
              {/* Header Navigation Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 sticky top-0 bg-[#050505]/95 backdrop-blur-xl -mt-2 pt-2 z-20">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors font-mono"
                >
                  <ArrowLeft className="w-4 h-4 text-[#00F5FF]" />
                  <span>Back to Articles</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyLink(selectedPost.slug)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    {copiedSlug === selectedPost.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00F5FF]" />
                        <span className="text-[#00F5FF] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#00F5FF]" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <button
                    id="close-reader-btn"
                    onClick={() => setSelectedPost(null)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#A0A0A0] hover:text-white border border-white/10 transition-colors"
                    aria-label="Close reader"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Article Top Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                    {selectedPost.category}
                  </span>
                  <span className="text-[#A0A0A0] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#00F5FF]" />
                    {selectedPost.date}
                  </span>
                  <span className="text-[#A0A0A0] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9D00FF]" />
                    {selectedPost.readTime}
                  </span>
                  <span className="text-[#00F5FF] font-mono text-[10px] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-[#00F5FF]/30 font-bold">
                    Loaded from: {selectedPost.filename}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedPost.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rendered Markdown Body */}
              <div className="markdown-body prose prose-invert max-w-none prose-headings:text-white prose-headings:font-extrabold prose-h1:text-2xl prose-h2:text-xl prose-h2:text-[#00F5FF] prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-[#9D00FF] prose-p:text-slate-300 prose-p:leading-relaxed prose-code:text-[#00F5FF] prose-code:bg-white/[0.05] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-xs prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:text-xs prose-li:text-slate-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedPost.content || ''}
                </ReactMarkdown>
              </div>

              {/* Article Footer */}
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-[#00F5FF]/40 flex items-center justify-center font-bold text-[#00F5FF] font-mono text-sm shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                    ET
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{selectedPost.author}</div>
                    <div className="text-[11px] text-[#A0A0A0] font-mono">Mobile Expert & Systems Architect</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#00F5FF] text-black text-xs font-extrabold uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
