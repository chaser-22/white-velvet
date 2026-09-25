"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const MINIMUM = 3200;

export default function V3Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sceneReady = Boolean((window as Window & { __wvV3SceneReady?: boolean }).__wvV3SceneReady);
    let timeReady = false;
    let done = false;
    let value = 0;
    const started = performance.now();

    document.documentElement.classList.add("v3-lock");

    const ticker = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const ratio = Math.min(elapsed / MINIMUM, 1);
      const target = Math.min(99, (1 - Math.pow(1 - ratio, 2.2)) * 93 + (sceneReady ? 6 : 0));
      value += (target - value) * 0.20;
      setProgress(Math.round(value));
    }, 45);

    const finish = () => {
      if (done || !sceneReady || !timeReady) return;
      done = true;
      window.clearInterval(ticker);
      setProgress(100);

      if (reduce) {
        document.documentElement.classList.remove("v3-lock");
        setVisible(false);
        return;
      }

      gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("v3-lock");
          setVisible(false);
        },
      })
        .to(".v3-loader-slit", { scaleY: 1, duration: 0.55, ease: "power3.inOut" }, 0)
        .to(".v3-loader-word", { yPercent: -110, opacity: 0, duration: 0.65, ease: "power3.inOut" }, 0.25)
        .to(root, { autoAlpha: 0, duration: 0.65, ease: "power2.out" }, 0.46)
        .fromTo(".v3-enter", { y: 34, opacity: 0, filter: "blur(10px)" }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.0,
          stagger: 0.08,
          ease: "power4.out",
        }, 0.48)
        .fromTo(".v3-header", { opacity: 0, y: -12 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }, 0.65);
    };

    const onScene = () => {
      sceneReady = true;
      finish();
    };

    window.addEventListener("wv:v3-scene-ready", onScene);

    const timer = window.setTimeout(() => {
      timeReady = true;
      finish();
    }, MINIMUM);

    const safety = window.setTimeout(() => {
      sceneReady = true;
      timeReady = true;
      finish();
    }, 5600);

    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(timer);
      window.clearTimeout(safety);
      window.removeEventListener("wv:v3-scene-ready", onScene);
      document.documentElement.classList.remove("v3-lock");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="v3-loader" ref={ref} role="status" aria-label={`White Velvet laddar ${progress} procent`}>
      <div className="v3-loader-field" />
      <div className="v3-loader-slit" />
      <div className="v3-loader-center">
        <span>VÄSTERÅS / MATERIAL CARE</span>
        <strong className="v3-loader-word">WHITE VELVET</strong>
        <div className="v3-loader-progress">
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div><span>FIELD INITIALISING</span><b>{progress.toString().padStart(2, "0")}%</b></div>
      </div>
    </div>
  );
}
