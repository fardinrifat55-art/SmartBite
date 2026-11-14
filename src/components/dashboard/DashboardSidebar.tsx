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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore, type View } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NavItem {
  view: View;
  labelKey: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { view: "dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard },
  { view: "dashboard", labelKey: "sidebar.foodDiary", icon: BookOpen, comingSoon: true },
  { view: "scanner", labelKey: "sidebar.scanner", icon: ScanLine },
  { view: "scanner", labelKey: "sidebar.shopping", icon: ShoppingBasket, comingSoon: true },
  { view: "dashboard", labelKey: "sidebar.mealPlanner", icon: CalendarHeart, comingSoon: true },
  { view: "dashboard", labelKey: "sidebar.analytics", icon: BarChart3, comingSoon: true },
  { view: "settings", labelKey: "sidebar.profile", icon: Settings },
];

export function DashboardSidebar({ activeView = "dashboard" }: { activeView?: View }) {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNav = (item: NavItem) => {
    if (item.comingSoon) {
      toast({ title: t(item.labelKey), description: "Coming in the next iteration." });
      setMobileOpen(false);
      return;
    }
    setView(item.view);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#9CB0A8] text-[#162623] relative">
      {/* Lighter green rounded header card */}
      <div className="m-3 bg-[#AEC0B6] rounded-2xl p-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#162623] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z" fill="#FFFFFF" />
              <path d="M9.5 11C9.5 10.3 10 9.8 10.5 9.8" stroke="#E06D53" strokeWidth="1" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <span className="font-jakarta text-base font-extrabold tracking-tight text-[#162623]">
            Nutrilen<span className="text-[#E06D53]"> AI</span>
          </span>
        </div>
        {/* Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Teal-to-salmon gradient ring */}
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-[#2C7E8F] via-[#5B9B8F] to-[#E06D53]">
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
            {/* Status dot */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#2C7E8F] ring-2 ring-[#AEC0B6]" />
          </div>
          <div className="text-[11px] font-bold text-[#162623] tracking-wide mt-2 uppercase">
            {user?.fullName ?? "User"}
          </div>
          <div className="text-[10px] text-[#162623]/60 truncate max-w-full">{user?.email ?? ""}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 scroll-soft">
        <div className="space-y-0.5">
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
                onClick={() => handleNav(item)}
                className={cn(
                  "w-full flex items-center gap-2.5 mx-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/85 text-[#162623] shadow-sm font-bold"
                    : "text-[#162623]/65 hover:bg-white/10 hover:text-[#162623]"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
                <span className="flex-1 text-left">{t(item.labelKey)}</span>
                {item.comingSoon && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#162623]/10 text-[#162623]/50 uppercase tracking-wide">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer: logout */}
      <div className="px-3 pb-2 flex-shrink-0">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#162623]/70 hover:bg-[#E06D53]/15 hover:text-[#E06D53] transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>

      {/* Salad bowl illustration at bottom */}
      <div className="h-28 relative overflow-hidden flex-shrink-0">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 240 110" fill="none" preserveAspectRatio="xMidYMax meet">
          {/* Fork handle sticking out upper-right */}
          <g transform="rotate(-35 195 30)">
            <rect x="193" y="5" width="4" height="40" rx="1.5" fill="#C0C4C8" />
            <rect x="191" y="3" width="8" height="6" rx="1" fill="#C0C4C8" />
            <path d="M192 3 L192 9 M195 3 L195 9 M198 3 L198 9" stroke="#A0A4A8" strokeWidth="0.8" />
          </g>
          {/* Bowl shadow */}
          <ellipse cx="120" cy="100" rx="95" ry="6" fill="#162623" opacity="0.12" />
          {/* Bowl outer (dark charcoal) */}
          <path d="M30 60 Q30 95 120 100 Q210 95 210 60 L200 58 Q200 88 120 92 Q40 88 40 58 Z" fill="#2A3530" />
          {/* Bowl body */}
          <path d="M35 58 Q35 92 120 96 Q205 92 205 58 Q180 62 120 62 Q60 62 35 58 Z" fill="#37433C" />
          {/* Bowl rim */}
          <ellipse cx="120" cy="58" rx="88" ry="8" fill="#2A3530" />
          <ellipse cx="120" cy="57" rx="85" ry="6" fill="#1F2823" />
          {/* Salad — lettuce leaves */}
          <path d="M55 54 Q50 40 60 38 Q72 42 68 54 Z" fill="#5A7A4A" />
          <path d="M65 52 Q62 36 75 34 Q86 40 80 52 Z" fill="#6B8E55" />
          <path d="M78 50 Q78 32 92 32 Q100 40 94 50 Z" fill="#5A7A4A" />
          <path d="M95 48 Q98 30 112 32 Q118 40 110 48 Z" fill="#6B8E55" />
          <path d="M115 47 Q120 29 134 33 Q138 41 130 47 Z" fill="#5A7A4A" />
          <path d="M135 48 Q142 32 156 36 Q158 44 150 48 Z" fill="#6B8E55" />
          <path d="M155 49 Q164 35 178 40 Q178 48 170 49 Z" fill="#5A7A4A" />
          {/* Tomato slices */}
          <circle cx="72" cy="50" r="4" fill="#C44545" />
          <circle cx="72" cy="50" r="2.5" fill="#E06D53" />
          <circle cx="125" cy="46" r="4" fill="#C44545" />
          <circle cx="125" cy="46" r="2.5" fill="#E06D53" />
          <circle cx="168" cy="48" r="4" fill="#C44545" />
          <circle cx="168" cy="48" r="2.5" fill="#E06D53" />
          {/* Red onion rings */}
          <circle cx="95" cy="48" r="3.5" fill="none" stroke="#B07A8A" strokeWidth="1.2" />
          <circle cx="95" cy="48" r="1.5" fill="none" stroke="#C9909A" strokeWidth="0.8" />
          <circle cx="148" cy="46" r="3.5" fill="none" stroke="#B07A8A" strokeWidth="1.2" />
          <circle cx="148" cy="46" r="1.5" fill="none" stroke="#C9909A" strokeWidth="0.8" />
          {/* Cucumber bits */}
          <ellipse cx="108" cy="50" rx="3" ry="2" fill="#7A9B5A" transform="rotate(20 108 50)" />
          <ellipse cx="140" cy="49" rx="3" ry="2" fill="#7A9B5A" transform="rotate(-15 140 49)" />
          {/* Olive */}
          <ellipse cx="115" cy="52" rx="2" ry="1.5" fill="#3A4A3A" />
          <ellipse cx="158" cy="51" rx="2" ry="1.5" fill="#3A4A3A" />
          {/* Feta cubes */}
          <rect x="100" y="49" width="3" height="3" rx="0.5" fill="#F0E8D8" />
          <rect x="135" y="48" width="3" height="3" rx="0.5" fill="#F0E8D8" />
          <rect x="175" y="50" width="3" height="3" rx="0.5" fill="#F0E8D8" />
        </svg>
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
          <div className="w-7 h-7 rounded-full bg-[#162623] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="font-jakarta text-sm font-extrabold text-[#162623]">Nutrilen<span className="text-[#E06D53]"> AI</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 text-[#162623]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <LanguageSwitcher />
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
