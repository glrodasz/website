export interface FunProject {
  /** Stable id. Also the screenshot file name: `src/assets/projects/{slug}.webp`. */
  slug: string;
  name: string;
  /** Where the "Visit" button and share links point. */
  url: string;
  /** Source code, when public. */
  repoUrl?: string;
  description: string;
  descriptionEs: string;
  tags: string[];
  /**
   * Set to false for projects that aren't a web page (e.g. a native app),
   * so the screenshot script skips them and the card keeps its mockup cover.
   */
  capturable?: boolean;
}

/**
 * Pet projects shown on /fun-projects, newest and most polished first.
 * Sourced from what's deployed on Vercel and Netlify plus public GitHub repos.
 */
export const FUN_PROJECTS: FunProject[] = [
  {
    slug: 'walleto',
    name: 'Walleto',
    url: 'https://walleto.guillermorodas.com',
    repoUrl: 'https://github.com/glrodasz/walleto',
    description:
      'A personal-finance planner: your monthly plan, whether this month is on track, and where you stand today — with native multi-currency support.',
    descriptionEs:
      'Un planificador de finanzas personales: tu plan mensual, si el mes va por buen camino y dónde estás hoy — con soporte nativo para múltiples monedas.',
    tags: ['Next.js', 'TypeScript', 'Firestore'],
  },
  {
    slug: 'series-timeline',
    name: 'Series Timeline',
    url: 'https://seriestimeline.netlify.app',
    description:
      'A visual timeline of the TV series I watch — seasons and release dates laid out so I always know what is coming next.',
    descriptionEs:
      'Una línea de tiempo visual de las series que veo — temporadas y fechas de estreno organizadas para saber siempre qué viene.',
    tags: ['TypeScript'],
  },
  {
    slug: 'html-colors',
    name: 'Favorite HTML Colors',
    url: 'https://colors.guillermorodas.com',
    repoUrl: 'https://github.com/glrodasz/colors',
    description:
      'A hand-picked showcase of the 24 HTML named colors I keep forgetting, previewed live on buttons, type and UI mocks.',
    descriptionEs:
      'Una selección de los 24 colores con nombre de HTML que siempre olvido, con vista previa en botones, tipografía y maquetas de UI.',
    tags: ['Next.js', 'CSS'],
  },
  {
    slug: 'js-lineage',
    name: 'The Lineage of JavaScript',
    url: 'https://js-lineage.vercel.app',
    description:
      'A scroll-driven history of three decades of JavaScript frameworks, each rendered in the visual language of its era.',
    descriptionEs:
      'Una historia animada con el scroll de tres décadas de frameworks de JavaScript, cada uno con el estilo visual de su época.',
    tags: ['Vite', 'TypeScript', 'Animation'],
  },
  {
    slug: 'undefined-academy',
    name: 'Undefined Academy',
    url: 'https://undefined.academy',
    repoUrl: 'https://github.com/glrodasz/academy',
    description:
      'A free, 100% online 16-week bootcamp to become a full-stack JavaScript developer.',
    descriptionEs:
      'Un bootcamp gratuito y 100% online de 16 semanas para convertirte en desarrollador full-stack de JavaScript.',
    tags: ['Education', 'JavaScript'],
  },
  {
    slug: 'cssconf-colombia',
    name: 'CSS Conf Colombia',
    url: 'https://cssconf.co',
    description:
      'The website for CSS Conf Colombia, the community conference about CSS and design on the web that I organized.',
    descriptionEs:
      'El sitio web de CSS Conf Colombia, la conferencia comunitaria sobre CSS y diseño web que organicé.',
    tags: ['Community', 'CSS'],
  },
  {
    slug: 'cero-components',
    name: 'Cero Components',
    url: 'https://cero-components.vercel.app',
    repoUrl: 'https://github.com/glrodasz/cero-components',
    description:
      'The Atomic Design UI kit for RETO, a productivity app built from zero to production in the live-coding series Cero a Producción.',
    descriptionEs:
      'El kit de UI con Atomic Design de RETO, una app de productividad construida de cero a producción en la serie en vivo Cero a Producción.',
    tags: ['React', 'Storybook', 'Design tokens'],
  },
  {
    slug: 'timepass',
    name: 'Timepass',
    url: 'https://github.com/glrodasz/timepass',
    repoUrl: 'https://github.com/glrodasz/timepass',
    description:
      'A native Apple Silicon menu bar app that shows multiple time zones, each with its country flag and current time.',
    descriptionEs:
      'Una app nativa para la barra de menú de Apple Silicon que muestra varias zonas horarias, cada una con su bandera y hora actual.',
    tags: ['Swift', 'macOS'],
    capturable: false,
  },
];
