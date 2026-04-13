export const AI_FIRST_WAITLIST_MAILTO =
  'mailto:me@guillermorodas.com?subject=AI-First%20Programming%20Course%20Waitlist';

export type PlaylistLanguage = 'en' | 'es';

export const PLAYLIST_LANGUAGE_META: Record<
  PlaylistLanguage,
  { flag: string; label: string }
> = {
  en: { flag: '🇬🇧', label: 'English' },
  es: { flag: '🇪🇸', label: 'Spanish' },
};

export interface YouTubePlaylistCourse {
  playlistId: string;
  title: string;
  language: PlaylistLanguage;
  description?: string;
  /** First video in playlist — for hqdefault thumbnail */
  thumbnailVideoId?: string;
}

export const FREE_YOUTUBE_PLAYLISTS: YouTubePlaylistCourse[] = [
  {
    playlistId: 'PLKBvDYynKmlWa59k8pnw-EHac2_miPagh',
    title: 'Modern Component Library with React & Storybook',
    language: 'en',
    thumbnailVideoId: '21iHNxVlfvw',
  },
  {
    playlistId: 'PLKBvDYynKmlXT7UUDB6fIJ_3jsG8f3JKG',
    title: 'Sublr: Producto desde Cero',
    language: 'es',
    thumbnailVideoId: 'goQSwnI2nYs',
  },
  {
    playlistId: 'PLKBvDYynKmlV91NjrOx11ZmKDlsxBeijc',
    title: 'RETO: Cero a Producción — 1st Part',
    language: 'es',
    thumbnailVideoId: 'zfxP2VvP_Dw',
  },
  {
    playlistId: 'PLKBvDYynKmlWHZNlkhnhTpeM-JOmNiQEZ',
    title: 'RETO: Cero a Producción — 2nd Part',
    language: 'es',
    thumbnailVideoId: 'bkyzKu7yreg',
  },
];

/** Featured on Home — AI-first + Modern Component Library */
export const HOME_FEATURED_PLAYLIST_ID = 'PLKBvDYynKmlWa59k8pnw-EHac2_miPagh';

export function playlistUrl(playlistId: string): string {
  return `https://www.youtube.com/playlist?list=${playlistId}`;
}

export function youtubeThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export interface PlatformCourse {
  id: string;
  title: string;
  platform: string;
  href: string;
  description?: string;
  logoSrc?: string;
}

export const OTHER_PLATFORM_COURSES: PlatformCourse[] = [
  {
    id: 'cf-node',
    title: 'Node.js Profesional',
    platform: 'Código Facilito',
    href: 'https://codigofacilito.com/cursos/nodejs-profesional',
    description: 'Professional Node.js on Código Facilito.',
    logoSrc: '/logos/codigofacilito.svg',
  },
  {
    id: 'platzi-oauth',
    title: 'OAuth 2.0 y OpenID Connect',
    platform: 'Platzi',
    href: 'https://platzi.com/cursos/oauth/?utm_content=glrodasz&utm_source=affiliates&utm_medium=organic&utm_campaign=teacher_afiliados_glrodasz',
    description: 'Authentication flows, JWT, and production patterns.',
    logoSrc: '/logos/platzi.svg',
  },
  {
    id: 'platzi-auth0',
    title: 'Auth0: Autenticación y seguridad web',
    platform: 'Platzi',
    href: 'https://platzi.com/cursos/auth0/?utm_content=glrodasz&utm_source=affiliates&utm_medium=organic&utm_campaign=teacher_afiliados_glrodasz',
    description: 'Universal Login, social connections, APIs, and Auth0 in production.',
    logoSrc: '/logos/platzi.svg',
  },
];
