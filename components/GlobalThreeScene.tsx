"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  void main() {
    vUv = uv;
    vec3 p = position;

    float scrollWave = uScroll * 7.5;
    float waveA = sin(p.x * 1.35 + uTime * 0.28 + scrollWave) * 0.22;
    float waveB = sin(p.y * 1.7 - uTime * 0.18 - scrollWave * 0.45) * 0.12;
    float waveC = sin((p.x + p.y) * 1.1 + uTime * 0.12) * 0.08;
    float pointerLift = exp(-distance(uv, uPointer) * 5.0) * 0.16;

    p.z += waveA + waveB + waveC + pointerLift;
    p.x += sin(p.y * 0.72 + uScroll * 4.0) * 0.08;
    p.y += cos(p.x * 0.56 - uScroll * 3.0) * 0.06;
    vFold = p.z;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uScroll;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    vec3 lightDir = normalize(vec3(-0.55, 0.72, 0.85));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float velvet = pow(1.0 - abs(dot(normal, normalize(vec3(0.0, 0.0, 1.0)))), 2.2);
    float thread = sin(vUv.y * 620.0) * 0.012 + sin(vUv.x * 330.0) * 0.006;

    vec3 ivory = vec3(0.93, 0.91, 0.86);
    vec3 silver = vec3(0.73, 0.75, 0.76);
    vec3 midnight = vec3(0.055, 0.075, 0.085);

    float sectionMix = smoothstep(0.36, 0.88, uScroll);
    vec3 base = mix(ivory, silver, smoothstep(-0.18, 0.35, vFold));
    base = mix(base, midnight, sectionMix * 0.34);

    float vignette = smoothstep(0.95, 0.28, distance(vUv, vec2(0.5)));
    vec3 color = base * (0.48 + diffuse * 0.7) + velvet * 0.28 + thread;
    color += vignette * 0.035;

    float alpha = 0.82;
    gl_FragColor = vec4(color, alpha);
  }
`;

function Fabric({ lowPower = false }: { lowPower?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const scroll = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth;
      pointer.current.y = 1 - event.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scroll.current = window.scrollY / max;
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      material.dispose();
    };
  }, [material]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScroll.value += (scroll.current - material.uniforms.uScroll.value) * 0.035;
    material.uniforms.uPointer.value.lerp(pointer.current, 0.04);

    const s = material.uniforms.uScroll.value;
    mesh.current.rotation.z = -0.18 + s * 0.82;
    mesh.current.rotation.x = -0.34 + Math.sin(s * Math.PI * 2) * 0.12;
    mesh.current.position.x = Math.sin(s * 5.2) * 0.75;
    mesh.current.position.y = Math.cos(s * 4.4) * 0.36;
    mesh.current.position.z = -0.55 + Math.sin(s * 3.1) * 0.22;
  });

  return (
    <mesh ref={mesh} scale={[1.42, 1.2, 1]}>
      <planeGeometry args={[8.8, 7.2, lowPower ? 72 : 120, lowPower ? 56 : 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Threads() {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    return [-1.8, -0.8, 0.2, 1.1].map((offset, index) => {
      const pts = Array.from({ length: 28 }, (_, i) => {
        const t = i / 27;
        return new THREE.Vector3(
          -4.3 + t * 8.6,
          offset + Math.sin(t * Math.PI * (2 + index * 0.2)) * 0.22,
          -0.7 + Math.sin(t * 7 + index) * 0.08,
        );
      });
      return new THREE.CatmullRomCurve3(pts);
    });
  }, []);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, -0.2]}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 96, 0.008 + i * 0.002, 5, false]} />
          <meshBasicMaterial color="#f6f2e8" transparent opacity={0.23} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <Fabric lowPower={lowPower} />
      {!lowPower && <Threads />}
    </>
  );
}

export default function GlobalThreeScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    const nav = navigator as Navigator & { deviceMemory?: number };
    setLowPower((nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reducedMotion) {
    return <div className="three-fallback" aria-hidden="true" />;
  }

  return (
    <div className="three-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.15], fov: 44 }}
        dpr={lowPower ? [1, 1.15] : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene lowPower={lowPower} />
      </Canvas>
    </div>
  );
}
