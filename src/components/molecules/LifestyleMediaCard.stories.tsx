import type { Meta, StoryObj } from '@storybook/react';
import { LifestyleMediaCard } from './LifestyleMediaCard';

const meta: Meta<typeof LifestyleMediaCard> = {
  title: 'Molecules/LifestyleMediaCard',
  component: LifestyleMediaCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Skeuomorphic favorite: a 3D book or DVD keep case that turns over on hover (or tap / Enter) to reveal a personal note and the external link. Styled with **Site.Lifestyle-card** component tokens (object proportions, depth, materials, flip motion) and **Site.Course-card** tokens for the caption under the object.',
      },
    },
  },
  argTypes: {
    variant: { control: 'radio', options: ['book', 'dvd'] },
    defaultFlipped: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LifestyleMediaCard>;

const bookArgs = {
  variant: 'book' as const,
  href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
  imageUrl: '/images/covers/books/atomic-habits.webp',
  title: 'Atomic Habits',
  subtitle: 'James Clear',
  summary:
    "We fall short of our goals not from lack of motivation, but because we haven't made the path itself a habit. This book gave me concrete strategies that actually work.",
  placeholder: '📖',
  linkLabel: 'View on Goodreads',
  flipLabel: 'Turn Atomic Habits over to read why I recommend it',
  flipBackLabel: 'Turn back to the cover',
};

const dvdArgs = {
  variant: 'dvd' as const,
  href: 'https://letterboxd.com/film/memento/',
  imageUrl: '/images/covers/films/memento.webp',
  title: 'Memento',
  summary:
    "My all-time favorite. The director puts you inside the protagonist's mind in a way that feels genuinely disorienting, in the best possible sense.",
  placeholder: '▶',
  linkLabel: 'View on Letterboxd',
  flipLabel: 'Turn Memento over to read why I recommend it',
  flipBackLabel: 'Turn back to the cover',
};

export const Book: Story = { args: bookArgs };

export const BookFlipped: Story = { args: { ...bookArgs, defaultFlipped: true } };

export const Dvd: Story = { args: dvdArgs };

export const DvdFlipped: Story = { args: { ...dvdArgs, defaultFlipped: true } };

export const NoImage: Story = {
  args: { ...bookArgs, imageUrl: undefined, title: 'Untitled', subtitle: undefined },
};

export const NoImageDvd: Story = {
  args: { ...dvdArgs, imageUrl: undefined, title: 'Untitled' },
};

export const Shelf: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <LifestyleMediaCard {...bookArgs} />
      <LifestyleMediaCard
        {...bookArgs}
        imageUrl="/images/covers/books/immune.webp"
        title="Immune"
        subtitle="Philipp Dettmer"
      />
      <LifestyleMediaCard {...dvdArgs} />
    </div>
  ),
};
