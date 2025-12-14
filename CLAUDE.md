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

## Design Token Integration

The `design-tokens.tokens.json` file (461KB) contains comprehensive design tokens including:
- Color schemes with multiple palettes (frozen ribon, aquamarine frozen, etc.)
- Numeric scales (100-600 + opacity variants)
- Figma integration metadata

When adding new styled components, always reference this token file rather than defining colors inline.
