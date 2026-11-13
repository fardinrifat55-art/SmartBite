"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
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
        scrolled ? "bg-[#A0B4AC]/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — left: dark green circle icon + charcoal "Nutrilen" + coral "AI" */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2.5"
            aria-label="Nutrilen AI home"
          >
            <div className="w-9 h-9 rounded-full bg-[#2C5E53] flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M9 11.5C9 10.7 9.7 10 10.5 10"
                  stroke="#E06D53"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
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
                className="px-3 py-2 text-sm font-medium text-[#2C3F3A] hover:text-[#162623] transition-colors rounded-lg"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right-aligned: EN indicator, Sign In, coral CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-medium text-[#2C3F3A]">
              <Globe className="h-3.5 w-3.5" />
              <span>EN</span>
            </div>
            <button
              onClick={() => setView("signin")}
              className="text-sm font-medium text-[#2C3F3A] hover:text-[#162623] transition-colors"
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
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#162623]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-[#DCE4E1] p-4 mb-2 shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-sm font-medium text-[#4A5A55] hover:text-[#162623] rounded-lg hover:bg-[#F4F7F6]"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#DCE4E1]">
                <button
                  onClick={() => { setMobileOpen(false); setView("signin"); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#4A5A55] border border-[#DCE4E1]"
                >
                  {t("common.signIn")}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setView("signup"); }}
                  className="px-4 py-2.5 rounded-full text-sm font-bold text-white bg-[#E06D53]"
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
