import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { CourseBackground } from './CourseBackground';
import { Badge } from '../../atoms/Badge';
import { WaitlistForm } from '../../molecules/WaitlistForm';

/** Card shell matching the AI-first course card, so the network is judged on its real surface. */
const CardShell: React.FC<{ width: number; height?: number; children?: ReactNode }> = ({ width, height, children }) => {
  const style: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width,
    height,
    boxSizing: 'border-box',
    padding: 'var(--components-tokens--site--course-section--featured--padding-mobile) var(--components-tokens--site--course-section--featured--padding-horizontal)',
    borderRadius: 'var(--components-tokens--site--course-section--featured--border-radius)',
    border: '2px solid var(--components-tokens--site--course-card--hover-border-color)',
    background: 'var(--components-tokens--site--course-card--surface-color)',
  };
  return (
    <div style={style}>
      <CourseBackground />
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  );
};

const CardContent: React.FC = () => (
  <>
    <Badge variant="accent" size="small" uppercase>Coming soon</Badge>
    <h2 style={{ color: 'var(--components-tokens--site--course-card--card-title-color)' }}>AI-first Programming</h2>
    <p
      style={{
        color: 'var(--components-tokens--site--course-card--card-description-color)',
        maxWidth: 'var(--components-tokens--site--course-card--content-max-width)',
      }}
    >
      Learn to build software using AI as your primary tool, through 5-minute focused video lessons.
    </p>
    <WaitlistForm />
  </>
);

const meta: Meta<typeof CourseBackground> = {
  title: 'Organisms/CourseBackground',
  component: CourseBackground,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated neural network behind the AI-first course card. The layout follows the card width: wide cards get a full network in the free column right of the copy, narrow cards a smaller one in the top-right corner. Switch the theme from the toolbar; colors come from the `Site.Course-background` tokens. Honors `prefers-reduced-motion` with a single still frame.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CourseBackground>;

/** Courses page and 404 on desktop: the network fills the column right of the copy. */
export const Wide: Story = {
  render: () => <CardShell width={1080} height={420} />,
};

/** Half-width Home card on desktop, and tablets. */
export const Compact: Story = {
  render: () => <CardShell width={560} height={400} />,
};

/** Phone-width card. */
export const Mobile: Story = {
  render: () => <CardShell width={358} height={300} />,
};

/** With the real card copy and form on top, to check legibility. */
export const WithContent: Story = {
  render: () => (
    <CardShell width={1080}>
      <CardContent />
    </CardShell>
  ),
};

export const WithContentMobile: Story = {
  render: () => (
    <CardShell width={358}>
      <CardContent />
    </CardShell>
  ),
};
