/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, Check, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareMenuProps {
  title: string;
  url: string;
  lang: 'en' | 'ne';
}

export default function ShareMenu({ title, url, lang }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      nepaliName: 'फेसबुक',
      icon: <Facebook size={14} className="text-[#1877F2]" />,
      url: shareLinks.facebook,
      color: 'hover:bg-blue-600/10'
    },
    {
      name: 'WhatsApp',
      nepaliName: 'व्हाट्सएप',
      icon: <MessageSquare size={14} className="text-[#25D366]" />,
      url: shareLinks.whatsapp,
      color: 'hover:bg-emerald-600/10'
    },
    {
      name: 'Twitter / X',
      nepaliName: 'ट्विटर',
      icon: <Twitter size={14} className="text-[#1DA1F2]" />,
      url: shareLinks.twitter,
      color: 'hover:bg-sky-600/10'
    },
    {
      name: 'LinkedIn',
      nepaliName: 'लिंक्डइन',
      icon: <Linkedin size={14} className="text-[#0A66C2]" />,
      url: shareLinks.linkedin,
      color: 'hover:bg-blue-700/10'
    },
    {
      name: 'Telegram',
      nepaliName: 'टेलिग्राम',
      icon: <Send size={14} className="text-[#0088cc]" />,
      url: shareLinks.telegram,
      color: 'hover:bg-sky-500/10'
    }
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef} id="article-share-menu">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
        aria-label="Share options menu"
        aria-expanded={isOpen}
      >
        <Share2 size={13} className="text-indigo-400" />
        <span>{lang === 'ne' ? 'साझा गर्नुहोस्' : 'Share'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-xl z-50 overflow-hidden"
          >
            {/* Header / Title */}
            <div className="px-3 py-2 border-b border-slate-900">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                {lang === 'ne' ? 'साझा गर्ने विकल्पहरू' : 'Share Article'}
              </span>
            </div>

            {/* Platform Options */}
            <div className="py-1.5 space-y-0.5">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white transition-all ${option.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1 rounded-md bg-slate-900 border border-slate-800/60">
                      {option.icon}
                    </span>
                    <span className="font-sans font-medium">
                      {lang === 'ne' ? option.nepaliName : option.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-900 my-1" />

            {/* Copy Link Option */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-indigo-600/10 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <span className="p-1 rounded-md bg-slate-900 border border-slate-800/60">
                  {copied ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Link2 size={14} className="text-indigo-400" />
                  )}
                </span>
                <span className="font-sans font-medium">
                  {copied
                    ? (lang === 'ne' ? 'लिङ्क कपी गरियो!' : 'Copied link!')
                    : (lang === 'ne' ? 'लिङ्क कपी गर्नुहोस्' : 'Copy link')}
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
