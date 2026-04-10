# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Vite, React, and TypeScript. Components follow Atomic Design methodology and implement the **Quantum Design** system via a three-level design token hierarchy following the W3C Design Tokens Community Group standard.

## Technology Stack

- **Build Tool**: Vite
- **Framework**: React with TypeScript (strict mode)
- **Component Documentation**: Storybook
- **Design System**: Quantum Design (three-level token hierarchy)
- **Token Format**: W3C DTCG (Design Tokens Community Group)
- **Component Architecture**: Atomic Design

## Development Commands

```bash
npm run dev              # Build tokens + posts, then start Vite dev server
npm run build            # Build tokens + posts + TS check + Vite + Storybook
npm run storybook        # Build tokens + posts, then start Storybook on port 6006
npm run build:tokens     # Regenerate design-tokens.css from JSON source files
npm run build:posts      # Build blog post data
npm run lint             # Run ESLint
npm run preview          # Preview production build
npm run build-storybook  # Build Storybook as static site
```

> **Token builds run automatically** before `dev`, `build`, and `storybook`. If you change any file in `src/tokens/json/`, you must run `npm run build:tokens` for the changes to take effect in CSS.

---

## Architecture

### Component Structure (Atomic Design)

```
src/
├── components/
│   ├── atoms/          # Basic building blocks: Button, Icon, Typography, Tag, Badge…
│   ├── molecules/      # Composite components: InputText, IconButton, Accordion…
│   ├── organisms/      # Complex UI sections: Header, Footer, CardImage…
│   ├── templates/      # Page-level layout structures
│   └── pages/          # Specific page instances
├── hooks/              # Shared hooks (e.g. useTheme)
├── tokens/             # Token build system
│   ├── json/
│   │   ├── global.json         # Level 1 — raw design values
│   │   ├── system-light.json   # Level 2 — semantic tokens, light theme
│   │   ├── system-dark.json    # Level 2 — semantic tokens, dark theme overrides
│   │   └── components.json     # Level 3 — component-specific tokens
│   ├── build-tokens.ts  # Build script: JSON → CSS
│   ├── parser.ts        # W3C DTCG token parser
│   ├── generator.ts     # CSS custom property generator
│   └── design-tokens.css  # ⚠️ GENERATED — do not edit directly
└── scripts/
    └── build-posts.ts   # Blog post build script
```

Each component lives alongside its styles and story:

```
src/components/atoms/
├── Button.tsx
├── Button.css
└── Button.stories.tsx

src/components/molecules/InputText/   # complex molecules use a folder
├── InputText.tsx
├── InputText.css
├── InputText.stories.tsx
└── index.ts
```

---

## Quantum Design System

This project implements **Quantum Design**, a component library built on a three-level token hierarchy. All visual decisions (color, spacing, radius, typography) must trace back through this hierarchy — never use hardcoded values.

### Three-Level Token Hierarchy

```
Level 1: Global Tokens      (raw values — palettes, scale)
              ↓ aliased by
Level 2: System Tokens      (semantic meaning — "primary", "danger", "spacing.md")
              ↓ aliased by
Level 3: Component Tokens   (component usage — "button.background-color.primary.hover")
              ↓ consumed by
CSS Component Styles        (Button.css, InputText.css, …)
```

#### Level 1 — Global Tokens (`global.json`)

Raw design values. These are the source of all colors, sizes, and typography. Never reference global tokens directly in component CSS.

| Category | Description |
|---|---|
| Colors | Multiple palettes (frozen ribon, aquamarine frozen, flash cerulean, metal chartreuse, shark…) with 100–600 scales |
| Sizing | Multiples of 2, 0–240px |
| Border radius | 0–100px |
| Font families | 16 families (Inter, Montserrat, DM Sans, Work Sans…) |
| Font weights | Light (100), Regular (300), Medium (400), Semibold (600), Bold (700), Black (900) |
| Typography scale | Base sizes 8–22, high/medium/low contrast ratios |

#### Level 2 — System Tokens (`system-light.json` / `system-dark.json`)

Semantic aliases to global tokens. These give meaning to raw values. Theme-aware: light and dark modes define different values for the same token names.

| Category | Tokens |
|---|---|
| Colors — Primary | `principal`, `subtle`, `off`, `high` |
| Colors — Complementary | `principal` (#F7DF1D yellow), `subtle`, `off`, `high` |
| Colors — Neutral | `principal` (#454545), `subtle`, `off`, `high` (#262626) |
| Colors — Semantic | `info`, `success`, `warning`, `danger` (each with `high`/`low`) |
| Colors — Backgrounds | `principal`, `secondary`, `tertiary`, `subtle`, `neutral`, `contrast` |
| Colors — Foregrounds | `principal`, `secondary`, `tertiary`, `neutral`, `contrast`, `disabled` |
| Colors — Typography | `heading`, `paragraph`, `highlight`, `alternative`, `contrast`, `link`, `disabled` |
| Colors — Borders | `strong`, `neutral`, `disabled`, `alternative` |
| Sizing | `xxs`=12, `xs`=16, `sm`=24, `md`=32, `ml`=48, `lg`=64, `xl`=96, `xxl`=148 |
| Spacing | `xxs`=4, `xs`=8, `sm`=12, `md`=24, `ml`=32, `lm`=48, `lg`=64, `xl`=80, `xxl`=116, `xxxl`=180 |
| Border radius | `flat`=2, `xs`=4, `sm`=8, `md`=12, `lm`=16, `lg`=24, `xl`=32, `xxl`=48, `full`=100 |
| Elevations | `soft`, `medium`, `high`, `extreme` |

**Dark mode override rule**: `system-dark.json` only needs to define tokens whose values change in dark mode. Tokens omitted from it inherit from `system-light.json` via `:root`. Tokens that must stay constant across themes (e.g. neutral--high on a yellow button) must be explicitly set in `system-dark.json` with the same value.

#### Level 3 — Component Tokens (`components.json`)

Component-specific aliases to system tokens. Format: `{component}.{category}.{variant}.{state}`.

Examples:
```
button.background-color.primary.default    → system: complementary.principal  → #F7DF1D
button.background-color.primary.hover      → system: complementary.principal  → #F7DF1D
button.text-color.primary.default          → system: neutral.high              → #262626
button.text-color.primary.hover            → system: neutral.principal         → #454545
button.background-color.primary.acctived   → system: complementary.high        → #313D00
```

### CSS Variable Naming Convention

The build script converts the JSON hierarchy into CSS custom properties with this pattern:

```
--{level}--{category}--{subcategory}--{property}--{state}
```

Transformation rules: spaces → hyphens, dots → double hyphens, all lowercase.

```css
/* Global tokens */
--global-tokens--colors--schemas--frozen-ribon--blue-ribon--100
--global-tokens--colors--custom--principal-palette--600

/* System tokens */
--system-tokens--colors--complementary--principal    /* #F7DF1D */
--system-tokens--colors--neutral--high               /* #262626 */
--system-tokens--colors--backgrounds--principal
--system-tokens--spacing--md                         /* 24px */
--system-tokens--border-radius--sm                   /* 8px */

/* Component tokens */
--components-tokens--button--background-color--primary--default
--components-tokens--button--text-color--primary--hover
--components-tokens--button--spacing--large--vertical
--components-tokens--button--border-radius--large
```

### Token Build System

**Source files** (edit these):
- `src/tokens/json/global.json`
- `src/tokens/json/system-light.json`
- `src/tokens/json/system-dark.json`
- `src/tokens/json/components.json`

**Generated file** (do not edit):
- `src/tokens/design-tokens.css`

**Build command**:
```bash
npm run build:tokens
```

**CSS output structure**:
```css
:root {
  /* All global tokens */
  /* All component tokens */
  /* Non-color system tokens (spacing, sizing, radius, typography) */
}

[data-theme="light"] {
  /* System color tokens — light values */
}

[data-theme="dark"] {
  /* System color tokens — dark overrides only */
}
```

### W3C DTCG JSON Format

Token files use the W3C DTCG format with Figma extensions. The parser uses `$value.hex` for colors and `$extensions.com.figma.aliasData.targetVariableName` to resolve cross-token references.

```json
{
  "button": {
    "background-color": {
      "primary": {
        "default": {
          "$type": "color",
          "$value": {
            "colorSpace": "srgb",
            "components": [0.9686274509803922, 0.8745098039215686, 0.11372549019607843],
            "alpha": 1,
            "hex": "#F7DF1D"
          },
          "$extensions": {
            "com.figma.variableId": "VariableID:48:12126",
            "com.figma.aliasData": {
              "targetVariableId": "VariableID:...",
              "targetVariableName": "Colors/Complementary/principal",
              "targetVariableSetName": "System Tokens"
            }
          }
        }
      }
    }
  }
}
```

When editing token JSON:
- Update `$value.hex` with the correct hex color
- Update `$value.components` with sRGB float values (hex channel / 255)
- Update `aliasData.targetVariableName` to point to the correct system/global token
- Run `npm run build:tokens` after every change

### Dark Mode

Theme is applied via the `data-theme` attribute on `<html>`. Managed by `src/hooks/useTheme.ts`:

1. Checks `localStorage` for a persisted user preference
2. Falls back to `prefers-color-scheme` OS setting
3. Falls back to light mode

To toggle: call `toggleTheme()` from `useTheme()`. The CSS cascades automatically from `[data-theme="dark"]` overrides.

---

## Component Conventions

### CSS Class Naming — BEM with `qd-` prefix

```
qd-{component}                       # Block
qd-{component}--{variant}            # Block modifier (variant, size, state)
qd-{component}__element              # Element
qd-{component}__element--{modifier}  # Element modifier
```

Examples:
```css
.qd-button                            /* block */
.qd-button--primary                   /* variant modifier */
.qd-button--large                     /* size modifier */
.qd-button--disabled                  /* state modifier */
.qd-button__icon                      /* child element */
.qd-input-text__container--error      /* element + state modifier */
```

### Component Props Pattern

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost-light' | 'ghost-dark';
  size?: 'small' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  to?: string;    // React Router Link (internal)
  href?: string;  // Anchor tag (external)
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  disabled = false,
  children,
  onClick,
  className,
}) => {
  const classNames = [
    'qd-button',
    `qd-button--${variant}`,
    `qd-button--${size}`,
    disabled && 'qd-button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ...
};
```

- Use `React.FC<Props>` with an explicit exported interface
- Default values in destructuring, not `defaultProps`
- Build class strings by joining a filtered array — no `classnames` library needed

### Component CSS Pattern

```css
@import '../../tokens/design-tokens.css';

/* Block base */
.qd-button {
  /* structural/layout only — no colors */
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

/* Size modifiers */
.qd-button--large {
  padding: var(--components-tokens--button--spacing--large--vertical)
           var(--components-tokens--button--spacing--large--horizontal);
  gap: var(--components-tokens--button--spacing--large--gap);
  border-radius: var(--components-tokens--button--border-radius--large);
}

/* Variant modifiers */
.qd-button--primary {
  background-color: var(--components-tokens--button--background-color--primary--default);
  color: var(--components-tokens--button--text-color--primary--default);
  border-color: var(--components-tokens--button--background-color--primary--default);
}

.qd-button--primary:hover:not(.qd-button--disabled) {
  background-color: var(--components-tokens--button--background-color--primary--hover);
  color: var(--components-tokens--button--text-color--primary--hover);
}

/* Disabled */
.qd-button--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Exports

Always export both the component and its props interface:

```typescript
// src/components/atoms/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

For folder-based molecules, add an `index.ts`:
```typescript
// src/components/molecules/InputText/index.ts
export { InputText } from './InputText';
export type { InputTextProps } from './InputText';
```

---

## Storybook Conventions

Stories are colocated with their component. Title reflects the atomic level.

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',      // Atoms / Molecules / Organisms
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost-light', 'ghost-dark'],
    },
    size: { control: 'radio', options: ['small', 'large'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'large', children: 'Get started' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost-light">Ghost Light</Button>
    </div>
  ),
};
```

For dark-background variants:
```typescript
export const GhostDark: Story = {
  args: { variant: 'ghost-dark', children: 'Dark ghost' },
  parameters: { backgrounds: { default: 'dark' } },
};
```

---

## Rules

1. **Never hardcode color, spacing, radius, or typography values.** Always trace through the token hierarchy: use a component token if one exists, a system token if not, never a global token directly in CSS.

2. **`design-tokens.css` is generated.** Only edit the JSON source files in `src/tokens/json/`, then run `npm run build:tokens`. Changes to `design-tokens.css` will be overwritten.

3. **Theme-invariant tokens must be explicit.** If a component token must stay the same color in both light and dark mode (e.g. dark text on a yellow button), add that system token to `system-dark.json` with the same value — don't rely on it being undefined.

4. **Component tokens reference system tokens.** Set `aliasData.targetVariableName` to the appropriate system token path (e.g. `"Colors/Neutral/high"`). Only define raw hex values in `system-dark.json` for overrides that don't have an existing global alias.

5. **Use BEM with `qd-` prefix.** Every class starts with `qd-{component}`. Variants and states are modifiers (`--`), child elements use element syntax (`__`).

6. **Place components at the right atomic level.** No skipping levels — a molecule can only use atoms, an organism can use molecules and atoms.

7. **Every component needs a story.** Include at minimum: default state, all major variants, disabled state.

8. **Export both component and interface.** Every public component exports its props type alongside the component itself.
