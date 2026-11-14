"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { View } from "@/store/useAppStore";

interface AppShellProps {
  /** Which sidebar item is highlighted. */
  activeView: View;
  /** @deprecated No longer rendered — the title bar was removed app-wide.
   *  Kept only so existing callers still type-check. */
  urlPath?: string;
  /** @deprecated No longer rendered — the title bar was removed app-wide.
   *  Kept only so existing callers still type-check. */
  hideTitleBar?: boolean;
  children: React.ReactNode;
}

/**
 * Full-screen edge-to-edge application shell shared by every authenticated
 * screen: the sage sidebar on the left and a scrollable cool mist-gray main
 * area on the right. There is no top title bar — the app fills the whole
 * canvas. Log Out lives in the sidebar's bottom exit arrow (and, on the
 * dashboard, in the header).
 */
export function AppShell({ activeView, children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:h-screen bg-[#E8ECE8] flex flex-col lg:overflow-hidden">
      {/* Body: sidebar + main */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <DashboardSidebar activeView={activeView} />
        <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">{children}</main>
      </div>
    </div>
  );
}
