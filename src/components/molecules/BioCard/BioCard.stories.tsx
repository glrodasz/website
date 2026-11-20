import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BioCard } from './BioCard';
import type { BioCardProps } from './BioCard';

const meta: Meta<typeof BioCard> = {
  title: 'Molecules/BioCard',
  component: BioCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 'min(640px, 90vw)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PERSON_OPTIONS = [
  { value: 'first', label: 'First person' },
  { value: 'third', label: 'Third person' },
];

const baseArgs = {
  personOptions: PERSON_OPTIONS,
  personLabel: 'Point of view',
  copyLabel: 'Copy',
  copyMarkdownLabel: 'Copy Markdown',
  copiedLabel: 'Copied',
  onPersonChange: () => {},
};

export const PlainText: Story = {
  args: {
    ...baseArgs,
    title: 'Very short',
    hint: 'X, Instagram, GitHub',
    characterCount: '72 characters',
    person: 'first',
    markdown: 'I build production AI systems and help developer communities level up.',
  },
};

export const WithFormatting: Story = {
  args: {
    ...baseArgs,
    title: 'Short',
    hint: 'LinkedIn, Twitch, YouTube',
    characterCount: '190 characters',
    person: 'third',
    markdown:
      '**Guillermo Rodas** is a Senior Forward Deployed Engineer building production AI systems, with over a decade of experience in web engineering. Originally from Colombia, now based in Sweden.',
  },
};

export const WithLinks: Story = {
  args: {
    ...baseArgs,
    title: 'Full',
    hint: 'Stack Overflow, speaker bios',
    characterCount: '640 characters',
    person: 'third',
    markdown:
      'Shipped products at [Klarna](https://www.klarna.com) and [Auth0](https://www.auth0.com).\n\nFormer [Google Developer Expert](https://glrz.me/gde) in Web Technologies.',
  },
};

const SwitchingBioCard = (args: BioCardProps) => {
  const [person, setPerson] = useState('first');
  return (
    <BioCard
      {...args}
      person={person}
      onPersonChange={setPerson}
      markdown={person === 'first' ? 'I build production AI systems.' : 'Guillermo builds production AI systems.'}
    />
  );
};

export const Interactive: Story = {
  render: (args) => <SwitchingBioCard {...args} />,
  args: {
    ...baseArgs,
    title: 'Very short',
    hint: 'X, Instagram, GitHub',
    characterCount: '31 characters',
    person: 'first',
    markdown: '',
  },
};
