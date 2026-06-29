/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
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

export default function App() {
  const [lang, setLang] = useState<'en' | 'ne'>('en');
  const [view, setView] = useState<'home' | 'blog' | 'news' | 'contact' | 'admin'>('home');

  // Dynamic state for posts and news so the CMS functions instantly in memory
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showHint, setShowHint] = useState(false);
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
  }, []);

  // Sync to state & cache
  const addBlogPost = (newPost: BlogPost) => {
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    localStorage.setItem('harendra_blogs', JSON.stringify(updated));
  };

  const deleteBlogPost = (id: string) => {
    const updated = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(updated);
    localStorage.setItem('harendra_blogs', JSON.stringify(updated));
  };

  const addNewsItem = (newItem: NewsItem) => {
    const updated = [newItem, ...newsItems];
    setNewsItems(updated);
    localStorage.setItem('harendra_news', JSON.stringify(updated));
  };

  const deleteNewsItem = (id: string) => {
    const updated = newsItems.filter((n) => n.id !== id);
    setNewsItems(updated);
    localStorage.setItem('harendra_news', JSON.stringify(updated));
  };

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
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. SITE WIDE NAVIGATION HEADER */}
      <Navigation 
        lang={lang} 
        setLang={setLang} 
        currentView={view} 
        setView={setView} 
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
                <Hero lang={lang} setView={setView} />
                <PortfolioView lang={lang} setView={setView} />
                <Newsletter lang={lang} />
              </>
            )}

            {/* TECH BLOG VIEW */}
            {view === 'blog' && (
              <>
                <BlogView posts={blogPosts} lang={lang} setView={setView} />
                <Newsletter lang={lang} />
              </>
            )}

            {/* TECH NEWS PORTAL VIEW */}
            {view === 'news' && (
              <>
                <NewsView news={newsItems} lang={lang} setView={setView} />
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
                        <span className="text-xs font-mono text-emerald-400">ADMIN SESSION ACTIVE</span>
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

                        {/* Toggleable credentials hint to prevent exposing it directly */}
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowHint(!showHint)}
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline focus:outline-none transition-all cursor-pointer block"
                          >
                            {showHint ? 'Hide Sandbox Demo Credentials' : 'Show Sandbox Demo Credentials'}
                          </button>
                          
                          {showHint && (
                            <div className="p-3.5 rounded bg-slate-950 border border-slate-850 text-xs text-slate-400 leading-relaxed font-mono space-y-1">
                              <span className="font-bold text-slate-200">DEMO CREDENTIALS:</span>
                              <div className="block mt-1">
                                <span className="text-slate-500">Email:</span> harendralamsal4140@gmail.com
                              </div>
                              <div>
                                <span className="text-slate-500">Password:</span> <span className="text-emerald-400 font-bold">{adminPassword}</span>
                              </div>
                              {adminPassword !== 'harendra123' && (
                                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 mt-1">
                                  Note: You have updated the default password. The new value is saved securely in your browser's LocalStorage.
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          id="admin-login-submit"
                          className="w-full inline-flex items-center justify-center space-x-1.5 rounded bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow shadow-indigo-600/20"
                        >
                          <LogIn size={12} />
                          <span>Verify & Unlock</span>
                        </button>
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

    </div>
  );
}
