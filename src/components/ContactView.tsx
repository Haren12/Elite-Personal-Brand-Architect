/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactViewProps {
  lang: 'en' | 'ne';
}

export default function ContactView({ lang }: ContactViewProps) {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 0, num2: 0, sum: 0 });
  
  // Feedback states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate math captcha on mount
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    setCaptchaChallenge({ num1, num2, sum: num1 + num2 });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = lang === 'ne' ? 'कृपया आफ्नो नाम राख्नुहोस्।' : 'Name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = lang === 'ne' ? 'सटीक इमेल ठेगाना राख्नुहोस्।' : 'A valid email is required.';
    }
    if (!subject.trim()) newErrors.subject = lang === 'ne' ? 'कृपया विषय खुलाउनुहोस्।' : 'Subject is required.';
    if (!message.trim() || message.length < 10) {
      newErrors.message = lang === 'ne' ? 'सन्देश कम्तिमा १० अक्षरको हुनुपर्छ।' : 'Message must be at least 10 characters.';
    }
    if (parseInt(captchaAnswer) !== captchaChallenge.sum) {
      newErrors.captcha = lang === 'ne' ? 'गलत क्याप्चा जवाफ।' : 'Incorrect spam validation answer.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API Post roundtrip
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      generateCaptcha();
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Connect & Consult</span>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {lang === 'ne' ? 'सम्पर्क र व्यावसायिक परामर्श' : 'Get In Touch'}
        </h1>
        <p className="text-slate-400">
          {lang === 'ne'
            ? 'कुनै परियोजना, परामर्श वा प्रविधि विषयक जिज्ञासाका लागि मलाई यहाँबाट सिधै सन्देश पठाउन सक्नुहुन्छ।'
            : 'Whether you want to discuss a headless WordPress setup, hire me for full-stack engineering, or optimize your SEO speed, drop a line below.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info & Mock Maps */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Contact Channels</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/40 border border-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-mono">EMAIL DIRECTORY</span>
                  <a href="mailto:harendralamsal4140@gmail.com" className="block text-sm font-semibold text-white hover:text-indigo-400">
                    harendralamsal4140@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/40 border border-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-mono">SUPPORT PHONE</span>
                  <a href="tel:+9779823587535" className="block text-sm font-semibold text-white hover:text-indigo-400">
                    +977 9823587535
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/40 border border-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-mono">HEADQUARTERS</span>
                  <span className="block text-sm font-semibold text-white">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Custom Styled Map Card (Kathmandu Highlight) */}
          <div className="rounded-xl overflow-hidden border border-slate-850 bg-slate-900 p-2 space-y-3">
            <div className="relative h-48 w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
              {/* Artistic Vector map simulation in Dark Slate */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simulated streets lines */}
                <path d="M0,50 L400,50 M0,150 L400,150 M100,0 L100,200 M300,0 L300,200" stroke="#334155" strokeWidth="2"/>
                <path d="M50,0 Q120,80 250,50 T380,200" stroke="#334155" strokeWidth="1" fill="none"/>
                <path d="M0,100 Q150,150 200,80 T400,120" stroke="#334155" strokeWidth="1" fill="none"/>
                {/* Simulated river */}
                <path d="M0,10 Q100,120 200,90 T400,180" stroke="#1e1b4b" strokeWidth="12" fill="none"/>
              </svg>
              
              {/* Map Pins */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-1">
                <div className="h-4 w-4 bg-indigo-600 rounded-full animate-ping absolute" />
                <MapPin size={24} className="text-indigo-400 relative z-10" />
                <span className="text-xs font-bold text-white bg-slate-900 border border-slate-800 rounded px-2 py-0.5 shadow">Kathmandu, Nepal</span>
                <span className="text-[10px] font-mono text-slate-500">27.7172° N, 85.3240° E</span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] text-slate-500 font-mono uppercase">MAPS PLATFORM STATUS: ONLINE</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-8 rounded-xl border border-slate-850 bg-slate-900/20 text-left space-y-6 relative" id="contact-form">
            
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-slate-950/95 z-20 rounded-xl flex flex-col items-center justify-center p-8 text-center"
                >
                  <CheckCircle size={48} className="text-emerald-400 mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Received Successfully!</h3>
                  <p className="text-sm text-slate-400 max-w-sm mb-6">
                    {lang === 'ne' 
                      ? 'धन्यवाद ! तपाईंको परामर्श सन्देश हरेन्द्रको इनबक्समा सुरक्षित रूपमा पठाइएको छ। उहाँले छिट्टै इमेल मार्फत सम्पर्क गर्नुहुनेछ।' 
                      : 'Thank you! Your message has been sent successfully to Harendra Lamsal inbox. A response will be provided to your email address shortly.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 font-mono uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. John Doe"
                />
                {errors.name && <span className="text-[11px] text-rose-400 block">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 font-mono uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-[11px] text-rose-400 block">{errors.email}</span>}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Consultation details / Proposal"
              />
              {errors.subject && <span className="text-[11px] text-rose-400 block">{errors.subject}</span>}
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Message Details</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Outline your project requirements or consulting requirements..."
              />
              {errors.message && <span className="text-[11px] text-rose-400 block">{errors.message}</span>}
            </div>

            {/* Math captcha (Spam Shield) */}
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Shield size={16} className="text-indigo-400" />
                <span className="text-xs font-bold font-mono">
                  SPAM VALIDATION: What is <span className="text-indigo-300 text-sm font-extrabold">{captchaChallenge.num1} + {captchaChallenge.num2}</span> ?
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-24 rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-center text-sm font-bold text-indigo-300 focus:border-indigo-500"
                  placeholder="Answer"
                  required
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                  title="Generate new challenge"
                >
                  [Refresh]
                </button>
              </div>
            </div>
            {errors.captcha && <span className="text-[11px] text-rose-400 block mt-1">{errors.captcha}</span>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="contact-submit-btn"
              className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-6 py-4 text-sm font-bold text-white shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Dispatching Message...' : 'Submit Proposal'}</span>
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
