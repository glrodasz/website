import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Molecules/Input Fields/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    errorMessage: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    size: 'large',
    rows: 4,
  },
};

export const Small: Story = {
  args: {
    label: 'Comment',
    placeholder: 'Add a comment...',
    size: 'small',
    rows: 3,
  },
};

export const Error: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    size: 'large',
    error: true,
    errorMessage: 'Description must be at least 10 characters',
    value: 'Too short',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'This textarea is disabled',
    size: 'large',
    disabled: true,
    value: 'This content cannot be edited',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '500px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextArea label="Default" placeholder="Enter text..." size="large" rows={4} />
          <TextArea
            label="Error"
            placeholder="Enter text..."
            size="large"
            rows={4}
            error
            errorMessage="This field is required"
          />
          <TextArea
            label="Disabled"
            placeholder="Disabled..."
            size="large"
            rows={4}
            disabled
            value="Disabled content"
          />
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextArea label="Default" placeholder="Enter text..." size="small" rows={3} />
          <TextArea
            label="Error"
            placeholder="Enter text..."
            size="small"
            rows={3}
            error
            errorMessage="This field is required"
          />
          <TextArea
            label="Disabled"
            placeholder="Disabled..."
            size="small"
            rows={3}
            disabled
            value="Disabled content"
          />
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [value, setValue] = React.useState('');
    const maxLength = 200;
    const remaining = maxLength - value.length;

    return (
      <div style={{ width: '500px' }}>
        <TextArea
          label="Feedback"
          placeholder="Share your thoughts..."
          size="large"
          rows={5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '12px', color: remaining < 20 ? '#dc3545' : '#666' }}>
          {remaining} characters remaining
        </p>
      </div>
    );
  },
};
