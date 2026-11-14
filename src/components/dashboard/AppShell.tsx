"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TitleBar } from "@/components/dashboard/TitleBar";
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
 * Edge-to-edge: a slim title bar (traffic-light dots + URL pill + boxed
 * Logout) on top, the sage sidebar on the left, and a scrollable main area
 * on the right. No rounded-window mockup, no pale-green backdrop margins.
 */
export function AppShell({ activeView, urlPath = "nutrilen.ai", children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:h-screen bg-[#E3E5E3] flex flex-col lg:overflow-hidden">
      <TitleBar urlPath={urlPath} />

      {/* Body: sidebar + main */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <DashboardSidebar activeView={activeView} />
        <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">{children}</main>
      </div>
    </div>
  );
}
