"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;

  if (window.innerWidth < 720 || memory <= 4 || cores <= 4) return "low";
  if (window.innerWidth >= 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function createDrape(quality: QualityTier) {
  const xSegments = quality === "high" ? 90 : quality === "medium" ? 64 : 38;
  const ySegments = quality === "high" ? 110 : quality === "medium" ? 76 : 46;
  const geometry = new THREE.PlaneGeometry(4.8, 5.8, xSegments, ySegments);
  const positions = geometry.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z =
      Math.sin(x * 1.38 + y * 0.12) * 0.18 +
      Math.sin(y * 0.82 - x * 0.18) * 0.09 +
      Math.sin((x + y) * 0.48) * 0.055;

    positions.setZ(i, z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function SignatureMaterial({ quality }: { quality: QualityTier }) {
  const group = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));

  const geometry = useMemo(() => createDrape(quality), [quality]);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e4ddd1",
        roughness: 0.64,
        metalness: 0,
        sheen: 1,
        sheenColor: new THREE.Color("#fff7e9"),
        sheenRoughness: 0.45,
        clearcoat: 0.08,
        clearcoatRoughness: 0.62,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const px = (pointer.current.x - 0.5) * (quality === "low" ? 0 : 0.16);
    const py = (pointer.current.y - 0.5) * (quality === "low" ? 0 : 0.10);

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -0.22 + py,
      0.025,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      0.18 + px,
      0.025,
    );
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.018;

    if (keyLight.current) {
      keyLight.current.position.x = Math.sin(clock.elapsedTime * 0.18) * 2.4;
      keyLight.current.position.y = 2.2 + Math.cos(clock.elapsedTime * 0.14) * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={1.05} color="#eee7dc" />
      <directionalLight position={[-4, 5, 5]} intensity={1.7} color="#fff4df" />
      <pointLight ref={keyLight} position={[1, 2.4, 4]} intensity={1.55} color="#ffffff" />
      <group ref={group} position={[0.15, 0, 0]}>
        <mesh geometry={geometry} material={material} />
      </group>
    </>
  );
}

export default function GlobalThreeScene() {
  const layer = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<QualityTier>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReducedMotion(media.matches);
      setQuality(getQualityTier());
    };

    const updateVisibility = () => {
      if (!layer.current) return;
      const fadeDistance = Math.max(window.innerHeight * 0.78, 520);
      const opacity = THREE.MathUtils.clamp(1 - window.scrollY / fadeDistance, 0, 1);
      layer.current.style.opacity = opacity.toFixed(3);
      layer.current.style.visibility = opacity < 0.01 ? "hidden" : "visible";
    };

    update();
    updateVisibility();
    media.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  if (reducedMotion) {
    return <div className="signature-fallback" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.45] : quality === "medium" ? [1, 1.2] : [1, 1];

  return (
    <div ref={layer} className="three-layer signature-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42, near: 0.1, far: 30 }}
        dpr={dpr}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: quality !== "low",
            alpha: true,
            powerPreference: "high-performance",
          });
          await renderer.init();
          renderer.setClearColor("#e6e0d5", 0);
          return renderer as never;
        }}
      >
        <SignatureMaterial quality={quality} />
      </Canvas>
    </div>
  );
}
