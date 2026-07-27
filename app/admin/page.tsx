'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  onAuthStateChanged, 
  signOut, 
  User, 
  GoogleAuthProvider, 
  linkWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { 
  SAKODE_LINKS, 
  DEFAULT_HEADER_CONTENT, 
  SakodeLink, 
  SiteHeaderContent, 
  IconNameType 
} from '../data/links';
import { DynamicIcon, SakodeLogoSvg } from '../components/Icons';
import { 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Layout, 
  Link as LinkIcon, 
  ExternalLink,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Globe
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Tab State: 'content' | 'links'
  const [activeTab, setActiveTab] = useState<'content' | 'links'>('content');

  // Form States
  const [headerContent, setHeaderContent] = useState<SiteHeaderContent>(DEFAULT_HEADER_CONTENT);
  const [linksList, setLinksList] = useState<SakodeLink[]>(SAKODE_LINKS);

  // Status & Feedback
  const [saving, setSaving] = useState(false);
  const [linkingGoogle, setLinkingGoogle] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal / Form state for Add/Edit Link
  const [editingLink, setEditingLink] = useState<SakodeLink | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Protect Admin Page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Load Content & Links from Firestore (with fallback)
  useEffect(() => {
    if (!user) return;

    // Real-time listener for Header Content
    const contentRef = doc(db, 'settings', 'content');
    const unsubContent = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        setHeaderContent(docSnap.data() as SiteHeaderContent);
      }
    }, (err) => {
      console.log('Firestore snapshot fallback:', err.message);
    });

    // Real-time listener for Links List
    const linksRef = doc(db, 'settings', 'links');
    const unsubLinks = onSnapshot(linksRef, (docSnap) => {
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        setLinksList(docSnap.data().items as SakodeLink[]);
      }
    }, (err) => {
      console.log('Firestore links fallback:', err.message);
    });

    return () => {
      unsubContent();
      unsubLinks();
    };
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  // Link Google Account to current user
  const handleLinkGoogle = async () => {
    if (!auth.currentUser) return;
    setLinkingGoogle(true);
    setErrorMsg(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(auth.currentUser, provider);
      setUser(result.user);
      showToast('Akun Google berhasil dikaitkan! Sekarang Anda bisa login via Google.');
    } catch (err: any) {
      console.error('Google linking error:', err);
      if (err.code === 'auth/credential-already-in-use') {
        setErrorMsg('Akun Google ini sudah terhubung dengan pengguna lain.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Pengaitan Google dibatalkan.');
      } else {
        setErrorMsg(err.message || 'Gagal mengaitkan akun Google.');
      }
    } finally {
      setLinkingGoogle(false);
    }
  };

  // Save Header Content to Firestore
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const contentRef = doc(db, 'settings', 'content');
      await setDoc(contentRef, headerContent, { merge: true });
      
      localStorage.setItem('sakode_header_content', JSON.stringify(headerContent));
      showToast('Teks header & modal portal berhasil disimpan!');
    } catch (err: any) {
      console.error('Error saving content:', err);
      localStorage.setItem('sakode_header_content', JSON.stringify(headerContent));
      showToast('Teks disimpan lokal (Fallback Mode)');
    } finally {
      setSaving(false);
    }
  };

  // Save Links to Firestore
  const handleSaveLinks = async (updatedLinks?: SakodeLink[]) => {
    const listToSave = updatedLinks || linksList;
    setSaving(true);
    setErrorMsg(null);

    try {
      const linksRef = doc(db, 'settings', 'links');
      await setDoc(linksRef, { items: listToSave }, { merge: true });
      
      localStorage.setItem('sakode_links_list', JSON.stringify(listToSave));
      showToast('Daftar link berhasil diperbarui!');
    } catch (err: any) {
      console.error('Error saving links:', err);
      localStorage.setItem('sakode_links_list', JSON.stringify(listToSave));
      showToast('Link disimpan lokal (Fallback Mode)');
    } finally {
      setSaving(false);
    }
  };

  // Link Operations
  const handleToggleEnable = (id: string) => {
    const updated = linksList.map(item => 
      item.id === id ? { ...item, isEnabled: item.isEnabled === false ? true : false } : item
    );
    setLinksList(updated);
    handleSaveLinks(updated);
  };

  const handleDeleteLink = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tautan ini?')) return;
    const updated = linksList.filter(item => item.id !== id);
    setLinksList(updated);
    handleSaveLinks(updated);
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= linksList.length) return;

    const updated = [...linksList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setLinksList(reordered);
    handleSaveLinks(reordered);
  };

  const handleSaveLinkItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    let updated: SakodeLink[];
    const exists = linksList.some(item => item.id === editingLink.id);

    if (exists) {
      updated = linksList.map(item => item.id === editingLink.id ? editingLink : item);
    } else {
      updated = [...linksList, { ...editingLink, order: linksList.length + 1, isEnabled: true }];
    }

    setLinksList(updated);
    handleSaveLinks(updated);
    setEditingLink(null);
    setIsAddModalOpen(false);
  };

  const availableIcons: { id: IconNameType; label: string }[] = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'website', label: 'Website' },
    { id: 'email', label: 'Email' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'github', label: 'GitHub' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'discord', label: 'Discord' },
    { id: 'link', label: 'Link Tautan Custom' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-pulse">
          <Sparkles className="w-4 h-4" /> Memeriksa Otentikasi Firebase...
        </div>
      </div>
    );
  }

  const isGoogleLinked = user?.providerData.some(p => p.providerId === 'google.com');

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-28">
              <SakodeLogoSvg className="w-full h-auto" theme="dark" />
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Live</span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        
        {/* Account Security & Google Account Link Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold">Status Otentikasi Admin</h3>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-zinc-700">
                  {user?.email}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isGoogleLinked 
                  ? 'Akun ini telah terhubung dengan Google Sign-In.' 
                  : 'Akun ini menggunakan login Email/Password. Kaitkan ke Google untuk login lebih cepat.'}
              </p>
            </div>
          </div>

          {/* Google Link Status / Action */}
          {isGoogleLinked ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <UserCheck className="w-4 h-4" />
              <span>Terhubung dengan Google</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLinkGoogle}
              disabled={linkingGoogle}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50 border border-zinc-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{linkingGoogle ? 'Kaitkan...' : 'Kaitkan Akun Google'}</span>
            </motion.button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-zinc-800/80 pb-3">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Edit Teks Web & Header</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Kelola Daftar Link ({linksList.length})</span>
          </button>
        </div>

        {/* TAB 1: CONTENT EDITOR */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Content Section */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/60">
                <div>
                  <h2 className="text-base font-bold">Kustomisasi Header & Branding</h2>
                  <p className="text-xs text-zinc-400">Edit Judul, Tagline, dan Lokasi yang ditampilkan pada website utama.</p>
                </div>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Judul Utama Web
                  </label>
                  <input
                    type="text"
                    required
                    value={headerContent.title}
                    onChange={(e) => setHeaderContent({ ...headerContent, title: e.target.value })}
                    placeholder="Sakode Academy"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Tagline Resmi Sakode
                  </label>
                  <input
                    type="text"
                    required
                    value={headerContent.tagline}
                    onChange={(e) => setHeaderContent({ ...headerContent, tagline: e.target.value })}
                    placeholder="Masa Depan Digital, Dimulai Dari Sini"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Teks Lokasi & Footer
                  </label>
                  <input
                    type="text"
                    required
                    value={headerContent.location}
                    onChange={(e) => setHeaderContent({ ...headerContent, location: e.target.value })}
                    placeholder="Samarang, Garut, Jawa Barat"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Modal Status Portal Customization Section */}
                <div className="pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white">Pengaturan Modal Status Portal LMS</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Teks Badge Status Modal
                      </label>
                      <input
                        type="text"
                        value={headerContent.modalBadge || ''}
                        onChange={(e) => setHeaderContent({ ...headerContent, modalBadge: e.target.value })}
                        placeholder="Launching Soon 2026"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Persentase Progress LMS
                      </label>
                      <input
                        type="text"
                        value={headerContent.modalProgress || ''}
                        onChange={(e) => setHeaderContent({ ...headerContent, modalProgress: e.target.value })}
                        placeholder="85%"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Judul Modal Portal
                    </label>
                    <input
                      type="text"
                      value={headerContent.modalTitle || ''}
                      onChange={(e) => setHeaderContent({ ...headerContent, modalTitle: e.target.value })}
                      placeholder="Portal Website Sakode 2.0"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Deskripsi Modal Portal
                    </label>
                    <textarea
                      rows={2}
                      value={headerContent.modalDesc || ''}
                      onChange={(e) => setHeaderContent({ ...headerContent, modalDesc: e.target.value })}
                      placeholder="Website resmi Sakode Academy sedang dalam tahap pengembangan..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/60 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Semua Teks & Modal'}</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LINKS MANAGER */}
        {activeTab === 'links' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Kelola Kartu Tautan (Links)</h2>
                <p className="text-xs text-zinc-400">Tambah, edit, hapus, dan atur urutan posisi setiap link.</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingLink({
                    id: 'link_' + Date.now(),
                    title: '',
                    subtitle: '',
                    url: 'https://',
                    category: 'social',
                    badge: '',
                    iconName: 'link',
                    order: linksList.length + 1,
                    isEnabled: true,
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Link Baru</span>
              </motion.button>
            </div>

            {/* Links Cards List */}
            <div className="space-y-3">
              {linksList.map((item, index) => {
                const isEnabled = item.isEnabled !== false;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isEnabled
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-zinc-950/60 border-zinc-900 text-zinc-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400 shrink-0">
                        <DynamicIcon iconName={item.iconName} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold truncate">{item.title}</h3>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-semibold text-emerald-400 border border-zinc-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate">{item.subtitle}</p>
                        <p className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">{item.url}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleMoveLink(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveLink(index, 'down')}
                        disabled={index === linksList.length - 1}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleEnable(item.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                          isEnabled
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                        }`}
                        title={isEnabled ? 'Sembunyikan Link' : 'Tampilkan Link'}
                      >
                        {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingLink(item);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-amber-400 cursor-pointer transition-colors"
                        title="Edit Link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(item.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                        title="Hapus Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </main>

      {/* Add / Edit Link Modal */}
      <AnimatePresence>
        {isAddModalOpen && editingLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-base font-bold mb-4 pb-2 border-b border-zinc-800">
                {linksList.some(i => i.id === editingLink.id) ? 'Edit Link' : 'Tambah Link Baru'}
              </h2>

              <form onSubmit={handleSaveLinkItem} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Judul Link
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.title}
                    onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                    placeholder="Contoh: Official Instagram"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Deskripsi / Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.subtitle}
                    onChange={(e) => setEditingLink({ ...editingLink, subtitle: e.target.value })}
                    placeholder="Contoh: Update kegiatan & edukasi"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    URL Tujuan
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    placeholder="https://instagram.com/sakodeacademy"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Ikon
                    </label>
                    <select
                      value={editingLink.iconName}
                      onChange={(e) => setEditingLink({ ...editingLink, iconName: e.target.value as IconNameType })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {availableIcons.map(ic => (
                        <option key={ic.id} value={ic.id}>{ic.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Teks Badge (Opsional)
                    </label>
                    <input
                      type="text"
                      value={editingLink.badge || ''}
                      onChange={(e) => setEditingLink({ ...editingLink, badge: e.target.value })}
                      placeholder="Contoh: Official IG"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-md cursor-pointer"
                  >
                    Simpan Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-xs font-medium shadow-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
