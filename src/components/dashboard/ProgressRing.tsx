"use client";

import React from "react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  label?: string;
  sublabel?: string;
  unit?: string;
  showCenterText?: boolean;
}

export function ProgressRing({
  value,
  max,
  size = 160,
  strokeWidth = 14,
  color = "#A5D52E",
  trackColor = "#E5E7E5",
  children,
  label,
  sublabel,
  unit,
  showCenterText = true,
}: ProgressRingProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const half = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      {showCenterText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {children ?? (
            <>
              <span className="font-heading font-bold text-forest tabular-nums leading-none" style={{ fontSize: size * 0.18 }}>
                {Math.round(value).toLocaleString()}
              </span>
              {unit && (
                <span className="text-[11px] text-forest/50 font-medium mt-1">{unit}</span>
              )}
              {label && (
                <span className="text-[11px] text-forest/60 font-medium mt-1">{label}</span>
              )}
              {sublabel && (
                <span className="text-[10px] text-forest/40 mt-0.5">{sublabel}</span>
              )}
            </>
          )}
        </div>
      )}
      {!showCenterText && children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
