"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#F4F7F6]/90 backdrop-blur-md shadow-[0_1px_0_0_#DCE4E1]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — left */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2"
            aria-label="Nutrilen AI home"
          >
            {/* Eucalyptus icon mark */}
            <div className="w-8 h-8 rounded-lg bg-[#2C5E53] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21C7 17 4 13.5 4 9.5C4 6 6.5 4 9.5 4C11 4 12 4.8 12 6C12 4.8 13 4 14.5 4C17.5 4 20 6 20 9.5C20 13.5 17 17 12 21Z"
                  fill="#E3EDE9"
                />
                <circle cx="16.5" cy="7.5" r="1.5" fill="#E06D53" />
              </svg>
            </div>
            <span className="font-jakarta text-lg font-extrabold tracking-tight text-[#162623]">
              Nutrilen<span className="text-[#E06D53]"> AI</span>
            </span>
          </button>

          {/* Centered nav links — desktop */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-[#5A6E69] hover:text-[#2C5E53] transition-colors rounded-lg hover:bg-[#E3EDE9]/50"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right-aligned actions — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setView("signin")}
              className="text-sm font-medium text-[#5A6E69] hover:text-[#2C5E53] transition-colors"
            >
              {t("common.signIn")}
            </button>
            <button
              onClick={() => setView("signup")}
              className="bg-[#E06D53] hover:bg-[#C95B42] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              {t("common.getStarted")}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#2C5E53] hover:bg-[#E3EDE9]/50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-[#DCE4E1] p-4 mb-2 shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-sm font-medium text-[#5A6E69] hover:text-[#2C5E53] rounded-lg hover:bg-[#E3EDE9]/40"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#DCE4E1]">
                <button
                  onClick={() => { setMobileOpen(false); setView("signin"); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#5A6E69] border border-[#DCE4E1] hover:bg-[#F4F7F6]"
                >
                  {t("common.signIn")}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setView("signup"); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-[#E06D53] hover:bg-[#C95B42]"
                >
                  {t("common.getStarted")}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
