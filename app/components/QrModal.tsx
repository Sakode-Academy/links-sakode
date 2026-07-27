'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Copy, Check, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
  theme?: 'dark' | 'light';
}

export function QrModal({ isOpen, onClose, currentUrl, theme = 'dark' }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : 'https://sakode.academy/links');
  const isLight = theme === 'light';

  const qrColor = isLight ? '18181b' : 'ffffff';
  const qrBgColor = isLight ? 'ffffff' : '09090b';
  const qrSvgData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pageUrl)}&color=${qrColor}&bgcolor=${qrBgColor}`;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl z-10 text-center ${
              isLight ? 'bg-white border border-zinc-200 text-zinc-900' : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer ${
                isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
              }`}
              aria-label="Tutup Modal QR"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              isLight ? 'bg-zinc-100 border border-zinc-200 text-zinc-700' : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
            }`}>
              <QrCode className="w-3.5 h-3.5 text-emerald-500" /> Sakode QR Code
            </div>
            <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Scan & Bagikan Link
            </h3>
            <p className={`text-xs mb-5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Pindai kode QR di bawah untuk membuka halaman di perangkat seluler.
            </p>

            {/* QR Card Frame */}
            <div className={`relative mx-auto w-52 h-52 p-3 rounded-xl border shadow-sm flex items-center justify-center mb-5 ${
              isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <img
                src={qrSvgData}
                alt="QR Code Sakode Academy"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">Tautan Berhasil Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>Salin Alamat Halaman (URL)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWa}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
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
