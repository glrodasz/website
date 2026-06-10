/**
 * Global tab: raw values. Color palettes render as swatch ramps; other
 * categories (sizing, radius, typography) as compact value rows.
 */

import { useMemo } from 'react';
import type { GraphNode } from '../../../tokens/graph-builder';
import { HEX_RE, matchesSearch } from './utils';

interface GlobalViewProps {
  nodes: GraphNode[];
  consumerCount: Map<string, number>;
  search: string;
  enabledCategories: Set<string>;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}

function paletteOf(node: GraphNode): string {
  // "global tokens.Colors.Custom.Principal palette.600" → "Custom / Principal palette"
  return node.path.split('.').slice(2, -1).join(' / ');
}

function shadeOf(node: GraphNode): string {
  return node.path.split('.').slice(-1)[0];
}

function compareShades(a: GraphNode, b: GraphNode): number {
  const na = Number(shadeOf(a));
  const nb = Number(shadeOf(b));
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.path.localeCompare(b.path);
}

export function GlobalView({
  nodes,
  consumerCount,
  search,
  enabledCategories,
  selectedId,
  onSelect,
}: GlobalViewProps) {
  const { palettes, valueGroups } = useMemo(() => {
    const paletteMap = new Map<string, GraphNode[]>();
    const valueMap = new Map<string, GraphNode[]>();
    for (const node of nodes) {
      if (!enabledCategories.has(node.category)) continue;
      if (!matchesSearch(node, search)) continue;
      if (node.type === 'color' && HEX_RE.test(node.resolvedValue)) {
        const key = paletteOf(node);
        if (!paletteMap.has(key)) paletteMap.set(key, []);
        paletteMap.get(key)!.push(node);
      } else {
        if (!valueMap.has(node.category)) valueMap.set(node.category, []);
        valueMap.get(node.category)!.push(node);
      }
    }
    for (const members of paletteMap.values()) members.sort(compareShades);
    for (const members of valueMap.values()) {
      members.sort((a, b) => a.path.localeCompare(b.path));
    }
    return {
      palettes: [...paletteMap.entries()].sort(([a], [b]) => a.localeCompare(b)),
      valueGroups: [...valueMap.entries()].sort(([a], [b]) => a.localeCompare(b)),
    };
  }, [nodes, enabledCategories, search]);

  if (palettes.length === 0 && valueGroups.length === 0) {
    return <div className="token-explorer__empty">No global tokens match the current filters.</div>;
  }

  return (
    <div className="token-explorer__sections">
      {palettes.length > 0 && (
        <section className="token-section">
          <h3 className="token-section__title">Color palettes</h3>
          {palettes.map(([palette, members]) => (
            <div key={palette} className="palette-ramp">
              <h4 className="palette-ramp__name">{palette}</h4>
              <div className="palette-ramp__swatches">
                {members.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`palette-ramp__swatch${
                      selectedId === node.id ? ' palette-ramp__swatch--selected' : ''
                    }`}
                    style={{ background: node.resolvedValue.slice(0, 7) }}
                    onClick={() => onSelect(node.id)}
                    title={`${node.path} · ${node.resolvedValue} · used by ${
                      consumerCount.get(node.id) ?? 0
                    }`}
                  >
                    <span className="palette-ramp__shade">{shadeOf(node)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {valueGroups.map(([category, members]) => (
        <section key={category} className="token-section">
          <h3 className="token-section__title">{category}</h3>
          <div className="token-section__value-grid">
            {members.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`token-row token-row--compact${
                  selectedId === node.id ? ' token-row--selected' : ''
                }`}
                onClick={() => onSelect(node.id)}
                title={`Inspect ${node.path}`}
              >
                <span className="token-row__label">
                  {node.path.split('.').slice(2).join('.')}
                </span>
                <code className="token-row__value">{node.resolvedValue}</code>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
