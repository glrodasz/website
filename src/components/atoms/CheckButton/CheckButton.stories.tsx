import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckButton } from './CheckButton';

const meta: Meta<typeof CheckButton> = {
  title: 'Atoms/Navigation/CheckButton',
  component: CheckButton,
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
    active: {
      control: 'boolean',
      description: 'Active/completed state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    label: {
      control: 'text',
      description: 'Optional label text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'large',
    active: false,
  },
};

export const Active: Story = {
  args: {
    size: 'large',
    active: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    active: false,
  },
};

export const SmallActive: Story = {
  args: {
    size: 'small',
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    size: 'large',
    active: false,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Large size variants */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Size</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CheckButton size="large" />
          <CheckButton size="large" active />
          <CheckButton size="large" disabled />
          <CheckButton size="large" active disabled />
        </div>
      </div>

      {/* Small size variants */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Size</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CheckButton size="small" />
          <CheckButton size="small" active />
          <CheckButton size="small" disabled />
          <CheckButton size="small" active disabled />
        </div>
      </div>
    </div>
  ),
};

export const StepIndicatorExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <CheckButton size="large" active aria-label="Step 1 completed" />
      <div style={{ width: '60px', height: '2px', backgroundColor: '#006E7A' }} />
      <CheckButton size="large" active aria-label="Step 2 completed" />
      <div style={{ width: '60px', height: '2px', backgroundColor: '#006E7A' }} />
      <CheckButton size="large" aria-label="Step 3 not completed" />
      <div style={{ width: '60px', height: '2px', backgroundColor: '#ddd' }} />
      <CheckButton size="large" aria-label="Step 4 not completed" />
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [steps, setSteps] = React.useState([true, true, false, false]);

    const toggleStep = (index: number) => {
      const newSteps = [...steps];
      newSteps[index] = !newSteps[index];
      setSteps(newSteps);
    };

    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {steps.map((isActive, index) => (
          <React.Fragment key={index}>
            <CheckButton
              size="large"
              active={isActive}
              onClick={() => toggleStep(index)}
              aria-label={`Step ${index + 1} ${isActive ? 'completed' : 'not completed'}`}
            />
            {index < steps.length - 1 && (
              <div
                style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: isActive && steps[index + 1] ? '#006E7A' : '#ddd',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
