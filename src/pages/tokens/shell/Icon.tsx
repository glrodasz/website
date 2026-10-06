/**
 * The playground's line icons: 16px, stroked in currentColor, always
 * decorative (the control they sit in carries the name).
 */

const PATHS = {
  menu: 'M2.5 4h11M2.5 8h11M2.5 12h11',
  search: 'M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10ZM10.6 10.6 14 14',
  map: 'M2 3h3v3H2zM11 3h3v3h-3zM2 10h3v3H2zM11 10h3v3h-3zM5 4.5h6M5 11.5h6M5 6l6 4',
  global: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13ZM1.5 8h13M8 1.5c1.8 1.8 2.6 4 2.6 6.5S9.8 12.7 8 14.5C6.2 12.7 5.4 10.5 5.4 8S6.2 3.3 8 1.5Z',
  system: 'M8 1.8 14.2 5 8 8.2 1.8 5 8 1.8ZM1.8 8 8 11.2 14.2 8M1.8 11 8 14.2 14.2 11',
  components: 'M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z',
  audit: 'M8 1.5 13.5 3.5v4c0 3.3-2.3 5.9-5.5 7-3.2-1.1-5.5-3.7-5.5-7v-4L8 1.5ZM5.5 8l1.8 1.8L10.8 6.3',
  chevronRight: 'M6 3.5 10.5 8 6 12.5',
  chevronDown: 'M3.5 6 8 10.5 12.5 6',
  categories: 'M2 2h5.6l6.4 6.4-5.6 5.6L2 7.6V2ZM5 5.01V5',
  reset: 'M2.8 6.2A5.5 5.5 0 1 1 3 10.5M2.5 2.5v3.8h3.8',
  panel: 'M2 2.5h12v11H2zM2 9.5h12',
  close: 'M3.5 3.5l9 9M12.5 3.5l-9 9',
  maximize: 'M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9',
  restore: 'M13.5 2.5 9.5 6.5M9.5 3v3.5H13M2.5 13.5l4-4M6.5 13V9.5H3',
  copy: 'M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3',
  check: 'M3 8.5 6.5 12 13 4.5',
  inspector: 'M2.5 3h11M2.5 8h7M2.5 13h9M12.5 10.5a2 2 0 1 0 0-.01',
  arrowRight: 'M2.5 8h11M9.5 4l4 4-4 4',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`tokens-icon${className ? ` ${className}` : ''}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
