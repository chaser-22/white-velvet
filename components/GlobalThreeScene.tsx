"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

type QualityTier = "high" | "medium" | "low";

const SECTION_SELECTORS = [
  "#top",
  "#tjanster",
  "#resultat",
  ".process",
  ".about",
  "#boka",
  "#faq",
  "#kontakt",
];

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uLocal;
  uniform float uServiceMode;
  uniform float uServiceProgress;
  uniform float uServiceHover;
  uniform float uResultControl;
  uniform float uResultMix;
  uniform vec2 uPointer;
  uniform float uPointerStrength;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vCleanMask;
  varying float vServiceClean;
  varying float vServiceMode;

  float phaseWeight(float target) {
    return 1.0 - smoothstep(0.0, 0.92, abs(uPhase - target));
  }

  float modeWeight(float target) {
    return 1.0 - smoothstep(0.0, 0.90, abs(uServiceMode - target));
  }

  void main() {
    vUv = uv;
    vServiceMode = uServiceMode;

    vec3 p = position;

    float wHero = phaseWeight(0.0);
    float wServices = phaseWeight(1.0);
    float wResults = phaseWeight(2.0);
    float wProcess = phaseWeight(3.0);
    float wAbout = phaseWeight(4.0);
    float wBooking = phaseWeight(5.0);
    float wFaq = phaseWeight(6.0);
    float wFooter = phaseWeight(7.0);

    float mRug = modeWeight(0.0);
    float mUpholstery = modeWeight(1.0);
    float mFloor = modeWeight(2.0);
    float mVehicle = modeWeight(3.0);
    float modeSum = mRug + mUpholstery + mFloor + mVehicle + 0.0001;

    float slowTime = uTime * 0.12;

    float heroFold =
      sin(p.x * 1.04 + slowTime) * 0.24 +
      sin(p.y * 0.90 - slowTime * 0.72) * 0.10 +
      sin((p.x + p.y) * 0.43) * 0.055;

    float serviceFront = clamp(mix(uServiceProgress, uPointer.x, uServiceHover), 0.05, 0.95);
    float serviceClean = 1.0 - smoothstep(serviceFront - 0.10, serviceFront + 0.10, uv.x);

    float rugDirty =
      sin(p.x * 4.8 + p.y * 0.35) * 0.10 +
      sin(p.y * 2.1) * 0.045;
    float rugClean =
      sin(p.x * 2.9 + p.y * 0.22) * 0.16 +
      sin(p.y * 1.42 - slowTime * 0.3) * 0.055;
    float rugFold = mix(rugDirty, rugClean + serviceClean * 0.055, serviceClean);

    float upholsteryDirty =
      sin(p.x * 1.8 + p.y * 1.1) * 0.115 +
      sin(p.y * 3.6 - p.x * 0.42) * 0.055;
    float upholsteryClean =
      sin(p.x * 1.18 + slowTime * 0.35) * 0.105 +
      sin(p.y * 1.08) * 0.048;
    float upholsteryFold = mix(upholsteryDirty, upholsteryClean, serviceClean);

    float floorDirty =
      sin(p.x * 5.4 + p.y * 0.45) * 0.035 +
      sin(p.y * 6.2) * 0.018;
    float floorClean =
      sin(p.x * 0.72 + slowTime * 0.20) * 0.018 +
      sin(p.y * 0.60) * 0.012;
    float floorFold = mix(floorDirty, floorClean, serviceClean);

    float vehicleDirty =
      sin(p.x * 2.4 + p.y * 1.8) * 0.075 +
      sin(p.y * 4.0 - p.x * 0.55) * 0.035;
    float vehicleClean =
      sin(p.x * 1.05 + slowTime * 0.28) * 0.082 +
      sin(p.y * 0.92) * 0.034;
    float vehicleFold = mix(vehicleDirty, vehicleClean, serviceClean);

    float serviceFold = (
      rugFold * mRug +
      upholsteryFold * mUpholstery +
      floorFold * mFloor +
      vehicleFold * mVehicle
    ) / modeSum;

    float resultProgress = mix(uLocal, uResultControl, uResultMix);
    float resultFront = clamp(resultProgress, 0.04, 0.96);
    float cleanMask = 1.0 - smoothstep(resultFront - 0.11, resultFront + 0.11, uv.x);

    float dirtyTexture =
      sin(p.x * 3.4 + p.y * 1.8) * 0.085 +
      sin(p.y * 4.8 - p.x * 0.6) * 0.045;
    float cleanTexture =
      sin(p.x * 1.10 + slowTime * 0.45) * 0.075 +
      sin(p.y * 0.95) * 0.032;
    float resultFold = mix(dirtyTexture, cleanTexture, cleanMask);

    float processFold =
      sin(p.y * 2.05 + p.x * 0.18 + slowTime * 0.32) * 0.072 +
      sin(p.x * 0.78) * 0.033;

    float aboutFold =
      sin(p.x * 0.78 + p.y * 0.42 + slowTime * 0.42) * 0.18 +
      sin(p.y * 0.72 - slowTime * 0.38) * 0.075;

    float bookingFold =
      sin(p.x * 0.92 + slowTime * 0.22) * 0.052 +
      sin(p.y * 0.72) * 0.023;

    float faqFold =
      sin(p.x * 1.30 + slowTime * 0.30) * 0.082 +
      sin(p.y * 1.12 - slowTime * 0.25) * 0.035;

    float footerFold =
      sin(p.x * 0.72 + slowTime * 0.32) * 0.18 +
      sin(p.y * 0.62 + p.x * 0.20) * 0.09;

    float weightSum =
      wHero + wServices + wResults + wProcess +
      wAbout + wBooking + wFaq + wFooter + 0.0001;

    float displacement = (
      heroFold * wHero +
      serviceFold * wServices +
      resultFold * wResults +
      processFold * wProcess +
      aboutFold * wAbout +
      bookingFold * wBooking +
      faqFold * wFaq +
      footerFold * wFooter
    ) / weightSum;

    float pointerLift =
      exp(-distance(uv, uPointer) * 7.5) *
      0.115 * uPointerStrength *
      (1.0 - wBooking * 0.82);

    p.z += displacement + pointerLift;

    float lateral =
      sin(p.y * 0.58 + uPhase * 0.72) * 0.052 +
      sin(p.x * 0.31 - uPhase * 0.38) * 0.023;

    p.x += lateral * (0.75 + wAbout * 0.35);
    p.y += cos(p.x * 0.42 + uPhase * 0.44) * 0.032;

    vCleanMask = cleanMask;
    vServiceClean = serviceClean;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uPhase;
  uniform float uLocal;
  uniform float uServiceMode;
  uniform float uServiceProgress;
  uniform float uServiceHover;
  uniform float uResultControl;
  uniform float uResultMix;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vCleanMask;
  varying float vServiceClean;
  varying float vServiceMode;

  float phaseWeight(float target) {
    return 1.0 - smoothstep(0.0, 0.92, abs(uPhase - target));
  }

  float modeWeight(float target) {
    return 1.0 - smoothstep(0.0, 0.90, abs(vServiceMode - target));
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float softSpot(vec2 uv, vec2 center, float radius) {
    return exp(-distance(uv, center) * radius);
  }

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 lightA = normalize(vec3(-0.52, 0.70, 0.84));
    vec3 lightB = normalize(vec3(0.62, -0.24, 0.74));
    vec3 lightDir = normalize(mix(lightA, lightB, smoothstep(3.8, 6.3, uPhase)));

    float diffuse = max(dot(normal, lightDir), 0.0);
    float reverseDiffuse = max(dot(normal, -lightDir), 0.0);
    float rim = pow(1.0 - abs(dot(normal, viewDir)), 2.35);
    float velvetSheen = pow(max(0.0, 1.0 - abs(dot(normal, viewDir))), 1.55);

    float wHero = phaseWeight(0.0);
    float wServices = phaseWeight(1.0);
    float wResults = phaseWeight(2.0);
    float wProcess = phaseWeight(3.0);
    float wAbout = phaseWeight(4.0);
    float wBooking = phaseWeight(5.0);
    float wFaq = phaseWeight(6.0);
    float wFooter = phaseWeight(7.0);

    float mRug = modeWeight(0.0);
    float mUpholstery = modeWeight(1.0);
    float mFloor = modeWeight(2.0);
    float mVehicle = modeWeight(3.0);
    float modeSum = mRug + mUpholstery + mFloor + mVehicle + 0.0001;

    vec3 ivory = vec3(0.935, 0.915, 0.875);
    vec3 warmIvory = vec3(0.955, 0.935, 0.895);
    vec3 pearl = vec3(0.79, 0.80, 0.785);
    vec3 softSilver = vec3(0.70, 0.725, 0.72);
    vec3 charcoal = vec3(0.075, 0.092, 0.098);
    vec3 midnight = vec3(0.038, 0.052, 0.058);
    vec3 dusty = vec3(0.49, 0.515, 0.51);
    vec3 staleWarm = vec3(0.44, 0.425, 0.39);
    vec3 deepTextile = vec3(0.16, 0.185, 0.19);

    float heroPointerClean = softSpot(vUv, uPointer, 5.0);
    float heroScrollClean = smoothstep(0.03, 0.82, uLocal);
    float heroClean = max(heroScrollClean, heroPointerClean * 0.64);
    vec3 heroColor = mix(vec3(0.72, 0.71, 0.67), ivory, heroClean);

    vec3 rugColor = mix(staleWarm, warmIvory, vServiceClean);
    vec3 upholsteryColor = mix(vec3(0.47, 0.475, 0.455), pearl, vServiceClean);
    vec3 floorColor = mix(vec3(0.43, 0.45, 0.445), vec3(0.77, 0.79, 0.785), vServiceClean);
    vec3 vehicleColor = mix(vec3(0.50, 0.52, 0.52), deepTextile, vServiceClean);

    vec3 serviceColor = (
      rugColor * mRug +
      upholsteryColor * mUpholstery +
      floorColor * mFloor +
      vehicleColor * mVehicle
    ) / modeSum;

    float dustCell = hash21(floor(vUv * vec2(118.0, 92.0)));
    float dust = smoothstep(0.88, 0.99, dustCell) * (1.0 - vServiceClean);

    float stainA = softSpot(vUv, vec2(0.63, 0.44), 10.0);
    float stainB = softSpot(vUv, vec2(0.37, 0.62), 13.0);
    float stain = clamp(stainA * 0.72 + stainB * 0.45, 0.0, 1.0) * (1.0 - vServiceClean);

    float scratches =
      pow(abs(sin(vUv.y * 430.0 + vUv.x * 37.0)), 22.0) *
      (0.35 + 0.65 * hash21(floor(vUv * 70.0))) *
      (1.0 - vServiceClean);

    float fog =
      (0.5 + 0.5 * sin(vUv.x * 19.0 + sin(vUv.y * 13.0))) *
      (0.5 + 0.5 * sin(vUv.y * 22.0 - vUv.x * 3.0)) *
      (1.0 - vServiceClean);

    serviceColor -= dust * 0.11 * mRug;
    serviceColor -= stain * vec3(0.15, 0.115, 0.075) * mUpholstery;
    serviceColor -= scratches * 0.085 * mFloor;
    serviceColor = mix(serviceColor, vec3(0.68, 0.70, 0.695), fog * 0.25 * mVehicle);

    vec3 resultColor = mix(dusty, warmIvory, vCleanMask);

    float weightSum =
      wHero + wServices + wResults + wProcess +
      wAbout + wBooking + wFaq + wFooter + 0.0001;

    vec3 base = (
      heroColor * wHero +
      serviceColor * wServices +
      resultColor * wResults +
      charcoal * wProcess +
      warmIvory * wAbout +
      midnight * wBooking +
      softSilver * wFaq +
      midnight * wFooter
    ) / weightSum;

    float threadY = 0.5 + 0.5 * sin(vUv.y * 520.0 + sin(vUv.x * 24.0) * 0.35);
    float threadX = 0.5 + 0.5 * sin(vUv.x * 230.0 + vUv.y * 4.0);
    float weave = (threadY * 0.72 + threadX * 0.28 - 0.5) * 0.030;

    float rugPile =
      (0.5 + 0.5 * sin(vUv.x * 390.0 + sin(vUv.y * 36.0))) *
      mRug * wServices;
    weave += (rugPile - 0.5) * 0.025 * mix(0.55, 1.0, vServiceClean);

    float upholsteryWeave =
      (0.5 + 0.5 * sin(vUv.x * 210.0)) *
      (0.5 + 0.5 * sin(vUv.y * 188.0));
    weave += (upholsteryWeave - 0.5) * 0.020 * mUpholstery * wServices;

    float floorGrain = sin((vUv.x + vUv.y * 0.08) * 330.0) * 0.007;
    weave += floorGrain * mFloor * wServices * (1.0 - vServiceClean * 0.45);

    float serviceFront = clamp(mix(uServiceProgress, uPointer.x, uServiceHover), 0.05, 0.95);
    float serviceEdge = exp(-pow((vUv.x - serviceFront) * 18.0, 2.0)) * wServices;

    float resultProgress = mix(uLocal, uResultControl, uResultMix);
    float resultFront = clamp(resultProgress, 0.04, 0.96);
    float restorationLine = exp(-pow((vUv.x - resultFront) * 18.0, 2.0)) * wResults;

    float cleanSheen = mix(0.48, 1.22, max(vCleanMask, vServiceClean));
    float floorPolish = mFloor * wServices * vServiceClean;

    float sheenStrength =
      0.19 * wHero +
      0.20 * wServices * cleanSheen +
      0.28 * wResults * cleanSheen +
      0.14 * wProcess +
      0.33 * wAbout +
      0.15 * wBooking +
      0.20 * wFaq +
      0.18 * wFooter;

    float lighting = 0.47 + diffuse * 0.63 + reverseDiffuse * 0.08;
    vec3 color = base * lighting;
    color += velvetSheen * sheenStrength;
    color += rim * (0.085 + 0.08 * wAbout + floorPolish * 0.16);
    color += weave;
    color += serviceEdge * vec3(0.18, 0.18, 0.16);
    color += restorationLine * vec3(0.22, 0.21, 0.18);
    color += floorPolish * pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 18.0) * 0.38;

    float pointerGlow = softSpot(vUv, uPointer, 9.0);
    color += pointerGlow * 0.018 * (1.0 - wBooking);

    float darkPhase = clamp(wProcess * 0.70 + wBooking + wFooter, 0.0, 1.0);
    color = mix(color, color * 0.88, darkPhase * 0.42);

    gl_FragColor = vec4(color, 0.92);
  }
`;

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const width = window.innerWidth;

  if (width < 700 || memory <= 4 || cores <= 4) return "low";
  if (width >= 1280 && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

function interpolateKeyframe(values: number[], phase: number) {
  const clamped = THREE.MathUtils.clamp(phase, 0, values.length - 1);
  const index = Math.floor(clamped);
  const next = Math.min(index + 1, values.length - 1);
  const t = THREE.MathUtils.smoothstep(clamped - index, 0, 1);
  return THREE.MathUtils.lerp(values[index], values[next], t);
}

function Fabric({ quality }: { quality: QualityTier }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const phaseTarget = useRef(0);
  const localTarget = useRef(0);
  const serviceModeTarget = useRef(0);
  const serviceProgressTarget = useRef(0.12);
  const serviceHoverTarget = useRef(0);
  const resultControlTarget = useRef(0.52);
  const resultMixTarget = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: 0 },
          uLocal: { value: 0 },
          uServiceMode: { value: 0 },
          uServiceProgress: { value: 0.12 },
          uServiceHover: { value: 0 },
          uResultControl: { value: 0.52 },
          uResultMix: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uPointerStrength: { value: quality === "low" ? 0 : 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [quality],
  );

  useEffect(() => {
    let cancelled = false;
    let disposeGsap = () => {};

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        1 - event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    const onCompare = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: number }>).detail;
      if (typeof detail?.value !== "number") return;
      resultControlTarget.current = THREE.MathUtils.clamp(detail.value, 0, 1);
      resultMixTarget.current = 1;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("whitevelvet:compare", onCompare);

    const setupGsap = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const triggers: Array<{ kill: () => void }> = [];
      const cardCleanups: Array<() => void> = [];

      SECTION_SELECTORS.forEach((selector, index) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return;

        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            phaseTarget.current = index;
            if (index !== 2) resultMixTarget.current = 0;
          },
          onEnterBack: () => {
            phaseTarget.current = index;
            if (index !== 2) resultMixTarget.current = 0;
          },
          onUpdate: (self) => {
            if (!self.isActive) return;
            phaseTarget.current = index;
            localTarget.current = self.progress;
          },
        });

        triggers.push(trigger);
      });

      document.querySelectorAll<HTMLElement>("[data-cleaning-mode]").forEach((card) => {
        const mode = Number(card.dataset.cleaningMode ?? 0);

        const setHover = () => {
          serviceModeTarget.current = mode;
          serviceHoverTarget.current = quality === "low" ? 0 : 1;
        };
        const clearHover = () => {
          serviceHoverTarget.current = 0;
        };

        card.addEventListener("pointerenter", setHover);
        card.addEventListener("pointerleave", clearHover);
        card.addEventListener("focusin", setHover);
        card.addEventListener("focusout", clearHover);

        cardCleanups.push(() => {
          card.removeEventListener("pointerenter", setHover);
          card.removeEventListener("pointerleave", clearHover);
          card.removeEventListener("focusin", setHover);
          card.removeEventListener("focusout", clearHover);
        });

        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top 78%",
          end: "bottom 32%",
          onEnter: () => {
            serviceModeTarget.current = mode;
          },
          onEnterBack: () => {
            serviceModeTarget.current = mode;
          },
          onUpdate: (self) => {
            if (!self.isActive || serviceHoverTarget.current > 0.5) return;
            serviceModeTarget.current = mode;
            serviceProgressTarget.current = THREE.MathUtils.clamp(0.08 + self.progress * 0.84, 0.08, 0.92);
          },
        });

        triggers.push(trigger);
      });

      ScrollTrigger.refresh();

      disposeGsap = () => {
        triggers.forEach((trigger) => trigger.kill());
        cardCleanups.forEach((cleanup) => cleanup());
      };
    };

    void setupGsap();

    return () => {
      cancelled = true;
      disposeGsap();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("whitevelvet:compare", onCompare);
      material.dispose();
    };
  }, [material, quality]);

  useFrame(({ clock, camera }) => {
    if (!mesh.current || document.hidden) return;

    const uniforms = material.uniforms;

    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uPhase.value = THREE.MathUtils.lerp(uniforms.uPhase.value, phaseTarget.current, 0.055);
    uniforms.uLocal.value = THREE.MathUtils.lerp(uniforms.uLocal.value, localTarget.current, 0.065);
    uniforms.uServiceMode.value = THREE.MathUtils.lerp(uniforms.uServiceMode.value, serviceModeTarget.current, 0.075);
    uniforms.uServiceProgress.value = THREE.MathUtils.lerp(uniforms.uServiceProgress.value, serviceProgressTarget.current, 0.07);
    uniforms.uServiceHover.value = THREE.MathUtils.lerp(uniforms.uServiceHover.value, serviceHoverTarget.current, 0.10);
    uniforms.uResultControl.value = THREE.MathUtils.lerp(uniforms.uResultControl.value, resultControlTarget.current, 0.12);
    uniforms.uResultMix.value = THREE.MathUtils.lerp(uniforms.uResultMix.value, resultMixTarget.current, 0.08);
    uniforms.uPointer.value.lerp(pointer.current, 0.045);

    const phase = uniforms.uPhase.value;

    mesh.current.position.x = interpolateKeyframe([0.45, 0.12, -0.24, 0.28, -0.18, 0.10, 0.32, 0.05], phase);
    mesh.current.position.y = interpolateKeyframe([0.12, -0.12, 0.04, 0.15, -0.20, 0.08, -0.04, 0.16], phase);
    mesh.current.position.z = interpolateKeyframe([-0.58, -0.60, -0.50, -0.64, -0.50, -0.70, -0.56, -0.62], phase);
    mesh.current.rotation.x = interpolateKeyframe([-0.30, -0.17, -0.14, -0.20, -0.28, -0.10, -0.16, -0.28], phase);
    mesh.current.rotation.z = interpolateKeyframe([-0.13, 0.035, -0.035, 0.025, -0.07, 0.018, 0.045, 0.11], phase);

    const scale = interpolateKeyframe([1.42, 1.36, 1.40, 1.36, 1.44, 1.40, 1.38, 1.46], phase);
    mesh.current.scale.set(scale, scale * 0.92, 1);

    camera.position.x = interpolateKeyframe([0.04, 0.0, -0.05, 0.04, -0.03, 0.0, 0.03, 0.0], phase);
    camera.position.y = interpolateKeyframe([0.03, -0.02, 0.0, 0.03, -0.02, 0.0, 0.02, 0.0], phase);
    camera.lookAt(0, 0, 0);
  });

  const segments =
    quality === "high"
      ? ([154, 118] as const)
      : quality === "medium"
        ? ([112, 86] as const)
        : ([68, 52] as const);

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[9.4, 7.8, segments[0], segments[1]]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Scene({ quality }: { quality: QualityTier }) {
  return <Fabric quality={quality} />;
}

export default function GlobalThreeScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [quality, setQuality] = useState<QualityTier>("medium");

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateQuality = () => setQuality(getQualityTier());

    updateMotion();
    updateQuality();

    motionQuery.addEventListener("change", updateMotion);
    window.addEventListener("resize", updateQuality, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateQuality);
    };
  }, []);

  if (reducedMotion) {
    return <div className="three-fallback" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.6] : quality === "medium" ? [1, 1.35] : [1, 1.05];

  return (
    <div className={`three-layer three-quality-${quality}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.35], fov: 43 }}
        dpr={dpr}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={<div className="three-fallback three-fallback-inline" />}
      >
        <Scene quality={quality} />
      </Canvas>
      <div className="three-atmosphere" />
    </div>
  );
}
