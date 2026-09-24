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

function TreatmentScene({ quality }: { quality: QualityTier }) {
  const stageTarget = useRef(0);
  const progressTarget = useRef(0);
  const stage = useRef(0);
  const progress = useRef(0);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));

  const tool = useRef<THREE.Group>(null);
  const toolHead = useRef<THREE.Group>(null);
  const dirtySurface = useRef<THREE.Mesh>(null);
  const cleanSurface = useRef<THREE.Mesh>(null);
  const fibers = useRef<THREE.InstancedMesh>(null);
  const stainA = useRef<THREE.Mesh>(null);
  const stainB = useRef<THREE.Mesh>(null);
  const polishDisc = useRef<THREE.Mesh>(null);

  const dirtyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#4a4c47", roughness: 0.95, metalness: 0.01, clearcoat: 0.02,
  }), []);
  const cleanMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#cfc6b7", roughness: 0.55, metalness: 0.03, clearcoat: 0.14,
  }), []);
  const stainMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#463a31", transparent: true, opacity: 0.4, depthWrite: false,
  }), []);
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d8d3c9", metalness: 0.7, roughness: 0.28,
  }), []);
  const darkMetal = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#202626", metalness: 0.4, roughness: 0.38,
  }), []);
  const fiberMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#b5a78f", roughness: 0.9, transparent: true, opacity: 0,
  }), []);

  const fiberSeeds = useMemo(() => {
    const count = quality === "high" ? 520 : quality === "medium" ? 330 : 160;
    const cols = Math.ceil(Math.sqrt(count * 1.35));
    const rows = Math.ceil(count / cols);
    return Array.from({ length: count }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = -2.45 + (col / Math.max(cols - 1, 1)) * 4.9;
      const y = -1.45 + (row / Math.max(rows - 1, 1)) * 2.9;
      const n = Math.abs(Math.sin((i + 1) * 91.733));
      return { x, y, n };
    });
  }, [quality]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        event.clientY / Math.max(window.innerHeight, 1),
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-treatment-stage]")).map((el) => {
        const s = Number(el.dataset.treatmentStage ?? 0);
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => { stageTarget.current = s; },
          onEnterBack: () => { stageTarget.current = s; },
          onUpdate: (self) => {
            if (!self.isActive) return;
            stageTarget.current = s;
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
      dirtyMat.dispose(); cleanMat.dispose(); stainMat.dispose(); metalMat.dispose(); darkMetal.dispose(); fiberMat.dispose();
    };
  }, [cleanMat, darkMetal, dirtyMat, fiberMat, metalMat, stainMat]);

  useFrame(({ camera, scene }) => {
    stage.current = THREE.MathUtils.lerp(stage.current, stageTarget.current, 0.055);
    progress.current = THREE.MathUtils.lerp(progress.current, progressTarget.current, 0.075);

    const s = stage.current;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const active = s >= 1 && s <= 4;
    const station = Math.round(s);
    const headX = THREE.MathUtils.lerp(-2.55, 2.55, p);

    if (tool.current) {
      tool.current.position.x = THREE.MathUtils.lerp(tool.current.position.x, active ? headX : -2.85, 0.09);
      tool.current.position.y = THREE.MathUtils.lerp(tool.current.position.y, station === 3 ? 0.08 : 0.26, 0.06);
      tool.current.position.z = THREE.MathUtils.lerp(tool.current.position.z, 0.48, 0.06);
    }
    if (toolHead.current) {
      const targetScale = station === 1 ? 1.0 : station === 2 ? 0.88 : station === 3 ? 1.14 : station === 4 ? 0.72 : 0.84;
      toolHead.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
    }
    if (polishDisc.current) {
      polishDisc.current.visible = station === 3;
      polishDisc.current.rotation.z -= 0.14;
    }

    const carpetWeight = 1 - THREE.MathUtils.smoothstep(Math.abs(s - 1), 0, 0.85);
    fiberMat.opacity = carpetWeight * 0.95;
    if (fibers.current) {
      fibers.current.visible = carpetWeight > 0.02;
      if (fibers.current.visible) {
        const dummy = new THREE.Object3D();
        fiberSeeds.forEach((seed, index) => {
          const normalizedX = (seed.x + 2.45) / 4.9;
          const cleaned = normalizedX <= p ? 1 : 0;
          const height = THREE.MathUtils.lerp(0.08 + seed.n * 0.05, 0.19 + seed.n * 0.04, cleaned);
          const tilt = THREE.MathUtils.lerp((seed.n - 0.5) * 0.9, (seed.n - 0.5) * 0.14, cleaned);

          dummy.position.set(seed.x, seed.y, 0.08 + height * 0.48);
          dummy.rotation.set(Math.PI / 2 + tilt, 0, seed.n * 0.6);
          dummy.scale.set(1, height / 0.18, 1);
          dummy.updateMatrix();
          fibers.current!.setMatrixAt(index, dummy.matrix);
        });
        fibers.current.instanceMatrix.needsUpdate = true;
      }
    }

    const dirtyColor = station === 1 ? "#6d6659" : station === 2 ? "#625b54" : station === 3 ? "#575a57" : station === 4 ? "#4a5150" : "#343a39";
    const cleanColor = station === 1 ? "#cfc1a5" : station === 2 ? "#c7c2b8" : station === 3 ? "#aaa69b" : station === 4 ? "#979e9a" : "#c8c3b9";
    dirtyMat.color.lerp(new THREE.Color(dirtyColor), 0.08);
    cleanMat.color.lerp(new THREE.Color(cleanColor), 0.08);

    dirtyMat.roughness = THREE.MathUtils.lerp(dirtyMat.roughness, station === 3 ? 0.78 : 0.94, 0.08);
    cleanMat.roughness = THREE.MathUtils.lerp(cleanMat.roughness, station === 3 ? 0.14 : station === 4 ? 0.5 : 0.58, 0.08);
    cleanMat.clearcoat = THREE.MathUtils.lerp(cleanMat.clearcoat, station === 3 ? 0.75 : 0.12, 0.08);
    cleanMat.clearcoatRoughness = THREE.MathUtils.lerp(cleanMat.clearcoatRoughness, station === 3 ? 0.08 : 0.35, 0.08);

    if (cleanSurface.current) {
      cleanSurface.current.scale.x = Math.max(p, 0.001);
      cleanSurface.current.position.x = -2.55 + (5.1 * p) * 0.5;
    }

    stainMat.opacity = THREE.MathUtils.lerp(
      stainMat.opacity,
      station === 2 ? Math.max(0, 0.42 - p * 0.54) : station === 4 ? Math.max(0, 0.24 - p * 0.28) : 0,
      0.1,
    );
    if (stainA.current) stainA.current.visible = station === 2 || station === 4;
    if (stainB.current) stainB.current.visible = station === 2 || station === 4;

    const targetRX = station === 3 ? -0.78 : station === 4 ? -0.28 : -0.10;
    const targetRY = station === 4 ? 0.18 : 0;
    [dirtySurface.current, cleanSurface.current].forEach((mesh) => {
      if (!mesh) return;
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRX, 0.055);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRY, 0.055);
    });

    const pointerX = (pointer.current.x - 0.5) * (quality === "low" ? 0 : 0.22);
    const pointerY = (pointer.current.y - 0.5) * (quality === "low" ? 0 : 0.12);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointerY + (station === 3 ? 0.6 : 0.1), 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, station >= 5 ? 7.8 : 6.1, 0.035);
    camera.lookAt(0, 0, 0);

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, station >= 5 ? 12 : 4.2, 0.04);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, station >= 5 ? 24 : 11.5, 0.04);
    }

    document.documentElement.style.setProperty("--treatment-progress", p.toFixed(3));
  });

  return (
    <>
      <fog attach="fog" args={["#d9d5cb", 4.2, 11.5]} />
      <group position={[0, 0.05, 0]}>
        <mesh ref={dirtySurface} material={dirtyMat}>
          <boxGeometry args={[5.1, 3.0, 0.12, 38, 24, 2]} />
        </mesh>
        <mesh ref={cleanSurface} material={cleanMat} position={[-2.55, 0, 0.075]} scale={[0.001, 1, 1]}>
          <boxGeometry args={[5.1, 3.0, 0.06, 38, 24, 1]} />
        </mesh>
        <mesh ref={stainA} position={[-0.65, 0.2, 0.16]}>
          <circleGeometry args={[0.42, 32]} /><primitive object={stainMat} attach="material" />
        </mesh>
        <mesh ref={stainB} position={[0.9, -0.55, 0.16]}>
          <circleGeometry args={[0.28, 32]} /><primitive object={stainMat} attach="material" />
        </mesh>
        <instancedMesh ref={fibers} args={[undefined, undefined, fiberSeeds.length]} position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.009, 0.013, 0.18, 5]} />
          <primitive object={fiberMat} attach="material" />
        </instancedMesh>
      </group>

      <group ref={tool} position={[-2.85, 0.26, 0.48]}>
        <group ref={toolHead}>
          <mesh position={[0, 0.42, 0]} material={metalMat}><boxGeometry args={[0.58, 0.24, 0.36]} /></mesh>
          <mesh position={[0, 0.18, 0.02]} material={darkMetal}><boxGeometry args={[0.76, 0.22, 0.54]} /></mesh>
          <mesh position={[0, 0.04, 0.04]} material={metalMat}><boxGeometry args={[0.86, 0.08, 0.62]} /></mesh>
          <mesh position={[0, 0.70, 0]} material={darkMetal}><cylinderGeometry args={[0.045, 0.045, 0.52, 16]} /></mesh>
          <mesh position={[0, 0.98, 0]} material={metalMat}><boxGeometry args={[0.14, 0.46, 0.14]} /></mesh>
          <mesh ref={polishDisc} position={[0, -0.04, 0.05]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
            <cylinderGeometry args={[0.42, 0.42, 0.08, 40]} />
            <meshStandardMaterial color="#d8d2c4" roughness={0.55} />
          </mesh>
        </group>
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

  if (reducedMotion) return <div className="treatment-fallback" aria-hidden="true" />;

  const dpr: [number, number] = quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];

  return (
    <div className="three-layer treatment-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 6.1], fov: 42, near: 0.1, far: 40 }}
        dpr={dpr}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: quality !== "low",
            alpha: false,
            powerPreference: "high-performance",
          });
          await renderer.init();
          renderer.setClearColor("#d9d5cb", 1);
          return renderer as never;
        }}
      >
        <ambientLight intensity={1.25} color="#eee8dc" />
        <directionalLight position={[-4, 6, 6]} intensity={2.25} color="#fff3da" />
        <directionalLight position={[5, -2, 4]} intensity={0.55} color="#d6e2e1" />
        <TreatmentScene quality={quality} />
      </Canvas>
      <div className="treatment-vignette" />
      <div className="treatment-line-ui"><span>UNTREATED</span><i><b /></i><span>RESTORED</span></div>
    </div>
  );
}
