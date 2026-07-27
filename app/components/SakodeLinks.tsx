'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  QrCode, 
  Share2, 
  Sparkles, 
  BadgeCheck,
  ArrowUpRight,
  Sun,
  Moon,
  Zap,
  Camera,
  Video,
  Globe,
  Mail,
  Send
} from 'lucide-react';
import { WhatsappIcon, InstagramIcon, TiktokIcon, WebsiteIcon, EmailIcon, SakodeLogoSvg } from './Icons';
import { WebsiteStatusModal } from './WebsiteStatusModal';
import { QrModal } from './QrModal';
import { BackgroundEffects } from './BackgroundEffects';
import { CustomCursor } from './CustomCursor';

interface DocumentWithViewTransition {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
}

type ThemeMode = 'dark' | 'light';

export function SakodeLinks() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [websiteModalOpen, setWebsiteModalOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [copiedPage, setCopiedPage] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isLight = theme === 'light';

  const handleThemeSwitch = (targetTheme: ThemeMode, e: React.MouseEvent<HTMLButtonElement>) => {
    if (targetTheme === theme) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const doc = typeof document !== 'undefined' ? (document as DocumentWithViewTransition) : null;

    if (doc?.startViewTransition) {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        setTheme(targetTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          [
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
          ],
          {
            duration: 450,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      setTheme(targetTheme);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCopyPageLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://sakode.academy';
    navigator.clipboard.writeText(url);
    setCopiedPage(true);
    showToast('Tautan halaman Sakode Academy berhasil disalin');
    setTimeout(() => setCopiedPage(false), 2000);
  };

  // Stagger Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 350,
        damping: 25
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
        isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
      }`}
    >
      {/* Custom Cursor + Meteor Trail */}
      <CustomCursor theme={theme} />

      {/* Background Grid */}
      {!isLight && <BackgroundEffects />}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 sm:py-12 flex flex-col items-center"
      >
        
        {/* Top Control Dock */}
        <motion.div variants={itemVariants} className="w-full flex items-center justify-between mb-8 px-1">
          
          {/* Theme Switcher Dock */}
          <div className={`relative flex items-center p-1 rounded-xl border transition-colors duration-300 ${
            isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleThemeSwitch('dark', e)}
              className={`relative z-10 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isLight ? 'text-white' : 'text-zinc-400 hover:text-zinc-900'
              }`}
              title="Mode Gelap"
            >
              <Moon className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleThemeSwitch('light', e)}
              className={`relative z-10 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight ? 'text-zinc-900' : 'text-zinc-400 hover:text-white'
              }`}
              title="Mode Terang"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </motion.button>

            {/* Sliding Pill Indicator */}
            <motion.div
              layoutId="themePill"
              initial={false}
              animate={{
                x: isLight ? 32 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`absolute top-1 left-1 bottom-1 w-7 rounded-lg shadow-sm ${
                isLight ? 'bg-zinc-100' : 'bg-zinc-800'
              }`}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setQrModalOpen(true)}
              className={`p-2.5 rounded-xl border transition-colors duration-300 cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isLight 
                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Tampilkan Kode QR"
            >
              <QrCode className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">QR Code</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleCopyPageLink}
              className={`p-2.5 rounded-xl border transition-colors duration-300 cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isLight 
                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Bagikan Tautan"
            >
              {copiedPage ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-zinc-500" />}
              <span className="hidden sm:inline">{copiedPage ? 'Tersalin' : 'Bagikan'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Profile / Logo Header */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col items-center text-center mb-8"
        >
          {/* Logo Card */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setWebsiteModalOpen(true)}
            className="w-full max-w-xs mb-4 cursor-pointer relative group"
          >
            <SakodeLogoSvg className="w-full h-auto" theme={theme} />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-500 rounded-full text-zinc-950 shadow-md flex items-center justify-center"
            >
              <BadgeCheck className="w-4 h-4 fill-emerald-500 text-zinc-950" />
            </motion.div>
          </motion.div>

          {/* Title & Tagline */}
          <h1 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            Sakode Academy
          </h1>

          <p className={`text-xs max-w-sm font-medium leading-relaxed mb-1 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Masa Depan Digital, Dimulai Dari Sini
          </p>
        </motion.div>

        {/* Links Grid */}
        <motion.div variants={containerVariants} className="w-full space-y-3 mb-8">
          
          {/* WhatsApp Card */}
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/message/UTMRQNH4ERNBM1"
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full p-4 rounded-xl border transition-colors duration-300 group shadow-sm ${
              isLight 
                ? 'bg-white border-zinc-200 hover:border-emerald-500/50 hover:shadow-md' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`p-2.5 rounded-lg border shrink-0 group-hover:scale-105 transition-transform ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-800 border-zinc-700 text-emerald-400'
              }`}>
                <WhatsappIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-zinc-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'
                  }`}>
                    WhatsApp Official
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-800 text-emerald-400 border-zinc-700'
                  }`}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Zap className="w-3 h-3 text-emerald-500" />
                    </motion.div>
                    Respon Cepat
                  </span>
                </div>
                <p className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Konsultasi pendaftaran bootcamp & info program akademi
                </p>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLight ? 'text-zinc-400 group-hover:text-emerald-600' : 'text-zinc-400 group-hover:text-emerald-400'
              }`}>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* Instagram Card */}
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href="https://www.instagram.com/sakodeacademy?igsh=MWZiNmR3ODU4NG12ZA=="
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full p-4 rounded-xl border transition-colors duration-300 group shadow-sm ${
              isLight 
                ? 'bg-white border-zinc-200 hover:border-pink-500/50 hover:shadow-md' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`p-2.5 rounded-lg border shrink-0 group-hover:scale-105 transition-transform ${
                isLight ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-zinc-800 border-zinc-700 text-pink-400'
              }`}>
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-zinc-900 group-hover:text-pink-600' : 'text-white group-hover:text-pink-400'
                  }`}>
                    Instagram @sakodeacademy
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isLight ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-zinc-800 text-pink-400 border-zinc-700'
                  }`}>
                    <Camera className="w-3 h-3 text-pink-500" /> Official IG
                  </span>
                </div>
                <p className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Update kegiatan, informasi event, dan materi edukasi
                </p>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLight ? 'text-zinc-400 group-hover:text-pink-600' : 'text-zinc-400 group-hover:text-pink-400'
              }`}>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* Website Portal Special Action Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setWebsiteModalOpen(true)}
            className={`w-full p-4 rounded-xl border transition-colors duration-300 cursor-pointer group shadow-sm ${
              isLight 
                ? 'bg-white border-zinc-200 hover:border-cyan-500/50 hover:shadow-md' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`p-2.5 rounded-lg border shrink-0 group-hover:scale-105 transition-transform ${
                isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-zinc-800 border-zinc-700 text-cyan-400'
              }`}>
                <WebsiteIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-zinc-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'
                  }`}>
                    Website Portal Official
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-zinc-800 text-cyan-400 border-zinc-700'
                  }`}>
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                    </motion.div>
                    Sneak Peek v2.0
                  </span>
                </div>
                <p className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Portal pembelajaran LMS dan hub komunitas (Versi 2.0)
                </p>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLight ? 'text-zinc-400 group-hover:text-cyan-600' : 'text-zinc-400 group-hover:text-cyan-400'
              }`}>
                <Globe className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>

          {/* TikTok Card */}
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href="https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/"
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full p-4 rounded-xl border transition-colors duration-300 group shadow-sm ${
              isLight 
                ? 'bg-white border-zinc-200 hover:border-sky-500/50 hover:shadow-md' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`p-2.5 rounded-lg border shrink-0 group-hover:scale-105 transition-transform ${
                isLight ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-zinc-800 border-zinc-700 text-sky-400'
              }`}>
                <TiktokIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-zinc-900 group-hover:text-sky-600' : 'text-white group-hover:text-sky-400'
                  }`}>
                    TikTok Sakode Academy
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isLight ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-zinc-800 text-sky-400 border-zinc-700'
                  }`}>
                    <Video className="w-3 h-3 text-sky-500" /> Video Shorts
                  </span>
                </div>
                <p className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Konten video edukasi koding dan seputar dunia teknologi
                </p>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLight ? 'text-zinc-400 group-hover:text-sky-600' : 'text-zinc-400 group-hover:text-sky-400'
              }`}>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* Email Card */}
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:sakodeacademy@gmail.com"
            className={`block w-full p-4 rounded-xl border transition-colors duration-300 group shadow-sm ${
              isLight 
                ? 'bg-white border-zinc-200 hover:border-amber-500/50 hover:shadow-md' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`p-2.5 rounded-lg border shrink-0 group-hover:scale-105 transition-transform ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-zinc-800 border-zinc-700 text-amber-400'
              }`}>
                <EmailIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-zinc-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-400'
                  }`}>
                    Email Business & Partnership
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-800 text-amber-400 border-zinc-700'
                  }`}>
                    <Mail className="w-3 h-3 text-amber-500" /> Official Email
                  </span>
                </div>
                <p className={`text-xs truncate font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  sakodeacademy@gmail.com
                </p>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLight ? 'text-zinc-400 group-hover:text-amber-600' : 'text-zinc-400 group-hover:text-amber-400'
              }`}>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </motion.a>

        </motion.div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="mt-8 text-center text-xs text-zinc-400 space-y-1">
          <p className={`font-medium ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
            Sakode Academy • Samarang, Garut, Jawa Barat
          </p>
          <p suppressHydrationWarning className={`text-[11px] ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
            © {new Date().getFullYear()} Sakode Academy. Hak cipta dilindungi.
          </p>
        </motion.footer>

      </motion.div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-xs font-medium shadow-xl flex items-center gap-2 ${
              isLight 
                ? 'bg-white border-zinc-300 text-zinc-900' 
                : 'bg-zinc-900 border-zinc-800 text-white'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <WebsiteStatusModal
        isOpen={websiteModalOpen}
        onClose={() => setWebsiteModalOpen(false)}
        theme={theme}
      />

      <QrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        theme={theme}
      />

    </div>
  );
}
