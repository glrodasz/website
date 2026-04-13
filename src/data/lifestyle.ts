export interface FavoriteBook {
  title: string;
  author?: string;
  href: string;
  /** Local WebP cover, e.g. /images/covers/books/atomic-habits.webp */
  coverUrl?: string;
}

export interface FavoriteFilm {
  title: string;
  href: string;
  posterUrl?: string;
}

/** Synced from Goodreads favorites shelf — edit as needed */
export const FAVORITE_BOOKS: FavoriteBook[] = [
  {
    title: 'Immune',
    author: 'Philipp Dettmer',
    href: 'https://www.goodreads.com/book/show/57693140-immune',
    coverUrl: '/images/covers/books/immune.webp',
  },
  {
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    href: 'https://www.goodreads.com/book/show/58416978-building-a-second-brain',
    coverUrl: '/images/covers/books/building-a-second-brain.webp',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    coverUrl: '/images/covers/books/atomic-habits.webp',
  },
  {
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    href: 'https://www.goodreads.com/book/show/18693655-a-mind-for-numbers',
    coverUrl: '/images/covers/books/a-mind-for-numbers.webp',
  },
  {
    title: 'Thanks for the Feedback',
    author: 'Douglas Stone',
    href: 'https://www.goodreads.com/book/show/18158600-thanks-for-the-feedback',
    coverUrl: '/images/covers/books/thanks-for-the-feedback.webp',
  },
];

export const GOODREADS_PROFILE = 'https://www.goodreads.com/user/show/77842684-guillermo-rodas';

/** Synced from Letterboxd favorite films */
export const FAVORITE_FILMS: FavoriteFilm[] = [
  {
    title: 'Memento',
    href: 'https://letterboxd.com/film/memento/',
    posterUrl: '/images/covers/films/memento.webp',
  },
  {
    title: 'Enemy',
    href: 'https://letterboxd.com/film/enemy/',
    posterUrl: '/images/covers/films/enemy.webp',
  },
  {
    title: 'Donnie Darko',
    href: 'https://letterboxd.com/film/donnie-darko/',
    posterUrl: '/images/covers/films/donnie-darko.webp',
  },
  {
    title: 'The Rescue',
    href: 'https://letterboxd.com/film/the-rescue-2021/',
    posterUrl: '/images/covers/films/the-rescue.webp',
  },
  {
    title: 'Oldboy',
    href: 'https://letterboxd.com/film/oldboy/',
    posterUrl: '/images/covers/films/oldboy.webp',
  },
];

export const LETTERBOXD_PROFILE = 'https://letterboxd.com/guillermorodas/';
