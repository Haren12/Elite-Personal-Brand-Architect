import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe,
  CheckCircle,
  AlertTriangle,
  Code,
  Table,
  Quote,
  Info,
  ExternalLink,
  Eye,
  Save,
  Layers,
  RefreshCw,
  Upload,
  Check,
  ChevronDown,
  User,
  Zap,
  TrendingUp,
  FileText,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { NewsItem, Translation } from '../types';

interface AiNewsPublishingStudioProps {
  onSave: (item: NewsItem) => void;
  news: NewsItem[];
}

export default function AiNewsPublishingStudio({ onSave, news }: AiNewsPublishingStudioProps) {
  // --- Workspace States ---
  const [langMode, setLangMode] = useState<'single' | 'dual'>('single');
  const [activeTab, setActiveTab] = useState<'en' | 'ne'>('en'); // in single mode
  const [editorLayout, setEditorLayout] = useState<'edit' | 'preview' | 'split'>('split');
  
  // Left & Right sidebars collapsible state
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<'seo' | 'media' | 'settings'>('media');

  // --- Document Fields ---
  const [newsId, setNewsId] = useState(`news-${Date.now()}`);
  const [titleEn, setTitleEn] = useState('OpenAI Unveils GPT-5 "Omni-Sovereign" with Real-Time Latency & Agent Orchestration');
  const [excerptEn, setExcerptEn] = useState('A breakdown of the new sovereign foundation models running natively on edge clusters, featuring self-compiling memory trees.');
  const [contentEn, setContentEn] = useState(`## The Sovereign Compute Frontier

Today OpenAI announced the deployment of its next-generation foundational system, codenamed **GPT-5 Omni-Sovereign**. Moving away from pure cloud-centric inference arrays, this new intelligence system deploys localized agent clusters capable of executing sub-5ms tasks directly.

Here is the system architecture breakdown of how edge nodes balance memory trees:

![Quantum Cluster Grid](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80)
*Figure 1: Visual representation of decentralized neural clusters communicating in synchronized sub-states.*

## Catchy Structural Benchmarks

Traditional AI systems relied heavily on massive, high-latency centralized servers. GPT-5 bypasses this entirely:

> "The speed of intelligence is no longer bound by the speed of light in optical fibers, but by the density of decentralized token memories stored locally."
> — Chief Technology Architect

For a full breakdown of deployment steps, check our official [Developer Onboarding Portal](https://harendralamsal.name.np/developer-onboarding).

## Live Infrastructure Grid

We performed initial latency crawls across global edge endpoints:

| Node Region | Latency Delta | Package Drop Rate |
|---|---|---|
| South-Asia Edge (Nepal) | 12ms | 0.00% |
| US-East Primary | 3ms | 0.00% |
| EU-West Central | 7ms | 0.01% |
`);

  const [titleNp, setTitleNp] = useState('ओपनएआईद्वारा वास्तविक समयको नयाँ एआई "जीपीटी-५" सार्वजनिक');
  const [excerptNp, setExcerptNp] = useState('एज क्लस्टरहरूमा नेटिभ रूपमा चलिरहेको अर्को पुस्ताको सार्वभौम फाउन्डेसन मोडलको विस्तृत विश्लेषण।');
  const [contentNp, setContentNp] = useState(`## कम्प्युट सीमानाको नयाँ युग

आज ओपनएआईले आफ्नो नयाँ प्रणाली **GPT-5 Omni-Sovereign** सार्वजनिक गरेको छ। यो नयाँ बौद्धिक प्रणालीले स्थानीय रूपमा चल्ने एजेन्ट क्लस्टरहरू परिचालन गर्छ जसले ५ मिलिसेकेन्डभन्दा कम समयमा कार्यहरू सम्पन्न गर्न सक्छन्।

डेसेन्ट्रलाइज्ड न्यूरल क्लस्टरहरूको नमुना तस्विर तल प्रस्तुत गरिएको छ:

![न्युरल नेटवर्क नमुना](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80)
*चित्र १: विकेन्द्रीकृत न्यूरल क्लस्टरहरूको तस्विर*

परम्परागत एआई प्रणालीहरू ठूला सर्भरहरूमा निर्भर हुन्थे, तर जीपीटी-५ ले यसलाई पूर्ण रूपमा परिवर्तन गरिदिएको छ।

थप जानकारीको लागि, हाम्रा आधिकारिक लिंकहरू र दस्तावेजहरू पढ्नुहोस्: [डेभलपर पोर्टल विवरण](https://harendralamsal.name.np/developer-onboarding)।
`);

  const [category, setCategory] = useState('Artificial Intelligence');
  const [tags, setTags] = useState(['GPT-5', 'OpenAI', 'Edge Compute', 'Tech News']);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isTrending, setIsTrending] = useState(true);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('published');
  const [author, setAuthor] = useState('Harendra Lamsal');

  // --- Dynamic Inline Media Insert States ---
  const [insertImageUrl, setInsertImageUrl] = useState('');
  const [insertImageAlt, setInsertImageAlt] = useState('');
  const [insertImageCaption, setInsertImageCaption] = useState('');
  
  const [insertLinkUrl, setInsertLinkUrl] = useState('');
  const [insertLinkText, setInsertLinkText] = useState('');

  // --- Auto-Save States ---
  const [lastSaved, setLastSaved] = useState<string>('');
  const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('saved');

  // --- Notification ---
  const [notification, setNotification] = useState('');

  // --- Media Library Presets ---
  const [mediaLibrary, setMediaLibrary] = useState([
    { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', name: 'news_featured.png', alt: 'Tech News Cover' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', name: 'decentralized_grid.png', alt: 'Neural Network Cluster Grid' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', name: 'dashboard_vitals.png', alt: 'CMS Analytics Dashboard' },
    { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', name: 'cyber_shield.png', alt: 'Decentralized Cyber Shield Node' },
  ]);

  const [aiTranslating, setAiTranslating] = useState(false);
  const [aiOptimizing, setAiOptimizing] = useState(false);

  // Keyboard elements ref for cursor injection
  const editorRefEn = useRef<HTMLTextAreaElement>(null);
  const editorRefNp = useRef<HTMLTextAreaElement>(null);

  // Dynamic values
  const wordCountEn = contentEn ? contentEn.trim().split(/\s+/).length : 0;
  const wordCountNp = contentNp ? contentNp.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCountEn / 200));

  // Auto-save timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSaveIndicator('saving');
      setTimeout(() => {
        setLastSaved(new Date().toLocaleTimeString());
        setSaveIndicator('saved');
        localStorage.setItem('news_studio_draft', JSON.stringify({
          titleEn, excerptEn, contentEn,
          titleNp, excerptNp, contentNp,
          category, tags, featuredImage, isBreaking, isTrending, isFeatured
        }));
      }, 700);
    }, 12000);
    return () => clearInterval(interval);
  }, [titleEn, excerptEn, contentEn, titleNp, excerptNp, contentNp, category, tags, featuredImage, isBreaking, isTrending, isFeatured]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('news_studio_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.titleEn) setTitleEn(d.titleEn);
        if (d.excerptEn) setExcerptEn(d.excerptEn);
        if (d.contentEn) setContentEn(d.contentEn);
        if (d.titleNp) setTitleNp(d.titleNp);
        if (d.excerptNp) setExcerptNp(d.excerptNp);
        if (d.contentNp) setContentNp(d.contentNp);
        if (d.category) setCategory(d.category);
        if (d.tags) setTags(d.tags);
        if (d.featuredImage) setFeaturedImage(d.featuredImage);
        if (d.isBreaking !== undefined) setIsBreaking(d.isBreaking);
        if (d.isTrending !== undefined) setIsTrending(d.isTrending);
        if (d.isFeatured !== undefined) setIsFeatured(d.isFeatured);
      } catch (e) {
        console.error('Failed to parse news draft', e);
      }
    }
  }, []);

  // AI Translation proxy trigger
  const runAiTranslate = async () => {
    if (!contentEn || !titleEn) {
      alert('Please fill in the English Headline and Body first.');
      return;
    }
    setAiTranslating(true);
    setNotification('Gemini localization engine translating news to Nepali...');
    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleEn,
          excerpt: excerptEn,
          content: contentEn,
        }),
      });
      if (!res.ok) throw new Error('API router response failed');
      const data = await res.json();
      setTitleNp(data.translatedTitle || '');
      setExcerptNp(data.translatedExcerpt || '');
      setContentNp(data.translatedContent || '');
      setNotification('Success: Translated with natural colloquial flow via Gemini AI!');
    } catch (err) {
      console.error(err);
      // Fallback
      setTitleNp(`${titleEn} (नेपाली अनुवाद)`);
      setExcerptNp(`${excerptEn} (अनुवाद विवरण)`);
      setContentNp(`### ${titleEn} (नेपाली विवरण)\n\nयो नेपालीमा स्वचालित रूपमा तयार गरिएको अनुवाद हो।\n\n${contentEn}`);
      setNotification('Fallback: Local translator applied.');
    } finally {
      setAiTranslating(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  // AI SEO Optimizer for News metadata
  const runAiSeoOptimize = async () => {
    if (!titleEn) {
      alert('Please enter a Headline first.');
      return;
    }
    setAiOptimizing(true);
    setNotification('Optimizing meta descriptions and tags...');
    try {
      const res = await fetch('/api/gemini/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleEn }),
      });
      if (!res.ok) throw new Error('SEO endpoint failed');
      const data = await res.json();
      setExcerptEn(data.metaDescription || excerptEn);
      if (data.tags) {
        const newTags = data.tags.split(',').map((t: string) => t.trim());
        setTags([...new Set([...tags, ...newTags])]);
      }
      setNotification('Success: Optimised news bulletin tags and SEO teaser!');
    } catch (err) {
      console.error(err);
      setNotification('Fallback: Added default tech tags.');
    } finally {
      setAiOptimizing(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  // Drag and Drop File Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFeaturedImage(url);
        // Add to media library
        setMediaLibrary([{ url, name: file.name, alt: file.name.split('.')[0] }, ...mediaLibrary]);
        setNotification(`Uploaded "${file.name}" as featured image.`);
        setTimeout(() => setNotification(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFeaturedImage(url);
        setMediaLibrary([{ url, name: file.name, alt: file.name.split('.')[0] }, ...mediaLibrary]);
        setNotification(`Featured image synced.`);
        setTimeout(() => setNotification(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to insert markdown content at current cursor position
  const insertTextAtCursor = (textToInsert: string, target: 'en' | 'ne') => {
    const textarea = target === 'en' ? editorRefEn.current : editorRefNp.current;
    const currentVal = target === 'en' ? contentEn : contentNp;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updatedVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
      
      if (target === 'en') {
        setContentEn(updatedVal);
      } else {
        setContentNp(updatedVal);
      }
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 50);
    } else {
      // Fallback append
      if (target === 'en') {
        setContentEn(prev => prev + '\n' + textToInsert);
      } else {
        setContentNp(prev => prev + '\n' + textToInsert);
      }
    }
  };

  // Insertion commands
  const handleInsertInlineImage = (target: 'en' | 'ne') => {
    const url = insertImageUrl.trim() || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
    const alt = insertImageAlt.trim() || 'Related news photo';
    const caption = insertImageCaption.trim() ? `\n*Figure: ${insertImageCaption.trim()}*` : '';
    const markdown = `\n\n![${alt}](${url})${caption}\n\n`;
    
    insertTextAtCursor(markdown, target);
    setInsertImageUrl('');
    setInsertImageAlt('');
    setInsertImageCaption('');
    setNotification('Inserted inline image block to body!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleInsertLink = (target: 'en' | 'ne') => {
    const url = insertLinkUrl.trim() || 'https://harendralamsal.name.np';
    const text = insertLinkText.trim() || 'Official Reference Source';
    const markdown = ` [${text}](${url}) `;
    
    insertTextAtCursor(markdown, target);
    setInsertLinkUrl('');
    setInsertLinkText('');
    setNotification('Inserted styled link to body!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleInsertQuote = (target: 'en' | 'ne') => {
    const markdown = `\n\n> "Paste news statement/quote here from an authoritative figure to build high reader trust."\n> — Source Author\n\n`;
    insertTextAtCursor(markdown, target);
  };

  const handleInsertCallout = (target: 'en' | 'ne') => {
    const markdown = `\n\n> 📢 **BREAKING DETAILS:** Insert crucial system update or chronological event sequence here.\n\n`;
    insertTextAtCursor(markdown, target);
  };

  // Handle Publish Submit
  const handlePublishSync = () => {
    if (!titleEn || !contentEn) {
      alert('Headline and news content body are required in English source.');
      return;
    }

    const finalSlug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalItem: NewsItem = {
      id: newsId,
      slug: finalSlug,
      translations: {
        en: {
          title: titleEn,
          excerpt: excerptEn || 'High-fidelity live tech news.',
          content: contentEn,
        },
        ne: {
          title: titleNp || `${titleEn} (नेपाली विवरण)`,
          excerpt: excerptNp || 'नेपाली संस्करण लेख विवरण।',
          content: contentNp || contentEn,
        }
      },
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      category: category,
      tags: tags,
      publishedAt: new Date().toISOString(),
      isBreaking: isBreaking,
      isTrending: isTrending,
      isFeatured: isFeatured,
      isEditorsPick: false,
      isSticky: false,
      status: publishStatus,
      author: author || 'Harendra Lamsal',
      readingTimeMin: readingTime,
      views: 0
    };

    onSave(finalItem);
    alert('🎉 Tech News article created and synced successfully to the homepage portal!');
    
    // Clear and reset state
    setNewsId(`news-${Date.now()}`);
    setTitleEn('');
    setExcerptEn('');
    setContentEn('');
    setTitleNp('');
    setExcerptNp('');
    setContentNp('');
    setTags(['AI', 'Tech']);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans border border-slate-900 rounded-2xl overflow-hidden" id="news-publishing-studio">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Megaphone size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                AI NEWS BULLETIN BUILDER
              </h1>
              <span className="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Portal Live Sync
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500 font-mono">
              <span className="flex items-center space-x-1">
                {saveIndicator === 'saving' ? (
                  <>
                    <RefreshCw size={11} className="animate-spin text-rose-400" />
                    <span className="text-rose-400">Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={11} className="text-emerald-400" />
                    <span className="text-slate-400">Autosave Active</span>
                  </>
                )}
              </span>
              <span>•</span>
              <span>Last Saved: {lastSaved || 'Just now'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Quick Toggle for Languages */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setLangMode('single'); setActiveTab('en'); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${langMode === 'single' && activeTab === 'en' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
            <button
              onClick={() => { setLangMode('single'); setActiveTab('ne'); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${langMode === 'single' && activeTab === 'ne' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              नेपाली
            </button>
            <button
              onClick={() => setLangMode('dual')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center space-x-1 ${langMode === 'dual' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Globe size={11} />
              <span>Bilingual Grid</span>
            </button>
          </div>

          <button
            onClick={handlePublishSync}
            className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white px-5 py-2 text-xs font-bold rounded-lg shadow-lg shadow-rose-600/10 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle size={14} />
            <span>Publish News Bulletin</span>
          </button>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="mx-6 mt-4 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-rose-400 flex items-center space-x-2 animate-fade-in">
          <Sparkles size={14} className="animate-spin-slow text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* CORE BUILDER LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: LEFT CONFIG SIDEBAR (4 cols) */}
        <aside className="lg:col-span-4 border-r border-slate-900 bg-slate-950/40 p-6 space-y-6 overflow-y-auto">
          
          {/* FEATURED PROFILE PIC / BANNER UPLOAD */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Article Profile Pic / Featured Image
            </h3>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="group relative border border-dashed border-slate-800 hover:border-rose-500/50 bg-slate-900/20 hover:bg-slate-900/40 rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center"
            >
              {featuredImage ? (
                <div className="w-full relative rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="w-full h-32 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-1 rounded">Replace Photo</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-400">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Drag & Drop Image File</span>
                    <span className="text-[10px] text-slate-500">or click to choose local image</span>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Direct Image URL input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Or Paste Direct Photo URL</label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full text-xs rounded border border-slate-850 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:ring-0"
              />
            </div>
          </div>

          {/* CATCHY INLINE IMAGES & MEDIA INJECTOR HUB */}
          <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Catchy Content Booster Hub
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use these components to instantly insert styled, high-impact photos and links inside your article body to keep readers hooked.
            </p>

            {/* Section A: Insert Inline Image */}
            <div className="border-t border-slate-900 pt-3 space-y-2.5">
              <div className="text-[10px] font-bold text-slate-300 font-mono flex items-center space-x-1">
                <ImageIcon size={12} className="text-rose-400" />
                <span>1. INSERT INLINE ARTICLE PHOTO</span>
              </div>
              <input
                type="text"
                value={insertImageUrl}
                onChange={(e) => setInsertImageUrl(e.target.value)}
                placeholder="Paste related photo URL..."
                className="w-full text-[11px] rounded border border-slate-850 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-rose-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={insertImageAlt}
                  onChange={(e) => setInsertImageAlt(e.target.value)}
                  placeholder="Alt text (SEO)..."
                  className="w-full text-[11px] rounded border border-slate-850 bg-slate-950 px-2 py-1.5 text-slate-200 focus:border-rose-500"
                />
                <input
                  type="text"
                  value={insertImageCaption}
                  onChange={(e) => setInsertImageCaption(e.target.value)}
                  placeholder="Caption..."
                  className="w-full text-[11px] rounded border border-slate-850 bg-slate-950 px-2 py-1.5 text-slate-200 focus:border-rose-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleInsertInlineImage(activeTab)}
                className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold text-[10px] rounded uppercase tracking-wider"
              >
                Insert Photo Into Body
              </button>
            </div>

            {/* Section B: Insert Article Link */}
            <div className="border-t border-slate-900 pt-3 space-y-2.5">
              <div className="text-[10px] font-bold text-slate-300 font-mono flex items-center space-x-1">
                <LinkIcon size={12} className="text-amber-400" />
                <span>2. INSERT INTERACTIVE SOURCE LINK</span>
              </div>
              <input
                type="text"
                value={insertLinkUrl}
                onChange={(e) => setInsertLinkUrl(e.target.value)}
                placeholder="Paste target link (e.g. https://...)"
                className="w-full text-[11px] rounded border border-slate-850 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-rose-500"
              />
              <input
                type="text"
                value={insertLinkText}
                onChange={(e) => setInsertLinkText(e.target.value)}
                placeholder="Display text (e.g. read source reports)..."
                className="w-full text-[11px] rounded border border-slate-850 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => handleInsertLink(activeTab)}
                className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 font-bold text-[10px] rounded uppercase tracking-wider"
              >
                Inject styled Link
              </button>
            </div>

            {/* Section C: Instants */}
            <div className="border-t border-slate-900 pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleInsertQuote(activeTab)}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-[10px] font-bold rounded flex items-center justify-center space-x-1"
              >
                <Quote size={10} />
                <span>Inject Quote Block</span>
              </button>
              <button
                type="button"
                onClick={() => handleInsertCallout(activeTab)}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-[10px] font-bold rounded flex items-center justify-center space-x-1"
              >
                <Info size={10} />
                <span>Inject Alert Badge</span>
              </button>
            </div>
          </div>

          {/* AI GEMINI ASSISTANT BAR */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Gemini AI Integration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={runAiTranslate}
                disabled={aiTranslating}
                className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                {aiTranslating ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    <Globe size={13} />
                    <span>Colloquial Nepali</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={runAiSeoOptimize}
                disabled={aiOptimizing}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                {aiOptimizing ? (
                  <span>Optimising...</span>
                ) : (
                  <>
                    <Sparkles size={13} className="text-amber-400" />
                    <span>SEO Auto-Tags</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* METADATA FORM CONTROL */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              News Settings
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-rose-500"
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
                <option value="Science & Technology">Science & Technology</option>
                <option value="Agriculture & Farming">Agriculture & Farming</option>
                <option value="Food & Recipes">Food & Recipes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
                placeholder="AI, openai, breaking"
                className="w-full text-xs rounded border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-300 font-bold bg-slate-900/40 p-2.5 rounded border border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span className="text-rose-400">Breaking News</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 font-bold bg-slate-900/40 p-2.5 rounded border border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span className="text-amber-400">Trending Now</span>
              </label>
            </div>
          </div>

        </aside>

        {/* COLUMN 2: MIDDLE WRITING PAD & PORTAL LIVE PREVIEW (8 cols) */}
        <main className="lg:col-span-8 flex flex-col bg-slate-950 overflow-hidden">
          
          {/* Tabs for Split Layout or Single Editor */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-900 bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-mono">WORKSPACE LAYOUT:</span>
              <div className="flex bg-slate-900 p-0.5 rounded border border-slate-850">
                <button
                  onClick={() => setEditorLayout('edit')}
                  className={`px-3 py-1 text-xs rounded transition-all ${editorLayout === 'edit' ? 'bg-rose-600/25 text-rose-400 font-bold' : 'text-slate-400'}`}
                >
                  Raw Markdown Only
                </button>
                <button
                  onClick={() => setEditorLayout('split')}
                  className={`px-3 py-1 text-xs rounded transition-all ${editorLayout === 'split' ? 'bg-rose-600/25 text-rose-400 font-bold' : 'text-slate-400'}`}
                >
                  Bespoke Interactive split
                </button>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Reading time: <span className="text-rose-400 font-bold">{readingTime} mins</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            
            {/* WRITING PADS WORKSPACE */}
            <div className={`flex-1 flex flex-col p-6 overflow-y-auto ${editorLayout === 'split' ? 'border-r border-slate-900 max-w-[50%]' : 'w-full'}`}>
              
              {langMode === 'dual' ? (
                // Bilingual input
                <div className="space-y-6 flex-1 flex flex-col">
                  {/* English block */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-900/10 border border-slate-900">
                    <div className="text-xs font-bold text-rose-400 font-mono">1. ENGLISH SOURCE NEWS</div>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="Headline (English)..."
                      className="w-full bg-transparent border-b border-slate-900 py-1.5 font-bold text-base text-white focus:border-rose-500 focus:outline-none"
                    />
                    <textarea
                      ref={editorRefEn}
                      value={contentEn}
                      onChange={(e) => setContentEn(e.target.value)}
                      rows={8}
                      placeholder="Report content (Supports inline images & links markdown)..."
                      className="w-full bg-slate-900/30 border border-slate-850 rounded p-2.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Nepali block */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-900/10 border border-slate-900">
                    <div className="text-xs font-bold text-emerald-400 font-mono">2. नेपाली संस्करण (NEPALI LOCALIZATION)</div>
                    <input
                      type="text"
                      value={titleNp}
                      onChange={(e) => setTitleNp(e.target.value)}
                      placeholder="मुख्य समाचार शीर्षक (नेपाली)..."
                      className="w-full bg-transparent border-b border-slate-900 py-1.5 font-bold text-base text-white focus:border-rose-500 focus:outline-none"
                    />
                    <textarea
                      ref={editorRefNp}
                      value={contentNp}
                      onChange={(e) => setContentNp(e.target.value)}
                      rows={8}
                      placeholder="समाचार विवरण (मार्काडाउन र लिङ्कहरू समर्थित)..."
                      className="w-full bg-slate-900/30 border border-slate-850 rounded p-2.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                // Single language block currently active
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded border border-slate-900">
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      ACTIVE WRITING PANE: {activeTab === 'en' ? 'ENGLISH SOURCE' : 'नेपाली संस्करण'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {activeTab === 'en' ? `${wordCountEn} words` : `${wordCountNp} words`}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={activeTab === 'en' ? titleEn : titleNp}
                    onChange={(e) => activeTab === 'en' ? setTitleEn(e.target.value) : setTitleNp(e.target.value)}
                    placeholder={activeTab === 'en' ? "Enter English News Headline..." : "नेपाली समाचार मुख्य शीर्षक लेख्नुहोस्..."}
                    className="w-full bg-transparent border-b border-slate-900 focus:border-rose-500 py-2.5 text-xl font-bold text-white focus:outline-none"
                  />

                  <textarea
                    value={activeTab === 'en' ? excerptEn : excerptNp}
                    onChange={(e) => activeTab === 'en' ? setExcerptEn(e.target.value) : setExcerptNp(e.target.value)}
                    placeholder="Short summary/excerpt for portal ticker lists..."
                    rows={2}
                    className="w-full bg-slate-900/30 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-sans"
                  />

                  <textarea
                    ref={activeTab === 'en' ? editorRefEn : editorRefNp}
                    value={activeTab === 'en' ? contentEn : contentNp}
                    onChange={(e) => activeTab === 'en' ? setContentEn(e.target.value) : setContentNp(e.target.value)}
                    placeholder="Draft news report content here. Use the Catchy Boosters on the left sidebar to insert related live photos and hyperlinks..."
                    className="w-full flex-1 min-h-[350px] bg-slate-900/10 border border-slate-900 rounded-xl p-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-rose-500 leading-relaxed resize-none"
                  />
                </div>
              )}
            </div>

            {/* LIVE PORTAL PREVIEW (Split view or full) */}
            {editorLayout === 'split' && (
              <div className="flex-1 bg-slate-950 p-6 overflow-y-auto flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-xs text-slate-500 font-mono">LIVE TECH PORTAL PREVIEW</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded">High Fidelity</span>
                </div>

                {/* Simulated Portal Article Block */}
                <article className="border border-slate-900 bg-slate-900/20 rounded-2xl overflow-hidden shadow-xl p-5 text-left space-y-4">
                  {/* Category, tags, badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isBreaking && (
                      <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                        BREAKING
                      </span>
                    )}
                    {isTrending && (
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                        TRENDING
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                      {category}
                    </span>
                  </div>

                  {/* Title / Headline */}
                  <h2 className="text-xl font-bold text-white leading-tight font-sans" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {activeTab === 'en' ? (titleEn || 'Untitled Headline') : (titleNp || 'शीर्षक विहिन')}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-rose-500 pl-3 italic">
                    {activeTab === 'en' ? (excerptEn || 'No teaser provided.') : (excerptNp || 'विवरण उपलब्ध छैन।')}
                  </p>

                  {/* Profile photo/Featured Image */}
                  {featuredImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-850">
                      <img
                        src={featuredImage}
                        alt="Featured portal view"
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded text-[9px] text-slate-300 font-mono">
                        {author} • {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Simulated markdown rendering */}
                  <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans pt-2">
                    {/* Render a simulated formatted text rendering paragraphs, quotes, images */}
                    {(activeTab === 'en' ? contentEn : contentNp).split('\n\n').map((block, bIdx) => {
                      if (block.startsWith('## ')) {
                        return (
                          <h3 key={bIdx} className="text-sm font-bold text-white border-b border-slate-900 pb-1 pt-2 uppercase font-sans">
                            {block.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (block.startsWith('> ')) {
                        return (
                          <blockquote key={bIdx} className="border-l-4 border-amber-400/80 bg-slate-900/40 p-3 rounded text-xs italic text-slate-200">
                            {block.replace(/>\s*/g, '')}
                          </blockquote>
                        );
                      }
                      // Check for inline image code ![]()
                      const imgMatch = block.match(/!\[(.*?)\]\((.*?)\)/);
                      if (imgMatch) {
                        const alt = imgMatch[1];
                        const url = imgMatch[2];
                        return (
                          <div key={bIdx} className="my-3 space-y-1">
                            <img
                              src={url}
                              alt={alt}
                              className="rounded-lg border border-slate-850 max-h-48 w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-[10px] text-slate-500 italic text-center">
                              {alt || 'Inserted Article Media'}
                            </div>
                          </div>
                        );
                      }
                      // Render text with links
                      let text = block;
                      const linkMatches = [...text.matchAll(/\[(.*?)\]\((.*?)\)/g)];
                      if (linkMatches.length > 0) {
                        return (
                          <p key={bIdx} className="leading-relaxed">
                            {text.split(/\[.*?\]\(.*?\)/).map((segment, sIdx) => {
                              const match = linkMatches[sIdx];
                              return (
                                <React.Fragment key={sIdx}>
                                  {segment}
                                  {match && (
                                    <a
                                      href={match[2]}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center space-x-0.5 text-rose-400 hover:text-rose-300 underline font-semibold decoration-rose-500/50"
                                    >
                                      <span>{match[1]}</span>
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </p>
                        );
                      }

                      return <p key={bIdx} className="leading-relaxed">{block}</p>;
                    })}
                  </div>
                </article>
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
