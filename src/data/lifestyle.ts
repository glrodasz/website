export interface FavoriteBook {
  title: string;
  author?: string;
  href: string;
  /** Open Library covers CDN, e.g. https://covers.openlibrary.org/b/id/{id}-M.jpg */
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
    title: 'Thanks for the Feedback',
    author: 'Douglas Stone',
    href: 'https://www.goodreads.com/book/show/18158600-thanks-for-the-feedback',
    coverUrl: 'https://covers.openlibrary.org/b/id/9549524-M.jpg',
  },
  {
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    href: 'https://www.goodreads.com/book/show/18693655-a-mind-for-numbers',
    coverUrl: 'https://covers.openlibrary.org/b/id/8352403-M.jpg',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    coverUrl: 'https://covers.openlibrary.org/b/id/12539702-M.jpg',
  },
  {
    title: 'Tools of Titans',
    author: 'Timothy Ferriss',
    href: 'https://www.goodreads.com/book/show/31823677-tools-of-titans',
    coverUrl: 'https://covers.openlibrary.org/b/id/7902475-M.jpg',
  },
  {
    title: 'When',
    author: 'Daniel H. Pink',
    href: 'https://www.goodreads.com/book/show/33916051-when',
    coverUrl: 'https://covers.openlibrary.org/b/id/8804774-M.jpg',
  },
  {
    title: 'Immune',
    author: 'Philipp Dettmer',
    href: 'https://www.goodreads.com/book/show/57693140-immune',
    coverUrl: 'https://covers.openlibrary.org/b/id/10954401-M.jpg',
  },
  {
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    href: 'https://www.goodreads.com/book/show/58416978-building-a-second-brain',
    coverUrl: 'https://covers.openlibrary.org/b/id/12372866-M.jpg',
  },
];

export const GOODREADS_PROFILE = 'https://www.goodreads.com/user/show/77842684-guillermo-rodas';

/** Synced from Letterboxd favorite films */
export const FAVORITE_FILMS: FavoriteFilm[] = [
  {
    title: 'Inception',
    href: 'https://letterboxd.com/film/inception/',
    posterUrl: 'https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
  },
  {
    title: 'Joker',
    href: 'https://letterboxd.com/film/joker-2019/',
    posterUrl: 'https://image.tmdb.org/t/p/w342/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
  },
  {
    title: 'Hereditary',
    href: 'https://letterboxd.com/film/hereditary/',
    posterUrl: 'https://image.tmdb.org/t/p/w342/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg',
  },
  {
    title: 'The Rescue',
    href: 'https://letterboxd.com/film/the-rescue-2021/',
    posterUrl: 'https://image.tmdb.org/t/p/w342/kC7fVtCkJACwPBaRr2hlj2whfKX.jpg',
  },
];

export const LETTERBOXD_PROFILE = 'https://letterboxd.com/guillermorodas/';
