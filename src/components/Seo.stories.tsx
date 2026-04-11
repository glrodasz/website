import type { Meta, StoryObj } from '@storybook/react';
import { Seo } from './Seo';

const meta: Meta<typeof Seo> = {
  title: 'Utilities/Seo',
  component: Seo,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Value written to `<title>` and og:/twitter: title meta tags.',
    },
    description: {
      control: 'text',
      description:
        'Meta description. Falls back to `defaultDescription` from `src/data/site.ts` when omitted.',
    },
    path: {
      control: 'text',
      description:
        'Path only (e.g. `/contact`). Combined with `VITE_SITE_URL` to emit canonical + og:url.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Seo>;

const wrapperStyle: React.CSSProperties = {
  padding: 24,
  fontFamily: 'system-ui, sans-serif',
  lineHeight: 1.5,
  maxWidth: 640,
};

const codeStyle: React.CSSProperties = {
  background: '#f4f4f5',
  padding: '2px 6px',
  borderRadius: 4,
  fontFamily: 'ui-monospace, SFMono-Regular, Menospace, monospace',
  fontSize: 13,
};

const HeadExplainer = ({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  path?: string;
}) => (
  <section style={wrapperStyle}>
    <h2 style={{ marginTop: 0 }}>Seo</h2>
    <p>
      <code style={codeStyle}>&lt;Seo /&gt;</code> renders a fragment of{' '}
      <code style={codeStyle}>&lt;title&gt;</code> and{' '}
      <code style={codeStyle}>&lt;meta&gt;</code> elements. React 19 hoists
      these into the iframe's <code style={codeStyle}>&lt;head&gt;</code>{' '}
      automatically.
    </p>
    <p>
      Open the preview iframe in DevTools → Elements and expand{' '}
      <code style={codeStyle}>&lt;head&gt;</code> to verify the tags below are
      present:
    </p>
    <ul>
      <li>
        <code style={codeStyle}>&lt;title&gt;{title}&lt;/title&gt;</code>
      </li>
      <li>
        <code style={codeStyle}>
          &lt;meta name="description" content="{description ?? '(defaultDescription)'}" /&gt;
        </code>
      </li>
      <li>
        <code style={codeStyle}>
          &lt;meta property="og:title" content="{title}" /&gt;
        </code>
      </li>
      <li>
        <code style={codeStyle}>
          &lt;meta property="og:type" content="website" /&gt;
        </code>
      </li>
      <li>
        canonical + og:url emitted only when{' '}
        <code style={codeStyle}>VITE_SITE_URL</code> is set (path:{' '}
        <code style={codeStyle}>{path ?? '/'}</code>)
      </li>
    </ul>
  </section>
);

export const Default: Story = {
  args: {
    title: 'Home · Guillermo Rodas',
    description: 'Personal site and design system lab',
    path: '/',
  },
  render: (args) => (
    <>
      <Seo {...args} />
      <HeadExplainer {...args} />
    </>
  ),
};

export const ContactPage: Story = {
  args: {
    title: 'Contact · Guillermo Rodas',
    path: '/contact',
  },
  render: (args) => (
    <>
      <Seo {...args} />
      <HeadExplainer {...args} />
    </>
  ),
};
