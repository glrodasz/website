import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'heading', 'title', 'subtitle', 'paragraph', 'label', 'button'],
      description: 'Typography variant from Quantum Design system',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label'],
      description: 'HTML element to render',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Display: Story = {
  args: {
    variant: 'display',
    children: 'Display Text - Large and Bold',
  },
};

export const Heading: Story = {
  args: {
    variant: 'heading',
    children: 'Heading Text - For Major Sections',
  },
};

export const Title: Story = {
  args: {
    variant: 'title',
    children: 'Title Text - For Subsections',
  },
};

export const Subtitle: Story = {
  args: {
    variant: 'subtitle',
    children: 'Subtitle Text - For Supporting Information',
  },
};

export const Paragraph: Story = {
  args: {
    variant: 'paragraph',
    children: 'Paragraph text for body content. This is the standard text style used throughout the application for readable content.',
  },
};

export const Label: Story = {
  args: {
    variant: 'label',
    children: 'Label Text',
  },
};

export const ButtonText: Story = {
  args: {
    variant: 'button',
    children: 'Button Text',
  },
};

// Typography scale showcase
export const TypographyScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="display">Display Text</Typography>
      <Typography variant="heading">Heading Text</Typography>
      <Typography variant="title">Title Text</Typography>
      <Typography variant="subtitle">Subtitle Text</Typography>
      <Typography variant="paragraph">
        Paragraph text for body content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography variant="label">Label Text</Typography>
      <Typography variant="button">Button Text</Typography>
    </div>
  ),
};

// Content example
export const ContentExample: Story = {
  render: () => (
    <div style={{ maxWidth: '640px' }}>
      <Typography variant="display" as="h1">
        Quantum Design System
      </Typography>
      <Typography variant="paragraph" as="p" style={{ marginTop: '16px' }}>
        A comprehensive design system with three-level token hierarchy: Global, System, and Component tokens.
      </Typography>

      <Typography variant="heading" as="h2" style={{ marginTop: '32px' }}>
        Typography Guidelines
      </Typography>
      <Typography variant="paragraph" as="p" style={{ marginTop: '16px' }}>
        The typography system provides consistent text styles across the entire application. Each variant serves a specific purpose in the content hierarchy.
      </Typography>

      <Typography variant="title" as="h3" style={{ marginTop: '24px' }}>
        Using Typography Components
      </Typography>
      <Typography variant="paragraph" as="p" style={{ marginTop: '12px' }}>
        Typography components automatically apply the correct font size, weight, line height, and spacing according to the Quantum Design specifications.
      </Typography>
    </div>
  ),
};
