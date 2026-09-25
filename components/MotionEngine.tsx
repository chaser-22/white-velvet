"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type WVWindow = Window & {
  __wvV2IntroComplete?: boolean;
};

export default function MotionEngine() {
  useEffect(() => {
    let stopEngine: (() => void) | null = null;
    let disposed = false;

    const startEngine = () => {
      if (disposed || stopEngine) return;

      gsap.registerPlugin(ScrollTrigger);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        ScrollTrigger.refresh();
        stopEngine = () => {};
        return;
      }

      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      const lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
        syncTouch: false,
        anchors: {
          offset: -88,
          duration: 1,
        },
      });

      let resizeTimer = 0;
      let alive = true;

      const onScroll = () => ScrollTrigger.update();
      const raf = (time: number) => lenis.raf(time * 1000);

      const refresh = () => {
        if (!alive) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!alive) return;
            lenis.resize();
            ScrollTrigger.refresh();
          });
        });
      };

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(refresh, 90);
      };

      lenis.on("scroll", onScroll);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("load", refresh, { once: true });

      if (document.fonts) {
        document.fonts.ready.then(() => {
          if (alive) refresh();
        });
      }

      refresh();

      stopEngine = () => {
        alive = false;
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", refresh);
        gsap.ticker.remove(raf);
        lenis.destroy();
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      };
    };

    const win = window as WVWindow;
    if (win.__wvV2IntroComplete) {
      startEngine();
    } else {
      window.addEventListener("wv:intro-complete", startEngine, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("wv:intro-complete", startEngine);
      stopEngine?.();
    };
  }, []);

  return null;
}
