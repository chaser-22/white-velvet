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
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uFlow;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vHeight;
  varying float vCleanMask;
  varying float vPhase;

  float phaseWeight(float target) {
    return 1.0 - smoothstep(0.0, 1.36, abs(uPhase - target));
  }

  void main() {
    vUv = uv;
    vPhase = uPhase;

    vec3 p = position;

    float wHero = phaseWeight(0.0);
    float wServices = phaseWeight(1.0);
    float wResults = phaseWeight(2.0);
    float wProcess = phaseWeight(3.0);
    float wAbout = phaseWeight(4.0);
    float wBooking = phaseWeight(5.0);
    float wFaq = phaseWeight(6.0);
    float wFooter = phaseWeight(7.0);

    float idleFast = uTime * 0.48;
    float idleMid = uTime * 0.30;
    float idleSlow = uTime * 0.18;
    float slowTime = uTime * 0.10;

    float idleBreath =
      sin(idleMid + p.y * 0.30) * 0.042 +
      cos(idleSlow - p.x * 0.22) * 0.030;

    float idleDrift =
      sin(p.x * 0.22 + idleSlow * 0.78) * 0.024 +
      cos(p.y * 0.20 - idleSlow * 0.92) * 0.018;

    float idleSwell =
      sin(length(p.xy) * 0.42 - idleSlow * 0.72) * 0.022 +
      sin((p.x - p.y) * 0.15 + idleMid * 0.56) * 0.016;

    float diagonal = p.x * 0.78 + p.y * 0.34;
    float crossDiagonal = p.y * 0.62 - p.x * 0.20;

    float heroFold =
      sin(diagonal * 1.02 + slowTime * 0.82) * 0.185 +
      sin(crossDiagonal * 0.78 - slowTime * 0.58) * 0.082 +
      sin((p.x + p.y) * 0.26 + slowTime * 0.34) * 0.038;

    float serviceFold =
      sin(diagonal * 1.72 + slowTime * 0.62) * 0.115 +
      sin(crossDiagonal * 1.22 - slowTime * 0.44) * 0.050;

    float cleanFront = clamp(uLocal, 0.04, 0.96);
    float cleanMask = 1.0 - smoothstep(cleanFront - 0.12, cleanFront + 0.12, uv.x);
    float dirtyTexture =
      sin(p.x * 3.4 + p.y * 1.8) * 0.08 +
      sin(p.y * 4.8 - p.x * 0.6) * 0.045;
    float cleanTexture =
      sin(p.x * 1.10 + slowTime * 0.45) * 0.08 +
      sin(p.y * 0.95) * 0.035;
    float resultFold = mix(dirtyTexture, cleanTexture, cleanMask);

    float processFold =
      sin(p.y * 2.05 + p.x * 0.18 + slowTime * 0.32) * 0.075 +
      sin(p.x * 0.78) * 0.035;

    float aboutFold =
      sin(p.x * 0.78 + p.y * 0.42 + slowTime * 0.42) * 0.19 +
      sin(p.y * 0.72 - slowTime * 0.38) * 0.08;

    float bookingFold =
      sin(p.x * 0.92 + slowTime * 0.22) * 0.055 +
      sin(p.y * 0.72) * 0.025;

    float faqFold =
      sin(p.x * 1.30 + slowTime * 0.30) * 0.085 +
      sin(p.y * 1.12 - slowTime * 0.25) * 0.038;

    float footerFold =
      sin(p.x * 0.72 + slowTime * 0.32) * 0.19 +
      sin(p.y * 0.62 + p.x * 0.20) * 0.095;

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

    float pointerDistance = distance(uv, uPointer);
    float pointerLift = exp(-pointerDistance * 7.2) * 0.105 * uPointerStrength;

    float flowStrength = min(abs(uFlow), 1.0);
    float flowWave =
      sin(p.y * 0.72 + slowTime * 2.2 + uFlow * 0.7) * 0.10 * flowStrength +
      sin((p.x - p.y) * 0.38 - slowTime * 1.5) * 0.045 * flowStrength;

    p.z += (displacement + idleBreath + idleDrift + idleSwell + pointerLift + flowWave) * uIntensity;

    float lateral =
      sin(p.y * 0.58 + uPhase * 0.72) * 0.055 +
      sin(p.x * 0.31 - uPhase * 0.38) * 0.025;

    p.x += (
      lateral * (0.75 + wAbout * 0.35) +
      sin(slowTime * 0.41 + p.y * 0.18) * 0.012 +
      uFlow * 0.028 * cos(p.y * 0.55 + slowTime)
    ) * uIntensity;
    p.y += (
      cos(p.x * 0.42 + uPhase * 0.44) * 0.035 +
      cos(slowTime * 0.33 + p.x * 0.16) * 0.009 +
      uFlow * 0.012
    ) * uIntensity;

    vHeight = p.z;
    vCleanMask = cleanMask;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uLocal;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vHeight;
  varying float vCleanMask;
  varying float vPhase;

  float phaseWeight(float target) {
    return 1.0 - smoothstep(0.0, 1.36, abs(uPhase - target));
  }

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(cameraPosition - vWorld);
    float lightDriftX = sin(uTime * 0.055) * 0.045;
    float lightDriftY = cos(uTime * 0.043) * 0.028;
    vec3 lightA = normalize(vec3(-0.52 + lightDriftX, 0.70 + lightDriftY, 0.84));
    vec3 lightB = normalize(vec3(0.62 - lightDriftX * 0.62, -0.24 + lightDriftY * 0.42, 0.74));
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

    vec3 ivory = vec3(0.935, 0.915, 0.875);
    vec3 pearl = vec3(0.79, 0.80, 0.785);
    vec3 warmIvory = vec3(0.955, 0.935, 0.895);
    vec3 softSilver = vec3(0.70, 0.725, 0.72);
    vec3 charcoal = vec3(0.075, 0.092, 0.098);
    vec3 midnight = vec3(0.038, 0.052, 0.058);
    vec3 dusty = vec3(0.54, 0.565, 0.56);

    vec3 resultColor = mix(dusty, warmIvory, vCleanMask);

    float weightSum =
      wHero + wServices + wResults + wProcess +
      wAbout + wBooking + wFaq + wFooter + 0.0001;

    vec3 base = (
      ivory * wHero +
      pearl * wServices +
      resultColor * wResults +
      charcoal * wProcess +
      warmIvory * wAbout +
      midnight * wBooking +
      softSilver * wFaq +
      midnight * wFooter
    ) / weightSum;

    vec2 velvetUv = vec2(
      vUv.x * 0.86 + vUv.y * 0.22,
      vUv.y * 1.06 - vUv.x * 0.08
    );

    float fiberFine =
      0.5 + 0.5 * sin(velvetUv.y * 520.0 + sin(velvetUv.x * 34.0) * 0.72);
    float fiberMid =
      0.5 + 0.5 * sin(velvetUv.y * 168.0 + velvetUv.x * 19.0);
    float fiberCross =
      0.5 + 0.5 * sin((velvetUv.x * 0.20 + velvetUv.y) * 92.0);

    float suedeGrain =
      (fiberFine - 0.5) * 0.014 +
      (fiberMid - 0.5) * 0.020 +
      (fiberCross - 0.5) * 0.010;

    float broadNap =
      sin(velvetUv.y * 15.0 + sin(velvetUv.x * 4.0) * 0.58) * 0.010 +
      sin((velvetUv.x + velvetUv.y) * 7.0) * 0.004;

    float serviceGrain =
      (0.5 + 0.5 * sin(velvetUv.x * 38.0 + velvetUv.y * 9.0)) *
      (0.5 + 0.5 * sin(velvetUv.y * 34.0));
    suedeGrain += (serviceGrain - 0.5) * 0.009 * wServices;

    float cleanFront = clamp(uLocal, 0.04, 0.96);
    float restorationLine = exp(-pow((vUv.x - cleanFront) * 18.0, 2.0)) * wResults;

    float napDirection =
      0.5 + 0.5 * sin(velvetUv.y * 470.0 + sin(uTime * 0.055) * 0.30);
    float nap = (napDirection - 0.5) * 0.016;

    float sheenTravel = 0.5 + 0.5 * sin(uTime * 0.24);
    float sheenAxis = velvetUv.x * 0.64 + velvetUv.y * 0.30;
    float travelingSheen = exp(-pow((sheenAxis - mix(0.04, 1.02, sheenTravel)) * 3.35, 2.0));

    float napBand =
      0.5 + 0.5 * sin(velvetUv.y * 25.0 - uTime * 0.10 + sin(velvetUv.x * 5.0) * 0.45);
    float brushedLift = pow(max(0.0, velvetSheen), 1.15) * napBand;

    float cleanSheen = mix(0.58, 1.18, vCleanMask);
    float sheenStrength =
      0.22 * wHero +
      0.18 * wServices +
      0.25 * wResults * cleanSheen +
      0.14 * wProcess +
      0.33 * wAbout +
      0.16 * wBooking +
      0.20 * wFaq +
      0.18 * wFooter;

    float lighting = 0.47 + diffuse * 0.63 + reverseDiffuse * 0.08;
    vec3 color = base * lighting;
    color += velvetSheen * sheenStrength;
    color += travelingSheen * velvetSheen * (0.026 + 0.036 * wHero + 0.018 * wAbout);
    color += brushedLift * (0.018 + 0.030 * wHero + 0.012 * wServices);
    color += rim * (0.075 + 0.065 * wAbout);
    color += suedeGrain + broadNap + nap * 0.48;
    color += restorationLine * vec3(0.22, 0.21, 0.18);

    float pointerGlow = exp(-distance(vUv, uPointer) * 9.0);
    color += pointerGlow * 0.018 * (1.0 - wBooking);

    float centerVeil = smoothstep(0.82, 0.24, distance(vUv, vec2(0.5)));
    color += centerVeil * 0.018;

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
  const flowTarget = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const scrollRaf = useRef<number | null>(null);
  const measuredSections = useRef<Array<{ top: number; bottom: number; center: number }>>([]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: 0 },
          uLocal: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uPointerStrength: { value: quality === "low" ? 0 : 0.58 },
          uFlow: { value: 0 },
          uIntensity: { value: 1 },
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
    const measure = () => {
      const sections = SECTION_SELECTORS
        .map((selector) => document.querySelector<HTMLElement>(selector))
        .filter((element): element is HTMLElement => Boolean(element))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          return { top, bottom, center: top + rect.height * 0.5 };
        });

      if (sections.length === SECTION_SELECTORS.length) {
        measuredSections.current = sections;
      }
    };

    const updateScrollState = () => {
      scrollRaf.current = null;
      const now = performance.now();
      const y = window.scrollY;
      if (lastScrollTime.current > 0) {
        const dt = Math.max(now - lastScrollTime.current, 8);
        const velocity = ((y - lastScrollY.current) / dt) * 0.070;
        const nextFlow = THREE.MathUtils.clamp(velocity, -0.54, 0.54);
        flowTarget.current = THREE.MathUtils.lerp(flowTarget.current, nextFlow, 0.20);
      }
      lastScrollY.current = y;
      lastScrollTime.current = now;

      const sections = measuredSections.current;
      if (sections.length !== SECTION_SELECTORS.length) return;

      const viewportCenter = window.scrollY + window.innerHeight * 0.5;

      let phase = 0;
      if (viewportCenter <= sections[0].center) {
        phase = 0;
      } else if (viewportCenter >= sections[sections.length - 1].center) {
        phase = sections.length - 1;
      } else {
        for (let i = 0; i < sections.length - 1; i += 1) {
          const current = sections[i];
          const next = sections[i + 1];
          if (viewportCenter >= current.center && viewportCenter <= next.center) {
            const raw = THREE.MathUtils.clamp(
              (viewportCenter - current.center) / Math.max(next.center - current.center, 1),
              0,
              1,
            );
            const t = raw * raw * raw * (raw * (raw * 6 - 15) + 10);
            phase = i + t;
            break;
          }
        }
      }

      let activeIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        if (viewportCenter >= section.top && viewportCenter <= section.bottom) {
          activeIndex = index;
          smallestDistance = 0;
          return;
        }

        if (smallestDistance > 0) {
          const distance = Math.abs(viewportCenter - section.center);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            activeIndex = index;
          }
        }
      });

      const active = sections[activeIndex];
      const local = (viewportCenter - active.top) / Math.max(active.bottom - active.top, 1);

      phaseTarget.current = phase;
      localTarget.current = THREE.MathUtils.clamp(local, 0, 1);
    };

    const onScroll = () => {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = window.requestAnimationFrame(updateScrollState);
    };

    const onPointer = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / Math.max(window.innerWidth, 1),
        1 - event.clientY / Math.max(window.innerHeight, 1),
      );
    };

    const onResize = () => {
      measure();
      updateScrollState();
    };

    measure();
    updateScrollState();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      updateScrollState();
    });

    resizeObserver.observe(document.documentElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    if (quality !== "low") window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      resizeObserver.disconnect();
      if (scrollRaf.current !== null) window.cancelAnimationFrame(scrollRaf.current);
      window.removeEventListener("scroll", onScroll);
      if (quality !== "low") window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      material.dispose();
    };
  }, [material, quality]);

  useFrame(({ clock, camera }, delta) => {
    if (!mesh.current || document.hidden) return;

    const phase = material.uniforms.uPhase.value;
    const local = material.uniforms.uLocal.value;
    const flow = material.uniforms.uFlow.value;
    const phaseAlpha = 1 - Math.exp(-1.95 * delta);
    const localAlpha = 1 - Math.exp(-2.35 * delta);
    const pointerAlpha = 1 - Math.exp(-1.08 * delta);

    // Keep the material visibly alive even when scroll input is completely idle.
    // A slightly accelerated time base makes the velvet deformation readable
    // without making the scene feel nervous or tied to scroll velocity.
    const idleTime = clock.elapsedTime * 1.16;
    material.uniforms.uTime.value = idleTime;
    material.uniforms.uPhase.value = THREE.MathUtils.lerp(phase, phaseTarget.current, phaseAlpha);
    material.uniforms.uLocal.value = THREE.MathUtils.lerp(local, localTarget.current, localAlpha);
    material.uniforms.uPointer.value.lerp(pointer.current, pointerAlpha);
    material.uniforms.uFlow.value = THREE.MathUtils.lerp(flow, flowTarget.current, 1 - Math.exp(-2.9 * delta));
    flowTarget.current *= Math.pow(0.022, delta);

    const p = material.uniforms.uPhase.value;
    const targetIntensity = interpolateKeyframe([1.0, 0.86, 0.78, 0.68, 0.64, 0.56, 0.48, 0.42], p);
    material.uniforms.uIntensity.value = THREE.MathUtils.damp(
      material.uniforms.uIntensity.value,
      targetIntensity,
      2.4,
      delta,
    );
    const motionIntensity = material.uniforms.uIntensity.value;

    const idleX =
      Math.sin(idleTime * 0.42) * 0.060 +
      Math.sin(idleTime * 0.19) * 0.026;
    const idleY =
      Math.cos(idleTime * 0.34) * 0.044 +
      Math.sin(idleTime * 0.17) * 0.020;
    const idleZ =
      Math.sin(idleTime * 0.30) * 0.046 +
      Math.cos(idleTime * 0.15) * 0.022;
    const flowValue = material.uniforms.uFlow.value;

    const targetX = interpolateKeyframe([0.45, 0.15, -0.25, 0.28, -0.18, 0.10, 0.32, 0.05], p) + idleX * motionIntensity;
    const targetY = interpolateKeyframe([0.12, -0.12, 0.04, 0.15, -0.20, 0.08, -0.04, 0.16], p) + idleY * motionIntensity;
    const targetZ =
      interpolateKeyframe([-0.58, -0.62, -0.50, -0.64, -0.50, -0.70, -0.56, -0.62], p) +
      idleZ * motionIntensity +
      Math.abs(flowValue) * 0.020 * motionIntensity;
    const idleRX =
      Math.sin(idleTime * 0.32) * 0.022 +
      Math.cos(idleTime * 0.17) * 0.010;
    const idleRY =
      Math.sin(idleTime * 0.24) * 0.024 +
      Math.cos(idleTime * 0.14) * 0.010;
    const idleRZ =
      Math.cos(idleTime * 0.29) * 0.028 +
      Math.sin(idleTime * 0.18) * 0.014;
    const targetRX =
      interpolateKeyframe([-0.30, -0.19, -0.14, -0.20, -0.28, -0.10, -0.16, -0.28], p) +
      idleRX * motionIntensity -
      flowValue * 0.018 * motionIntensity;
    const targetRY = idleRY * motionIntensity + flowValue * 0.010 * motionIntensity;
    const targetRZ =
      interpolateKeyframe([-0.13, 0.05, -0.035, 0.025, -0.07, 0.018, 0.045, 0.11], p) +
      idleRZ * motionIntensity +
      flowValue * 0.025 * motionIntensity;

    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, targetX, 3.2, delta);
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, targetY, 3.2, delta);
    mesh.current.position.z = THREE.MathUtils.damp(mesh.current.position.z, targetZ, 3.2, delta);
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, targetRX, 3.0, delta);
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, targetRY, 2.7, delta);
    mesh.current.rotation.z = THREE.MathUtils.damp(mesh.current.rotation.z, targetRZ, 3.0, delta);

    const baseScale = interpolateKeyframe([1.42, 1.34, 1.40, 1.36, 1.44, 1.40, 1.38, 1.46], p);
    const idleBreathingScale =
      1 +
      (Math.sin(idleTime * 0.26) * 0.015 +
      Math.sin(idleTime * 0.13) * 0.008) * motionIntensity;
    const scale = baseScale * idleBreathingScale;
    const sx = THREE.MathUtils.damp(mesh.current.scale.x, scale, 3.1, delta);
    const sy = THREE.MathUtils.damp(mesh.current.scale.y, scale * 0.92, 3.1, delta);
    mesh.current.scale.set(sx, sy, 1);

    const cameraX =
      interpolateKeyframe([0.04, 0.0, -0.05, 0.04, -0.03, 0.0, 0.03, 0.0], p) +
      Math.sin(idleTime * 0.40) * 0.044 * motionIntensity +
      Math.sin(idleTime * 0.23) * 0.022 * motionIntensity +
      flowValue * 0.010 * motionIntensity;
    const cameraY =
      interpolateKeyframe([0.03, -0.02, 0.0, 0.03, -0.02, 0.0, 0.02, 0.0], p) +
      Math.cos(idleTime * 0.32) * 0.034 * motionIntensity;
    const cameraZ =
      5.45 +
      Math.sin(idleTime * 0.30) * 0.082 * motionIntensity +
      Math.cos(idleTime * 0.16) * 0.036 * motionIntensity;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraX, 2.15, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraY, 2.15, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraZ, 1.8, delta);
    camera.lookAt(0, 0, 0);
  });

  const segments =
    quality === "high"
      ? ([104, 78] as const)
      : quality === "medium"
        ? ([72, 54] as const)
        : ([34, 26] as const);

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
  const [sceneReady, setSceneReady] = useState(false);

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

  useEffect(() => {
    if (!reducedMotion) return;
    const win = window as Window & { __wvSceneReady?: boolean };
    win.__wvSceneReady = true;
    window.dispatchEvent(new Event("wv:scene-ready"));
    setSceneReady(true);
  }, [reducedMotion]);

  const signalSceneReady = () => {
    const win = window as Window & { __wvSceneReady?: boolean };
    win.__wvSceneReady = true;
    window.requestAnimationFrame(() => {
      setSceneReady(true);
      window.dispatchEvent(new Event("wv:scene-ready"));
    });
  };

  if (reducedMotion) {
    return <div className="three-fallback three-scene-ready" aria-hidden="true" />;
  }

  const dpr: [number, number] =
    quality === "high" ? [1, 1.3] : quality === "medium" ? [1, 1.1] : [1, 1.0];

  return (
    <div className={`three-layer three-quality-${quality} ${sceneReady ? "three-scene-ready" : ""}`} aria-hidden="true">
      <Canvas
        frameloop="always"
        onCreated={signalSceneReady}
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
      <div className="three-atmosphere">
        <span className="ambient-sheen ambient-sheen-a" />
        <span className="ambient-sheen ambient-sheen-b" />
      </div>
    </div>
  );
}
