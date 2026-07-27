'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MousePointer, 
  Sparkles, 
  Circle, 
  Crosshair, 
  Monitor, 
  Code, 
  Eye, 
  Droplet, 
  Star,
  Flame,
  Disc
} from 'lucide-react';
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
      id: 'lens',
      title: 'Magnifier Glass (Default)',
      desc: 'Lensa spotlight melingkar dengan efek kaca pembesar & warna terbalik',
      icon: <Eye className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'meteor',
      title: 'Meteor Glow',
      desc: 'Kursor bercahaya dengan ekor percikan meteor berpendar',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'minimal',
      title: 'Minimal Ring',
      desc: 'Titik kursor bersih & follower ring tanpa ekor meteor',
      icon: <Circle className="w-4 h-4 text-cyan-500" />,
    },
    {
      id: 'crosshair',
      title: 'Neon Crosshair',
      desc: 'Kursor ring target tech berpintal & garis silang presisi',
      icon: <Crosshair className="w-4 h-4 text-pink-500" />,
    },
    {
      id: 'blob',
      title: 'Fluid Liquid Blob',
      desc: 'Kursor bentuk fluida cair yang membal & elastis saat bergerak',
      icon: <Droplet className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'code',
      title: 'Sakode Symbol </ >',
      desc: 'Ikon simbol koding khas Sakode Academy melayang mengikutimu',
      icon: <Code className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'sparkles',
      title: 'Starry Dust Wand',
      desc: 'Taburan bintang emas berpendar melayang di belakang kursor',
      icon: <Star className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'comet',
      title: 'Fire Comet Trail',
      desc: 'Ekor komest api merah-oranye Sakode menyembur dari kursor',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'target',
      title: 'Radar Sonar Target',
      desc: 'Denyut radar sonar melingkar berpulsasi mengelilingi titik kursor',
      icon: <Disc className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'default',
      title: 'Default OS Cursor',
      desc: 'Gunakan kursor panah bawaan Windows / Sistem Operasi',
      icon: <Monitor className="w-4 h-4 text-zinc-400" />,
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
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative z-10 w-full max-w-md max-h-[85vh] rounded-2xl border p-5 sm:p-6 shadow-2xl flex flex-col ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-800 border-zinc-700 text-emerald-400'
              }`}>
                <MousePointer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Gaya Kursor Desktop</h2>
                <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  10 Pilihan Kursor Interaktif
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

          {/* Options List Grid */}
          <div className="overflow-y-auto space-y-2 py-4 px-0.5 max-h-[50vh] scrollbar-none">
            {options.map((opt) => {
              const isSelected = cursorStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectCursor(opt.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? isLight
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-emerald-950/40 border-emerald-500/80 shadow-sm'
                      : isLight
                        ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                        : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
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
              Gaya kursor kustom hanya aktif pada tampilan desktop web.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
