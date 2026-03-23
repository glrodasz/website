export interface FavoriteBook {
  title: string;
  author?: string;
  href: string;
}

export interface FavoriteFilm {
  title: string;
  href: string;
  posterUrl?: string;
}

/** Synced from Goodreads favorites shelf — edit as needed */
export const FAVORITE_BOOKS: FavoriteBook[] = [
  {
    title: 'Thanks for the Feedback',
    author: 'Douglas Stone',
    href: 'https://www.goodreads.com/book/show/18158600-thanks-for-the-feedback',
  },
  {
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    href: 'https://www.goodreads.com/book/show/18693655-a-mind-for-numbers',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
  },
  {
    title: 'Tools of Titans',
    author: 'Timothy Ferriss',
    href: 'https://www.goodreads.com/book/show/31823677-tools-of-titans',
  },
  {
    title: 'When',
    author: 'Daniel H. Pink',
    href: 'https://www.goodreads.com/book/show/33916051-when',
  },
  {
    title: 'Immune',
    author: 'Philipp Dettmer',
    href: 'https://www.goodreads.com/book/show/57693140-immune',
  },
  {
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    href: 'https://www.goodreads.com/book/show/58416978-building-a-second-brain',
  },
];

export const GOODREADS_PROFILE = 'https://www.goodreads.com/user/show/77842684-guillermo-rodas';

/** Synced from Letterboxd favorite films */
export const FAVORITE_FILMS: FavoriteFilm[] = [
  { title: 'Inception', href: 'https://letterboxd.com/film/inception/' },
  { title: 'Joker', href: 'https://letterboxd.com/film/joker-2019/' },
  { title: 'Hereditary', href: 'https://letterboxd.com/film/hereditary/' },
  { title: 'The Rescue', href: 'https://letterboxd.com/film/the-rescue-2021/' },
];

export const LETTERBOXD_PROFILE = 'https://letterboxd.com/guillermorodas/';
