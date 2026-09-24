"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

const PATHS = [
  [[0.68, 0.38], [0.80, 0.62]],
  [[0.17, 0.38], [0.40, 0.58]],
  [[0.63, 0.36], [0.84, 0.60]],
  [[0.17, 0.42], [0.40, 0.62]],
  [[0.64, 0.38], [0.84, 0.58]],
  [[0.36, 0.40], [0.66, 0.58]],
  [[0.66, 0.36], [0.78, 0.60]],
  [[0.18, 0.40], [0.34, 0.58]],
  [[0.62, 0.38], [0.76, 0.60]],
  [[0.42, 0.42], [0.58, 0.58]],
  [[0.24, 0.38], [0.38, 0.56]],
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

function Lens({ quality }: { quality: QualityTier }) {
  const group = useRef<THREE.Group>(null);
  const stageTarget = useRef(0);
  const progressTarget = useRef(0);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const compareTarget = useRef(0.52);
  const compareMix = useRef(0);
  const { viewport } = useThree();

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f7f3e9"),
        transmission: quality === "low" ? 0.45 : 0.82,
        thickness: quality === "high" ? 0.65 : 0.35,
        ior: 1.38,
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [quality],
  );

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    const onCompare = (event: Event) => {
      const value = (event as CustomEvent<{ value?: number }>).detail?.value;
      if (typeof value === "number") {
        compareTarget.current = THREE.MathUtils.clamp(value, 0, 1);
        compareMix.current = 1;
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("whitevelvet:compare", onCompare);

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-lens-stage]"))
        .map((element) => {
          const stage = Number(element.dataset.lensStage ?? 0);
          return ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onEnter: () => { stageTarget.current = stage; if (stage !== 5) compareMix.current = 0; },
            onEnterBack: () => { stageTarget.current = stage; if (stage !== 5) compareMix.current = 0; },
            onUpdate: (self) => {
              if (!self.isActive) return;
              stageTarget.current = stage;
              progressTarget.current = self.progress;
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
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("whitevelvet:compare", onCompare);
      glass.dispose();
    };
  }, [glass]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const stage = THREE.MathUtils.clamp(Math.round(stageTarget.current), 0, PATHS.length - 1);
    const path = PATHS[stage];
    let progress = THREE.MathUtils.clamp(progressTarget.current, 0, 1);

    if (stage === 5 && compareMix.current > 0.01) {
      progress = THREE.MathUtils.lerp(progress, compareTarget.current, compareMix.current);
      compareMix.current = THREE.MathUtils.lerp(compareMix.current, 0.92, 0.04);
    }

    const xBase = THREE.MathUtils.lerp(path[0][0], path[1][0], progress);
    const yBase = THREE.MathUtils.lerp(path[0][1], path[1][1], progress);

    const pointerInfluence = quality === "low" ? 0 : 0.055;
    const x = THREE.MathUtils.clamp(xBase + (pointer.current.x - 0.5) * pointerInfluence, 0.08, 0.92);
    const y = THREE.MathUtils.clamp(yBase + (pointer.current.y - 0.5) * pointerInfluence, 0.12, 0.88);

    const worldX = (x - 0.5) * viewport.width;
    const worldY = -(y - 0.5) * viewport.height;
    const scale = Math.min(viewport.width, viewport.height) * (quality === "low" ? 0.115 : 0.145);

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, worldX, 0.07);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, worldY, 0.07);
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.34) * 0.055;
    group.current.rotation.x = 0.08 + Math.sin(clock.elapsedTime * 0.22) * 0.035;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.06);

    document.documentElement.style.setProperty("--lens-x", `${(x * 100).toFixed(2)}%`);
    document.documentElement.style.setProperty("--lens-y", `${(y * 100).toFixed(2)}%`);
  });

  return (
    <group ref={group}>
      <mesh material={glass}>
        <circleGeometry args={[1, quality === "high" ? 96 : 64]} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <ringGeometry args={[0.92, 1.02, quality === "high" ? 96 : 64]} />
        <meshStandardMaterial color="#f4efe5" roughness={0.22} metalness={0.18} transparent opacity={0.82} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <torusGeometry args={[1.0, 0.018, 12, quality === "high" ? 96 : 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.07]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.012, 1.82]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </mesh>
    </group>
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
    return <div className="lens-fallback" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];

  return (
    <div className="three-layer lens-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={dpr}
        gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.7} color="#f7f0e4" />
        <directionalLight position={[-4, 5, 6]} intensity={2.1} color="#fff8e8" />
        <pointLight position={[3, -2, 5]} intensity={0.8} color="#dfe8ea" />
        <Lens quality={quality} />
      </Canvas>
    </div>
  );
}
