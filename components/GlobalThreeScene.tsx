"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uProgress;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vClean;
  varying float vStage;

  float weight(float target) {
    return 1.0 - smoothstep(0.0, 0.95, abs(uStage - target));
  }

  void main() {
    vUv = uv;
    vStage = uStage;

    vec3 p = position;
    float wHero = weight(0.0);
    float wCarpet = weight(1.0);
    float wWeave = weight(2.0);
    float wFloor = weight(3.0);
    float wInterior = weight(4.0);
    float wNeutral = clamp(1.0 - max(max(max(wHero, wCarpet), max(wWeave, wFloor)), wInterior), 0.0, 1.0);

    float cleanFront = clamp(uProgress, 0.03, 0.97);
    float clean = 1.0 - smoothstep(cleanFront - 0.10, cleanFront + 0.10, uv.x);
    vClean = clean;

    float macroFold =
      sin(p.x * 1.15 + uTime * 0.10) * 0.16 +
      sin(p.y * 0.92 - uTime * 0.08) * 0.07;

    float pileDirty =
      sin(p.x * 7.6 + p.y * 0.8) * 0.075 +
      sin(p.y * 5.8 - p.x * 0.6) * 0.045;
    float pileClean =
      sin(p.x * 4.4 + p.y * 0.25) * 0.105 +
      sin(p.y * 3.0) * 0.04;

    float weave =
      sin(p.x * 13.0) * sin(p.y * 12.0) * 0.026 +
      sin((p.x + p.y) * 3.0) * 0.025;

    float floorSurface =
      sin(p.x * 0.72 + uTime * 0.035) * 0.008 +
      sin(p.y * 0.64) * 0.006;

    float curve = p.x * p.x * 0.12 + sin(p.y * 0.72) * 0.035;

    float displacement =
      macroFold * wHero +
      mix(pileDirty, pileClean, clean) * wCarpet +
      weave * wWeave +
      floorSurface * wFloor +
      curve * wInterior +
      sin(p.x * 0.68 + p.y * 0.45) * 0.035 * wNeutral;

    float pointerLift = exp(-distance(uv, uPointer) * 8.0) * 0.045 * (wHero + wCarpet + wWeave);

    p.z += displacement + pointerLift;

    if (wInterior > 0.01) {
      p.x *= 1.0 - wInterior * 0.04;
      p.y += sin(p.x * 0.62) * 0.05 * wInterior;
    }

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uStage;
  uniform float uProgress;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vClean;
  varying float vStage;

  float weight(float target) {
    return 1.0 - smoothstep(0.0, 0.95, abs(vStage - target));
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float spot(vec2 uv, vec2 center, float radius) {
    return exp(-distance(uv, center) * radius);
  }

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 lightDir = normalize(vec3(-0.48, 0.70, 0.74));

    float diffuse = max(dot(normal, lightDir), 0.0);
    float rim = pow(1.0 - abs(dot(normal, viewDir)), 2.15);
    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 22.0);

    float wHero = weight(0.0);
    float wCarpet = weight(1.0);
    float wWeave = weight(2.0);
    float wFloor = weight(3.0);
    float wInterior = weight(4.0);
    float wNeutral = clamp(1.0 - max(max(max(wHero, wCarpet), max(wWeave, wFloor)), wInterior), 0.0, 1.0);

    vec3 dirtyTextile = vec3(0.34, 0.335, 0.305);
    vec3 cleanTextile = vec3(0.80, 0.76, 0.67);
    vec3 cleanWeave = vec3(0.74, 0.735, 0.69);
    vec3 hardDirty = vec3(0.36, 0.375, 0.37);
    vec3 hardClean = vec3(0.72, 0.735, 0.72);
    vec3 interiorDirty = vec3(0.27, 0.30, 0.30);
    vec3 interiorClean = vec3(0.59, 0.625, 0.61);
    vec3 pearl = vec3(0.82, 0.80, 0.75);

    vec3 heroColor = mix(vec3(0.52, 0.50, 0.45), pearl, smoothstep(0.05, 0.9, uProgress));
    vec3 carpetColor = mix(dirtyTextile, cleanTextile, vClean);
    vec3 weaveColor = mix(vec3(0.42, 0.40, 0.36), cleanWeave, vClean);
    vec3 floorColor = mix(hardDirty, hardClean, vClean);
    vec3 interiorColor = mix(interiorDirty, interiorClean, vClean);

    float sum = wHero + wCarpet + wWeave + wFloor + wInterior + wNeutral + 0.0001;
    vec3 base = (
      heroColor * wHero +
      carpetColor * wCarpet +
      weaveColor * wWeave +
      floorColor * wFloor +
      interiorColor * wInterior +
      pearl * wNeutral
    ) / sum;

    float carpetThreads = (0.5 + 0.5 * sin(vUv.x * 520.0 + sin(vUv.y * 36.0))) - 0.5;
    float weaveX = 0.5 + 0.5 * sin(vUv.x * 250.0);
    float weaveY = 0.5 + 0.5 * sin(vUv.y * 235.0);
    float weavePattern = weaveX * weaveY - 0.25;
    float interiorGrain = (0.5 + 0.5 * sin((vUv.x * 0.7 + vUv.y) * 330.0)) - 0.5;

    base += carpetThreads * 0.030 * wCarpet;
    base += weavePattern * 0.052 * wWeave;
    base += interiorGrain * 0.022 * wInterior;

    float dust = smoothstep(0.91, 0.995, hash21(floor(vUv * vec2(92.0, 78.0)))) * (1.0 - vClean);
    float stain = (spot(vUv, vec2(0.62, 0.46), 9.5) + spot(vUv, vec2(0.36, 0.62), 14.0) * 0.55) * (1.0 - vClean);
    float scratches =
      pow(abs(sin(vUv.y * 510.0 + vUv.x * 31.0)), 25.0) *
      (0.35 + hash21(floor(vUv * 84.0)) * 0.65) *
      (1.0 - vClean);
    float haze =
      (0.5 + 0.5 * sin(vUv.x * 18.0 + sin(vUv.y * 12.0))) *
      (0.5 + 0.5 * sin(vUv.y * 21.0 - vUv.x * 2.5)) *
      (1.0 - vClean);

    base -= dust * 0.10 * wCarpet;
    base -= stain * vec3(0.15, 0.09, 0.05) * wWeave;
    base -= scratches * 0.09 * wFloor;
    base = mix(base, vec3(0.58, 0.60, 0.59), haze * 0.22 * wInterior);

    float cleaningEdge = exp(-pow((vUv.x - clamp(uProgress, 0.03, 0.97)) * 22.0, 2.0));
    float lighting = 0.45 + diffuse * 0.66;
    vec3 color = base * lighting;

    color += rim * (0.07 + 0.12 * wHero + 0.08 * wInterior);
    color += spec * (0.03 + 0.36 * wFloor * vClean);
    color += cleaningEdge * vec3(0.18, 0.17, 0.14) * (wCarpet + wWeave + wFloor + wInterior);
    color += spot(vUv, uPointer, 9.0) * 0.015 * (wHero + wCarpet + wWeave);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.innerWidth < 720 || memory <= 4 || cores <= 4) return "low";
  if (window.innerWidth >= 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function Specimen({ quality }: { quality: QualityTier }) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const fibers = useRef<THREE.InstancedMesh>(null);
  const fiberMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const stageTarget = useRef(0);
  const progressTarget = useRef(0);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStage: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  }), []);

  const fiberData = useMemo(() => {
    const count = quality === "high" ? 420 : quality === "medium" ? 250 : 110;
    return Array.from({ length: count }, (_, i) => {
      const cols = Math.ceil(Math.sqrt(count * 0.9));
      const rows = Math.ceil(count / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = -1.9 + (col / Math.max(cols - 1, 1)) * 3.8;
      const y = -2.15 + (row / Math.max(rows - 1, 1)) * 4.3;
      const phase = ((i * 37) % 97) / 97;
      return { x, y, phase };
    });
  }, [quality]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        1 - event.clientY / Math.max(window.innerHeight, 1),
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
      const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-lab-stage]")).map((element) => {
        const stage = Number(element.dataset.labStage ?? 0);
        return ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => { stageTarget.current = stage; },
          onEnterBack: () => { stageTarget.current = stage; },
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
      material.dispose();
    };
  }, [material]);

  useFrame(({ clock, camera }) => {
    if (!mesh.current || !group.current) return;

    const stage = material.uniforms.uStage.value;
    const progress = material.uniforms.uProgress.value;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uStage.value = THREE.MathUtils.lerp(stage, stageTarget.current, 0.055);
    material.uniforms.uProgress.value = THREE.MathUtils.lerp(progress, progressTarget.current, 0.07);
    material.uniforms.uPointer.value.lerp(pointer.current, 0.04);

    const s = material.uniforms.uStage.value;
    const targetX = s < 5 ? (s % 2 < 1 ? 1.25 : -1.15) : s === 6 ? 1.0 : s === 7 ? -0.95 : 1.75;
    const targetY = s >= 8 ? 1.25 : 0.0;
    const targetScale = s >= 8 ? 0.42 : s >= 5 ? 0.72 : 1.0;
    const targetRotZ = s === 3 ? -0.10 : s === 4 ? 0.16 : s === 2 ? -0.08 : 0.04;
    const targetRotX = s === 3 ? -0.78 : s === 4 ? -0.18 : -0.12;
    const targetRotY = s === 4 ? 0.32 : s === 2 ? -0.20 : 0.08;

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.045);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.045);
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.045);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.04);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.04);

    const pointerTiltX = (pointer.current.y - 0.5) * (quality === "low" ? 0 : 0.045);
    const pointerTiltY = (pointer.current.x - 0.5) * (quality === "low" ? 0 : 0.055);
    group.current.rotation.x += pointerTiltX * 0.03;
    group.current.rotation.y += pointerTiltY * 0.03;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, s === 3 ? 5.7 : 5.3, 0.03);

    if (fibers.current && fiberMaterial.current) {
      const carpetWeight = 1.0 - THREE.MathUtils.smoothstep(Math.abs(s - 1.0), 0.0, 0.9);
      fiberMaterial.current.opacity = carpetWeight * 0.92;
      fibers.current.visible = carpetWeight > 0.02;

      if (fibers.current.visible) {
        const dummy = new THREE.Object3D();
        const cleanFront = THREE.MathUtils.clamp(material.uniforms.uProgress.value, 0.03, 0.97);
        fiberData.forEach((fiber, index) => {
          const uvx = (fiber.x + 1.9) / 3.8;
          const clean = 1 - THREE.MathUtils.smoothstep(uvx, cleanFront - 0.08, cleanFront + 0.08);
          const dirtyTilt = (fiber.phase - 0.5) * 0.75;
          const tilt = THREE.MathUtils.lerp(dirtyTilt, (fiber.phase - 0.5) * 0.12, clean);
          const height = THREE.MathUtils.lerp(0.10 + fiber.phase * 0.05, 0.18 + fiber.phase * 0.045, clean);

          dummy.position.set(fiber.x, fiber.y, 0.08 + height * 0.48);
          dummy.rotation.set(Math.PI / 2 + tilt, 0, fiber.phase * 0.6);
          dummy.scale.set(1, height / 0.18, 1);
          dummy.updateMatrix();
          fibers.current!.setMatrixAt(index, dummy.matrix);
        });
        fibers.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  const segments = quality === "high" ? [170, 190] : quality === "medium" ? [120, 136] : [72, 82];

  return (
    <group ref={group} position={[1.25, 0, 0]}>
      <mesh ref={mesh}>
        <planeGeometry args={[4.2, 4.8, segments[0], segments[1]]} />
        <primitive object={material} attach="material" />
      </mesh>

      <instancedMesh ref={fibers} args={[undefined, undefined, fiberData.length]} position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.010, 0.014, 0.18, 5]} />
        <meshStandardMaterial ref={fiberMaterial} color="#cfc2a8" roughness={0.9} transparent opacity={0} depthWrite={false} />
      </instancedMesh>
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

  if (reducedMotion) return <div className="lab-fallback" aria-hidden="true" />;

  const dpr: [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];

  return (
    <div className="three-layer lab-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.3], fov: 42 }}
        dpr={dpr}
        gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.1} color="#eee8dc" />
        <directionalLight position={[-4, 5, 6]} intensity={2.2} color="#fff4db" />
        <pointLight position={[4, -2, 4]} intensity={0.65} color="#dae7e6" />
        <Specimen quality={quality} />
      </Canvas>
      <div className="lab-grid-overlay" />
    </div>
  );
}
