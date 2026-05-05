export interface FavoriteBook {
  title: string;
  author?: string;
  href: string;
  /** Local WebP cover, e.g. /images/covers/books/atomic-habits.webp */
  coverUrl?: string;
  summary?: string;
}

export interface FavoriteFilm {
  title: string;
  href: string;
  posterUrl?: string;
  summary?: string;
}

/** Synced from Goodreads favorites shelf — edit as needed */
export const FAVORITE_BOOKS: FavoriteBook[] = [
  {
    title: 'Immune',
    author: 'Philipp Dettmer',
    href: 'https://www.goodreads.com/book/show/57423646-immune',
    coverUrl: '/images/covers/books/immune.webp',
    summary: 'I had no idea how fascinating the immune system really is. This book completely reshaped how I think about health and the everyday choices that actually matter.',
  },
  {
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    href: 'https://www.goodreads.com/book/show/59616977-building-a-second-brain',
    coverUrl: '/images/covers/books/building-a-second-brain.webp',
    summary: 'A practical framework for capturing and organizing everything you learn. It put a name and structure to habits I was already trying to build, making them finally stick.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    coverUrl: '/images/covers/books/atomic-habits.webp',
    summary: 'We fall short of our goals not from lack of motivation, but because we haven\'t made the path itself a habit. This book gave me concrete strategies that actually work.',
  },
  {
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    href: 'https://www.goodreads.com/book/show/18693655-a-mind-for-numbers',
    coverUrl: '/images/covers/books/a-mind-for-numbers.webp',
    summary: 'Wish I\'d had this at university. It reveals how the brain really learns, and gives you practical techniques to study smarter and retain more of what you read.',
  },
  {
    title: 'Thanks for the Feedback',
    author: 'Douglas Stone',
    href: 'https://www.goodreads.com/book/show/18114120-thanks-for-the-feedback',
    coverUrl: '/images/covers/books/thanks-for-the-feedback.webp',
    summary: 'People are complicated — this book explains why feedback is so hard to give and receive, and equips you with tools that help in both professional and personal relationships.',
  },
];

export const GOODREADS_PROFILE = 'https://www.goodreads.com/user/show/77842684-guillermo-rodas';

/** Synced from Letterboxd favorite films */
export const FAVORITE_FILMS: FavoriteFilm[] = [
  {
    title: 'Memento',
    href: 'https://letterboxd.com/film/memento/',
    posterUrl: '/images/covers/films/memento.webp',
    summary: 'My all-time favorite. The director puts you inside the protagonist\'s mind in a way that feels genuinely disorienting — in the best possible sense. A 10/10 experience.',
  },
  {
    title: 'Enemy',
    href: 'https://letterboxd.com/film/enemy/',
    posterUrl: '/images/covers/films/enemy.webp',
    summary: 'An unsettling, deeply ambiguous thriller that stays with you long after it ends. The kind of story you\'ll want to unpack, revisit, and debate.',
  },
  {
    title: 'Donnie Darko',
    href: 'https://letterboxd.com/film/donnie-darko/',
    posterUrl: '/images/covers/films/donnie-darko.webp',
    summary: 'A layered meditation on time that rewards repeat viewing. Strange, thought-provoking, and oddly compelling — it never gets old.',
  },
  {
    title: 'The Rescue',
    href: 'https://letterboxd.com/film/the-rescue-2021/',
    posterUrl: '/images/covers/films/the-rescue.webp',
    summary: 'The best documentary I\'ve ever watched. The Thai cave rescue looks straightforward from the headlines; this film reveals just how close-run and extraordinary the operation really was.',
  },
  {
    title: 'Oldboy',
    href: 'https://letterboxd.com/film/oldboy/',
    posterUrl: '/images/covers/films/oldboy.webp',
    summary: 'A masterclass in Korean cinema. A gripping story that builds at exactly the right pace — if you appreciate films that develop slowly but reward your patience, this is it.',
  },
];

export const LETTERBOXD_PROFILE = 'https://letterboxd.com/guillermorodas/';
