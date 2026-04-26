import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './CourseBackground.css';

export interface CourseBackgroundProps {
  theme?: 'light' | 'dark';
}

const OPACITY = {
  dark:  { node: 0.88, line: 0.30, dust: 0.55 },
  light: { node: 0.60, line: 0.18, dust: 0.35 },
} as const;

function readTokenColor(varName: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  try {
    return new THREE.Color(raw);
  } catch {
    return new THREE.Color(0xf7df1d);
  }
}

function buildGroup(theme: 'light' | 'dark'): THREE.Group {
  // Read particle color from the design token system.
  // --components-tokens--site--course-card--hover-border-color resolves to
  // the complementary principal (yellow in dark, amber in light).
  const color = readTokenColor('--components-tokens--site--course-card--hover-border-color');
  const op = OPACITY[theme];
  const group = new THREE.Group();

  // — Node particles: 55 points arranged along a wave ribbon —
  const NODE_COUNT = 55;
  const nodePos = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / NODE_COUNT;
    // Wave ribbon path: S-curve flowing bottom-left → top-right
    const px = (t - 0.1) * 88 - 14;
    const py = Math.sin(t * Math.PI * 2.5) * 16 - (t - 0.55) * 14;
    const pz = Math.cos(t * Math.PI * 2.0) * 13;
    const spread = 9;
    nodePos[i * 3]     = px + (Math.random() - 0.5) * spread;
    nodePos[i * 3 + 1] = py + (Math.random() - 0.5) * spread;
    nodePos[i * 3 + 2] = pz + (Math.random() - 0.5) * spread * 0.55;
  }

  const nodeGeom = new THREE.BufferGeometry();
  nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const nodeMat = new THREE.PointsMaterial({
    color,
    size: 1.9,
    transparent: true,
    opacity: op.node,
    sizeAttenuation: true,
    depthWrite: false,
  });
  group.add(new THREE.Points(nodeGeom, nodeMat));

  // — Lines between nearby node particles —
  const MAX_DIST = 17;
  const lineVerts: number[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodePos[i * 3]     - nodePos[j * 3];
      const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
      const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < MAX_DIST * MAX_DIST) {
        lineVerts.push(
          nodePos[i * 3], nodePos[i * 3 + 1], nodePos[i * 3 + 2],
          nodePos[j * 3], nodePos[j * 3 + 1], nodePos[j * 3 + 2],
        );
      }
    }
  }
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  const lineMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: op.line,
    depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeom, lineMat));

  // — Dust particles: 110 smaller points scattered in the same volume —
  const DUST_COUNT = 110;
  const dustPos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3]     = (Math.random() - 0.1) * 95 - 12;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 48;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 38;
  }
  const dustGeom = new THREE.BufferGeometry();
  dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color,
    size: 0.55,
    transparent: true,
    opacity: op.dust,
    sizeAttenuation: true,
    depthWrite: false,
  });
  group.add(new THREE.Points(dustGeom, dustMat));

  return group;
}

export const CourseBackground: React.FC<CourseBackgroundProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(-2, 4, 68);
    camera.lookAt(22, 0, 0);

    const group = buildGroup(theme);
    // Anchor the particle cluster to the right half of the card so the left
    // side stays clear for the text content.
    group.position.x = 14;
    scene.add(group);

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

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId: number;
    const start = performance.now();

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!prefersReduced) {
        const t = (performance.now() - start) * 0.001;
        // Oscillate ±30° on Y (~35 s period) so particles never swing past
        // 90° and create an empty right side. Subtle X wobble for depth.
        group.rotation.y = Math.sin(t * 0.18) * 0.52;
        group.rotation.x = Math.sin(t * 0.27) * 0.07;
      }
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
    };
  // Rebuild the scene when the theme changes so colors update.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="course-background"
      aria-hidden="true"
    />
  );
};
