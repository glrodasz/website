/**
 * The playground toolbar above the canvas: the preview Theme, the Categories
 * and Components filters, the map's 2D/3D switch, Reset filters and the
 * addons panel toggle. On narrow screens it also opens the navigation drawer.
 */

import { useMemo, useState } from 'react';
import type { ThemeMode } from '../../../tokens/graph-builder';
import type { MapMode } from '../map/MapView';
import { Icon } from './Icon';
import { ToolbarMenu } from './ToolbarMenu';

export interface FilterItem {
  key: string;
  label: string;
}

export interface ToolbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  categories: readonly FilterItem[];
  enabledCategories: ReadonlySet<string>;
  onCategoriesChange: (next: Set<string>) => void;
  components: readonly FilterItem[];
  enabledComponents: ReadonlySet<string>;
  onComponentsChange: (next: Set<string>) => void;
  /** Shown on the Map tab only. */
  mapMode: MapMode | null;
  webglUnavailable: boolean;
  onMapModeChange: (mode: MapMode) => void;
  filtersChanged: boolean;
  onResetFilters: () => void;
  /** Null where the panel is a bottom sheet that follows the selection instead. */
  panelOpen: boolean | null;
  onTogglePanel: () => void;
  /** Null where the navigation is always visible. */
  navOpen: boolean | null;
  navId: string;
  onToggleNav: () => void;
}

const THEMES: { mode: ThemeMode; label: string; hint: string }[] = [
  { mode: 'light', label: 'Light', hint: 'Light values, white canvas' },
  { mode: 'dark', label: 'Dark', hint: 'Dark overrides, slate canvas' },
];

interface FilterMenuContentProps {
  title: string;
  /** Plural, lower case: 'categories'. */
  noun: string;
  items: readonly FilterItem[];
  enabled: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
  searchable: boolean;
}

/** The body of a filter popover: bulk actions, an optional search and one checkbox row per item. */
function FilterMenuContent({ title, noun, items, enabled, onChange, searchable }: FilterMenuContentProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  // While searching, the bulk actions apply to the matches only.
  const scope = q ? 'shown' : 'all';
  // The menu is a single Tab stop that follows focus (roving tabindex), so
  // Shift+Tab from any item leaves the menu. It falls back to the first row
  // when the focused item is filtered out.
  const [current, setCurrent] = useState<string | null>(null);
  const tabStop =
    current !== null && visible.some((i) => current === `${i.key}:item` || current === `${i.key}:only`)
      ? current
      : visible.length > 0
        ? `${visible[0].key}:item`
        : null;

  const setMany = (keys: readonly FilterItem[], on: boolean) => {
    const next = new Set(enabled);
    for (const { key } of keys) {
      if (on) next.add(key);
      else next.delete(key);
    }
    onChange(next);
  };

  return (
    <>
      <div className="tokens-menu__head">
        <span className="tokens-menu__title">{title}</span>
        <span className="tokens-menu__bulk">
          <button type="button" className="tokens-menu__bulk-button" onClick={() => setMany(visible, true)}>
            Select {scope}
          </button>
          <button type="button" className="tokens-menu__bulk-button" onClick={() => setMany(visible, false)}>
            Clear{q ? ' shown' : ''}
          </button>
        </span>
      </div>
      {searchable && (
        <div className="tokens-menu__search">
          <Icon name="search" />
          <input
            type="search"
            className="tokens-menu__search-input"
            placeholder={`Find ${noun}…`}
            aria-label={`Find ${noun}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Escape in a field with text clears it; an empty field lets the menu close.
              if (e.key === 'Escape' && query) {
                e.preventDefault();
                e.stopPropagation();
                setQuery('');
              }
            }}
          />
        </div>
      )}
      {visible.length === 0 ? (
        <p className="tokens-menu__empty">No {noun} match “{query.trim()}”.</p>
      ) : (
        <div role="menu" aria-label={title} className="tokens-menu__list">
          {visible.map((item) => {
            const checked = enabled.has(item.key);
            return (
              <div key={item.key} role="none" className="tokens-menu__row" data-menu-row data-menu-text={item.label}>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  className="tokens-menu__item"
                  data-menu-primary
                  tabIndex={tabStop === `${item.key}:item` ? 0 : -1}
                  onFocus={() => setCurrent(`${item.key}:item`)}
                  onClick={() => {
                    const next = new Set(enabled);
                    if (checked) next.delete(item.key);
                    else next.add(item.key);
                    onChange(next);
                  }}
                >
                  <span className="tokens-menu__check" aria-hidden="true">
                    {checked && <Icon name="check" />}
                  </span>
                  <span className="tokens-menu__item-label">{item.label}</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="tokens-menu__only"
                  data-menu-secondary
                  tabIndex={tabStop === `${item.key}:only` ? 0 : -1}
                  onFocus={() => setCurrent(`${item.key}:only`)}
                  aria-label={`Show only ${item.label}`}
                  onClick={() => onChange(new Set([item.key]))}
                >
                  Only
                </button>
              </div>
            );
          })}
        </div>
      )}
      <p className="tokens-menu__foot">
        {enabled.size} of {items.length} {noun} shown
      </p>
    </>
  );
}

function CountBadge({ on, total }: { on: number; total: number }) {
  return (
    <span className={`tokens-toolbar__badge${on < total ? ' tokens-toolbar__badge--filtered' : ''}`}>
      {on}/{total}
    </span>
  );
}

export function Toolbar({
  theme,
  onThemeChange,
  categories,
  enabledCategories,
  onCategoriesChange,
  components,
  enabledComponents,
  onComponentsChange,
  mapMode,
  webglUnavailable,
  onMapModeChange,
  filtersChanged,
  onResetFilters,
  panelOpen,
  onTogglePanel,
  navOpen,
  navId,
  onToggleNav,
}: ToolbarProps) {
  const themeLabel = THEMES.find((t) => t.mode === theme)!.label;
  const onCategories = useMemo(
    () => categories.filter((c) => enabledCategories.has(c.key)).length,
    [categories, enabledCategories],
  );
  const onComponents = useMemo(
    () => components.filter((c) => enabledComponents.has(c.key)).length,
    [components, enabledComponents],
  );

  return (
    <div className="tokens-toolbar">
      <div className="tokens-toolbar__group">
        {navOpen !== null && (
          <button
            type="button"
            className="tokens-toolbar__button tokens-toolbar__button--icon"
            aria-label="Sidebar"
            aria-expanded={navOpen}
            aria-controls={navId}
            title="Show the token navigation"
            onClick={onToggleNav}
          >
            <Icon name="menu" />
          </button>
        )}

        <ToolbarMenu
          kind="menu"
          label={`Theme: ${themeLabel}`}
          popupLabel="Preview theme"
          initialFocus='[aria-checked="true"]'
          trigger={
            <>
              <span className={`tokens-theme-swatch tokens-theme-swatch--${theme}`} aria-hidden="true" />
              <span className="tokens-toolbar__text tokens-toolbar__text--muted">Theme:</span>
              <span className="tokens-toolbar__value">{themeLabel}</span>
              <Icon name="chevronDown" className="tokens-toolbar__caret" />
            </>
          }
        >
          {THEMES.map((t) => (
            <button
              key={t.mode}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t.mode}
              className="tokens-menu__item tokens-menu__item--radio"
              data-menu-row
              data-menu-primary
              data-menu-close
              data-menu-text={t.label}
              tabIndex={-1}
              onClick={() => onThemeChange(t.mode)}
            >
              <span className={`tokens-theme-swatch tokens-theme-swatch--${t.mode}`} aria-hidden="true" />
              <span className="tokens-menu__item-text">
                <span className="tokens-menu__item-label">{t.label}</span>
                <span className="tokens-menu__item-hint">{t.hint}</span>
              </span>
              <span className="tokens-menu__tick" aria-hidden="true">
                {theme === t.mode && <Icon name="check" />}
              </span>
            </button>
          ))}
        </ToolbarMenu>

        <span className="tokens-toolbar__divider" aria-hidden="true" />

        <ToolbarMenu
          kind="dialog"
          label={`Categories ${onCategories}/${categories.length}`}
          popupLabel="Filter categories"
          active={onCategories < categories.length}
          trigger={
            <>
              <Icon name="categories" />
              <span className="tokens-toolbar__text">Categories</span>
              <CountBadge on={onCategories} total={categories.length} />
              <Icon name="chevronDown" className="tokens-toolbar__caret" />
            </>
          }
        >
          <FilterMenuContent
            title="Categories"
            noun="categories"
            items={categories}
            enabled={enabledCategories}
            onChange={onCategoriesChange}
            searchable={false}
          />
        </ToolbarMenu>

        <ToolbarMenu
          kind="dialog"
          label={`Components ${onComponents}/${components.length}`}
          popupLabel="Filter components"
          initialFocus='input[type="search"]'
          active={onComponents < components.length}
          trigger={
            <>
              <Icon name="components" />
              <span className="tokens-toolbar__text">Components</span>
              <CountBadge on={onComponents} total={components.length} />
              <Icon name="chevronDown" className="tokens-toolbar__caret" />
            </>
          }
        >
          <FilterMenuContent
            title="Components"
            noun="components"
            items={components}
            enabled={enabledComponents}
            onChange={onComponentsChange}
            searchable
          />
        </ToolbarMenu>

        {mapMode !== null && (
          <>
            <span className="tokens-toolbar__divider" aria-hidden="true" />
            <div className="tokens-segmented" role="group" aria-label="Map rendering">
              {(['2d', '3d'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="tokens-segmented__option"
                  aria-pressed={mapMode === mode}
                  data-map-mode={mode}
                  disabled={mode === '3d' && webglUnavailable}
                  title={mode === '3d' && webglUnavailable ? 'WebGL is not available in this browser' : undefined}
                  onClick={() => onMapModeChange(mode)}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="tokens-toolbar__group tokens-toolbar__group--end">
        {filtersChanged && (
          <button
            type="button"
            className="tokens-toolbar__button"
            onClick={(e) => {
              // This button goes away with the change; focus stays in the toolbar.
              e.currentTarget
                .closest('.tokens-toolbar')
                ?.querySelector<HTMLElement>('[aria-haspopup="dialog"]')
                ?.focus();
              onResetFilters();
            }}
            title="Show every category and component again"
          >
            <Icon name="reset" />
            <span className="tokens-toolbar__text">Reset filters</span>
          </button>
        )}
        {panelOpen !== null && (
          <button
            type="button"
            className="tokens-toolbar__button tokens-toolbar__button--icon"
            aria-label="Addons panel"
            aria-pressed={panelOpen}
            title={panelOpen ? 'Hide the addons panel' : 'Show the addons panel'}
            onClick={onTogglePanel}
          >
            <Icon name="panel" />
          </button>
        )}
      </div>
    </div>
  );
}
