'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  BadgeCheck, 
  Globe, 
  MessageSquare, 
  GraduationCap, 
  ShieldCheck, 
  Palette,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAKODE_LINKS, SakodeLink } from '../data/links';
import { WhatsappIcon, InstagramIcon, TiktokIcon, WebsiteIcon, EmailIcon, SakodeLogoSvg } from './Icons';
import { WebsiteStatusModal } from './WebsiteStatusModal';
import { QrModal } from './QrModal';
import { ReactionSection } from './ReactionSection';
import { BackgroundEffects } from './BackgroundEffects';

type ThemeOption = 'obsidian' | 'neon' | 'emerald' | 'glass';

export function SakodeLinks() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<ThemeOption>('obsidian');
  const [websiteModalOpen, setWebsiteModalOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedPageLink, setCopiedPageLink] = useState<boolean>(false);

  // Link click counter tracker stored in state
  const [clickCounts, setClickCounts] = useState<{ [key: string]: number }>({
    whatsapp: 1420,
    instagram: 980,
    website: 650,
    tiktok: 840,
    email: 310,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyLink = (link: SakodeLink, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (link.isSpecialAction) {
      setWebsiteModalOpen(true);
      return;
    }

    navigator.clipboard.writeText(link.url);
    setCopiedLinkId(link.id);
    showToast(`Tautan ${link.title} berhasil disalin!`);
    
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });

    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const handleCopyPageLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://sakode.academy';
    navigator.clipboard.writeText(url);
    setCopiedPageLink(true);
    showToast('Tautan Halaman Sakode Academy berhasil disalin! 🚀');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => setCopiedPageLink(false), 2500);
  };

  const handleLinkClick = (link: SakodeLink, e: React.MouseEvent) => {
    // Track click count
    setClickCounts((prev) => ({
      ...prev,
      [link.id]: (prev[link.id] || 0) + 1,
    }));

    if (link.isSpecialAction) {
      e.preventDefault();
      setWebsiteModalOpen(true);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'whatsapp':
        return <WhatsappIcon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case 'instagram':
        return <InstagramIcon className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />;
      case 'tiktok':
        return <TiktokIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />;
      case 'website':
        return <WebsiteIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />;
      case 'email':
        return <EmailIcon className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />;
      default:
        return <Globe className="w-6 h-6 text-blue-400" />;
    }
  };

  // Filter links
  const filteredLinks = SAKODE_LINKS.filter((link) => {
    const matchesCategory = activeCategory === 'all' || link.category === activeCategory;
    const matchesQuery = 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Theme container classes
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'neon':
        return 'bg-slate-950 text-slate-100 selection:bg-fuchsia-500 selection:text-white';
      case 'emerald':
        return 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white';
      case 'glass':
        return 'bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-slate-950';
      default:
        return 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950';
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden font-sans transition-colors duration-500 ${getThemeWrapperClass()}`}>
      {/* Background Animated Layer */}
      <BackgroundEffects theme={theme} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        {/* Top Control Bar (Theme Selector & Share) */}
        <div className="w-full flex items-center justify-between mb-8 px-2">
          {/* Theme Toggle Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setTheme('obsidian')}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer ${theme === 'obsidian' ? 'ring-2 ring-cyan-400 scale-110 bg-cyan-500' : 'bg-slate-700 hover:bg-slate-600'}`}
              title="Obsidian Dark"
            />
            <button
              onClick={() => setTheme('neon')}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer ${theme === 'neon' ? 'ring-2 ring-fuchsia-400 scale-110 bg-fuchsia-500' : 'bg-purple-900 hover:bg-purple-800'}`}
              title="Neon Cyberpunk"
            />
            <button
              onClick={() => setTheme('emerald')}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer ${theme === 'emerald' ? 'ring-2 ring-emerald-400 scale-110 bg-emerald-500' : 'bg-teal-900 hover:bg-teal-800'}`}
              title="Emerald Tech"
            />
            <button
              onClick={() => setTheme('glass')}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer ${theme === 'glass' ? 'ring-2 ring-sky-300 scale-110 bg-sky-300' : 'bg-slate-600 hover:bg-slate-500'}`}
              title="Clean Glass"
            />
          </div>

          {/* Share & QR Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title="Tampilkan QR Code"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code</span>
            </button>

            <button
              onClick={handleCopyPageLink}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 backdrop-blur-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title="Salin Link"
            >
              {copiedPageLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedPageLink ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center text-center mb-6"
        >
          {/* Animated Avatar Logo */}
          <div className="relative mb-6 cursor-pointer group" onClick={() => setWebsiteModalOpen(true)}>
            <SakodeLogoSvg className="w-64 sm:w-80 h-auto" />
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-full border-2 border-slate-950 text-white shadow-xl flex items-center justify-center" title="Terverifikasi">
              <BadgeCheck className="w-5 h-5 fill-emerald-500 text-slate-950" />
            </div>
          </div>

          {/* Title & Badge */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              Sakode Academy
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Official
            </span>
          </div>

          {/* Subtitle / Bio */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-4">
            Komunitas & Akademi Talenta Digital Papua 🚀 Belajar Koding, Fullstack Web Development & Inovasi Teknologi Masa Depan.
          </p>

          {/* Clickable Admission Status Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              window.open('https://wa.me/message/UTMRQNH4ERNBM1', '_blank');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-500/10 cursor-pointer hover:border-emerald-400 transition-all"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Pendaftaran Bootcamp Batch #2026 Dibuka</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Featured Card (Flagship Program Preview) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-cyan-500/30 shadow-xl shadow-cyan-500/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Featured Program
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
              Jayapura, Papua
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            Bootcamp Fullstack Web & Modern Digital Skills
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Bimbingan hands-on dari zero hingga siap bangun aplikasi nyata. Dilengkapi dengan konsultasi 1-on-1 & sertifikat.
          </p>

          <a
            href="https://wa.me/message/UTMRQNH4ERNBM1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Daftar / Tanya Info via WhatsApp</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </a>
        </motion.div>

        {/* Search & Category Filter Controls */}
        <div className="w-full space-y-3 mb-6">
          {/* Live Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tautan (contoh: WhatsApp, Instagram, Website)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 backdrop-blur-md transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Semua ({SAKODE_LINKS.length})
            </button>
            <button
              onClick={() => setActiveCategory('contact')}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'contact'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              💬 Kontak & WA
            </button>
            <button
              onClick={() => setActiveCategory('social')}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'social'
                  ? 'bg-pink-500 text-slate-950 font-bold shadow-md shadow-pink-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📸 Sosial Media
            </button>
            <button
              onClick={() => setActiveCategory('website')}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'website'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌐 Portal Web
            </button>
          </div>
        </div>

        {/* Links List Cards */}
        <div className="w-full space-y-3.5 mb-8">
          <AnimatePresence mode="popLayout">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link, idx) => (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative"
                >
                  <a
                    href={link.url}
                    target={link.isSpecialAction ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(link, e)}
                    className={`block w-full p-4 sm:p-4.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md transition-all duration-300 ${link.glowColor} group-hover:-translate-y-0.5 shadow-lg relative overflow-hidden`}
                  >
                    {/* Inner Subtle Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                    <div className="relative z-10 flex items-center justify-between gap-3">
                      {/* Left: Icon Badge */}
                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 shadow-inner">
                        {renderIcon(link.iconName)}
                      </div>

                      {/* Center: Title & Subtitle */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {link.title}
                          </h4>
                          {link.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${link.badgeColor}`}>
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 leading-snug">
                          {link.subtitle}
                        </p>
                      </div>

                      {/* Right: Quick Copy Button & External Arrow */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleCopyLink(link, e)}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedLinkId === link.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <div className="p-2 rounded-xl text-slate-500 group-hover:text-cyan-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-xs"
              >
                Tautan &quot;{searchQuery}&quot; tidak ditemukan. Coba kata kunci lain.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Reaction Counter Section */}
        <ReactionSection />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-300 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            <span>Made with ❤️ by Sakode Academy Team</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">Jayapura, Papua</span>
          </div>
          <p className="text-[11px] text-slate-300">
            © {new Date().getFullYear()} Sakode Academy. All rights reserved.
          </p>
        </footer>

      </div>

      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 text-white text-xs font-semibold shadow-2xl shadow-cyan-500/20 flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modals */}
      <WebsiteStatusModal
        isOpen={websiteModalOpen}
        onClose={() => setWebsiteModalOpen(false)}
      />

      <QrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
