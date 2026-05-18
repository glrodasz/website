import type { PlaylistLanguage } from './courses';

export interface GarajeVideo {
  videoId: string;
  title: string;
  titleEn: string;
  language: PlaylistLanguage;
}

/** Garaje Code Pills — order matches YouTube playlist */
export const GARAJE_CODE_PILLS: GarajeVideo[] = [
  {
    videoId: 'D4XGDUZRIIs',
    title: 'De 0 a 1 Millón de usuarios: Cómo escalar recursos técnicos de una aplicación',
    titleEn: 'From 0 to 1 Million Users: How to Scale an Application\'s Technical Resources',
    language: 'es',
  },
  {
    videoId: 'JKfzhw4D4gM',
    title: 'Creamos la misma aplicación con Restful API y GraphQL y te contamos las diferencias',
    titleEn: 'We Built the Same App with REST API and GraphQL — Here\'s the Difference',
    language: 'es',
  },
  {
    videoId: 'kDiVdJKUAo8',
    title: 'Creamos la misma aplicación con CSS Vanilla y Tailwind CSS y te contamos las diferencias',
    titleEn: 'We Built the Same App with Vanilla CSS and Tailwind CSS — Here\'s the Difference',
    language: 'es',
  },
  {
    videoId: 'r7r4x1eO7vA',
    title: 'Creamos la misma aplicación con ReactJS y Preact y te contamos las diferencias',
    titleEn: 'We Built the Same App with ReactJS and Preact — Here\'s the Difference',
    language: 'es',
  },
  {
    videoId: 'Du9qdVEogR0',
    title: 'Convierte Audio a Texto con Whisper AI',
    titleEn: 'Convert Audio to Text with Whisper AI',
    language: 'es',
  },
  {
    videoId: 'Ig8p7H3iMGo',
    title: 'Visual Testing con Storybook Chromatic | Automatiza tus UI tests',
    titleEn: 'Visual Testing with Storybook Chromatic | Automate Your UI Tests',
    language: 'es',
  },
  {
    videoId: '3zUw8gd3e80',
    title: 'Haz tu tipografía totalmente responsive con CSS Clamp',
    titleEn: 'Make Your Typography Fully Responsive with CSS Clamp',
    language: 'es',
  },
  {
    videoId: 'yzJ3W96eMn8',
    title: 'Testing de Server en NodeJS usando Jest y Supertest',
    titleEn: 'Server Testing in NodeJS with Jest and Supertest',
    language: 'es',
  },
  {
    videoId: 'AXMFs-HX_RA',
    title: 'Crea componentes reusables con Native Web Components',
    titleEn: 'Build Reusable Components with Native Web Components',
    language: 'es',
  },
  {
    videoId: 'TVU8kRLjzaU',
    title: 'Warp vs Fig | ¿Qué terminal es mejor?',
    titleEn: 'Warp vs Fig | Which Terminal Is Better?',
    language: 'es',
  },
  {
    videoId: 'viDKf6ADlZc',
    title: 'Saca todo el potencial de Storybook con estos Addons',
    titleEn: 'Get the Most Out of Storybook with These Addons',
    language: 'es',
  },
  {
    videoId: 'YdNiT6WZnZ4',
    title: 'Introducción al Testing con Storybook paso a paso',
    titleEn: 'Introduction to Testing with Storybook Step by Step',
    language: 'es',
  },
  {
    videoId: 'JxL0fTtF1Fo',
    title: 'Te contamos todo lo que debes saber de Storybook 7.0',
    titleEn: 'Everything You Need to Know About Storybook 7.0',
    language: 'es',
  },
  {
    videoId: 'WHh0FMNFxbY',
    title: 'Cómo integrar Storybook en tus proyectos de Angular',
    titleEn: 'How to Integrate Storybook in Your Angular Projects',
    language: 'es',
  },
  {
    videoId: '2_ln5eNKvRI',
    title: 'Cómo integrar Storybook en tus proyectos de React',
    titleEn: 'How to Integrate Storybook in Your React Projects',
    language: 'es',
  },
  {
    videoId: 'qNxpWRExlds',
    title: 'Como empezar a usar Storybook',
    titleEn: 'Getting Started with Storybook',
    language: 'es',
  },
  {
    videoId: 'MUtSrXUh6T8',
    title: 'Crea componentes Reutilizables con Lit',
    titleEn: 'Build Reusable Components with Lit',
    language: 'es',
  },
  {
    videoId: 'Ybzp3RNnfVo',
    title: 'API Rest con NodeJS y Express',
    titleEn: 'REST API with NodeJS and Express',
    language: 'es',
  },
  {
    videoId: 'okViSpQs-8M',
    title: 'Node API con JWT (Json Web Token)',
    titleEn: 'Node API with JWT (JSON Web Token)',
    language: 'es',
  },
];

export function garajeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
