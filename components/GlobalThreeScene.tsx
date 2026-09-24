"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

type InstanceSeed = {
  dirtyPosition: THREE.Vector3;
  purePosition: THREE.Vector3;
  dirtyQuaternion: THREE.Quaternion;
  pureQuaternion: THREE.Quaternion;
  dirtyScale: THREE.Vector3;
  pureScale: THREE.Vector3;
  phase: number;
};

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const width = window.innerWidth;

  if (width < 720 || memory <= 4 || cores <= 4) return "low";
  if (width >= 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function createSeeds(count: number): InstanceSeed[] {
  const columns = Math.ceil(Math.sqrt(count * 1.35));
  const rows = Math.ceil(count / columns);
  const seeds: InstanceSeed[] = [];

  for (let i = 0; i < count; i += 1) {
    const a = Math.sin((i + 1) * 12.9898) * 43758.5453;
    const b = Math.sin((i + 1) * 78.233) * 12515.873;
    const c = Math.sin((i + 1) * 41.173) * 31917.731;
    const ra = a - Math.floor(a);
    const rb = b - Math.floor(b);
    const rc = c - Math.floor(c);

    const col = i % columns;
    const row = Math.floor(i / columns);
    const pureX = (col - (columns - 1) / 2) * 0.235;
    const pureY = ((rows - 1) / 2 - row) * 0.185;

    const dirtyPosition = new THREE.Vector3(
      (ra - 0.5) * 8.8,
      (rb - 0.5) * 6.2,
      (rc - 0.5) * 6.8,
    );

    const purePosition = new THREE.Vector3(
      pureX,
      pureY,
      Math.sin(col * 0.28) * 0.045,
    );

    const dirtyEuler = new THREE.Euler(
      (ra - 0.5) * Math.PI * 1.6,
      (rb - 0.5) * Math.PI * 1.6,
      (rc - 0.5) * Math.PI * 1.7,
    );

    const pureEuler = new THREE.Euler(0, 0, 0);

    seeds.push({
      dirtyPosition,
      purePosition,
      dirtyQuaternion: new THREE.Quaternion().setFromEuler(dirtyEuler),
      pureQuaternion: new THREE.Quaternion().setFromEuler(pureEuler),
      dirtyScale: new THREE.Vector3(
        0.55 + ra * 1.45,
        0.55 + rb * 1.55,
        0.55 + rc * 1.65,
      ),
      pureScale: new THREE.Vector3(1, 1, 1),
      phase: ra * Math.PI * 2,
    });
  }

  return seeds;
}

function Matrix({ quality }: { quality: QualityTier }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const purityTarget = useRef(0.08);
  const purity = useRef(0.08);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const { scene, camera } = useThree();

  const count = quality === "high" ? 820 : quality === "medium" ? 520 : 280;
  const seeds = useMemo(() => createSeeds(count), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const dirtyColor = useMemo(() => new THREE.Color("#343b3a"), []);
  const pureColor = useMemo(() => new THREE.Color("#d9d4ca"), []);
  const backgroundDirty = useMemo(() => new THREE.Color("#121817"), []);
  const backgroundPure = useMemo(() => new THREE.Color("#eee9df"), []);
  const fogColor = useMemo(() => new THREE.Color("#1b2220"), []);
  const cleanFogColor = useMemo(() => new THREE.Color("#eee9df"), []);

  useEffect(() => {
    scene.background = backgroundDirty.clone();
    scene.fog = new THREE.Fog(backgroundDirty.clone(), 3.2, 9.5);

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    window.addEventListener("pointermove", onPointer, { passive: true });

    let disposed = false;
    let cleanup = () => {};

    const setupScroll = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-purity]")).map((element) => {
        const target = Number(element.dataset.purity ?? 0);
        return ScrollTrigger.create({
          trigger: element,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => { purityTarget.current = target; },
          onEnterBack: () => { purityTarget.current = target; },
          onUpdate: (self) => {
            if (!self.isActive) return;
            purityTarget.current = target;
          },
        });
      });

      ScrollTrigger.refresh();
      cleanup = () => triggers.forEach((trigger) => trigger.kill());
    };

    void setupScroll();

    return () => {
      disposed = true;
      cleanup();
      window.removeEventListener("pointermove", onPointer);
      scene.fog = null;
    };
  }, [backgroundDirty, scene]);

  useFrame(({ clock }) => {
    if (!mesh.current || document.hidden) return;

    purity.current = THREE.MathUtils.lerp(purity.current, purityTarget.current, 0.045);
    const p = THREE.MathUtils.clamp(purity.current, 0, 1);
    const eased = THREE.MathUtils.smoothstep(p, 0, 1);
    const disorder = 1 - eased;

    const pointerX = (pointer.current.x - 0.5) * disorder;
    const pointerY = (pointer.current.y - 0.5) * disorder;

    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i];
      tempPosition.lerpVectors(seed.dirtyPosition, seed.purePosition, eased);

      const flutter = disorder * disorder * (quality === "low" ? 0.025 : 0.055);
      tempPosition.x += Math.sin(clock.elapsedTime * 0.35 + seed.phase * 2.1) * flutter;
      tempPosition.y += Math.cos(clock.elapsedTime * 0.29 + seed.phase * 1.7) * flutter;
      tempPosition.z += Math.sin(clock.elapsedTime * 0.23 + seed.phase) * flutter * 1.8;

      const influence = Math.max(0, 1 - tempPosition.length() / 6.5) * disorder * 0.32;
      tempPosition.x += pointerX * influence;
      tempPosition.y -= pointerY * influence;

      tempQuaternion.slerpQuaternions(seed.dirtyQuaternion, seed.pureQuaternion, eased);
      tempScale.lerpVectors(seed.dirtyScale, seed.pureScale, eased);

      dummy.position.copy(tempPosition);
      dummy.quaternion.copy(tempQuaternion);
      dummy.scale.copy(tempScale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;

    const material = mesh.current.material as THREE.MeshPhysicalMaterial;
    material.color.lerpColors(dirtyColor, pureColor, eased);
    material.roughness = THREE.MathUtils.lerp(0.88, 0.28, eased);
    material.metalness = THREE.MathUtils.lerp(0.02, 0.11, eased);
    material.clearcoat = THREE.MathUtils.lerp(0.0, 0.38, eased);
    material.clearcoatRoughness = THREE.MathUtils.lerp(0.65, 0.16, eased);

    if (scene.background instanceof THREE.Color) {
      scene.background.lerpColors(backgroundDirty, backgroundPure, eased);
    }

    if (scene.fog instanceof THREE.Fog) {
      fogColor.lerpColors(backgroundDirty, cleanFogColor, eased);
      scene.fog.color.copy(fogColor);
      scene.fog.near = THREE.MathUtils.lerp(2.2, 13, eased);
      scene.fog.far = THREE.MathUtils.lerp(7.4, 28, eased);
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerX * 0.28, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointerY * 0.20, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, THREE.MathUtils.lerp(4.6, 7.2, eased), 0.035);
    camera.lookAt(0, 0, 0);

    document.documentElement.style.setProperty("--purity", p.toFixed(3));
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.17, 0.10, 0.54]} />
      <meshPhysicalMaterial
        color="#343b3a"
        roughness={0.88}
        metalness={0.02}
        clearcoat={0}
        clearcoatRoughness={0.65}
      />
    </instancedMesh>
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
    return <div className="purity-fallback" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];

  return (
    <div className="three-layer purity-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 44, near: 0.1, far: 50 }}
        dpr={dpr}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: quality !== "low",
            alpha: false,
            powerPreference: "high-performance",
          });
          await renderer.init();
          renderer.setClearColor("#121817", 1);
          return renderer as never;
        }}
      >
        <ambientLight intensity={1.1} color="#d9d6cd" />
        <directionalLight position={[-5, 6, 7]} intensity={2.0} color="#fff3dc" />
        <directionalLight position={[5, -2, 4]} intensity={0.45} color="#cadad8" />
        <Matrix quality={quality} />
      </Canvas>
      <div className="purity-haze" />
      <div className="purity-grain" />
      <div className="purity-meter">
        <span>DIRTY</span>
        <i><b /></i>
        <span>PURE</span>
      </div>
    </div>
  );
}
