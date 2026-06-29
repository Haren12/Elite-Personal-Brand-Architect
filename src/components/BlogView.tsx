/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Calendar, Clock, BookOpen, Tag, ArrowLeft, Play, LayoutGrid, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { BlogPost } from '../types';
import { getBlogPostingSchema } from '../utils/seo';

interface BlogViewProps {
  posts: BlogPost[];
  lang: 'en' | 'ne';
  setView: (view: 'home' | 'blog' | 'news' | 'contact' | 'admin') => void;
}

// Inline Custom Markdown Parser to avoid dependency weight, fully styled with Tailwind CSS
export function CustomMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const renderedElements = lines.map((line, idx) => {
    // 1. Code Block parsing
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeText = codeLines.join('\n');
        codeLines = [];
        return (
          <pre key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-indigo-300 overflow-x-auto my-4">
            <code>{codeText}</code>
          </pre>
        );
      } else {
        inCodeBlock = true;
        return null;
      }
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return null;
    }

    // 2. Headings
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-lg font-bold text-white mt-6 mb-3 border-b border-slate-900 pb-1">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-l-4 border-indigo-500 pl-3">
          {line.replace('## ', '')}
        </h3>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={idx} className="text-2xl font-extrabold text-white mt-10 mb-4">
          {line.replace('# ', '')}
        </h2>
      );
    }

    // 3. Blockquotes
    if (line.startsWith('> ')) {
      return (
        <blockquote key={idx} className="border-l-4 border-slate-700 bg-slate-900/40 px-4 py-3 my-4 italic text-slate-300 rounded-r">
          {line.replace('> ', '')}
        </blockquote>
      );
    }

    // 4. Bullet lists
    if (line.startsWith('- ')) {
      return (
        <li key={idx} className="list-disc list-inside text-slate-400 pl-4 my-1.5 leading-relaxed">
          {line.replace('- ', '')}
        </li>
      );
    }

    // 5. Empty lines
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }

    // 6. Bold / Italic / Code processing for inline text
    let processed = line;
    // Replace markdown bold (**text**)
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Replace inline code (`code`)
    processed = processed.replace(/`(.*?)`/g, '<code class="bg-slate-900 border border-slate-850 text-indigo-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

    return (
      <p
        key={idx}
        className="text-slate-300 text-sm md:text-base leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  });

  return <div className="space-y-1 select-text">{renderedElements}</div>;
}

export default function BlogView({ posts, lang, setView }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Derive global lists
  const allCategories = useMemo(() => {
    return Array.from(new Set(posts.flatMap((p) => p.categories)));
  }, [posts]);

  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap((p) => p.tags)));
  }, [posts]);

  // Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const translation = lang === 'ne' ? post.translations.ne : post.translations.en;
      const matchesSearch =
        translation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory ? post.categories.includes(activeCategory) : true;
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true;

      return matchesSearch && matchesCategory && matchesTag && post.status === 'published';
    });
  }, [posts, searchQuery, activeCategory, activeTag, lang]);

  // Pagination bounds
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Popular and Featured posts logic
  const popularPosts = useMemo(() => {
    return posts.filter((p) => p.isPopular && p.status === 'published').slice(0, 3);
  }, [posts]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setSelectedPost(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      
      {/* Schema.org JSON-LD structured metadata inject */}
      {selectedPost && (
        <script type="application/ld+json">
          {JSON.stringify(getBlogPostingSchema(selectedPost, lang))}
        </script>
      )}

      {selectedPost ? (
        /* ==================== 1. DETAIL VIEW ==================== */
        <article className="max-w-4xl mx-auto space-y-8" aria-labelledby="post-title">
          {/* Back btn */}
          <button
            id="blog-back-btn"
            onClick={handleBackToGrid}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{lang === 'ne' ? 'पछाडि जानुहोस्' : 'Back to Blog Grid'}</span>
          </button>

          {/* Heading */}
          <div className="space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1 text-xs font-semibold">
                {selectedPost.categories[0]}
              </span>
              <div className="flex items-center text-xs text-slate-400 space-x-3 font-mono">
                <span className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{selectedPost.readingTimeMin} Min Read</span>
                </span>
              </div>
            </div>

            <h1 id="post-title" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? selectedPost.translations.ne.title : selectedPost.translations.en.title}
            </h1>
          </div>

          {/* Main Image Banner */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={selectedPost.featuredImage}
              alt={lang === 'ne' ? selectedPost.translations.ne.title : selectedPost.translations.en.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Content & Author Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            
            {/* Main content body */}
            <div className="lg:col-span-8 text-left space-y-6 border-b border-slate-900 pb-12 lg:border-0 lg:pb-0">
              <CustomMarkdown content={lang === 'ne' ? selectedPost.translations.ne.content : selectedPost.translations.en.content} />

              {/* Embed Video Block if present */}
              {selectedPost.videoUrl && (
                <div className="my-8 space-y-3">
                  <h4 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Play size={14} className="text-indigo-400" />
                    <span>Tutorial & Video Reference</span>
                  </h4>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-black shadow-lg">
                    <iframe
                      src={selectedPost.videoUrl}
                      title="Post Video Reference"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Photo Gallery if present */}
              {selectedPost.gallery && selectedPost.gallery.length > 0 && (
                <div className="my-8 space-y-3">
                  <h4 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <LayoutGrid size={14} className="text-indigo-400" />
                    <span>Interactive Image Gallery</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.gallery.map((img, idx) => (
                      <div key={idx} className="relative h-40 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                        <img
                          src={img}
                          alt={`Gallery Asset ${idx}`}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-900">
                {selectedPost.tags.map((t) => (
                  <span key={t} className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
                    <Tag size={10} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar with Author & Quick Nav */}
            <div className="lg:col-span-4 space-y-8 text-left">
              {/* Author Profile */}
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/35 space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedPost.author.name}</h4>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">AUTHOR & PUBLISHER</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ne' ? selectedPost.author.bioNp : selectedPost.author.bioEn}
                </p>
              </div>

              {/* Related posts list */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Related Articles</h4>
                <div className="space-y-3">
                  {posts
                    .filter((p) => p.id !== selectedPost.id && p.status === 'published')
                    .slice(0, 3)
                    .map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        onClick={() => handlePostClick(relatedPost)}
                        className="p-3 rounded-lg border border-slate-900 bg-slate-900/10 hover:bg-slate-900/40 cursor-pointer transition-colors space-y-1.5"
                      >
                        <span className="text-[10px] font-mono text-indigo-400">{relatedPost.categories[0]}</span>
                        <h5 className="text-sm font-bold text-slate-200 line-clamp-1 hover:text-white">
                          {lang === 'ne' ? relatedPost.translations.ne.title : relatedPost.translations.en.title}
                        </h5>
                      </div>
                    ))}
                </div>
              </div>
            </div>

          </div>
        </article>
      ) : (
        /* ==================== 2. GRID / DIRECTORY VIEW ==================== */
        <div className="space-y-12">
          {/* Header titles */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Writings & Tutorials</span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'प्राविधिक ब्लग र सिकाइ केन्द्र' : 'Knowledge Hub & Tech Blog'}
            </h1>
            <p className="text-slate-400">
              {lang === 'ne'
                ? 'वेभ विकास, वर्डप्रेस आर्किटेक्चर, सर्च इन्जिन अप्टिमाइजेशन (SEO) र एआई सम्बन्धी आधुनिक प्राविधिक गाइडहरू।'
                : 'Decoupled system architecture blueprints, WordPress deep-dives, strategic SEO analysis, and generative AI patterns.'}
            </p>
          </div>

          {/* Search, Filter Tools */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-b border-slate-900 pb-6">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={lang === 'ne' ? 'सामग्री खोजी गर्नुहोस्...' : 'Search articles & tags...'}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  !activeCategory ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Core Blog Grid and Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Blog Grid */}
            <div className="lg:col-span-8 space-y-8">
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginatedPosts.map((post, idx) => {
                    const translation = lang === 'ne' ? post.translations.ne : post.translations.en;
                    return (
                      <motion.div
                        key={post.id}
                        whileHover={{ y: -4 }}
                        onClick={() => handlePostClick(post)}
                        id={`blog-card-${idx}`}
                        className="flex flex-col overflow-hidden rounded-xl border border-slate-850 bg-slate-900/30 cursor-pointer hover:border-slate-700 transition-all text-left"
                      >
                        {/* Featured Image */}
                        <div className="h-44 w-full bg-slate-950 overflow-hidden relative">
                          <img
                            src={post.featuredImage}
                            alt={translation.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 right-3 rounded bg-indigo-600/90 px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase">
                            {post.categories[0]}
                          </span>
                        </div>

                        {/* Text and stats */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-[10px] font-mono text-slate-400 space-x-2">
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{post.readingTimeMin} Min Read</span>
                            </div>
                            <h3 className="text-base font-bold text-white line-clamp-2 hover:text-indigo-400 transition-colors">
                              {translation.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                              {translation.excerpt}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[9px] font-mono bg-slate-950 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 space-y-2 rounded-xl border border-dashed border-slate-800">
                  <p className="text-base font-bold">No blog posts found</p>
                  <p className="text-xs">Try adjusting your filters or search tags.</p>
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 pt-6 border-t border-slate-900 font-mono text-xs">
                  <button
                    id="blog-page-prev"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850"
                  >
                    Previous
                  </button>
                  <span className="text-slate-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    id="blog-page-next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Column (Featured & Recent lists) */}
            <div className="lg:col-span-4 text-left space-y-8">
              
              {/* Popular Articles widget */}
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/20 space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award size={14} className="text-indigo-400" />
                  <span>Popular Articles</span>
                </h4>
                <div className="space-y-4">
                  {popularPosts.map((pop, popIdx) => {
                    const translation = lang === 'ne' ? pop.translations.ne : pop.translations.en;
                    return (
                      <div
                        key={pop.id}
                        id={`popular-blog-${popIdx}`}
                        onClick={() => handlePostClick(pop)}
                        className="cursor-pointer space-y-1 group"
                      >
                        <span className="text-[10px] font-mono text-slate-500">{new Date(pop.publishedAt).toLocaleDateString()}</span>
                        <h5 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                          {translation.title}
                        </h5>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tag Cloud */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Tag Cloud</h4>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTag(activeTag === tag ? null : tag);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                        activeTag === tag
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
