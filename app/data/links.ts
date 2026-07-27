export interface SakodeLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: 'all' | 'contact' | 'social' | 'website';
  badge?: string;
  iconName: 'whatsapp' | 'instagram' | 'tiktok' | 'website' | 'email';
  isSpecialAction?: boolean;
}

export const SAKODE_LINKS: SakodeLink[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Official',
    subtitle: 'Konsultasi pendaftaran bootcamp dan info program akademi',
    url: 'https://wa.me/message/UTMRQNH4ERNBM1',
    category: 'contact',
    badge: 'Respon Cepat',
    iconName: 'whatsapp',
  },
  {
    id: 'instagram',
    title: 'Instagram @sakodeacademy',
    subtitle: 'Update kegiatan, informasi event, dan materi edukasi',
    url: 'https://www.instagram.com/sakodeacademy?igsh=MWZiNmR3ODU4NG12ZA==',
    category: 'social',
    badge: 'Official IG',
    iconName: 'instagram',
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
  },
  {
    id: 'tiktok',
    title: 'TikTok Sakode Academy',
    subtitle: 'Konten video edukasi koding dan seputar dunia teknologi',
    url: 'https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/',
    category: 'social',
    badge: 'Video Content',
    iconName: 'tiktok',
  },
  {
    id: 'email',
    title: 'Email Business & Partnership',
    subtitle: 'sakodeacademy@gmail.com - Hubungi untuk kerjasama & undangan event',
    url: 'mailto:sakodeacademy@gmail.com',
    category: 'contact',
    badge: 'Email Official',
    iconName: 'email',
  },
];
