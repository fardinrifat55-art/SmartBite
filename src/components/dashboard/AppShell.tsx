"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { View } from "@/store/useAppStore";

interface AppShellProps {
  activeView: View;
  urlPath?: string;
  hideTitleBar?: boolean;
  children: React.ReactNode;
}

export function AppShell({ activeView, children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:h-screen bg-[#EEF3F1] flex flex-col lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <DashboardSidebar activeView={activeView} />
        <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">{children}</main>
      </div>
    </div>
  );
}
