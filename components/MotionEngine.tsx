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
      ScrollTrigger.config({ ignoreMobileResize: true });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        ScrollTrigger.refresh();
        stopEngine = () => {};
        return;
      }

      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = isMobile ? "smooth" : "auto";

      // Touch scrolling stays native on phones. Lenis remains desktop-only so
      // mobile Safari/Chrome can use their compositor scroll path directly.
      const lenis = isMobile
        ? null
        : new Lenis({
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
      let lastViewportWidth = window.innerWidth;
      const scrollAnimations: gsap.core.Animation[] = [];
      const revealCoverage = new Set<Element>();
      const defaultStart = isMobile ? "top 90%" : "top 84%";
      const defaultY = isMobile ? 12 : 30;
      const defaultBlur = isMobile ? 0 : 6;
      const defaultDuration = isMobile ? 0.68 : 0.9;
      const defaultStagger = isMobile ? 0.055 : 0.09;

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

        targets.forEach((target) => revealCoverage.add(target));

        const effectiveBlur = isMobile ? 0 : blur;

        gsap.set(targets, {
          autoAlpha: 0,
          y,
          scale,
          filter: effectiveBlur > 0 ? `blur(${effectiveBlur}px)` : "none",
          willChange: isMobile ? "transform, opacity" : "transform, opacity, filter",
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
          ...(isMobile ? {} : { filter: "blur(0px)" }),
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

      const site = document.querySelector(".v2-site");

      if (site) {
        const services = site.querySelector(".v2-services");
        if (services) {
          const label = services.querySelector(".v2-section-label");
          const heading = services.querySelector(".v2-service-intro h2");

          if (heading) {
            reveal({
              trigger: heading,
              targets: [heading],
              y: isMobile ? 16 : 28,
              blur: isMobile ? 0.8 : 5,
              stagger: 0,
              duration: isMobile ? 0.86 : 1.08,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

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
              blur: isMobile ? 0.45 : 3,
              scale: index % 2 === 0 ? 0.992 : 0.988,
              stagger: isMobile ? 0.055 : 0.075,
              duration: isMobile ? 0.7 : 0.88,
              start: isMobile ? "top 91%" : "top 82%",
            });
          });
        }


        const pricing = site.querySelector(".v2-pricing");
        if (pricing) {
          const intro = pricing.querySelector(".v2-pricing-intro");
          if (intro) {
            reveal({
              trigger: intro,
              targets: elements(".v2-pricing-kicker, h2, .v2-pricing-lead", intro),
              y: isMobile ? 14 : 28,
              blur: isMobile ? 0.6 : 4,
              stagger: isMobile ? 0.055 : 0.085,
              duration: isMobile ? 0.76 : 0.96,
              start: isMobile ? "top 94%" : "top 89%",
            });
          }

          const priceList = pricing.querySelector(".v2-pricing-list");
          if (priceList) {
            const priceTargets = [
              ...elements(".v2-price-row", priceList),
              ...elements(".v2-pricing-fineprint", pricing),
            ];
            reveal({
              trigger: priceList,
              targets: priceTargets,
              y: isMobile ? 10 : 18,
              blur: isMobile ? 0 : 2,
              stagger: isMobile ? 0.045 : 0.065,
              duration: isMobile ? 0.6 : 0.74,
              start: isMobile ? "top 91%" : "top 84%",
            });
          }

          const volumeCard = pricing.querySelector(".v2-volume-card");
          if (volumeCard) {
            reveal({
              trigger: volumeCard,
              targets: [volumeCard],
              y: isMobile ? 14 : 26,
              blur: isMobile ? 0 : 2.5,
              scale: 0.992,
              stagger: 0,
              duration: isMobile ? 0.72 : 0.9,
              start: isMobile ? "top 91%" : "top 85%",
            });
          }
        }

        const results = site.querySelector(".v2-results");
        if (results) {

          const resultsHeading = results.querySelector(".v2-results-intro h2");
          const resultsDescription = results.querySelector(".v2-results-intro > span");

          if (resultsHeading) {
            reveal({
              trigger: resultsHeading,
              targets: [resultsHeading],
              y: isMobile ? 16 : 30,
              blur: isMobile ? 0.8 : 5,
              stagger: 0,
              duration: isMobile ? 0.86 : 1.08,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

          if (resultsDescription) {
            reveal({
              trigger: resultsDescription,
              targets: [resultsDescription],
              y: isMobile ? 10 : 18,
              blur: isMobile ? 0.55 : 3,
              stagger: 0,
              duration: isMobile ? 0.72 : 0.88,
              start: isMobile ? "top 95%" : "top 91%",
            });
          }

          const compareGrid = results.querySelector(".v2-compare-grid");
          if (compareGrid) {
            reveal({
              trigger: compareGrid,
              targets: elements(".v2-compare", compareGrid),
              y: isMobile ? 18 : 36,
              blur: isMobile ? 0.45 : 3,
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

          if (heading && headingTargets.length) {
            reveal({
              trigger: heading,
              targets: headingTargets.filter(Boolean) as Element[],
              y: isMobile ? 14 : 26,
              blur: isMobile ? 0.8 : 5,
              stagger: isMobile ? 0.07 : 0.10,
              duration: isMobile ? 0.82 : 1.02,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

          const bookingCard = booking.querySelector(".booking-card");
          if (bookingCard) {
            reveal({
              trigger: bookingCard,
              targets: [bookingCard],
              y: isMobile ? 16 : 30,
              blur: isMobile ? 0.45 : 3,
              scale: 0.985,
              stagger: 0,
              duration: isMobile ? 0.8 : 1.02,
              start: isMobile ? "top 92%" : "top 86%",
            });
          }
        }

        const faq = site.querySelector(".v2-faq");
        if (faq) {

          const faqHeading = faq.querySelector(".v2-faq-grid h2");

          if (faqHeading) {
            reveal({
              trigger: faqHeading,
              targets: [faqHeading],
              y: isMobile ? 16 : 28,
              blur: isMobile ? 0.8 : 5,
              stagger: 0,
              duration: isMobile ? 0.84 : 1.04,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

          const faqList = faq.querySelector(".v2-faq-list");
          if (faqList) {
            reveal({
              trigger: faqList,
              targets: elements(".v2-faq-item", faqList),
              y: isMobile ? 12 : 20,
              blur: isMobile ? 0.4 : 2,
              stagger: isMobile ? 0.055 : 0.075,
              duration: isMobile ? 0.62 : 0.76,
              start: isMobile ? "top 91%" : "top 84%",
            });
          }
        }

        // Final text audit: animate only meaningful text that is not already
        // inside another reveal target. This catches section labels without
        // double-animating service copy, booking content, FAQ text, etc.
        const textCandidates = elements(
          "main .v2-section-label p, main h2, main h3, main p, main strong, main span",
          site,
        );

        const isAlreadyCovered = (candidate: Element) =>
          Array.from(revealCoverage).some(
            (target) => target === candidate || target.contains(candidate),
          );

        textCandidates
          .filter((candidate) => {
            if (candidate.closest(".v2-hero")) return false;
            if (candidate.closest(".v2-loader")) return false;
            if (isAlreadyCovered(candidate)) return false;
            return Boolean(candidate.textContent?.trim());
          })
          .forEach((candidate) => {
            reveal({
              trigger: candidate,
              targets: [candidate],
              y: isMobile ? 8 : 12,
              blur: isMobile ? 0.8 : 2.5,
              stagger: 0,
              duration: isMobile ? 0.66 : 0.82,
              start: isMobile ? "top 94%" : "top 90%",
            });
          });

        const footer = site.querySelector(".v2-footer");
        if (footer) {
          const footerGrid = footer.querySelector(".v2-footer-grid");
          if (footerGrid) {
            reveal({
              trigger: footer,
              targets: elements(":scope > div", footerGrid),
              y: isMobile ? 12 : 20,
              blur: isMobile ? 0.4 : 2,
              stagger: isMobile ? 0.055 : 0.085,
              duration: isMobile ? 0.62 : 0.76,
              start: isMobile ? "top 94%" : "top 90%",
            });
          }

        }
      }

      const onScroll = () => ScrollTrigger.update();
      const raf = (time: number) => lenis?.raf(time * 1000);

      const refresh = () => {
        if (!alive || document.hidden) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!alive || document.hidden) return;
            lenis?.resize();
            ScrollTrigger.refresh();
          });
        });
      };

      const onResize = () => {
        const nextWidth = window.innerWidth;
        const widthChanged = Math.abs(nextWidth - lastViewportWidth) > 1;

        // Mobile browser chrome changes viewport height constantly while scrolling.
        // Ignore those height-only resizes so ScrollTrigger does not refresh mid-flick.
        if (isMobile && !widthChanged) return;

        lastViewportWidth = nextWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(refresh, 120);
      };

      const onVisibilityChange = () => {
        if (document.hidden) {
          lenis?.stop();
          return;
        }

        lenis?.start();
        refresh();
      };

      if (lenis) {
        lenis.on("scroll", onScroll);
        gsap.ticker.add(raf);
      }

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("load", refresh, { once: true });
      document.addEventListener("visibilitychange", onVisibilityChange);

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
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (lenis) gsap.ticker.remove(raf);

        scrollAnimations.forEach((animation) => {
          animation.scrollTrigger?.kill();
          animation.kill();
        });

        lenis?.destroy();
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
