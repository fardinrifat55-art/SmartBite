"use client";

import React from "react";
import { Leaf } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { View } from "@/store/useAppStore";

interface AppShellProps {
  /** Which sidebar item is highlighted. */
  activeView: View;
  /** Path shown in the title-bar URL pill, e.g. "nutrilen.ai/food-diary". */
  urlPath?: string;
  children: React.ReactNode;
}

/**
 * Full-screen application shell shared by every authenticated screen.
 * Edge-to-edge: a slim title bar (traffic-light dots + URL pill) on top,
 * the sage sidebar on the left, and a scrollable main area on the right.
 * No rounded-window mockup, no pale-green backdrop margins.
 */
export function AppShell({ activeView, urlPath = "nutrilen.ai", children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:h-screen bg-[#E3E5E3] flex flex-col lg:overflow-hidden">
      {/* Title bar */}
      <div className="hidden lg:flex items-center gap-3 px-4 h-10 bg-white/75 border-b border-[#DCE4E1] flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E06D53]" />
          <span className="w-3 h-3 rounded-full bg-[#E8940A]" />
          <span className="w-3 h-3 rounded-full bg-[#1E4D3B]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-0.5 rounded-full bg-[#E3E5E3] text-[10px] font-medium text-[#4A5A55] flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-[#1E4D3B]" strokeWidth={2} />
            {urlPath}
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Body: sidebar + main */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <DashboardSidebar activeView={activeView} />
        <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">{children}</main>
      </div>
    </div>
  );
}
