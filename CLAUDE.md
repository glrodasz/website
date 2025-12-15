# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Vite, React, and TypeScript. Components follow Atomic Design methodology and use design tokens from the W3C Design Tokens Community Group standard format.

## Technology Stack

- **Build Tool**: Vite
- **Framework**: React with TypeScript
- **Component Documentation**: Storybook
- **Design System**: Design Tokens (W3C Community Group standard format)
- **Component Architecture**: Atomic Design (atoms, molecules, organisms, templates, pages)

## Development Commands

### Initial Setup
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D @storybook/react-vite @storybook/react @storybook/addon-essentials
npx storybook@latest init
```

### Development
```bash
npm run dev              # Start Vite dev server
npm run storybook        # Start Storybook (default port 6006)
```

### Build & Preview
```bash
npm run build            # Build for production
npm run preview          # Preview production build
npm run build-storybook  # Build Storybook for deployment
```

### Testing
```bash
npm run test             # Run tests (if configured)
```

## Architecture

### Component Structure (Atomic Design)

Components are organized following Brad Frost's Atomic Design methodology:

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Input, Label, etc.)
│   ├── molecules/      # Simple groups of atoms (FormField, SearchBar, etc.)
│   ├── organisms/      # Complex UI components (Header, Form, Card, etc.)
│   ├── templates/      # Page-level layout structures
│   └── pages/          # Specific page instances
├── tokens/             # Design tokens utilities
└── stories/            # Storybook stories (co-located with components)
```

Each component should:
- Be placed in the appropriate atomic level directory
- Include a TypeScript interface for props
- Have an accompanying `.stories.tsx` file for Storybook
- Use design tokens for styling rather than hardcoded values

### Design Tokens System

The project uses design tokens defined in [design-tokens.tokens.json](design-tokens.tokens.json) following the W3C Design Tokens Community Group standard format.

**Token Structure:**
- Tokens are exported from Figma using the Figma Design Tokens plugin
- Schema includes: `type`, `value`, `blendMode`, and `extensions` (Figma metadata)
- Categories include: colors, typography, spacing, sizing, borders, shadows, etc.

**Token Organization:**
```json
{
  "global tokens": {
    "colors": {
      "schemas": {
        "frozen ribon": {
          "blue ribon": {
            "100": { "type": "color", "value": "#ebf2ffff" },
            "200": { "type": "color", "value": "#adcaffff" },
            ...
          }
        }
      }
    }
  }
}
```

**Using Tokens in Components:**
- Parse `design-tokens.tokens.json` to create CSS custom properties or TypeScript constants
- Reference tokens by their path (e.g., `colors.schemas.frozen-ribon.blue-ribon.400`)
- Never hardcode color values, spacing, or typography - always use tokens
- Consider creating a token utility/hook to access token values type-safely

### TypeScript Configuration

- Strict mode enabled
- Component props must be explicitly typed
- Use interfaces for component props, types for unions/intersections
- Follow React TypeScript best practices

## Component Development Workflow

1. **Determine Atomic Level**: Decide if component is atom, molecule, organism, template, or page
2. **Create Component File**: `src/components/{level}/{ComponentName}.tsx`
3. **Define Props Interface**: Use TypeScript interface with clear prop names
4. **Apply Design Tokens**: Reference tokens from `design-tokens.tokens.json`
5. **Create Story**: `src/components/{level}/{ComponentName}.stories.tsx`
6. **Document in Storybook**: Include multiple states/variants in stories

## Quantum Design System

This project uses **Quantum Design**, a comprehensive design system with three-level token hierarchy:

### Token Hierarchy

1. **Global Tokens** - Foundation layer with raw values
   - Colors: Multiple palettes (frozen ribon, aquamarine frozen, flash cerulean, etc.) with 100-600 scales
   - Sizing: Multiples of 2, ranging from 0-240px
   - Border radius: 0-100px options
   - Font families: 16 carefully selected families (Inter, Montserrat, DM Sans, Work Sans, etc.)
   - Font variants: Light (100), Regular (300), Medium (400), Semibold (600), Bold (700), Black (900)
   - Typography scale: Base sizes 8-22, with High/Medium/Low contrast ratios

2. **System Tokens** - Semantic layer with aliases
   - Colors: Primary, Complementary, Neutral, Info, Success, Warning, Danger, Backgrounds, Foregrounds, Typography, Borders, Transparency
   - Sizing: Named sizes (xxs=12, xs=16, sm=24, md=32, ml=48, lg=64, xl=96, xxl=148)
   - Spacing: Named spacing (xxs=4, xs=8, sm=12, md=24, ml=32, lm=48, lg=64, xl=80, xxl=116, xxxl=180)
   - Border radius: Named radius (flat=2, xs=4, sm=8, md=12, lm=16, lg=24, xl=32, xxl=48, full=100)
   - Elevations: soft, medium, high, extreme (shadow definitions)

3. **Component Tokens** - Component-specific values
   - Format: `{component}.{category}.{base}.{modifier}`
   - Example: `button.background-color.primary.hover`
   - Ensures consistency and logical connections across components

### Layouts

- **Fixed SM**: Mobile screens, 8 columns, 12px gutter, center, 312px container
- **Fixed MD**: ≥992px width, 8 columns, 12px gutter, center, 716px container
- **Fixed LG**: ≥1200px width, 12 columns, 16px gutter, center, 1140px container
- **Fixed XL**: ≥1440px width, 12 columns, 16px gutter, center, 1320px container
- **Fluid Container**: Large dimensions, 12 columns, 16px gutter, 32px margin, stretch
- **Fluid Side Menu**: Dashboards, 20-25% menu area, 80-75% content area

### Component Library

The system includes 40+ generic components organized by atomic design:

**Atoms**: Icons (Phosphor Icons), Navigation (Icon/Number/Check buttons), Typography, Information (Logo, Status, Tag)

**Molecules**: Navigation (Basic buttons, Dropdown, Breadcrumb, Pagination, Calendar), Input fields (Input text, Text area, Checkbox, Radio, Switch), Information & Display (Progress bar, Avatar, Tooltip, Alerts, Icon box, Entry title, Menu avatar, Accordion)

**Organisms**: Navigation (Button group, Float tab, Full tab), Input fields (Select, Card input), Display content (Card image, Card icon, Card text)

**Templates**: Navigation (Menu, Footer, Sidebar), Display content (Dialog, Data table, Header)

### Naming Convention

Component tokens follow: `{Object}.{Base}.{Modifier}`
- Object: Component name (e.g., button)
- Base: Category (e.g., background-color)
- Modifier: Variant (e.g., hover)
- Separate groups with slash (/) for hierarchy

Example: `button/background-color/primary/default`

### Design Token Integration

The `design-tokens.tokens.json` file (461KB) contains comprehensive design tokens including:
- Color schemes with multiple palettes following Quantum Design standards
- Complete sizing, spacing, and radius scales
- Typography definitions with font families and weights
- System-level semantic tokens for consistent UI patterns

When adding new styled components, always reference this token file rather than defining colors inline.
