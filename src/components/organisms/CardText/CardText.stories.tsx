import type { Meta, StoryObj } from '@storybook/react';
import { CardText } from './CardText';
import { Button } from '../../atoms';
import { ButtonGroup } from '../../molecules/ButtonGroup';

const meta: Meta<typeof CardText> = {
  title: 'Organisms/CardText',
  component: CardText,
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
type Story = StoryObj<typeof CardText>;

export const Default: Story = {
  args: {
    title: 'Frontend Mentorship',
    description: 'One-on-one sessions to level up your frontend career.',
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
        <Button variant="primary" size="small">Book a Session</Button>
        <Button variant="secondary" size="small">Details</Button>
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
        <CardText
          key={variant}
          title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} card`}
          description="Visual treatment driven by card-text tokens."
          variant={variant}
        />
      ))}
    </div>
  ),
};
