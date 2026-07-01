/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, DollarSign, 
  Languages, Maximize2, Minimize2, Briefcase, 
  User, Check, ChevronRight, HelpCircle, ArrowRight
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isNegotiating?: boolean;
}

interface AiAssistantChatProps {
  lang: 'en' | 'ne';
}

export default function AiAssistantChat({ lang }: AiAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNegotiationHelper, setShowNegotiationHelper] = useState(false);
  const [negotiationForm, setNegotiationForm] = useState({
    projectType: 'WordPress Website',
    budget: '',
    duration: 'Flexible',
    details: '',
    leverage: [] as string[]
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations
  useEffect(() => {
    const saved = localStorage.getItem('harendra_assistant_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        initDefaultMessage();
      }
    } else {
      initDefaultMessage();
    }
  }, [lang]);

  const initDefaultMessage = () => {
    const defaultMsg: Message = {
      role: 'assistant',
      content: lang === 'ne' 
        ? `नमस्ते! म औरा (Aura), हरेन्द्र लाम्सालको व्यक्तिगत एआई प्रतिनिधि। उहाँ अहिले क्लाइन्टहरूका लागि उच्च-स्तरीय वेभ प्रणाली निर्माणमा व्यस्त हुनुहुन्छ, त्यसैले उहाँको तर्फबाट सेवाहरू बुझाउन, बजेट तय गर्न र विशेष दरहरूमा सम्झौता गर्न म पूर्ण रूपमा सक्षम छु। 

तलका द्रुत विकल्पहरू छनौट गर्नुहोस् वा सिधै लेख्नुहोस्। आज म तपाईंलाई कसरी सहयोग गर्न सक्छु? 🙏✨`
        : `Namaste! I am Aura, Harendra's personal AI Representative. He's currently focused on custom engineering projects, so I am fully authorized to introduce his services, quote rates, or negotiate a custom budget deal with you. 

Feel free to choose a quick topic below or type anything you'd like. How can I assist you today? 🙏✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([defaultMsg]);
  };

  // Save conversation
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('harendra_assistant_chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat-representative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          message: text
        })
      });

      if (!response.ok) {
        let serverError = 'Failed to get response';
        try {
          const errData = await response.json();
          serverError = errData.error || errData.message || serverError;
        } catch (_) {}
        throw new Error(serverError);
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('[Chat Assistant Error]:', error);
      const errorMsg: Message = {
        role: 'assistant',
        content: lang === 'ne'
          ? `माफ गर्नुहोला, समस्या आयो: ${error.message || 'एआई प्रतिनिधि सर्भरसँग सम्पर्क हुन सकेन।'}`
          : `I apologize, but I encountered an issue: ${error.message || 'I am experiencing issues communicating with my core knowledge base.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (topic: string) => {
    let text = '';
    if (topic === 'about') {
      text = lang === 'ne' ? 'हरेन्द्र लाम्सालको बारेमा थप जानकारी दिनुहोस्।' : 'Tell me more about Harendra Lamsal.';
    } else if (topic === 'services') {
      text = lang === 'ne' ? 'हरेन्द्रले प्रदान गर्ने सेवाहरू र तिनको मूल्य कति हो?' : 'What services does Harendra provide and what are his rates?';
    } else if (topic === 'negotiate') {
      setShowNegotiationHelper(true);
      return;
    } else if (topic === 'nepali') {
      text = 'Can we talk in Nepali language? (हामी नेपाली भाषामा कुरा गर्न सक्छौं?)';
    }
    handleSendMessage(text);
  };

  const handleNegotiationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const leverageTexts = negotiationForm.leverage.join(', ');
    const promptText = lang === 'ne'
      ? `म हरेन्द्रसँग नयाँ प्रोजेक्टका लागि बजेट सम्झौता (Negotiation) गर्न चाहन्छु। 
प्रोजेक्ट प्रकार: ${negotiationForm.projectType}
मेरो बजेट: $${negotiationForm.budget} USD
समयसीमा: ${negotiationForm.duration}
प्रोजेक्ट विवरण: ${negotiationForm.details}
मैले प्रदान गर्न सक्ने थप फाइदाहरू: ${leverageTexts || 'कुनै उल्लेख नगरिएको'}

के यो बजेट र सर्तहरूमा काम गर्न सम्भव छ? कृपया विचार गरिदिनुहोला।`
      : `I want to negotiate a project budget with Harendra.
Project Type: ${negotiationForm.projectType}
My Proposed Budget: $${negotiationForm.budget} USD
Timeline Preference: ${negotiationForm.duration}
Project Requirements: ${negotiationForm.details}
Leverages/Benefits offered to Harendra: ${leverageTexts || 'None specified'}

Is it possible to partner on this project under these parameters? Let's make a deal.`;

    setShowNegotiationHelper(false);
    handleSendMessage(promptText);
  };

  const toggleLeverage = (val: string) => {
    setNegotiationForm(prev => {
      const exists = prev.leverage.includes(val);
      return {
        ...prev,
        leverage: exists 
          ? prev.leverage.filter(v => v !== val)
          : [...prev.leverage, val]
      };
    });
  };

  // Safe and clean custom formatter to render styled Markdown messages without unsafe HTML insertions
  const formatMessageText = (txt: string) => {
    if (!txt) return '';
    
    return txt.split('\n').map((line, index) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} className="text-sm font-bold text-slate-100 mt-3 mb-1.5 flex items-center space-x-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>{trimmed.slice(4)}</span>
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="text-sm font-extrabold text-white mt-4 mb-2 border-b border-slate-800 pb-1 font-sans">
            {trimmed.slice(3)}
          </h3>
        );
      }
      
      // Bullets
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const processedText = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <li key={index} className="ml-4 list-disc text-xs text-slate-300 leading-relaxed mb-1">
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          </li>
        );
      }

      // Inline strong tag helper
      const hasStrong = /\*\*(.*?)\*\*/.test(line);
      if (hasStrong) {
        const processedText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <p key={index} className="text-xs text-slate-300 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processedText }} />
        );
      }

      // Check if line is empty
      if (trimmed === '') {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-xs text-slate-300 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  const clearChat = () => {
    if (window.confirm(lang === 'ne' ? 'के तपाईं पुरानो च्याट मेटाउन चाहनुहुन्छ?' : 'Are you sure you want to clear the conversation history?')) {
      localStorage.removeItem('harendra_assistant_chat');
      initDefaultMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left" id="ai-assistant-persistent-layer">
      <AnimatePresence>
        {/* Chat Widget Window */}
        {isOpen && (
          <motion.div
            id="ai-representative-chatbox"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`bg-slate-950/95 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isExpanded 
                ? 'fixed inset-4 md:inset-10 z-[60] w-auto h-auto' 
                : 'w-[360px] md:w-[410px] h-[550px]'
            }`}
          >
            {/* Header section with Harendra's Branding and Glow */}
            <div className="p-4 bg-slate-900 border-b border-slate-800/60 flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-md font-extrabold text-sm tracking-tighter">
                    HA
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75 border-2 border-slate-900" />
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 font-sans">
                    <span>Aura</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-medium border border-indigo-500/20">
                      Harendra's AI Rep
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{lang === 'ne' ? 'उपलब्ध छ • नेपाली / English' : 'Online & Ready to Negotiate'}</span>
                  </p>
                </div>
              </div>

              {/* Window controls */}
              <div className="flex items-center space-x-1 relative z-10">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={isExpanded ? "Minimize" : "Expand to Fullscreen"}
                  aria-label="Toggle Fullscreen"
                >
                  {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800/50 transition-colors text-xs font-mono"
                  title="Clear conversation"
                  aria-label="Clear chat history"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  aria-label="Close Chat Window"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Negotiation Assistant Modal / overlay inside the widget */}
            <AnimatePresence>
              {showNegotiationHelper && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-x-0 top-[73px] bottom-0 bg-slate-950/98 z-40 p-5 overflow-y-auto flex flex-col justify-between"
                >
                  <form onSubmit={handleNegotiationSubmit} className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                        <DollarSign size={14} />
                        <span>{lang === 'ne' ? 'प्रोजेक्ट मूल्य सम्झौता सहायता' : 'Strategic Deal Calculator'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowNegotiationHelper(false)}
                        className="text-slate-500 hover:text-white"
                        aria-label="Close negotiator"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'ne'
                        ? 'हरेन्द्र गुणस्तरीय काममा विश्वास गर्नुहुन्छ। यदि तपाईंको बजेट केही कम छ भने, सम्झौता गर्नका लागि तल विवरणहरू भर्नुहोस्। औराले यसलाई तुरुन्तै मूल्याङ्कन गर्नेछ।'
                        : 'Harendra stands for premium architecture. If your budget is below standard rates, specify benefits or leverage points below to let Aura analyze and craft a customized win-win contract.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Project Type</label>
                        <select
                          value={negotiationForm.projectType}
                          onChange={(e) => setNegotiationForm(prev => ({ ...prev, projectType: e.target.value }))}
                          className="w-full text-xs rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-200 focus:border-indigo-500"
                        >
                          <option>WordPress Website</option>
                          <option>React / Next.js Web App</option>
                          <option>SEO Strategy Campaign</option>
                          <option>Consulting retainer</option>
                          <option>Other / Custom Project</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Your Proposed Budget (USD)</label>
                        <input
                          type="number"
                          value={negotiationForm.budget}
                          onChange={(e) => setNegotiationForm(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="e.g. 1200"
                          required
                          className="w-full text-xs rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-200 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Timeline Preference</label>
                      <select
                        value={negotiationForm.duration}
                        onChange={(e) => setNegotiationForm(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full text-xs rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-200 focus:border-indigo-500"
                      >
                        <option>Flexible (Comfortable timeline)</option>
                        <option>Standard (3 - 5 Weeks)</option>
                        <option>Urgent / Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Project Requirements & Scope</label>
                      <textarea
                        value={negotiationForm.details}
                        onChange={(e) => setNegotiationForm(prev => ({ ...prev, details: e.target.value }))}
                        placeholder={lang === 'ne' ? 'प्रोजेक्टको मुख्य उद्देश्य र आवश्यक सुविधाहरू...' : 'Describe what we are building, features needed, etc...'}
                        required
                        rows={2}
                        className="w-full text-xs rounded border border-slate-800 bg-slate-900 px-2 py-1.5 text-slate-200 focus:border-indigo-500 resize-none"
                      />
                    </div>

                    {/* Leverage points list */}
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Leverage Offered (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'long-term', label: 'Long-term Retainer contract prospect' },
                          { val: 'modern-stack', label: 'Cutting edge modern Tech Stack (Next.js, AI)' },
                          { val: 'portfolio', label: 'High profile / Portfolio showcase allowed' },
                          { val: 'social-good', label: 'Social / Environmental positive cause' },
                          { val: 'flexible-deadline', label: 'Generous timeline (No urgent rushing)' }
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => toggleLeverage(item.label)}
                            className={`p-2 rounded text-[10px] text-left border transition-all flex items-center space-x-1.5 ${
                              negotiationForm.leverage.includes(item.label)
                                ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded flex items-center justify-center border text-[8px] ${
                              negotiationForm.leverage.includes(item.label) 
                                ? 'bg-indigo-500 border-indigo-500 text-white' 
                                : 'border-slate-700'
                            }`}>
                              {negotiationForm.leverage.includes(item.label) && <Check size={8} />}
                            </span>
                            <span className="leading-snug">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 inline-flex items-center justify-center space-x-1.5 rounded bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow shadow-indigo-600/20"
                    >
                      <DollarSign size={14} />
                      <span>{lang === 'ne' ? 'दर प्रस्ताव मूल्याङ्कन गर्नुहोस्' : 'Present Proposal to Aura'}</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-950/40">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                    <span>{msg.role === 'user' ? 'Client' : 'Aura'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-left shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none text-xs font-sans leading-relaxed'
                        : 'bg-slate-900/90 border border-slate-800/40 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-line text-xs">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {formatMessageText(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot is typing dot loading block */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                    <span>Aura is drafting...</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/40 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Suggested Chips */}
            <div className="p-2 border-t border-slate-900 bg-slate-900/30 flex flex-wrap gap-1.5 shrink-0">
              <button
                onClick={() => handleQuickAction('about')}
                className="inline-flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all font-sans"
              >
                <User size={10} className="text-indigo-400" />
                <span>{lang === 'ne' ? 'हरेन्द्रको परिचय' : 'About Harendra'}</span>
              </button>
              
              <button
                onClick={() => handleQuickAction('services')}
                className="inline-flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all font-sans"
              >
                <Briefcase size={10} className="text-rose-400" />
                <span>{lang === 'ne' ? 'सेवाहरू तथा शुल्क' : 'Services & Rates'}</span>
              </button>

              <button
                onClick={() => handleQuickAction('negotiate')}
                className="inline-flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-900/50 hover:border-indigo-500 text-indigo-300 hover:text-white transition-all font-sans"
              >
                <DollarSign size={10} className="text-emerald-400 animate-pulse" />
                <span className="font-bold">{lang === 'ne' ? 'विशेष मूल्य सम्झौता' : 'Negotiate Rates'}</span>
              </button>

              <button
                onClick={() => handleQuickAction('nepali')}
                className="inline-flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all font-sans"
              >
                <Languages size={10} className="text-purple-400" />
                <span>नेपालीमा कुरा गरौं</span>
              </button>
            </div>

            {/* Input form */}
            <div className="p-3 border-t border-slate-900 bg-slate-950 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={lang === 'ne' ? 'यहाँ सोध्नुहोस् वा सम्झौता गर्नुहोस्...' : 'Ask Aura anything about Harendra...'}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-900 disabled:text-slate-600 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent floating trigger badge */}
      <motion.button
        id="ai-assistant-persistent-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        aria-label="Toggle AI Assistant"
      >
        {/* Pulsing visual glow effect */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 blur opacity-40 group-hover:opacity-75 transition duration-200 animate-pulse" />
        
        {/* Interactive icons depending on state */}
        <div className="relative z-10">
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </div>

        {/* Small live notification badge indicator */}
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-bounce" />
      </motion.button>
    </div>
  );
}
