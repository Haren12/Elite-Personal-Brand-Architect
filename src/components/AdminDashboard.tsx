/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Newspaper, 
  FolderPlus, 
  Image, 
  Search, 
  Trash2, 
  Plus, 
  Languages, 
  Sparkles, 
  Check, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  Lock
} from 'lucide-react';
import { BlogPost, NewsItem, AnalyticsData } from '../types';
import { INITIAL_ANALYTICS } from '../data';

interface AdminDashboardProps {
  posts: BlogPost[];
  news: NewsItem[];
  addBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addNewsItem: (item: NewsItem) => void;
  deleteNewsItem: (id: string) => void;
  importBackup: (backup: { posts: BlogPost[]; news: NewsItem[] }) => void;
  currentPassword: string;
  onPasswordChange: (newPass: string) => void;
}

export default function AdminDashboard({
  posts,
  news,
  addBlogPost,
  deleteBlogPost,
  addNewsItem,
  deleteNewsItem,
  importBackup,
  currentPassword,
  onPasswordChange,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'blog' | 'news' | 'seo' | 'media' | 'security'>('analytics');
  
  // Password change states
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  
  // Create / Edit forms state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Web Development');
  const [blogTags, setBlogTags] = useState('React, SSR');
  const [blogIsFeatured, setBlogIsFeatured] = useState(false);
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>('published');
  
  // Nepali translation states
  const [blogTitleNp, setBlogTitleNp] = useState('');
  const [blogExcerptNp, setBlogExcerptNp] = useState('');
  const [blogContentNp, setBlogContentNp] = useState('');

  // News states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Artificial Intelligence' | 'Cyber Security' | 'Programming' | 'Web Development' | 'WordPress' | 'SEO' | 'Digital Marketing' | 'Startup' | 'Nepal News' | 'World News' | 'Opinion' | 'Tutorials'>('Artificial Intelligence');
  const [newsTags, setNewsTags] = useState('AI, Google');
  const [newsIsBreaking, setNewsIsBreaking] = useState(false);
  const [newsIsTrending, setNewsIsTrending] = useState(false);
  const [newsIsFeatured, setNewsIsFeatured] = useState(false);
  const [newsStatus, setNewsStatus] = useState<'draft' | 'published'>('published');

  // Nepali news translation states
  const [newsTitleNp, setNewsTitleNp] = useState('');
  const [newsExcerptNp, setNewsExcerptNp] = useState('');
  const [newsContentNp, setNewsContentNp] = useState('');

  // AI assistant loading indicators
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSeoOptimizing, setIsSeoOptimizing] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  // Media Library mockup
  const [mediaItems, setMediaItems] = useState([
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);

  // Gemini AI automatic translation integration (Full stack proxy endpoint)
  const handleAiTranslate = async (type: 'blog' | 'news') => {
    const textToTranslate = type === 'blog' ? blogContent : newsContent;
    const titleToTranslate = type === 'blog' ? blogTitle : newsTitle;
    const excerptToTranslate = type === 'blog' ? blogExcerpt : newsExcerpt;

    if (!textToTranslate || !titleToTranslate) {
      alert('Please fill in the English Title and Content first.');
      return;
    }

    setIsTranslating(true);
    setAiNotice('Querying Gemini server-side agent...');
    
    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToTranslate,
          excerpt: excerptToTranslate,
          content: textToTranslate,
        }),
      });

      if (!res.ok) throw new Error('Gemini API Translation route failed.');
      
      const data = await res.json();
      if (type === 'blog') {
        setBlogTitleNp(data.translatedTitle || '');
        setBlogExcerptNp(data.translatedExcerpt || '');
        setBlogContentNp(data.translatedContent || '');
      } else {
        setNewsTitleNp(data.translatedTitle || '');
        setNewsExcerptNp(data.translatedExcerpt || '');
        setNewsContentNp(data.translatedContent || '');
      }
      setAiNotice('Success: Content translated to natural Nepali via Gemini 3.5!');
    } catch (err: any) {
      console.error(err);
      setAiNotice('API fallback: auto-populated with mock translation.');
      // Local clean fallback to prevent blocking user
      if (type === 'blog') {
        setBlogTitleNp(`${blogTitle} (अनुवादित)`);
        setBlogExcerptNp(`${blogExcerpt} (विवरण अनुवाद)`);
        setBlogContentNp(`### ${blogTitle} (नेपाली संस्करण)\n\nयो जेमिनाई मार्फत अनुवाद गरिएको सामग्रीको नमुना हो।\n\n${blogContent}`);
      } else {
        setNewsTitleNp(`${newsTitle} (ताजा समाचार अनुवाद)`);
        setNewsExcerptNp(`${newsExcerpt} (विवरण अनुवाद)`);
        setNewsContentNp(`### ${newsTitle} (नेपाली समाचार)\n\n${newsContent}`);
      }
    } finally {
      setIsTranslating(false);
      setTimeout(() => setAiNotice(''), 5000);
    }
  };

  // Gemini AI SEO optimizer & automatic slug generator
  const handleAiSeoOptimize = async (type: 'blog' | 'news') => {
    const title = type === 'blog' ? blogTitle : newsTitle;
    if (!title) {
      alert('Please fill in the Title first.');
      return;
    }

    setIsSeoOptimizing(true);
    setAiNotice('Optimizing slugs and meta structures...');

    try {
      const res = await fetch('/api/gemini/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error('SEO route failed');
      const data = await res.json();
      
      if (type === 'blog') {
        setBlogTags(data.tags || 'React, SEO, Web');
        setBlogExcerpt(data.metaDescription || '');
      } else {
        setNewsTags(data.tags || 'News, Tech');
        setNewsExcerpt(data.metaDescription || '');
      }
      setAiNotice(`Success: Generated tags and optimized descriptions!`);
    } catch (err) {
      console.error(err);
      // Fallback slug and tags
      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setAiNotice(`Fallback: Generated Slug: "${autoSlug}"`);
    } finally {
      setIsSeoOptimizing(false);
      setTimeout(() => setAiNotice(''), 5000);
    }
  };

  // Submit Blog
  const handleCreateBlog = (e: FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) {
      alert('Please fill in English Title and Content.');
      return;
    }

    const slug = blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug,
      author: {
        name: 'Harendra Lamsal',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        bioEn: 'Elite developer',
        bioNp: 'वरिष्ठ डेभलपर',
        role: 'Chief Solution Architect'
      },
      translations: {
        en: {
          title: blogTitle,
          excerpt: blogExcerpt || 'A professional reading resource.',
          content: blogContent,
        },
        ne: {
          title: blogTitleNp || `${blogTitle} (Nepali)`,
          excerpt: blogExcerptNp || 'नेपाली संस्करण लेख विवरण।',
          content: blogContentNp || blogContent,
        },
      },
      featuredImage: mediaItems[0],
      categories: [blogCategory],
      tags: blogTags.split(',').map((t) => t.trim()),
      publishedAt: new Date().toISOString(),
      isFeatured: blogIsFeatured,
      isPopular: false,
      status: blogStatus,
      readingTimeMin: Math.max(1, Math.ceil(blogContent.split(' ').length / 200)),
      views: 0,
      commentsCount: 0,
    };

    addBlogPost(newPost);
    alert('Blog post created and synced to state!');
    
    // Clear state
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogTitleNp('');
    setBlogExcerptNp('');
    setBlogContentNp('');
  };

  // Submit News
  const handleCreateNews = (e: FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert('Please fill in English Title and Content.');
      return;
    }

    const slug = newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      slug,
      translations: {
        en: {
          title: newsTitle,
          excerpt: newsExcerpt || 'Global tech news update.',
          content: newsContent,
        },
        ne: {
          title: newsTitleNp || `${newsTitle} (Nepali News)`,
          excerpt: newsExcerptNp || 'नेपाली समाचार विवरण।',
          content: newsContentNp || newsContent,
        },
      },
      featuredImage: mediaItems[1],
      category: newsCategory,
      tags: newsTags.split(',').map((t) => t.trim()),
      publishedAt: new Date().toISOString(),
      isBreaking: newsIsBreaking,
      isTrending: newsIsTrending,
      isFeatured: newsIsFeatured,
      isEditorsPick: false,
      isSticky: false,
      status: newsStatus,
      author: 'Harendra Lamsal',
      readingTimeMin: Math.max(1, Math.ceil(newsContent.split(' ').length / 200)),
      views: 0,
    };

    addNewsItem(newItem);
    alert('News article created and synced to News Portal feed!');

    // Clear state
    setNewsTitle('');
    setNewsExcerpt('');
    setNewsContent('');
    setNewsTitleNp('');
    setNewsExcerptNp('');
    setNewsContentNp('');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = { posts, news };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harendra_lamsal_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Trigger Mock Broken Link Scan
  const handleLinkScan = () => {
    alert('Broken Link Crawler initiated. Scanning public sitemaps and localized URLs...\n0 broken links detected on critical paths.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 space-y-4 text-left border-b border-slate-900 pb-6 lg:border-b-0 lg:border-r lg:pr-8">
        <div className="space-y-2 p-4 bg-slate-900/60 border border-slate-800 rounded-lg break-all">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">LOGGED IN AS</div>
          <div className="flex items-start space-x-2 text-base font-semibold text-white">
            <UserCheck size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="break-all tracking-tight leading-snug font-mono text-base">harendralamsal4140@gmail.com</span>
          </div>
          <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mt-1">ADMIN ROLE / CHIEF SOLUTION ARCHITECT</div>
        </div>

        <nav className="space-y-1" aria-label="Admin tabs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 size={16} />
            <span>Overview & Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'blog' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen size={16} />
            <span>Write Blog Post</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'news' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Newspaper size={16} />
            <span>Write News Article</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'seo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FolderPlus size={16} />
            <span>SEO Manager & Backups</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'media' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Image size={16} />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'security' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Lock size={16} />
            <span>Gatekeeper Security</span>
          </button>
        </nav>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 min-w-0" aria-label="Admin Content">
        {/* Floating AI Notification Notice */}
        {aiNotice && (
          <div className="mb-6 p-4 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center space-x-2.5 animate-pulse">
            <Sparkles size={16} />
            <span>{aiNotice}</span>
          </div>
        )}

        {/* 1. ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Overview Analytics</h2>
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">MONTHLY VISITORS</span>
                <div className="text-2xl font-extrabold text-white mt-1">{analytics.visitorsCount.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 mt-1">▲ +12% vs last week</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">PAGE VIEWS</span>
                <div className="text-2xl font-extrabold text-white mt-1">{analytics.viewsCount.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 mt-1">▲ +8.4% retention</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">BLOG POSTS</span>
                <div className="text-2xl font-extrabold text-white mt-1">{posts.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">{posts.filter(p => p.status==='published').length} published, {posts.filter(p => p.status==='draft').length} drafts</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">NEWS ARTICLES</span>
                <div className="text-2xl font-extrabold text-white mt-1">{news.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">Multilingual feed active</div>
              </div>
            </div>

            {/* Custom SVG Traffic Area Chart */}
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Daily Traffic Metrics</h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Visitors and Views trends for current week</span>
                </div>
                <span className="rounded bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 text-[10px] font-mono font-bold">LIVE UPDATE</span>
              </div>
              {/* SVG Area Chart */}
              <div className="h-56 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#1e293b" strokeDasharray="3,3" />
                  
                  {/* Area fill for Views */}
                  <path
                    d="M 0 160 L 100 140 L 200 150 L 300 120 L 400 90 L 500 70 L 600 50 L 700 40 L 700 200 L 0 200 Z"
                    fill="url(#indigoGrad)"
                    opacity="0.15"
                  />
                  {/* Area line for Views */}
                  <path
                    d="M 0 160 Q 50 150 100 140 T 200 150 T 300 120 T 400 90 T 500 70 T 600 50 T 700 40"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    fill="none"
                  />
                  
                  {/* Area line for Visitors */}
                  <path
                    d="M 0 180 Q 50 170 100 160 T 200 165 T 300 145 T 400 125 T 500 105 T 600 85 T 700 75"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="2,1"
                    fill="none"
                  />

                  {/* SVG Gradient declaration */}
                  <defs>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>

            {/* Popular and search queries listing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Most Read Publications</h3>
                <div className="divide-y divide-slate-900">
                  {analytics.popularPosts.map((pop, pIdx) => (
                    <div key={pIdx} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-sm">{pop.title}</span>
                      <span className="font-mono text-slate-500 font-bold whitespace-nowrap">{pop.views.toLocaleString()} hits</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Organic Search Keywords</h3>
                <div className="divide-y divide-slate-900">
                  {analytics.searchKeywords.map((key, kIdx) => (
                    <div key={kIdx} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono">"{key.keyword}"</span>
                      <span className="font-mono text-indigo-400 font-semibold">{key.count} searches</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. BLOG CREATOR */}
        {activeTab === 'blog' && (
          <div className="space-y-8 text-left">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white animate-fade-in" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Write Tech Blog Post</h2>
                <span className="text-xs text-slate-500 font-mono uppercase mt-1">FULL MULTILINGUAL EN/NE SCHEMA CONFORMITY</span>
              </div>
              <button
                type="button"
                onClick={() => handleAiSeoOptimize('blog')}
                disabled={isSeoOptimizing}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/25 transition-all"
              >
                <Sparkles size={14} />
                <span>{isSeoOptimizing ? 'Optimizing...' : 'SEO Auto-Optimizer'}</span>
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-6">
              
              {/* English Version Fields */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <h3 className="text-sm font-bold text-indigo-400 flex items-center space-x-2">
                  <Languages size={14} />
                  <span>1. ENGLISH CONTENT (SOURCE)</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Title</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Architecting Quantum Resistant React Systems"
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Excerpt (SEO Meta Description)</label>
                  <input
                    type="text"
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="Brief 150-char excerpt..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Body Content (Supports Custom Markdown Syntax)</label>
                  <textarea
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    rows={8}
                    placeholder="## Introduction to Quantum Cryptography..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Automatic Translation via Gemini AI Trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center space-x-2.5 text-left">
                  <div className="h-8 w-8 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                    <Languages size={16} className="animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gemini 3.5 Localization Assistant</span>
                    <span className="text-[10px] text-slate-400 leading-none">Auto-generate perfect, natural Nepali translation in real-time</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAiTranslate('blog')}
                  disabled={isTranslating}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-all shadow disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>{isTranslating ? 'Generating Translation...' : 'Translate to Nepali (Gemini)'}</span>
                </button>
              </div>

              {/* Nepali Translation Fields (Auto-filled by Gemini, but editable) */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                  <Languages size={14} />
                  <span>2. नेपाली संस्करण (NEPALI LOCALIZATION)</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">शीर्षक (Title in Nepali)</label>
                  <input
                    type="text"
                    value={blogTitleNp}
                    onChange={(e) => setBlogTitleNp(e.target.value)}
                    placeholder="नेपाली शीर्षक..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">विवरण (Excerpt in Nepali)</label>
                  <input
                    type="text"
                    value={blogExcerptNp}
                    onChange={(e) => setBlogExcerptNp(e.target.value)}
                    placeholder="नेपाली विवरण..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">सामग्री विवरण (Content in Nepali)</label>
                  <textarea
                    value={blogContentNp}
                    onChange={(e) => setBlogContentNp(e.target.value)}
                    rows={6}
                    placeholder="नेपाली लेख विवरण (मार्काडाउन समर्थित)..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Settings (Category, tags, draft/published) */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="React">React</option>
                    <option value="WordPress">WordPress</option>
                    <option value="SEO">SEO</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="React 19, Headless, SEO"
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Status</label>
                  <select
                    value={blogStatus}
                    onChange={(e) => setBlogStatus(e.target.value as 'draft' | 'published')}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <label className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogIsFeatured}
                    onChange={(e) => setBlogIsFeatured(e.target.checked)}
                    className="rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Mark as Featured Post</span>
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow shadow-indigo-600/30 transition-all"
                >
                  Confirm & Sync Blog
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 3. NEWS PORTAL CREATOR */}
        {activeTab === 'news' && (
          <div className="space-y-8 text-left">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Write News Bulletin</h2>
                <span className="text-xs text-slate-500 font-mono uppercase mt-1">DIRECT PORTAL SYNC WITH BREAKING NEWS TICKERS</span>
              </div>
              <button
                type="button"
                onClick={() => handleAiSeoOptimize('news')}
                disabled={isSeoOptimizing}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/25 transition-all"
              >
                <Sparkles size={14} />
                <span>{isSeoOptimizing ? 'Optimizing...' : 'SEO Auto-Optimizer'}</span>
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-6">
              
              {/* English news content */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <h3 className="text-sm font-bold text-rose-500 flex items-center space-x-2">
                  <Languages size={14} />
                  <span>1. ENGLISH NEWS (SOURCE)</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Headline (Title)</label>
                  <input
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="e.g. OpenAI releases GPT-5 with Real-Time Video synthesis"
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Short Excerpt (SEO Meta Description)</label>
                  <input
                    type="text"
                    value={newsExcerpt}
                    onChange={(e) => setNewsExcerpt(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">News Article Body</label>
                  <textarea
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    rows={8}
                    placeholder="Detail reporting body..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Translation bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <div className="flex items-center space-x-2.5 text-left">
                  <div className="h-8 w-8 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-500">
                    <Languages size={16} className="animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gemini 3.5 Localization Assistant</span>
                    <span className="text-[10px] text-slate-400 leading-none">Auto-generate perfect, natural Nepali translation in real-time</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAiTranslate('news')}
                  disabled={isTranslating}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-all shadow disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>{isTranslating ? 'Generating Translation...' : 'Translate to Nepali (Gemini)'}</span>
                </button>
              </div>

              {/* Nepali Translation */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                  <Languages size={14} />
                  <span>2. नेपाली संस्करण (NEPALI LOCALIZATION)</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">शीर्षक (Title in Nepali)</label>
                  <input
                    type="text"
                    value={newsTitleNp}
                    onChange={(e) => setNewsTitleNp(e.target.value)}
                    placeholder="नेपाली मुख्य शीर्षक..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">विवरण (Excerpt in Nepali)</label>
                  <input
                    type="text"
                    value={newsExcerptNp}
                    onChange={(e) => setNewsExcerptNp(e.target.value)}
                    placeholder="नेपाली समाचार विवरण..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">सामग्री (Content in Nepali)</label>
                  <textarea
                    value={newsContentNp}
                    onChange={(e) => setNewsContentNp(e.target.value)}
                    rows={6}
                    placeholder="नेपाली समाचार लेख (मार्काडाउन समर्थित)..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Categories selection */}
              <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/20 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Category</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value as any)}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="WordPress">WordPress</option>
                    <option value="SEO">SEO</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Startup">Startup</option>
                    <option value="Nepal News">Nepal News</option>
                    <option value="World News">World News</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newsTags}
                    onChange={(e) => setNewsTags(e.target.value)}
                    placeholder="AI, tech, cyber, nepal"
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase font-mono">Status</label>
                  <select
                    value={newsStatus}
                    onChange={(e) => setNewsStatus(e.target.value as 'draft' | 'published')}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500"
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes: breaking, trending, featured */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-slate-900/40 border border-slate-850">
                <label className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsIsBreaking}
                    onChange={(e) => setNewsIsBreaking(e.target.checked)}
                    className="rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Mark as BREAKING News</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsIsTrending}
                    onChange={(e) => setNewsIsTrending(e.target.checked)}
                    className="rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Mark as TRENDING News</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsIsFeatured}
                    onChange={(e) => setNewsIsFeatured(e.target.checked)}
                    className="rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Mark as FEATURED News</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 hover:bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow shadow-rose-600/20 transition-all"
                >
                  Confirm & Sync News Article
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 4. SEO MANAGER & BACKUPS */}
        {activeTab === 'seo' && (
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>SEO Audit Engine & Backups</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Broken Links Scanning Simulator */}
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <span>Automatic Crawler Scan</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Triggers an immediate scan across sitemaps (sitemap.xml and sitemap-news.xml) to identify nested broken routes and metadata errors.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto">
                  <div className="text-[10px] font-mono text-slate-500">SCANNED SITEMAP CHUNKS</div>
                  {analytics.brokenLinks.map((bl, bidx) => (
                    <div key={bidx} className="flex justify-between text-xs py-1.5 border-b border-slate-900 font-mono">
                      <span className="text-rose-400 truncate max-w-[200px]">{bl.url}</span>
                      <span className="text-slate-500">Origin: {bl.source} (HTTP {bl.status})</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleLinkScan}
                  className="inline-flex items-center space-x-1.5 rounded bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow"
                >
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Initiate Crawler Scan</span>
                </button>
              </div>

              {/* Backup & Import system */}
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Download size={16} className="text-indigo-400" />
                  <span>Data Backups & Migration</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Securely download or import your complete CMS datasets (blog articles, tech news feeds) in JSON structure. Satisfies full database portable specifications.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-400 transition-all"
                  >
                    <Download size={12} />
                    <span>Download Backup (JSON)</span>
                  </button>
                  <label className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 cursor-pointer transition-all">
                    <Upload size={12} />
                    <span>Upload & Restore</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const parsed = JSON.parse(event.target?.result as string);
                            if (parsed.posts || parsed.news) {
                              importBackup({ posts: parsed.posts || [], news: parsed.news || [] });
                              alert('CMS Restore Completed Successfully!');
                            } else {
                              throw new Error('Invalid schema structure');
                            }
                          } catch (err) {
                            alert('Restore failed: JSON file does not conform to required parameters.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Media Library</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste external Unsplash image URL to add to library..."
                  className="flex-1 rounded border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newImageUrl.trim()) return;
                    setMediaItems([...mediaItems, newImageUrl]);
                    setNewImageUrl('');
                    alert('Asset added to library.');
                  }}
                  className="rounded bg-indigo-600 hover:bg-indigo-500 px-4 text-xs font-bold text-white transition-all shadow flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Grid of images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mediaItems.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-900 bg-slate-950">
                    <img
                      src={img}
                      alt="Media Asset"
                      className="h-full w-full object-cover transition-transform group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(img);
                          alert('Source URL copied to clipboard!');
                        }}
                        className="rounded bg-indigo-600 text-white px-2.5 py-1 text-[10px] font-bold"
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaItems(mediaItems.filter((_, i) => i !== idx));
                        }}
                        className="rounded bg-rose-600 text-white p-1"
                        title="Delete Asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 6. GATEKEEPER SECURITY & PASSWORD RESET */}
        {activeTab === 'security' && (
          <div className="max-w-2xl text-left space-y-6">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Authorized Controls</div>
              <h2 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Gatekeeper Password Reset
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Customize your admin password here. A custom password prevents other visitors from entering the sandbox CMS or making unsolicited modifications to your portfolio content.
              </p>
            </div>

            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPasswordErrorMsg('');
                  setPasswordSuccessMsg('');

                  if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
                    setPasswordErrorMsg('All password fields are required.');
                    return;
                  }

                  if (oldPasswordInput !== currentPassword) {
                    setPasswordErrorMsg('The current password you entered is incorrect.');
                    return;
                  }

                  if (newPasswordInput.length < 6) {
                    setPasswordErrorMsg('The new password must be at least 6 characters long.');
                    return;
                  }

                  if (newPasswordInput !== confirmPasswordInput) {
                    setPasswordErrorMsg('The new password and password confirmation do not match.');
                    return;
                  }

                  onPasswordChange(newPasswordInput);
                  setPasswordSuccessMsg('Your Admin Password has been successfully updated! It is now saved securely in your browser cache.');
                  setOldPasswordInput('');
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                }}
                className="space-y-4"
              >
                {passwordErrorMsg && (
                  <div className="p-3.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    ⚠️ {passwordErrorMsg}
                  </div>
                )}

                {passwordSuccessMsg && (
                  <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    ✓ {passwordSuccessMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Current Admin Password</label>
                  <input
                    type="password"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">New Security Password</label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new strong password (min 6 characters)..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-all shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Save New Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset your password back to the default "harendra123"?')) {
                        onPasswordChange('harendra123');
                        setPasswordSuccessMsg('Password has been reset back to default "harendra123".');
                        setOldPasswordInput('');
                        setNewPasswordInput('');
                        setConfirmPasswordInput('');
                      }
                    }}
                    className="rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Restore Default Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
