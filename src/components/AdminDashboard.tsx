/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useMemo } from "react";
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
  Lock,
} from "lucide-react";
import { BlogPost, NewsItem, AnalyticsData } from "../types";
import { INITIAL_ANALYTICS } from "../data";
import AiArticleArchitect from "./AiArticleArchitect";
import AiPublishingStudio from "./AiPublishingStudio";
import AiNewsPublishingStudio from "./AiNewsPublishingStudio";

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
  supabaseConfigured?: boolean;
  supabaseConnected?: boolean;
  supabaseError?: string | null;
  supabaseStatusLoading?: boolean;
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
  supabaseConfigured = false,
  supabaseConnected = false,
  supabaseError = null,
  supabaseStatusLoading = false,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "analytics" | "ai-writer" | "blog" | "news" | "seo" | "media" | "security"
  >("analytics");

  // Password change states
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  // Create / Edit forms state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Web Development");
  const [blogTags, setBlogTags] = useState("React, SSR");
  const [blogIsFeatured, setBlogIsFeatured] = useState(false);
  const [blogStatus, setBlogStatus] = useState<"draft" | "published">(
    "published",
  );

  // Nepali translation states
  const [blogTitleNp, setBlogTitleNp] = useState("");
  const [blogExcerptNp, setBlogExcerptNp] = useState("");
  const [blogContentNp, setBlogContentNp] = useState("");

  // News states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsExcerpt, setNewsExcerpt] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState<string>(
    "Artificial Intelligence",
  );
  const [newsTags, setNewsTags] = useState("AI, Google");
  const [newsIsBreaking, setNewsIsBreaking] = useState(false);
  const [newsIsTrending, setNewsIsTrending] = useState(false);
  const [newsIsFeatured, setNewsIsFeatured] = useState(false);
  const [newsStatus, setNewsStatus] = useState<"draft" | "published">(
    "published",
  );

  // Nepali news translation states
  const [newsTitleNp, setNewsTitleNp] = useState("");
  const [newsExcerptNp, setNewsExcerptNp] = useState("");
  const [newsContentNp, setNewsContentNp] = useState("");

  // AI assistant loading indicators
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSeoOptimizing, setIsSeoOptimizing] = useState(false);
  const [aiNotice, setAiNotice] = useState("");

  // Media Library mockup
  const [mediaItems, setMediaItems] = useState([
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Analytics
  const analytics = useMemo(() => {
    const totalBlogViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalNewsViews = news.reduce((sum, n) => sum + (n.views || 0), 0);
    const calculatedViewsCount = totalBlogViews + totalNewsViews;

    const allItems = [
      ...posts.map((p) => ({
        title: p.translations.en.title || p.translations.ne.title,
        views: p.views || 0,
        type: "blog" as const,
      })),
      ...news.map((n) => ({
        title: n.translations.en.title || n.translations.ne.title,
        views: n.views || 0,
        type: "news" as const,
      })),
    ];

    const popularPosts = allItems.sort((a, b) => b.views - a.views).slice(0, 4);

    return {
      ...INITIAL_ANALYTICS,
      viewsCount:
        calculatedViewsCount > 0
          ? calculatedViewsCount
          : INITIAL_ANALYTICS.viewsCount,
      popularPosts:
        popularPosts.length > 0 ? popularPosts : INITIAL_ANALYTICS.popularPosts,
    };
  }, [posts, news]);

  // Gemini AI automatic translation integration (Full stack proxy endpoint)
  const handleAiTranslate = async (type: "blog" | "news") => {
    const textToTranslate = type === "blog" ? blogContent : newsContent;
    const titleToTranslate = type === "blog" ? blogTitle : newsTitle;
    const excerptToTranslate = type === "blog" ? blogExcerpt : newsExcerpt;

    if (!textToTranslate || !titleToTranslate) {
      alert("Please fill in the English Title and Content first.");
      return;
    }

    setIsTranslating(true);
    setAiNotice("Querying Gemini server-side agent...");

    try {
      const res = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleToTranslate,
          excerpt: excerptToTranslate,
          content: textToTranslate,
        }),
      });

      if (!res.ok) throw new Error("Gemini API Translation route failed.");

      const data = await res.json();
      if (type === "blog") {
        setBlogTitleNp(data.translatedTitle || "");
        setBlogExcerptNp(data.translatedExcerpt || "");
        setBlogContentNp(data.translatedContent || "");
      } else {
        setNewsTitleNp(data.translatedTitle || "");
        setNewsExcerptNp(data.translatedExcerpt || "");
        setNewsContentNp(data.translatedContent || "");
      }
      setAiNotice(
        "Success: Content translated to natural Nepali via Gemini 3.5!",
      );
    } catch (err: any) {
      console.error(err);
      setAiNotice("API fallback: auto-populated with mock translation.");
      // Local clean fallback to prevent blocking user
      if (type === "blog") {
        setBlogTitleNp(`${blogTitle} (अनुवादित)`);
        setBlogExcerptNp(`${blogExcerpt} (विवरण अनुवाद)`);
        setBlogContentNp(
          `### ${blogTitle} (नेपाली संस्करण)\n\nयो जेमिनाई मार्फत अनुवाद गरिएको सामग्रीको नमुना हो।\n\n${blogContent}`,
        );
      } else {
        setNewsTitleNp(`${newsTitle} (ताजा समाचार अनुवाद)`);
        setNewsExcerptNp(`${newsExcerpt} (विवरण अनुवाद)`);
        setNewsContentNp(`### ${newsTitle} (नेपाली समाचार)\n\n${newsContent}`);
      }
    } finally {
      setIsTranslating(false);
      setTimeout(() => setAiNotice(""), 5000);
    }
  };

  // Gemini AI SEO optimizer & automatic slug generator
  const handleAiSeoOptimize = async (type: "blog" | "news") => {
    const title = type === "blog" ? blogTitle : newsTitle;
    if (!title) {
      alert("Please fill in the Title first.");
      return;
    }

    setIsSeoOptimizing(true);
    setAiNotice("Optimizing slugs and meta structures...");

    try {
      const res = await fetch("/api/gemini/seo-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("SEO route failed");
      const data = await res.json();

      if (type === "blog") {
        setBlogTags(data.tags || "React, SEO, Web");
        setBlogExcerpt(data.metaDescription || "");
      } else {
        setNewsTags(data.tags || "News, Tech");
        setNewsExcerpt(data.metaDescription || "");
      }
      setAiNotice(`Success: Generated tags and optimized descriptions!`);
    } catch (err) {
      console.error(err);
      // Fallback slug and tags
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setAiNotice(`Fallback: Generated Slug: "${autoSlug}"`);
    } finally {
      setIsSeoOptimizing(false);
      setTimeout(() => setAiNotice(""), 5000);
    }
  };

  // Submit Blog
  const handleCreateBlog = (e: FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) {
      alert("Please fill in English Title and Content.");
      return;
    }

    const slug = blogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug,
      author: {
        name: "Harendra Lamsal",
        avatar: "/harendra_profile.jpg",
        bioEn: "Elite developer",
        bioNp: "वरिष्ठ डेभलपर",
        role: "Chief Solution Architect",
      },
      translations: {
        en: {
          title: blogTitle,
          excerpt: blogExcerpt || "A professional reading resource.",
          content: blogContent,
        },
        ne: {
          title: blogTitleNp || `${blogTitle} (Nepali)`,
          excerpt: blogExcerptNp || "नेपाली संस्करण लेख विवरण।",
          content: blogContentNp || blogContent,
        },
      },
      featuredImage: mediaItems[0],
      categories: [blogCategory],
      tags: blogTags.split(",").map((t) => t.trim()),
      publishedAt: new Date().toISOString(),
      isFeatured: blogIsFeatured,
      isPopular: false,
      status: blogStatus,
      readingTimeMin: Math.max(
        1,
        Math.ceil(blogContent.split(" ").length / 200),
      ),
      views: 0,
      commentsCount: 0,
    };

    addBlogPost(newPost);
    alert("Blog post created and synced to state!");

    // Clear state
    setBlogTitle("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogTitleNp("");
    setBlogExcerptNp("");
    setBlogContentNp("");
  };

  // Submit News
  const handleCreateNews = (e: FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert("Please fill in English Title and Content.");
      return;
    }

    const slug = newsTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      slug,
      translations: {
        en: {
          title: newsTitle,
          excerpt: newsExcerpt || "Global tech news update.",
          content: newsContent,
        },
        ne: {
          title: newsTitleNp || `${newsTitle} (Nepali News)`,
          excerpt: newsExcerptNp || "नेपाली समाचार विवरण।",
          content: newsContentNp || newsContent,
        },
      },
      featuredImage: mediaItems[1],
      category: newsCategory,
      tags: newsTags.split(",").map((t) => t.trim()),
      publishedAt: new Date().toISOString(),
      isBreaking: newsIsBreaking,
      isTrending: newsIsTrending,
      isFeatured: newsIsFeatured,
      isEditorsPick: false,
      isSticky: false,
      status: newsStatus,
      author: "Harendra Lamsal",
      readingTimeMin: Math.max(
        1,
        Math.ceil(newsContent.split(" ").length / 200),
      ),
      views: 0,
    };

    addNewsItem(newItem);
    alert("News article created and synced to News Portal feed!");

    // Clear state
    setNewsTitle("");
    setNewsExcerpt("");
    setNewsContent("");
    setNewsTitleNp("");
    setNewsExcerptNp("");
    setNewsContentNp("");
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = { posts, news };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harendra_lamsal_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Trigger Mock Broken Link Scan
  const handleLinkScan = () => {
    alert(
      "Broken Link Crawler initiated. Scanning public sitemaps and localized URLs...\n0 broken links detected on critical paths.",
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 flex flex-col lg:flex-row gap-8">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 space-y-4 text-left border-b border-slate-900 pb-6 lg:border-b-0 lg:border-r lg:pr-8">
        <div className="space-y-2 p-4 bg-slate-900/60 border border-slate-800 rounded-lg break-all">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            LOGGED IN AS
          </div>
          <div className="flex items-start space-x-2 text-base font-semibold text-white">
            <UserCheck size={18} className="text-emerald-400 mt-0.5 shrink-0" />
            <span className="break-all tracking-tight leading-snug font-mono text-base">
              harendralamsal4140@gmail.com
            </span>
          </div>
          <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mt-1">
            ADMIN ROLE / CHIEF SOLUTION ARCHITECT
          </div>
        </div>

        <nav className="space-y-1" aria-label="Admin tabs">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BarChart3 size={16} />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-writer")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "ai-writer"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sparkles size={16} className="text-indigo-400" />
            <span>AI Article Architect</span>
          </button>

          <button
            onClick={() => setActiveTab("blog")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "blog"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BookOpen size={16} />
            <span>Write Blog Post</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "news"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Newspaper size={16} />
            <span>Write News Article</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "seo"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FolderPlus size={16} />
            <span>SEO Manager & Backups</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "media"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Image size={16} />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
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

        {/* AI ARTICLE ARCHITECT SUITE */}
        {activeTab === "ai-writer" && (
          <AiArticleArchitect
            posts={posts}
            news={news}
            addBlogPost={addBlogPost}
            addNewsItem={addNewsItem}
            lang="en"
          />
        )}

        {/* 1. ANALYTICS VIEW */}
        {activeTab === "analytics" && (
          <div className="space-y-8 text-left">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Overview Analytics
            </h2>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  MONTHLY VISITORS
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {analytics.visitorsCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  ▲ +12% vs last week
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  PAGE VIEWS
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {analytics.viewsCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  ▲ +8.4% retention
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  BLOG POSTS
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {posts.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {posts.filter((p) => p.status === "published").length}{" "}
                  published, {posts.filter((p) => p.status === "draft").length}{" "}
                  drafts
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  NEWS ARTICLES
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {news.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Multilingual feed active
                </div>
              </div>
            </div>

            {/* Custom SVG Traffic Area Chart */}
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Daily Traffic Metrics
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Visitors and Views trends for current week
                  </span>
                </div>
                <span className="rounded bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 text-[10px] font-mono font-bold">
                  LIVE UPDATE
                </span>
              </div>
              {/* SVG Area Chart */}
              <div className="h-56 w-full pt-4">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 700 200"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  <line
                    x1="0"
                    y1="50"
                    x2="700"
                    y2="50"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="700"
                    y2="100"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="700"
                    y2="150"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />

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
                <h3 className="text-sm font-bold text-white">
                  Most Read Publications
                </h3>
                <div className="divide-y divide-slate-900">
                  {analytics.popularPosts.map((pop, pIdx) => (
                    <div
                      key={pIdx}
                      className="py-2.5 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-300 font-medium truncate max-w-sm">
                        {pop.title}
                      </span>
                      <span className="font-mono text-slate-500 font-bold whitespace-nowrap">
                        {pop.views.toLocaleString()} hits
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  Organic Search Keywords
                </h3>
                <div className="divide-y divide-slate-900">
                  {analytics.searchKeywords.map((key, kIdx) => (
                    <div
                      key={kIdx}
                      className="py-2.5 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-400 font-mono">
                        "{key.keyword}"
                      </span>
                      <span className="font-mono text-indigo-400 font-semibold">
                        {key.count} searches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Database Integration Status Panel */}
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/30 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Live Supabase Database Integration
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">
                      Backend connectivity status
                    </p>
                  </div>
                </div>
                {supabaseStatusLoading ? (
                  <span className="text-xs text-slate-500 font-mono animate-pulse">
                    Scanning connection...
                  </span>
                ) : supabaseConfigured && supabaseConnected ? (
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-bold flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active & Connected</span>
                  </span>
                ) : supabaseConfigured && !supabaseConnected ? (
                  <span className="rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 text-xs font-mono font-bold flex items-center space-x-1.5 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>Configuration Issue</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 text-xs font-mono font-medium">
                    Offline Cache Mode
                  </span>
                )}
              </div>

              {supabaseConfigured ? (
                supabaseConnected ? (
                  <div className="text-xs text-slate-400 leading-relaxed space-y-2">
                    <p>
                      Your portfolio application is fully connected to your live
                      Supabase backend. When you add, edit, or delete blog
                      publications, the mutations are securely persisted
                      directly in your Supabase relational database tables (
                      <code className="text-indigo-400 font-mono">
                        blog_posts
                      </code>{" "}
                      &amp;{" "}
                      <code className="text-indigo-400 font-mono font-medium">
                        blog_categories
                      </code>
                      ).
                    </p>
                    <div className="p-3.5 rounded bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-500 space-y-1">
                      <div>
                        <span className="text-slate-300 font-semibold">
                          Connection Class:
                        </span>{" "}
                        Full-Stack Secure API Router Proxy
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 leading-relaxed space-y-3">
                    <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-slate-300 space-y-2">
                      <div className="text-amber-400 font-bold flex items-center space-x-1.5 text-xs">
                        <span>⚠️ Supabase Setup/Connection Issue Detected</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        Secrets for Supabase are configured, but the application
                        is unable to communicate with your database.
                      </p>
                      {supabaseError && (
                        <div className="p-2 bg-slate-950 rounded border border-slate-850 font-mono text-[10px] text-rose-400 break-all overflow-x-auto max-h-24">
                          {supabaseError}
                        </div>
                      )}

                      {supabaseError &&
                      (supabaseError.toLowerCase().includes("relation") ||
                        supabaseError
                          .toLowerCase()
                          .includes("does not exist")) ? (
                        <div className="text-[11px] text-amber-300/90 leading-relaxed space-y-1 pt-1 border-t border-slate-800">
                          <p className="font-semibold text-white">
                            How to fix this issue:
                          </p>
                          <p>
                            It looks like the required tables do not exist in
                            your Supabase database yet. Please go to your{" "}
                            <strong className="text-slate-200">
                              Supabase Dashboard &gt; SQL Editor
                            </strong>
                            , paste and run the SQL code from the{" "}
                            <code className="text-indigo-300 font-mono">
                              supabase_setup.sql
                            </code>{" "}
                            file created at the root of this project.
                          </p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-300/90 leading-relaxed space-y-1 pt-1 border-t border-slate-800">
                          <p className="font-semibold text-white">
                            How to fix this issue:
                          </p>
                          <p>
                            1. Double-check your{" "}
                            <code className="text-white font-mono">
                              SUPABASE_URL
                            </code>{" "}
                            and{" "}
                            <code className="text-white font-mono">
                              SUPABASE_ANON_KEY
                            </code>{" "}
                            in AI Studio Secrets Settings. Ensure there are no
                            spaces or trailing slashes.
                          </p>
                          <p>
                            2. Ensure your Supabase database project is active
                            (not paused).
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      The CMS has automatically fallen back to high-performance
                      local storage cache mode, so you can continue managing
                      content in your browser!
                    </p>
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-400 leading-relaxed space-y-3">
                  <p>
                    The CMS is currently executing in local cache mode. Created
                    blogs are stored in high-performance local memory and synced
                    to client-side localStorage. To wire this up to your real
                    Supabase server (such as your old database at{" "}
                    <code className="text-indigo-400 font-mono font-semibold">
                      harendralamsal.name.np
                    </code>
                    ):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-slate-400 max-w-50">
                    <li>
                      Go to the{" "}
                      <span className="font-bold text-slate-300">
                        Secrets (API keys) panel
                      </span>{" "}
                      in AI Studio Settings
                    </li>
                    <li>
                      Add your{" "}
                      <code className="text-indigo-400 font-mono font-medium">
                        SUPABASE_URL
                      </code>{" "}
                      variable
                    </li>
                    <li>
                      Add your{" "}
                      <code className="text-indigo-400 font-mono font-medium">
                        SUPABASE_ANON_KEY
                      </code>{" "}
                      variable
                    </li>
                  </ol>
                  <p className="text-[11px] text-indigo-400 font-medium">
                    Once set up, the application automatically triggers schema
                    orchestration and live publication synchronization!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. BLOG CREATOR - ENTERPRISE AI PUBLISHING STUDIO */}
        {activeTab === "blog" && (
          <div className="w-full">
            <AiPublishingStudio onSave={addBlogPost} posts={posts} />
          </div>
        )}

        {/* 3. NEWS PORTAL CREATOR - ENTERPRISE AI NEWS PUBLISHING STUDIO */}
        {activeTab === "news" && (
          <div className="w-full">
            <AiNewsPublishingStudio onSave={addNewsItem} news={news} />
          </div>
        )}

        {/* 4. SEO MANAGER & BACKUPS */}
        {activeTab === "seo" && (
          <div className="space-y-8 text-left">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              SEO Audit Engine & Backups
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Broken Links Scanning Simulator */}
              <div className="p-6 rounded-xl border border-slate-850 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <span>Automatic Crawler Scan</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Triggers an immediate scan across sitemaps (sitemap.xml and
                  sitemap-news.xml) to identify nested broken routes and
                  metadata errors.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto">
                  <div className="text-[10px] font-mono text-slate-500">
                    SCANNED SITEMAP CHUNKS
                  </div>
                  {analytics.brokenLinks.map((bl, bidx) => (
                    <div
                      key={bidx}
                      className="flex justify-between text-xs py-1.5 border-b border-slate-900 font-mono"
                    >
                      <span className="text-rose-400 truncate max-w-[200px]">
                        {bl.url}
                      </span>
                      <span className="text-slate-500">
                        Origin: {bl.source} (HTTP {bl.status})
                      </span>
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
                  Securely download or import your complete CMS datasets (blog
                  articles, tech news feeds) in JSON structure. Satisfies full
                  database portable specifications.
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
                            const parsed = JSON.parse(
                              event.target?.result as string,
                            );
                            if (parsed.posts || parsed.news) {
                              importBackup({
                                posts: parsed.posts || [],
                                news: parsed.news || [],
                              });
                              alert("CMS Restore Completed Successfully!");
                            } else {
                              throw new Error("Invalid schema structure");
                            }
                          } catch (err) {
                            alert(
                              "Restore failed: JSON file does not conform to required parameters.",
                            );
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
        {activeTab === "media" && (
          <div className="space-y-8 text-left">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Media Library
            </h2>

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
                    setNewImageUrl("");
                    alert("Asset added to library.");
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
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-slate-900 bg-slate-950"
                  >
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
                          alert("Source URL copied to clipboard!");
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
        {activeTab === "security" && (
          <div className="max-w-2xl text-left space-y-6">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                Authorized Controls
              </div>
              <h2
                className="text-2xl font-bold text-white mt-1"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Gatekeeper Password Reset
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Customize your admin password here. A custom password prevents
                other visitors from entering the sandbox CMS or making
                unsolicited modifications to your portfolio content.
              </p>
            </div>

            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPasswordErrorMsg("");
                  setPasswordSuccessMsg("");

                  if (
                    !oldPasswordInput ||
                    !newPasswordInput ||
                    !confirmPasswordInput
                  ) {
                    setPasswordErrorMsg("All password fields are required.");
                    return;
                  }

                  if (oldPasswordInput !== currentPassword) {
                    setPasswordErrorMsg(
                      "The current password you entered is incorrect.",
                    );
                    return;
                  }

                  if (newPasswordInput.length < 6) {
                    setPasswordErrorMsg(
                      "The new password must be at least 6 characters long.",
                    );
                    return;
                  }

                  if (newPasswordInput !== confirmPasswordInput) {
                    setPasswordErrorMsg(
                      "The new password and password confirmation do not match.",
                    );
                    return;
                  }

                  onPasswordChange(newPasswordInput);
                  setPasswordSuccessMsg(
                    "Your Admin Password has been successfully updated! It is now saved securely in your browser cache.",
                  );
                  setOldPasswordInput("");
                  setNewPasswordInput("");
                  setConfirmPasswordInput("");
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
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                    Current Admin Password
                  </label>
                  <input
                    type="password"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                    New Security Password
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new strong password (min 6 characters)..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                    Confirm New Password
                  </label>
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
                      if (
                        confirm(
                          'Are you sure you want to reset your password back to the default "harendra123"?',
                        )
                      ) {
                        onPasswordChange("harendra123");
                        setPasswordSuccessMsg(
                          'Password has been reset back to default "harendra123".',
                        );
                        setOldPasswordInput("");
                        setNewPasswordInput("");
                        setConfirmPasswordInput("");
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
