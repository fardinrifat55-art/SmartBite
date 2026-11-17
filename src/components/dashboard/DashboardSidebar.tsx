"use client";

import React, { useState } from "react";
import {
  Home,
  Sliders,
  ScanLine,
  ShoppingBasket,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Calendar,
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
  { view: "dashboard", labelKey: "sidebar.dashboard", icon: Home },
  { view: "foodDiary", labelKey: "sidebar.foodDiary", icon: BookOpen },
  { view: "mealPlanner", labelKey: "sidebar.mealPlanner", icon: Calendar },
  { view: "scanner", labelKey: "sidebar.scanner", icon: ScanLine },
  { view: "shopping", labelKey: "sidebar.shopping", icon: ShoppingBasket },
  { view: "analytics", labelKey: "sidebar.analytics", icon: BarChart3 },
  { view: "onboarding", labelKey: "sidebar.personalization", icon: Sliders },
  { view: "settings", labelKey: "sidebar.profile", icon: Settings },
];

export function DashboardSidebar({ activeView = "dashboard" }: { activeView?: View }) {
  const { t, lang } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const setLang = useAppStore((s) => s.setLang);
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNav = (item: NavItem) => {
    setView(item.view);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#A0B4AC] text-[#162623] relative select-none overflow-hidden">
      {/* Top Slightly Deeper Sage Profile Block (#92A89F) */}
      <div className="bg-[#92A89F] px-5 pt-5 pb-6 flex flex-col items-center flex-shrink-0">
        <div className="w-full flex items-center justify-between mb-4">
          <Logo variant="dark" size="sm" />
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="text-[10px] font-bold text-[#162623]/80 hover:text-[#162623] px-2 py-0.5 rounded bg-white/35 uppercase tracking-wider focus:outline-none"
          >
            {lang.toUpperCase()}
          </button>
        </div>

        {/* Coral outer ring + white inner ring circular avatar */}
        <div className="w-20 h-20 rounded-full p-[3px] border-2 border-[#E06D53] flex items-center justify-center shadow-md">
          <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-[#162623] flex items-center justify-center">
            {user?.fullName ? (
              <span className="font-jakarta font-extrabold text-white text-xl">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="font-jakarta font-extrabold text-white text-xl">U</span>
            )}
          </div>
        </div>

        <div className="font-jakarta text-sm font-extrabold text-[#162623] tracking-wider mt-3 uppercase text-center">
          {user?.fullName || "SmartBite User"}
        </div>
        <div className="text-[11px] text-[#2C3F3A] truncate max-w-full mt-0.5">
          {user?.email || "user@smartbite.ai"}
        </div>
      </div>

      {/* Navigation Links with True Seamless Concave Cutout */}
      <nav className="flex-1 py-5 pl-4 pr-0 space-y-1.5 overflow-y-auto overflow-x-hidden no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => handleNav(item)}
              className={cn(
                "relative w-full h-12 flex items-center gap-3.5 pl-5 pr-4 transition-colors focus:outline-none focus-visible:outline-none ring-0 border-0",
                isActive
                  ? "bg-[#EEF3F1] text-[#162623] rounded-l-full font-extrabold z-10"
                  : "text-[#162623]/80 hover:text-[#162623] hover:bg-white/15 rounded-l-full font-semibold"
              )}
            >
              {isActive && (
                <>
                  {/* Top-right seamless concave fillet */}
                  <span className="pointer-events-none absolute -top-5 right-0 w-5 h-5 bg-[#EEF3F1]">
                    <span className="block w-full h-full bg-[#A0B4AC] rounded-br-[20px]" />
                  </span>
                  {/* Bottom-right seamless concave fillet */}
                  <span className="pointer-events-none absolute -bottom-5 right-0 w-5 h-5 bg-[#EEF3F1]">
                    <span className="block w-full h-full bg-[#A0B4AC] rounded-tr-[20px]" />
                  </span>
                </>
              )}
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-[#E06D53]" : "text-[#2C5E53]"
                )}
                strokeWidth={isActive ? 2.2 : 1.9}
              />
              <span
                className={cn(
                  "uppercase tracking-wider text-xs truncate",
                  isActive ? "font-extrabold text-[#162623]" : "font-semibold text-[#162623]/85"
                )}
              >
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Logout */}
      <div className="px-5 pb-5 pt-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-10 px-4 rounded-full bg-[#162623]/10 hover:bg-[#E06D53] text-[#162623] hover:text-white flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none"
          title={t("sidebar.logout")}
          aria-label={t("sidebar.logout")}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 lg:h-full">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#A0B4AC] text-[#162623] px-4 py-3 flex items-center justify-between">
        <Logo variant="dark" size="sm" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/20 text-[#162623] focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#162623]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
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
            className="absolute inset-0 bg-[#162623]/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#E06D53]/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-[#E06D53]" />
            </div>
            <h3 className="font-jakarta text-lg font-bold text-[#162623]">{t("sidebar.logout")}?</h3>
            <p className="mt-2 text-sm text-[#4A5A55]">
              You will be signed out of your account. Your data stays saved.
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border-[#DCE4E1] text-[#162623]"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut();
                }}
                className="flex-1 rounded-full bg-[#E06D53] text-white hover:bg-[#C95B42]"
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
