export const AI_FIRST_WAITLIST_MAILTO =
  'mailto:me@guillermorodas.com?subject=AI-First%20Programming%20Course%20Waitlist';

export interface YouTubePlaylistCourse {
  playlistId: string;
  title: string;
  description?: string;
  /** First video in playlist — for hqdefault thumbnail */
  thumbnailVideoId?: string;
}

export const FREE_YOUTUBE_PLAYLISTS: YouTubePlaylistCourse[] = [
  {
    playlistId: 'PLKBvDYynKmlV91NjrOx11ZmKDlsxBeijc',
    title: 'RETO: Cero a Producción',
    thumbnailVideoId: 'zfxP2VvP_Dw',
  },
  {
    playlistId: 'PLKBvDYynKmlWHZNlkhnhTpeM-JOmNiQEZ',
    title: 'Patreon — RETO: Cero a Producción',
    thumbnailVideoId: 'bkyzKu7yreg',
  },
  {
    playlistId: 'PLKBvDYynKmlXT7UUDB6fIJ_3jsG8f3JKG',
    title: 'Patreon — Sublr: Producto desde Cero',
    thumbnailVideoId: 'goQSwnI2nYs',
  },
  {
    playlistId: 'PLKBvDYynKmlWa59k8pnw-EHac2_miPagh',
    title: 'Modern Component Library with React & Storybook',
    thumbnailVideoId: '21iHNxVlfvw',
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
}

export const OTHER_PLATFORM_COURSES: PlatformCourse[] = [
  {
    id: 'cf-node',
    title: 'Node.js Profesional',
    platform: 'Código Facilito',
    href: 'https://codigofacilito.com/cursos/nodejs-profesional',
    description: 'Professional Node.js on Código Facilito.',
  },
  {
    id: 'platzi-oauth',
    title: 'OAuth 2.0 y OpenID Connect',
    platform: 'Platzi',
    href: 'https://platzi.com/cursos/oauth/?utm_content=glrodasz&utm_source=affiliates&utm_medium=organic&utm_campaign=teacher_afiliados_glrodasz',
    description: 'Authentication flows, JWT, and production patterns.',
  },
  {
    id: 'platzi-auth0',
    title: 'Auth0: Autenticación y seguridad web',
    platform: 'Platzi',
    href: 'https://platzi.com/cursos/auth0/?utm_content=glrodasz&utm_source=affiliates&utm_medium=organic&utm_campaign=teacher_afiliados_glrodasz',
    description: 'Universal Login, social connections, APIs, and Auth0 in production.',
  },
];
