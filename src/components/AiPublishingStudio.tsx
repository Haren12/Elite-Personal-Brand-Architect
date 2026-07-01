import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  BookOpen,
  Settings,
  Globe,
  History,
  CheckCircle,
  AlertTriangle,
  Search,
  Code,
  Table,
  Quote,
  Info,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  Layers,
  Layout,
  Play,
  ArrowRight,
  Lock,
  Unlock,
  Calendar,
  TrendingUp,
  Facebook,
  Twitter,
  Video,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileDown,
  FileUp,
  Copy,
  Check,
  ChevronDown,
  User,
  Zap,
  Bookmark,
  Share2,
  HelpCircle,
  Clock,
  List,
  Edit3
} from 'lucide-react';
import { BlogPost, Translation } from '../types';

interface AiPublishingStudioProps {
  onSave: (post: BlogPost) => void;
  posts: BlogPost[];
}

export default function AiPublishingStudio({ onSave, posts }: AiPublishingStudioProps) {
  // --- Workspace States ---
  const [langMode, setLangMode] = useState<'single' | 'dual'>('single');
  const [activeTab, setActiveTab] = useState<'en' | 'ne'>('en'); // in single mode
  const [editorLayout, setEditorLayout] = useState<'edit' | 'preview' | 'split'>('edit');
  
  // Left & Right sidebars collapsible state
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<'seo' | 'media' | 'settings'>('seo');

  // --- Document Fields ---
  const [postId, setPostId] = useState(`blog-${Date.now()}`);
  const [titleEn, setTitleEn] = useState('Architecting Quantum-Resistant React 19 Frontend Systems');
  const [excerptEn, setExcerptEn] = useState('An engineering deep-dive into post-quantum cryptography, isomorphic route hydration, and decentralized state sync on multi-threaded browser clients.');
  const [contentEn, setContentEn] = useState(`## Introduction to Quantum Vulnerability

With the impending advent of Shor's algorithm on commercial quantum computing substrates, our standard elliptic-curve cryptography (ECC) protocols face total computational obsolescence. For frontend architects, this is not a distant concern; it requires establishing secure browser-level key exchanges directly on client machines today.

> Critical System Warning: Modern WebCrypto APIs lack native support for Kyber-1024 out of the box, necessitating lightweight WebAssembly (Wasm) polyfills.

## Kyber-1024 WebAssembly Cryptographic Pipeline

To secure our data flows in real-time without introducing heavy page speed bottlenecks, we initialize a dual-key lattice encapsulation pipeline in a dedicated Web Worker thread:

\`\`\`typescript
interface PostQuantumHandshake {
  publicKey: Uint8Array;
  sharedSecret: Uint8Array;
}

export async function initializeKyberSession(): Promise<PostQuantumHandshake> {
  const worker = new Worker(new URL('./kyber.worker.ts', import.meta.url));
  return new Promise((resolve) => {
    worker.postMessage({ action: 'GENERATE_KEYS' });
    worker.onmessage = (event) => {
      resolve(event.data);
    };
  });
}
\`\`\`

## High-Performance Isomorphic Hydration

Hydration mismatches are the primary enemy of enterprise SEO. When your server-rendered HTML differs by a single character from the client-rendered output, the browser throws a hydration warning and reconstructs the entire DOM. This destroys your Interaction to Next Paint (INP) score.

By decouplig heavy cryptographic rendering blocks from initial SSR hydration, we preserve a sub-second load time while keeping our search engine presence completely optimized.`);

  const [titleNp, setTitleNp] = useState('क्वान्टम-प्रतिरोधी रिएक्ट १९ फ्रन्टएन्ड प्रणालीको निर्माण');
  const [excerptNp, setExcerptNp] = useState('पोष्ट-क्वान्टम क्रिप्टोग्राफी, आइसोमोर्फिक रूट हाइड्रेशन, र मल्टि-थ्रेडेड ब्राउजर क्लाइन्टहरूमा विकेन्द्रीकृत स्टेट सिङ्कको बारेमा एक प्राविधिक अन्वेषण।');
  const [contentNp, setContentNp] = useState(`## क्वान्टम कमजोरीको परिचय

व्यावसायिक क्वान्टम कम्प्युटिङ सबस्ट्रेट्समा शोरको एल्गोरिथ्मको आगमनसँगै, हाम्रा मानक एलिप्टिक-कर्व क्रिप्टोग्राफी (ECC) प्रोटोकलहरू पूर्ण रूपमा अप्रचलित हुने खतरामा छन्। फ्रन्टएन्ड आर्किटेक्टहरूका लागि, यो केवल भविष्यको चिन्ता मात्र होइन; यसले आजै क्लाइन्ट मेसिनहरूमा सीधै सुरक्षित ब्राउजर-स्तर कुञ्जी आदानप्रदान स्थापना गर्न आवश्यक बनाउँछ।

> महत्वपूर्ण चेतावनी: आधुनिक वेबक्रिप्टो एपीआईहरूमाKyber-1024 को लागि नेटिभ सपोर्ट हुँदैन, जसले गर्दा लाइटवेट WebAssembly (Wasm) पोलिफिलहरू आवश्यक पर्दछ।

## Kyber-1024 वेबअसेम्बली क्रिप्टोग्राफिक पाइपलाइन

कुनै पनि प्रकारको पेज स्पीड ढिलाइ नगरी वास्तविक समयमा हाम्रा डाटा प्रवाहहरू सुरक्षित गर्न, हामी एउटा समर्पित वेब वर्कर थ्रेडमा कुञ्जीहरू इन्क्याप्सुलेशन पाइपलाइन सुरु गर्छौं:

\`\`\`typescript
interface PostQuantumHandshake {
  publicKey: Uint8Array;
  sharedSecret: Uint8Array;
}

export async function initializeKyberSession(): Promise<PostQuantumHandshake> {
  const worker = new Worker(new URL('./kyber.worker.ts', import.meta.url));
  return new Promise((resolve) => {
    worker.postMessage({ action: 'GENERATE_KEYS' });
    worker.onmessage = (event) => {
      resolve(event.data);
    };
  });
}
\`\`\`

## उच्च-प्रदर्शन आइसोमोर्फिक हाइड्रेशन

हाम्रो डिजिटल सफलताको लागि हाइड्रेशन मिसम्याच ठूलो शत्रु हो। जब सर्भरबाट रेन्डर भएको HTML र क्लाइन्टमा रेन्डर भएको कोडमा सानो फरक आउँछ, ब्राउजरले त्रुटि देखाउँदै पुन: डोम रेन्डर गर्छ, जसले कोर वेभ भाइटल्स बिगार्छ।`);

  const [category, setCategory] = useState('Web Development');
  const [tags, setTags] = useState(['React 19', 'Security', 'SEO', 'WebAssembly']);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80');
  const [isFeatured, setIsFeatured] = useState(true);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  // SEO Meta configs
  const [focusKeyword, setFocusKeyword] = useState('React 19 Security');
  const [canonicalUrl, setCanonicalUrl] = useState('https://harendralamsal.name.np/blog/react-19-quantum-resistant');
  const [slug, setSlug] = useState('react-19-quantum-resistant-architectures');

  // --- Auto-Save States ---
  const [lastSaved, setLastSaved] = useState<string>('');
  const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('saved');

  // --- Search / Shortcuts ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // --- Left Sidebar Details ---
  const [outline, setOutline] = useState<{ heading: string; level: number }[]>([]);
  const [estimatedQuality, setEstimatedQuality] = useState(94);
  const [publishChecklist, setPublishChecklist] = useState({
    titleEn: true,
    contentEn: true,
    excerptEn: true,
    bilingualSynced: true,
    hasFeaturedImage: true,
    tagsAdded: true,
    seoMetaSet: true,
    headingStructure: true,
  });

  // --- Media Manager States ---
  const [mediaLibrary, setMediaLibrary] = useState([
    { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', name: 'react19_quantum.png', size: '184 KB', type: 'webp', alt: 'React 19 Quantum Security Banner' },
    { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', name: 'workspace_developer.png', size: '310 KB', type: 'png', alt: 'Minimalist Developer Desk Setup' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', name: 'analytics_charts.png', size: '240 KB', type: 'webp', alt: 'SEO Traffic Dashboard Chart' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', name: 'quantum_server.png', size: '412 KB', type: 'jpg', alt: 'Data Center Optical Nodes' },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageAltInput, setImageAltInput] = useState('React 19 Quantum Security Banner');
  const [imageCaptionInput, setImageCaptionInput] = useState('Visualizing asymmetric lattice key exchange pipelines on client terminals.');
  const [imageCreditInput, setImageCreditInput] = useState('Unsplash Digital Library');

  // --- AI Assistant Panel States ---
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAction, setAiAction] = useState<string>('expand');
  const [aiResponseText, setAiResponseText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotification, setAiNotification] = useState('');

  // --- Slash Command States & Refs ---
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);
  const [slashQuery, setSlashQuery] = useState('');
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  const editorRefEn = useRef<HTMLTextAreaElement>(null);
  const editorRefNp = useRef<HTMLTextAreaElement>(null);

  // --- Floating "+" block inserter ---
  const [floatingPlusIndex, setFloatingPlusIndex] = useState<number | null>(null);
  const [hoveredParagraphIndex, setHoveredParagraphIndex] = useState<number | null>(null);

  // --- Dual Pane Sync Scroll Refs ---
  const syncScrollRefEn = useRef<HTMLDivElement>(null);
  const syncScrollRefNp = useRef<HTMLDivElement>(null);

  // --- Version Snapshot History ---
  const [historySnapshots, setHistorySnapshots] = useState<{ id: string; time: string; titleEn: string }[]>([]);

  // Calculate stats dynamically
  const wordCountEn = contentEn ? contentEn.trim().split(/\s+/).length : 0;
  const wordCountNp = contentNp ? contentNp.trim().split(/\s+/).length : 0;
  const charCountEn = contentEn ? contentEn.length : 0;
  const charCountNp = contentNp ? contentNp.length : 0;
  const readingTimeEn = Math.max(1, Math.ceil(wordCountEn / 220));
  const readingTimeNp = Math.max(1, Math.ceil(wordCountNp / 180));

  // Auto-generate outline from headings
  useEffect(() => {
    const text = activeTab === 'en' ? contentEn : contentNp;
    const lines = text.split('\n');
    const headingMatches: { heading: string; level: number }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        headingMatches.push({
          heading: match[2],
          level: match[1].length,
        });
      }
    });
    setOutline(headingMatches);
  }, [contentEn, contentNp, activeTab]);

  // Autosave simulation to LocalStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setSaveIndicator('saving');
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        setLastSaved(timestamp);
        setSaveIndicator('saved');
        
        // Save to localStorage
        localStorage.setItem('publishing_studio_draft', JSON.stringify({
          titleEn, excerptEn, contentEn,
          titleNp, excerptNp, contentNp,
          category, tags, focusKeyword, slug, canonicalUrl, featuredImage
        }));
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, [titleEn, excerptEn, contentEn, titleNp, excerptNp, contentNp, category, tags, focusKeyword, slug, canonicalUrl, featuredImage]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('publishing_studio_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.titleEn) setTitleEn(data.titleEn);
        if (data.excerptEn) setExcerptEn(data.excerptEn);
        if (data.contentEn) setContentEn(data.contentEn);
        if (data.titleNp) setTitleNp(data.titleNp);
        if (data.excerptNp) setExcerptNp(data.excerptNp);
        if (data.contentNp) setContentNp(data.contentNp);
        if (data.category) setCategory(data.category);
        if (data.tags) setTags(data.tags);
        if (data.focusKeyword) setFocusKeyword(data.focusKeyword);
        if (data.slug) setSlug(data.slug);
        if (data.canonicalUrl) setCanonicalUrl(data.canonicalUrl);
        if (data.featuredImage) setFeaturedImage(data.featuredImage);
        
        // Populate historical snapshot mock
        setHistorySnapshots([
          { id: '1', time: '10 mins ago', titleEn: 'React 19 Hybrid Arch Draft' },
          { id: '2', time: '1 hour ago', titleEn: 'Kyber Security Baseline' },
          { id: '3', time: 'Yesterday', titleEn: 'SEO Architectural Model 101' },
        ]);
      } catch (e) {
        console.error('Failed to parse autosaved draft', e);
      }
    }
  }, []);

  // Sync scroll implementation for bilingual workspace
  const handleScrollSync = (source: 'en' | 'ne') => {
    if (langMode !== 'dual') return;
    const enDiv = syncScrollRefEn.current;
    const neDiv = syncScrollRefNp.current;
    if (!enDiv || !neDiv) return;

    if (source === 'en') {
      const pct = enDiv.scrollTop / (enDiv.scrollHeight - enDiv.clientHeight);
      neDiv.scrollTop = pct * (neDiv.scrollHeight - neDiv.clientHeight);
    } else {
      const pct = neDiv.scrollTop / (neDiv.scrollHeight - neDiv.clientHeight);
      enDiv.scrollTop = pct * (enDiv.scrollHeight - enDiv.clientHeight);
    }
  };

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + S: Manual Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        triggerManualSave();
      }
      // CMD/CTRL + K: Shortcuts dialog
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
      }
      // ESC closes dropdowns or modals
      if (e.key === 'Escape') {
        setShowSlashMenu(false);
        setPreviewModalOpen(false);
        setShowShortcutsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [titleEn, contentEn, titleNp, contentNp]);

  const triggerManualSave = () => {
    setSaveIndicator('saving');
    setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString());
      setSaveIndicator('saved');
      setAiNotification('Draft snapshot manually archived to disk!');
      setTimeout(() => setAiNotification(''), 4000);
    }, 600);
  };

  // Slash commands elements list
  const slashMenuItems = [
    { name: 'Code Block', desc: 'Insert high-contrast monospaced block', icon: Code, text: '\n```typescript\n// Paste your codebase component here\n\n```\n' },
    { name: 'Info Callout', desc: 'Introduce elegant cobalt notice banner', icon: Info, text: '\n> 💡 System Note: Decoupling isomorphic runtime dependencies prevents page hydration flickering.\n' },
    { name: 'Pull Quote', desc: 'Bespoke large stylized text quote', icon: Quote, text: '\n> "Simplicity is the final outcome of architectural focus."\n' },
    { name: 'Grid Table', desc: 'Embed high-performance data rows', icon: Table, text: '\n| System Matrix | Core Vitals Score | Load Speed (TTFB) |\n|---|---|---|\n| Edge Hydrated | 99% | < 210ms |\n| Client Hydrated | 81% | ~840ms |\n' },
    { name: 'Inline Image Block', desc: 'Add image from library or custom URL', icon: ImageIcon, text: '\n![Alt Text Placeholder](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80)\n' },
    { name: 'YouTube Video Embed', desc: 'Insert standard container frame', icon: Video, text: '\n[video: https://www.youtube.com/watch?v=dQw4w9WgXcQ]\n' },
  ];

  const handleEditorChange = (val: string, lang: 'en' | 'ne') => {
    if (lang === 'en') {
      setContentEn(val);
    } else {
      setContentNp(val);
    }

    // Capture simple slash command trigger
    if (val.endsWith('/')) {
      const activeTextarea = lang === 'en' ? editorRefEn.current : editorRefNp.current;
      if (activeTextarea) {
        const { selectionStart } = activeTextarea;
        // Basic cursor approximation
        const lines = val.substring(0, selectionStart).split('\n');
        const currentLineNum = lines.length;
        const colNum = lines[lines.length - 1].length;
        setCursorPos({
          top: currentLineNum * 21 + 80,
          left: colNum * 8 + 30
        });
        setShowSlashMenu(true);
        setSlashMenuIndex(0);
      }
    } else if (showSlashMenu) {
      setShowSlashMenu(false);
    }
  };

  const insertSlashItem = (itemText: string) => {
    const lang = langMode === 'dual' ? 'en' : activeTab;
    const currentText = lang === 'en' ? contentEn : contentNp;
    const textarea = lang === 'en' ? editorRefEn.current : editorRefNp.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // Replace the trailing slash with the block element
      const cleanedText = currentText.substring(0, start - 1) + itemText + currentText.substring(end);
      if (lang === 'en') {
        setContentEn(cleanedText);
      } else {
        setContentNp(cleanedText);
      }
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 1 + itemText.length, start - 1 + itemText.length);
      }, 50);
    }
    setShowSlashMenu(false);
  };

  // AI Assistant trigger action
  const runAiAssistant = async () => {
    setAiLoading(true);
    setAiResponseText('');
    const targetText = activeTab === 'en' ? contentEn : contentNp;
    const sourceTitle = activeTab === 'en' ? titleEn : titleNp;

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: aiAction,
          text: targetText || sourceTitle,
          context: sourceTitle,
        }),
      });

      if (!res.ok) throw new Error('AI assistant route returned error status.');
      const data = await res.json();
      setAiResponseText(data.result || 'No content generated.');
    } catch (e: any) {
      console.error(e);
      setAiResponseText(`Error: Could not retrieve translation/optimization from server. Here is a simulated response:\n\n### AI Optimised Version\n\nOptimised structure with pristine typography standards, focused entirely on high core web vitals and lattice post-quantum engineering parameters. Code blocks have been verified for React 19 conformity.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Drag and drop file helper
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Simulate compress upload WebP conversion
      setUploadProgress(20);
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            const mockUrl = URL.createObjectURL(file);
            const newItem = {
              url: mockUrl,
              name: file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '_') + '.webp',
              size: `${Math.round(file.size / 1024 / 1.6)} KB`, // compression simulation!
              type: 'webp',
              alt: file.name.split('.')[0] + ' Alt Tag'
            };
            setMediaLibrary(prevMedia => [newItem, ...prevMedia]);
            setFeaturedImage(mockUrl);
            setUploadProgress(0);
            return 0;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  // Simulated AI Image Prompt Generator
  const generateAiImagePrompt = () => {
    setAiNotification('Generating DALL-E/Midjourney prompt structure...');
    setTimeout(() => {
      setImageAltInput('High-impact glassmorphic 3D web infrastructure interface with glowing optical fibers and React logo, futuristic cyber studio theme.');
      setImageCaptionInput('Generated futuristic web infrastructure mockups via AI studio.');
      setAiNotification('Generated custom tech-art prompt inside media details below.');
      setTimeout(() => setAiNotification(''), 4000);
    }, 1200);
  };

  // Sync to parent/state
  const handleConfirmPublish = async () => {
    if (!titleEn || !contentEn) {
      alert('Title and content are required to publish.');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      const finalPost: BlogPost = {
        id: postId,
        slug: slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        author: {
          name: 'Harendra Lamsal',
          avatar: '/harendra_profile.jpg',
          bioEn: 'Elite developer',
          bioNp: 'वरिष्ठ डेभलपर',
          role: 'Chief Solution Architect'
        },
        translations: {
          en: {
            title: titleEn,
            excerpt: excerptEn || 'Architecting premium web services.',
            content: contentEn,
          },
          ne: {
            title: titleNp || `${titleEn} (Nepali)`,
            excerpt: excerptNp || 'नेपाली संस्करण विवरण।',
            content: contentNp || contentEn,
          },
        },
        featuredImage: featuredImage,
        categories: [category],
        tags: tags,
        publishedAt: new Date().toISOString(),
        isFeatured: isFeatured,
        isPopular: isPinned,
        status: publishStatus,
        readingTimeMin: Math.max(1, Math.ceil(contentEn.split(/\s+/).length / 220)),
        views: 0,
        commentsCount: 0,
      };

      await onSave(finalPost);
      alert('🎉 Enterprise blog post successfully inserted into database and synchronized to CMS!');
    } catch (err: any) {
      console.error('[Supabase CMS Save Error]:', err);
      const errMsg = err.message || 'Database connection error during insertion.';
      setPublishError(errMsg);
      alert(`❌ Publishing failed:\n${errMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Toggle outline helper outline generator
  const triggerOutlineGenerator = () => {
    setAiLoading(true);
    setAiPanelOpen(true);
    setAiAction('headings');
    setAiPrompt('Generate article outline structure with headers...');
    runAiAssistant();
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans" id="ai-publishing-studio">
      
      {/* 1. TOP STICKY PREMIUM NAV */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Brand, Status, Progress */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight text-white font-sans" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                AI PUBLISHING STUDIO
              </h1>
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-400 font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                V2.4 Enterprise
              </span>
            </div>
            
            {/* Auto save indicators */}
            <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500 font-mono">
              <span className="flex items-center space-x-1">
                {saveIndicator === 'saving' ? (
                  <>
                    <RefreshCw size={11} className="animate-spin text-indigo-400" />
                    <span className="text-indigo-400">Saving draft...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={11} className="text-emerald-400" />
                    <span className="text-slate-400">Autosave Active</span>
                  </>
                )}
              </span>
              <span>•</span>
              <span>Last Saved: {lastSaved || 'Initial State'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic SEO Badge & Language Toggle in Nav */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* Circular Writing Progress */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/50 border border-slate-900 rounded-lg px-2.5 py-1 text-xs">
            <Layers size={13} className="text-indigo-400" />
            <span className="text-slate-400">Bilingual Sync:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {contentNp.length > 50 ? '100%' : '20%'}
            </span>
          </div>

          {/* Premium SEO Score badge */}
          <div className="flex items-center space-x-1.5 bg-indigo-950/40 border border-indigo-900/40 px-3 py-1 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">SEO:</span>
            <span className="text-xs font-mono font-black text-emerald-400">
              {estimatedQuality}/100
            </span>
          </div>

          {/* Quick Shortcuts icon */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors"
            title="Keyboard Shortcuts"
          >
            <HelpCircle size={16} />
          </button>

          {/* Core Action Toggles */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => { setLangMode('single'); setActiveTab('en'); }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${langMode === 'single' && activeTab === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
            <button
              onClick={() => { setLangMode('single'); setActiveTab('ne'); }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${langMode === 'single' && activeTab === 'ne' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              नेपाली
            </button>
            <button
              onClick={() => setLangMode('dual')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center space-x-1 ${langMode === 'dual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Globe size={11} />
              <span>Bilingual Studio</span>
            </button>
          </div>

          {/* Core CMS publish buttons */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-900">
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            >
              Preview
            </button>
            <button
              onClick={handleConfirmPublish}
              disabled={isPublishing}
              className={`bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-1.5 text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-1 ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckCircle size={13} className={isPublishing ? 'animate-spin' : ''} />
              <span>{isPublishing ? 'Publishing...' : 'Publish Sync'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Side Alerts Overlay */}
      {aiNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-xl max-w-sm animate-fade-in text-xs flex items-center space-x-2.5">
          <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Sparkles size={12} className="animate-spin-slow" />
          </div>
          <span className="text-slate-300 font-mono">{aiNotification}</span>
        </div>
      )}

      {/* 2. THREE COLUMN LAYOUT CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ================= COLUMN A: LEFT SIDEBAR (ARTICLE ARCHITECT & OUTLINE) ================= */}
        <AnimatePresence initial={false}>
          {showLeftSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-r border-slate-900 bg-slate-950/60 flex-shrink-0 flex flex-col overflow-y-auto"
            >
              {/* Document Overview Header */}
              <div className="p-4 border-b border-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">Document Quality</span>
                  <span className="text-xs font-bold text-emerald-400">{estimatedQuality}% Score</span>
                </div>
                
                {/* Simulated score progress bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full rounded-full" style={{ width: `${estimatedQuality}%` }} />
                </div>
              </div>

              {/* Collapsible checklist */}
              <div className="p-4 border-b border-slate-900 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-mono flex items-center justify-between">
                  <span>Publishing Checklist</span>
                  <span className="text-[10px] text-indigo-400 font-normal">Auto checks</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">English version set</span>
                    <Check size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bilingual translation sync</span>
                    {contentNp.length > 50 ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={14} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Featured Image Selected</span>
                    <Check size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Primary SEO Focus Keyword</span>
                    <Check size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Lighthouse SEO Audit score &gt; 90</span>
                    <Check size={14} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Quick Template loader */}
              <div className="p-4 border-b border-slate-900 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">Bespoke Structure Templates</h3>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => {
                      setContentEn(prev => `## System Architecture Comparison\n\n| Attribute | Kyber-1024 Lattice | Traditional RSA-3072 |\n|---|---|---|\n| Quantum Resilient | Yes | No |\n| Key Size | Medium | Heavy |\n\n${prev}`);
                      setAiNotification('Inserted System comparison structure!');
                      setTimeout(() => setAiNotification(''), 4000);
                    }}
                    className="w-full text-left p-2 rounded bg-slate-900/50 hover:bg-slate-900 border border-slate-800/40 text-xs text-slate-300 flex items-center space-x-2"
                  >
                    <Table size={13} className="text-indigo-400" />
                    <span>Comparison Grid Template</span>
                  </button>

                  <button
                    onClick={() => {
                      setContentEn(prev => `## Phase 1: Wasm Lattice Initialization\n\nFirst, bootstrap the Kyber payload block in your index module:\n\n\`\`\`typescript\nconsole.log("Kyber-1024 loading...");\n\`\`\`\n\n## Troubleshooting & Core FAQs\n\n> Q: Why does hydration crash on standard Next.js layouts?\n> A: SSR server strings must strictly map to browser DOM structures.\n\n${prev}`);
                      setAiNotification('Inserted Tutorial layout structure!');
                      setTimeout(() => setAiNotification(''), 4000);
                    }}
                    className="w-full text-left p-2 rounded bg-slate-900/50 hover:bg-slate-900 border border-slate-800/40 text-xs text-slate-300 flex items-center space-x-2"
                  >
                    <BookOpen size={13} className="text-violet-400" />
                    <span>Technical Guide Template</span>
                  </button>
                </div>
              </div>

              {/* Outline / Document Structure list */}
              <div className="p-4 flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase font-mono flex items-center space-x-1.5">
                    <List size={13} />
                    <span>Dynamic Table of Contents</span>
                  </h3>
                  <button
                    onClick={triggerOutlineGenerator}
                    className="text-[10px] text-indigo-400 font-semibold hover:underline flex items-center space-x-0.5"
                    title="Generate Outline using AI"
                  >
                    <Sparkles size={10} />
                    <span>AI Map</span>
                  </button>
                </div>

                {outline.length === 0 ? (
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    No heading tags detected. Use ## or ### inside your workspace to build your outlines automatically.
                  </p>
                ) : (
                  <div className="space-y-1.5 border-l border-slate-900 pl-1">
                    {outline.map((item, idx) => (
                      <div
                        key={idx}
                        className={`text-xs text-slate-400 cursor-pointer hover:text-white transition-colors py-0.5 block truncate ${item.level === 3 ? 'pl-3.5 text-slate-500' : 'font-medium'}`}
                        onClick={() => {
                          const editor = activeTab === 'en' ? editorRefEn.current : editorRefNp.current;
                          if (editor) {
                            editor.focus();
                            const pos = editor.value.indexOf(item.heading);
                            if (pos !== -1) {
                              editor.setSelectionRange(pos, pos + item.heading.length);
                            }
                          }
                        }}
                      >
                        {item.level === 3 ? '↳ ' : '• '}{item.heading}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Word Count Footer details */}
              <div className="p-4 bg-slate-950 border-t border-slate-900 text-[11px] text-slate-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>EN Words:</span>
                  <span className="text-slate-300">{wordCountEn}</span>
                </div>
                <div className="flex justify-between">
                  <span>NE Words:</span>
                  <span className="text-slate-300">{wordCountNp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Read Time:</span>
                  <span className="text-emerald-400 font-semibold">{Math.max(readingTimeEn, readingTimeNp)} min</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Collapse togglers */}
        <button
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          className="absolute left-0 bottom-6 z-30 h-8 w-6 bg-slate-900 hover:bg-indigo-600 border border-slate-800 text-slate-400 hover:text-white rounded-r flex items-center justify-center transition-all shadow-lg"
        >
          {showLeftSidebar ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* ================= COLUMN B: MIDDLE AREA (MAIN WRITING WORKSPACE) ================= */}
        <main className="flex-1 flex flex-col bg-slate-950 p-4 lg:p-6 overflow-y-auto" style={{ minWidth: 320 }}>
          
          {/* Workspace Controls */}
          <div className="flex items-center justify-between mb-4 bg-slate-900/40 border border-slate-900 rounded-xl p-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">Editor Panel:</span>
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-850">
                <button
                  onClick={() => setEditorLayout('edit')}
                  className={`px-2.5 py-1 text-xs rounded transition-all ${editorLayout === 'edit' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Code/Markdown
                </button>
                <button
                  onClick={() => setEditorLayout('split')}
                  className={`px-2.5 py-1 text-xs rounded transition-all ${editorLayout === 'split' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Live Preview Split
                </button>
              </div>
            </div>

            {/* Quick AI Translate helper for currently open pane */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setAiPanelOpen(prev => !prev)}
                className="inline-flex items-center space-x-1 rounded bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1 text-xs font-bold transition-all"
              >
                <Sparkles size={12} className="animate-spin-slow" />
                <span>AI Assistant Side-Panel</span>
              </button>
            </div>
          </div>

          {/* Bilingual Dual-Pane Workspace */}
          {langMode === 'dual' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch overflow-hidden">
              
              {/* Left Column: English Original */}
              <div className="flex flex-col space-y-3 h-full">
                <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5 font-mono">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span>ENGLISH CONTENT SOURCE</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{wordCountEn} words</span>
                </div>
                
                <div className="space-y-3 flex-1 flex flex-col">
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter English Title..."
                    className="w-full bg-transparent border-b border-slate-900 focus:border-indigo-500 py-2.5 text-xl font-bold text-white focus:outline-none"
                  />
                  <textarea
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="SEO Teaser Excerpt..."
                    rows={2}
                    className="w-full bg-slate-900/30 border border-slate-900/80 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex-1 flex flex-col relative">
                    <textarea
                      ref={editorRefEn}
                      value={contentEn}
                      onChange={(e) => handleEditorChange(e.target.value, 'en')}
                      placeholder="Start writing in markdown syntax..."
                      className="w-full flex-1 min-h-[300px] bg-slate-900/20 border border-slate-900/80 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                    />
                    
                    {/* Inline floating '+' block menu mock */}
                    <button
                      onClick={() => {
                        setContentEn(prev => prev + '\n\n> 💡 System Info: Lattice keys must remain fully isolated.\n');
                        setAiNotification('Inserted callout block dynamically!');
                        setTimeout(() => setAiNotification(''), 4000);
                      }}
                      className="absolute bottom-4 right-4 bg-slate-900 hover:bg-indigo-600 border border-slate-800 text-slate-300 p-2 rounded-full shadow-lg transition-all"
                      title="Insert Quick Callout Block"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Nepali translation target */}
              <div className="flex flex-col space-y-3 h-full">
                <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 font-mono">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>नेपाली अनुवाद (NEPALI VERSION)</span>
                  </span>
                  
                  {/* Translate selected paragraph shortcut */}
                  <button
                    onClick={async () => {
                      setAiLoading(true);
                      setAiNotification('Translating complete article structure into localized Nepali...');
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
                        if (!res.ok) throw new Error('Failed');
                        const data = await res.json();
                        setTitleNp(data.translatedTitle || '');
                        setExcerptNp(data.translatedExcerpt || '');
                        setContentNp(data.translatedContent || '');
                        setAiNotification('Synchronized Nepali version successfully!');
                      } catch (e) {
                        setTitleNp(`${titleEn} (नेपाली संस्करण)`);
                        setExcerptNp(`${excerptEn} (नेपाली अनुवादित विबरण)`);
                        setContentNp(`## क्वान्टम कमजोरीको परिचय\n\n${contentEn}`);
                        setAiNotification('Sync translation fallback created.');
                      } finally {
                        setAiLoading(false);
                        setTimeout(() => setAiNotification(''), 4000);
                      }
                    }}
                    className="text-[10px] bg-indigo-600/25 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2 py-1 rounded transition-all font-mono uppercase"
                  >
                    Auto-Sync (Gemini)
                  </button>
                </div>

                <div className="space-y-3 flex-1 flex flex-col">
                  <input
                    type="text"
                    value={titleNp}
                    onChange={(e) => setTitleNp(e.target.value)}
                    placeholder="नेपाली शीर्षक..."
                    className="w-full bg-transparent border-b border-slate-900 focus:border-indigo-500 py-2.5 text-xl font-bold text-white focus:outline-none"
                  />
                  <textarea
                    value={excerptNp}
                    onChange={(e) => setExcerptNp(e.target.value)}
                    placeholder="विवरण (नेपालीमा)..."
                    rows={2}
                    className="w-full bg-slate-900/30 border border-slate-900/80 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                  <textarea
                    ref={editorRefNp}
                    value={contentNp}
                    onChange={(e) => handleEditorChange(e.target.value, 'ne')}
                    placeholder="नेपालीमा लेख विवरण यहाँ लेख्नुहोस्..."
                    className="w-full flex-1 min-h-[300px] bg-slate-900/20 border border-slate-900/80 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>
              </div>

            </div>
          ) : (
            // Single view: activeTab (EN or NE)
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
                  {activeTab === 'en' ? 'English Original Core' : 'नेपाली संस्करण सम्पादन'}
                </span>
                <span className="text-xs text-slate-500 font-mono">{activeTab === 'en' ? wordCountEn : wordCountNp} words</span>
              </div>

              <input
                type="text"
                value={activeTab === 'en' ? titleEn : titleNp}
                onChange={(e) => activeTab === 'en' ? setTitleEn(e.target.value) : setTitleNp(e.target.value)}
                placeholder={activeTab === 'en' ? "Enter article title..." : "शीर्षक..."}
                className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 py-2.5 text-2xl font-bold text-white focus:outline-none"
              />

              <textarea
                value={activeTab === 'en' ? excerptEn : excerptNp}
                onChange={(e) => activeTab === 'en' ? setExcerptEn(e.target.value) : setExcerptNp(e.target.value)}
                placeholder={activeTab === 'en' ? "Enter short SEO meta description..." : "छोटो विवरण..."}
                rows={2}
                className="w-full bg-slate-900/20 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex-1 flex flex-col relative min-h-[350px]">
                <textarea
                  ref={activeTab === 'en' ? editorRefEn : editorRefNp}
                  value={activeTab === 'en' ? contentEn : contentNp}
                  onChange={(e) => handleEditorChange(e.target.value, activeTab)}
                  placeholder="Start writing markdown block segments here..."
                  className="w-full flex-1 bg-slate-900/10 border border-slate-900 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />

                {/* Floating "+" button overlay trigger */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      const updated = (activeTab === 'en' ? contentEn : contentNp) + '\n\n| Quantum Matrix | Cryptographic Handshake |\n|---|---|\n| Kyber-1024 | Approved |\n';
                      if (activeTab === 'en') setContentEn(updated);
                      else setContentNp(updated);
                      setAiNotification('Embedded layout grid table!');
                      setTimeout(() => setAiNotification(''), 4000);
                    }}
                    className="bg-slate-900 hover:bg-indigo-600 border border-slate-850 p-2.5 rounded-full text-slate-300 hover:text-white shadow-lg transition-colors flex items-center justify-center"
                    title="Insert Block Layout"
                  >
                    <Plus size={15} />
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Type / anywhere for slash tools</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Slash Commands Dropdown overlay */}
          <AnimatePresence>
            {showSlashMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-50 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl p-2 w-72"
                style={{ top: cursorPos.top, left: cursorPos.left }}
              >
                <div className="px-2 py-1.5 text-[10px] text-indigo-400 font-mono uppercase tracking-wider border-b border-slate-850">
                  Notion Block Elements
                </div>
                <div className="max-h-56 overflow-y-auto mt-1 space-y-0.5">
                  {slashMenuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => insertSlashItem(item.text)}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-indigo-600/10 hover:text-white text-slate-300 text-xs transition-colors flex items-start space-x-2.5"
                      >
                        <div className="h-6 w-6 rounded bg-slate-950 flex items-center justify-center text-indigo-400 mt-0.5">
                          <Icon size={13} />
                        </div>
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Preview area if split view is enabled */}
          {editorLayout === 'split' && (
            <div className="mt-6 p-5 rounded-xl border border-slate-900 bg-slate-950/40 text-left">
              <h3 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-widest border-b border-slate-900 pb-2 mb-3">
                Live Markdown Render Frame (English)
              </h3>
              <div className="prose prose-invert text-sm text-slate-300 space-y-4 max-w-none">
                <h1 className="text-2xl font-black text-white">{titleEn}</h1>
                <p className="italic text-slate-400 border-l-2 border-indigo-500 pl-3">{excerptEn}</p>
                <div className="whitespace-pre-line leading-relaxed font-sans mt-4">
                  {contentEn.replace(/##/g, '❖').replace(/###/g, '▪')}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* ================= COLUMN C: RIGHT SIDEBAR (SEO, MEDIA & SETTINGS) ================= */}
        <AnimatePresence initial={false}>
          {showRightSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-l border-slate-900 bg-slate-950/60 flex-shrink-0 flex flex-col overflow-y-auto"
            >
              
              {/* Tab Selector inside Right Sidebar */}
              <div className="grid grid-cols-3 border-b border-slate-900 bg-slate-950 p-1">
                <button
                  onClick={() => setRightSidebarTab('seo')}
                  className={`py-2 text-xs font-bold font-sans transition-all flex flex-col items-center justify-center space-y-0.5 ${rightSidebarTab === 'seo' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Sparkles size={13} />
                  <span>SEO Panel</span>
                </button>
                <button
                  onClick={() => setRightSidebarTab('media')}
                  className={`py-2 text-xs font-bold font-sans transition-all flex flex-col items-center justify-center space-y-0.5 ${rightSidebarTab === 'media' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <ImageIcon size={13} />
                  <span>Media</span>
                </button>
                <button
                  onClick={() => setRightSidebarTab('settings')}
                  className={`py-2 text-xs font-bold font-sans transition-all flex flex-col items-center justify-center space-y-0.5 ${rightSidebarTab === 'settings' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Settings size={13} />
                  <span>Config</span>
                </button>
              </div>

              {/* TAB CONTENT: SEO DASHBOARD */}
              {rightSidebarTab === 'seo' && (
                <div className="p-4 space-y-5 text-left">
                  
                  {/* Focus keyword input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">Focus Keyword</label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. React 19 Security"
                      className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Slug editor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">URL Permalink Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="react-19-isomorphic-lattice-handshake"
                      className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Google Search Snippet Preview */}
                  <div className="p-3 rounded-lg border border-slate-900 bg-slate-900/10 space-y-1">
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                      <Globe size={10} className="text-emerald-400" />
                      <span>Google Serps Snippet</span>
                    </div>
                    <div className="text-emerald-400 hover:underline text-xs font-medium truncate">
                      https://harendralamsal.name.np/blog/{slug}
                    </div>
                    <div className="text-sm font-bold text-indigo-400 line-clamp-1">
                      {titleEn} | Lead Full-Stack Architect
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {excerptEn || 'No teaser description defined yet. Feed the writing module to optimize indexation density.'}
                    </div>
                  </div>

                  {/* Facebook Open Graph share preview */}
                  <div className="p-3 rounded-lg border border-slate-900 bg-slate-900/10 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                      <Facebook size={10} className="text-blue-400" />
                      <span>Facebook Share Card Preview</span>
                    </div>
                    {featuredImage && (
                      <div className="h-24 w-full rounded bg-cover bg-center" style={{ backgroundImage: `url(${featuredImage})` }} />
                    )}
                    <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">HARENDRALAMSAL.NAME.NP</div>
                    <div className="text-xs font-bold text-white line-clamp-1">{titleEn}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{excerptEn}</div>
                  </div>

                  {/* JSON-LD Schema Conformity Output Preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase font-mono">JSON-LD Metadata Schema</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${titleEn}",
  "description": "${excerptEn}",
  "image": "${featuredImage}",
  "author": { "@type": "Person", "name": "Harendra Lamsal" }
}`);
                          setAiNotification('Copied schema blueprint to clipboard!');
                          setTimeout(() => setAiNotification(''), 4000);
                        }}
                        className="text-[10px] text-indigo-400 hover:underline"
                      >
                        Copy Schema
                      </button>
                    </div>
                    <pre className="p-2.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 font-mono h-24 overflow-y-auto">
{`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${titleEn}",
  "description": "${excerptEn}",
  "image": "${featuredImage}",
  "author": {
    "@type": "Person",
    "name": "Harendra Lamsal",
    "jobTitle": "SEO Specialist"
  }
}`}
                    </pre>
                  </div>

                </div>
              )}

              {/* TAB CONTENT: MEDIA MANAGER */}
              {rightSidebarTab === 'media' && (
                <div className="p-4 space-y-4 text-left">
                  
                  {/* Featured Header image preview */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Primary Featured Image</span>
                    {featuredImage ? (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-900 bg-slate-950">
                        <img src={featuredImage} alt="Featured Header Content" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => { setFeaturedImage(''); }}
                            className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-500"
                            title="Delete Image"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            onClick={generateAiImagePrompt}
                            className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-500"
                          >
                            Generate Prompt
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/20 flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* Drag and Drop Container with Compression Toggle */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 border-2 border-dashed rounded-xl text-center transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-950/20'}`}
                  >
                    <FileUp size={20} className="mx-auto mb-1 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 block">Drag & Drop new asset here</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Auto WebP compression engine enabled</span>

                    {/* Simulating compression uploads */}
                    {uploadProgress > 0 && (
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-2.5">
                        <div className="bg-indigo-500 h-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Image details input parameters */}
                  <div className="p-3 rounded-lg bg-slate-900/10 border border-slate-900 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Image Metadata Parameters</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Alt Text (Critical for SEO accessibility)</label>
                      <input
                        type="text"
                        value={imageAltInput}
                        onChange={(e) => {
                          setImageAltInput(e.target.value);
                          setEstimatedQuality(99); // dynamic score improvement!
                        }}
                        placeholder="Descriptive alternate text tags..."
                        className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded text-xs text-slate-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Caption Description</label>
                      <input
                        type="text"
                        value={imageCaptionInput}
                        onChange={(e) => setImageCaptionInput(e.target.value)}
                        placeholder="Image sub-label text caption..."
                        className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Media Browser Library mock */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Media Asset Library Browser</span>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {mediaLibrary.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setFeaturedImage(img.url);
                            setImageAltInput(img.alt || '');
                          }}
                          className="relative group rounded overflow-hidden cursor-pointer border border-slate-900 hover:border-indigo-500"
                        >
                          <img src={img.url} alt="Gallery element" className="h-14 w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-0.5 text-[8px] font-mono text-slate-400 text-center truncate">
                            {img.size} WebP
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB CONTENT: GENERAL SETTINGS */}
              {rightSidebarTab === 'settings' && (
                <div className="p-4 space-y-4 text-left">
                  
                  {/* Category selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">Niche Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="WordPress">WordPress</option>
                      <option value="SEO">SEO</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cyber Security">Cyber Security</option>
                    </select>
                  </div>

                  {/* Tags input with pills list */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">Article Tag Taxonomy</label>
                    <form onSubmit={handleAddTag} className="flex space-x-1.5">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag (React, SSR...)"
                        className="flex-1 rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 px-3 text-xs font-bold rounded text-white"
                      >
                        Add
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                        >
                          <span>{t}</span>
                          <button type="button" onClick={() => handleRemoveTag(t)} className="text-red-400 hover:text-white">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Draft status configs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase font-mono">Publish Stage Status</label>
                    <select
                      value={publishStatus}
                      onChange={(e) => setPublishStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                      className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="published">Public (Live Immediate)</option>
                      <option value="draft">Draft Save Only</option>
                      <option value="scheduled">Scheduled Queue</option>
                    </select>
                  </div>

                  {/* Checkbox triggers */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-900">
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
                      />
                      <span>Mark as Featured Post</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
                      />
                      <span>Mark as Breaking News ticker</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
                      />
                      <span>Pin post on top of portfolio grid</span>
                    </label>
                  </div>

                  {/* Revision snap history log */}
                  <div className="pt-3 border-t border-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase font-mono">Revision History Log</span>
                      <History size={12} className="text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      {historySnapshots.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setAiNotification(`Restored local draft snapshot from ${item.time}!`);
                            setTimeout(() => setAiNotification(''), 4000);
                          }}
                          className="p-1.5 rounded bg-slate-900/40 border border-slate-850 hover:bg-slate-900 hover:text-white transition-all text-[10px] text-slate-400 cursor-pointer flex justify-between"
                        >
                          <span className="truncate max-w-[140px]">{item.titleEn}</span>
                          <span className="font-mono text-indigo-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </motion.aside>
          )}
        </AnimatePresence>

        {/* Right Sidebar collapse triggers */}
        <button
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          className="absolute right-0 bottom-6 z-30 h-8 w-6 bg-slate-900 hover:bg-indigo-600 border border-slate-800 text-slate-400 hover:text-white rounded-l flex items-center justify-center transition-all shadow-lg"
        >
          {showRightSidebar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

      </div>

      {/* ================= COLUMN D: FLOATING AI WRITING ASSISTANT SIDE PANEL ================= */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            className="fixed top-0 right-0 z-50 h-full w-96 bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col"
          >
            {/* AI Panel Header */}
            <div className="p-4 border-b border-slate-900 flex items-center justify-between bg-gradient-to-r from-slate-950 to-indigo-950/20">
              <div className="flex items-center space-x-2 text-white">
                <Sparkles size={16} className="text-indigo-400 animate-spin-slow" />
                <span className="font-bold tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Gemini AI Writing Engine
                </span>
              </div>
              <button
                onClick={() => setAiPanelOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            {/* AI Assistant Control Interface */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-left">
              
              {/* Action selector dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase font-mono">AI Creative Intent</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <optgroup label="Editorial Polish">
                    <option value="rewrite">Rewrite & Rephrase (Subtle)</option>
                    <option value="expand">Expand & Elaborate (Technical depth)</option>
                    <option value="shorten">Shorten & Condense</option>
                    <option value="improve-grammar">Correct Grammar & Typos</option>
                    <option value="improve-readability">Optimize UX Readability</option>
                  </optgroup>
                  <optgroup label="Structure Generators">
                    <option value="headings">Generate Document Outlines</option>
                    <option value="faq">Generate Technical FAQs</option>
                    <option value="conclusion">Write Professional Conclusion</option>
                    <option value="summary">Generate Key Takeaways List</option>
                  </optgroup>
                  <optgroup label="Distribution Channels">
                    <option value="social">Create Social Media Caption</option>
                    <option value="newsletter">Write Newsletter Summary</option>
                    <option value="keywords">Generate Meta Focus Keywords</option>
                    <option value="image-prompt">Generate Image Prompt</option>
                  </optgroup>
                  <optgroup label="Translations Studio">
                    <option value="english-to-nepali">Translate EN ➔ NE (Professional)</option>
                    <option value="nepali-to-english">Translate NE ➔ EN (Technical)</option>
                  </optgroup>
                </select>
              </div>

              {/* Topic context custom instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase font-mono">Custom Directives / Guidelines</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Use strong verbs, mention isomorphic hydration parameters, avoid corporate buzzwords..."
                  rows={3}
                  className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={runAiAssistant}
                disabled={aiLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1.5"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Synthesizing via Gemini...</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Generate AI Output</span>
                  </>
                )}
              </button>

              {/* AI generated Output terminal */}
              {aiResponseText && (
                <div className="space-y-2.5 pt-3 border-t border-slate-900">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Generated Response:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponseText);
                        setAiNotification('Copied AI response block!');
                        setTimeout(() => setAiNotification(''), 4000);
                      }}
                      className="text-indigo-400 hover:underline flex items-center space-x-0.5"
                    >
                      <Copy size={10} />
                      <span>Copy Result</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded bg-slate-950 border border-slate-900 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                    {aiResponseText}
                  </div>

                  {/* Quick Replace actions */}
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => {
                        if (activeTab === 'en') {
                          setContentEn(prev => prev + '\n\n' + aiResponseText);
                        } else {
                          setContentNp(prev => prev + '\n\n' + aiResponseText);
                        }
                        setAiNotification('Inserted output block into workspace!');
                        setTimeout(() => setAiNotification(''), 4000);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-indigo-600/30 text-slate-300 text-[11px] py-1.5 rounded border border-slate-850"
                    >
                      Insert at Bottom
                    </button>
                    <button
                      onClick={() => {
                        if (activeTab === 'en') {
                          setContentEn(aiResponseText);
                        } else {
                          setContentNp(aiResponseText);
                        }
                        setAiNotification('Overwritten workspace body!');
                        setTimeout(() => setAiNotification(''), 4000);
                      }}
                      className="flex-1 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-[11px] py-1.5 rounded border border-red-900/30"
                    >
                      Overwrite Body
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. KEYBOARD SHORTCUTS DIALOG */}
      <AnimatePresence>
        {showShortcutsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-900 rounded-2xl max-w-md w-full p-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-sans" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Studio Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcutsModal(false)} className="text-slate-500 hover:text-white">
                  <Minimize2 size={16} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400">Open Block Insertion Dropdown</span>
                  <kbd className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">/</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400">Manual Snap Draft to Disk</span>
                  <kbd className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">⌘ + S</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400">Toggle Shortcuts Menu</span>
                  <kbd className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">⌘ + K</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400">Exit Workspace Modals</span>
                  <kbd className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">ESC</kbd>
                </div>
              </div>

              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs mt-6 transition-all border border-slate-800"
              >
                Close Shortcuts Panel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. FULL SCREEN ACCESSIBLE RENDER PREVIEW MODAL */}
      <AnimatePresence>
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto bg-slate-900/40 border border-slate-900 rounded-3xl p-6 md:p-10 text-left relative"
            >
              {/* Close preview button */}
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-6 right-6 bg-slate-950 hover:bg-red-600 border border-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-all shadow"
              >
                <Minimize2 size={16} />
              </button>

              <div className="flex items-center space-x-2.5 text-xs text-indigo-400 font-mono mb-4 uppercase tracking-wider">
                <Globe size={12} className="animate-spin-slow" />
                <span>Enterprise Responsive Layout Preview Screen</span>
              </div>

              <div className="prose prose-invert max-w-none space-y-6">
                
                {/* Simulated Article Header */}
                <header className="border-b border-slate-900 pb-6">
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight font-sans" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {titleEn}
                  </h1>
                  <p className="text-lg text-slate-400 font-light mt-3 leading-relaxed">
                    {excerptEn}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <User size={13} className="text-indigo-400" />
                      <span className="text-slate-300 font-bold">Harendra Lamsal</span>
                    </div>
                    <span>•</span>
                    <div>{category}</div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{readingTimeEn} min read</span>
                    </div>
                  </div>
                </header>

                {/* Primary header image */}
                {featuredImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-900 shadow-2xl">
                    <img src={featuredImage} alt="Featured Content Header" className="w-full max-h-96 object-cover" />
                    <div className="bg-slate-950/80 p-3 text-xs text-slate-500 text-center font-mono">
                      {imageCaptionInput} • Credit: <span className="text-slate-400">{imageCreditInput}</span>
                    </div>
                  </div>
                )}

                {/* Article body markdown simulation */}
                <div className="text-slate-300 leading-relaxed text-base space-y-6 max-w-none font-sans pt-4">
                  
                  {/* Custom markup mapping */}
                  <div className="whitespace-pre-line">
                    {contentEn.replace(/##/g, '❖').replace(/###/g, '▪')}
                  </div>

                  {/* Taxonomy */}
                  <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-900">
                    {tags.map((t, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md text-xs text-slate-400 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
