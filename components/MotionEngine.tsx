"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type WVWindow = Window & {
  __wvV2IntroComplete?: boolean;
};

type RevealOptions = {
  trigger: Element;
  targets: Element[];
  y?: number;
  blur?: number;
  scale?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  delay?: number;
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
      const scrollAnimations: gsap.core.Animation[] = [];
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const defaultStart = isMobile ? "top 90%" : "top 84%";
      const defaultY = isMobile ? 18 : 30;
      const defaultBlur = isMobile ? 3 : 6;
      const defaultDuration = isMobile ? 0.72 : 0.9;
      const defaultStagger = isMobile ? 0.065 : 0.09;

      const elements = (selector: string, scope: ParentNode = document) =>
        Array.from(scope.querySelectorAll(selector));

      const reveal = ({
        trigger,
        targets,
        y = defaultY,
        blur = defaultBlur,
        scale = 1,
        stagger = defaultStagger,
        duration = defaultDuration,
        start = defaultStart,
        delay = 0,
      }: RevealOptions) => {
        if (!targets.length) return;

        gsap.set(targets, {
          autoAlpha: 0,
          y,
          scale,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
          willChange: "transform, opacity, filter",
          force3D: true,
        });

        const timeline = gsap.timeline({
          delay,
          defaults: {
            duration,
            ease: "power3.out",
          },
          scrollTrigger: {
            trigger,
            start,
            once: true,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(targets, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger,
          force3D: true,
          onComplete: () => {
            gsap.set(targets, {
              clearProps: "transform,opacity,visibility,filter,willChange",
            });
          },
        });

        scrollAnimations.push(timeline);
      };

      const revealSectionLabel = (
        _section: Element,
        label: Element | null,
        _start?: string,
      ) => {
        if (!label) return;

        const text = label.querySelector("p");

        gsap.set(label, {
          opacity: 0.035,
          y: isMobile ? 10 : 15,
          scale: isMobile ? 0.995 : 0.992,
          filter: isMobile ? "blur(3px)" : "blur(5px)",
          force3D: true,
          willChange: "transform, opacity, filter",
        });

        if (text) {
          gsap.set(text, {
            opacity: 0,
            y: isMobile ? 7 : 10,
            letterSpacing: isMobile ? ".245em" : ".27em",
            force3D: true,
            willChange: "transform, opacity, letter-spacing",
          });
        }

        const timeline = gsap.timeline({
          paused: true,
          defaults: { overwrite: "auto" },
        });

        timeline.to(label, {
          opacity: 0.56,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: isMobile ? 1.0 : 1.34,
          ease: "power3.out",
          force3D: true,
        });

        if (text) {
          timeline.to(
            text,
            {
              opacity: 1,
              y: 0,
              letterSpacing: ".19em",
              duration: isMobile ? 0.94 : 1.2,
              ease: "power3.out",
              force3D: true,
            },
            isMobile ? 0.10 : 0.16,
          );
        }

        timeline.eventCallback("onComplete", () => {
          gsap.set(label, {
            clearProps: "transform,filter,willChange",
          });
          if (text) {
            gsap.set(text, {
              clearProps: "transform,opacity,letterSpacing,willChange",
            });
          }
        });

        const trigger = ScrollTrigger.create({
          trigger: label,
          start: isMobile ? "top 96%" : "top 93%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => timeline.play(),
        });

        timeline.scrollTrigger = trigger;
        scrollAnimations.push(timeline);
      };

      const site = document.querySelector(".v2-site");

      if (site) {
        const services = site.querySelector(".v2-services");
        if (services) {
          const label = services.querySelector(".v2-section-label");
          const heading = services.querySelector(".v2-service-intro h2");

          revealSectionLabel(
            services,
            label,
            isMobile ? "top 92%" : "top 86%",
          );

          reveal({
            trigger: services,
            targets: [heading].filter(Boolean) as Element[],
            y: isMobile ? 14 : 24,
            blur: isMobile ? 2 : 5,
            stagger: 0,
            duration: isMobile ? 0.82 : 1.02,
            start: isMobile ? "top 90%" : "top 84%",
          });

          elements(".v2-service-row", services).forEach((row, index) => {
            const media = row.querySelector(".v2-service-media");
            const copy = elements(
              ".v2-service-copy > p, .v2-service-copy > h3, .v2-service-copy > strong, .v2-service-detail",
              row,
            );

            reveal({
              trigger: row,
              targets: [media, ...copy].filter(Boolean) as Element[],
              y: isMobile ? 18 : 34,
              blur: isMobile ? 2 : 5,
              scale: index % 2 === 0 ? 0.992 : 0.988,
              stagger: isMobile ? 0.055 : 0.075,
              duration: isMobile ? 0.7 : 0.88,
              start: isMobile ? "top 91%" : "top 82%",
            });
          });
        }

        const results = site.querySelector(".v2-results");
        if (results) {
          revealSectionLabel(
            results,
            results.querySelector(".v2-section-label"),
            isMobile ? "top 92%" : "top 86%",
          );

          const introTargets = [
            results.querySelector(".v2-results-intro h2"),
            results.querySelector(".v2-results-intro > span"),
          ].filter(Boolean) as Element[];

          reveal({
            trigger: results,
            targets: introTargets,
            y: isMobile ? 18 : 32,
            blur: isMobile ? 3 : 6,
            stagger: isMobile ? 0.075 : 0.11,
            duration: isMobile ? 0.76 : 0.96,
            start: isMobile ? "top 89%" : "top 83%",
          });

          const compareGrid = results.querySelector(".v2-compare-grid");
          if (compareGrid) {
            reveal({
              trigger: compareGrid,
              targets: elements(".v2-compare", compareGrid),
              y: isMobile ? 18 : 36,
              blur: isMobile ? 2 : 5,
              scale: 0.985,
              stagger: isMobile ? 0.08 : 0.13,
              duration: isMobile ? 0.76 : 0.96,
              start: isMobile ? "top 91%" : "top 84%",
            });
          }
        }

        const booking = site.querySelector(".v2-booking-stage");
        if (booking) {
          const heading = booking.querySelector(".booking-heading");
          const headingTargets = heading
            ? elements("h2, p", heading)
            : [];

          revealSectionLabel(
            booking,
            booking.querySelector(".v2-section-label"),
            isMobile ? "top 92%" : "top 86%",
          );

          reveal({
            trigger: booking,
            targets: headingTargets.filter(Boolean) as Element[],
            y: isMobile ? 16 : 28,
            blur: isMobile ? 2 : 5,
            stagger: isMobile ? 0.07 : 0.105,
            duration: isMobile ? 0.72 : 0.9,
            start: isMobile ? "top 89%" : "top 83%",
          });

          const bookingCard = booking.querySelector(".booking-card");
          if (bookingCard) {
            reveal({
              trigger: bookingCard,
              targets: [bookingCard],
              y: isMobile ? 16 : 30,
              blur: isMobile ? 2 : 5,
              scale: 0.985,
              stagger: 0,
              duration: isMobile ? 0.8 : 1.02,
              start: isMobile ? "top 92%" : "top 86%",
            });
          }
        }

        const faq = site.querySelector(".v2-faq");
        if (faq) {
          revealSectionLabel(
            faq,
            faq.querySelector(".v2-section-label"),
            isMobile ? "top 92%" : "top 86%",
          );

          const faqHeaderTargets = [
            faq.querySelector(".v2-faq-grid h2"),
          ].filter(Boolean) as Element[];

          reveal({
            trigger: faq,
            targets: faqHeaderTargets,
            y: isMobile ? 16 : 28,
            blur: isMobile ? 2 : 5,
            stagger: 0.1,
            duration: isMobile ? 0.72 : 0.9,
            start: isMobile ? "top 89%" : "top 83%",
          });

          const faqList = faq.querySelector(".v2-faq-list");
          if (faqList) {
            reveal({
              trigger: faqList,
              targets: elements(".v2-faq-item", faqList),
              y: isMobile ? 12 : 20,
              blur: isMobile ? 1.5 : 3,
              stagger: isMobile ? 0.055 : 0.075,
              duration: isMobile ? 0.62 : 0.76,
              start: isMobile ? "top 91%" : "top 84%",
            });
          }
        }

        const footer = site.querySelector(".v2-footer");
        if (footer) {
          const footerGrid = footer.querySelector(".v2-footer-grid");
          if (footerGrid) {
            reveal({
              trigger: footer,
              targets: elements(":scope > div", footerGrid),
              y: isMobile ? 12 : 20,
              blur: isMobile ? 1.5 : 3,
              stagger: isMobile ? 0.055 : 0.085,
              duration: isMobile ? 0.62 : 0.76,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

          const footerBottom = footer.querySelector(".v2-footer-bottom");
          if (footerBottom) {
            reveal({
              trigger: footerBottom,
              targets: [footerBottom],
              y: isMobile ? 8 : 14,
              blur: isMobile ? 1 : 2,
              stagger: 0,
              duration: isMobile ? 0.56 : 0.68,
              start: isMobile ? "top 96%" : "top 94%",
            });
          }
        }
      }

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

        scrollAnimations.forEach((animation) => {
          animation.scrollTrigger?.kill();
          animation.kill();
        });

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
