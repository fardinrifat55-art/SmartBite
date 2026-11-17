"use client";

import React from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  variant = "default",
  className,
  showText = true,
  size = "md",
}: LogoProps) {
  const isLight = variant === "light";
  const isDark = variant === "dark";
  const sizeMap = {
    sm: { box: "w-7 h-7", text: "text-base", icon: 15 },
    md: { box: "w-9 h-9", text: "text-xl", icon: 19 },
    lg: { box: "w-11 h-11", text: "text-2xl", icon: 23 },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-[#98DF26] shadow-sm flex-shrink-0",
          sizeMap.box
        )}
      >
        <Leaf
          size={sizeMap.icon}
          className="text-[#11241C]"
          strokeWidth={2.3}
        />
      </div>
      {showText && (
        <span
          className={cn(
            "font-jakarta font-extrabold tracking-tight leading-none",
            sizeMap.text,
            isLight ? "text-white" : "text-[#11241C]"
          )}
        >
          SmartBite<span className="text-[#98DF26]">.</span>
        </span>
      )}
    </div>
  );
}
