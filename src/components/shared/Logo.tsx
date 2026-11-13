"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
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
  const sizeMap = {
    sm: { box: "w-7 h-7", text: "text-base", icon: 16 },
    md: { box: "w-9 h-9", text: "text-lg", icon: 20 },
    lg: { box: "w-12 h-12", text: "text-2xl", icon: 26 },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl shadow-sm",
          sizeMap.box
        )}
        style={{
          background: isLight
            ? "rgba(255,255,255,0.12)"
            : "linear-gradient(135deg, #0B1D16 0%, #14302A 100%)",
        }}
      >
        <svg
          width={sizeMap.icon}
          height={sizeMap.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Leaf + spark motif */}
          <path
            d="M12 21C7 17 4 13.5 4 9.5C4 6 6.5 4 9.5 4C11 4 12 4.8 12 6C12 4.8 13 4 14.5 4C17.5 4 20 6 20 9.5C20 13.5 17 17 12 21Z"
            fill="#A5D52E"
          />
          <path
            d="M12 21C12 21 12 14 8 10.5C10 10 11.5 11.5 12 13"
            stroke="#0B1D16"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="16.5" cy="7.5" r="1.5" fill="#D8F0A5" />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-heading font-bold tracking-tight",
            sizeMap.text,
            isLight ? "text-white" : "text-forest"
          )}
        >
          Nutrilen<span style={{ color: "#A5D52E" }}> AI</span>
        </span>
      )}
    </div>
  );
}
