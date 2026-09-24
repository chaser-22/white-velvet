"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const isHeading = /section-heading|about-top|process-intro|booking-heading|hero-copy/.test(className);
  const isCard = /service-card|compare-card|value-card/.test(className);
  const isStep = /step-row/.test(className);

  const initial = isHeading
    ? { opacity: 0, y: 14, filter: "blur(7px)" }
    : isCard
      ? { opacity: 0, y: 22, scale: 0.986, rotateX: 1.4 }
      : isStep
        ? { opacity: 0, x: -14 }
        : { opacity: 0, y: 12 };

  const visible = isHeading
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : isCard
      ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
      : isStep
        ? { opacity: 1, x: 0 }
        : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      style={isCard ? { transformPerspective: 1200 } : undefined}
      initial={reduceMotion ? false : initial}
      whileInView={reduceMotion ? undefined : visible}
      viewport={{ once: true, amount: isCard ? 0.09 : 0.15, margin: "0px 0px -3% 0px" }}
      transition={{
        duration: isHeading ? 1.12 : isCard ? 1.02 : isStep ? 0.88 : 0.82,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
