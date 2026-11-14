"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Shared easing — easeOutQuint. Fast start, very slow settle; the curve
 *  most "premium" UI motion uses, so entrances feel soft and weighted
 *  rather than linear or springy. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Shared dashboard card: rounded, soft shadow, fade-in-up motion.
 * Pass extra classes (bg, padding, overflow) via `className`. `delay`
 * staggers the entrance so a grid of cards cascades instead of all
 * popping in at once.
 */
export function Card({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className={cn(
        "rounded-2xl border border-[#DCE4E1] shadow-[0_2px_12px_rgba(22,38,35,0.05)] hover:shadow-[0_8px_28px_rgba(22,38,35,0.10)] transition-shadow duration-300 ease-out",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
