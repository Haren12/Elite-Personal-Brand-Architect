import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Eye, ExternalLink, X } from 'lucide-react';
import { CERTIFICATIONS_DATA } from '../data';
import { Certification } from '../types';

interface CertificationsProps {
  lang: 'en' | 'ne';
}

export default function Certifications({ lang }: CertificationsProps) {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center space-x-2">
        <Award className="text-indigo-400" />
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {lang === 'ne' ? 'प्रमाणपत्रहरू' : 'Certifications'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CERTIFICATIONS_DATA.map((cert) => {
          const isUdemy = cert.issuer.toLowerCase().includes('udemy');

          return (
            <div 
              key={cert.id} 
              className="p-5 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle visual gradient highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Header: Issuer and Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isUdemy ? (
                      <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20 font-sans">
                        ûdemy
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 font-sans font-black">
                        coursera
                      </span>
                    )}
                    <span className="inline-flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={10} className="mr-1" />
                      {lang === 'ne' ? 'प्रमाणित' : 'Verified'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{cert.date}</span>
                </div>

                {/* Miniature Graphical Certificate View */}
                <div 
                  onClick={() => setActiveCert(cert)}
                  className={`h-28 w-full rounded-lg border overflow-hidden relative cursor-pointer flex flex-col items-center justify-center p-3 select-none transition-all duration-300 shadow-md ${
                    isUdemy 
                      ? 'bg-gradient-to-br from-slate-950 via-purple-950/15 to-slate-950 border-purple-900/30' 
                      : 'bg-gradient-to-br from-slate-950 via-blue-950/15 to-slate-950 border-blue-900/30'
                  }`}
                  title={lang === 'ne' ? 'प्रमाणपत्र हेर्नुहोस्' : 'Click to view certificate'}
                >
                  <div className="text-center space-y-1.5 max-w-[90%]">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">
                      {isUdemy ? 'Udemy Verified Course' : 'Coursera Guided Project'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-[8px] font-mono text-slate-450">
                      ID: {cert.credentialId}
                    </p>
                  </div>
                  
                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300">
                    <Eye size={18} className="text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-350">
                      {lang === 'ne' ? 'प्रमाणपत्र हेर्नुहोस्' : 'Click to View Certificate'}
                    </span>
                  </div>
                </div>

                {/* Text Description / Details */}
                <div className="space-y-1 text-left">
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-500">{lang === 'ne' ? 'प्रशिक्षक:' : 'Instructor:'}</span>
                    <span className="text-slate-300 font-medium truncate max-w-[180px]" title={cert.instructor}>
                      {cert.instructor}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ne' ? 'अवधि:' : 'Length:'} <span className="font-mono text-slate-400">{cert.length}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-850/60 flex items-center justify-between gap-3 relative z-10">
                <button
                  onClick={() => setActiveCert(cert)}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 bg-slate-900/60 hover:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-750 transition-all cursor-pointer"
                >
                  <Eye size={12} />
                  <span>{lang === 'ne' ? 'पूर्वावलोकन' : 'Preview'}</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 bg-slate-900/60 hover:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-indigo-500/20 transition-all"
                  >
                    <span>Verify</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {activeCert.issuer}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{activeCert.title}</h3>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content - Certificate Live Display */}
              <div className="p-6 flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="w-full lg:w-3/4 bg-slate-950 rounded-xl p-2 sm:p-4 overflow-x-auto border border-slate-800 shadow-inner flex items-center justify-center">
                  <div className="min-w-[320px] sm:min-w-[600px] md:min-w-[700px] w-full">
                    {activeCert.issuer.toLowerCase().includes('udemy') ? (
                      <div className="w-full bg-white text-slate-800 p-6 sm:p-10 rounded-xl border-4 border-slate-200 font-sans shadow-lg select-none relative overflow-hidden">
                        {/* Top watermark / security lines */}
                        <div className="absolute inset-0 border-double border-8 border-slate-100 pointer-events-none" />
                        
                        {/* Header section with Udemy logo and certificate code */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 relative z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#a435f0] text-3xl font-extrabold tracking-tighter flex items-center">
                              ûdemy
                            </span>
                          </div>
                          <div className="text-right font-mono text-[9px] sm:text-[10px] text-slate-450 space-y-0.5">
                            <div>Certificate no: <span className="text-slate-700 font-semibold">{activeCert.credentialId}</span></div>
                            <div className="truncate max-w-[280px]">Certificate url: <span className="text-indigo-600 font-semibold">{activeCert.credentialUrl}</span></div>
                            <div>Reference Number: <span className="text-slate-700 font-semibold">0004</span></div>
                          </div>
                        </div>

                        {/* Main body content */}
                        <div className="py-8 text-left space-y-6 relative z-10">
                          <div className="space-y-1">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block">
                              CERTIFICATE OF COMPLETION
                            </span>
                            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                              {activeCert.title}
                            </h2>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1">
                              Instructors: <span className="text-slate-800 font-bold">{activeCert.instructor}</span>
                            </div>
                          </div>

                          {/* Recipient area */}
                          <div className="pt-6 pb-2">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Awarded to</div>
                            <div className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-1 border-b-2 border-slate-100 pb-2 inline-block min-w-[200px]">
                              {activeCert.recipient}
                            </div>
                          </div>

                          {/* Date and Hours */}
                          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                            <div>
                              <div className="text-[9px] text-slate-450 uppercase tracking-wider">Date</div>
                              <div className="text-xs sm:text-sm font-bold text-slate-850 mt-0.5">{activeCert.date}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-slate-450 uppercase tracking-wider">Length</div>
                              <div className="text-xs sm:text-sm font-bold text-slate-850 mt-0.5">{activeCert.length}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-[#fcfbf9] text-slate-800 p-6 sm:p-10 rounded-xl border-8 border-double border-slate-300 font-sans shadow-lg select-none relative overflow-hidden">
                        {/* Decorative Guilloche background curves */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="guilloche-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 40 Q20 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" />
                                <path d="M0 0 Q20 40 40 0" fill="none" stroke="currentColor" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#guilloche-pattern)" />
                          </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                          {/* Left main content column */}
                          <div className="md:col-span-9 space-y-6 text-left">
                            {/* Logo and Date */}
                            <div className="flex justify-between items-center">
                              <span className="text-[#0056b3] text-2xl sm:text-3xl font-black tracking-tight">coursera</span>
                              <div className="text-right font-serif italic text-xs text-slate-500">
                                {activeCert.date}
                              </div>
                            </div>

                            {/* Recipient and completion text */}
                            <div className="space-y-4 pt-2">
                              <div>
                                <h2 className="text-2xl sm:text-3.5xl font-serif text-slate-900 font-normal">
                                  {activeCert.recipient}
                                </h2>
                                <div className="w-20 h-0.5 bg-slate-300 mt-2" />
                              </div>

                              <div className="space-y-1">
                                <p className="text-[11px] text-slate-500 italic">has successfully completed</p>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                                  {activeCert.title}
                                </h3>
                                <p className="text-[10px] text-slate-500">
                                  an online project authorized by Coursera and offered through Coursera
                                </p>
                              </div>
                            </div>

                            {/* Signature and verification code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200/60">
                              {/* Signature block */}
                              <div className="space-y-2">
                                <div className="font-serif italic text-base text-indigo-950 font-medium tracking-wide">
                                  Delphine Sangotokun
                                </div>
                                <div className="border-t border-slate-300 pt-1">
                                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Authorized Signature</p>
                                  <p className="text-[8px] text-slate-500 mt-0.5 leading-snug">
                                    Delphine Sangotokun, MPH, Ph.D.<br />
                                    Public Health specialist
                                  </p>
                                </div>
                              </div>

                              {/* Verification code */}
                              <div className="flex flex-col justify-end font-mono text-[8px] text-slate-450 space-y-0.5">
                                <div>Verify at:</div>
                                <a 
                                  href={activeCert.credentialUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-indigo-600 hover:underline break-all font-semibold"
                                >
                                  {activeCert.credentialUrl}
                                </a>
                                <div className="text-[7px] leading-tight text-slate-400/80 pt-1">
                                  Coursera has confirmed the identity of this individual and their participation in the project.
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column - Vertical Ribbon Stamp */}
                          <div className="md:col-span-3 flex md:flex-col items-center justify-center md:justify-start pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200/60 md:pl-4">
                            {/* Vertical Ribbon representation */}
                            <div className="relative w-24 bg-slate-100 border border-slate-200 py-4 px-2 text-center rounded-b-lg shadow-sm flex flex-col items-center justify-between min-h-[140px]">
                              {/* Hanging top detail */}
                              <div className="absolute top-0 inset-x-0 h-1 bg-[#0056b3]" />
                              
                              <div className="text-[8px] font-bold text-slate-500 tracking-wider uppercase leading-tight">
                                PROJECT CERTIFICATE
                              </div>

                              {/* Circular seal stamp */}
                              <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white text-slate-600 shadow-inner relative my-2">
                                <div className="absolute inset-1 rounded-full border border-dashed border-slate-300" />
                                <span className="text-[6px] font-bold font-mono text-center leading-none px-0.5">
                                  COURSERA<br />VERIFIED
                                </span>
                              </div>

                              <div className="text-[7px] font-mono text-slate-400">
                                ID: {activeCert.credentialId}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Small footer legal text */}
                        <div className="mt-6 border-t border-slate-100 pt-2 text-[7px] leading-relaxed text-slate-400 text-left">
                          This certificate attests to the learner's completion of an online course / project delivered via Coursera. It does not constitute formal enrollment at any university or entity and does not itself grant academic credit, grades, or a degree.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-1/4 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-850">
                      <div className="text-xs text-slate-400">Recipient</div>
                      <div className="text-sm font-bold text-white mt-0.5">{activeCert.recipient}</div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-850">
                      <div className="text-xs text-slate-400">Issued By</div>
                      <div className="text-sm font-bold text-white mt-0.5">{activeCert.issuer}</div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-850">
                      <div className="text-xs text-slate-400">Date of Completion</div>
                      <div className="text-sm font-bold text-white mt-0.5">{activeCert.date}</div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    {activeCert.credentialUrl && (
                      <a
                        href={activeCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-4 py-3 shadow transition-all cursor-pointer"
                      >
                        <span>Verify Online Credential</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setActiveCert(null)}
                      className="w-full inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 font-bold text-xs px-4 py-2.5 transition-all cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
