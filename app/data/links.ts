export type IconNameType = 
  | 'whatsapp' 
  | 'instagram' 
  | 'tiktok' 
  | 'website' 
  | 'email' 
  | 'youtube' 
  | 'github' 
  | 'linkedin' 
  | 'telegram' 
  | 'discord' 
  | 'link';

export interface SakodeLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: 'all' | 'contact' | 'social' | 'website';
  badge?: string;
  iconName: IconNameType;
  isSpecialAction?: boolean;
  order?: number;
  isEnabled?: boolean;
}

export interface SiteHeaderContent {
  title: string;
  tagline: string;
  location: string;
  modalBadge?: string;
  modalTitle?: string;
  modalDesc?: string;
  modalProgress?: string;
}

export const DEFAULT_HEADER_CONTENT: SiteHeaderContent = {
  title: 'Sakode Academy',
  tagline: 'Masa Depan Digital, Dimulai Dari Sini',
  location: 'Samarang, Garut, Jawa Barat',
  modalBadge: 'Launching Soon 2026',
  modalTitle: 'Portal Website Sakode 2.0',
  modalDesc: 'Website resmi Sakode Academy sedang dalam tahap pengembangan. Kami menghadirkan platform LMS interaktif, modul koding hands-on, dan hub komunitas tech.',
  modalProgress: '85%',
};

export const SAKODE_LINKS: SakodeLink[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Official',
    subtitle: 'Konsultasi pendaftaran bootcamp & info program akademi',
    url: 'https://wa.me/message/UTMRQNH4ERNBM1',
    category: 'contact',
    badge: 'Respon Cepat',
    iconName: 'whatsapp',
    order: 1,
    isEnabled: true,
  },
  {
    id: 'instagram',
    title: 'Instagram @sakodeacademy',
    subtitle: 'Update kegiatan, informasi event, dan materi edukasi',
    url: 'https://www.instagram.com/sakodeacademy?igsh=MWZiNmR3ODU4NG12ZA==',
    category: 'social',
    badge: 'Official IG',
    iconName: 'instagram',
    order: 2,
    isEnabled: true,
  },
  {
    id: 'website',
    title: 'Website Portal Official',
    subtitle: 'Portal pembelajaran LMS dan hub komunitas (Versi 2.0)',
    url: '#website-status',
    category: 'website',
    badge: 'Sneak Peek v2.0',
    iconName: 'website',
    isSpecialAction: true,
    order: 3,
    isEnabled: true,
  },
  {
    id: 'tiktok',
    title: 'TikTok Sakode Academy',
    subtitle: 'Konten video edukasi koding dan seputar dunia teknologi',
    url: 'https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/',
    category: 'social',
    badge: 'Video Shorts',
    iconName: 'tiktok',
    order: 4,
    isEnabled: true,
  },
  {
    id: 'email',
    title: 'Email Business & Partnership',
    subtitle: 'sakodeacademy@gmail.com',
    url: 'mailto:sakodeacademy@gmail.com',
    category: 'contact',
    badge: 'Official Email',
    iconName: 'email',
    order: 5,
    isEnabled: true,
  },
];
