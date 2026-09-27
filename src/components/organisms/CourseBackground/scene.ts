import * as THREE from 'three';
import {
  CASCADE_GAP_MAX_MS,
  CASCADE_GAP_MIN_MS,
  CLOUD_FILL,
  CLOUD_RADIUS_Y,
  ENERGY_MS,
  FLASH_MS,
  FRAMING,
  buildGraph,
  mulberry32,
  planCascade,
  type Cascade,
  type Graph,
} from './graph';

/** Colors resolved from the Site.Course-background component tokens. */
export interface ScenePalette {
  synapse: string;
  neuron: string;
  signal: string;
  haze: string;
  /**
   * Light card surface. Glow can't be additive there (gold over beige washes out to white), so
   * everything blends normally, cores get a smaller glint instead of going white-hot, and lines
   * get more weight.
   */
  lightSurface: boolean;
}

export interface NeuralScene {
  resize(width: number, height: number, pixelRatio: number): void;
  setPalette(palette: ScenePalette): void;
  /** Pointer position over the card, -1…1 on both axes; (0, 0) when it leaves. */
  setPointer(x: number, y: number): void;
  /** Card position in the viewport: -1 entering from below, 0 centred, 1 leaving at the top. */
  setScroll(progress: number): void;
  frame(now: number): void;
  /** A single composed frame, for prefers-reduced-motion. */
  still(): void;
  dispose(): void;
}

const FOV = 30;
const MAX_PULSES = 48;
// Sprite sizes in world units (one unit is roughly 30 px on a desktop card).
const NODE_SIZE = 0.72;
const FLARE_SIZE = 3.1;
const PULSE_SIZE = 1.8;
const FAR_BOKEH = 22;
const NEAR_BOKEH = 4;
const HAZE_OPACITY = { light: 0.7, dark: 0.55 };
/** Phone cards run full-width copy over the network, so the atmosphere is thinned there. */
const NARROW_HAZE_FACTOR = { light: 0.6, dark: 0.35 };
const SYNAPSE_ALPHA = { light: 0.4, dark: 0.26 };
/** White-hot cores: full on dark; on light a smaller glint, which still reads inside each gold halo. */
const CORE_GLOW = { light: 0.55, dark: 1 };
const PARALLAX_POINTER = { x: 3.2, y: 2.0 };  // world units of camera travel
const PARALLAX_SCROLL = 3.2;
const PARALLAX_EASE = 0.0045;                 // per ms; ~220 ms to settle

// Idle drift shared by every layer, so edges stay attached to their nodes. Mirrored in `drift()`.
const DRIFT_GLSL = /* glsl */ `
  vec3 drift(float seed, float t) {
    return vec3(
      sin(t * 0.00041 + seed * 6.2831),
      cos(t * 0.00033 + seed * 12.566),
      sin(t * 0.00027 + seed * 3.7)
    ) * 0.32;
  }
`;
function drift(seed: number, t: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set(
    Math.sin(t * 0.00041 + seed * 6.2831),
    Math.cos(t * 0.00033 + seed * 12.566),
    Math.sin(t * 0.00027 + seed * 3.7),
  ).multiplyScalar(0.32);
}

// Depth of field: how far (world units) from the focal plane a point goes fully soft.
const DOF_GLSL = /* glsl */ `
  uniform float uFocus;
  uniform float uDofRange;
  float blurAt(float depth) { return clamp(abs(depth - uFocus) / uDofRange, 0.0, 1.0); }
`;

const NODE_VERTEX = /* glsl */ `
  ${DRIFT_GLSL}
  ${DOF_GLSL}
  attribute float aSize;
  attribute float aSeed;
  attribute float aActivation;
  uniform float uTime;
  uniform float uScale;
  varying float vBlur;
  varying float vActivation;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position + drift(aSeed, uTime), 1.0);
    float depth = -mv.z;
    vBlur = blurAt(depth);
    vActivation = aActivation;
    vTwinkle = 0.82 + 0.18 * sin(uTime * 0.002 + aSeed * 40.0);
    // Out-of-focus points grow into soft discs, like a real lens.
    float size = aSize * (1.0 + aActivation * 1.4) * (1.0 + vBlur * 2.4);
    gl_PointSize = size * uScale / depth;
    gl_Position = projectionMatrix * mv;
  }
`;

const NODE_FRAGMENT = /* glsl */ `
  uniform float uCoreGlow;
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vBlur;
  varying float vActivation;
  varying float vTwinkle;
  void main() {
    float r = length(gl_PointCoord * 2.0 - 1.0);
    if (r > 1.0) discard;
    float core = smoothstep(0.32, 0.0, r);
    float halo = pow(1.0 - r, 2.6);
    float disc = smoothstep(1.0, 0.72, r) * 0.42;           // bokeh
    float shape = mix(core * 0.85 + halo * 0.38, disc, vBlur);
    vec3 color = mix(uColor, uHot, vActivation);
    // A white-hot centre on in-focus and firing nodes (a smaller glint on light surfaces).
    color = mix(color, vec3(1.0), core * (0.3 + 0.55 * vActivation) * (1.0 - vBlur) * uCoreGlow);
    float alpha = shape * mix(1.0, 0.45, vBlur) * vTwinkle * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

const EDGE_VERTEX = /* glsl */ `
  ${DRIFT_GLSL}
  ${DOF_GLSL}
  attribute float aSeed;
  attribute float aEnergy;
  uniform float uTime;
  varying float vBlur;
  varying float vEnergy;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position + drift(aSeed, uTime), 1.0);
    vBlur = blurAt(-mv.z);
    vEnergy = aEnergy;
    gl_Position = projectionMatrix * mv;
  }
`;

const EDGE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vBlur;
  varying float vEnergy;
  void main() {
    float alpha = uOpacity * mix(1.0, 0.3, vBlur) + vEnergy * 0.75;
    gl_FragColor = vec4(mix(uColor, uHot, vEnergy), min(alpha, 1.0));
  }
`;

const SPRITE_VERTEX = /* glsl */ `
  ${DOF_GLSL}
  attribute float aSize;
  attribute float aAlpha;
  uniform float uScale;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vBlur = blurAt(-mv.z);
    vAlpha = aAlpha;
    gl_PointSize = aSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

/** Star flares on hubs and firing nodes. */
const FLARE_FRAGMENT = /* glsl */ `
  uniform float uCoreGlow;
  uniform sampler2D uMap;
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    vec3 color = mix(uColor, vec3(1.0), tex.r * 0.45 * uCoreGlow);
    gl_FragColor = vec4(color, tex.a * vAlpha * mix(1.0, 0.4, vBlur));
  }
`;

/** Soft bokeh discs with a faint bright rim, like out-of-focus highlights. */
const BOKEH_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float r = length(gl_PointCoord * 2.0 - 1.0);
    if (r > 1.0) discard;
    float disc = smoothstep(1.0, 0.8, r);
    float rim = smoothstep(0.7, 0.95, r) * disc * 0.35;
    gl_FragColor = vec4(uColor, (disc * 0.55 + rim) * vAlpha);
  }
`;

/** Smoke behind the cloud: domain-warped fbm noise, drifting slowly. */
const HAZE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HAZE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uWarm;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec2 uAspect;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = vUv * uAspect * 2.4;
    float t = uTime * 0.00004;
    float warp = fbm(p * 0.7 + vec2(-t, t * 0.6));
    float n = fbm(p + vec2(t * 1.3, -t) + warp * 1.1);
    float density = smoothstep(0.28, 0.82, n);
    // Thinner toward the plane's edges so it never shows a hard border.
    vec2 edge = smoothstep(vec2(0.0), vec2(0.18), vUv) * smoothstep(vec2(0.0), vec2(0.18), 1.0 - vUv);
    float alpha = uOpacity * (0.5 + 0.5 * density) * edge.x * edge.y;
    gl_FragColor = vec4(mix(uColor, uWarm, 0.14 * density), alpha);
  }
`;

/** Travelling pulses: a tight hot core in a wide glow. */
const PULSE_FRAGMENT = /* glsl */ `
  uniform float uCoreGlow;
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float r = length(gl_PointCoord * 2.0 - 1.0);
    if (r > 1.0) discard;
    float glow = pow(1.0 - r, 3.0);
    float core = smoothstep(0.22, 0.0, r);
    vec3 color = mix(uColor, vec3(1.0), core * 0.8 * uCoreGlow);
    gl_FragColor = vec4(color, (glow * 0.8 + core) * vAlpha);
  }
`;

function makeFlareTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const mid = size / 2;
  // Glow body. Drawn in white: the shader tints it with the signal token.
  const glow = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
  glow.addColorStop(0, 'rgba(255,255,255,1)');
  glow.addColorStop(0.08, 'rgba(255,255,255,0.7)');
  glow.addColorStop(0.3, 'rgba(255,255,255,0.12)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, size, size);
  // Thin cross streaks — the "star" in star flare.
  const streak = (horizontal: boolean) => {
    const grad = horizontal
      ? g.createLinearGradient(0, mid, size, mid)
      : g.createLinearGradient(mid, 0, mid, size);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    if (horizontal) g.fillRect(size * 0.1, mid - 0.75, size * 0.8, 1.5);
    else g.fillRect(mid - 0.75, size * 0.2, 1.5, size * 0.6);
  };
  streak(true);
  streak(false);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/** Where node `i` is at time `t`, drift included. */
function nodeAt(g: Graph, i: number, t: number, out: THREE.Vector3): THREE.Vector3 {
  const p = g.nodes[i];
  drift(p.seed, t, out);
  out.x += p.x;
  out.y += p.y;
  out.z += p.z;
  return out;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** Quick rise, slow decay. */
const flash = (t: number) => (t <= 0 || t >= 1 ? 0 : t < 0.12 ? t / 0.12 : 1 - easeOut((t - 0.12) / 0.88));

export function createNeuralScene(canvas: HTMLCanvasElement): NeuralScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 400);
  const cloud = new THREE.Group();
  scene.add(cloud);

  const flareTexture = makeFlareTexture();
  const colors = {
    synapse: new THREE.Color(),
    neuron: new THREE.Color(),
    signal: new THREE.Color(),
    haze: new THREE.Color(),
  };
  const shared = {
    uTime: { value: 0 },
    uScale: { value: 1 },
    uFocus: { value: 50 },
    uDofRange: { value: 14 },
    uCoreGlow: { value: 1 },
  };
  const material = (vertexShader: string, fragmentShader: string, extra: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { ...shared, ...extra },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

  const nodeMaterial = material(NODE_VERTEX, NODE_FRAGMENT, {
    uColor: { value: colors.neuron }, uHot: { value: colors.signal }, uOpacity: { value: 1 },
  });
  const edgeMaterial = material(EDGE_VERTEX, EDGE_FRAGMENT, {
    uColor: { value: colors.synapse }, uHot: { value: colors.signal }, uOpacity: { value: SYNAPSE_ALPHA.dark },
  });
  const flareMaterial = material(SPRITE_VERTEX, FLARE_FRAGMENT, {
    uMap: { value: flareTexture }, uColor: { value: colors.signal },
  });
  const pulseMaterial = material(SPRITE_VERTEX, PULSE_FRAGMENT, { uColor: { value: colors.signal } });
  const bokehMaterial = material(SPRITE_VERTEX, BOKEH_FRAGMENT, { uColor: { value: colors.signal } });
  const hazeMaterial = material(HAZE_VERTEX, HAZE_FRAGMENT, {
    uColor: { value: colors.haze },
    uWarm: { value: colors.signal },
    uOpacity: { value: HAZE_OPACITY.dark },
    uAspect: { value: new THREE.Vector2(1, 1) },
  });
  hazeMaterial.blending = THREE.NormalBlending;
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hazeMaterial);
  haze.renderOrder = -2;
  scene.add(haze);

  // Per-graph state, rebuilt on resize.
  let graph: Graph | null = null;
  let nodes: THREE.Points | null = null;
  let edges: THREE.LineSegments | null = null;
  let flares: THREE.Points | null = null;
  let pulses: THREE.Points | null = null;
  let bokeh: THREE.Points | null = null;
  let edgeIndex = new Map<number, number>();
  let cascades: Cascade[] = [];
  let nextCascadeAt = 0;
  let lastNow = -1;
  let lightSurface = false;

  const pointer = new THREE.Vector2();
  const scroll = { target: 0 };
  const offset = new THREE.Vector2();
  let distance = 60;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();

  function disposeGraph() {
    for (const obj of [nodes, edges, flares, pulses, bokeh]) {
      if (!obj) continue;
      obj.geometry.dispose();
      obj.parent?.remove(obj);
    }
    nodes = edges = flares = pulses = bokeh = null;
  }

  function buildLayers(g: Graph) {
    disposeGraph();
    const n = g.nodes.length;
    const rng = mulberry32(5);

    // Nodes
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.Float32BufferAttribute(g.nodes.flatMap((p) => [p.x, p.y, p.z]), 3));
    nodeGeom.setAttribute('aSize', new THREE.Float32BufferAttribute(g.nodes.map((p) => p.size * NODE_SIZE), 1));
    nodeGeom.setAttribute('aSeed', new THREE.Float32BufferAttribute(g.nodes.map((p) => p.seed), 1));
    nodeGeom.setAttribute('aActivation', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    nodes = new THREE.Points(nodeGeom, nodeMaterial);

    // Edges
    edgeIndex = new Map();
    const edgePos: number[] = [];
    const edgeSeed: number[] = [];
    g.edges.forEach(([i, j], e) => {
      const p = g.nodes[i], q = g.nodes[j];
      edgePos.push(p.x, p.y, p.z, q.x, q.y, q.z);
      edgeSeed.push(p.seed, q.seed);
      edgeIndex.set(i * n + j, e);
      edgeIndex.set(j * n + i, e);
    });
    const edgeGeom = new THREE.BufferGeometry();
    edgeGeom.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3));
    edgeGeom.setAttribute('aSeed', new THREE.Float32BufferAttribute(edgeSeed, 1));
    edgeGeom.setAttribute('aEnergy', new THREE.Float32BufferAttribute(new Float32Array(g.edges.length * 2), 1));
    edges = new THREE.LineSegments(edgeGeom, edgeMaterial);

    // Flares: one slot per node; hubs glow at rest, every node flares while firing.
    const flareGeom = new THREE.BufferGeometry();
    flareGeom.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    flareGeom.setAttribute('aSize', new THREE.Float32BufferAttribute(g.nodes.map((p) => p.size * FLARE_SIZE), 1));
    flareGeom.setAttribute('aAlpha', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    flares = new THREE.Points(flareGeom, flareMaterial);

    // Pulses
    const pulseGeom = new THREE.BufferGeometry();
    pulseGeom.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAX_PULSES * 3), 3));
    pulseGeom.setAttribute('aSize', new THREE.Float32BufferAttribute(new Float32Array(MAX_PULSES).fill(PULSE_SIZE), 1));
    pulseGeom.setAttribute('aAlpha', new THREE.Float32BufferAttribute(new Float32Array(MAX_PULSES), 1));
    pulses = new THREE.Points(pulseGeom, pulseMaterial);

    // Bokeh: far discs behind the cloud, a few big ones right in front of the lens.
    const bokehPos: number[] = [];
    const bokehSize: number[] = [];
    const bokehAlpha: number[] = [];
    for (let i = 0; i < FAR_BOKEH + NEAR_BOKEH; i++) {
      const near = i >= FAR_BOKEH;
      const z = near ? distance * (0.35 + rng() * 0.2) : -g.radii.z * (1.6 + rng() * 2.2);
      const spread = near ? 0.55 : 1.5;
      bokehPos.push(
        (rng() * 2 - 1) * g.radii.x * spread * 1.3,
        (rng() * 2 - 1) * g.radii.y * spread,
        z,
      );
      bokehSize.push(near ? 2.5 + rng() * 2.5 : 1.2 + rng() * 2.4);
      bokehAlpha.push(near ? 0.03 + rng() * 0.04 : 0.04 + rng() * 0.09);
    }
    const bokehGeom = new THREE.BufferGeometry();
    bokehGeom.setAttribute('position', new THREE.Float32BufferAttribute(bokehPos, 3));
    bokehGeom.setAttribute('aSize', new THREE.Float32BufferAttribute(bokehSize, 1));
    bokehGeom.setAttribute('aAlpha', new THREE.Float32BufferAttribute(bokehAlpha, 1));
    bokeh = new THREE.Points(bokehGeom, bokehMaterial);
    bokeh.renderOrder = -1;
    scene.add(bokeh); // outside the cloud group, so it does not rotate with it

    cloud.add(edges, nodes, flares, pulses);
  }

  function applyHazeOpacity() {
    const theme = lightSurface ? 'light' : 'dark';
    const narrow = graph?.framing === 'narrow';
    hazeMaterial.uniforms.uOpacity.value = HAZE_OPACITY[theme] * (narrow ? NARROW_HAZE_FACTOR[theme] : 1);
  }

  function update(now: number, animate: boolean) {
    if (!graph || !nodes || !edges || !flares || !pulses) return;
    const g = graph;
    const n = g.nodes.length;
    const dt = lastNow < 0 ? 16 : Math.min(now - lastNow, 100);
    lastNow = now;
    shared.uTime.value = animate ? now : 0;

    if (animate) {
      if (now >= nextCascadeAt) {
        cascades.push(planCascade(g, Math.random, now));
        nextCascadeAt = now + CASCADE_GAP_MIN_MS + Math.random() * (CASCADE_GAP_MAX_MS - CASCADE_GAP_MIN_MS);
      }
      cascades = cascades.filter((c) => now < c.end);

      // Slow sway of the whole cloud, plus parallax easing toward pointer + scroll.
      cloud.rotation.y = Math.sin(now * 0.00006) * 0.32;
      cloud.rotation.x = Math.sin(now * 0.000043) * 0.08;
      const k = 1 - Math.exp(-PARALLAX_EASE * dt);
      offset.x += (pointer.x * PARALLAX_POINTER.x - offset.x) * k;
      offset.y += (pointer.y * PARALLAX_POINTER.y + scroll.target * PARALLAX_SCROLL - offset.y) * k;
    }
    camera.position.set(offset.x, offset.y, distance);
    camera.lookAt(0, 0, 0);

    // Node activation from every live cascade.
    const activation = nodes.geometry.getAttribute('aActivation') as THREE.BufferAttribute;
    const act = activation.array as Float32Array;
    act.fill(0);
    for (const c of cascades) {
      for (const f of c.fires) {
        const v = flash((now - f.at) / FLASH_MS);
        if (v > act[f.node]) act[f.node] = v;
      }
    }
    activation.needsUpdate = true;

    // Flares follow their (drifting) node; hubs keep a gentle glow at rest.
    const flarePos = flares.geometry.getAttribute('position') as THREE.BufferAttribute;
    const flareAlpha = flares.geometry.getAttribute('aAlpha') as THREE.BufferAttribute;
    const t = shared.uTime.value;
    for (let i = 0; i < n; i++) {
      const p = g.nodes[i];
      nodeAt(g, i, t, a);
      flarePos.setXYZ(i, a.x, a.y, a.z);
      const rest = p.hub ? 0.22 + 0.07 * Math.sin(t * 0.0015 + p.seed * 30) : 0;
      flareAlpha.setX(i, Math.max(rest, act[i] * 0.8));
    }
    flarePos.needsUpdate = true;
    flareAlpha.needsUpdate = true;

    // Pulses and edge energy.
    const energyAttr = edges.geometry.getAttribute('aEnergy') as THREE.BufferAttribute;
    const energy = energyAttr.array as Float32Array;
    energy.fill(0);
    const pulsePos = pulses.geometry.getAttribute('position') as THREE.BufferAttribute;
    const pulseAlpha = pulses.geometry.getAttribute('aAlpha') as THREE.BufferAttribute;
    let used = 0;
    for (const c of cascades) {
      for (const hop of c.hops) {
        const e = edgeIndex.get(hop.from * n + hop.to);
        const progress = (now - hop.start) / hop.duration;
        if (progress < 0 || e === undefined) continue;
        let level = 0;
        if (progress <= 1) {
          level = 0.35 + 0.4 * progress;
          if (used < MAX_PULSES) {
            nodeAt(g, hop.from, t, a).lerp(nodeAt(g, hop.to, t, b), progress);
            pulsePos.setXYZ(used, a.x, a.y, a.z);
            pulseAlpha.setX(used, 1);
            used++;
          }
        } else {
          const after = (now - hop.start - hop.duration) / ENERGY_MS;
          if (after < 1) level = 0.75 * (1 - easeOut(after));
        }
        if (level > energy[e * 2]) energy[e * 2] = energy[e * 2 + 1] = level;
      }
    }
    for (let i = used; i < MAX_PULSES; i++) pulseAlpha.setX(i, 0);
    energyAttr.needsUpdate = true;
    pulsePos.needsUpdate = true;
    pulseAlpha.needsUpdate = true;

    renderer.render(scene, camera);
  }

  return {
    resize(width, height, pixelRatio) {
      if (width === 0 || height === 0) return;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Fit the cloud's height to the card, then slide the view so its centre sits right of middle.
      distance = CLOUD_RADIUS_Y / (CLOUD_FILL * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      graph = buildGraph(width, height);
      const { center } = FRAMING[graph.framing];
      camera.setViewOffset(width, height, width * (0.5 - center), 0, width, height);
      camera.updateProjectionMatrix();
      shared.uScale.value = (height * pixelRatio) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      shared.uFocus.value = distance - graph.radii.z * 0.2;
      shared.uDofRange.value = graph.radii.z * 1.25;
      // Haze plane behind the cloud, oversized so parallax never reveals its edges. It spans the
      // whole view; the stage mask fades its left side out toward the copy.
      const hazeZ = -graph.radii.z * 1.4;
      const viewH = 2 * (distance - hazeZ) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const viewW = viewH * camera.aspect;
      haze.position.set(viewW * (0.5 - center), 0, hazeZ);
      haze.scale.set(viewW * 1.5, viewH * 1.4, 1);
      (hazeMaterial.uniforms.uAspect.value as THREE.Vector2).set(camera.aspect * 1.5, 1.4);
      cascades = [];
      nextCascadeAt = 0;
      buildLayers(graph);
      applyHazeOpacity();
    },
    setPalette(palette) {
      // Keep the token hex as-is: these shaders write sRGB straight out, with no linear round trip.
      colors.synapse.setStyle(palette.synapse, THREE.LinearSRGBColorSpace);
      colors.neuron.setStyle(palette.neuron, THREE.LinearSRGBColorSpace);
      colors.signal.setStyle(palette.signal, THREE.LinearSRGBColorSpace);
      colors.haze.setStyle(palette.haze, THREE.LinearSRGBColorSpace);
      lightSurface = palette.lightSurface;
      applyHazeOpacity();
      shared.uCoreGlow.value = lightSurface ? CORE_GLOW.light : CORE_GLOW.dark;
      edgeMaterial.uniforms.uOpacity.value = lightSurface ? SYNAPSE_ALPHA.light : SYNAPSE_ALPHA.dark;
      const blending = lightSurface ? THREE.NormalBlending : THREE.AdditiveBlending;
      for (const m of [nodeMaterial, edgeMaterial, flareMaterial, pulseMaterial, bokehMaterial]) {
        m.blending = blending;
        m.needsUpdate = true;
      }
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    setScroll(progress) {
      scroll.target = progress;
    },
    frame(now) {
      update(now, true);
    },
    still() {
      if (!graph) return;
      // Freeze a cascade mid-flight, from a fixed seed so the still frame is always the same.
      cascades = [planCascade(graph, mulberry32(3), 0)];
      offset.set(0, 0);
      lastNow = -1;
      update(1100, false);
      cascades = [];
    },
    dispose() {
      disposeGraph();
      haze.geometry.dispose();
      for (const m of [nodeMaterial, edgeMaterial, flareMaterial, pulseMaterial, bokehMaterial, hazeMaterial]) m.dispose();
      flareTexture.dispose();
      renderer.dispose();
    },
  };
}
