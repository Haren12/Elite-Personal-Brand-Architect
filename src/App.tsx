/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, LogIn, Mail, Lock, CheckCircle, Github, Linkedin, Twitter, Youtube } from 'lucide-react';

// Import datasets
import { INITIAL_BLOG_POSTS, INITIAL_NEWS_ITEMS } from './data';
import { BlogPost, NewsItem } from './types';

// Import core UI modules
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import PortfolioView from './components/PortfolioView';
import BlogView from './components/BlogView';
import NewsView from './components/NewsView';
import ContactView from './components/ContactView';
import AdminDashboard from './components/AdminDashboard';
import Newsletter from './components/Newsletter';
import BrandLogo from './components/BrandLogo';
import AiAssistantChat from './components/AiAssistantChat';

export default function App() {
  const [lang, setLang] = useState<'en' | 'ne'>('en');
  const [view, setView] = useState<'home' | 'blog' | 'news' | 'contact' | 'admin'>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [activeNewsSlug, setActiveNewsSlug] = useState<string | null>(null);

  const handleSetView = (newView: 'home' | 'blog' | 'news' | 'contact' | 'admin') => {
    setView(newView);
    setActiveBlogSlug(null);
    setActiveNewsSlug(null);
    
    let path = '/';
    if (newView !== 'home') {
      path = `/${newView}`;
    }
    
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const handleSelectBlogSlug = (slug: string | null) => {
    setActiveBlogSlug(slug);
    if (slug) {
      window.history.pushState(null, '', `/blog/${slug}`);
    } else {
      window.history.pushState(null, '', '/blog');
    }
  };

  const handleSelectNewsSlug = (slug: string | null) => {
    setActiveNewsSlug(slug);
    if (slug) {
      window.history.pushState(null, '', `/news/${slug}`);
    } else {
      window.history.pushState(null, '', '/news');
    }
  };

  // Dynamic state for posts and news so the CMS functions instantly in memory
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  // Supabase Configuration Status State
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseStatusLoading, setSupabaseStatusLoading] = useState(true);

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('harendra_admin_password') || 'harendra123';
  });

  const handlePasswordChange = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('harendra_admin_password', newPass);
  };

  // Load datasets from localStorage or default to static
  useEffect(() => {
    const savedBlogs = localStorage.getItem('harendra_blogs');
    const savedNews = localStorage.getItem('harendra_news');
    const authStatus = localStorage.getItem('harendra_auth');

    if (savedBlogs) {
      setBlogPosts(JSON.parse(savedBlogs));
    } else {
      setBlogPosts(INITIAL_BLOG_POSTS);
    }

    if (savedNews) {
      try {
        const parsedNews = JSON.parse(savedNews) as NewsItem[];
        const hasLatest = parsedNews.some(n => n.slug === 'google-gemini-1-5-pro-redefines-multimodal-context-windows-coding');
        if (!hasLatest) {
          setNewsItems(INITIAL_NEWS_ITEMS);
          localStorage.setItem('harendra_news', JSON.stringify(INITIAL_NEWS_ITEMS));
        } else {
          setNewsItems(parsedNews);
        }
      } catch (e) {
        setNewsItems(INITIAL_NEWS_ITEMS);
        localStorage.setItem('harendra_news', JSON.stringify(INITIAL_NEWS_ITEMS));
      }
    } else {
      setNewsItems(INITIAL_NEWS_ITEMS);
    }

    if (authStatus === 'true') {
      setIsAdminLoggedIn(true);
    }

    // Connect and synchronize with Supabase backend database if available
    const syncSupabase = async () => {
      try {
        const statusRes = await fetch('/api/supabase/status');
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setSupabaseConfigured(statusData.configured);
          setSupabaseConnected(statusData.connected || false);
          setSupabaseError(statusData.error || null);
          
          if (statusData.configured && statusData.connected) {
            const blogsRes = await fetch('/api/supabase/blogs');
            if (blogsRes.ok) {
              const blogsData = await blogsRes.json();
              if (blogsData.configured && blogsData.posts && blogsData.posts.length > 0) {
                setBlogPosts(blogsData.posts);
                localStorage.setItem('harendra_blogs', JSON.stringify(blogsData.posts));
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Supabase Sync Warning]: Could not reach the server API:', err);
      } finally {
        setSupabaseStatusLoading(false);
      }
    };

    const fetchNews = async () => {
      try {
        const newsRes = await fetch('/api/news');
        if (newsRes.ok) {
          const serverNews = await newsRes.json() as NewsItem[];
          
          // Retrieve what we currently have in localStorage (local draft/added posts)
          const savedNewsStr = localStorage.getItem('harendra_news');
          let mergedNews = [...serverNews];

          if (savedNewsStr) {
            try {
              const localNews = JSON.parse(savedNewsStr) as NewsItem[];
              // Find any item in localNews that does not exist in serverNews by id or slug
              const missingOnServer = localNews.filter(
                (localItem) => !serverNews.some((srvItem) => srvItem.id === localItem.id || srvItem.slug === localItem.slug)
              );

              if (missingOnServer.length > 0) {
                // We have news items that only exist locally on this browser! Let's upload them to the server.
                for (const item of missingOnServer) {
                  try {
                    await fetch('/api/news', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(item),
                    });
                  } catch (err) {
                    console.error('[Sync News Item Error]:', err);
                  }
                }
                // Combine local items to server items so the local ones are preserved in UI
                mergedNews = [...missingOnServer, ...serverNews];
              }
            } catch (e) {
              console.error('[Local News Parse Error]:', e);
            }
          }

          setNewsItems(mergedNews);
          localStorage.setItem('harendra_news', JSON.stringify(mergedNews));
        }
      } catch (err) {
        console.warn('[News Server Fetch Warning]: Could not reach backend news API:', err);
      }
    };

    syncSupabase();
    fetchNews();
  }, []);

  // Synchronize route pathname on startup & popstate
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.split('/blog/')[1];
        if (slug) {
          setView('blog');
          setActiveBlogSlug(slug);
        } else {
          setView('blog');
          setActiveBlogSlug(null);
        }
      } else if (path === '/blog') {
        setView('blog');
        setActiveBlogSlug(null);
      } else if (path.startsWith('/news/')) {
        const slug = path.split('/news/')[1];
        if (slug) {
          setView('news');
          setActiveNewsSlug(slug);
        } else {
          setView('news');
          setActiveNewsSlug(null);
        }
      } else if (path === '/news') {
        setView('news');
        setActiveNewsSlug(null);
      } else if (path === '/contact') {
        setView('contact');
        setActiveBlogSlug(null);
        setActiveNewsSlug(null);
      } else if (path === '/admin') {
        setView('admin');
        setActiveBlogSlug(null);
        setActiveNewsSlug(null);
      } else {
        setView('home');
        setActiveBlogSlug(null);
        setActiveNewsSlug(null);
      }
    };

    // Run on mount
    handleUrlRouting();

    // Listen to popstate (back/forward buttons)
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Sync to state, local cache & Supabase backend if configured
  const addBlogPost = async (newPost: BlogPost) => {
    let postToSave = newPost;

    // Persist to Supabase if configured
    if (supabaseConfigured) {
      try {
        const res = await fetch('/api/supabase/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || `Server returned non-OK code (${res.status})`;
          console.error('[Supabase Save Error]:', errMsg);
          throw new Error(errMsg);
        } else {
          const successData = await res.json();
          if (successData.success && successData.data) {
            postToSave = successData.data; // Use returned database row with true UUID!
            console.log('[Supabase]: Blog post saved successfully with ID:', postToSave.id);
          }
        }
      } catch (e: any) {
        console.error('[Supabase Sync Error]: Network issue during save:', e);
        throw e;
      }
    }

    // Update state with finalized post (replaces any temporary optimistic item)
    const updated = [postToSave, ...blogPosts.filter((p) => p.id !== newPost.id && p.slug !== newPost.slug)];
    setBlogPosts(updated);
    localStorage.setItem('harendra_blogs', JSON.stringify(updated));
    return postToSave;
  };

  const deleteBlogPost = async (id: string) => {
    // 1. Instantly update UI (optimistic)
    const updated = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(updated);
    localStorage.setItem('harendra_blogs', JSON.stringify(updated));

    // 2. Persist deletion in the background
    if (supabaseConfigured) {
      try {
        const res = await fetch(`/api/supabase/blogs/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          console.warn('[Supabase Delete Error]: Server returned non-OK status.');
        } else {
          console.log('[Supabase]: Blog post deleted successfully from live database.');
        }
      } catch (e) {
        console.warn('[Supabase Sync Error]: Network issue during deletion:', e);
      }
    }
  };

  const addNewsItem = async (newItem: NewsItem) => {
    let itemToSave = newItem;

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || `Server error during news insertion (${res.status})`;
        console.error('[News Sync Error]:', errMsg);
        throw new Error(errMsg);
      } else {
        const successData = await res.json();
        if (successData.success && successData.data) {
          itemToSave = successData.data;
        }
      }
    } catch (e: any) {
      console.error('[News Sync Error]: Network issue during news insertion:', e);
      throw e;
    }

    const updated = [itemToSave, ...newsItems.filter((n) => n.id !== newItem.id && n.slug !== newItem.slug)];
    setNewsItems(updated);
    localStorage.setItem('harendra_news', JSON.stringify(updated));
    return itemToSave;
  };

  const deleteNewsItem = async (id: string) => {
    const updated = newsItems.filter((n) => n.id !== id);
    setNewsItems(updated);
    localStorage.setItem('harendra_news', JSON.stringify(updated));

    // Delete from backend server database
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        console.warn('[News Sync Error]: Server returned non-OK status for news deletion.');
      }
    } catch (e) {
      console.warn('[News Sync Error]: Network issue during news deletion:', e);
    }
  };

  const viewedSlugsRef = useRef<Set<string>>(new Set());

  const incrementBlogView = async (slug: string) => {
    setBlogPosts((prevPosts) => {
      const updated = prevPosts.map((post) => {
        if (post.slug === slug) {
          return { ...post, views: (post.views || 0) + 1 };
        }
        return post;
      });
      localStorage.setItem('harendra_blogs', JSON.stringify(updated));
      return updated;
    });

    if (supabaseConfigured) {
      try {
        const res = await fetch(`/api/supabase/blogs/${slug}/view`, {
          method: 'POST',
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data) {
            const backendViews = resData.data.views_count || resData.data.views || 0;
            setBlogPosts((prevPosts) => {
              const synced = prevPosts.map((post) => {
                if (post.slug === slug && backendViews > (post.views || 0)) {
                  return { ...post, views: backendViews };
                }
                return post;
              });
              localStorage.setItem('harendra_blogs', JSON.stringify(synced));
              return synced;
            });
          }
        }
      } catch (e) {
        console.warn('[Blog View Sync Error]:', e);
      }
    }
  };

  const incrementNewsView = async (slug: string) => {
    setNewsItems((prevNews) => {
      const updated = prevNews.map((item) => {
        if (item.slug === slug) {
          return { ...item, views: (item.views || 0) + 1 };
        }
        return item;
      });
      localStorage.setItem('harendra_news', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`/api/news/${slug}/view`, {
        method: 'POST',
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && typeof resData.views === 'number') {
          const backendViews = resData.views;
          setNewsItems((prevNews) => {
            const synced = prevNews.map((item) => {
              if (item.slug === slug && backendViews > (item.views || 0)) {
                return { ...item, views: backendViews };
              }
              return item;
            });
            localStorage.setItem('harendra_news', JSON.stringify(synced));
            return synced;
          });
        }
      }
    } catch (e) {
      console.warn('[News View Sync Error]:', e);
    }
  };

  // Automatically increment view counts when activeBlogSlug or activeNewsSlug changes
  useEffect(() => {
    if (activeBlogSlug && !viewedSlugsRef.current.has(`blog_${activeBlogSlug}`)) {
      viewedSlugsRef.current.add(`blog_${activeBlogSlug}`);
      incrementBlogView(activeBlogSlug);
    }
  }, [activeBlogSlug]);

  useEffect(() => {
    if (activeNewsSlug && !viewedSlugsRef.current.has(`news_${activeNewsSlug}`)) {
      viewedSlugsRef.current.add(`news_${activeNewsSlug}`);
      incrementNewsView(activeNewsSlug);
    }
  }, [activeNewsSlug]);

  const importBackup = (backup: { posts: BlogPost[]; news: NewsItem[] }) => {
    if (backup.posts) {
      setBlogPosts(backup.posts);
      localStorage.setItem('harendra_blogs', JSON.stringify(backup.posts));
    }
    if (backup.news) {
      setNewsItems(backup.news);
      localStorage.setItem('harendra_news', JSON.stringify(backup.news));
    }
  };

  // Secure local authentication handler
  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (
      loginEmail.trim() === 'harendralamsal4140@gmail.com' &&
      loginPassword === adminPassword
    ) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      localStorage.setItem('harendra_auth', 'true');
    } else {
      setLoginError(
        lang === 'ne'
          ? 'गलत इमेल वा पासवर्ड प्रविष्ट गर्नुभयो।'
          : 'Invalid admin credentials. Please try again.'
      );
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('harendra_auth');
    handleSetView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. SITE WIDE NAVIGATION HEADER */}
      <Navigation 
        lang={lang} 
        setLang={setLang} 
        currentView={view} 
        setView={handleSetView} 
        isAdmin={isAdminLoggedIn} 
        logoutAdmin={handleAdminLogout} 
      />

      {/* 2. DYNAMIC ROUTED VIEWPORT */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full"
            aria-live="polite"
          >
            {/* HOME VIEW: Hero + Personal Brand Matrix Showcase */}
            {view === 'home' && (
              <>
                <Hero lang={lang} setView={handleSetView} />
                <PortfolioView lang={lang} setView={handleSetView} />
                <Newsletter lang={lang} />
              </>
            )}

            {/* TECH BLOG VIEW */}
            {view === 'blog' && (
              <>
                <BlogView 
                  posts={blogPosts} 
                  lang={lang} 
                  setView={handleSetView} 
                  activeSlug={activeBlogSlug}
                  onSelectSlug={handleSelectBlogSlug}
                />
                <Newsletter lang={lang} />
              </>
            )}

            {/* TECH NEWS PORTAL VIEW */}
            {view === 'news' && (
              <>
                <NewsView 
                  news={newsItems} 
                  lang={lang} 
                  setView={handleSetView} 
                  activeSlug={activeNewsSlug}
                  onSelectSlug={handleSelectNewsSlug}
                />
                <Newsletter lang={lang} />
              </>
            )}

            {/* CONTACT VIEW */}
            {view === 'contact' && <ContactView lang={lang} />}

            {/* SECURED ADMIN VIEW */}
            {view === 'admin' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-950">
                {isAdminLoggedIn ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-emerald-400">ADMIN SESSION ACTIVE</span>
                          <span className="text-slate-700">•</span>
                          {supabaseStatusLoading ? (
                            <span className="text-[10px] font-mono text-slate-500 animate-pulse">Checking Database...</span>
                          ) : supabaseConfigured ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-medium">Supabase Connected</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">Offline Local Cache</span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-white">Central CMS Command Centre</h2>
                      </div>
                      <button
                        id="admin-logout-btn"
                        onClick={handleAdminLogout}
                        className="rounded border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        Secure Logout
                      </button>
                    </div>

                    <AdminDashboard
                      posts={blogPosts}
                      news={newsItems}
                      addBlogPost={addBlogPost}
                      deleteBlogPost={deleteBlogPost}
                      addNewsItem={addNewsItem}
                      deleteNewsItem={deleteNewsItem}
                      importBackup={importBackup}
                      currentPassword={adminPassword}
                      onPasswordChange={handlePasswordChange}
                      supabaseConfigured={supabaseConfigured}
                      supabaseConnected={supabaseConnected}
                      supabaseError={supabaseError}
                      supabaseStatusLoading={supabaseStatusLoading}
                    />
                  </div>
                ) : (
                  /* SECURE GATEWAY ENTRANCE CARD */
                  <div className="max-w-md mx-auto py-12" id="admin-login-gateway">
                    <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-8 space-y-6 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-32 w-32 rounded-full bg-rose-600/10 blur-2xl animate-pulse" />
                      
                      <div className="text-center space-y-2 relative z-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-500 mb-3">
                          <ShieldAlert size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                          CMS Gatekeeper
                        </h2>
                        <p className="text-xs text-slate-400">
                          Credential verification required. Authorized personnel only.
                        </p>
                      </div>

                      <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Email Directory</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                              <Mail size={14} />
                            </span>
                            <input
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="handler@gmail.com"
                              className="w-full rounded border border-slate-800 bg-slate-950 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Secret Key</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                              <Lock size={14} />
                            </span>
                            <input
                              type="password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full rounded border border-slate-800 bg-slate-950 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>

                        {loginError && (
                          <div className="p-3 rounded bg-rose-950/30 border border-rose-900/30 text-[11px] text-rose-400 font-mono">
                            {loginError}
                          </div>
                        )}



                        <button
                          type="submit"
                          id="admin-login-submit"
                          className="w-full inline-flex items-center justify-center space-x-1.5 rounded bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow shadow-indigo-600/20"
                        >
                          <LogIn size={12} />
                          <span>Verify & Unlock</span>
                        </button>

                        <div className="text-center pt-2 border-t border-slate-850">
                          <button
                            type="button"
                            onClick={() => {
                              setAdminPassword('harendra123');
                              localStorage.setItem('harendra_admin_password', 'harendra123');
                              setLoginError(lang === 'ne' ? 'पासवर्ड "harendra123" मा रिसेट गरिएको छ।' : 'Password has been reset to "harendra123".');
                            }}
                            className="text-[11px] text-slate-500 hover:text-indigo-400 font-mono transition-colors duration-150"
                          >
                            Forgot Password? Reset to Default
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* 3. PROFESSIONAL ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-left" aria-label="Site Footer">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Brand Section */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <BrandLogo size="sm" />
              <span className="text-base font-extrabold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Harendra Lamsal
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {lang === 'ne'
                ? 'वरिष्ठ प्रविधि परामर्शदाता, वर्डप्रेस विज्ञ तथा डिजिटल मार्केटिङ विशेषज्ञ। काठमाडौं, नेपाल।'
                : 'Enterprise WordPress architect, full-stack systems developer, strategic SEO strategist and tech editor. Based in Kathmandu, Nepal.'}
            </p>
            {/* Social channels */}
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="https://github.com/harendralamsal" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="GitHub Profile">
                <Github size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="LinkedIn Profile">
                <Linkedin size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="Twitter Feed">
                <Twitter size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="YouTube Channel">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Sitemap Directory */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">NAVIGATIONAL PATHS</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => setView('home')} className="hover:text-white">Home Showcase</button></li>
                <li><button onClick={() => setView('blog')} className="hover:text-white">Tech Blog</button></li>
                <li><button onClick={() => setView('news')} className="hover:text-white">News Portal</button></li>
                <li><button onClick={() => setView('contact')} className="hover:text-white">Contact Page</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">LEGAL PROTOCOLS</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => alert('Privacy Policy: All subscriber communications and emails remain 100% confidential under GDPR standards.')} className="hover:text-white">Privacy Policy</button></li>
                <li><button onClick={() => alert('Terms of Service: Content in tech portals and news reports can be cited with attribution to harendralamsal.name.np.')} className="hover:text-white">Terms of Service</button></li>
                <li><button onClick={() => alert('Disclaimer: Opinion sections and tutorials are provided as guidance. Implement code and server settings with caution.')} className="hover:text-white">Disclaimer</button></li>
              </ul>
            </div>
          </div>

          {/* Infrastructure Signage */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider font-semibold">INFRASTRUCTURE CORE</h4>
            <div className="p-3 rounded bg-slate-900/40 border border-slate-850 space-y-1 text-[11px] text-slate-500 font-mono">
              <div className="flex justify-between">
                <span>GATEWAY METRICS:</span>
                <span className="text-indigo-400 font-bold">STABLE</span>
              </div>
              <div className="flex justify-between">
                <span>SITEMAPS STAGE:</span>
                <span className="text-slate-300">DEPLOYED</span>
              </div>
              <div className="flex justify-between">
                <span>CERTIFICATIONS:</span>
                <span className="text-slate-300">VERIFIED</span>
              </div>
              <div className="flex justify-between pt-1 mt-1 border-t border-slate-900 text-[10px]">
                <span>CANONICAL INGRESS</span>
                <span className="text-indigo-400 text-right">https://harendralamsal.name.np</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              <span>© {new Date().getFullYear()} Harendra Lamsal. All Rights Reserved.</span>
            </div>
          </div>

        </div>
      </footer>

      <AiAssistantChat lang={lang} />

    </div>
  );
}
