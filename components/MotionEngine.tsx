"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionEngine() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      ScrollTrigger.refresh();
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

    window.addEventListener("wv:intro-complete", refresh);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", refresh, { once: true });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (alive) refresh();
      });
    }

    refresh();

    return () => {
      alive = false;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("wv:intro-complete", refresh);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return null;
}
