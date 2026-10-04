import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { ProjectCard } from './ProjectCard';

// Inline SVG "screenshot" so stories never depend on network images
const placeholderScreenshot = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">
    <rect width="1280" height="800" fill="#FAFAFA"/>
    <rect x="80" y="80" width="560" height="64" rx="8" fill="#262626"/>
    <rect x="80" y="180" width="840" height="24" rx="6" fill="#BDBDBD"/>
    <rect x="80" y="224" width="720" height="24" rx="6" fill="#BDBDBD"/>
    <rect x="80" y="320" width="200" height="200" rx="12" fill="#FA8072"/>
    <rect x="300" y="320" width="200" height="200" rx="12" fill="#FFD700"/>
    <rect x="520" y="320" width="200" height="200" rx="12" fill="#6495ED"/>
    <rect x="740" y="320" width="200" height="200" rx="12" fill="#663399"/>
  </svg>`,
)}`;

const meta: Meta<typeof ProjectCard> = {
  title: 'Organisms/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    image: { control: 'text' },
    tags: { control: 'object' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: 'Favorite HTML Colors',
    description:
      'A hand-picked showcase of the 24 HTML named colors I keep forgetting, previewed live on buttons, type and UI mocks.',
    url: 'https://colors.guillermorodas.com',
    repoUrl: 'https://github.com/glrodasz/colors',
    image: placeholderScreenshot,
    imageAlt: 'Screenshot of Favorite HTML Colors',
    tags: ['Next.js', 'CSS'],
  },
};

/** No screenshot yet — the card draws a browser-window mockup instead. */
export const WithoutScreenshot: Story = {
  args: {
    title: 'The Lineage of JavaScript',
    description:
      'A scroll-driven history of three decades of JavaScript frameworks, each rendered in the visual language of its era.',
    url: 'https://javascript.guillermorodas.com',
    tags: ['Vite', 'TypeScript', 'Animation'],
  },
};

/** A broken image URL falls back to the mockup. */
export const BrokenScreenshot: Story = {
  args: {
    ...WithoutScreenshot.args,
    image: '/does-not-exist.webp',
  },
};

export const Minimal: Story = {
  args: {
    title: 'Timepass',
    description: 'A native Apple Silicon menu bar app that shows multiple time zones.',
    url: 'https://github.com/glrodasz/timepass',
  },
};

export const Spanish: Story = {
  args: {
    ...Default.args,
    description:
      'Una selección de los 24 colores con nombre de HTML que siempre olvido, con vista previa en botones, tipografía y maquetas de UI.',
    visitLabel: 'Ver proyecto',
    sourceLabel: 'Código',
    shareLabel: 'Compartir',
    shareOnLabel: (network: string) => `Compartir en ${network}`,
    shareNativeLabel: 'Compartir…',
    copyLinkLabel: 'Copiar enlace',
    copiedLabel: 'Enlace copiado',
  },
};

export const List: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <ProjectCard {...(Default.args as ComponentProps<typeof ProjectCard>)} />
      <ProjectCard {...(WithoutScreenshot.args as ComponentProps<typeof ProjectCard>)} />
      <ProjectCard {...(Minimal.args as ComponentProps<typeof ProjectCard>)} />
    </div>
  ),
};

export const Dark: Story = {
  ...Default,
  parameters: { backgrounds: { default: 'dark' } },
  globals: { theme: 'dark' },
};
