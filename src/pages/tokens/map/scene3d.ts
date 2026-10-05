/**
 * Imperative three.js scene behind the token map's 3D view.
 *
 * Draws the same visible subgraph as the 2D map: one faint layer per column,
 * nodes as instanced shapes (a shape per column), links as sampled curves in
 * a single LineSegments, and labels as an HTML overlay culled for overlaps.
 * Frames are rendered on demand only: while the camera damps or tweens, and
 * after the graph, highlight or size changes.
 *
 * Only MapView3D imports this module, dynamically, so three.js stays in its
 * own chunk.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LAYER_COLORS, LAYER_GAP, LAYER_X, ROW_GAP, type SceneNode } from './layout3d';
import { MAP_COLUMNS, type MapColumn, type MapLink } from './lineage';

export interface SceneHighlight {
  focusIds: ReadonlySet<string>;
  /** The traced lineage; everything else dims. Null when nothing is traced. */
  lit: ReadonlySet<string> | null;
  /** The token open in the inspector. */
  selectedId: string | null;
  /** Rows without search matches. */
  muted: ReadonlySet<string>;
}

export interface TokenMapScene {
  /** `totals` feeds the layer captions, like the 2D column heads. */
  setGraph(
    nodes: readonly SceneNode[],
    links: readonly MapLink[],
    totals: Readonly<Record<MapColumn, number>>,
  ): void;
  setHighlight(h: SceneHighlight): void;
  /** Frames the graph from the default angle, tweening unless `animate` is false or motion is reduced. */
  fit(animate: boolean): void;
  /** Reduced motion turns off camera inertia and fit tweens. */
  setReducedMotion(reduced: boolean): void;
  resize(width: number, height: number, pixelRatio: number): void;
  dispose(): void;
}

export interface SceneCallbacks {
  hover(id: string | null): void;
  pick(id: string): void;
}

const FOV = 35;
const YAW = THREE.MathUtils.degToRad(-25);
/** Clearly portrait canvases (phones) look further down the layers, so all four fit the width. */
const PORTRAIT_YAW = THREE.MathUtils.degToRad(-55);
const PORTRAIT_ASPECT = 0.8;
const ELEVATION = THREE.MathUtils.degToRad(15);
const FIT_MS = 450;
/** Neighbours in a column never touch, however large their groups. */
const MAX_RADIUS = 0.42 * ROW_GAP;
const HALO_SCALE = 1.25;
const CURVE_SAMPLES = 16;
const PICK_PX = 14;
const DRAG_PX = 4;
/**
 * Every node is a label candidate up to this many; beyond it only groups and
 * highlighted nodes are. Overlap culling decides which candidates show.
 */
const LABEL_ALL_MAX = 120;
const LABEL_CAP = 90;
const LABEL_GAP_PX = 5;
/** Labels are capped at this width by CSS; framing keeps room for the outer layers' labels. */
const LABEL_MAX_PX = 190;
/** Screen room kept above the layers for their captions, and below for the dock. */
const CAPTION_ROOM_PX = 36;
const DOCK_ROOM_PX = 44;
/** Padding of a layer plane around its nodes, in world units. */
const LAYER_PAD = 1.1;
const EMPTY_LAYER = { y: 2, z: 1 };

const BACKGROUND = '#0b1018';
const EDGE_REST = '#94a3b8';
const EDGE_LIT = '#7dd3fc';
const HALO = {
  rest: '#334155',
  lit: '#64748b',
  dim: '#131b29',
  focus: '#7dd3fc',
  hover: '#f1f5f9',
  selected: '#ffd400',
};

const CAPTIONS: Record<MapColumn, string> = {
  global: 'Global',
  system: 'System',
  component: 'Component',
  ui: 'UI',
};

/**
 * Labels prefer the outer side of each layer, keeping the dense middle bundle
 * clear, and take the other side when a neighbour's node or label is in the way.
 */
const LABEL_SIDE: Record<MapColumn, -1 | 1> = { global: -1, system: -1, component: 1, ui: 1 };

/** Upper left and towards the default camera, so the top and front faces read brightest. */
const LIGHT = new THREE.Vector3(-0.3, 1, 0.55).normalize();

/** Bakes flat per-face shading into vertex colors, so an unlit material still reads as a solid. */
function faceted(source: THREE.BufferGeometry): THREE.BufferGeometry {
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) source.dispose();
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal');
  const shade = new Float32Array(normals.count * 3);
  const normal = new THREE.Vector3();
  for (let i = 0; i < normals.count; i++) {
    const b = 0.45 + 0.55 * Math.max(0, normal.fromBufferAttribute(normals, i).dot(LIGHT));
    shade.fill(b, i * 3, i * 3 + 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(shade, 3));
  return geometry;
}

/** Edge opacity at rest: busier links read stronger, as they draw wider in 2D. */
function restAlpha(weight: number, focused: boolean): number {
  const strength = Math.min(1, Math.log2(Math.max(1, weight)) / 4);
  return focused ? 0.45 + 0.3 * strength : 0.14 + 0.24 * strength;
}

interface Slot {
  body: THREE.InstancedMesh;
  halo: THREE.InstancedMesh;
  index: number;
}

interface Label {
  el: HTMLSpanElement;
  text: string;
  width: number;
  height: number;
  /** Last written state, so frames only touch labels that change. */
  shown: boolean;
  x: number;
  y: number;
}

interface Layer {
  group: THREE.Group;
  caption: HTMLSpanElement;
  count: HTMLSpanElement;
  /** Caption anchor in world space, above the layer. */
  anchor: THREE.Vector3;
  size: { width: number; height: number };
}

interface Framing {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

interface Tween {
  from: Framing;
  to: Framing;
  start: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.w + 2 && b.x < a.x + a.w + 2 && a.y < b.y + b.h + 1 && b.y < a.y + a.h + 1;

const radiusOf = (node: SceneNode) => Math.min(node.size, MAX_RADIUS);

function makeLabel(node: SceneNode): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = `token-map__label3d token-map__label3d--${node.column}`;
  // As in 2D, a token's shared prefix gives way before the segment that tells siblings apart.
  const cut = node.kind === 'token' ? node.label.lastIndexOf('.') + 1 : 0;
  if (cut > 0) {
    const head = document.createElement('span');
    head.className = 'token-map__label3d-head';
    head.textContent = node.label.slice(0, cut);
    el.append(head);
  }
  const tail = document.createElement('span');
  tail.className = 'token-map__label3d-tail';
  tail.textContent = node.label.slice(cut);
  el.append(tail);
  el.style.visibility = 'hidden';
  return el;
}

/**
 * three.js needs WebGL 2. Probing a throwaway canvas first fails quietly,
 * where the renderer would log errors of its own before throwing.
 */
function assertWebGL2() {
  const probe = document.createElement('canvas').getContext('webgl2');
  if (!probe) throw new Error('WebGL 2 is not available');
  probe.getExtension('WEBGL_lose_context')?.loseContext();
}

/** Throws when WebGL is unavailable; MapView3D then falls back to 2D. */
export function createTokenMapScene(
  canvas: HTMLCanvasElement,
  labelLayer: HTMLElement,
  on: SceneCallbacks,
): TokenMapScene {
  assertWebGL2();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });

  const background = new THREE.Color(BACKGROUND);
  const scene = new THREE.Scene();
  // Unlike the renderer's clear colour, a scene background survives a context restore.
  scene.background = background;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 1000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.6;
  controls.zoomToCursor = true;
  controls.minDistance = 4;
  controls.maxDistance = 400;

  const shapes: Record<MapColumn, THREE.BufferGeometry> = {
    global: faceted(new THREE.IcosahedronGeometry(1, 0)),
    system: faceted(new THREE.OctahedronGeometry(1.2, 0)),
    component: faceted(new THREE.BoxGeometry(1.3, 1.3, 1.3)),
    ui: faceted(new THREE.BoxGeometry(1.8, 1.25, 0.5)),
  };
  const bodyMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  // Back faces of a slightly larger copy: a rim that keeps near-black swatches visible.
  const haloMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
  const edgeMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const outlineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.5, -0.5, 0),
    new THREE.Vector3(0.5, -0.5, 0),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(-0.5, 0.5, 0),
  ]);
  const layerMaterials: THREE.Material[] = [];

  const layers = {} as Record<MapColumn, Layer>;
  for (const column of MAP_COLUMNS) {
    const hue = LAYER_COLORS[column];
    const fill = new THREE.MeshBasicMaterial({
      color: hue,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const line = new THREE.LineBasicMaterial({ color: hue, transparent: true, opacity: 0.2, depthWrite: false });
    layerMaterials.push(fill, line);
    const group = new THREE.Group();
    // Planes face along x: local x runs along world z.
    group.rotation.y = Math.PI / 2;
    group.position.x = LAYER_X[column];
    group.add(new THREE.Mesh(planeGeometry, fill), new THREE.LineLoop(outlineGeometry, line));
    group.renderOrder = -1;
    for (const child of group.children) child.renderOrder = -1;
    scene.add(group);

    const caption = document.createElement('span');
    caption.className = `token-map__caption3d token-map__caption3d--${column}`;
    caption.append(CAPTIONS[column]);
    const count = document.createElement('span');
    count.className = 'token-map__caption3d-count';
    caption.append(count);
    labelLayer.append(caption);
    layers[column] = { group, caption, count, anchor: new THREE.Vector3(), size: { width: 0, height: 0 } };
  }

  // Per-graph state.
  let nodes: SceneNode[] = [];
  let slots: Slot[] = [];
  let meshes: THREE.InstancedMesh[] = [];
  let edges: THREE.LineSegments | null = null;
  let linkEnds: { a: number; b: number; weight: number }[] = [];
  const labels = new Map<string, Label>();
  /** The corners of every layer plane: what the camera frames. */
  let corners: THREE.Vector3[] = [];
  /** Per node: screen x, y (CSS px), view depth and projected radius (px), from the last frame. */
  let screen = new Float32Array(0);
  /** Node indices in label priority order. */
  let labelOrder: number[] = [];

  let highlight: SceneHighlight = { focusIds: new Set(), lit: null, selectedId: null, muted: new Set() };
  let hoverId: string | null = null;
  const viewport = { width: 0, height: 0 };
  let reducedMotion = false;
  let tween: Tween | null = null;
  /** Fitted and not orbited or zoomed since: resizes refit instead of cropping. */
  let pinned = true;
  let rafId = 0;
  let disposed = false;
  /** Between OrbitControls' start and end, which a plain click fires too. */
  let gesture = false;
  /** The press under way: a click until it travels DRAG_PX, a drag from then on. */
  let press: { x: number; y: number; dragged: boolean } | null = null;

  const color = new THREE.Color();
  const matrix = new THREE.Matrix4();
  const identity = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const point = new THREE.Vector3();

  function clearGraph() {
    for (const mesh of meshes) {
      scene.remove(mesh);
      mesh.dispose();
    }
    meshes = [];
    slots = [];
    if (edges) {
      scene.remove(edges);
      edges.geometry.dispose();
      edges = null;
    }
  }

  function syncLabels() {
    const keep = new Set(nodes.map((n) => n.id));
    for (const [id, label] of labels) {
      if (keep.has(id)) continue;
      label.el.remove();
      labels.delete(id);
    }
    const fresh: Label[] = [];
    for (const node of nodes) {
      const existing = labels.get(node.id);
      if (existing?.text === node.label) continue;
      existing?.el.remove();
      const label: Label = { el: makeLabel(node), text: node.label, width: 0, height: 0, shown: false, x: 0, y: 0 };
      labelLayer.append(label.el);
      labels.set(node.id, label);
      fresh.push(label);
    }
    // Measured in one pass after appending, so layout runs once.
    for (const label of fresh) {
      label.width = label.el.offsetWidth;
      label.height = label.el.offsetHeight;
    }
  }

  function buildEdges(links: readonly MapLink[]) {
    const indexById = new Map(nodes.map((n, i) => [n.id, i]));
    linkEnds = links.flatMap((l) => {
      const a = indexById.get(l.left);
      const b = indexById.get(l.right);
      return a === undefined || b === undefined ? [] : [{ a, b, weight: l.weight }];
    });
    if (linkEnds.length === 0) return;
    const vertices = new Float32Array(linkEnds.length * CURVE_SAMPLES * 2 * 3);
    const handle = new THREE.Vector3(0.45 * LAYER_GAP, 0, 0);
    const curve = new THREE.CubicBezierCurve3();
    const previous = new THREE.Vector3();
    let v = 0;
    for (const { a, b } of linkEnds) {
      curve.v0.fromArray(nodes[a].position);
      curve.v3.fromArray(nodes[b].position);
      curve.v1.copy(curve.v0).add(handle);
      curve.v2.copy(curve.v3).sub(handle);
      previous.copy(curve.v0);
      for (let s = 1; s <= CURVE_SAMPLES; s++) {
        curve.getPoint(s / CURVE_SAMPLES, point);
        previous.toArray(vertices, v);
        point.toArray(vertices, v + 3);
        previous.copy(point);
        v += 6;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(linkEnds.length * CURVE_SAMPLES * 2 * 4), 4),
    );
    edges = new THREE.LineSegments(geometry, edgeMaterial);
    edges.frustumCulled = false;
    scene.add(edges);
  }

  function layoutLayers(totals: Readonly<Record<MapColumn, number>>) {
    corners = [];
    for (const column of MAP_COLUMNS) {
      const members = nodes.filter((n) => n.column === column);
      const range = { y0: -EMPTY_LAYER.y, y1: EMPTY_LAYER.y, z0: -EMPTY_LAYER.z, z1: EMPTY_LAYER.z };
      if (members.length > 0) {
        const radius = Math.max(...members.map(radiusOf));
        const ys = members.map((n) => n.position[1]);
        const zs = members.map((n) => n.position[2]);
        range.y0 = Math.min(...ys) - radius;
        range.y1 = Math.max(...ys) + radius;
        range.z0 = Math.min(...zs) - radius;
        range.z1 = Math.max(...zs) + radius;
      }
      const layer = layers[column];
      const width = range.z1 - range.z0 + 2 * LAYER_PAD;
      const height = range.y1 - range.y0 + 2 * LAYER_PAD;
      const y = (range.y0 + range.y1) / 2;
      const z = (range.z0 + range.z1) / 2;
      layer.group.position.set(LAYER_X[column], y, z);
      layer.group.scale.set(width, height, 1);
      layer.anchor.set(LAYER_X[column], y + height / 2, z);
      layer.count.textContent = String(totals[column]);
      for (const dy of [-height / 2, height / 2]) {
        for (const dz of [-width / 2, width / 2]) {
          corners.push(new THREE.Vector3(LAYER_X[column], y + dy, z + dz));
        }
      }
    }
    for (const column of MAP_COLUMNS) {
      const { caption, size } = layers[column];
      size.width = caption.offsetWidth;
      size.height = caption.offsetHeight;
    }
  }

  function stateOf(node: SceneNode) {
    const focus = highlight.focusIds.has(node.id);
    const lit = highlight.lit?.has(node.id) ?? false;
    return {
      focus,
      lit,
      hovered: node.id === hoverId,
      selected: node.id === highlight.selectedId,
      dim: highlight.lit !== null && !lit,
      muted: highlight.muted.has(node.id),
    };
  }

  function applyHighlight() {
    nodes.forEach((node, i) => {
      const s = stateOf(node);
      const { body, halo, index } = slots[i];
      color.set(node.color);
      if (s.dim) color.lerp(background, 0.8);
      else if (s.muted) color.lerp(background, 0.6);
      body.setColorAt(index, color);
      const haloColor = s.selected
        ? HALO.selected
        : s.hovered
          ? HALO.hover
          : s.focus
            ? HALO.focus
            : s.dim
              ? HALO.dim
              : s.lit
                ? HALO.lit
                : HALO.rest;
      halo.setColorAt(index, color.set(haloColor));

      const radius = radiusOf(node) * (s.hovered ? 1.2 : s.focus ? 1.08 : 1);
      const ring = s.selected || s.hovered || s.focus ? 1.4 : HALO_SCALE;
      position.fromArray(node.position);
      body.setMatrixAt(index, matrix.compose(position, identity, scale.setScalar(radius)));
      halo.setMatrixAt(index, matrix.compose(position, identity, scale.setScalar(radius * ring)));

      const label = labels.get(node.id);
      if (label) {
        const list = label.el.classList;
        list.toggle('token-map__label3d--focus', s.focus);
        list.toggle('token-map__label3d--selected', s.selected);
        list.toggle('token-map__label3d--hover', s.hovered);
        list.toggle('token-map__label3d--lit', s.lit);
        list.toggle('token-map__label3d--dim', s.dim);
        list.toggle('token-map__label3d--muted', s.muted && !s.lit);
      }
    });
    for (const mesh of meshes) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    if (edges) {
      const colors = edges.geometry.getAttribute('color') as THREE.BufferAttribute;
      const values = colors.array as Float32Array;
      // Under a focus every link is part of its lineage, so links read lit even at rest.
      const focused = highlight.focusIds.size > 0;
      const perLink = CURVE_SAMPLES * 2;
      linkEnds.forEach(({ a, b, weight }, j) => {
        const { lit } = highlight;
        const traced = lit !== null && lit.has(nodes[a].id) && lit.has(nodes[b].id);
        const alpha = traced ? 0.9 : lit ? 0.05 : restAlpha(weight, focused);
        color.set(traced || (focused && !lit) ? EDGE_LIT : EDGE_REST);
        for (let k = 0; k < perLink; k++) {
          const o = (j * perLink + k) * 4;
          values[o] = color.r;
          values[o + 1] = color.g;
          values[o + 2] = color.b;
          values[o + 3] = alpha;
        }
      });
      colors.needsUpdate = true;
    }

    labelOrder = rankLabels();
  }

  /** Label candidates, most important first; nodes left out are never labelled. */
  function rankLabels(): number[] {
    const labelAll = nodes.length <= LABEL_ALL_MAX;
    const rank = (node: SceneNode): number => {
      const s = stateOf(node);
      if (s.hovered) return 6;
      if (s.selected) return 5;
      if (s.focus) return 4;
      if (s.lit) return 3;
      if (s.dim || s.muted) return labelAll ? 0.5 : 0;
      // A CSS file is a top-level row, like the groups beside it on the overview.
      if (node.kind !== 'token') return 2;
      return labelAll ? 1 : 0;
    };
    const ranks = nodes.map(rank);
    return nodes
      .map((_, i) => i)
      .filter((i) => ranks[i] > 0)
      .sort((i, j) => ranks[j] - ranks[i] || nodes[j].size - nodes[i].size || i - j);
  }

  function project() {
    const { width, height } = viewport;
    if (screen.length !== nodes.length * 4) screen = new Float32Array(nodes.length * 4);
    const pxPerUnit = height / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));
    nodes.forEach((node, i) => {
      point.fromArray(node.position).applyMatrix4(camera.matrixWorldInverse);
      const depth = -point.z;
      point.applyMatrix4(camera.projectionMatrix);
      screen[i * 4] = ((point.x + 1) / 2) * width;
      screen[i * 4 + 1] = ((1 - point.y) / 2) * height;
      screen[i * 4 + 2] = depth;
      screen[i * 4 + 3] = depth > 0 ? (radiusOf(node) * pxPerUnit) / depth : 0;
    });
  }

  function writeLabel(label: Label, shown: boolean, x = 0, y = 0) {
    if (!shown) {
      if (label.shown) label.el.style.visibility = 'hidden';
      label.shown = false;
      return;
    }
    if (!label.shown) label.el.style.visibility = 'visible';
    if (!label.shown || x !== label.x || y !== label.y) {
      label.el.style.transform = `translate(${x}px, ${y}px)`;
    }
    label.shown = true;
    label.x = x;
    label.y = y;
  }

  function placeLabels() {
    const { width, height } = viewport;
    const placed: Box[] = [];
    for (const column of MAP_COLUMNS) {
      const { caption, anchor, size } = layers[column];
      point.copy(anchor).project(camera);
      const visible = point.z < 1;
      caption.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) continue;
      const box = {
        x: Math.round(((point.x + 1) / 2) * width - size.width / 2),
        y: Math.round(((1 - point.y) / 2) * height - size.height - 6),
        w: size.width,
        h: size.height,
      };
      caption.style.transform = `translate(${box.x}px, ${box.y}px)`;
      placed.push(box);
    }

    // Every visible node is an obstacle, so a label never hides another node.
    const discs: Box[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const r = screen[i * 4 + 3];
      discs[i] = screen[i * 4 + 2] > 0
        ? { x: screen[i * 4] - r, y: screen[i * 4 + 1] - r, w: 2 * r, h: 2 * r }
        : { x: -1e6, y: -1e6, w: 0, h: 0 };
    }

    const labelAll = nodes.length <= LABEL_ALL_MAX;
    const shown = new Set<string>();
    let count = 0;
    for (const i of labelOrder) {
      const node = nodes[i];
      const label = labels.get(node.id);
      const forced = node.id === hoverId;
      if (!label || (!labelAll && count >= LABEL_CAP && !forced)) continue;
      if (screen[i * 4 + 2] <= 0) continue;
      const r = screen[i * 4 + 3];
      const sx = screen[i * 4];
      const y = Math.round(screen[i * 4 + 1] - label.height / 2);
      const boxOn = (side: number): Box => ({
        x: Math.round(side > 0 ? sx + r + LABEL_GAP_PX : sx - r - LABEL_GAP_PX - label.width),
        y,
        w: label.width,
        h: label.height,
      });
      const fits = (box: Box) =>
        box.x >= 0 &&
        box.x + box.w <= width &&
        box.y + box.h > 0 &&
        box.y < height &&
        !placed.some((p) => overlaps(p, box)) &&
        !discs.some((d, j) => j !== i && overlaps(d, box));
      const preferred = boxOn(LABEL_SIDE[node.column]);
      const other = boxOn(-LABEL_SIDE[node.column]);
      const box = fits(preferred) ? preferred : fits(other) ? other : forced ? preferred : null;
      if (!box) continue;
      placed.push(box);
      shown.add(node.id);
      count++;
      writeLabel(label, true, box.x, box.y);
    }
    for (const [id, label] of labels) if (!shown.has(id)) writeLabel(label, false);
  }

  function frame(now: number) {
    rafId = 0;
    let moving = false;
    if (tween) {
      if (tween.start < 0) tween.start = now;
      const t = Math.min(1, (now - tween.start) / FIT_MS);
      const eased = 1 - (1 - t) ** 3;
      camera.position.lerpVectors(tween.from.position, tween.to.position, eased);
      controls.target.lerpVectors(tween.from.target, tween.to.target, eased);
      camera.lookAt(controls.target);
      moving = t < 1;
      if (!moving) {
        tween = null;
        controls.update();
      }
    } else {
      moving = controls.update();
    }
    renderer.render(scene, camera);
    project();
    placeLabels();
    if (moving) requestRender();
  }

  function requestRender() {
    if (!rafId && !disposed) rafId = requestAnimationFrame(frame);
  }

  /** Camera placement that frames the layers from the default angle, leaving room for labels. */
  function framing(): Framing | null {
    const { width, height } = viewport;
    if (width === 0 || height === 0 || corners.length === 0) return null;
    const target = new THREE.Box3().setFromPoints(corners).getCenter(new THREE.Vector3());
    const yaw = width < PORTRAIT_ASPECT * height ? PORTRAIT_YAW : YAW;
    const back = new THREE.Vector3(
      Math.sin(yaw) * Math.cos(ELEVATION),
      Math.sin(ELEVATION),
      Math.cos(yaw) * Math.cos(ELEVATION),
    );
    const right = new THREE.Vector3().crossVectors(camera.up, back).normalize();
    const up = new THREE.Vector3().crossVectors(back, right);
    // The outer layers' labels need room beside them; the captions above and the dock below.
    const widest = (column: MapColumn) =>
      Math.max(0, ...nodes.filter((n) => n.column === column).map((n) => labels.get(n.id)?.width ?? 0));
    const labelRoom = Math.min(LABEL_MAX_PX, 0.2 * width);
    const room = {
      left: Math.min(labelRoom, widest('global')) + 2 * LABEL_GAP_PX,
      right: Math.min(labelRoom, widest('ui')) + 2 * LABEL_GAP_PX,
      top: CAPTION_ROOM_PX,
      bottom: DOCK_ROOM_PX,
    };
    const usableWidth = Math.max(0.45 * width, width - room.left - room.right);
    const usableHeight = Math.max(0.5 * height, height - room.top - room.bottom);
    const halfV = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    const fitV = (halfV * usableHeight) / height;
    const fitH = (halfV * camera.aspect * usableWidth) / width;
    /** The nearest distance from which every layer fits around `target`. */
    const fitDistance = () =>
      Math.max(
        ...corners.map((corner) => {
          const toward = point.copy(corner).sub(target).dot(back);
          return toward + Math.max(Math.abs(point.dot(right)) / fitH, Math.abs(point.dot(up)) / fitV);
        }),
      );
    let distance = fitDistance();
    // Perspective draws the near layers larger, so the graph sits off the centre of
    // its corners: centre what the camera sees, then fit again from closer.
    const seen = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    for (const corner of corners) {
      const depth = distance - point.copy(corner).sub(target).dot(back);
      const x = point.dot(right) / depth;
      const y = point.dot(up) / depth;
      seen.x0 = Math.min(seen.x0, x);
      seen.x1 = Math.max(seen.x1, x);
      seen.y0 = Math.min(seen.y0, y);
      seen.y1 = Math.max(seen.y1, y);
    }
    target
      .addScaledVector(right, ((seen.x0 + seen.x1) / 2) * distance)
      .addScaledVector(up, ((seen.y0 + seen.y1) / 2) * distance);
    distance = fitDistance();
    // Centre the graph in the room left over rather than in the whole canvas.
    const unitsPerPx = (2 * distance * halfV) / height;
    target
      .addScaledVector(right, ((room.right - room.left) / 2) * unitsPerPx)
      .addScaledVector(up, ((room.top - room.bottom) / 2) * unitsPerPx);
    return { target, position: target.clone().addScaledVector(back, distance) };
  }

  /**
   * Places the camera, dropping the momentum OrbitControls still holds from a
   * flick, which would otherwise carry the camera on past a fit.
   */
  function place(position: THREE.Vector3, target: THREE.Vector3) {
    const damping = controls.enableDamping;
    controls.enableDamping = false;
    // Undamped, an update spends the leftover momentum at once.
    controls.update();
    controls.enableDamping = damping;
    camera.position.copy(position);
    controls.target.copy(target);
    camera.lookAt(target);
  }

  function jumpTo(to: Framing) {
    tween = null;
    place(to.position, to.target);
    controls.update();
  }

  function setHover(id: string | null) {
    if (id === hoverId) return;
    hoverId = id;
    canvas.style.cursor = id ? 'pointer' : '';
    applyHighlight();
    requestRender();
    on.hover(id);
  }

  /** The node under a pointer: the nearest projected centre within reach, the nearer one on ties. */
  function pickAt(clientX: number, clientY: number): string | null {
    // Projections come from the last frame; until the new graph has drawn there is nothing to hit.
    if (screen.length !== nodes.length * 4) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let best = -1;
    let bestDistance = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      const depth = screen[i * 4 + 2];
      if (depth <= 0) continue;
      const d = Math.hypot(screen[i * 4] - x, screen[i * 4 + 1] - y);
      if (d > Math.max(PICK_PX, screen[i * 4 + 3])) continue;
      const tie = Math.abs(d - bestDistance) < 1;
      if ((tie && depth < screen[best * 4 + 2]) || (!tie && d < bestDistance)) {
        best = i;
        bestDistance = d;
      }
    }
    return best < 0 ? null : nodes[best].id;
  }

  const travelled = (from: { x: number; y: number }, e: PointerEvent) =>
    Math.hypot(e.clientX - from.x, e.clientY - from.y) >= DRAG_PX;

  // The canvas sees a pointer event before OrbitControls, which listens on the
  // document, so a press is marked as a drag before the camera change it causes.
  const onPointerMove = (e: PointerEvent) => {
    if (press && e.isPrimary && travelled(press, e)) press.dragged = true;
    // Orbiting: leave the trace as it was until the drag ends.
    if (e.buttons !== 0) return;
    setHover(pickAt(e.clientX, e.clientY));
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.isPrimary) press = { x: e.clientX, y: e.clientY, dragged: false };
    // A second finger pinches or pans.
    else if (press) press.dragged = true;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!press || press.dragged || !e.isPrimary || e.button !== 0 || travelled(press, e)) return;
    const id = pickAt(e.clientX, e.clientY);
    if (id) on.pick(id);
  };
  const onPointerLeave = () => setHover(null);
  const onControlsStart = () => {
    gesture = true;
  };
  // Only a drag or a zoom leaves the fit. A click that picks a node keeps it,
  // so the scene still refits when the inspector narrows the stage.
  const onControlsChange = () => {
    if (gesture && (!press || press.dragged)) {
      tween = null;
      pinned = false;
    }
    requestRender();
  };
  // OrbitControls ends a press after the canvas's pointerup, so a refit that
  // the pick itself causes still counts as part of the click.
  const onControlsEnd = () => {
    gesture = false;
    press = null;
  };
  // three rebuilds its GL state on a restore, but nothing would ask for a frame.
  const onContextRestored = () => requestRender();

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  controls.addEventListener('start', onControlsStart);
  controls.addEventListener('change', onControlsChange);
  controls.addEventListener('end', onControlsEnd);

  return {
    setGraph(next, links, totals) {
      if (disposed) return;
      const moved = new Map(nodes.map((n) => [n.id, n.position.join()]));
      clearGraph();
      nodes = [...next];

      for (const column of MAP_COLUMNS) {
        const members = nodes.flatMap((n, i) => (n.column === column ? [i] : []));
        if (members.length === 0) continue;
        const halo = new THREE.InstancedMesh(shapes[column], haloMaterial, members.length);
        const body = new THREE.InstancedMesh(shapes[column], bodyMaterial, members.length);
        for (const mesh of [halo, body]) {
          // Instances change scale on hover; the bounds three would cache go stale.
          mesh.frustumCulled = false;
          meshes.push(mesh);
          scene.add(mesh);
        }
        members.forEach((nodeIndex, index) => {
          slots[nodeIndex] = { body, halo, index };
        });
      }
      buildEdges(links);
      syncLabels();
      layoutLayers(totals);

      // A hovered node that is gone or has moved is no longer under the pointer.
      const hovered = hoverId === null ? undefined : nodes.find((n) => n.id === hoverId);
      if (hoverId !== null && moved.get(hoverId) !== hovered?.position.join()) setHover(null);
      applyHighlight();
      if (pinned) {
        const to = framing();
        if (to && tween) tween.to = to;
      }
      requestRender();
    },

    setHighlight(h) {
      if (disposed) return;
      highlight = h;
      applyHighlight();
      requestRender();
    },

    fit(animate) {
      if (disposed) return;
      pinned = true;
      const to = framing();
      if (!to) return;
      if (!animate || reducedMotion) {
        jumpTo(to);
      } else {
        const from = { position: camera.position.clone(), target: controls.target.clone() };
        place(from.position, from.target);
        tween = { from, to, start: -1 };
      }
      requestRender();
    },

    setReducedMotion(reduced) {
      reducedMotion = reduced;
      controls.enableDamping = !reduced;
    },

    resize(width, height, pixelRatio) {
      if (disposed) return;
      viewport.width = width;
      viewport.height = height;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (pinned) {
        const to = framing();
        if (to && tween) tween.to = to;
        else if (to) jumpTo(to);
      }
      requestRender();
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.removeEventListener('end', onControlsEnd);
      controls.dispose();
      clearGraph();
      for (const geometry of [...Object.values(shapes), planeGeometry, outlineGeometry]) geometry.dispose();
      for (const material of [bodyMaterial, haloMaterial, edgeMaterial, ...layerMaterials]) material.dispose();
      renderer.dispose();
      // Frees the context now rather than at garbage collection, so toggling 2D/3D never piles them up.
      renderer.forceContextLoss();
      labelLayer.replaceChildren();
      labels.clear();
      canvas.style.cursor = '';
    },
  };
}
