"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
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
          ? "bg-white/85 backdrop-blur-md shadow-[0_4px_24px_rgba(11,29,22,0.06)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center"
            aria-label="Nutrilen AI home"
          >
            <Logo />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-forest/70 hover:text-forest hover:bg-lime-soft/30 rounded-full transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              onClick={() => setView("signin")}
              className="rounded-full text-forest hover:bg-lime-soft/40 font-medium"
            >
              {t("common.signIn")}
            </Button>
            <Button
              onClick={() => setView("signup")}
              className="rounded-full bg-lime text-forest font-semibold hover:bg-lime/90 shadow-sm hover:shadow-md transition-all"
            >
              {t("common.getStarted")}
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-full text-forest hover:bg-lime-soft/40"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-forest/10 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col gap-1 px-2 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-sm font-medium text-forest hover:bg-lime-soft/30 rounded-xl"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 px-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileOpen(false);
                    setView("signin");
                  }}
                  className="rounded-full border-forest/20 text-forest"
                >
                  {t("common.signIn")}
                </Button>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setView("signup");
                  }}
                  className="rounded-full bg-lime text-forest font-semibold"
                >
                  {t("common.getStarted")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
