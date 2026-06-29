/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsletterProps {
  lang: 'en' | 'ne';
}

export default function Newsletter({ lang }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(lang === 'ne' ? 'कृपया सही इमेल ठेगाना प्रविष्ट गर्नुहोस्।' : 'Please enter a valid email address.');
      return;
    }

    setError('');
    // Simulate subscription API post
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
    }, 800);
  };

  return (
    <section className="relative overflow-hidden border-t border-b border-slate-900 bg-slate-950 py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 text-left relative overflow-hidden">
        
        {/* Subtle decorative shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-40 w-40 rounded-full bg-indigo-600/10 blur-2xl" />

        <AnimatePresence>
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-3 py-6"
            >
              <CheckCircle2 size={36} className="text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Subscription Confirmed!</h3>
              <p className="text-sm text-slate-400 max-w-md">
                {lang === 'ne'
                  ? 'धन्यवाद ! तपाईं मेरो प्रविधि समाचार र ब्लग अपडेटको सूचीमा सामेल हुनुभयो। नयाँ सामग्री सिधै तपाईंको इमेलमा आउनेछ।'
                  : 'Thank you! You have successfully subscribed to Harendra Lamsal newsletter list. The latest tech analyses and bulletins will be routed straight to your inbox.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">STAY UPDATED</span>
                <h2 id="newsletter-heading" className="text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {lang === 'ne' ? 'साप्ताहिक प्रविधि समाचार' : 'Weekly Tech Digest'}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                  {lang === 'ne'
                    ? 'कृत्रिम बुद्धिमत्ता, प्रोग्रामिङ र डिजिटल मार्केटिङका ताजा अपडेटहरू हप्ताको एक पटक सिधै तपाईंको इनबक्समा पाउनुहोस्।'
                    : 'Get natural translation updates, headless WordPress blueprints, and SEO algorithms delivered straight to your inbox once a week.'}
                </p>
              </div>

              <div className="md:col-span-5 space-y-3">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="e.g. john@example.com"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 shadow shadow-indigo-600/20 transition-all whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                
                {error && <span className="text-xs text-rose-400 block mt-1">{error}</span>}

                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                  <ShieldCheck size={12} className="text-emerald-500/80" />
                  <span>No Spam. Unsubscribe with a single click at any time.</span>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
