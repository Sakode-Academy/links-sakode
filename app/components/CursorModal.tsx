'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer, Sparkles, Circle, Crosshair, Monitor } from 'lucide-react';
import { CursorStyle } from './CustomCursor';

interface CursorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cursorStyle: CursorStyle;
  onSelectCursor: (style: CursorStyle) => void;
  theme?: 'dark' | 'light';
}

export function CursorModal({
  isOpen,
  onClose,
  cursorStyle,
  onSelectCursor,
  theme = 'dark',
}: CursorModalProps) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const options: { id: CursorStyle; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'meteor',
      title: 'Meteor Glow',
      desc: 'Kursor bercahaya dengan ekor percikan meteor berpendar',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'minimal',
      title: 'Minimal Ring',
      desc: 'Titik kursor bersih & follower ring tanpa ekor meteor',
      icon: <Circle className="w-5 h-5 text-cyan-500" />,
    },
    {
      id: 'crosshair',
      title: 'Neon Crosshair',
      desc: 'Kursor ring target tech berpintal & garis silang presisi',
      icon: <Crosshair className="w-5 h-5 text-pink-500" />,
    },
    {
      id: 'default',
      title: 'Default OS',
      desc: 'Gunakan kursor panah bawaan Windows / Sistem Operasi',
      icon: <Monitor className="w-5 h-5 text-amber-500" />,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative z-10 w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-800 border-zinc-700 text-emerald-400'
              }`}>
                <MousePointer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Gaya Kursor Mouse</h2>
                <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Pilih tampilan kursor untuk layar desktop
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isLight ? 'border-zinc-200 hover:bg-zinc-100' : 'border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 my-5">
            {options.map((opt) => {
              const isSelected = cursorStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectCursor(opt.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? isLight
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-emerald-950/40 border-emerald-500/80 shadow-sm'
                      : isLight
                        ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                        : 'bg-zinc-800/60 border-zinc-700/60 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
                    }`}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold">{opt.title}</h3>
                      <p className={`text-[11px] leading-tight ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-zinc-800/40 text-center">
            <p className={`text-[10px] ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Pengaturan kursor berlaku khusus untuk layar perangkat desktop.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
