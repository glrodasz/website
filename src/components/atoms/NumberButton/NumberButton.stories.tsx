import type { Meta, StoryObj } from '@storybook/react';
import { NumberButton } from './NumberButton';

const meta: Meta<typeof NumberButton> = {
  title: 'Atoms/Navigation/NumberButton',
  component: NumberButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Size of the button',
    },
    selected: {
      control: 'boolean',
      description: 'Selected/active state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    children: {
      control: 'text',
      description: 'Button content (typically a number)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '1',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    children: '2',
    size: 'small',
  },
};

export const Selected: Story = {
  args: {
    children: '3',
    size: 'large',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '4',
    size: 'large',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Large size variants */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Size</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <NumberButton size="large">1</NumberButton>
          <NumberButton size="large" selected>2</NumberButton>
          <NumberButton size="large">3</NumberButton>
          <NumberButton size="large" disabled>4</NumberButton>
        </div>
      </div>

      {/* Small size variants */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Size</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <NumberButton size="small">1</NumberButton>
          <NumberButton size="small" selected>2</NumberButton>
          <NumberButton size="small">3</NumberButton>
          <NumberButton size="small" disabled>4</NumberButton>
        </div>
      </div>
    </div>
  ),
};

export const PaginationExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <NumberButton size="large">1</NumberButton>
      <NumberButton size="large" selected>2</NumberButton>
      <NumberButton size="large">3</NumberButton>
      <NumberButton size="large">4</NumberButton>
      <NumberButton size="large">5</NumberButton>
      <span style={{ padding: '0 0.5rem' }}>...</span>
      <NumberButton size="large">10</NumberButton>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [selected, setSelected] = React.useState(1);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <NumberButton
            key={num}
            size="large"
            selected={selected === num}
            onClick={() => setSelected(num)}
            aria-label={`Page ${num}`}
          >
            {num}
          </NumberButton>
        ))}
      </div>
    );
  },
};
