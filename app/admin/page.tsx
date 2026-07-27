'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  onAuthStateChanged, 
  signOut, 
  User, 
  GoogleAuthProvider, 
  linkWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot,
  collection,
  deleteDoc
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
  Globe,
  Users,
  KeyRound,
  UserPlus,
  BarChart3,
  CheckCircle2,
  UserCheck2
} from 'lucide-react';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'Super Admin' | 'Editor';
  createdAt: string;
  lastLogin?: string;
  isGoogleLinked?: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Tab State: 'overview' | 'content' | 'links' | 'admins'
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'links' | 'admins'>('overview');

  // Form States
  const [headerContent, setHeaderContent] = useState<SiteHeaderContent>(DEFAULT_HEADER_CONTENT);
  const [linksList, setLinksList] = useState<SakodeLink[]>(SAKODE_LINKS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // Status & Feedback
  const [saving, setSaving] = useState(false);
  const [linkingGoogle, setLinkingGoogle] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [editingLink, setEditingLink] = useState<SakodeLink | null>(null);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

  // Admin User Creation Modal
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Super Admin' | 'Editor'>('Editor');
  const [adminCreating, setAdminCreating] = useState(false);

  // Protect Admin Page & Auth Subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        setCurrentUser(user);
        
        // Auto register/update current admin profile in Firestore safely
        try {
          const adminRef = doc(db, 'admins', user.uid);
          const adminData: AdminUser = {
            uid: user.uid,
            email: user.email || 'admin@sakode.com',
            displayName: user.displayName || user.email?.split('@')[0] || 'Admin Sakode',
            role: 'Super Admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isGoogleLinked: user.providerData.some(p => p.providerId === 'google.com')
          };
          await setDoc(adminRef, adminData, { merge: true });
        } catch (e: any) {
          console.log('Admin record sync notice:', e.message);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Real-time Listeners for Content, Links, and Admin Users
  useEffect(() => {
    if (!currentUser) return;

    // 1. Header Content
    const contentRef = doc(db, 'settings', 'content');
    const unsubContent = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        setHeaderContent(docSnap.data() as SiteHeaderContent);
      }
    }, (err) => console.log('Content snapshot fallback:', err.message));

    // 2. Links List
    const linksRef = doc(db, 'settings', 'links');
    const unsubLinks = onSnapshot(linksRef, (docSnap) => {
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        setLinksList(docSnap.data().items as SakodeLink[]);
      }
    }, (err) => console.log('Links snapshot fallback:', err.message));

    // 3. Admin Users Collection
    const adminsColRef = collection(db, 'admins');
    const unsubAdmins = onSnapshot(adminsColRef, (colSnap) => {
      const usersList: AdminUser[] = [];
      colSnap.forEach((docSnap) => {
        usersList.push(docSnap.data() as AdminUser);
      });
      if (usersList.length > 0) {
        setAdminUsers(usersList);
      } else {
        setAdminUsers([{
          uid: currentUser.uid,
          email: currentUser.email || 'admin@sakode.com',
          displayName: currentUser.displayName || 'Super Admin Sakode',
          role: 'Super Admin',
          createdAt: new Date().toISOString(),
          isGoogleLinked: currentUser.providerData.some(p => p.providerId === 'google.com')
        }]);
      }
    }, (err) => {
      console.log('Admins snapshot notice:', err.message);
      setAdminUsers([{
        uid: currentUser.uid,
        email: currentUser.email || 'admin@sakode.com',
        displayName: currentUser.displayName || 'Super Admin Sakode',
        role: 'Super Admin',
        createdAt: new Date().toISOString(),
        isGoogleLinked: currentUser.providerData.some(p => p.providerId === 'google.com')
      }]);
    });

    return () => {
      unsubContent();
      unsubLinks();
      unsubAdmins();
    };
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  // Google Account Linking
  const handleLinkGoogle = async () => {
    if (!auth.currentUser) return;
    setLinkingGoogle(true);
    setErrorMsg(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(auth.currentUser, provider);
      setCurrentUser(result.user);

      try {
        const adminRef = doc(db, 'admins', result.user.uid);
        await setDoc(adminRef, { isGoogleLinked: true }, { merge: true });
      } catch (e: any) {
        console.log('Firestore link update notice:', e.message);
      }

      showToast('Akun Google berhasil dikaitkan! Anda kini dapat login via Google.');
    } catch (err: any) {
      console.error('Google link error:', err);
      if (err.code === 'auth/credential-already-in-use') {
        setErrorMsg('Akun Google ini sudah terhubung dengan pengguna admin lain.');
      } else {
        setErrorMsg(err.message || 'Gagal mengaitkan akun Google.');
      }
    } finally {
      setLinkingGoogle(false);
    }
  };

  // Trigger Password Reset Email
  const handleSendResetPassword = async (targetEmail: string) => {
    setErrorMsg(null);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      showToast(`Link reset password berhasil dikirim ke email ${targetEmail}`);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setErrorMsg(err.message || 'Gagal mengirim email reset password.');
    }
  };

  // Create New Admin Account
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreating(true);
    setErrorMsg(null);

    try {
      // Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, newAdminEmail, newAdminPassword);
      
      const newAdminData: AdminUser = {
        uid: res.user.uid,
        email: newAdminEmail,
        displayName: newAdminName || newAdminEmail.split('@')[0],
        role: newAdminRole,
        createdAt: new Date().toISOString(),
        isGoogleLinked: false,
      };

      try {
        await setDoc(doc(db, 'admins', res.user.uid), newAdminData);
      } catch (dbErr: any) {
        console.log('Firestore write notice:', dbErr.message);
      }
      
      showToast(`Akun Admin ${newAdminEmail} berhasil dibuat!`);
      setIsAddAdminModalOpen(false);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminName('');
    } catch (err: any) {
      console.error('Create Admin error:', err);
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        setErrorMsg('Aturan keamanan Firestore melarang penulisan. Pastikan Firebase Rules di-update (lihat panduan di bawah).');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Email tersebut sudah terdaftar di sistem.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password minimal 6 karakter.');
      } else {
        setErrorMsg(err.message || 'Gagal membuat akun admin baru.');
      }
    } finally {
      setAdminCreating(false);
    }
  };

  // Delete / Revoke Admin User
  const handleDeleteAdmin = async (adminUid: string, email: string) => {
    if (adminUid === currentUser?.uid) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (!confirm(`Apakah Anda yakin ingin menghapus / mencabut hak akses admin ${email}?`)) return;

    try {
      await deleteDoc(doc(db, 'admins', adminUid));
      showToast(`Akses admin ${email} telah dicabut.`);
    } catch (err: any) {
      console.error('Delete admin error:', err);
      setErrorMsg('Gagal menghapus admin dari Firestore.');
    }
  };

  // Save Header Content
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
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        setErrorMsg('Izin Firestore ditolak: Perbarui Rules di Firebase Console (lihat panduan bantuan di bawah).');
      } else {
        localStorage.setItem('sakode_header_content', JSON.stringify(headerContent));
        showToast('Teks disimpan lokal (Fallback Mode)');
      }
    } finally {
      setSaving(false);
    }
  };

  // Save Links List
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
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        setErrorMsg('Izin Firestore ditolak: Perbarui Rules di Firebase Console (lihat panduan bantuan di bawah).');
      } else {
        localStorage.setItem('sakode_links_list', JSON.stringify(listToSave));
        showToast('Link disimpan lokal (Fallback Mode)');
      }
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
    setIsAddLinkModalOpen(false);
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
          <Sparkles className="w-4 h-4" /> Memeriksa Otentikasi Dashboard Admin...
        </div>
      </div>
    );
  }

  const isGoogleLinked = currentUser?.providerData.some(p => p.providerId === 'google.com');
  const activeLinksCount = linksList.filter(l => l.isEnabled !== false).length;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 flex flex-col">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-28">
              <SakodeLogoSvg className="w-full h-auto" theme="dark" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Center
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pratinjau Web Live</span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          
          {/* User Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm uppercase flex items-center justify-center w-10 h-10">
                {currentUser?.email ? currentUser.email[0] : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold truncate text-white">
                  {currentUser?.displayName || 'Admin Sakode'}
                </h4>
                <p className="text-[11px] font-mono text-zinc-400 truncate">
                  {currentUser?.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.2 rounded bg-zinc-800 text-[10px] text-emerald-400 font-mono border border-zinc-700">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Nav Buttons */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer text-left ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg font-bold'
                : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer text-left ${
              activeTab === 'content'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg font-bold'
                : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Teks Header & Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer text-left ${
              activeTab === 'links'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg font-bold'
                : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <LinkIcon className="w-4 h-4" />
              <span>Kelola Daftar Link</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'links' ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {linksList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer text-left ${
              activeTab === 'admins'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg font-bold'
                : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Manajemen Tim Admin</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'admins' ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {adminUsers.length}
            </span>
          </button>

        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex flex-col gap-2 shadow-md">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pemberitahuan Izin Firestore</span>
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
              <div className="mt-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                <p className="text-emerald-400 font-bold mb-1">// Solusi: Salin aturan ini ke Firebase Console ➔ Firestore Database ➔ Rules:</p>
                <pre className="whitespace-pre-wrap">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
              </div>
            </div>
          )}

          {/* TAB 0: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-zinc-400">Total Link Tautan</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{linksList.length}</div>
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                    {activeLinksCount} Aktif • {linksList.length - activeLinksCount} Nonaktif
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-zinc-400">Tim Admin Terdaftar</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{adminUsers.length}</div>
                  <p className="text-[11px] text-cyan-400 mt-1 font-medium">
                    Akses Terproteksi Firebase Auth
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-zinc-400">Status Koneksi Firebase</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Real-time Sync Active
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Firestore & Auth Running
                  </p>
                </div>
              </div>

              {/* Account Quick Security Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                    <UserCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Status Keamanan Akun Anda</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isGoogleLinked 
                        ? 'Akun Anda sudah terhubung dengan Google Sign-In.' 
                        : 'Akun Anda belum dikaitkan ke Google. Kaitkan untuk login instan tanpa ketik password.'}
                    </p>
                  </div>
                </div>

                {isGoogleLinked ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Terhubung Google
                  </span>
                ) : (
                  <button
                    onClick={handleLinkGoogle}
                    disabled={linkingGoogle}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2 border border-zinc-200"
                  >
                    <span>{linkingGoogle ? 'Kaitkan...' : 'Kaitkan Akun Google'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 1: CONTENT EDITOR */}
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
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
                          maxLength={16}
                          value={headerContent.modalBadge || ''}
                          onChange={(e) => setHeaderContent({ ...headerContent, modalBadge: e.target.value })}
                          placeholder="Launching Soon"
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
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Semua Teks & Modal'}</span>
                    </button>
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

                <button
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
                    setIsAddLinkModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Link Baru</span>
                </button>
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
                            setIsAddLinkModalOpen(true);
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

          {/* TAB 3: ADMIN USER MANAGEMENT */}
          {activeTab === 'admins' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">Manajemen Tim Admin ({adminUsers.length})</h2>
                  <p className="text-xs text-zinc-400">Tambah akun admin baru, kirim reset password, dan kelola peran hak akses.</p>
                </div>

                <button
                  onClick={() => setIsAddAdminModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-emerald-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambah Admin Baru</span>
                </button>
              </div>

              {/* Admin Users Cards List */}
              <div className="space-y-3">
                {adminUsers.map((adminItem) => {
                  const isCurrent = adminItem.uid === currentUser?.uid;
                  return (
                    <div
                      key={adminItem.uid}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400 shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold truncate">{adminItem.displayName}</h3>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                Akun Anda
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-semibold text-zinc-300 border border-zinc-700">
                              {adminItem.role}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-zinc-400 truncate">{adminItem.email}</p>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSendResetPassword(adminItem.email)}
                          className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Kirim Email Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reset Password</span>
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteAdmin(adminItem.uid, adminItem.email)}
                            className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                            title="Cabut Hak Akses Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* MODAL: ADD NEW ADMIN USER */}
      <AnimatePresence>
        {isAddAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddAdminModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-base font-bold mb-4 pb-2 border-b border-zinc-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>Tambah Akun Admin Baru</span>
              </h2>

              <form onSubmit={handleCreateAdmin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Nama Tampilan Admin
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Contoh: Budi - Editor Sakode"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email Admin Baru
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="editor@sakode.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Password Awal Admin
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="•••••••• (Minimal 6 Karakter)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Peran / Hak Akses (Role)
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as 'Super Admin' | 'Editor')}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Super Admin">Super Admin (Akses Penuh)</option>
                    <option value="Editor">Editor (Konten & Links)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddAdminModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={adminCreating}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {adminCreating ? 'Membuat...' : 'Buat Akun Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT LINK */}
      <AnimatePresence>
        {isAddLinkModalOpen && editingLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddLinkModalOpen(false)}
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
                      Teks Badge (Maks 14 Karakter)
                    </label>
                    <input
                      type="text"
                      maxLength={14}
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
                    onClick={() => setIsAddLinkModalOpen(false)}
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
