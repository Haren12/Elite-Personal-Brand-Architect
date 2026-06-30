/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Play, Calendar, Eye, Clock, ArrowRight, ArrowLeft, Search, Flame, Megaphone, TrendingUp, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { NewsItem } from '../types';
import { CustomMarkdown } from './BlogView';
import { getNewsArticleSchema } from '../utils/seo';
import ShareMenu from './ShareMenu';

interface NewsViewProps {
  news: NewsItem[];
  lang: 'en' | 'ne';
  setView: (view: 'home' | 'blog' | 'news' | 'contact' | 'admin') => void;
}

export default function NewsView({ news, lang, setView }: NewsViewProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Derive categories from news list with multipurpose defaults
  const newsCategories = useMemo(() => {
    const defaults = [
      'Artificial Intelligence',
      'Cyber Security',
      'Programming',
      'Web Development',
      'WordPress',
      'SEO',
      'Digital Marketing',
      'Startup',
      'Nepal News',
      'World News',
      'Opinion',
      'Tutorials',
      'Health & Wellness',
      'Education',
      'Business & Finance',
      'Lifestyle',
      'Sports & Fitness',
      'General News',
      'Travel & Tourism',
      'Entertainment',
      'Science & Technology',
      'Agriculture & Farming',
      'Food & Recipes'
    ];
    const existing = news.map((n) => n.category).filter(Boolean);
    return Array.from(new Set([...defaults, ...existing]));
  }, [news]);

  // Filter breaking news for the ticker
  const breakingNews = useMemo(() => {
    return news.filter((n) => n.isBreaking && n.status === 'published');
  }, [news]);

  // Filter trending news
  const trendingNews = useMemo(() => {
    return news.filter((n) => n.isTrending && n.status === 'published').slice(0, 4);
  }, [news]);

  // Filter latest news list
  const filteredNews = useMemo(() => {
    return news.filter((n) => {
      const translation = lang === 'ne' ? n.translations.ne : n.translations.en;
      const matchesSearch =
        translation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory ? n.category === activeCategory : true;

      return matchesSearch && matchesCategory && n.status === 'published';
    });
  }, [news, searchQuery, activeCategory, lang]);

  // Hero news item (featured and sticky, or just first featured)
  const heroNews = useMemo(() => {
    const featured = news.find((n) => n.isFeatured && n.status === 'published');
    return featured || news.find((n) => n.status === 'published') || null;
  }, [news]);

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      
      {/* Schema.org NewsArticle Metadata inject */}
      {selectedNews && (
        <script type="application/ld+json">
          {JSON.stringify(getNewsArticleSchema(selectedNews, lang))}
        </script>
      )}

      {/* ==================== BREAKING NEWS TICKER ==================== */}
      {breakingNews.length > 0 && !selectedNews && (
        <div className="mb-8 overflow-hidden rounded-lg border border-rose-950 bg-rose-950/20 p-1 flex items-center" id="breaking-news-ticker">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-bold font-sans uppercase animate-pulse">
            <Radio size={14} />
            <span>Breaking</span>
          </div>
          {/* Ticker scrolling text container */}
          <div className="flex-1 overflow-hidden relative ml-3">
            <div className="animate-marquee whitespace-nowrap text-sm text-rose-200 font-medium">
              {breakingNews.map((bn, idx) => (
                <span
                  key={bn.id}
                  onClick={() => handleNewsClick(bn)}
                  className="inline-block cursor-pointer hover:underline mr-12"
                >
                  ⚡ {lang === 'ne' ? bn.translations.ne.title : bn.translations.en.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedNews ? (
        /* ==================== NEWS DETAIL VIEW ==================== */
        <article className="max-w-4xl mx-auto space-y-8 text-left" aria-labelledby="news-title">
          {/* Back btn */}
          <button
            id="news-back-btn"
            onClick={() => setSelectedNews(null)}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{lang === 'ne' ? 'समाचार सूचीमा फर्कनुहोस्' : 'Back to News Portal'}</span>
          </button>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-rose-600 px-2.5 py-1 text-xs font-bold text-white uppercase font-sans">
                  {selectedNews.category}
                </span>
                <div className="flex items-center text-xs text-slate-400 space-x-3 font-mono">
                  <span>By {selectedNews.author}</span>
                  <span>•</span>
                  <span>{new Date(selectedNews.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedNews.views} Views</span>
                </div>
              </div>
              <ShareMenu
                title={lang === 'ne' ? selectedNews.translations.ne.title : selectedNews.translations.en.title}
                url={`https://harendralamsal.name.np/news/${selectedNews.slug}`}
                lang={lang}
              />
            </div>

            <h1 id="news-title" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? selectedNews.translations.ne.title : selectedNews.translations.en.title}
            </h1>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={selectedNews.featuredImage}
              alt={lang === 'ne' ? selectedNews.translations.ne.title : selectedNews.translations.en.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-invert max-w-none pt-4">
            <CustomMarkdown content={lang === 'ne' ? selectedNews.translations.ne.content : selectedNews.translations.en.content} />
          </div>

          {selectedNews.videoUrl && (
            <div className="my-10 space-y-3 border-t border-slate-900 pt-8">
              <h4 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Play size={14} className="text-rose-500 animate-pulse" />
                <span>Associated Video Coverage</span>
              </h4>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-black">
                <iframe
                  src={selectedNews.videoUrl}
                  title="Associated Video Clip"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Bottom disclaimer / credits */}
          <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 font-mono">
            <span>CANONICAL: https://harendralamsal.name.np/news/{selectedNews.slug}</span>
            <span className="block mt-1">ISSUED BY HARENDRA LAMSAL GLOBAL PRESS HUB • KATHMANDU</span>
          </div>

        </article>
      ) : (
        /* ==================== MASTER PORTAL GRID ==================== */
        <div className="space-y-12">
          
          {/* Main Title Hub */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center space-x-1">
              <Flame size={12} className="animate-pulse" />
              <span>Global Technology Feed</span>
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'प्रविधि समाचार र विश्लेषण' : 'Harendra Tech News Portal'}
            </h1>
            <p className="text-slate-400 text-sm">
              {lang === 'ne'
                ? 'कृत्रिम बुद्धिमत्ता (AI), प्रोग्रामिङ, साइबर सुरक्षा, स्टार्टअप र विश्वव्यापी प्रविधि बजारको ताजा अपडेट र विस्तृत रिपोर्टहरू।'
                : 'Real-time industry bulletins, cybersecurity warnings, Artificial Intelligence advancements, and localized startup ecosystem reports.'}
            </p>
          </div>

          {/* Search, Category Filters */}
          <div className="flex flex-col lg:flex-row items-center gap-4 justify-between border-b border-slate-900 pb-6">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ne' ? 'समाचार खोज्नुहोस्...' : 'Search news bulletin...'}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto max-w-full pb-2 scrollbar-none">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  !activeCategory ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All News
              </button>
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    activeCategory === cat ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Top layout: Hero & Trending */}
          {!searchQuery && !activeCategory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Hero Featured Block */}
              {heroNews && (
                <div
                  className="lg:col-span-8 flex flex-col cursor-pointer border border-slate-900 rounded-xl overflow-hidden bg-slate-900/10 hover:border-slate-800 group text-left"
                  onClick={() => handleNewsClick(heroNews)}
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={heroNews.featuredImage}
                      alt="Hero News"
                      className="h-full w-full object-cover group-hover:scale-101 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white uppercase font-sans tracking-wide">
                      {heroNews.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-xs font-mono text-slate-500 space-x-3">
                      <span>By {heroNews.author}</span>
                      <span>•</span>
                      <span>{new Date(heroNews.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-rose-400 transition-colors" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      {lang === 'ne' ? heroNews.translations.ne.title : heroNews.translations.en.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                      {lang === 'ne' ? heroNews.translations.ne.excerpt : heroNews.translations.en.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {/* Trending side panel */}
              <div className="lg:col-span-4 space-y-6 text-left">
                <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                  <TrendingUp className="text-rose-500 animate-pulse" size={18} />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Trending Bulletins</h3>
                </div>

                <div className="space-y-4">
                  {trendingNews.map((trend, idx) => (
                    <div
                      key={trend.id}
                      onClick={() => handleNewsClick(trend)}
                      id={`trending-news-${idx}`}
                      className="flex items-start space-x-4 cursor-pointer group"
                    >
                      <div className="text-2xl font-extrabold text-slate-800 font-mono">0{idx + 1}</div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">{trend.category}</span>
                        <h4 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-rose-400 transition-colors leading-snug">
                          {lang === 'ne' ? trend.translations.ne.title : trend.translations.en.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Latest News Feed */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 text-left">
              <Megaphone size={16} className="text-indigo-400" />
              <h3 className="text-base font-bold text-white">Latest Headlines</h3>
            </div>

            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {filteredNews.map((newsItem, idx) => {
                  const translation = lang === 'ne' ? newsItem.translations.ne : newsItem.translations.en;
                  return (
                    <div
                      key={newsItem.id}
                      onClick={() => handleNewsClick(newsItem)}
                      id={`news-card-${idx}`}
                      className="flex flex-col overflow-hidden rounded-xl border border-slate-900 bg-slate-900/30 hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="h-40 w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={newsItem.featuredImage}
                          alt={translation.title}
                          className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 rounded bg-slate-900/90 border border-slate-800 px-2.5 py-0.5 text-[9px] font-mono font-bold text-slate-300 uppercase">
                          {newsItem.category}
                        </span>
                      </div>

                      {/* Text */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-[10px] font-mono text-slate-500 space-x-2">
                            <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{newsItem.views} Views</span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2">
                            {translation.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                            {translation.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-semibold text-rose-400 hover:text-rose-300">
                          <span>Read Full Story</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 rounded-xl border border-dashed border-slate-900">
                <p className="text-base font-bold">No news items found</p>
                <p className="text-xs mt-1">Try refining your keyword query.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
