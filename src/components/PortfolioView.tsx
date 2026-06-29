/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, TrendingUp, Cpu, Sparkles, FolderGit, ExternalLink, Calendar, Award, CheckCircle2, ChevronRight, Download, Share2, BookOpen, Eye, X } from 'lucide-react';
import { SKILLS_DATA, EXPERIENCES_DATA, SERVICES_DATA, PROJECTS_DATA, TESTIMONIALS_DATA, ACHIEVEMENTS_DATA } from '../data';
import Certifications from './Certifications';

interface PortfolioViewProps {
  lang: 'en' | 'ne';
  setView: (view: 'home' | 'blog' | 'news' | 'contact' | 'admin') => void;
}

export default function PortfolioView({ lang, setView }: PortfolioViewProps) {
  
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal size={24} className="text-indigo-400" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-indigo-400" />;
      case 'Cpu': return <Cpu size={24} className="text-indigo-400" />;
      case 'Sparkles': return <Sparkles size={24} className="text-indigo-400" />;
      default: return <Cpu size={24} className="text-indigo-400" />;
    }
  };

  const categories = Array.from(new Set(SKILLS_DATA.map(s => s.category)));

  return (
    <div className="space-y-24 py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl bg-slate-950 text-slate-100">
      
      {/* 1. About Me & Professional Overview */}
      <section id="about" className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center" aria-labelledby="about-heading">
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-20 blur" />
          <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block">Core Philosophy</span>
            <blockquote className="text-slate-300 italic text-lg leading-relaxed">
              "{lang === 'ne' 
                ? 'गुणस्तरीय सफ्टवेयर र प्राविधिक एसईओको माध्यमबाट मात्र व्यवसायिक फड्को सम्भव छ।' 
                : 'Only through structural software optimization and calculated SEO orchestration can true digital growth be unlocked.'}"
            </blockquote>
            <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">Harendra Lamsal — Freelancing Brand</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <h2 id="about-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {lang === 'ne' ? 'मेरो बारेमा' : 'About Harendra'}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {lang === 'ne' 
              ? 'म हरेन्द्र लाम्साल, नेपालको काठमाडौंमा आधारित एक अनुभवी सफ्टवेयर इन्जिनियर, डिजिटल मार्केटर र वर्डप्रेस विशेषज्ञ हुँ। म छिटो चल्ने वेभ अनुप्रयोगहरू निर्माण गर्न, जटिल प्रणालीहरूको व्यवस्थापन गर्न र सर्च इन्जिन र्‍याङ्किङलाई गुणात्मक रूपमा वृद्धि गर्न मन पराउँछु।'
              : 'I am Harendra Lamsal, a professional full-stack engineer and digital marketer based in Kathmandu, Nepal. I specialize in building decoupled headless architectures, constructing bespoke WordPress ecosystems, and leading enterprise SEO campaigns that achieve sub-second load times and flawless organic visibility.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-slate-300 font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{lang === 'ne' ? 'काठमाडौं, नेपाल' : 'Kathmandu, Nepal'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{lang === 'ne' ? 'अन्तर्राष्ट्रिय क्लायन्टहरू' : 'Global Delivery Compliant'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{lang === 'ne' ? 'हेडलेस र एआई एकीकरण' : 'Headless & AI Specialist'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{lang === 'ne' ? '९९+ स्पिड अडिट' : '99+ Speed Audits Completed'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Offered Bento */}
      <section id="services" className="space-y-12" aria-labelledby="services-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Solutions</span>
          <h2 id="services-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {lang === 'ne' ? 'मैले प्रदान गर्ने सेवाहरू' : 'Professional Services'}
          </h2>
          <p className="text-slate-400">
            {lang === 'ne' ? 'उच्च स्तरको प्रविधि र आधुनिक डिजिटल रणनीतिको प्रयोग गरी तपाईंको ब्रान्डलाई उचाइमा पुर्‍याउने सेवाहरू।' : 'Premium architectural models designed to elevate digital speed, optimize indexation efficiency, and convert organic leads.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_DATA.map((srv, idx) => (
            <motion.div
              key={srv.id}
              whileHover={{ y: -4 }}
              id={`service-card-${idx}`}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 transition-all hover:bg-slate-900 hover:border-slate-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 border border-slate-700/50">
                {getServiceIcon(srv.icon)}
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ne' ? srv.titleNp : srv.titleEn}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {lang === 'ne' ? srv.descriptionNp : srv.descriptionEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Experience Timeline & Skills Matrix */}
      <section id="experience-skills" className="grid grid-cols-1 lg:grid-cols-12 gap-16" aria-labelledby="experience-heading">
        {/* Experience Timeline */}
        <div className="lg:col-span-7 space-y-10 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest">The Timeline</span>
            <h2 id="experience-heading" className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'अनुभव र इतिहास' : 'Professional History'}
            </h2>
          </div>

          <div className="relative border-l border-slate-800 ml-4 space-y-10">
            {EXPERIENCES_DATA.map((exp, idx) => (
              <div key={exp.id} id={`exp-item-${idx}`} className="relative pl-8">
                {/* Connector Node */}
                <span className="absolute -left-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-slate-950 border-2 border-indigo-500" />
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'ne' ? exp.roleNp : exp.roleEn}
                    </h3>
                    <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-mono text-slate-400">
                      {lang === 'ne' ? exp.periodNp : exp.periodEn}
                    </span>
                  </div>
                  <div className="text-sm text-indigo-400 font-medium">{exp.company}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {lang === 'ne' ? exp.descriptionNp : exp.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest">Capabilities</span>
            <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'प्राविधिक दक्षता' : 'Skills & Engine'}
            </h2>
          </div>

          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat} className="space-y-3 text-left">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{cat}</h3>
                <div className="space-y-2">
                  {SKILLS_DATA.filter(s => s.category === cat).map((skill, sIdx) => (
                    <div key={skill.name} id={`skill-${cat}-${sIdx}`} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300 font-mono">{skill.name}</span>
                        <span className="text-slate-500 font-mono">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects Portfolio */}
      <section id="projects" className="space-y-12" aria-labelledby="projects-heading">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest">Case Studies</span>
            <h2 id="projects-heading" className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'मेरो उत्कृष्ट कामहरू' : 'Featured Projects'}
            </h2>
          </div>
          <button
            id="view-blog-redirect"
            onClick={() => setView('blog')}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>{lang === 'ne' ? 'ब्लग अन्वेषण गर्नुहोस्' : 'Explore My Tech Blog'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_DATA.map((proj, idx) => (
            <motion.div
              key={proj.id}
              whileHover={{ y: -6 }}
              id={`project-card-${idx}`}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40"
            >
              {/* Image Frame */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {proj.featured && (
                  <div className="absolute top-3 left-3 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-mono font-semibold text-white">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Info Frame */}
              <div className="flex flex-1 flex-col p-6 justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {lang === 'ne' ? proj.descriptionNp : proj.descriptionEn}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Tag capsules */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="rounded bg-slate-850 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center space-x-4 border-t border-slate-850 pt-4 text-xs font-semibold">
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
                      >
                        <ExternalLink size={12} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-slate-400 hover:text-white"
                      >
                        <FolderGit size={12} />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Certifications */}
      <section className="border-t border-slate-900 pt-16">
        <Certifications lang={lang} />
      </section>

      {/* 5b. Achievements */}
      <section className="border-t border-slate-900 pt-16">
        <div className="space-y-6 text-left">
          <div className="flex items-center space-x-2">
            <Award className="text-indigo-400" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {lang === 'ne' ? 'उपलब्धिहरू' : 'Achievements'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACHIEVEMENTS_DATA.map((ach) => (
              <div key={ach.id} className="p-5 rounded-xl border border-slate-850 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800 transition-all duration-300 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ne' ? ach.titleNp : ach.titleEn}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{ach.date}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ne' ? ach.descriptionNp : ach.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="space-y-12 border-t border-slate-900 pt-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Endorsements</span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {lang === 'ne' ? 'ग्राहकहरूको प्रतिक्रिया' : 'Client Testimonials'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {TESTIMONIALS_DATA.map((tst, idx) => (
            <div
              key={tst.id}
              id={`testimonial-card-${idx}`}
              className="p-8 rounded-2xl border border-slate-850 bg-slate-900/25 flex flex-col justify-between space-y-6 text-left"
            >
              <p className="text-slate-300 text-base leading-relaxed italic">
                "{lang === 'ne' ? tst.contentNp : tst.contentEn}"
              </p>
              
              <div className="flex items-center space-x-4 border-t border-slate-850/50 pt-4">
                <img
                  src={tst.avatar}
                  alt={tst.name}
                  className="h-12 w-12 rounded-full object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{tst.name}</h4>
                  <div className="text-xs text-indigo-400 mt-0.5">{lang === 'ne' ? tst.roleNp : tst.roleEn}, <span className="text-slate-400">{tst.company}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Freelance Media Kit & Press Kit Details */}
      <section className="p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-3">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {lang === 'ne' ? 'मिडिया किट तथा प्रेस जानकारी' : 'Media Kit & Press Kit'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            {lang === 'ne'
              ? 'के तपाईं मलाई अन्तरवार्ता, प्राविधिक सम्मेलनहरूमा मुख्य वक्ता वा मिडिया कभरेजका लागि खोज्दै हुनुहुन्छ ? यहाँ मेरो विस्तृत जीवनी, विभिन्न साइजका हाइ-रेस फोटोहरू र ब्रान्ड गाइडहरू छन्।'
              : 'Are you hosting Harendra Lamsal as a speaker, panelist, or consultant? Download the official press packet including bio variations, high-resolution headshot assets, brand badges, and technology consulting rate-sheets.'}
          </p>
        </div>
        <div className="md:col-span-4 flex justify-start md:justify-end gap-3 flex-wrap">
          <button
            id="download-media-kit"
            onClick={() => alert('Media Kit zip compiled automatically. Thank you!')}
            className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 shadow transition-all"
          >
            <Download size={14} />
            <span>Download Kit (ZIP)</span>
          </button>
          
          <button
            id="share-press-details"
            onClick={() => alert('Press links copied to clipboard!')}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 font-semibold text-xs px-4 py-2.5 transition-all"
          >
            <Share2 size={14} />
            <span>Copy Press Links</span>
          </button>
        </div>
      </section>

    </div>
  );
}
