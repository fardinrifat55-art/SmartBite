"use client";

import React, { useState } from "react";
import {
  Home,
  BookOpen,
  ScanLine,
  ShoppingBasket,
  CalendarHeart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore, type View } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  view: View;
  labelKey: string;
  icon: React.ElementType;
  accent: string;
}

const navItems: NavItem[] = [
  { view: "dashboard", labelKey: "sidebar.dashboard", icon: Home, accent: "#E06D53" },
  { view: "foodDiary", labelKey: "sidebar.foodDiary", icon: BookOpen, accent: "#F0A830" },
  { view: "scanner", labelKey: "sidebar.scanner", icon: ScanLine, accent: "#2C9E8F" },
  { view: "shopping", labelKey: "sidebar.shopping", icon: ShoppingBasket, accent: "#3B7A57" },
  { view: "mealPlanner", labelKey: "sidebar.mealPlanner", icon: CalendarHeart, accent: "#8E6BB0" },
  { view: "analytics", labelKey: "sidebar.analytics", icon: BarChart3, accent: "#D45D7E" },
  { view: "settings", labelKey: "sidebar.profile", icon: Settings, accent: "#5B6B7B" },
];

// Sage sidebar + cool mist-gray main share these two tones. The active tab
// uses MIST so it merges seamlessly into the main area; the concave notches
// are SAGE so they read as the sidebar "biting" into the tab.
const SAGE = "#9CB0A8";
const MIST = "#E8ECE8";

export function DashboardSidebar({ activeView = "dashboard" }: { activeView?: View }) {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNav = (item: NavItem) => {
    setView(item.view);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full text-[#162623] relative"
      style={{
        background: `linear-gradient(180deg, #A6BBB2 0%, ${SAGE} 45%, #94A89E 100%)`,
      }}
    >
      {/* Header card — logo + profile */}
      <div className="m-3 bg-[#AEC0B6]/55 rounded-2xl p-4 backdrop-blur-sm">
        {/* Logo: glowing emerald-and-gold pulse-heart */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E4D3B] via-[#2C7E8F] to-[#D4A843] flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(212,168,67,0.55),0_2px_6px_rgba(22,38,35,0.25)]"
          >
            <Heart className="h-4 w-4 text-white" fill="white" strokeWidth={0} />
          </motion.div>
          <span className="font-jakarta text-base font-extrabold tracking-tight text-[#162623]">
            Nutrilen<span className="text-[#E06D53]"> AI</span>
          </span>
        </div>
        {/* Profile: coral-to-teal gradient ring + active dot */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-[#E06D53] via-[#D4A843] to-[#2C7E8F] shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#162623] ring-2 ring-white/90">
                {user?.fullName ? (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white">U</div>
                )}
              </div>
            </div>
            {/* Active indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#2C9E8F] ring-2 ring-[#AEC0B6]" />
          </div>
          <div className="text-[11px] font-extrabold text-[#162623] tracking-wide mt-2 uppercase">
            {user?.fullName ?? "User"}
          </div>
          <div className="text-[10px] text-[#162623]/60 truncate max-w-full">{user?.email ?? ""}</div>
        </div>
      </div>

      {/* Nav — active item is a mist-gray cutout tab whose concave notches
          merge it seamlessly into the main area on the right. */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 pl-3 pr-0 scroll-soft">
        <div className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={`${item.labelKey}-${idx}`}
                onClick={() => handleNav(item)}
                className={cn(
                  "relative w-full h-11 flex items-center gap-2.5 pr-3 pl-3 transition-colors",
                  isActive
                    ? "bg-[#E8ECE8] rounded-l-2xl rounded-r-none"
                    : "rounded-xl text-[#162623]/65 hover:bg-white/12 hover:text-[#162623]"
                )}
              >
                {isActive && (
                  <>
                    {/* Concave notches (sage) that merge the tab into the main area */}
                    <span
                      className="absolute -top-3 right-0 w-3 h-3 rounded-br-[12px]"
                      style={{ backgroundColor: SAGE }}
                    />
                    <span
                      className="absolute -bottom-3 right-0 w-3 h-3 rounded-tr-[12px]"
                      style={{ backgroundColor: SAGE }}
                    />
                    {/* Tiny orange indicator dot on the far left edge */}
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                    {/* Home icon for the dashboard tab */}
                    <Icon className="relative h-[18px] w-[18px] flex-shrink-0 text-[#1E4D3B]" strokeWidth={2} />
                    <span className="relative font-extrabold text-[#162623] uppercase tracking-wide text-[11px] ml-1">
                      {t(item.labelKey)}
                    </span>
                  </>
                )}
                {!isActive && (
                  <>
                    <Icon className="relative h-4 w-4 flex-shrink-0 text-[#162623]/55" strokeWidth={1.9} />
                    <span className="relative font-semibold uppercase tracking-wide text-[10px] text-[#162623]/70">
                      {t(item.labelKey)}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom asset: Daily Discipline 88% + progress + EN + exit arrow */}
      <div className="px-3 pb-4 pt-2 flex-shrink-0">
        <div className="bg-[#AEC0B6]/55 rounded-2xl p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-[#162623]/70 uppercase tracking-wide">
              {t("sidebar.dailyDiscipline")}
            </span>
            <span className="text-xs font-extrabold text-[#162623] tabular-nums">88%</span>
          </div>
          <div className="h-1.5 bg-[#162623]/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4A843] to-[#E06D53] rounded-full"
              style={{ width: "88%" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2.5 px-1">
          <span className="text-[10px] font-extrabold text-[#162623]/75 px-2 py-1 rounded-md bg-[#162623]/12 tracking-wide">
            {t("sidebar.languageEN")}
          </span>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-7 h-7 rounded-lg bg-[#162623]/12 hover:bg-[#E06D53]/25 text-[#162623] hover:text-[#E06D53] flex items-center justify-center transition-colors"
            aria-label={t("sidebar.logout")}
          >
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
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
      <div className="lg:hidden sticky top-0 z-40 bg-[#9CB0A8] text-[#162623] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E4D3B] to-[#D4A843] flex items-center justify-center">
            <Heart className="h-3.5 w-3.5 text-white" fill="white" strokeWidth={0} />
          </div>
          <span className="font-jakarta text-sm font-extrabold text-[#162623]">Nutrilen<span className="text-[#E06D53]"> AI</span></span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-[#162623]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-[#162623]/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 z-10 p-2 rounded-lg text-[#162623] hover:bg-white/10" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#162623]/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#E06D53]/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-[#E06D53]" />
            </div>
            <h3 className="font-jakarta text-lg font-bold text-[#162623]">{t("sidebar.logout")}?</h3>
            <p className="mt-2 text-sm text-[#4A5A55]">You will be signed out of your account. Your data stays saved.</p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-full border-[#DCE4E1] text-[#162623]">
                {t("common.cancel")}
              </Button>
              <Button onClick={() => { setShowLogoutConfirm(false); signOut(); }} className="flex-1 rounded-full bg-[#E06D53] text-white hover:bg-[#C95B42]">
                {t("sidebar.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
