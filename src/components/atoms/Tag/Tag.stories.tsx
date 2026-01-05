import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Information/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Size of the tag',
    },
    variant: {
      control: 'select',
      options: ['discovery', 'info', 'success', 'warning', 'error', 'neutral'],
      description: 'Semantic variant determining the color',
    },
    outlined: {
      control: 'boolean',
      description: 'Use outlined style instead of filled',
    },
    children: {
      control: 'text',
      description: 'Tag content/label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Tag',
    size: 'large',
    variant: 'neutral',
  },
};

export const WithCloseButton: Story = {
  args: {
    children: 'Closeable',
    size: 'large',
    variant: 'info',
    onClose: () => alert('Tag closed!'),
  },
};

export const Small: Story = {
  args: {
    children: 'Small Tag',
    size: 'small',
    variant: 'success',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined',
    size: 'large',
    variant: 'warning',
    outlined: true,
  },
};

export const AllVariantsFilled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Large filled */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Filled</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag size="large" variant="discovery">Discovery</Tag>
          <Tag size="large" variant="info">Info</Tag>
          <Tag size="large" variant="success">Success</Tag>
          <Tag size="large" variant="warning">Warning</Tag>
          <Tag size="large" variant="error">Error</Tag>
          <Tag size="large" variant="neutral">Neutral</Tag>
        </div>
      </div>

      {/* Small filled */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Filled</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag size="small" variant="discovery">Discovery</Tag>
          <Tag size="small" variant="info">Info</Tag>
          <Tag size="small" variant="success">Success</Tag>
          <Tag size="small" variant="warning">Warning</Tag>
          <Tag size="small" variant="error">Error</Tag>
          <Tag size="small" variant="neutral">Neutral</Tag>
        </div>
      </div>
    </div>
  ),
};

export const AllVariantsOutlined: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Large outlined */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large Outlined</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag size="large" variant="discovery" outlined>Discovery</Tag>
          <Tag size="large" variant="info" outlined>Info</Tag>
          <Tag size="large" variant="success" outlined>Success</Tag>
          <Tag size="large" variant="warning" outlined>Warning</Tag>
          <Tag size="large" variant="error" outlined>Error</Tag>
          <Tag size="large" variant="neutral" outlined>Neutral</Tag>
        </div>
      </div>

      {/* Small outlined */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small Outlined</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag size="small" variant="discovery" outlined>Discovery</Tag>
          <Tag size="small" variant="info" outlined>Info</Tag>
          <Tag size="small" variant="success" outlined>Success</Tag>
          <Tag size="small" variant="warning" outlined>Warning</Tag>
          <Tag size="small" variant="error" outlined>Error</Tag>
          <Tag size="small" variant="neutral" outlined>Neutral</Tag>
        </div>
      </div>
    </div>
  ),
};

export const WithCloseButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Tag size="large" variant="discovery" onClose={() => console.log('Removed')}>Discovery</Tag>
      <Tag size="large" variant="info" onClose={() => console.log('Removed')}>Info</Tag>
      <Tag size="large" variant="success" onClose={() => console.log('Removed')}>Success</Tag>
      <Tag size="large" variant="warning" onClose={() => console.log('Removed')}>Warning</Tag>
      <Tag size="large" variant="error" onClose={() => console.log('Removed')}>Error</Tag>
      <Tag size="large" variant="neutral" onClose={() => console.log('Removed')}>Neutral</Tag>
    </div>
  ),
};

export const FilterExample: Story = {
  render: function FilterStory() {
    const [tags, setTags] = React.useState([
      { id: 1, label: 'React', variant: 'info' as const },
      { id: 2, label: 'TypeScript', variant: 'discovery' as const },
      { id: 3, label: 'Storybook', variant: 'success' as const },
      { id: 4, label: 'Design Tokens', variant: 'warning' as const },
    ]);

    const removeTag = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id));
    };

    return (
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>
          Active Filters ({tags.length})
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <Tag
              key={tag.id}
              size="large"
              variant={tag.variant}
              onClose={() => removeTag(tag.id)}
            >
              {tag.label}
            </Tag>
          ))}
        </div>
      </div>
    );
  },
};
