"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how" },
    { label: t("nav.about"), href: "#about" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 mt-5">
        {/* Floating full-pill container */}
        <nav
          className={cn(
            "bg-white/95 backdrop-blur-md border border-white/60 rounded-full",
            "py-3.5 px-6 sm:px-8",
            "shadow-[0_8px_32px_rgba(22,38,35,0.12)]",
            "flex items-center justify-between gap-4"
          )}
        >
          {/* === Left: Brand logo === */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2.5 flex-shrink-0"
            aria-label="Nutrilen AI home"
          >
            {/* 42px circular dark eucalyptus badge with white heart */}
            <div className="w-[42px] h-[42px] rounded-full bg-[#2C5E53] flex items-center justify-center shadow-sm flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M9 11.5C9 10.7 9.7 10 10.5 10"
                  stroke="#E06D53"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            {/* 20px bold brand text */}
            <span className="font-jakarta text-xl font-extrabold tracking-tight text-[#162623] whitespace-nowrap">
              Nutrilen<span className="text-[#E06D53]"> AI</span>
            </span>
          </button>

          {/* === Center: Navigation links (16px medium) === */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-base font-medium text-[#374742] hover:text-[#162623] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* === Right: Language, Sign In, CTA === */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Language selector */}
            <div className="flex items-center gap-1 text-[15px] font-medium text-[#374742]">
              <Globe className="h-4 w-4" />
              <span>EN</span>
            </div>
            {/* Sign In */}
            <button
              onClick={() => setView("signin")}
              className="text-base font-medium text-[#162623] hover:text-[#E06D53] transition-colors"
            >
              {t("common.signIn")}
            </button>
            {/* Coral pill CTA */}
            <button
              onClick={() => setView("signup")}
              className="bg-[#E06D53] hover:bg-[#D15B41] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm"
            >
              {t("common.getStarted")}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#162623] hover:bg-[#F4F7F6]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white rounded-3xl border border-[#DCE4E1] p-5 mt-2 shadow-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-base font-medium text-[#374742] hover:text-[#162623] rounded-xl hover:bg-[#F4F7F6]"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#DCE4E1]">
                <div className="flex items-center gap-1 text-sm font-medium text-[#374742]">
                  <Globe className="h-4 w-4" />
                  <span>EN</span>
                </div>
                <div className="flex-1" />
                <button
                  onClick={() => { setMobileOpen(false); setView("signin"); }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#162623] border border-[#DCE4E1]"
                >
                  {t("common.signIn")}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setView("signup"); }}
                  className="px-5 py-2 rounded-full text-sm font-bold text-white bg-[#E06D53]"
                >
                  {t("common.getStarted")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
