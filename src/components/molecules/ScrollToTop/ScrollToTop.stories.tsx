import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';

const meta: Meta<typeof ScrollToTop> = {
  title: 'Molecules/ScrollToTop',
  component: ScrollToTop,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    behavior: {
      control: 'radio',
      options: ['instant', 'auto', 'smooth'],
      description:
        'Scroll behavior applied on route change. Defaults to `instant`.',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/page-a']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScrollToTop>;

const tallPageStyle: React.CSSProperties = {
  minHeight: 2000,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  fontFamily: 'system-ui, sans-serif',
};

const PageA = () => (
  <div style={{ ...tallPageStyle, backgroundColor: '#fafafa' }}>
    <div>
      <h2>Page A</h2>
      <p>
        Scroll down, then click the link at the bottom. The next page starts
        at scroll position 0 thanks to <code>ScrollToTop</code>.
      </p>
      <Link to="/page-b">Go to Page B (top link)</Link>
    </div>
    <div>
      <Link to="/page-b">Go to Page B (bottom link)</Link>
    </div>
  </div>
);

const PageB = () => (
  <div style={{ ...tallPageStyle, backgroundColor: '#f0f8ff' }}>
    <div>
      <h2>Page B</h2>
      <p>You should be at the top of this page after navigation.</p>
      <Link to="/page-a">Back to Page A (top link)</Link>
    </div>
    <div>
      <Link to="/page-a">Back to Page A (bottom link)</Link>
    </div>
  </div>
);

const Harness = ({ behavior }: { behavior?: ScrollBehavior }) => (
  <>
    <ScrollToTop behavior={behavior} />
    <Routes>
      <Route path="/page-a" element={<PageA />} />
      <Route path="/page-b" element={<PageB />} />
    </Routes>
  </>
);

export const Default: Story = {
  args: { behavior: 'instant' },
  render: (args) => <Harness behavior={args.behavior} />,
};

export const Smooth: Story = {
  args: { behavior: 'smooth' },
  render: (args) => <Harness behavior={args.behavior} />,
};
