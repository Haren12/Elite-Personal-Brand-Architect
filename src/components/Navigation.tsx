/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, Globe, Terminal, ShieldAlert, Award, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';

interface NavigationProps {
  currentView: 'home' | 'blog' | 'news' | 'contact' | 'admin';
  setView: (view: 'home' | 'blog' | 'news' | 'contact' | 'admin') => void;
  lang: 'en' | 'ne';
  setLang: (lang: 'en' | 'ne') => void;
  isAdmin: boolean;
  logoutAdmin: () => void;
}

export default function Navigation({
  currentView,
  setView,
  lang,
  setLang,
  isAdmin,
  logoutAdmin,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', labelEn: 'Home & Portfolio', labelNp: 'गृह र पोर्टफोलियो' },
    { id: 'blog', labelEn: 'Tech Blog', labelNp: 'प्रविधि ब्लग' },
    { id: 'news', labelEn: 'News Portal', labelNp: 'समाचार पोर्टल' },
    { id: 'contact', labelEn: 'Contact Me', labelNp: 'सम्पर्क' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          className="flex cursor-pointer items-center space-x-2.5 text-xl font-bold tracking-tight text-white hover:opacity-90 group"
          onClick={() => { setView('home'); setIsOpen(false); }}
          id="nav-logo"
        >
          <BrandLogo size="md" />
          <span className="font-sans hidden sm:inline-block bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent group-hover:to-indigo-300 transition-all duration-300">
            Harendra Lamsal
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {lang === 'ne' ? item.labelNp : item.labelEn}
            </button>
          ))}
          
          {isAdmin && (
            <button
              id="nav-admin"
              onClick={() => setView('admin')}
              className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === 'admin'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-slate-900'
              }`}
            >
              <Terminal size={14} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right side controls: Language, Quick Admin, Mobile menu */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            id="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'ne' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
            aria-label="Toggle language"
          >
            <Globe size={14} className="text-indigo-400 animate-spin-slow" />
            <span>{lang === 'en' ? 'नेपाली (NE)' : 'English (EN)'}</span>
          </button>

          {/* Quick Admin Toggle (for demonstration of roles, easily clickable) */}
          {!isAdmin ? (
            <button
              id="quick-admin-login"
              onClick={() => setView('admin')}
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-white border border-dashed border-slate-700 hover:border-slate-500 transition-all"
              title="Admin Panel Entry"
            >
              <ShieldAlert size={14} className="text-slate-500" />
              <span>CMS</span>
            </button>
          ) : (
            <button
              id="admin-logout"
              onClick={logoutAdmin}
              className="hidden lg:block text-xs font-medium text-rose-400 hover:text-rose-300 transition-all"
            >
              Sign Out
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-all"
            aria-expanded={isOpen}
            aria-label="Main menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1.5"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium ${
                  currentView === item.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang === 'ne' ? item.labelNp : item.labelEn}
              </button>
            ))}

            {isAdmin && (
              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setView('admin');
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center space-x-2 px-4 py-3 rounded-md text-base font-medium ${
                  currentView === 'admin'
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-900'
                }`}
              >
                <Terminal size={18} />
                <span>Admin Panel</span>
              </button>
            )}

            {!isAdmin ? (
              <button
                id="mobile-nav-quick-admin"
                onClick={() => {
                  setView('admin');
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium text-slate-500 border border-dashed border-slate-800 mt-4"
              >
                <ShieldAlert size={16} />
                <span>Sign In (harendralamsal4140@gmail.com)</span>
              </button>
            ) : (
              <button
                id="mobile-nav-logout"
                onClick={() => {
                  logoutAdmin();
                  setIsOpen(false);
                }}
                className="w-full text-left text-rose-400 px-4 py-3 rounded-md text-sm font-medium hover:bg-rose-950/20"
              >
                Sign Out from Admin
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
