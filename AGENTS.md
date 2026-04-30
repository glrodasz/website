# AGENTS.md

Quick-reference rules for AI agents working on this codebase. See `CLAUDE.md` for the full guide.

## Token Hierarchy — Non-Negotiable

Every visual value (color, spacing, radius, typography) must travel the full chain:

```
CSS file  →  --components-tokens--*  →  --system-tokens--*  →  --global-tokens--*
```

### Rule: No raw values or system/global tokens in CSS files

```css
/* ❌ Wrong — hardcoded value */
.page-hero { padding: 48px 24px; }

/* ❌ Wrong — skips component level */
.page-hero { padding: var(--system-tokens--spacing--lm) var(--system-tokens--spacing--md); }

/* ✅ Correct — full hierarchy */
.page-hero { padding: var(--components-tokens--site--page-layout--spacing--hero-top)
                      var(--components-tokens--site--page-layout--spacing--section-horizontal); }
```

### When the component token doesn't exist yet

1. Open `src/tokens/json/components.json`
2. Add the token under the right namespace (component name or `Site` for page-level)
3. Set `$type`, `$value`, and `aliasData.targetVariableName` pointing to a system token
4. Run `npm run build:tokens`
5. Use the generated `--components-tokens--*` variable in CSS

```json
"Site": {
  "My-section": {
    "spacing": {
      "gap": {
        "$type": "number",
        "$value": 24,
        "$extensions": {
          "com.figma.aliasData": {
            "targetVariableName": "Spacing/md",
            "targetVariableSetName": "System Tokens"
          }
        }
      }
    }
  }
}
```

### System spacing scale (for picking the right alias)

| Token | Value | CSS variable |
|---|---|---|
| `Spacing/xxs` | 4px | `--system-tokens--spacing--xxs` |
| `Spacing/xs` | 8px | `--system-tokens--spacing--xs` |
| `Spacing/sm` | 12px | `--system-tokens--spacing--sm` |
| `Spacing/md` | 24px | `--system-tokens--spacing--md` |
| `Spacing/ml` | 32px | `--system-tokens--spacing--ml` |
| `Spacing/lm` | 48px | `--system-tokens--spacing--lm` |
| `Spacing/lg` | 64px | `--system-tokens--spacing--lg` |
| `Spacing/xl` | 80px | `--system-tokens--spacing--xl` |

### System border-radius scale

| Token | Value |
|---|---|
| `Border radius/xs` | 4px |
| `Border radius/sm` | 8px |
| `Border radius/md` | 12px |
| `Border radius/lm` | 16px |
| `Border radius/lg` | 24px |
| `Border radius/full` | 100px |

## Other Key Rules

- **Never edit `src/tokens/design-tokens.css` directly** — it is generated. Edit the JSON files instead.
- **BEM with `qd-` prefix** for all component classes.
- **`system-dark.json`** only needs tokens whose values differ in dark mode.
- Run `npm run build:tokens` after every change to the JSON token files.

## Keyboard Focus — Required for Every Interactive Element

Every interactive element (`<button>`, `<a>`, form input, custom widget with
`role="button"`, etc.) must show a clear focus ring on **keyboard** focus.

The site provides a global `:focus-visible` rule in `src/styles/global.css`
that paints the ring on any focusable element that doesn't override it.
Component-level overrides exist where the default ring color would clash
with the element's own background.

### Default ring — use the shared `Site/focus-ring` tokens

```css
.my-component:focus-visible {
  outline: var(--components-tokens--site--focus-ring--outline-width) solid
           var(--components-tokens--site--focus-ring--outline-color);
  outline-offset: var(--components-tokens--site--focus-ring--outline-offset);
}
```

The `Site/focus-ring/outline-color` token aliases to `Colors/Borders/focus`,
which resolves to:

| Theme | Hex | Notes |
|---|---|---|
| Light | `#0040B8` (Frozen ribon / Blue Ribon 500) | WCAG AA on white & yellow |
| Dark | `#F7DF1D` (Metal chartreuse / Chartreuse 400) | WCAG AAA on near-black |

### Rules

1. **Always use `:focus-visible`**, never plain `:focus`. The plain pseudo
   shows the ring on mouse click too, which the design doesn't want.
2. **Never write `outline: none`** without an alternative indicator. If you
   must remove the outline (e.g. on form inputs styled via `box-shadow`),
   apply the ring through `box-shadow` or `border-color` using the same
   focus token: `Colors/Borders/focus` →
   `--system-tokens--colors--borders--focus`.
3. **The focus color is theme-aware.** Both modes pass WCAG AA — never
   override with a hardcoded hex.
4. **Do not hardcode the ring width or color in CSS.** Always go through
   `--components-tokens--site--focus-ring--*`. If a component needs a
   different color for contrast reasons, add a component-scoped token
   (e.g. `button.outline-color.focus`) aliased to `Colors/Borders/focus`
   in `components.json` — never raw hex.
5. **Skip-link is required.** `App.tsx` ships a `.skip-to-content` link
   that is hidden until keyboard-focused; do not remove it. The `<main>`
   landmark must keep `id="main-content"` and `tabIndex={-1}` so the
   link can target it.
