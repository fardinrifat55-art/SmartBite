"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Shared dashboard card: rounded, soft shadow, fade-in-up motion.
 * Pass extra classes (bg, padding, overflow) via `className`.
 */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-[#DCE4E1] shadow-[0_2px_12px_rgba(22,38,35,0.05)] hover:shadow-[0_6px_24px_rgba(22,38,35,0.08)] transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
