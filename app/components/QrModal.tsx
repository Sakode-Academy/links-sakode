'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Copy, Check, Share2, Download, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
}

export function QrModal({ isOpen, onClose, currentUrl }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : 'https://sakode.academy/links');

  // Interactive SVG QR Code generator layout
  const qrSvgData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pageUrl)}&color=06b6d4&bgcolor=0f172a`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWa = () => {
    const text = encodeURIComponent(`Cek tautan resmi Sakode Academy di sini: ${pageUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white z-10 overflow-hidden text-center"
          >
            {/* Glow Accent */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup Modal QR"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5" /> Sakode QR Code
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Scan & Bagikan Link</h3>
            <p className="text-xs text-slate-400 mb-6">Scan QR code ini untuk membuka halaman Sakode Academy di handphone kamu.</p>

            {/* QR Card Frame */}
            <div className="relative mx-auto w-56 h-56 p-3 bg-slate-950 border-2 border-cyan-500/40 rounded-2xl shadow-xl flex items-center justify-center group mb-6">
              <img
                src={qrSvgData}
                alt="QR Code Sakode Academy"
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tautan Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Salin Alamat Halaman (URL)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWa}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
