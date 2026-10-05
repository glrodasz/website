/**
 * 3D rendering of the token map: the same visible subgraph as the 2D map,
 * laid out as one layer per column. Loaded lazily by MapView so three.js
 * stays in its own chunk.
 *
 * Placeholder until the scene lands: it only announces that the 3D view is
 * loading, behind the final props.
 */

import type { MapView } from './lineage';

export interface MapView3DProps {
  view: MapView;
  /** True while a search is active, so rows without matches are muted. */
  searching: boolean;
  /** The token open in the inspector. */
  selectedId: string | null;
  onFocus: (id: string) => void;
  onSelectToken: (id: string) => void;
  /** Called when WebGL cannot start; the map falls back to 2D. */
  onUnavailable: () => void;
}

const MapView3D: React.FC<MapView3DProps> = () => (
  <div className="token-map__notice" role="status">
    3D view loading…
  </div>
);

export default MapView3D;
