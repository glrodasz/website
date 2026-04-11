/** Footer "Follow me" on narrow viewports — display order */
export const FOOTER_MOBILE_SOCIAL_IDS = [
  'twitter',
  'instagram',
  'linkedin',
  'twitch',
  'youtube',
] as const;

export type FooterMobileSocialId = (typeof FOOTER_MOBILE_SOCIAL_IDS)[number];
