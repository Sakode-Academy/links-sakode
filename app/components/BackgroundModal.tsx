'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutGrid, 
  Network, 
  Sparkles, 
  Terminal, 
  Palette, 
  Orbit, 
  Activity, 
  Cpu 
} from 'lucide-react';
import { BackgroundStyle } from './BackgroundEffects';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgStyle: BackgroundStyle;
  onSelectBg: (style: BackgroundStyle) => void;
  theme?: 'dark' | 'light';
}

export function BackgroundModal({
  isOpen,
  onClose,
  bgStyle,
  onSelectBg,
  theme = 'dark',
}: BackgroundModalProps) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const options: { id: BackgroundStyle; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'constellation',
      title: 'Sakode Constellation Web',
      desc: 'Jaringan partikel laser tebal berpendar warna-warni palet Sakode Academy',
      icon: <Network className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'grid',
      title: 'Interactive Grid Glow',
      desc: 'Garis grid bersih dengan efek sorot cahaya ambient mengikuti kursor',
      icon: <LayoutGrid className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'aurora',
      title: 'Ambient Aurora Waves',
      desc: 'Gelombang gradien warna lembut melayang & bertransisi secara dinamis',
      icon: <Sparkles className="w-4 h-4 text-pink-500" />,
    },
    {
      id: 'matrix',
      title: 'Matrix Code Rain',
      desc: 'Hujan kode biner digital & karakter koding khas Sakode Academy',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'starfield',
      title: '3D Cosmic Starfield',
      desc: 'Partikel bintang 3D melayang berkedip dengan efek persepsi kedalaman',
      icon: <Orbit className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'waveform',
      title: 'Cyber Waveform Optics',
      desc: 'Gelombang sinus kontinu yang melengkung meliuk merespons kursor',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'circuit',
      title: 'Digital Circuit Trace',
      desc: 'Jalur sirkuit elektronik PCB dengan denyut elektron berpendar',
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
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
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Gaya Latar Belakang</h2>
                <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  7 Efek Latar Interaktif
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
              const isSelected = bgStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectBg(opt.id);
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
              Ganti gaya latar belakang untuk menyesuaikan suasana visual web.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
