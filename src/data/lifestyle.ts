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

export interface FavoriteSeries {
  title: string;
  /** IMDb title page — there is no Letterboxd equivalent for TV */
  href: string;
  posterUrl?: string;
  summary?: string;
  summaryEs?: string;
}

export interface FavoriteAnime {
  title: string;
  /** MyAnimeList title page */
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

export const FAVORITE_SERIES: FavoriteSeries[] = [
  {
    title: 'Black Sails',
    href: 'https://www.imdb.com/title/tt2375692/',
    summary: 'A pirate drama written as a prequel to Treasure Island. What starts as an adventure grows into a sharp story about power, loyalty, and the myths people build around themselves.',
    summaryEs: 'Un drama de piratas escrito como precuela de La isla del tesoro. Lo que empieza como una aventura se convierte en una historia afilada sobre el poder, la lealtad y los mitos que construimos sobre nosotros mismos.',
  },
  {
    title: 'Better Call Saul',
    href: 'https://www.imdb.com/title/tt3032476/',
    summary: 'The rare spin-off that lives up to Breaking Bad. A patient, character-driven look at how Jimmy McGill becomes Saul Goodman, one small compromise at a time.',
    summaryEs: 'Ese raro spin-off que está a la altura de Breaking Bad. Una mirada paciente, centrada en los personajes, a cómo Jimmy McGill se convierte en Saul Goodman, una pequeña concesión a la vez.',
  },
  {
    title: 'Dexter',
    href: 'https://www.imdb.com/title/tt0773262/',
    summary: 'A forensic blood-spatter analyst who is secretly a serial killer, hunting only other killers. A dark premise carried by a narrator you end up rooting for against your better judgment.',
    summaryEs: 'Un analista forense de manchas de sangre que en secreto es un asesino en serie y solo caza a otros asesinos. Una premisa oscura sostenida por un narrador al que terminas apoyando aunque sepas que no deberías.',
  },
  {
    title: 'How I Met Your Mother',
    href: 'https://www.imdb.com/title/tt0460649/',
    summary: 'A sitcom told as one long flashback, full of running jokes and callbacks that pay off seasons later. Light, warm, and easy to rewatch with friends.',
    summaryEs: 'Una comedia contada como un largo flashback, llena de chistes recurrentes y guiños que se resuelven temporadas después. Ligera, cálida y perfecta para volver a ver con amigos.',
  },
  {
    title: 'House of Cards',
    href: 'https://www.imdb.com/title/tt1856010/',
    summary: 'A ruthless congressman climbs his way to the top of Washington, breaking the fourth wall to let you in on every move. Cynical, sharp, and hard to stop watching.',
    summaryEs: 'Un congresista despiadado escala hasta la cima de Washington, rompiendo la cuarta pared para contarte cada movimiento. Cínica, afilada y difícil de dejar de ver.',
  },
];

export const FAVORITE_ANIME: FavoriteAnime[] = [
  {
    title: 'Fullmetal Alchemist',
    href: 'https://myanimelist.net/anime/121',
    summary: 'Two brothers pay a terrible price for trying to bring their mother back with alchemy. The original adaptation takes its own darker path, and its ending still hits hard.',
    summaryEs: 'Dos hermanos pagan un precio terrible por intentar traer de vuelta a su madre con la alquimia. La adaptación original toma su propio camino, más oscuro, y su final sigue golpeando fuerte.',
  },
  {
    title: 'Gantz',
    href: 'https://myanimelist.net/anime/384',
    summary: 'People who die are pulled into a room and forced to hunt aliens in a brutal game nobody explains. Violent, disturbing, and impossible to look away from.',
    summaryEs: 'Personas que mueren son llevadas a una habitación y obligadas a cazar alienígenas en un juego brutal que nadie explica. Violento, perturbador e imposible de dejar de mirar.',
  },
  {
    title: 'Frieren',
    href: 'https://myanimelist.net/anime/52991',
    summary: 'What happens after the hero\'s journey ends. An elf mage outlives her companions and slowly learns what those years meant. Quiet, melancholic, and beautifully paced.',
    summaryEs: 'Lo que pasa después de que termina el viaje del héroe. Una maga elfa sobrevive a sus compañeros y poco a poco entiende lo que significaron esos años. Tranquila, melancólica y con un ritmo precioso.',
  },
];
