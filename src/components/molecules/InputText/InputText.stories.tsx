import type { Meta, StoryObj } from '@storybook/react';
import { InputText } from './InputText';
import { MagnifyingGlass, User, EnvelopeSimple, LockKey } from 'phosphor-react';

const meta: Meta<typeof InputText> = {
  title: 'Molecules/Input Fields/InputText',
  component: InputText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Size of the input field',
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    size: 'large',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    size: 'large',
    icon: MagnifyingGlass,
  },
};

export const Small: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    size: 'small',
    icon: User,
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    size: 'large',
    icon: EnvelopeSimple,
    error: true,
    errorMessage: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    size: 'large',
    disabled: true,
    value: 'Disabled value',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      {/* Large inputs */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputText label="Default" placeholder="Enter text" size="large" />
          <InputText label="With Icon" placeholder="Search..." size="large" icon={MagnifyingGlass} />
          <InputText
            label="Error"
            placeholder="Enter email"
            size="large"
            icon={EnvelopeSimple}
            error
            errorMessage="This field is required"
          />
          <InputText
            label="Disabled"
            placeholder="Disabled input"
            size="large"
            disabled
            value="Disabled value"
          />
        </div>
      </div>

      {/* Small inputs */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputText label="Default" placeholder="Enter text" size="small" />
          <InputText label="With Icon" placeholder="Search..." size="small" icon={MagnifyingGlass} />
          <InputText
            label="Error"
            placeholder="Enter email"
            size="small"
            icon={EnvelopeSimple}
            error
            errorMessage="This field is required"
          />
          <InputText
            label="Disabled"
            placeholder="Disabled input"
            size="small"
            disabled
            value="Disabled value"
          />
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '20px', fontWeight: 600 }}>Sign In</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputText
          label="Email"
          placeholder="Enter your email"
          type="email"
          size="large"
          icon={EnvelopeSimple}
        />
        <InputText
          label="Password"
          placeholder="Enter your password"
          type="password"
          size="large"
          icon={LockKey}
        />
        <button
          style={{
            marginTop: '1rem',
            padding: '12px',
            backgroundColor: '#006E7A',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setError(e.target.value.length > 0 && !e.target.value.includes('@'));
    };

    return (
      <div style={{ width: '400px' }}>
        <InputText
          label="Email Validation"
          placeholder="Enter your email"
          size="large"
          icon={EnvelopeSimple}
          value={value}
          onChange={handleChange}
          error={error}
          errorMessage={error ? 'Please enter a valid email address' : undefined}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          Type to see validation in action
        </p>
      </div>
    );
  },
};
