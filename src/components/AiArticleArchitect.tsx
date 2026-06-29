/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Languages,
  BookOpen,
  Newspaper,
  Code,
  Copy,
  Check,
  FileText,
  Globe,
  Share2,
  ExternalLink,
  RotateCw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  Terminal,
  Settings,
  SendHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, NewsItem } from '../types';

interface AiArticleArchitectProps {
  posts: BlogPost[];
  news: NewsItem[];
  addBlogPost: (post: BlogPost) => void;
  addNewsItem: (item: NewsItem) => void;
  lang: 'en' | 'ne';
}

const TOPIC_SUGGESTIONS = [
  {
    title: 'Google Gemini 3.5 & Multimodal Web Agents',
    category: 'Artificial Intelligence',
    description: 'Deep dive into architecting agentic AI systems that interact directly with React and TypeScript SPAs.',
    mode: 'news'
  },
  {
    title: 'Mastering Next.js 15 Server Components and PPR',
    category: 'Web Development',
    description: 'An advanced tutorial explaining Partial Prerendering, server actions, and runtime performance optimization.',
    mode: 'tutorial'
  },
  {
    title: 'PostgreSQL vs MongoDB: Choosing Databases in 2026',
    category: 'Programming',
    description: 'Comparison of relational schemas and document stores focusing on type safety, ACID guarantees, and scale.',
    mode: 'comparison'
  },
  {
    title: 'State of WordPress and headless headless architectures',
    category: 'WordPress',
    description: 'A strategic architectural guide on linking WordPress rest APIs with Vite React SPAs.',
    mode: 'standard'
  },
  {
    title: 'AI Search Engine Optimization (GEO/SEO)',
    category: 'SEO',
    description: 'How to optimize your technical content for LLMs, Google Discover, and AI answer engines.',
    mode: 'standard'
  }
];

const STAGES = [
  { id: 1, label: 'Search Intent Discovery', desc: 'Analyzing keywords, competition, and Google Discover criteria...' },
  { id: 2, label: 'Technical Fact-Checking', desc: 'Verifying coding syntax, modern API support, and benchmarks...' },
  { id: 3, label: 'Article Drafting & Structural Design', desc: 'Drafting high-value Markdown sections with performance/security modules...' },
  { id: 4, label: 'Bilingual Professional Localization', desc: 'Localizing semantic structures to fluent, non-robotic Nepali...' },
  { id: 5, label: 'Metadata & JSON-LD Construction', desc: 'Generating structured schema, OG fields, and distribution packets...' }
];

export default function AiArticleArchitect({
  posts,
  news,
  addBlogPost,
  addNewsItem,
  lang
}: AiArticleArchitectProps) {
  // Input fields
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'news' | 'tutorial' | 'comparison' | 'standard'>('standard');
  const [targetLang, setTargetLang] = useState<'en' | 'ne' | 'bilingual'>('bilingual');
  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [targetAudience, setTargetAudience] = useState('Developers & Software Architects');
  const [tone, setTone] = useState('Professional & Direct');
  const [wordCount, setWordCount] = useState('Medium (~1500 words)');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [resultTab, setResultTab] = useState<'previewEn' | 'previewNp' | 'seo' | 'schema' | 'newsletter'>('previewEn');
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // The generated article structure
  const [articleResult, setArticleResult] = useState<any>(null);

  // Handle Copy feedback
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Cycle generation stages for beautiful loading visualization
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setGenerationStage(0);
      interval = setInterval(() => {
        setGenerationStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Execute Generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or select one of our curated suggestions.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setArticleResult(null);

    try {
      const response = await fetch('/api/gemini/write-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mode,
          lang: targetLang,
          additionalInstructions,
          model,
          difficulty,
          targetAudience,
          tone,
          wordCount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error occurred during generation.');
      }

      const data = await response.json();
      setArticleResult(data);
      // Auto toggle to appropriate preview tab based on language selection
      if (targetLang === 'ne') {
        setResultTab('previewNp');
      } else {
        setResultTab('previewEn');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to the Gemini server. Ensure your dev server is active.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Curated templates click
  const handleSuggestionClick = (s: typeof TOPIC_SUGGESTIONS[0]) => {
    setTopic(s.title);
    setMode(s.mode as any);
  };

  // Publish to real state
  const handlePublish = (targetType: 'blog' | 'news') => {
    if (!articleResult) return;

    const slug = articleResult.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const defaultImage = '/assets/placeholder-tech.jpg';

    if (targetType === 'blog') {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug,
        author: {
          name: 'Harendra Lamsal',
          avatar: '/harendra_profile.jpg',
          bioEn: 'Elite Full-Stack Architect & Digital Marketer.',
          bioNp: 'वरिष्ठ फुल-स्ट्याक आर्किटेक्ट र डिजिटल मार्केटर।',
          role: 'Chief Solution Architect'
        },
        translations: {
          en: {
            title: articleResult.title || topic,
            excerpt: articleResult.excerpt || articleResult.metaDescription || 'Elite technology research resource.',
            content: articleResult.contentEn || 'Draft english content.'
          },
          ne: {
            title: articleResult.titleNp || articleResult.title || `${topic} (नेपाली संस्करण)`,
            excerpt: articleResult.excerptNp || articleResult.excerpt || 'नेपाली संस्करण लेख विवरण।',
            content: articleResult.contentNp || articleResult.contentEn || 'मस्यौदा सामग्री नेपालीमा।'
          }
        },
        featuredImage: defaultImage,
        categories: [articleResult.category || 'Artificial Intelligence'],
        tags: articleResult.tags || ['tech', 'programming'],
        publishedAt: new Date().toISOString(),
        isFeatured: true,
        isPopular: false,
        status: 'published',
        readingTimeMin: Math.max(2, Math.ceil((articleResult.contentEn || '').split(' ').length / 220)),
        views: 0,
        commentsCount: 0
      };

      addBlogPost(newPost);
      alert(`🎉 Successfully published enterprise blog post: "${newPost.translations.en.title}" directly to your website!`);
    } else {
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        slug,
        translations: {
          en: {
            title: articleResult.title || topic,
            excerpt: articleResult.excerpt || articleResult.metaDescription || 'Tech bulletin announcement.',
            content: articleResult.contentEn || 'Draft english news.'
          },
          ne: {
            title: articleResult.titleNp || articleResult.title || `${topic} (नेपाली समाचार)`,
            excerpt: articleResult.excerptNp || articleResult.excerpt || 'नेपाली समाचार विवरण।',
            content: articleResult.contentNp || articleResult.contentEn || 'मस्यौदा समाचार नेपालीमा।'
          }
        },
        featuredImage: defaultImage,
        category: (articleResult.category || 'Artificial Intelligence') as any,
        tags: articleResult.tags || ['news', 'announcement'],
        publishedAt: new Date().toISOString(),
        isBreaking: true,
        isTrending: true,
        isFeatured: true,
        isEditorsPick: true,
        isSticky: false,
        status: 'published',
        author: 'Harendra Lamsal',
        readingTimeMin: Math.max(2, Math.ceil((articleResult.contentEn || '').split(' ').length / 220)),
        views: 0
      };

      addNewsItem(newItem);
      alert(`📰 Successfully published breaking news bulletin: "${newItem.translations.en.title}" directly to your Tech News Portal!`);
    }
  };

  return (
    <div className="space-y-8 text-left select-text" id="ai-article-architect">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-600/15 text-indigo-400 p-2 rounded-lg border border-indigo-500/10">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                AI Article Architect
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-widest">
                ENTERPRISE-GRADE EDITORIAL SUITE
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
            Connected to Gemini 3.5 & 3.1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROL & INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CURATED IDEAS / QUICK TEMPLATES */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Bookmark size={14} className="text-indigo-400" />
              <span>Select Curated Tech Blueprint</span>
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {TOPIC_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  type="button"
                  className="w-full text-left p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 hover:border-indigo-500/20 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-400 uppercase font-mono tracking-wide">
                      {suggestion.category}
                    </span>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono">
                      {suggestion.mode}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                    {suggestion.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {suggestion.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* SYSTEM ARCHITECTURE CONTROL CARD */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Settings size={14} className="text-indigo-400" />
              <span>Configure Editorial Directives</span>
            </h3>

            {/* TOPIC INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-400 uppercase">Target Technology or Keyword</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Guide to Next.js 15 Server Actions, React Compiler performance, or Security best practices for Tailwind CSS systems."
                rows={3}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder:text-slate-600"
              />
            </div>

            {/* GRID OF CONTROLS */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* MODEL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Engine Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Heavy Reasoning)</option>
                </select>
              </div>

              {/* TARGET LANGUAGE */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Localization Mode</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="bilingual">Bilingual (English + Nepali)</option>
                  <option value="en">English (Monolingual)</option>
                  <option value="ne">Nepali (मस्यौदा नेपाली संस्करण)</option>
                </select>
              </div>

              {/* MODE */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Structural Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="standard">Standard Article / Essay</option>
                  <option value="news">Tech News Mode</option>
                  <option value="tutorial">Tutorial Mode</option>
                  <option value="comparison">Comparison Mode</option>
                </select>
              </div>

              {/* DIFFICULTY */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Expertise Depth</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (Introductory)</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced Architect</option>
                  <option value="Expert">Expert / Executive</option>
                </select>
              </div>

              {/* TONE */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Editorial Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="Professional & Direct">Professional & Direct</option>
                  <option value="Friendly & Engaging">Friendly & Engaging</option>
                  <option value="Highly Analytical">Highly Analytical / Academic</option>
                  <option value="Technical & Grounded">Technical & Grounded</option>
                </select>
              </div>

              {/* WORD COUNT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">Length Estimate</label>
                <select
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500"
                >
                  <option value="Short (~800 words)">Short (~800 words)</option>
                  <option value="Medium (~1500 words)">Medium (~1500 words)</option>
                  <option value="Long Form (~3000 words)">Deep Long-form (~3000 words)</option>
                </select>
              </div>

            </div>

            {/* ADDITIONAL CUSTOM INSTRUCTIONS */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-400 uppercase">Additional Custom Instructions (Optional)</label>
              <input
                type="text"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g., Use TypeScript interfaces, benchmark comparisons, list SEO rules, etc."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 font-mono placeholder:text-slate-700"
              />
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-mono flex items-start space-x-2">
                <span className="font-bold flex-shrink-0 mt-0.5">⚠️ ERROR:</span>
                <span>{error}</span>
              </div>
            )}

            {/* GENERATE ACTION BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              type="button"
              className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white font-bold py-3.5 px-6 rounded-lg text-sm shadow-xl transition-all flex items-center justify-center space-x-2.5"
            >
              {isGenerating ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  <span>Generating Enterprise Article...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  <span>Architect Production Article</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW & EXPORT WORKSPACE */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          
          <AnimatePresence mode="wait">
            
            {/* 1. LOADING OVERLAY */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900/30 border border-slate-900 rounded-xl p-8 flex flex-col items-center justify-center min-h-[500px] text-center space-y-6"
              >
                {/* Orbital Spinner */}
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-2.5 rounded-full border-4 border-emerald-500/10 border-b-emerald-500 animate-spin-slow" />
                  <Sparkles size={24} className="text-indigo-400 animate-pulse" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    {STAGES[generationStage].label}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px] italic">
                    {STAGES[generationStage].desc}
                  </p>
                </div>

                {/* Simulated Process Indicator Bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>STAGE {generationStage + 1} OF 5</span>
                    <span>{Math.round(((generationStage + 1) / 5) * 100)}% COMPLETE</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: `${((generationStage + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Running Terminal Metadata Log */}
                <div className="w-full max-w-md bg-slate-950 p-4 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-500 text-left space-y-1 select-none">
                  <div className="flex items-center space-x-1.5 text-indigo-400">
                    <Terminal size={12} />
                    <span>[Gemini Architect] Connecting to Asia-East1 clusters...</span>
                  </div>
                  <div>$ init --model {model} --lang {targetLang}</div>
                  {generationStage >= 1 && <div className="text-emerald-400">✔ Search intent verified: Google Helpful Content criteria synchronized</div>}
                  {generationStage >= 2 && <div className="text-emerald-400">✔ Code references fact-checked: Standard compliant TypeScript modules structured</div>}
                  {generationStage >= 3 && <div className="text-emerald-400">✔ Article structure verified: TOC headers matched schema targets</div>}
                  {generationStage >= 4 && <div className="text-emerald-400">✔ Multi-lingual localization: Formatted localized translation rules</div>}
                  <div className="animate-pulse">_ processing payload streams...</div>
                </div>

              </motion.div>
            )}

            {/* 2. PERSISTENT EMPTY STATE */}
            {!isGenerating && !articleResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/10 border border-dashed border-slate-900 rounded-xl p-12 flex flex-col items-center justify-center min-h-[500px] text-center space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                  <FileText size={20} />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-slate-300 uppercase font-mono tracking-wider">No Draft Generated Yet</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select a curated topic suggestion or type your custom tech prompt on the left to trigger the AI Enterprise editorial team.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. GENERATION OUTCOME PRESENTATION */}
            {!isGenerating && articleResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col min-w-0"
              >
                {/* ACTIVE RESULT OPTIONS ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">Category:</span>
                    <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
                      {articleResult.category || 'Artificial Intelligence'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePublish('blog')}
                      type="button"
                      className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow"
                    >
                      <BookOpen size={13} />
                      <span>Publish as Blog</span>
                    </button>
                    <button
                      onClick={() => handlePublish('news')}
                      type="button"
                      className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow"
                    >
                      <Newspaper size={13} />
                      <span>Publish as News</span>
                    </button>
                  </div>
                </div>

                {/* SPLIT TABS WORKSPACE */}
                <div className="flex border-b border-slate-900">
                  <button
                    onClick={() => setResultTab('previewEn')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all font-mono uppercase tracking-wide flex items-center space-x-1.5 ${
                      resultTab === 'previewEn' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    <Globe size={12} />
                    <span>English Draft</span>
                  </button>
                  {articleResult.contentNp && (
                    <button
                      onClick={() => setResultTab('previewNp')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all font-mono uppercase tracking-wide flex items-center space-x-1.5 ${
                        resultTab === 'previewNp' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-emerald-400'
                      }`}
                    >
                      <Languages size={12} />
                      <span>Nepali Draft</span>
                    </button>
                  )}
                  <button
                    onClick={() => setResultTab('seo')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all font-mono uppercase tracking-wide flex items-center space-x-1.5 ${
                      resultTab === 'seo' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    <Settings size={12} />
                    <span>SEO Pack</span>
                  </button>
                  <button
                    onClick={() => setResultTab('schema')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all font-mono uppercase tracking-wide flex items-center space-x-1.5 ${
                      resultTab === 'schema' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    <Code size={12} />
                    <span>JSON-LD Schema</span>
                  </button>
                  <button
                    onClick={() => setResultTab('newsletter')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all font-mono uppercase tracking-wide flex items-center space-x-1.5 ${
                      resultTab === 'newsletter' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    <Share2 size={12} />
                    <span>Distribution</span>
                  </button>
                </div>

                {/* WORKSPACE VIEWS CONTAINER */}
                <div className="flex-1 min-h-[450px] bg-slate-950 rounded-xl border border-slate-900 p-6 overflow-y-auto max-h-[600px] text-left">
                  
                  {/* ENGLISH PREVIEW */}
                  {resultTab === 'previewEn' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-900 pb-4">
                        <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                          {articleResult.title}
                        </h1>
                        <p className="text-slate-400 text-xs mt-2 font-mono flex items-center space-x-2">
                          <span>Slug: /{articleResult.slug}</span>
                          <span className="text-slate-600">|</span>
                          <span>Est. Reading Time: {Math.max(1, Math.ceil((articleResult.contentEn || '').split(' ').length / 200))} mins</span>
                        </p>
                      </div>

                      {/* TOC EN */}
                      {articleResult.tableOfContents && articleResult.tableOfContents.length > 0 && (
                        <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-lg">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono mb-2">Table of Contents</h4>
                          <ul className="space-y-1.5 text-xs font-mono text-slate-400">
                            {articleResult.tableOfContents.map((toc: any, index: number) => (
                              <li key={index} style={{ paddingLeft: `${(toc.level - 1) * 12}px` }} className="hover:text-indigo-400 transition-colors">
                                • {toc.heading}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ARTICLE SUMMARY KEY POINTS */}
                      {articleResult.summary && (
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                          <h4 className="text-sm font-bold text-indigo-400 uppercase font-mono mb-2">Architectural Highlights / Takeaways</h4>
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{articleResult.summary}</p>
                        </div>
                      )}

                      {/* EN BODY MARKDOWN PREVIEW */}
                      <div className="prose prose-invert max-w-none text-slate-300 select-text">
                        <div className="space-y-5">
                          {articleResult.contentEn ? (
                            articleResult.contentEn.split('\n').map((line: string, idx: number) => {
                              if (line.startsWith('### ')) {
                                return <h4 key={idx} className="text-xl font-bold text-white mt-8 border-b border-slate-800 pb-2 font-mono">{line.replace('### ', '')}</h4>;
                              }
                              if (line.startsWith('## ')) {
                                return <h3 key={idx} className="text-2xl font-bold text-indigo-400 mt-10 border-l-4 border-indigo-500 pl-4 font-mono">{line.replace('## ', '')}</h3>;
                              }
                              if (line.startsWith('# ')) {
                                return <h2 key={idx} className="text-3xl font-extrabold text-white mt-12 mb-4">{line.replace('# ', '')}</h2>;
                              }
                              if (line.startsWith('- ')) {
                                return <li key={idx} className="list-disc list-inside text-base md:text-lg text-slate-300 pl-3 my-2 leading-relaxed">{line.replace('- ', '')}</li>;
                              }
                              if (line.startsWith('```')) {
                                return null; // Avoid block duplicates
                              }
                              return <p key={idx} className="text-base md:text-lg leading-relaxed text-slate-200 my-4">{line}</p>;
                            })
                          ) : (
                            <p className="text-slate-400 text-sm italic">No English body compiled.</p>
                          )}
                        </div>
                      </div>

                      {/* FAQS */}
                      {articleResult.faq && articleResult.faq.length > 0 && (
                        <div className="space-y-3.5 border-t border-slate-900 pt-6">
                          <h3 className="text-sm font-bold text-white uppercase font-mono">Frequently Asked Questions</h3>
                          <div className="space-y-2">
                            {articleResult.faq.map((f: any, index: number) => (
                              <div key={index} className="border border-slate-900 rounded-lg overflow-hidden bg-slate-950">
                                <button
                                  type="button"
                                  onClick={() => setActiveFaqIdx(activeFaqIdx === index ? null : index)}
                                  className="w-full text-left p-3 flex justify-between items-center text-xs font-bold text-slate-300 hover:text-white"
                                >
                                  <span>{f.question}</span>
                                  <span>{activeFaqIdx === index ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                                </button>
                                {activeFaqIdx === index && (
                                  <div className="p-3 bg-slate-900/10 border-t border-slate-900 text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {f.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NEPALI PREVIEW */}
                  {resultTab === 'previewNp' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-900 pb-4">
                        <h1 className="text-xl md:text-2xl font-extrabold text-emerald-400 leading-tight">
                          {articleResult.titleNp || articleResult.title}
                        </h1>
                        <p className="text-slate-400 text-xs mt-2 font-mono">
                          शीर्षक नेपालीमा | स्लग: /{articleResult.slug}
                        </p>
                      </div>

                      {/* ARTICLE SUMMARY NEPALI */}
                      {articleResult.excerptNp && (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                          <h4 className="text-sm font-bold text-emerald-400 uppercase font-mono mb-2">मुख्य जानकारी (Excerpt in Nepali)</h4>
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed">{articleResult.excerptNp}</p>
                        </div>
                      )}

                      {/* NP BODY PREVIEW */}
                      <div className="prose prose-invert max-w-none text-slate-300 select-text">
                        <div className="space-y-5">
                          {articleResult.contentNp ? (
                            articleResult.contentNp.split('\n').map((line: string, idx: number) => {
                              if (line.startsWith('### ')) {
                                return <h4 key={idx} className="text-xl font-bold text-white mt-8 border-b border-slate-800 pb-2 font-mono">{line.replace('### ', '')}</h4>;
                              }
                              if (line.startsWith('## ')) {
                                return <h3 key={idx} className="text-2xl font-bold text-emerald-400 mt-10 border-l-4 border-emerald-500 pl-4 font-mono">{line.replace('## ', '')}</h3>;
                              }
                              if (line.startsWith('# ')) {
                                return <h2 key={idx} className="text-3xl font-extrabold text-white mt-12 mb-4">{line.replace('# ', '')}</h2>;
                              }
                              if (line.startsWith('- ')) {
                                return <li key={idx} className="list-disc list-inside text-base md:text-lg text-slate-300 pl-3 my-2 leading-relaxed">{line.replace('- ', '')}</li>;
                              }
                              return <p key={idx} className="text-base md:text-lg leading-relaxed text-slate-200 my-4">{line}</p>;
                            })
                          ) : (
                            <p className="text-slate-400 text-sm italic">No Nepali body compiled. If bilingual was selected, try running translation again.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEO PACK */}
                  {resultTab === 'seo' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">SEO Keywords & Meta Tag Configurations</h3>
                        <button
                          type="button"
                          onClick={() => handleCopy(JSON.stringify(articleResult, null, 2), 'seoAll')}
                          className="text-[10px] text-indigo-400 font-mono hover:underline flex items-center space-x-1"
                        >
                          <Copy size={10} />
                          <span>{copiedField === 'seoAll' ? 'Copied Full SEO pack!' : 'Copy Entire Meta Pack'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                          <span className="text-indigo-400 text-[10px] font-bold uppercase block">Meta Title</span>
                          <span className="text-white font-semibold">{articleResult.metaTitle}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                          <span className="text-indigo-400 text-[10px] font-bold uppercase block">Focus Keyword</span>
                          <span className="text-white font-semibold">{articleResult.focusKeyword}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 md:col-span-2 space-y-1">
                          <span className="text-indigo-400 text-[10px] font-bold uppercase block">Meta Description</span>
                          <p className="text-slate-300">{articleResult.metaDescription}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                          <span className="text-indigo-400 text-[10px] font-bold uppercase block">Canonical Slug</span>
                          <span className="text-slate-300">https://harendralamsal.name.np/blog/{articleResult.canonicalSlug}</span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                          <span className="text-indigo-400 text-[10px] font-bold uppercase block">Image Alt Text</span>
                          <span className="text-slate-300">{articleResult.imageAltText}</span>
                        </div>
                      </div>

                      {/* SOCIAL CHANNELS PACK */}
                      <div className="space-y-3.5 border-t border-slate-900 pt-5">
                        <h4 className="text-xs font-bold text-white uppercase font-mono">Open Graph Protocols (OG)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                            <span className="text-indigo-400 text-[10px] font-bold uppercase block">og:title</span>
                            <span className="text-white">{articleResult.openGraphTitle}</span>
                          </div>
                          <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 space-y-1">
                            <span className="text-indigo-400 text-[10px] font-bold uppercase block">og:description</span>
                            <span className="text-white">{articleResult.openGraphDescription}</span>
                          </div>
                        </div>
                      </div>

                      {/* TAXONOMIES & INTEGRATIONS */}
                      <div className="space-y-3.5 border-t border-slate-900 pt-5">
                        <h4 className="text-xs font-bold text-white uppercase font-mono">LSI Keywords & Taxonomy suggestions</h4>
                        <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-900 text-xs leading-relaxed space-y-2.5 font-mono">
                          <div>
                            <span className="text-indigo-400 text-[10px] uppercase font-bold block">Secondary Keywords</span>
                            <span className="text-slate-300">{articleResult.secondaryKeywords?.join(', ') || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 text-[10px] uppercase font-bold block">LSI Keywords</span>
                            <span className="text-slate-300">{articleResult.lsiKeywords?.join(', ') || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 text-[10px] uppercase font-bold block">Internal Link Candidates</span>
                            <span className="text-slate-300">{articleResult.internalLinkSuggestions?.join(' | ') || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 text-[10px] uppercase font-bold block">Featured Image AI Art Prompt</span>
                            <span className="text-emerald-400 italic text-[11px] block mt-1 select-text bg-slate-950 p-2.5 rounded border border-slate-900">
                              {articleResult.featuredImagePrompt}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* JSON-LD SCHEMA */}
                  {resultTab === 'schema' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">JSON-LD structured data</h3>
                        <button
                          type="button"
                          onClick={() => handleCopy(articleResult.jsonLdSchema, 'schemaText')}
                          className="text-[10px] text-indigo-400 font-mono hover:underline flex items-center space-x-1"
                        >
                          <Copy size={10} />
                          <span>{copiedField === 'schemaText' ? 'Copied Schema Code!' : 'Copy Schema Script'}</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-[10px] text-indigo-300 overflow-x-auto whitespace-pre-wrap select-all">
                        <code>
                          {articleResult.jsonLdSchema ? (
                            articleResult.jsonLdSchema
                          ) : (
                            `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://harendralamsal.name.np/blog/${articleResult.slug}"
  },
  "headline": "${articleResult.title}",
  "description": "${articleResult.excerpt}",
  "author": {
    "@type": "Person",
    "name": "Harendra Lamsal",
    "url": "https://harendralamsal.name.np"
  }
}`
                          )}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* NEWSLETTER SUMMARY */}
                  {resultTab === 'newsletter' && (
                    <div className="space-y-5">
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
                            <SendHorizontal size={13} className="text-indigo-400" />
                            <span>1. LinkedIn & Twitter Copywriting</span>
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopy(articleResult.socialMediaCaption, 'socialCap')}
                            className="text-[10px] text-indigo-400 font-mono hover:underline flex items-center space-x-1"
                          >
                            <Copy size={10} />
                            <span>{copiedField === 'socialCap' ? 'Copied social caption!' : 'Copy Caption'}</span>
                          </button>
                        </div>
                        <div className="bg-slate-900/10 border border-slate-900 rounded-lg p-4 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-text">
                          {articleResult.socialMediaCaption || 'No social caption compiled.'}
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-slate-900 pt-5">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
                            <Globe size={13} className="text-indigo-400" />
                            <span>2. Ready-to-Send Email Newsletter</span>
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopy(articleResult.newsletterSummary, 'newsSummary')}
                            className="text-[10px] text-indigo-400 font-mono hover:underline flex items-center space-x-1"
                          >
                            <Copy size={10} />
                            <span>{copiedField === 'newsSummary' ? 'Copied newsletter!' : 'Copy Email Newsletter'}</span>
                          </button>
                        </div>
                        <div className="bg-slate-900/10 border border-slate-900 rounded-lg p-4 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-text">
                          {articleResult.newsletterSummary || 'No newsletter draft compiled.'}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
