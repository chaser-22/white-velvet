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
uniform float uEntrance;

varying vec2 vUv;
varying float vHeight;
varying float vLight;

void main() {
  vUv = uv;
  vec3 p = position;

  float t = uTime;
  float scroll = uScroll;
  float energy = min(abs(uVelocity) * 0.75, 1.0);

  float macroFold =
    sin(p.x * 0.62 + t * 0.22 + scroll * 4.2) * 0.22 +
    sin(p.y * 0.74 - t * 0.17 + scroll * 2.4) * 0.17 +
    sin((p.x + p.y) * 0.31 + t * 0.12) * 0.12;

  float breath =
    sin(t * 0.34 + p.y * 0.26) * 0.055 +
    cos(t * 0.21 - p.x * 0.18) * 0.038;

  float treatment =
    sin(p.x * 1.45 + p.y * 0.32 + scroll * 8.0) * 0.055 * smoothstep(0.10, 0.62, scroll) +
    sin(p.y * 2.2 - t * 0.32) * 0.028 * smoothstep(0.30, 0.78, scroll);

  float scrollWave =
    sin(p.y * 1.25 + t * 1.8) * 0.11 * energy +
    cos(p.x * 0.92 - t * 1.35) * 0.07 * energy;

  vec2 pointerDelta = uPointer - vec2(0.5);
  float pointerLift = exp(-distance(uv, uPointer) * 7.8) * 0.10;

  p.z += (macroFold + breath + treatment + scrollWave + pointerLift) * mix(0.58, 1.0, uEntrance);
  p.x += pointerDelta.x * 0.055 + sin(t * 0.14 + p.y * 0.18) * 0.018;
  p.y += pointerDelta.y * 0.038 + cos(t * 0.11 + p.x * 0.15) * 0.014;

  vHeight = p.z;
  vLight = 0.5 + 0.5 * sin((uv.x * 0.68 + uv.y * 0.42) * 9.0 - t * 0.24 + scroll * 3.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uPointer;

varying vec2 vUv;
varying float vHeight;
varying float vLight;

void main() {
  float scroll = uScroll;

  vec3 pearl = vec3(0.925, 0.910, 0.875);
  vec3 silver = vec3(0.66, 0.69, 0.68);
  vec3 graphite = vec3(0.085, 0.098, 0.10);
  vec3 warm = vec3(0.965, 0.946, 0.902);

  float darkChapter = smoothstep(0.42, 0.68, scroll) * (1.0 - smoothstep(0.80, 0.96, scroll));
  vec3 base = mix(pearl, silver, smoothstep(0.08, 0.46, scroll));
  base = mix(base, graphite, darkChapter * 0.82);
  base = mix(base, warm, smoothstep(0.82, 1.0, scroll));

  float fibersA = 0.5 + 0.5 * sin(vUv.y * 520.0 + sin(vUv.x * 31.0) * 0.8);
  float fibersB = 0.5 + 0.5 * sin(vUv.y * 166.0 + vUv.x * 23.0);
  float nap = (fibersA - 0.5) * 0.024 + (fibersB - 0.5) * 0.018;

  float travelingSheen = exp(-pow((vUv.x * 0.74 + vUv.y * 0.18) - (0.5 + 0.5 * sin(uTime * 0.17)), 2.0) * 11.0);
  float pointerGlow = exp(-distance(vUv, uPointer) * 8.0);

  float shade = 0.78 + vHeight * 0.32 + vLight * 0.10;
  vec3 color = base * shade;
  color += nap;
  color += travelingSheen * (0.05 + (1.0 - darkChapter) * 0.08);
  color += pointerGlow * 0.025;

  gl_FragColor = vec4(color, 0.97);
}
`;

function getQuality(): Quality {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.innerWidth < 760 || memory <= 4 || cores <= 4) return "low";
  if (window.innerWidth > 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function VelvetSurface({ quality }: { quality: Quality }) {
  const mesh = useRef<THREE.Mesh>(null);
  const scrollTarget = useRef(0);
  const velocityTarget = useRef(0);
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const lastScroll = useRef(0);
  const lastTime = useRef(performance.now());

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uEntrance: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  useEffect(() => {
    const updateScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);

      const now = performance.now();
      const dt = Math.max(now - lastTime.current, 12);
      const dy = window.scrollY - lastScroll.current;
      velocityTarget.current = THREE.MathUtils.clamp((dy / dt) * 0.09, -1, 1);
      lastScroll.current = window.scrollY;
      lastTime.current = now;
    };

    const onPointer = (event: PointerEvent) => {
      if (quality === "low") return;
      pointerTarget.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        1 - event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointer);
      material.dispose();
    };
  }, [material, quality]);

  useFrame(({ clock, camera }, delta) => {
    if (!mesh.current || document.hidden) return;

    const time = clock.elapsedTime;
    material.uniforms.uTime.value = time;
    material.uniforms.uScroll.value = THREE.MathUtils.damp(
      material.uniforms.uScroll.value,
      scrollTarget.current,
      2.35,
      delta,
    );
    material.uniforms.uVelocity.value = THREE.MathUtils.damp(
      material.uniforms.uVelocity.value,
      velocityTarget.current,
      5.4,
      delta,
    );
    velocityTarget.current *= Math.pow(0.028, delta);

    material.uniforms.uPointer.value.lerp(
      pointerTarget.current,
      1 - Math.exp(-2.1 * delta),
    );
    material.uniforms.uEntrance.value = THREE.MathUtils.damp(
      material.uniforms.uEntrance.value,
      1,
      1.6,
      delta,
    );

    const scroll = material.uniforms.uScroll.value;
    const velocity = material.uniforms.uVelocity.value;
    const pointer = material.uniforms.uPointer.value;

    const idleX = Math.sin(time * 0.17) * 0.13 + Math.sin(time * 0.31) * 0.05;
    const idleY = Math.cos(time * 0.14) * 0.09;
    const pointerX = quality === "low" ? 0 : (pointer.x - 0.5) * 0.16;
    const pointerY = quality === "low" ? 0 : (pointer.y - 0.5) * 0.11;

    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, idleX + pointerX, 2.0, delta);
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, idleY + pointerY, 2.0, delta);
    mesh.current.position.z = THREE.MathUtils.damp(mesh.current.position.z, -0.48 + scroll * 0.12, 2.0, delta);
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -0.28 + scroll * 0.12 - velocity * 0.03, 2.1, delta);
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, pointerX * 0.16 + velocity * 0.018, 2.0, delta);
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, -0.08 + Math.sin(time * 0.12) * 0.025 + scroll * 0.10, 2.0, delta);

    const scale = 1.42 + Math.sin(time * 0.18) * 0.018 + Math.abs(velocity) * 0.016;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, scale, 2.4, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, scale * 0.94, 2.4, delta);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, idleX * 0.16 + pointerX * 0.22, 1.9, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, idleY * 0.16 + pointerY * 0.18, 1.9, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.25 - scroll * 0.18 + Math.sin(time * 0.13) * 0.05, 1.7, delta);
    camera.lookAt(0, 0, 0);
  });

  const segments = quality === "high" ? [120, 92] : quality === "medium" ? [84, 64] : [40, 30];

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[9.6, 7.8, segments[0], segments[1]]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Fibers({ quality }: { quality: Quality }) {
  const points = useRef<THREE.Points>(null);
  const count = quality === "high" ? 900 : quality === "medium" ? 520 : 220;

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = i * 2.399963229728653;
      const radius = 1.2 + ((i * 17) % 100) / 100 * 4.2;
      data[i * 3] = Math.cos(a) * radius;
      data[i * 3 + 1] = Math.sin(a) * radius * 0.72;
      data[i * 3 + 2] = -0.1 - ((i * 29) % 100) / 100 * 1.8;
    }
    return data;
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!points.current) return;
    points.current.rotation.z += delta * 0.012;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.035;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={quality === "low" ? 0.012 : 0.016}
        color="#f7f0e4"
        opacity={quality === "low" ? 0.18 : 0.28}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function V2Scene() {
  const [quality, setQuality] = useState<Quality>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      setQuality(getQuality());
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (reducedMotion) {
    return <div className="v2-canvas-shell v2-canvas-fallback is-ready" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.45] : quality === "medium" ? [1, 1.2] : [1, 1];

  return (
    <div className={`v2-canvas-shell ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={dpr}
        camera={{ position: [0, 0, 5.25], fov: 43 }}
        gl={{
          alpha: true,
          antialias: quality !== "low",
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={() => {
          setReady(true);
          const win = window as Window & { __wvV2SceneReady?: boolean };
          win.__wvV2SceneReady = true;
          window.dispatchEvent(new Event("wv:v2-scene-ready"));
        }}
      >
        <VelvetSurface quality={quality} />
        <Fibers quality={quality} />
      </Canvas>
      <div className="v2-canvas-atmosphere" />
    </div>
  );
}
