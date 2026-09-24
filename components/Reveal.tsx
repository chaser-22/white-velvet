"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.992 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
