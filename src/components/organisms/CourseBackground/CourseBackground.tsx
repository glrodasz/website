import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './CourseBackground.css';

export interface CourseBackgroundProps {
  theme?: 'light' | 'dark';
}

// — Network layout —————————————————————————————————
const LAYERS = [3, 6, 8, 8, 6, 3];   // neurons per layer
const LAYER_SPACING = 10;             // horizontal gap between layers
const NEURON_V_SPACING = 4.5;         // vertical gap between neurons
const NEURON_RADIUS = 0.42;
const SIGNAL_RADIUS = 0.30;

// — Timing —————————————————————————————————————————
const WAVE_INTERVAL_MS = 2400;  // new activation wave every ~2.4 s
const SIGNAL_TRAVEL_MS = 480;   // time for a signal to cross one layer
const NEURON_FLASH_MS  = 720;   // duration of the neuron glow

// — Connection opacity ——————————————————————————————
const CONN_OPACITY = { dark: 0.10, light: 0.16 } as const;

// Quick-rise / slow-decay envelope for the neuron flash
function flashEase(t: number): number {
  if (t <= 0 || t >= 1) return 0;
  return t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

interface NeuronData {
  mesh: THREE.Mesh;
  mat:  THREE.MeshBasicMaterial;
  pos:  THREE.Vector3;   // world-space snapshot (neurons never move)
  activeAt: number;      // performance.now() when last activated, -Inf = idle
}

interface SignalData {
  mesh:      THREE.Mesh;
  mat:       THREE.MeshBasicMaterial;
  from:      THREE.Vector3;
  to:        THREE.Vector3;
  startTime: number;
}

interface ScheduledEvent {
  fireAt: number;
  fn: () => void;
}

export const CourseBackground: React.FC<CourseBackgroundProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // — Renderer ——————————————————————————————————
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    // Camera sits slightly left of centre and looks rightward so the network
    // occupies the right half of the canvas naturally.
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.set(-2, 0, 64);
    camera.lookAt(24, 0, 0);

    const group = new THREE.Group();
    group.position.x = 8; // push network into the right half
    scene.add(group);

    // — Design-token colour (yellow in dark, amber in light) ——
    const rawColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--components-tokens--site--course-card--hover-border-color')
      .trim();
    const ACTIVE_COLOR = new THREE.Color(rawColor || '#f7df1d');
    const IDLE_COLOR   = ACTIVE_COLOR.clone().multiplyScalar(0.12);

    // — Neurons ———————————————————————————————————
    const neuronGeom = new THREE.SphereGeometry(NEURON_RADIUS, 10, 10);
    const neurons: NeuronData[][] = LAYERS.map((count, l) =>
      Array.from({ length: count }, (_, n) => {
        const mat  = new THREE.MeshBasicMaterial({ color: IDLE_COLOR.clone() });
        const mesh = new THREE.Mesh(neuronGeom, mat);
        mesh.position.set(
          l * LAYER_SPACING,
          (n - (count - 1) / 2) * NEURON_V_SPACING,
          (Math.random() - 0.5) * 7,
        );
        group.add(mesh);
        return { mesh, mat, pos: mesh.position.clone(), activeAt: -Infinity };
      }),
    );

    // — Connections (single static geometry) ————————
    const connVerts: number[] = [];
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (const a of neurons[l]) {
        for (const b of neurons[l + 1]) {
          connVerts.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
        }
      }
    }
    const connGeom = new THREE.BufferGeometry();
    connGeom.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(connVerts), 3),
    );
    const connMat = new THREE.LineBasicMaterial({
      color: ACTIVE_COLOR,
      transparent: true,
      opacity: CONN_OPACITY[theme],
    });
    group.add(new THREE.LineSegments(connGeom, connMat));

    // — Signal sphere pool ——————————————————————
    const POOL_SIZE = 24;
    const signalGeom = new THREE.SphereGeometry(SIGNAL_RADIUS, 6, 6);
    const pool: SignalData[] = Array.from({ length: POOL_SIZE }, () => {
      const mat  = new THREE.MeshBasicMaterial({ color: ACTIVE_COLOR.clone(), transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(signalGeom, mat);
      mesh.visible = false;
      group.add(mesh);
      return { mesh, mat, from: new THREE.Vector3(), to: new THREE.Vector3(), startTime: -Infinity };
    });
    let activeSignals: SignalData[] = [];

    function spawnSignal(from: THREE.Vector3, to: THREE.Vector3) {
      const sig = pool.find(s => !s.mesh.visible);
      if (!sig) return;
      sig.from.copy(from);
      sig.to.copy(to);
      sig.startTime = performance.now();
      sig.mesh.position.copy(from);
      sig.mesh.visible = true;
      sig.mat.opacity = 1;
      activeSignals.push(sig);
    }

    // — Time-based event queue (avoids dangling setTimeout on unmount) —
    const queue: ScheduledEvent[] = [];
    function schedule(delayMs: number, fn: () => void) {
      queue.push({ fireAt: performance.now() + delayMs, fn });
    }

    // — Activation wave —————————————————————————
    let lastWaveTime = -Infinity;

    function triggerWave() {
      lastWaveTime = performance.now();

      // Build the full propagation path upfront so we can schedule everything
      // without needing to track mid-wave state.
      let prevActive = pickRandom(neurons[0], Math.random() < 0.5 ? 2 : 1);

      // Activate layer 0 immediately
      prevActive.forEach(n => schedule(0, () => { n.activeAt = performance.now(); }));

      for (let l = 1; l < LAYERS.length; l++) {
        const sigDelay  = (l - 1) * SIGNAL_TRAVEL_MS; // signals leave when source activates
        const nodeDelay = l * SIGNAL_TRAVEL_MS;         // targets activate when signal arrives

        const sources = prevActive;
        const targets = pickRandom(
          neurons[l],
          Math.min(Math.floor(Math.random() * 3) + 2, neurons[l].length),
        );

        // Spawn signals: each source sends to 1-2 of the chosen targets
        sources.forEach(src => {
          pickRandom(targets, Math.min(2, targets.length)).forEach(tgt => {
            schedule(sigDelay, () => spawnSignal(src.pos, tgt.pos));
          });
        });

        // Activate target neurons when signals arrive
        targets.forEach(tgt => schedule(nodeDelay, () => { tgt.activeAt = performance.now(); }));

        prevActive = targets;
      }
    }

    // — Resize ——————————————————————————————————
    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // — Animation loop ——————————————————————————
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();

      if (!prefersReduced) {
        // Flush due events
        for (let i = queue.length - 1; i >= 0; i--) {
          if (now >= queue[i].fireAt) {
            queue[i].fn();
            queue.splice(i, 1);
          }
        }

        // Trigger a new wave once the previous one has had time to clear
        if (now - lastWaveTime > WAVE_INTERVAL_MS) triggerWave();

        // Update neuron flash
        for (const layer of neurons) {
          for (const n of layer) {
            if (n.activeAt === -Infinity) continue;
            const t = (now - n.activeAt) / NEURON_FLASH_MS;
            if (t >= 1) {
              n.mat.color.copy(IDLE_COLOR);
              n.mesh.scale.setScalar(1);
              n.activeAt = -Infinity;
            } else {
              const intensity = flashEase(t);
              n.mat.color.copy(IDLE_COLOR).lerp(ACTIVE_COLOR, intensity);
              n.mesh.scale.setScalar(1 + intensity * 0.7);
            }
          }
        }

        // Update travelling signals
        activeSignals = activeSignals.filter(sig => {
          const t = Math.min((now - sig.startTime) / SIGNAL_TRAVEL_MS, 1);
          sig.mesh.position.lerpVectors(sig.from, sig.to, t);
          sig.mat.opacity = 1 - t * t; // fade out as it arrives
          if (t >= 1) {
            sig.mesh.visible = false;
            return false;
          }
          return true;
        });
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      neuronGeom.dispose();
      signalGeom.dispose();
      connGeom.dispose();
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="course-background" aria-hidden="true" />;
};
