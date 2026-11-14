"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared dashboard card: rounded, soft shadow, smooth hover lift.
 *
 * Deliberately has no entrance motion. The watery screen crossfade in
 * src/app/page.tsx is the sole reveal between screens, so cards appear
 * with that dissolve instead of fading/sliding in on their own — which
 * keeps each navigation a single, clean, liquid dissolve rather than a
 * crossfade with a second stage of cards settling afterwards.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#DCE4E1] shadow-[0_2px_12px_rgba(22,38,35,0.05)] hover:shadow-[0_8px_28px_rgba(22,38,35,0.10)] transition-shadow duration-300 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
}
