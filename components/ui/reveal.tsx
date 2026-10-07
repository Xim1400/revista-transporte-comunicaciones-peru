"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Pequeña animación de entrada al hacer scroll (fade + slide sutil).
 * `once` evita que se repita cada vez que el elemento entra/sale de
 * vista, para que la página se sienta pulida sin ser ruidosa.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
