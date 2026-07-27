'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Code2, ShieldCheck, Rocket, Send, Check, ExternalLink, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WebsiteStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export function WebsiteStatusModal({ isOpen, onClose, theme = 'dark' }: WebsiteStatusModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isLight = theme === 'light';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setSubscribed(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setEmailInput('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden ${
              isLight 
                ? 'bg-white border border-zinc-200 text-zinc-900' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer ${
                isLight 
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
              }`}
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl border ${
                isLight 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : 'bg-zinc-800 border-zinc-700 text-emerald-400'
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium mb-1 ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-zinc-800 text-emerald-400 border-zinc-700'
                }`}>
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Launching Soon 2026
                </div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  Portal Website Sakode 2.0
                </h3>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Website resmi Sakode Academy sedang dalam tahap pengembangan. Kami menghadirkan platform LMS interaktif, modul koding hands-on, dan hub komunitas tech.
            </p>

            {/* Progress Bar */}
            <div className={`border rounded-xl p-4 mb-6 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <div className={`flex items-center justify-between text-xs font-medium mb-2 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                <span>Progress Pengembangan System</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">85%</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2.5 mb-6">
              <h4 className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Fitur Utama:
              </h4>
              
              <div className={`flex items-start gap-3 p-3 rounded-xl border ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <Code2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className={`text-xs font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>Interactive Coding IDE</h5>
                  <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Praktek koding langsung di browser dengan instant feedback.</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-xl border ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className={`text-xs font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>Digital Certificate Verifier</h5>
                  <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Sertifikat kelulusan berbasis QR Code & unique verification.</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-xl border ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <Rocket className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className={`text-xs font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>Talent & Job Connection</h5>
                  <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Menghubungkan talenta digital Sakode dengan mitra industri.</p>
                </div>
              </div>
            </div>

            {/* Subscribe Form */}
            <div className={`border rounded-xl p-4 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <h5 className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-zinc-800' : 'text-zinc-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Dapatkan Notifikasi Saat Rilis:
              </h5>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-medium"
                >
                  <Check className="w-4 h-4" />
                  Email Anda berhasil mendaftar! Kami akan mengabari saat launching.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Masukkan alamat email..."
                    required
                    className={`flex-1 border rounded-xl px-3.5 py-2 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${
                      isLight 
                        ? 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400' 
                        : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim
                  </button>
                </form>
              )}
            </div>

            {/* WhatsApp Direct */}
            <div className={`mt-4 pt-4 border-t flex justify-between items-center text-xs ${
              isLight ? 'border-zinc-200' : 'border-zinc-800'
            }`}>
              <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>Butuh informasi lebih lanjut?</span>
              <a
                href="https://wa.me/message/UTMRQNH4ERNBM1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Chat Admin WhatsApp <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
