# Site component tokens (`site-components.json`)

**Figma export strategy:** Site tokens live in [`json/site-components.json`](json/site-components.json) and are merged at build time (see [`build-tokens.ts`](build-tokens.ts)). Re-exporting `components.json` from Figma does not remove or overwrite them.

**Layering:** These are **component-layer** tokens (Quantum Design). Each entry aliases a **system** semantic via `com.figma.aliasData.targetVariableName`. Page CSS should use only `var(--components-tokens--site--…)` for these roles—not `--system-tokens--` or `--global-tokens--`.

## Role → system mapping

| Site token (CSS suffix) | System `targetVariableName` | Use in CSS |
|------------------------|-----------------------------|------------|
| `site--page--on-dark-text` | `Colors/Foregrounds/contrast` | Section leads, intro copy, headlines on dark sections |
| `site--course-card--border-color` | `Colors/Borders/strong` | Default card / row border |
| `site--course-card--surface-color` | `Colors/Primary/high` | Card / row background |
| `site--course-card--media-background-color` | `Colors/Backgrounds/contrast` | Thumbnail area, placeholders |
| `site--course-card--text-on-accent-color` | `Colors/Backgrounds/contrast` | Text on yellow accent (e.g. badge on `--color-accent`) |
| `site--course-card--card-title-color` | `Colors/Foregrounds/contrast` | Card title on dark surface |
| `site--course-card--card-description-color` | `Colors/Foregrounds/disabled` | Muted body line on dark cards |

**Gradients:** Use `surface-color` and `media-background-color` for start/end stops (same system targets as today; split later if the featured card should diverge).

## Changing appearance

Edit **system** tokens in `system.json` for global theme shifts. To point **only** marketing/course surfaces at a different system semantic, change the alias in `site-components.json` and run `npm run build:tokens`.

## Library atoms (follow-up)

Quantum primitives under `src/components/atoms` and `molecules` (Tag, InputText, TextArea, NumberButton, Status, Typography, etc.) still use `--system-tokens--*` for spacing, borders, and colors where they are not yet wired to `--components-tokens--{library}--*`. Refactoring those files to the published component token names from `components.json` is a separate pass; **site** surfaces (pages + `LifestyleMediaCard`) are covered by `Site.*` above.
