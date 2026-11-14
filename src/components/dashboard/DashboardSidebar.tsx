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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { view: "scanner", labelKey: "sidebar.scanner", icon: ScanLine },
  { view: "shopping", labelKey: "sidebar.shopping", icon: ShoppingBasket },
  { view: "mealPlanner", labelKey: "sidebar.mealPlanner", icon: CalendarHeart },
  { view: "analytics", labelKey: "sidebar.analytics", icon: BarChart3 },
  { view: "settings", labelKey: "sidebar.profile", icon: Settings },
];

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
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-[#E3E5E3] text-[#162623] font-bold rounded-l-2xl"
                    : "text-[#162623]/65 hover:bg-white/10 hover:text-[#162623] rounded-xl"
                )}
              >
                {isActive && (
                  <>
                    {/* Tiny orange indicator dot on the far left edge */}
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E8940A] z-20 shadow-[0_0_0_2px_rgba(255,255,255,0.7)]" />
                    {/* Curved inverted cutout corners — sage notches merging with the main area */}
                    <span className="absolute -top-2 right-0 w-4 h-4 rounded-full bg-[#9CB0A8]" />
                    <span className="absolute -bottom-2 right-0 w-4 h-4 rounded-full bg-[#9CB0A8]" />
                  </>
                )}
                <Icon className="h-4 w-4 flex-shrink-0 relative z-10" strokeWidth={1.8} />
                <span className="flex-1 text-left relative z-10">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer: logout */}
      <div className="px-3 pb-4 flex-shrink-0">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#162623]/70 hover:bg-[#E06D53]/15 hover:text-[#E06D53] transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
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
