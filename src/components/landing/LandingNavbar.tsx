"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown, User } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
        scrolled ? "pt-2" : "pt-4"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo — crisp white on dark */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center"
            aria-label="Nutrilen AI home"
          >
            <span className="font-jakarta text-lg font-extrabold tracking-tight text-white">
              Nutrilen<span className="text-[#A3A3A3]"> AI</span>
            </span>
          </button>

          {/* Desktop floating pill nav */}
          <div className="hidden md:flex items-center">
            <div className="culinary-glass rounded-xl flex items-center gap-1 pr-2 pl-3 h-11">
              {/* Nav links */}
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-2 text-sm font-medium text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors rounded-lg"
                >
                  {link.label}
                </button>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-1" />

              {/* Embedded search */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5">
                <Search className="h-3.5 w-3.5 text-[#A3A3A3]" />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className="bg-transparent outline-none text-sm text-[#E5E5E5] placeholder:text-[#A3A3A3] w-24 lg:w-32"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-1" />

              {/* Language */}
              <LanguageSwitcher variant="light" />

              {/* Profile icon with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1 ml-1"
                  aria-label="Account"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#141414]" strokeWidth={2} />
                  </div>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-[#A3A3A3] transition-transform", profileOpen && "rotate-180")} />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-44 culinary-glass rounded-xl p-1.5 shadow-2xl">
                      <button
                        onClick={() => { setProfileOpen(false); setView("signin"); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#E5E5E5] hover:bg-white/10 transition-colors"
                      >
                        {t("common.signIn")}
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); setView("signup"); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#A3A3A3] hover:bg-white/10 hover:text-[#E5E5E5] transition-colors"
                      >
                        {t("common.getStarted")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher variant="light" />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 rounded-xl culinary-glass flex items-center justify-center text-[#E5E5E5]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 culinary-glass rounded-2xl p-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-sm font-medium text-[#A3A3A3] hover:text-[#E5E5E5] rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 mt-2 border-t border-white/8">
                <Search className="h-4 w-4 text-[#A3A3A3]" />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className="bg-transparent outline-none text-sm text-[#E5E5E5] placeholder:text-[#A3A3A3] flex-1"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => { setMobileOpen(false); setView("signin"); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#E5E5E5] border border-white/12 hover:bg-white/5"
                >
                  {t("common.signIn")}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setView("signup"); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold text-[#141414] bg-[#E5E5E5] hover:bg-white"
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
