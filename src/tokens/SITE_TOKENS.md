# Site component tokens (`Site` namespace in `components.json`)

**Location:** Site tokens live under the `Site` key in [`json/components.json`](json/components.json) and build into `--components-tokens--site--…` CSS variables like every other component namespace.

**Layering:** These are **component-layer** tokens (Quantum Design). Each entry aliases a **system** semantic via a `{system.…}` reference in its `$value`. Page CSS should use only `var(--components-tokens--site--…)` for these roles—not `--system-tokens--` or `--global-tokens--`.

## Role → system mapping

| Site token (CSS suffix) | System reference | Use in CSS |
|------------------------|------------------|------------|
| `site--colors--background` | `{system.Colors.Backgrounds.principal}` | Page background (`--color-bg` alias in global.css) |
| `site--colors--surface` | `{system.Colors.Backgrounds.tertiary}` | Cards, raised surfaces (`--color-surface`) |
| `site--colors--surface-secondary` | `{system.Colors.Backgrounds.neutral}` | Secondary surfaces (`--color-surface-2`) |
| `site--colors--text` | `{system.Colors.Foregrounds.principal}` | Body text (`--color-text`) |
| `site--colors--text-muted` | `{system.Colors.Foregrounds.neutral}` | Muted text (`--color-text-muted`) |
| `site--colors--border` | `{system.Colors.Borders.neutral}` | Default borders (`--color-border`) |
| `site--colors--accent` | `{system.Colors.Complementary.principal}` | Golden-yellow accent (`--color-accent`) |
| `site--colors--accent-text` | `{system.Colors.Complementary.subtle}` | Accent-tinted text on plain backgrounds |
| `site--colors--on-accent` | `{system.Colors.Fixed.on-accent}` | Text on the yellow accent — theme-invariant dark (#1A1A1A) |
| `site--typography--font-family--headings` | `{system.Typography.Font-family.Headings}` | h1–h6 |
| `site--typography--font-family--body` | `{system.Typography.Font-family.Body}` | body, buttons |
| `site--typography--font-family--code` | `{system.Typography.Font-family.Code}` | code, pre, kbd, samp |
| `site--page--on-dark-text` | `{system.Colors.Foregrounds.contrast}` | Section leads, intro copy, headlines on dark sections |
| `site--course-card--border-color` | `{system.Colors.Borders.strong}` | Default card / row border |
| `site--course-card--surface-color` | `{system.Colors.Primary.high}` | Card / row background |
| `site--course-card--media-background-color` | `{system.Colors.Backgrounds.contrast}` | Thumbnail area, placeholders |
| `site--course-card--text-on-accent-color` | `{system.Colors.Backgrounds.contrast}` | Text on yellow accent (e.g. badge on `--color-accent`) |
| `site--course-card--card-title-color` | `{system.Colors.Foregrounds.contrast}` | Card title on dark surface |
| `site--course-card--card-description-color` | `{system.Colors.Foregrounds.disabled}` | Muted body line on dark cards |
| `site--course-card--hover-border-color` | `{system.Colors.Complementary.principal}` | Card hover border (e.g. `LifestyleMediaCard`, course rows) |
| `site--course-card--media-placeholder-accent-color` | `{system.Colors.Complementary.principal}` | Icon/emoji on empty media area |

**Gradients:** Use `surface-color` and `media-background-color` for start/end stops (same system targets as today; split later if the featured card should diverge).

## Changing appearance

Edit **system** tokens in `system-light.json` / `system-dark.json` for global theme shifts. To point **only** marketing/course surfaces at a different system semantic, change the `{system.…}` reference under `Site` in `components.json` and run `npm run build:tokens`.
