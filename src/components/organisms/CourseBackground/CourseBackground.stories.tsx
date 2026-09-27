import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { CourseBackground } from './CourseBackground';
import { NARROW_MAX_WIDTH } from './graph';
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
    containerType: 'inline-size',
    border: '2px solid var(--components-tokens--site--course-card--hover-border-color)',
    background: 'var(--components-tokens--site--course-card--surface-color)',
  };
  return (
    <div style={style}>
      <CourseBackground />
      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            // Mirrors the pages: from tablet up the copy keeps to the left, the network owns the right.
            maxWidth: width >= NARROW_MAX_WIDTH ? 'var(--components-tokens--site--course-background--content-width)' : undefined,
          }}
        >
          {children}
        </div>
      )}
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
          'Animated 3D neural network (Three.js, loaded lazily) behind the AI-first course card: a golden plexus cloud with star-flare hubs, depth-of-field bokeh and pulse cascades over a soft atmosphere (warm beige on light, smoky gray on dark), framed from the middle of the card to its right edge. Move the pointer over the card for parallax; scrolling adds more. Phone-width cards keep full-width copy, so the network recedes further there. Switch the theme from the toolbar; colors come from the `Site.Course-background` tokens. Honors `prefers-reduced-motion` with a single still frame.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CourseBackground>;

/** Courses page and 404 on desktop. */
export const Wide: Story = {
  render: () => <CardShell width={1080} height={420} />,
};

/** Half-width Home card on desktop. */
export const Compact: Story = {
  render: () => <CardShell width={560} height={400} />,
};

/** Phone-width card: full-width copy, so the network is faded further. */
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
