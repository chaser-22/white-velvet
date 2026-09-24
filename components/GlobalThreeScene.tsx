"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

const CAMERA_POSITIONS = [
  [6.7, 3.2, 8.6],
  [2.7, 0.4, 3.6],
  [1.6, 2.5, 3.0],
  [4.2, 1.15, 2.5],
  [-1.8, 0.7, 4.2],
  [6.2, 3.1, 8.2],
  [3.6, 2.3, 7.2],
  [0.0, 2.0, 7.5],
  [0.0, 0.9, 5.8],
  [5.0, 2.8, 8.0],
  [6.5, 3.4, 8.8],
] as const;

const CAMERA_TARGETS = [
  [0.0, -0.25, -1.5],
  [-1.55, -0.55, -2.65],
  [0.0, -1.42, -0.35],
  [0.6, -1.42, -1.0],
  [3.15, -0.65, -2.7],
  [0.0, -0.25, -1.5],
  [0.0, -0.2, -1.6],
  [0.0, -0.15, -1.8],
  [0.0, -0.25, -2.0],
  [0.0, -0.15, -1.6],
  [0.0, -0.15, -1.8],
] as const;

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.innerWidth < 720 || memory <= 4 || cores <= 4) return "low";
  if (window.innerWidth >= 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function lerpTuple(a: readonly number[], b: readonly number[], t: number) {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  ] as const;
}

function Room({ quality }: { quality: QualityTier }) {
  const stageTarget = useRef(0);
  const localTarget = useRef(0);

  const sofaClean = useRef(0);
  const rugClean = useRef(0);
  const floorClean = useRef(0);
  const travelClean = useRef(0);

  const sofaGroup = useRef<THREE.Group>(null);
  const travelGroup = useRef<THREE.Group>(null);
  const cleanLight = useRef<THREE.PointLight>(null);
  const dustPoints = useRef<THREE.Points>(null);

  const sofaMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8f8a81", roughness: 0.95 }), []);
  const sofaStainMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#5c5145", transparent: true, opacity: 0.34, depthWrite: false }), []);
  const rugMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#817b6d", roughness: 1 }), []);
  const rugStainMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#554d40", transparent: true, opacity: 0.30, depthWrite: false }), []);
  const floorMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#7c756b", roughness: 0.78, metalness: 0.02, clearcoat: 0.08, clearcoatRoughness: 0.55 }), []);
  const travelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#676b69", roughness: 0.92 }), []);
  const travelStainMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#474b49", transparent: true, opacity: 0.28, depthWrite: false }), []);
  const reflectionMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#fff9ea", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), []);
  const dustMaterial = useMemo(() => new THREE.PointsMaterial({ color: "#f8f0dc", size: quality === "low" ? 0.035 : 0.025, transparent: true, opacity: 0.28, depthWrite: false }), [quality]);

  const dustGeometry = useMemo(() => {
    const count = quality === "high" ? 90 : quality === "medium" ? 56 : 28;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(count - 1, 1);
      positions[i * 3] = -4.7 + Math.sin(i * 12.9898) * 1.1;
      positions[i * 3 + 1] = -0.8 + ((i * 37) % count) / count * 5.3;
      positions[i * 3 + 2] = -3.8 + t * 7.0 + Math.cos(i * 4.31) * 0.45;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [quality]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-room-stage]"))
        .map((element) => {
          const stage = Number(element.dataset.roomStage ?? 0);
          return ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onEnter: () => { stageTarget.current = stage; },
            onEnterBack: () => { stageTarget.current = stage; },
            onUpdate: (self) => {
              if (!self.isActive) return;
              stageTarget.current = stage;
              localTarget.current = self.progress;
            },
          });
        });

      ScrollTrigger.refresh();
      cleanup = () => triggers.forEach((trigger) => trigger.kill());
    };

    void setup();

    return () => {
      disposed = true;
      cleanup();
      sofaMaterial.dispose();
      sofaStainMaterial.dispose();
      rugMaterial.dispose();
      rugStainMaterial.dispose();
      floorMaterial.dispose();
      travelMaterial.dispose();
      travelStainMaterial.dispose();
      reflectionMaterial.dispose();
      dustMaterial.dispose();
      dustGeometry.dispose();
    };
  }, [sofaMaterial, sofaStainMaterial, rugMaterial, rugStainMaterial, floorMaterial, travelMaterial, travelStainMaterial, reflectionMaterial, dustMaterial, dustGeometry]);

  useFrame(({ camera, clock }) => {
    const stage = stageTarget.current;
    const local = localTarget.current;

    const cleanTarget = (chapter: number) => stage > chapter ? 1 : stage < chapter ? 0 : local;
    sofaClean.current = THREE.MathUtils.lerp(sofaClean.current, cleanTarget(1), 0.055);
    rugClean.current = THREE.MathUtils.lerp(rugClean.current, cleanTarget(2), 0.055);
    floorClean.current = THREE.MathUtils.lerp(floorClean.current, cleanTarget(3), 0.055);
    travelClean.current = THREE.MathUtils.lerp(travelClean.current, cleanTarget(4), 0.055);

    sofaMaterial.color.lerpColors(new THREE.Color("#837c72"), new THREE.Color("#d8cfc1"), sofaClean.current);
    sofaMaterial.roughness = THREE.MathUtils.lerp(0.98, 0.74, sofaClean.current);
    sofaStainMaterial.opacity = (1 - sofaClean.current) * 0.34;

    rugMaterial.color.lerpColors(new THREE.Color("#746d5f"), new THREE.Color("#cfc3aa"), rugClean.current);
    rugMaterial.roughness = THREE.MathUtils.lerp(1, 0.7, rugClean.current);
    rugStainMaterial.opacity = (1 - rugClean.current) * 0.30;

    floorMaterial.color.lerpColors(new THREE.Color("#706960"), new THREE.Color("#a89e8d"), floorClean.current);
    floorMaterial.roughness = THREE.MathUtils.lerp(0.82, 0.17, floorClean.current);
    floorMaterial.clearcoat = THREE.MathUtils.lerp(0.06, 0.72, floorClean.current);
    floorMaterial.clearcoatRoughness = THREE.MathUtils.lerp(0.7, 0.08, floorClean.current);
    reflectionMaterial.opacity = floorClean.current * 0.12;

    travelMaterial.color.lerpColors(new THREE.Color("#5a5d5b"), new THREE.Color("#9da09a"), travelClean.current);
    travelMaterial.roughness = THREE.MathUtils.lerp(0.96, 0.68, travelClean.current);
    travelStainMaterial.opacity = (1 - travelClean.current) * 0.28;

    const overallClean = (sofaClean.current + rugClean.current + floorClean.current + travelClean.current) / 4;
    dustMaterial.opacity = (1 - overallClean) * 0.30;

    if (sofaGroup.current) {
      sofaGroup.current.position.y = -0.78 + sofaClean.current * 0.035;
    }
    if (travelGroup.current) {
      travelGroup.current.rotation.y = -0.12 + travelClean.current * 0.045;
    }

    if (cleanLight.current) {
      const activeProgress =
        stage === 1 ? sofaClean.current :
        stage === 2 ? rugClean.current :
        stage === 3 ? floorClean.current :
        stage === 4 ? travelClean.current : 0;
      cleanLight.current.intensity = stage >= 1 && stage <= 4 ? (quality === "low" ? 0.55 : 1.1) : 0.18;
      cleanLight.current.position.x = -4.5 + activeProgress * 9.0;
      cleanLight.current.position.y = stage === 3 ? -0.45 : 0.9;
      cleanLight.current.position.z = stage === 4 ? -2.4 : -0.5;
    }

    const currentStage = THREE.MathUtils.clamp(stage, 0, CAMERA_POSITIONS.length - 1);
    const from = Math.floor(currentStage);
    const to = Math.min(from + 1, CAMERA_POSITIONS.length - 1);
    const transition = THREE.MathUtils.smoothstep(local, 0.58, 1);
    const position = lerpTuple(CAMERA_POSITIONS[from], CAMERA_POSITIONS[to], transition * 0.28);
    const target = lerpTuple(CAMERA_TARGETS[from], CAMERA_TARGETS[to], transition * 0.28);

    camera.position.lerp(new THREE.Vector3(...position), 0.045);
    const lookTarget = new THREE.Vector3(...target);
    const currentDirection = new THREE.Vector3();
    camera.getWorldDirection(currentDirection);
    const currentTarget = camera.position.clone().add(currentDirection.multiplyScalar(8));
    currentTarget.lerp(lookTarget, 0.055);
    camera.lookAt(currentTarget);

    if (dustPoints.current) {
      dustPoints.current.position.y = Math.sin(clock.elapsedTime * 0.18) * 0.10;
      dustPoints.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.025;
    }
  });

  const wallMaterial = <meshStandardMaterial color="#e7e0d4" roughness={0.93} />;
  const darkMaterial = <meshStandardMaterial color="#24292a" roughness={0.78} />;

  return (
    <>
      <ambientLight intensity={0.88} color="#efe7d8" />
      <directionalLight
        position={[-4, 7, 5]}
        intensity={2.2}
        color="#fff4dd"
        castShadow={quality !== "low"}
        shadow-mapSize-width={quality === "high" ? 2048 : 1024}
        shadow-mapSize-height={quality === "high" ? 2048 : 1024}
      />
      <pointLight position={[5, 2, 1]} intensity={0.75} color="#dbe8ea" />
      <pointLight ref={cleanLight} position={[-4, 1, -1]} intensity={0.3} distance={8} color="#fff2d8" />

      <group>
        <mesh position={[0, 2.3, -5.2]} receiveShadow>
          <boxGeometry args={[16, 7.8, 0.16]} />
          {wallMaterial}
        </mesh>
        <mesh position={[-7.8, 2.3, -0.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[9, 7.8, 0.16]} />
          {wallMaterial}
        </mesh>
        <mesh position={[0, -1.52, -0.5]} rotation={[0, 0, 0]} receiveShadow material={floorMaterial}>
          <boxGeometry args={[16, 0.12, 11]} />
        </mesh>

        <mesh position={[-4.9, 1.7, -5.0]}>
          <boxGeometry args={[0.12, 4.1, 0.18]} />
          {darkMaterial}
        </mesh>
        <mesh position={[-2.5, 1.7, -5.0]}>
          <boxGeometry args={[0.12, 4.1, 0.18]} />
          {darkMaterial}
        </mesh>
        <mesh position={[-3.7, 3.72, -5.0]}>
          <boxGeometry args={[2.5, 0.12, 0.18]} />
          {darkMaterial}
        </mesh>

        <group ref={sofaGroup} position={[-1.55, -0.78, -2.72]}>
          <mesh castShadow receiveShadow material={sofaMaterial} position={[0, 0.0, 0]}>
            <boxGeometry args={[3.75, 0.62, 1.45]} />
          </mesh>
          <mesh castShadow material={sofaMaterial} position={[0, 0.88, -0.55]} rotation={[-0.05, 0, 0]}>
            <boxGeometry args={[3.75, 1.4, 0.48]} />
          </mesh>
          <mesh castShadow material={sofaMaterial} position={[-1.88, 0.46, 0]}>
            <boxGeometry args={[0.42, 1.15, 1.52]} />
          </mesh>
          <mesh castShadow material={sofaMaterial} position={[1.88, 0.46, 0]}>
            <boxGeometry args={[0.42, 1.15, 1.52]} />
          </mesh>
          {[-1.15, 0, 1.15].map((x) => (
            <mesh key={x} castShadow material={sofaMaterial} position={[x, 0.42, 0.15]}>
              <boxGeometry args={[1.03, 0.26, 1.10]} />
            </mesh>
          ))}
          <mesh position={[0.45, 0.56, 0.72]} rotation={[-Math.PI / 2, 0, 0]} material={sofaStainMaterial}>
            <circleGeometry args={[0.34, 30]} />
          </mesh>
          <mesh position={[-0.85, 0.56, 0.72]} rotation={[-Math.PI / 2, 0, 0]} material={sofaStainMaterial}>
            <circleGeometry args={[0.18, 28]} />
          </mesh>
        </group>

        <group position={[0.0, -1.43, -0.15]}>
          <mesh receiveShadow material={rugMaterial} position={[0, 0, 0]}>
            <boxGeometry args={[5.2, 0.06, 3.25]} />
          </mesh>
          <mesh position={[-0.85, 0.035, 0.25]} rotation={[-Math.PI / 2, 0, 0]} material={rugStainMaterial}>
            <circleGeometry args={[0.48, 40]} />
          </mesh>
          <mesh position={[1.15, 0.035, -0.45]} rotation={[-Math.PI / 2, 0, 0]} material={rugStainMaterial}>
            <circleGeometry args={[0.30, 36]} />
          </mesh>
          {Array.from({ length: 13 }, (_, i) => (
            <mesh key={i} position={[-2.35 + i * 0.39, 0.045, 0]} material={rugStainMaterial}>
              <boxGeometry args={[0.012, 0.008, 3.0]} />
            </mesh>
          ))}
        </group>

        <group position={[0.7, -1.22, 0.45]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.6, 20]} />
            {darkMaterial}
          </mesh>
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.82, 0.82, 0.09, 48]} />
            <meshStandardMaterial color="#262a2b" roughness={0.5} />
          </mesh>
        </group>

        <group ref={travelGroup} position={[3.2, -0.72, -2.82]} rotation={[0, -0.12, 0]}>
          <mesh castShadow material={travelMaterial} position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 0.45, 1.22]} />
          </mesh>
          <mesh castShadow material={travelMaterial} position={[0, 0.88, -0.48]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[1.6, 1.35, 0.36]} />
          </mesh>
          <mesh position={[0.28, 0.28, 0.63]} rotation={[-Math.PI / 2, 0, 0]} material={travelStainMaterial}>
            <circleGeometry args={[0.25, 30]} />
          </mesh>
        </group>

        <mesh position={[1.1, -1.39, -1.55]} rotation={[-Math.PI / 2, 0, 0]} material={reflectionMaterial}>
          <planeGeometry args={[6.8, 3.7]} />
        </mesh>

        <points ref={dustPoints} geometry={dustGeometry} material={dustMaterial} />
      </group>
    </>
  );
}

export default function GlobalThreeScene() {
  const [quality, setQuality] = useState<QualityTier>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      setQuality(getQualityTier());
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
    return <div className="three-fallback room-fallback" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.55] : quality === "medium" ? [1, 1.3] : [1, 1];

  return (
    <div className="three-layer white-room-canvas" aria-hidden="true">
      <Canvas
        shadows={quality !== "low"}
        camera={{ position: [6.7, 3.2, 8.6], fov: 42, near: 0.1, far: 40 }}
        dpr={dpr}
        gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
        fallback={<div className="three-fallback room-fallback" />}
      >
        <color attach="background" args={["#dcd6cb"]} />
        <fog attach="fog" args={["#dcd6cb", 10, 24]} />
        <Room quality={quality} />
      </Canvas>
      <div className="room-grade" />
    </div>
  );
}
