export interface FunProject {
  /** Stable id. Also the screenshot file name: `src/assets/projects/{slug}.webp`. */
  slug: string;
  name: string;
  /** Where the "Visit" button and share links point. */
  url: string;
  /**
   * Page to screenshot when it differs from `url`, e.g. a dashboard behind a login
   * (see `--login` in scripts/capture-project-screenshots.ts).
   */
  screenshotUrl?: string;
  /** Source code, when public. */
  repoUrl?: string;
  description: string;
  descriptionEs: string;
  tags: string[];
  /**
   * Set to false for projects that aren't a web page (e.g. a native app), so the
   * screenshot script skips them. Add their image to src/assets/projects by hand
   * (Timepass uses the cover from its README); without one the card shows a mockup.
   */
  capturable?: boolean;
}

/**
 * Pet projects shown on /projects, newest and most polished first.
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
    slug: 'serieslines',
    name: 'Serieslines',
    url: 'https://serieslines.guillermorodas.com',
    description:
      'A visual timeline of the TV series I watch — seasons and release dates laid out so I always know what is coming next.',
    descriptionEs:
      'Una línea de tiempo visual de las series que veo — temporadas y fechas de estreno organizadas para saber siempre qué viene.',
    tags: ['TypeScript'],
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
  {
    slug: 'js-lineage',
    name: 'The Lineage of JavaScript',
    url: 'https://javascript.guillermorodas.com',
    description:
      'A scroll-driven history of three decades of JavaScript frameworks, each rendered in the visual language of its era.',
    descriptionEs:
      'Una historia animada con el scroll de tres décadas de frameworks de JavaScript, cada uno con el estilo visual de su época.',
    tags: ['Vite', 'TypeScript', 'Animation'],
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
];

/** Projects linked from the footer: the first three of the list above. */
export const FOOTER_PROJECTS: FunProject[] = FUN_PROJECTS.slice(0, 3);
