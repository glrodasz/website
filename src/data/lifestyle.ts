export interface FavoriteBook {
  title: string;
  author?: string;
  href: string;
  /** Local WebP cover, e.g. /images/covers/books/atomic-habits.webp */
  coverUrl?: string;
  summary?: string;
  summaryEs?: string;
}

export interface FavoriteFilm {
  title: string;
  href: string;
  posterUrl?: string;
  summary?: string;
  summaryEs?: string;
}

/** Synced from Goodreads favorites shelf — edit as needed */
export const FAVORITE_BOOKS: FavoriteBook[] = [
  {
    title: 'Immune',
    author: 'Philipp Dettmer',
    href: 'https://www.goodreads.com/book/show/57423646-immune',
    coverUrl: '/images/covers/books/immune.webp',
    summary: 'I had no idea how fascinating the immune system really is. This book completely reshaped how I think about health and the everyday choices that actually matter.',
    summaryEs: 'No tenía idea de lo fascinante que es el sistema inmune. Este libro cambió completamente la manera en que pienso sobre la salud y las decisiones cotidianas que realmente importan.',
  },
  {
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    href: 'https://www.goodreads.com/book/show/59616977-building-a-second-brain',
    coverUrl: '/images/covers/books/building-a-second-brain.webp',
    summary: 'A practical framework for capturing and organizing everything you learn. It put a name and structure to habits I was already trying to build, making them finally stick.',
    summaryEs: 'Un marco práctico para capturar y organizar todo lo que aprendes. Le dio nombre y estructura a hábitos que ya intentaba construir, haciendo que por fin se afianzaran.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    coverUrl: '/images/covers/books/atomic-habits.webp',
    summary: 'We fall short of our goals not from lack of motivation, but because we haven\'t made the path itself a habit. This book gave me concrete strategies that actually work.',
    summaryEs: 'No alcanzamos nuestras metas por falta de motivación, sino porque no hemos convertido el camino en un hábito. Este libro me dio estrategias concretas que realmente funcionan.',
  },
  {
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    href: 'https://www.goodreads.com/book/show/18693655-a-mind-for-numbers',
    coverUrl: '/images/covers/books/a-mind-for-numbers.webp',
    summary: 'Wish I\'d had this at university. It reveals how the brain really learns, and gives you practical techniques to study smarter and retain more of what you read.',
    summaryEs: 'Ojalá lo hubiera tenido en la universidad. Revela cómo aprende realmente el cerebro y ofrece técnicas prácticas para estudiar de forma más inteligente y retener más de lo que lees.',
  },
  {
    title: 'Thanks for the Feedback',
    author: 'Douglas Stone',
    href: 'https://www.goodreads.com/book/show/18114120-thanks-for-the-feedback',
    coverUrl: '/images/covers/books/thanks-for-the-feedback.webp',
    summary: 'People are complicated, this book explains why feedback is so hard to give and receive, and equips you with tools that help in both professional and personal relationships.',
    summaryEs: 'Las personas son complicadas; este libro explica por qué el feedback es tan difícil de dar y recibir, y te da herramientas útiles tanto en relaciones profesionales como personales.',
  },
];

export const GOODREADS_PROFILE = 'https://www.goodreads.com/user/show/77842684-guillermo-rodas';

/** Synced from Letterboxd favorite films */
export const FAVORITE_FILMS: FavoriteFilm[] = [
  {
    title: 'Memento',
    href: 'https://letterboxd.com/film/memento/',
    posterUrl: '/images/covers/films/memento.webp',
    summary: 'My all-time favorite. The director puts you inside the protagonist\'s mind in a way that feels genuinely disorienting, in the best possible sense. A 10/10 experience.',
    summaryEs: 'Mi favorita de todos los tiempos. El director te mete en la mente del protagonista de una manera que se siente genuinamente desorientadora, en el mejor sentido posible. Una experiencia 10/10.',
  },
  {
    title: 'Enemy',
    href: 'https://letterboxd.com/film/enemy/',
    posterUrl: '/images/covers/films/enemy.webp',
    summary: 'An unsettling, deeply ambiguous thriller that stays with you long after it ends. The kind of story you\'ll want to unpack, revisit, and debate.',
    summaryEs: 'Un thriller perturbador y profundamente ambiguo que te acompaña mucho después de que termina. El tipo de historia que querrás analizar, revisitar y debatir.',
  },
  {
    title: 'Donnie Darko',
    href: 'https://letterboxd.com/film/donnie-darko/',
    posterUrl: '/images/covers/films/donnie-darko.webp',
    summary: 'A layered meditation on time that rewards repeat viewing. Strange, thought-provoking, and oddly compelling, it never gets old.',
    summaryEs: 'Una meditación en capas sobre el tiempo que recompensa el visionado repetido. Extraña, estimulante y curiosamente cautivadora, nunca envejece.',
  },
  {
    title: 'The Rescue',
    href: 'https://letterboxd.com/film/the-rescue-2021/',
    posterUrl: '/images/covers/films/the-rescue.webp',
    summary: 'The best documentary I\'ve ever watched. The Thai cave rescue looks straightforward from the headlines; this film reveals just how close-run and extraordinary the operation really was.',
    summaryEs: 'El mejor documental que he visto. El rescate en la cueva tailandesa parece sencillo por los titulares; esta película revela lo reñida y extraordinaria que fue realmente la operación.',
  },
  {
    title: 'Oldboy',
    href: 'https://letterboxd.com/film/oldboy/',
    posterUrl: '/images/covers/films/oldboy.webp',
    summary: 'A masterclass in Korean cinema. A gripping story that builds at exactly the right pace, if you appreciate films that develop slowly but reward your patience, this is it.',
    summaryEs: 'Una obra maestra del cine coreano. Una historia absorbente que se construye al ritmo exacto; si aprecias las películas que se desarrollan lentamente pero recompensan tu paciencia, esta es tu película.',
  },
];

export const LETTERBOXD_PROFILE = 'https://letterboxd.com/guillermorodas/';
