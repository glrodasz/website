import type { Meta, StoryObj } from '@storybook/react';
import { CardImage } from './CardImage';
import { Button } from '../../atoms';
import { ButtonGroup } from '../../molecules/ButtonGroup';

// Inline SVG placeholder so stories never depend on network images
const placeholderImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
    <rect width="640" height="360" fill="#006E7A"/>
    <circle cx="480" cy="80" r="120" fill="#F7DF1D" opacity="0.6"/>
    <circle cx="120" cy="300" r="160" fill="#0A60FF" opacity="0.4"/>
  </svg>`
)}`;

const meta: Meta<typeof CardImage> = {
  title: 'Organisms/CardImage',
  component: CardImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'elevation', 'edge', 'contrast'],
      description: 'Visual treatment of the card surface',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardImage>;

export const Default: Story = {
  args: {
    image: placeholderImage,
    imageAlt: 'Abstract illustration',
    title: 'Design Systems 101',
    description: 'Learn how design tokens keep products visually consistent.',
    variant: 'flat',
  },
};

export const Elevation: Story = {
  args: {
    ...Default.args,
    variant: 'elevation',
  },
};

export const Edge: Story = {
  args: {
    ...Default.args,
    variant: 'edge',
  },
};

export const Contrast: Story = {
  args: {
    ...Default.args,
    variant: 'contrast',
  },
};

export const WithActions: Story = {
  args: {
    ...Default.args,
    variant: 'edge',
    actions: (
      <ButtonGroup size="small">
        <Button variant="primary" size="small">Enroll</Button>
        <Button variant="secondary" size="small">Preview</Button>
      </ButtonGroup>
    ),
  },
};

export const AllVariants: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 'auto' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 320px)', gap: '24px' }}>
      {(['flat', 'elevation', 'edge', 'contrast'] as const).map((variant) => (
        <CardImage
          key={variant}
          image={placeholderImage}
          imageAlt="Abstract illustration"
          title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} card`}
          description="Visual treatment driven by card-image tokens."
          variant={variant}
        />
      ))}
    </div>
  ),
};
