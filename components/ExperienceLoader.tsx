"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const INTRO_KEY = "wv:intro-seen-v4";
const MINIMUM_DURATION = 4000;
const SAFETY_DURATION = 6200;

export default function ExperienceLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (window.sessionStorage.getItem(INTRO_KEY) === "1") {
      root.classList.remove("wv-intro-pending", "wv-intro-active", "wv-intro-entering");
      setVisible(false);
      return;
    }

    root.classList.remove("wv-intro-active", "wv-intro-entering");
    root.classList.add("wv-intro-pending");

    const startedAt = performance.now();
    let sceneReady = Boolean((window as Window & { __wvSceneReady?: boolean }).__wvSceneReady);
    let fontsReady = !document.fonts;
    let minimumElapsed = false;
    let exiting = false;
    let holdTimer = 0;
    let safetyTimer = 0;
    let displayedProgress = 0;

    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const timeRatio = Math.min(elapsed / MINIMUM_DURATION, 1);

      let target =
        timeRatio < 0.78
          ? timeRatio * 108
          : 84 + ((timeRatio - 0.78) / 0.22) * 10;

      if (sceneReady) target += 3;
      if (fontsReady) target += 2;

      target = Math.min(target, 99);
      displayedProgress += (target - displayedProgress) * 0.22;
      setProgress(Math.max(0, Math.min(99, Math.round(displayedProgress))));
    }, 48);

    const completeEntrance = () => {
      window.sessionStorage.setItem(INTRO_KEY, "1");
      root.classList.remove("wv-intro-active", "wv-intro-pending", "wv-intro-entering");
      setVisible(false);
      window.dispatchEvent(new CustomEvent("wv:intro-complete"));
    };

    const runEntrance = () => {
      if (exiting) return;
      exiting = true;
      window.clearInterval(progressTimer);
      setProgress(100);

      holdTimer = window.setTimeout(() => {
        const loader = loaderRef.current;
        const header = document.querySelector<HTMLElement>(".site-header");
        const heroItems = gsap.utils.toArray<HTMLElement>(
          ".hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .hero-lead, .hero-copy > .hero-actions",
        );
        const trust = document.querySelector<HTMLElement>(".trust-strip");
        const three = document.querySelector<HTMLElement>(".three-layer");
        const atmosphere = document.querySelector<HTMLElement>(".three-atmosphere");

        if (reduceMotion || !loader) {
          root.classList.remove("wv-intro-pending");
          completeEntrance();
          return;
        }

        if (header) {
          gsap.set(header, {
            autoAlpha: 0,
            y: -18,
            scale: 0.975,
            willChange: "transform,opacity",
          });
        }

        gsap.set(heroItems, {
          autoAlpha: 0,
          y: 30,
          filter: "blur(9px)",
          willChange: "transform,opacity,filter",
        });

        if (trust) {
          gsap.set(trust, {
            autoAlpha: 0,
            y: 34,
            scale: 0.985,
            willChange: "transform,opacity",
          });
        }

        if (three) {
          gsap.set(three, {
            opacity: 0.58,
            scale: 1.052,
            willChange: "transform,opacity",
          });
        }

        if (atmosphere) {
          gsap.set(atmosphere, {
            opacity: 0.2,
            scale: 1.035,
            willChange: "transform,opacity",
          });
        }

        root.classList.add("wv-intro-active");
        root.classList.remove("wv-intro-pending");
        window.dispatchEvent(new CustomEvent("wv:intro-enter"));

        const timeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            const clearTargets = [header, trust, three, atmosphere, ...heroItems].filter(Boolean);
            gsap.set(clearTargets, {
              clearProps: "transform,opacity,visibility,filter,willChange",
            });
            completeEntrance();
          },
        });

        timeline
          .to(
            loader,
            {
              opacity: 0,
              scale: 1.018,
              duration: 0.7,
              ease: "power3.inOut",
            },
            0,
          )
          .to(
            three,
            {
              opacity: 1,
              scale: 1,
              duration: 1.55,
              ease: "power3.out",
            },
            0.08,
          )
          .to(
            atmosphere,
            {
              opacity: 0.56,
              scale: 1,
              duration: 1.45,
              ease: "power3.out",
            },
            0.12,
          )
          .to(
            header,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.02,
            },
            0.16,
          )
          .to(
            heroItems,
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.08,
              stagger: 0.105,
            },
            0.2,
          )
          .to(
            trust,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.12,
              ease: "power3.out",
            },
            0.62,
          );
      }, 150);
    };

    const maybeExit = () => {
      if (sceneReady && fontsReady && minimumElapsed) runEntrance();
    };

    const onSceneReady = () => {
      sceneReady = true;
      maybeExit();
    };

    window.addEventListener("wv:scene-ready", onSceneReady);

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      maybeExit();
    }, MINIMUM_DURATION);

    safetyTimer = window.setTimeout(() => {
      sceneReady = true;
      fontsReady = true;
      minimumElapsed = true;
      runEntrance();
    }, SAFETY_DURATION);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        maybeExit();
      });
    }

    return () => {
      window.removeEventListener("wv:scene-ready", onSceneReady);
      window.clearInterval(progressTimer);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(holdTimer);
      gsap.killTweensOf([
        loaderRef.current,
        ".site-header",
        ".hero-copy > .eyebrow",
        ".hero-copy > h1",
        ".hero-copy > .hero-lead",
        ".hero-copy > .hero-actions",
        ".trust-strip",
        ".three-layer",
        ".three-atmosphere",
      ]);
      root.classList.remove("wv-intro-pending", "wv-intro-active", "wv-intro-entering");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      className="experience-loader experience-loader-minimal"
      role="status"
      aria-live="polite"
      aria-label={`White Velvet laddar ${progress} procent`}
    >
      <div className="loader-velvet-field" aria-hidden="true">
        <span className="loader-velvet-fold loader-velvet-fold-a" />
        <span className="loader-velvet-fold loader-velvet-fold-b" />
        <span className="loader-velvet-glow" />
      </div>

      <div className="loader-minimal-brand">
        <div className="loader-minimal-mark" aria-hidden="true">WV</div>
        <div className="loader-minimal-name">WHITE VELVET</div>

        <div className="loader-minimal-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="loader-minimal-percent" aria-hidden="true">
          {progress}%
        </div>
      </div>
    </div>
  );
}
