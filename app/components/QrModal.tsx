'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Copy, Check, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
}

export function QrModal({ isOpen, onClose, currentUrl }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : 'https://sakode.academy/links');

  const qrSvgData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pageUrl)}&color=ffffff&bgcolor=09090b`;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100 z-10 text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup Modal QR"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Sakode QR Code
            </div>
            <h3 className="text-base font-bold text-white mb-1">Scan & Bagikan Link</h3>
            <p className="text-xs text-zinc-400 mb-5">Pindai kode QR di bawah untuk membuka halaman di perangkat seluler.</p>

            {/* QR Card Frame */}
            <div className="relative mx-auto w-52 h-52 p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg flex items-center justify-center mb-5">
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
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tautan Berhasil Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Salin Alamat Halaman (URL)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWa}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
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
