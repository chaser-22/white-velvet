"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import V2LoaderScene from "./V2LoaderScene";

const MIN_DURATION = 3200;
const SAFETY_DURATION = 7000;

type IntroState = {
  active: boolean;
  progress: number;
};

type WVWindow = Window & {
  __wvV2LoaderReady?: boolean;
  __wvV2IntroState?: IntroState;
  __wvV2IntroHandoff?: boolean;
  __wvV2IntroComplete?: boolean;
};

export default function V2Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    const percent = percentRef.current;
    if (!root || !line || !percent) return;

    const win = window as WVWindow;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;
    let safetyTimer = 0;
    let minimumTimer = 0;
    let entryTimeline: gsap.core.Timeline | null = null;
    let exitTimeline: gsap.core.Timeline | null = null;
    let completed = false;
    let displayed = 0;
    let lastDisplayed = -1;
    let lastFrame = performance.now();

    let loaderReady = Boolean(win.__wvV2LoaderReady);
    let fontsReady = !document.fonts;
    let windowReady = document.readyState === "complete";
    let minimumReady = false;

    const started = performance.now();
    const minimumDuration = reduce ? 700 : MIN_DURATION;

    win.__wvV2IntroState = { active: true, progress: 0 };
    document.documentElement.classList.add("v2-intro-lock");

    const renderProgress = (value: number) => {
      const clamped = Math.max(0, Math.min(100, value));
      const rounded = Math.round(clamped);

      // Keep the bar fully continuous at frame rate; only the text is quantized.
      line.style.transform = `translateZ(0) scaleX(${clamped / 100})`;

      if (rounded !== lastDisplayed) {
        lastDisplayed = rounded;
        percent.textContent = `${rounded.toString().padStart(2, "0")}%`;
        root.setAttribute("aria-valuenow", String(rounded));
      }

      if (win.__wvV2IntroState) win.__wvV2IntroState.progress = clamped;
    };

    gsap.set(root, { force3D: true });
    gsap.set([line, percent], { force3D: true });

    entryTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    entryTimeline
      .fromTo(".v2-loader-seal", {
        opacity: 0,
        scale: 0.88,
        filter: "blur(10px)",
      }, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: reduce ? 0.01 : 1.05,
      }, 0.08)
      .fromTo(".v2-loader-mark", {
        opacity: 0,
        y: 18,
        filter: "blur(12px)",
        letterSpacing: "-0.015em",
      }, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        letterSpacing: "-0.045em",
        duration: reduce ? 0.01 : 1.28,
      }, 0.18)
      .fromTo(".v2-loader-progress", {
        opacity: 0,
        y: 10,
      }, {
        opacity: 1,
        y: 0,
        duration: reduce ? 0.01 : 0.92,
      }, 0.68);

    const finish = () => {
      if (!alive || completed) return;
      completed = true;
      gsap.ticker.remove(tick);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(minimumTimer);

      displayed = 100;
      renderProgress(100);
      win.__wvV2IntroState = { active: false, progress: 100 };
      win.__wvV2IntroHandoff = true;
      document.documentElement.classList.add("v2-intro-handoff");
      window.dispatchEvent(new Event("wv:intro-handoff"));

      const finalize = () => {
        if (!alive) return;
        document.documentElement.classList.remove("v2-intro-lock");
        document.documentElement.classList.remove("v2-intro-handoff");
        win.__wvV2IntroComplete = true;
        window.dispatchEvent(new Event("wv:intro-complete"));
        setVisible(false);
      };

      if (reduce) {
        root.style.opacity = "0";
        finalize();
        return;
      }

      exitTimeline = gsap.timeline({ onComplete: finalize });
      exitTimeline
        .to(".v2-loader-progress", {
          opacity: 0,
          y: -8,
          duration: 0.46,
          ease: "power2.inOut",
        }, 0)
        .to(".v2-loader-seal", {
          opacity: 0,
          scale: 1.08,
          filter: "blur(8px)",
          duration: 0.72,
          ease: "power2.inOut",
        }, 0.03)
        .to(".v2-loader-mark", {
          opacity: 0,
          y: -10,
          scale: 1.045,
          filter: "blur(7px)",
          letterSpacing: "-0.025em",
          duration: 0.82,
          ease: "power3.inOut",
        }, 0.04)
        .to(root, {
          autoAlpha: 0,
          duration: 1.04,
          ease: "power2.inOut",
        }, 0.18)
        .fromTo(".v2-site-header", {
          y: -24,
          opacity: 0,
          filter: "blur(8px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.02,
          ease: "power3.out",
        }, 0.34)
        .fromTo(".v2-hero-copy .v2-overline", {
          y: 22,
          opacity: 0,
          filter: "blur(8px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.86,
          ease: "power3.out",
        }, 0.46)
        .fromTo(".v2-hero h1", {
          y: 34,
          opacity: 0,
          filter: "blur(12px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.14,
          ease: "power4.out",
        }, 0.54)
        .fromTo(".v2-hero-lead", {
          y: 26,
          opacity: 0,
          filter: "blur(9px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.96,
          ease: "power3.out",
        }, 0.72)
        .fromTo(".v2-hero-actions", {
          y: 20,
          opacity: 0,
          filter: "blur(7px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.88,
          ease: "power3.out",
        }, 0.88);
    };

    const onLoaderReady = () => {
      loaderReady = true;
    };

    const onWindowLoad = () => {
      windowReady = true;
    };

    window.addEventListener("wv:v2-loader-ready", onLoaderReady);
    window.addEventListener("load", onWindowLoad, { once: true });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (alive) fontsReady = true;
      });
    }

    minimumTimer = window.setTimeout(() => {
      minimumReady = true;
    }, minimumDuration);

    safetyTimer = window.setTimeout(() => {
      loaderReady = true;
      fontsReady = true;
      windowReady = true;
      minimumReady = true;
      finish();
    }, SAFETY_DURATION);

    const tick = () => {
      if (!alive || completed) return;

      const now = performance.now();
      const delta = Math.min((now - lastFrame) / 1000, 0.08);
      lastFrame = now;
      const elapsed = now - started;
      const timeReady = Math.min(elapsed / minimumDuration, 1);

      const readinessBoost =
        (loaderReady ? 3.0 : 0) +
        (fontsReady ? 1.5 : 0) +
        (windowReady ? 1.5 : 0);

      const allReady = loaderReady && fontsReady && windowReady && minimumReady;
      const easedTime = timeReady * timeReady * (3.0 - 2.0 * timeReady);
      const target = allReady ? 100 : Math.min(96, 4 + easedTime * 86 + readinessBoost);
      const smoothing = 1 - Math.exp(-delta * (target === 100 ? 5.4 : 3.35));

      displayed += (target - displayed) * smoothing;
      renderProgress(displayed);

      if (allReady && displayed >= 99.15) {
        finish();
        return;
      }

    };

    gsap.ticker.add(tick);

    return () => {
      alive = false;
      gsap.ticker.remove(tick);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(minimumTimer);
      window.removeEventListener("wv:v2-loader-ready", onLoaderReady);
      window.removeEventListener("load", onWindowLoad);
      entryTimeline?.kill();
      exitTimeline?.kill();
      document.documentElement.classList.remove("v2-intro-lock");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="v2-loader"
      ref={rootRef}
      role="progressbar"
      aria-label="White Velvet laddar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <V2LoaderScene />
      <div className="v2-loader-sheen" aria-hidden="true" />
      <div className="v2-loader-core">
        <div className="v2-loader-seal" aria-hidden="true">W</div>
        <div className="v2-loader-mark">WHITE VELVET</div>
        <div className="v2-loader-progress">
          <strong ref={percentRef}>00%</strong>
          <div className="v2-loader-rule" aria-hidden="true">
            <span ref={lineRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
