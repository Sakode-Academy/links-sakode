export interface SakodeLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: 'all' | 'contact' | 'social' | 'website';
  badge?: string;
  badgeColor?: string;
  iconName: 'whatsapp' | 'instagram' | 'tiktok' | 'website' | 'email';
  gradient: string;
  glowColor: string;
  isSpecialAction?: boolean;
}

export const SAKODE_LINKS: SakodeLink[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Official',
    subtitle: 'Konsultasi Pendaftaran Bootcamp & Program Academy',
    url: 'https://wa.me/message/UTMRQNH4ERNBM1',
    category: 'contact',
    badge: 'Respon Cepat ⚡',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    iconName: 'whatsapp',
    gradient: 'from-emerald-600/30 via-emerald-500/10 to-teal-900/40',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:border-emerald-400/60',
  },
  {
    id: 'instagram',
    title: 'Instagram @sakodeacademy',
    subtitle: 'Update Kegiatan, Event, Tutorial & Tips Koding',
    url: 'https://www.instagram.com/sakodeacademy?igsh=MWZiNmR3ODU4NG12ZA==',
    category: 'social',
    badge: 'Official IG 📸',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    iconName: 'instagram',
    gradient: 'from-fuchsia-600/30 via-pink-500/10 to-purple-900/40',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(236,72,153,0.35)] hover:border-pink-400/60',
  },
  {
    id: 'website',
    title: 'Website Portal Official',
    subtitle: 'Portal Pembelajaran & Hub Komunitas (Versi 2.0 In Progress)',
    url: '#website-status',
    category: 'website',
    badge: '✨ Sneak Peek v2.0',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    iconName: 'website',
    gradient: 'from-cyan-600/30 via-blue-500/10 to-indigo-900/40',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] hover:border-cyan-400/60',
    isSpecialAction: true,
  },
  {
    id: 'tiktok',
    title: 'TikTok Sakode Academy',
    subtitle: 'Konten Edukasi Singkat, Mini Challenge & Fun Tech',
    url: 'https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/',
    category: 'social',
    badge: 'Trending Videos 🎥',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    iconName: 'tiktok',
    gradient: 'from-cyan-600/30 via-slate-800/20 to-rose-900/40',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(14,165,233,0.35)] hover:border-sky-400/60',
  },
  {
    id: 'email',
    title: 'Email Business & Partnership',
    subtitle: 'sakodeacademy@gmail.com • Kerjasama & Undangan Event',
    url: 'mailto:sakodeacademy@gmail.com',
    category: 'contact',
    badge: 'Email Official ✉️',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iconName: 'email',
    gradient: 'from-amber-600/30 via-orange-500/10 to-stone-900/40',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:border-amber-400/60',
  },
];
