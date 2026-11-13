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
    <footer id="contact" className="bg-[#162623] text-[#A0B4AC] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#2C5E53] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z" fill="#FFFFFF" />
                  <path d="M9 11.5C9 10.7 9.7 10 10.5 10" stroke="#E06D53" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <span className="font-jakarta text-lg font-extrabold tracking-tight text-white">
                Nutrilen<span className="text-[#E06D53]"> AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-[#A0B4AC]/60 leading-relaxed max-w-xs">
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
                    className="text-sm text-[#A0B4AC]/60 hover:text-white transition-colors text-left"
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
                    className="text-sm text-[#A0B4AC]/60 hover:text-white transition-colors text-left"
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
              <li className="flex items-start gap-2.5 text-sm text-[#A0B4AC]/60">
                <Mail className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>hello@nutrilen.ai</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#A0B4AC]/60">
                <Phone className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#A0B4AC]/60">
                <MapPin className="h-4 w-4 mt-0.5 text-[#E06D53] flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#A0B4AC]/40">
            © {new Date().getFullYear()} Nutrilen AI. {t("footer.rights")}
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => toast({ title: t("footer.privacy"), description: "This page is being prepared. Contact hello@nutrilen.ai for privacy questions." })}
              className="text-xs text-[#A0B4AC]/40 hover:text-white transition-colors"
            >
              {t("footer.privacy")}
            </button>
            <button
              onClick={() => toast({ title: t("footer.terms"), description: "This page is being prepared. Contact hello@nutrilen.ai for terms questions." })}
              className="text-xs text-[#A0B4AC]/40 hover:text-white transition-colors"
            >
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
