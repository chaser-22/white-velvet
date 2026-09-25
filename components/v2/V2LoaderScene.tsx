"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying float vDepth;
varying float vFold;

float waveField(vec2 p, float t) {
  float broad =
    sin(p.x * 0.72 + t * 0.30) * 0.18 +
    cos(p.y * 0.88 - t * 0.24) * 0.14 +
    sin((p.x + p.y) * 0.34 + t * 0.18) * 0.09;
  float soft =
    sin(p.y * 1.8 + t * 0.42) * 0.035 +
    cos(p.x * 1.5 - t * 0.33) * 0.028;
  return broad + soft;
}

void main() {
  vUv = uv;
  vec3 p = position;
  float t = uTime;

  float fold = waveField(p.xy, t);
  float centerLift = exp(-distance(uv, vec2(0.5, 0.48)) * 3.0) * 0.14;
  p.z += fold + centerLift;
  p.x += sin(p.y * 0.48 + t * 0.15) * 0.035;

  vDepth = p.z;
  vFold = fold;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying float vDepth;
varying float vFold;

void main() {
  vec3 ivory = vec3(0.94, 0.915, 0.865);
  vec3 shadow = vec3(0.11, 0.12, 0.115);

  float center = 1.0 - smoothstep(0.06, 0.78, distance(vUv, vec2(0.5, 0.47)));
  float broadLight = 0.20 + center * 0.72 + vDepth * 0.38 + vFold * 0.10;

  float napA = 0.5 + 0.5 * sin(vUv.y * 520.0 + sin(vUv.x * 28.0) * 1.4);
  float napB = 0.5 + 0.5 * sin(vUv.y * 168.0 - vUv.x * 17.0);
  float nap = (napA - 0.5) * 0.024 + (napB - 0.5) * 0.014;

  float sweepPos = 0.18 + (0.5 + 0.5 * sin(uTime * 0.34)) * 0.64;
  float sweep = exp(-pow((vUv.x * 0.78 + vUv.y * 0.22) - sweepPos, 2.0) * 16.0);

  float edge = smoothstep(0.35, 0.90, distance(vUv, vec2(0.5)));
  vec3 color = mix(shadow, ivory, clamp(broadLight, 0.0, 1.0));
  color += nap;
  color += sweep * vec3(0.08, 0.075, 0.06);
  color = mix(color, shadow, edge * 0.38);

  gl_FragColor = vec4(color, 1.0);
}
`;

function LoaderFabric() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock, camera }, delta) => {
    if (!mesh.current) return;

    const t = clock.elapsedTime;
    material.uniforms.uTime.value = t;

    mesh.current.rotation.x = THREE.MathUtils.damp(
      mesh.current.rotation.x,
      -0.17 + Math.sin(t * 0.18) * 0.018,
      2.0,
      delta,
    );
    mesh.current.rotation.y = THREE.MathUtils.damp(
      mesh.current.rotation.y,
      Math.sin(t * 0.14) * 0.018,
      2.0,
      delta,
    );
    mesh.current.rotation.z = THREE.MathUtils.damp(
      mesh.current.rotation.z,
      -0.018 + Math.cos(t * 0.16) * 0.012,
      2.0,
      delta,
    );

    const breathe = 1.54 + Math.sin(t * 0.32) * 0.018;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, breathe, 2.2, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, breathe * 0.96, 2.2, delta);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(t * 0.12) * 0.035, 1.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, Math.cos(t * 0.10) * 0.025, 1.8, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[10.2, 8.1, 64, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function V2LoaderScene() {
  return (
    <div className="v2-loader-canvas" aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, 1.15]}
        camera={{ position: [0, 0, 4.3], fov: 42 }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={() => {
          const win = window as Window & { __wvV2LoaderReady?: boolean };
          win.__wvV2LoaderReady = true;
          window.dispatchEvent(new Event("wv:v2-loader-ready"));
        }}
      >
        <color attach="background" args={["#d8d2c5"]} />
        <LoaderFabric />
      </Canvas>
    </div>
  );
}
