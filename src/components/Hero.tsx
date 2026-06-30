/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Download, Send, Linkedin, Github, Twitter, Award, Cpu, BookOpen } from 'lucide-react';

interface HeroProps {
  lang: 'en' | 'ne';
  setView: (view: 'home' | 'blog' | 'news' | 'contact' | 'admin') => void;
}

export default function Hero({ lang, setView }: HeroProps) {
  const text = {
    greetingEn: 'NAMASTE & HELLO, I AM',
    greetingNp: 'नमस्ते र स्वागत छ, म हुँ',
    roleEn: 'Elite Full-Stack Engineer & SEO Architect',
    roleNp: 'वरिष्ठ फुल-स्ट्याक इन्जिनियर तथा एसईओ वास्तुकार',
    taglineEn: 'Engineering ultra-fast web architectures, headless WordPress setups, and automated digital systems that drive growth.',
    taglineNp: 'असाधारण गति भएका वेभ एपहरू, हेडलेस वर्डप्रेस प्रणाली र व्यवसायिक वृद्धिका लागि स्वचालित डिजिटल संरचनाहरूको निर्माण।',
    ctaEn: 'Hire Me / Consult',
    ctaNp: 'परामर्श लिनुहोस्',
    blogCtaEn: 'Read My Tech Blog',
    blogCtaNp: 'मेरो प्रविधि ब्लग',
    resumeCtaEn: 'View Resume',
    resumeCtaNp: 'बायोडाटा हेर्नुहोस्',
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 md:py-20 lg:py-24 border-b border-slate-900" aria-label="Hero Introduction">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 rounded-full bg-emerald-600/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400"
            >
              <Award size={14} className="animate-bounce" />
              <span>{lang === 'ne' ? text.greetingNp : text.greetingEn}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Harendra Lamsal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg md:text-xl font-medium text-slate-200"
            >
              {lang === 'ne' ? text.roleNp : text.roleEn}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-base text-slate-400 md:text-lg max-w-2xl leading-relaxed"
            >
              {lang === 'ne' ? text.taglineNp : text.taglineEn}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-contact-cta"
                onClick={() => setView('contact')}
                className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                <span>{lang === 'ne' ? text.ctaNp : text.ctaEn}</span>
                <Send size={16} />
              </button>

              <button
                id="hero-blog-cta"
                onClick={() => setView('blog')}
                className="inline-flex items-center space-x-2 rounded-lg border border-slate-700 bg-slate-900/50 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all duration-150"
              >
                <span>{lang === 'ne' ? text.blogCtaNp : text.blogCtaEn}</span>
                <BookOpen size={16} />
              </button>
            </motion.div>

            {/* Quick stats / highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-left"
            >
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">100+</div>
                <div className="text-xs text-slate-400 font-mono tracking-wider uppercase mt-1">
                  {lang === 'ne' ? 'एसईओ सेवाहरू' : 'SEO Services'}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">Sub-1s</div>
                <div className="text-xs text-slate-400 font-mono tracking-wider uppercase mt-1">
                  {lang === 'ne' ? 'पेज स्पिड' : 'Page Speed'}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-indigo-400">50+</div>
                <div className="text-xs text-slate-400 font-mono tracking-wider uppercase mt-1">
                  {lang === 'ne' ? 'सन्तुष्ट ग्राहकहरू' : 'Clients Served'}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile Image container (Stunning representation of user's headshot) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group w-72 sm:w-80 md:w-96 overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 p-3 shadow-2xl transition-all duration-300 hover:border-indigo-500/50"
            >
              {/* Outer neon border trace */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 opacity-20 blur-sm group-hover:opacity-30 transition-opacity" />

              {/* The Headshot Image with a deep dark premium overlay to resemble the elite portfolio style */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-slate-950 flex flex-col justify-between">
                
                {/* Displaying real high-quality studio headshot of Harendra */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/20 z-10" />
                  <img
                    src="/harendra_profile.jpg"
                    alt="Harendra Lamsal - Elite Full-Stack Engineer"
                    className="w-full h-full object-cover object-center scale-[1.02] group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle watermarked overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 flex flex-col justify-end z-20">
                    <span className="text-white text-base font-bold block" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Harendra Lamsal</span>
                    <span className="text-xs text-indigo-400 font-mono tracking-wider mt-0.5">EST. KATHMANDU, NEPAL</span>
                  </div>
                </div>

                {/* Floating Tech Chips */}
                <div className="absolute top-4 left-4 z-20 rounded-md bg-slate-900/90 border border-slate-700/50 px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-300 backdrop-blur-sm flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AVAILABLE FOR FREELANCE</span>
                </div>

                <div className="absolute top-4 right-4 z-20 rounded-md bg-slate-900/90 border border-slate-700/50 px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-300 backdrop-blur-sm">
                  Full Stack Pro
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
