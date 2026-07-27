'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Code2, ShieldCheck, Rocket, Send, Check, ExternalLink, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WebsiteStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebsiteStatusModal({ isOpen, onClose }: WebsiteStatusModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setSubscribed(true);
    confetti({
      particleCount: 80,
      spread: 70,
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 text-white z-10 overflow-hidden"
          >
            {/* Glowing Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Globe className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Launching Soon 2026
                </div>
                <h3 className="text-xl font-bold text-slate-100">Portal Website Sakode 2.0</h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Website resmi Sakode Academy sedang dalam pengembangan masif! Kami membawa platform LMS interaktif, modul koding hands-on, dan hub komunitas tech khusus untuk anak muda Papua & Indonesia.
            </p>

            {/* Progress Bar */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                <span>Progress Pengembangan System</span>
                <span className="text-cyan-400 font-bold">85% Complete</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                />
              </div>
            </div>

            {/* Sneak Peek Features */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Fitur Utama Yang Akan Datang:</h4>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <Code2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">Interactive Coding IDE</h5>
                    <p className="text-[11px] text-slate-400">Praktek koding HTML/CSS/JS langsung di browser dengan instant feedback.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">Digital Certificate Verifier</h5>
                    <p className="text-[11px] text-slate-400">Sertifikat kelulusan berbasis QR Code & unique hash validation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <Rocket className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">Talent & Job Connection</h5>
                    <p className="text-[11px] text-slate-400">Menghubungkan talenta digital Sakode dengan perusahaan partner.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribe / Notification Form */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-4">
              <h5 className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dapatkan Akses Early Bird Portal:
              </h5>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  Email Anda berhasil didaftarkan! Kami akan mengabari saat launching.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Masukkan email kamu..."
                    required
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Notify Me
                  </button>
                </form>
              )}
            </div>

            {/* Direct Link Alternative */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Butuh bantuan cepat?</span>
              <a
                href="https://wa.me/message/UTMRQNH4ERNBM1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 hover:underline"
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
