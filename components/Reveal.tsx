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
  const isCard = /service-card|compare-card|value-card|step-row/.test(className);

  const initial = isHeading
    ? { opacity: 0, y: 18, filter: "blur(5px)" }
    : isCard
      ? { opacity: 0, y: 26, scale: 0.988 }
      : { opacity: 0, y: 20 };

  const visible = isHeading
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : isCard
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : initial}
      whileInView={reduceMotion ? undefined : visible}
      viewport={{ once: true, amount: isCard ? 0.1 : 0.16, margin: "0px 0px -4% 0px" }}
      transition={{
        duration: isHeading ? 1.05 : isCard ? 0.94 : 0.88,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
