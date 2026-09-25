"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Quality = "high" | "medium" | "low";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uVelocity;
uniform float uIdle;
uniform vec2 uPointer;
uniform vec2 uPointerMotion;
uniform vec2 uPointerMotion;
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
  float idleT = t * mix(1.25, 2.15, uIdle);

  float macroFold =
    sin(p.x * 0.62 + idleT * 0.24 + scroll * 4.2) * 0.22 +
    sin(p.y * 0.74 - idleT * 0.19 + scroll * 2.4) * 0.17 +
    sin((p.x + p.y) * 0.31 + idleT * 0.14) * 0.12;

  float breath =
    sin(idleT * 0.36 + p.y * 0.26) * mix(0.055, 0.068, uIdle) +
    cos(idleT * 0.24 - p.x * 0.18) * mix(0.038, 0.047, uIdle);

  float treatment =
    sin(p.x * 1.45 + p.y * 0.32 + scroll * 8.0) * 0.055 * smoothstep(0.10, 0.62, scroll) +
    sin(p.y * 2.2 - idleT * 0.36) * 0.028 * smoothstep(0.30, 0.78, scroll);

  float scrollWave =
    sin(p.y * 1.25 + t * 1.8) * 0.11 * energy +
    cos(p.x * 0.92 - t * 1.35) * 0.07 * energy;

  vec2 pointerDelta = uPointer - vec2(0.5);
  vec2 fromPointer = uv - uPointer;
  float pointerDistance = length(fromPointer);
  float pointerInfluence = exp(-pointerDistance * 4.6);
  float pointerLift = pointerInfluence * 0.16;

  float pointerSpeed = clamp(length(uPointerMotion) * 8.0, 0.0, 1.0);
  vec2 pointerDir = pointerSpeed > 0.001 ? normalize(uPointerMotion) : vec2(1.0, 0.0);
  vec2 tangent = vec2(-pointerDir.y, pointerDir.x);
  float pointerWave = sin(pointerDistance * 34.0 - t * 6.2 + dot(fromPointer, pointerDir) * 20.0);
  float pointerFlow = pointerWave * pointerInfluence * pointerSpeed;

  p.z += (macroFold + breath + treatment + scrollWave + pointerLift + pointerFlow * 0.18) * mix(0.58, 1.0, uEntrance);
  p.xy += tangent * pointerFlow * 0.055;
  p.xy += pointerDir * pointerInfluence * pointerSpeed * 0.035;
  p.x += pointerDelta.x * 0.082 + sin(idleT * 0.20 + p.y * 0.18) * mix(0.020, 0.030, uIdle);
  p.y += pointerDelta.y * 0.058 + cos(idleT * 0.17 + p.x * 0.15) * mix(0.016, 0.024, uIdle);

  vHeight = p.z;
  vLight = 0.5 + 0.5 * sin((uv.x * 0.68 + uv.y * 0.42) * 9.0 - idleT * 0.27 + scroll * 3.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uIdle;
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

  float sheenTime = uTime * mix(0.24, 0.42, uIdle);
  float travelingSheen = exp(-pow((vUv.x * 0.74 + vUv.y * 0.18) - (0.5 + 0.5 * sin(sheenTime)), 2.0) * 11.0);

  vec2 pointerDeltaUv = vUv - uPointer;
  float pointerDistance = length(pointerDeltaUv);
  float pointerSpeed = clamp(length(uPointerMotion) * 8.0, 0.0, 1.0);
  vec2 pointerDir = pointerSpeed > 0.001 ? normalize(uPointerMotion) : vec2(1.0, 0.0);
  float pointerGlow = exp(-pointerDistance * 5.0);
  float flowStreak = exp(-abs(dot(pointerDeltaUv, vec2(-pointerDir.y, pointerDir.x))) * 16.0)
    * exp(-max(dot(pointerDeltaUv, pointerDir), 0.0) * 5.0)
    * pointerSpeed;

  float shade = 0.78 + vHeight * 0.32 + vLight * 0.10;
  vec3 color = base * shade;
  color += nap;
  color += travelingSheen * (0.065 + (1.0 - darkChapter) * 0.10);
  color += pointerGlow * (0.035 + pointerSpeed * 0.055);
  color += flowStreak * (0.06 + (1.0 - darkChapter) * 0.04);

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
  const pointerMotionTarget = useRef(new THREE.Vector2(0, 0));
  const previousPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const lastScroll = useRef(0);
  const lastTime = useRef(0);
  const lastScrollAt = useRef(0);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uIdle: { value: 1 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerMotion: { value: new THREE.Vector2(0, 0) },
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
      const dt = lastTime.current > 0 ? Math.max(now - lastTime.current, 12) : 16;
      const dy = window.scrollY - lastScroll.current;
      velocityTarget.current = THREE.MathUtils.clamp((dy / dt) * 0.09, -1, 1);
      if (Math.abs(dy) > 0.5) lastScrollAt.current = now;
      lastScroll.current = window.scrollY;
      lastTime.current = now;
    };

    const onPointer = (event: PointerEvent) => {
      if (quality === "low") return;

      const nextX = event.clientX / Math.max(window.innerWidth, 1);
      const nextY = 1 - event.clientY / Math.max(window.innerHeight, 1);

      pointerMotionTarget.current.set(
        THREE.MathUtils.clamp((nextX - previousPointer.current.x) * 3.6, -0.18, 0.18),
        THREE.MathUtils.clamp((nextY - previousPointer.current.y) * 3.6, -0.18, 0.18),
      );

      pointerTarget.current.set(nextX, nextY);
      previousPointer.current.set(nextX, nextY);
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
      8.5,
      delta,
    );
    velocityTarget.current *= Math.pow(0.002, delta);

    const idleTarget = performance.now() - lastScrollAt.current > 120 ? 1 : 0.18;
    material.uniforms.uIdle.value = THREE.MathUtils.damp(
      material.uniforms.uIdle.value,
      idleTarget,
      7.2,
      delta,
    );

    material.uniforms.uPointer.value.lerp(
      pointerTarget.current,
      1 - Math.exp(-5.4 * delta),
    );

    material.uniforms.uPointerMotion.value.lerp(
      pointerMotionTarget.current,
      1 - Math.exp(-10.0 * delta),
    );
    pointerMotionTarget.current.multiplyScalar(Math.pow(0.0008, delta));

    material.uniforms.uEntrance.value = THREE.MathUtils.damp(
      material.uniforms.uEntrance.value,
      1,
      1.6,
      delta,
    );

    const scroll = material.uniforms.uScroll.value;
    const velocity = material.uniforms.uVelocity.value;
    const pointer = material.uniforms.uPointer.value;

    const idleBlend = material.uniforms.uIdle.value;
    const idleX =
      Math.sin(time * (0.22 + idleBlend * 0.16)) * (0.145 + idleBlend * 0.032) +
      Math.sin(time * (0.39 + idleBlend * 0.19)) * (0.058 + idleBlend * 0.015);
    const idleY = Math.cos(time * (0.19 + idleBlend * 0.14)) * (0.102 + idleBlend * 0.022);
    const pointerX = quality === "low" ? 0 : (pointer.x - 0.5) * 0.24;
    const pointerY = quality === "low" ? 0 : (pointer.y - 0.5) * 0.17;

    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, idleX + pointerX, 2.0, delta);
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, idleY + pointerY, 2.0, delta);
    mesh.current.position.z = THREE.MathUtils.damp(mesh.current.position.z, -0.48 + scroll * 0.12, 2.0, delta);
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -0.28 + scroll * 0.12 - velocity * 0.03, 2.1, delta);
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, pointerX * 0.16 + velocity * 0.018, 2.0, delta);
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, -0.08 + Math.sin(time * (0.16 + idleBlend * 0.11)) * (0.029 + idleBlend * 0.010) + scroll * 0.10, 2.0, delta);

    const scale = 1.42 + Math.sin(time * (0.24 + idleBlend * 0.13)) * (0.021 + idleBlend * 0.007) + Math.abs(velocity) * 0.016;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, scale, 2.4, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, scale * 0.94, 2.4, delta);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, idleX * 0.16 + pointerX * 0.22, 1.9, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, idleY * 0.16 + pointerY * 0.18, 1.9, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.25 - scroll * 0.18 + Math.sin(time * (0.18 + idleBlend * 0.10)) * (0.058 + idleBlend * 0.018), 1.7, delta);
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
    points.current.rotation.z += delta * 0.03;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.17) * 0.055;
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

  useEffect(() => {
    if (!reducedMotion) return;
    const win = window as Window & { __wvV2SceneReady?: boolean };
    win.__wvV2SceneReady = true;
    window.dispatchEvent(new Event("wv:v2-scene-ready"));
  }, [reducedMotion]);

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
