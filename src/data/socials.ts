export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

/** Shown on Contact page */
export const contactSocials: SocialLink[] = [
  { id: 'twitter', label: 'Twitter / X', href: 'https://x.com/guillermorodas' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/_guillermorodas' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/guillermorodas' },
  { id: 'bluesky', label: 'Bluesky', href: 'https://bsky.app/profile/guillermorodas.com' },
  { id: 'mastodon', label: 'Mastodon', href: 'https://mastodon.cloud/@guillermorodas' },
  { id: 'threads', label: 'Threads', href: 'https://threads.net/@_guillermorodas' },
];

/** Footer “Follow me” — order matches guillermorodas.com */
export const footerSocials: SocialLink[] = [
  { id: 'twitter', label: 'Twitter', href: 'https://x.com/guillermorodas' },
  { id: 'twitch', label: 'Twitch', href: 'https://twitch.tv/guillermorodas' },
  { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/guillermorodas' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/_guillermorodas' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/guillermorodas' },
  { id: 'threads', label: 'Threads', href: 'https://threads.net/@_guillermorodas' },
  { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@_guillermorodas' },
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/guillermorodas.dev' },
  { id: 'bluesky', label: 'Bluesky', href: 'https://bsky.app/profile/guillermorodas.com' },
  { id: 'mastodon', label: 'Mastodon', href: 'https://mastodon.cloud/@guillermorodas' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/glrodasz' },
  { id: 'goodreads', label: 'Goodreads', href: 'https://goodreads.com/guillermorodas' },
];
