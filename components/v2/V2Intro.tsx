"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const DURATION = 4000;

export default function V2Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    let sceneReady = Boolean((window as Window & { __wvV2SceneReady?: boolean }).__wvV2SceneReady);
    let minimumReady = false;
    let finished = false;
    let displayed = 0;
    const started = performance.now();

    document.documentElement.classList.add("v2-intro-lock");

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const ratio = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - ratio, 2.1);
      let target = eased * 94 + (sceneReady ? 5 : 0);
      target = Math.min(target, 99);
      displayed += (target - displayed) * 0.18;
      setProgress(Math.round(displayed));
    }, 48);

    const complete = () => {
      if (finished || !minimumReady || !sceneReady) return;
      finished = true;
      window.clearInterval(interval);
      setProgress(100);

      if (reduce) {
        document.documentElement.classList.remove("v2-intro-lock");
        setVisible(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("v2-intro-lock");
          setVisible(false);
        },
      });

      tl.to(".v2-loader-mark", {
        scale: 1.12,
        letterSpacing: "0.22em",
        duration: 0.65,
        ease: "power3.inOut",
      }, 0)
        .to(".v2-loader-rule span", {
          scaleX: 1,
          duration: 0.45,
          ease: "power2.out",
        }, 0)
        .to(root, {
          autoAlpha: 0,
          scale: 1.025,
          duration: 0.78,
          ease: "power3.inOut",
        }, 0.35)
        .fromTo(".v2-hero-reveal", {
          y: 36,
          opacity: 0,
          filter: "blur(10px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.09,
          ease: "power4.out",
        }, 0.48)
        .fromTo(".v2-site-header", {
          y: -18,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        }, 0.64)
        .fromTo(".v2-hero-index", {
          opacity: 0,
          x: 18,
        }, {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
        }, 0.82);
    };

    const onScene = () => {
      sceneReady = true;
      complete();
    };

    window.addEventListener("wv:v2-scene-ready", onScene);

    const minimumTimer = window.setTimeout(() => {
      minimumReady = true;
      complete();
    }, DURATION);

    const safety = window.setTimeout(() => {
      sceneReady = true;
      minimumReady = true;
      complete();
    }, 6500);

    return () => {
      window.removeEventListener("wv:v2-scene-ready", onScene);
      window.clearInterval(interval);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safety);
      document.documentElement.classList.remove("v2-intro-lock");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="v2-loader" ref={rootRef} role="status" aria-label={`White Velvet laddar ${progress} procent`}>
      <div className="v2-loader-material" aria-hidden="true" />
      <div className="v2-loader-core">
        <p className="v2-loader-kicker">MATERIAL CARE / VÄSTERÅS</p>
        <div className="v2-loader-mark">WHITE VELVET</div>
        <div className="v2-loader-rule" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="v2-loader-meta">
          <span>RESTORING SURFACE</span>
          <strong>{progress.toString().padStart(2, "0")}%</strong>
        </div>
      </div>
    </div>
  );
}
