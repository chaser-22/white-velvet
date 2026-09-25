"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Quality = "high" | "medium" | "low";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uVelocity;
uniform vec2 uPointer;
uniform vec2 uPointerMotion;
uniform float uEntrance;

varying vec2 vUv;
varying float vDepth;
varying float vFold;
varying float vPointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

void main() {
  vUv = uv;
  vec3 p = position;

  float t = uTime;
  float scroll = uScroll;
  float speed = clamp(abs(uVelocity), 0.0, 1.0);

  float chapter = smoothstep(0.0, 1.0, scroll);
  float slowT = t * 0.62;
  float fastT = t * 1.15;

  float field =
    sin(p.x * 0.55 + slowT * 0.52 + scroll * 4.0) * 0.16 +
    cos(p.y * 0.72 - slowT * 0.40 + scroll * 2.2) * 0.13 +
    sin((p.x + p.y) * 0.30 + slowT * 0.28) * 0.11;

  float grain = (fbm(p.xy * 0.42 + vec2(slowT * 0.06, -slowT * 0.04)) - 0.5) * 0.18;
  float breathing = sin(fastT * 0.58 + p.y * 0.22) * 0.052 + cos(fastT * 0.41 - p.x * 0.17) * 0.036;

  float chapterWave =
    sin(p.y * 1.4 + scroll * 9.0 + fastT * 0.5) * 0.06 * smoothstep(0.12, 0.72, scroll) +
    cos(p.x * 1.1 - scroll * 7.0 - fastT * 0.3) * 0.05 * smoothstep(0.42, 0.96, scroll);

  vec2 fromPointer = uv - uPointer;
  float d = length(fromPointer);
  float influence = exp(-d * 4.0);
  float pointerSpeed = clamp(length(uPointerMotion) * 9.0, 0.0, 1.0);
  vec2 dir = pointerSpeed > 0.001 ? normalize(uPointerMotion) : vec2(1.0, 0.0);
  vec2 tangent = vec2(-dir.y, dir.x);

  float ring = sin(d * 40.0 - t * 7.5 + dot(fromPointer, dir) * 18.0);
  float vortex = dot(normalize(fromPointer + vec2(0.0001)), tangent);

  float pointerDepth =
    influence * 0.20 +
    ring * influence * pointerSpeed * 0.13 +
    vortex * influence * pointerSpeed * 0.08;

  p.z += (field + grain + breathing + chapterWave + pointerDepth) * mix(0.52, 1.0, uEntrance);
  p.z += sin(p.y * 1.8 + t * 2.8) * speed * 0.09;

  p.xy += tangent * ring * influence * pointerSpeed * 0.065;
  p.xy += dir * influence * pointerSpeed * 0.040;

  float edgeCurl = smoothstep(0.52, 1.0, abs(uv.x - 0.5) * 2.0);
  p.z += edgeCurl * sin(t * 0.35 + uv.y * 4.0) * 0.055;

  vDepth = p.z;
  vFold = field + grain;
  vPointer = influence * (0.4 + pointerSpeed * 0.6);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uPointer;
uniform vec2 uPointerMotion;

varying vec2 vUv;
varying float vDepth;
varying float vFold;
varying float vPointer;

void main() {
  float scroll = uScroll;

  vec3 ivory = vec3(0.945, 0.925, 0.885);
  vec3 pearl = vec3(0.78, 0.80, 0.77);
  vec3 graphite = vec3(0.075, 0.090, 0.092);
  vec3 ink = vec3(0.025, 0.035, 0.036);

  float darkBand = smoothstep(0.38, 0.60, scroll) * (1.0 - smoothstep(0.76, 0.94, scroll));
  vec3 base = mix(ivory, pearl, smoothstep(0.08, 0.48, scroll));
  base = mix(base, graphite, darkBand * 0.92);
  base = mix(base, ivory, smoothstep(0.84, 1.0, scroll));

  float velvetA = 0.5 + 0.5 * sin(vUv.y * 610.0 + sin(vUv.x * 34.0) * 1.2);
  float velvetB = 0.5 + 0.5 * sin(vUv.y * 180.0 - vUv.x * 20.0);
  float nap = (velvetA - 0.5) * 0.021 + (velvetB - 0.5) * 0.015;

  float sweep = 0.5 + 0.5 * sin(uTime * 0.54);
  float sheen = exp(-pow((vUv.x * 0.70 + vUv.y * 0.23) - sweep, 2.0) * 16.0);

  vec2 pm = uPointerMotion;
  float pSpeed = clamp(length(pm) * 9.0, 0.0, 1.0);
  vec2 pDir = pSpeed > 0.001 ? normalize(pm) : vec2(1.0, 0.0);
  vec2 fromP = vUv - uPointer;
  float wake = exp(-abs(dot(fromP, vec2(-pDir.y, pDir.x))) * 14.0)
    * exp(-max(dot(fromP, pDir), 0.0) * 4.0)
    * pSpeed;

  float shade = 0.79 + vDepth * 0.34 + vFold * 0.10;
  vec3 color = base * shade;
  color += nap;
  color += sheen * mix(0.13, 0.065, darkBand);
  color += vPointer * mix(vec3(0.10), vec3(0.035), darkBand);
  color += wake * mix(vec3(0.11), vec3(0.055), darkBand);

  float vignette = smoothstep(0.92, 0.28, distance(vUv, vec2(0.5)));
  color *= mix(0.88, 1.05, vignette);

  gl_FragColor = vec4(mix(color, ink, darkBand * 0.06), 0.98);
}
`;

function qualityTier(): Quality {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.innerWidth < 760 || memory <= 4 || cores <= 4) return "low";
  if (window.innerWidth > 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function MaterialField({ quality }: { quality: Quality }) {
  const mesh = useRef<THREE.Mesh>(null);
  const scrollTarget = useRef(0);
  const velocityTarget = useRef(0);
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerMotionTarget = useRef(new THREE.Vector2());
  const previousPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const lastY = useRef(0);
  const lastT = useRef(0);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerMotion: { value: new THREE.Vector2() },
      uEntrance: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);

      const now = performance.now();
      const dt = lastT.current ? Math.max(now - lastT.current, 12) : 16;
      const dy = window.scrollY - lastY.current;
      velocityTarget.current = THREE.MathUtils.clamp((dy / dt) * 0.12, -1, 1);
      lastY.current = window.scrollY;
      lastT.current = now;
    };

    const onPointer = (event: PointerEvent) => {
      if (quality === "low") return;

      const x = event.clientX / Math.max(window.innerWidth, 1);
      const y = 1 - event.clientY / Math.max(window.innerHeight, 1);

      pointerMotionTarget.current.set(
        THREE.MathUtils.clamp((x - previousPointer.current.x) * 4.4, -0.22, 0.22),
        THREE.MathUtils.clamp((y - previousPointer.current.y) * 4.4, -0.22, 0.22),
      );

      pointerTarget.current.set(x, y);
      previousPointer.current.set(x, y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      material.dispose();
    };
  }, [material, quality]);

  useFrame(({ clock, camera }, delta) => {
    if (!mesh.current || document.hidden) return;

    const t = clock.elapsedTime;
    material.uniforms.uTime.value = t;
    material.uniforms.uScroll.value = THREE.MathUtils.damp(
      material.uniforms.uScroll.value,
      scrollTarget.current,
      3.0,
      delta,
    );
    material.uniforms.uVelocity.value = THREE.MathUtils.damp(
      material.uniforms.uVelocity.value,
      velocityTarget.current,
      10.0,
      delta,
    );
    velocityTarget.current *= Math.pow(0.0015, delta);

    material.uniforms.uPointer.value.lerp(pointerTarget.current, 1 - Math.exp(-7.0 * delta));
    material.uniforms.uPointerMotion.value.lerp(pointerMotionTarget.current, 1 - Math.exp(-12.0 * delta));
    pointerMotionTarget.current.multiplyScalar(Math.pow(0.0005, delta));

    material.uniforms.uEntrance.value = THREE.MathUtils.damp(
      material.uniforms.uEntrance.value,
      1,
      2.3,
      delta,
    );

    const scroll = material.uniforms.uScroll.value;
    const velocity = material.uniforms.uVelocity.value;
    const pointer = material.uniforms.uPointer.value;

    const idleX = Math.sin(t * 0.34) * 0.16 + Math.sin(t * 0.63) * 0.045;
    const idleY = Math.cos(t * 0.28) * 0.11;
    const pointerX = quality === "low" ? 0 : (pointer.x - 0.5) * 0.32;
    const pointerY = quality === "low" ? 0 : (pointer.y - 0.5) * 0.22;

    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, idleX + pointerX, 2.7, delta);
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, idleY + pointerY, 2.7, delta);
    mesh.current.position.z = THREE.MathUtils.damp(mesh.current.position.z, -0.55 + scroll * 0.18, 2.4, delta);

    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -0.31 + scroll * 0.15 - velocity * 0.04, 2.5, delta);
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, pointerX * 0.20 + Math.sin(t * 0.21) * 0.035, 2.4, delta);
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, -0.055 + scroll * 0.11 + Math.sin(t * 0.24) * 0.038, 2.4, delta);

    const pulse = 1.44 + Math.sin(t * 0.42) * 0.025 + Math.abs(velocity) * 0.014;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, pulse, 2.8, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, pulse * 0.95, 2.8, delta);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointerX * 0.28 + idleX * 0.16, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointerY * 0.23 + idleY * 0.15, 2.4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.15 - scroll * 0.16 + Math.sin(t * 0.23) * 0.075, 2.0, delta);
    camera.lookAt(0, 0, 0);
  });

  const segments = quality === "high" ? [132, 104] : quality === "medium" ? [92, 72] : [44, 34];

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[10.1, 8.0, segments[0], segments[1]]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function DustField({ quality }: { quality: Quality }) {
  const points = useRef<THREE.Points>(null);
  const count = quality === "high" ? 720 : quality === "medium" ? 420 : 140;

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = i * 2.3999632297;
      const radius = 1.4 + ((i * 31) % 100) / 100 * 4.6;
      array[i * 3] = Math.cos(a) * radius;
      array[i * 3 + 1] = Math.sin(a) * radius * 0.70;
      array[i * 3 + 2] = -0.5 - ((i * 19) % 100) / 100 * 1.6;
    }
    return array;
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!points.current) return;
    points.current.rotation.z += delta * 0.024;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.048;
    points.current.position.y = Math.sin(clock.elapsedTime * 0.22) * 0.10;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={quality === "low" ? 0.011 : 0.015}
        color="#f5efe3"
        opacity={quality === "low" ? 0.13 : 0.22}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function V3Scene() {
  const [quality, setQuality] = useState<Quality>("medium");
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(media.matches);
      setQuality(qualityTier());
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    if (!reduced) return;
    const win = window as Window & { __wvV3SceneReady?: boolean };
    win.__wvV3SceneReady = true;
    window.dispatchEvent(new Event("wv:v3-scene-ready"));
  }, [reduced]);

  if (reduced) {
    return <div className="v3-canvas v3-canvas-fallback is-ready" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.45] : quality === "medium" ? [1, 1.18] : [1, 1];

  return (
    <div className={`v3-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={dpr}
        camera={{ position: [0, 0, 5.15], fov: 42 }}
        gl={{
          alpha: true,
          antialias: quality !== "low",
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={() => {
          setReady(true);
          const win = window as Window & { __wvV3SceneReady?: boolean };
          win.__wvV3SceneReady = true;
          window.dispatchEvent(new Event("wv:v3-scene-ready"));
        }}
      >
        <MaterialField quality={quality} />
        <DustField quality={quality} />
      </Canvas>
      <div className="v3-canvas-overlay" />
    </div>
  );
}
