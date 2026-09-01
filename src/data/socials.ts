export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

/** Single source of truth for every social profile's label and URL. */
const SOCIALS: Record<string, { label: string; href: string }> = {
  twitter: { label: 'Twitter', href: 'https://x.com/germorodas' },
  twitch: { label: 'Twitch', href: 'https://twitch.tv/guillermorodas' },
  youtube: { label: 'YouTube', href: 'https://youtube.com/guillermorodas' },
  instagram: { label: 'Instagram', href: 'https://instagram.com/germorodas' },
  linkedin: { label: 'LinkedIn', href: 'https://linkedin.com/in/guillermorodas' },
  threads: { label: 'Threads', href: 'https://threads.net/@germorodas' },
  tiktok: { label: 'TikTok', href: 'https://tiktok.com/@_guillermorodas' },
  facebook: { label: 'Facebook', href: 'https://facebook.com/guillermorodas.dev' },
  bluesky: { label: 'Bluesky', href: 'https://bsky.app/profile/guillermorodas.com' },
  mastodon: { label: 'Mastodon', href: 'https://mastodon.cloud/@guillermorodas' },
  github: { label: 'GitHub', href: 'https://github.com/glrodasz' },
  goodreads: { label: 'Goodreads', href: 'https://goodreads.com/guillermorodas' },
};

const socialLink = (id: string, labelOverride?: string): SocialLink => ({
  id,
  label: labelOverride ?? SOCIALS[id].label,
  href: SOCIALS[id].href,
});

/** Shown on Contact page */
export const contactSocials: SocialLink[] = [
  socialLink('twitter', 'Twitter / X'),
  socialLink('instagram'),
  socialLink('linkedin'),
  socialLink('bluesky'),
  socialLink('mastodon'),
  socialLink('threads'),
];

/** Footer “Follow me” — order matches guillermorodas.com */
export const footerSocials: SocialLink[] = [
  'twitter',
  'twitch',
  'youtube',
  'instagram',
  'linkedin',
  'threads',
  'tiktok',
  'facebook',
  'bluesky',
  'mastodon',
  'github',
  'goodreads',
].map((id) => socialLink(id));
