"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ScanLine,
  ShoppingBasket,
  CalendarHeart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore, type View } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

interface NavItem {
  view: View;
  labelKey: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { view: "dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard },
  { view: "dashboard", labelKey: "sidebar.foodDiary", icon: BookOpen },
  { view: "scanner", labelKey: "sidebar.scanner", icon: ScanLine },
  { view: "scanner", labelKey: "sidebar.shopping", icon: ShoppingBasket },
  { view: "dashboard", labelKey: "sidebar.mealPlanner", icon: CalendarHeart },
  { view: "dashboard", labelKey: "sidebar.analytics", icon: BarChart3 },
  { view: "settings", labelKey: "sidebar.profile", icon: Settings },
];

export function DashboardSidebar({ activeView = "dashboard" }: { activeView?: View }) {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNav = (view: View) => {
    setView(view);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-forest text-white">
      {/* Logo */}
      <div className="p-5 border-b border-white/8">
        <Logo variant="light" size="sm" />
      </div>

      {/* User mini-card */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center font-bold text-forest text-sm">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user?.fullName ?? "User"}</div>
            <div className="text-xs text-white/50 truncate">{user?.email ?? ""}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scroll-soft">
        <div className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeView === item.view && (
              (item.labelKey === "sidebar.dashboard" && activeView === "dashboard") ||
              (item.labelKey === "sidebar.scanner" && activeView === "scanner") ||
              (item.labelKey === "sidebar.profile" && activeView === "settings")
            );
            return (
              <button
                key={`${item.labelKey}-${idx}`}
                onClick={() => handleNav(item.view)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-lime text-forest shadow-sm"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={1.8} />
                <span className="flex-1 text-left">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer: language + logout */}
      <div className="p-3 border-t border-white/8 space-y-2">
        <div className="flex items-center justify-between px-2">
          <LanguageSwitcher variant="light" />
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-fat/20 hover:text-fat transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-forest text-white px-4 py-3 flex items-center justify-between">
        <Logo variant="light" size="sm" />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-fat/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-fat" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forest">
              {t("sidebar.logout")}?
            </h3>
            <p className="mt-2 text-sm text-forest/60">
              You will be signed out of your account. Your data stays saved.
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut();
                }}
                className="flex-1 rounded-full bg-fat text-white hover:bg-fat/90"
              >
                {t("sidebar.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
