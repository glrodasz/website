export interface GarajeVideo {
  videoId: string;
  title: string;
}

/** Garaje Code Pills — order matches YouTube playlist */
export const GARAJE_CODE_PILLS: GarajeVideo[] = [
  { videoId: 'D4XGDUZRIIs', title: 'De 0 a 1 Millón de usuarios: Cómo escalar recursos técnicos de una aplicación' },
  { videoId: 'JKfzhw4D4gM', title: 'Creamos la misma aplicación con Restful API y GraphQL y te contamos las diferencias' },
  { videoId: 'kDiVdJKUAo8', title: 'Creamos la misma aplicación con CSS Vanilla y Tailwind CSS y te contamos las diferencias' },
  { videoId: 'r7r4x1eO7vA', title: 'Creamos la misma aplicación con ReactJS y Preact y te contamos las diferencias' },
  { videoId: 'Du9qdVEogR0', title: 'Convierte Audio a Texto con Whisper AI' },
  { videoId: 'Ig8p7H3iMGo', title: 'Visual Testing con Storybook Chromatic | Automatiza tus UI tests' },
  { videoId: '3zUw8gd3e80', title: 'Haz tu tipografía totalmente responsive con CSS Clamp' },
  { videoId: 'yzJ3W96eMn8', title: 'Testing de Server en NodeJS usando Jest y Supertest' },
  { videoId: 'AXMFs-HX_RA', title: 'Crea componentes reusables con Native Web Components' },
  { videoId: 'TVU8kRLjzaU', title: 'Warp vs Fig | ¿Qué terminal es mejor?' },
  { videoId: 'viDKf6ADlZc', title: 'Saca todo el potencial de Storybook con estos Addons' },
  { videoId: 'YdNiT6WZnZ4', title: 'Introducción al Testing con Storybook paso a paso' },
  { videoId: 'JxL0fTtF1Fo', title: 'Te contamos todo lo que debes saber de Storybook 7.0' },
  { videoId: 'WHh0FMNFxbY', title: 'Cómo integrar Storybook en tus proyectos de Angular' },
  { videoId: '2_ln5eNKvRI', title: 'Cómo integrar Storybook en tus proyectos de React' },
  { videoId: 'qNxpWRExlds', title: 'Como empezar a usar Storybook' },
  { videoId: 'MUtSrXUh6T8', title: 'Crea componentes Reutilizables con Lit' },
  { videoId: 'Ybzp3RNnfVo', title: 'API Rest con NodeJS y Express' },
  { videoId: 'okViSpQs-8M', title: 'Node API con JWT (Json Web Token)' },
];

export function garajeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
