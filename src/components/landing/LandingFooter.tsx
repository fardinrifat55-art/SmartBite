"use client";

import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";

export function LandingFooter() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const { toast } = useToast();

  const featureLinks = [
    { label: t("features.scanner.title"), href: "#features" },
    { label: t("features.tracking.title"), href: "#features" },
    { label: t("features.reminders.title"), href: "#features" },
    { label: t("features.analytics.title"), href: "#features" },
  ];

  const aboutLinks = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.howItWorks"), href: "#how" },
    { label: t("footer.contact"), href: "#contact" },
  ];

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#162623] text-[#E3EDE9] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2C5E53] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C7 17 4 13.5 4 9.5C4 6 6.5 4 9.5 4C11 4 12 4.8 12 6C12 4.8 13 4 14.5 4C17.5 4 20 6 20 9.5C20 13.5 17 17 12 21Z" fill="#E3EDE9" />
                  <circle cx="16.5" cy="7.5" r="1.5" fill="#E06D53" />
                </svg>
              </div>
              <span className="font-jakarta text-lg font-extrabold tracking-tight text-white">
                Nutrilen<span className="text-[#E06D53]"> AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-[#E3EDE9]/60 leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-white uppercase tracking-widest mb-4">
              {t("footer.features")}
            </h4>
            <ul className="space-y-2.5">
              {featureLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#E3EDE9]/60 hover:text-[#E3EDE9] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-white uppercase tracking-widest mb-4">
              {t("footer.about")}
            </h4>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#E3EDE9]/60 hover:text-[#E3EDE9] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-white uppercase tracking-widest mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#E3EDE9]/60">
                <Mail className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>hello@nutrilen.ai</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#E3EDE9]/60">
                <Phone className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#E3EDE9]/60">
                <MapPin className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#E3EDE9]/40">
            © {new Date().getFullYear()} Nutrilen AI. {t("footer.rights")}
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => toast({ title: t("footer.privacy"), description: "This page is being prepared. Contact hello@nutrilen.ai for privacy questions." })}
              className="text-xs text-[#E3EDE9]/40 hover:text-[#E3EDE9] transition-colors"
            >
              {t("footer.privacy")}
            </button>
            <button
              onClick={() => toast({ title: t("footer.terms"), description: "This page is being prepared. Contact hello@nutrilen.ai for terms questions." })}
              className="text-xs text-[#E3EDE9]/40 hover:text-[#E3EDE9] transition-colors"
            >
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
