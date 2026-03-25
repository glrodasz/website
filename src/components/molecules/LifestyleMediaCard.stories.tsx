import type { Meta, StoryObj } from '@storybook/react';
import { LifestyleMediaCard } from './LifestyleMediaCard';

const meta: Meta<typeof LifestyleMediaCard> = {
  title: 'Molecules/LifestyleMediaCard',
  component: LifestyleMediaCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LifestyleMediaCard>;

export const Book: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://covers.openlibrary.org/b/id/12539702-M.jpg',
    title: 'Atomic Habits',
    subtitle: 'James Clear',
    placeholder: '📖',
  },
};

export const Film: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    title: 'Inception',
    placeholder: '▶',
  },
};

export const NoImage: Story = {
  args: {
    href: 'https://example.com',
    title: 'Untitled',
    placeholder: '▶',
  },
};
