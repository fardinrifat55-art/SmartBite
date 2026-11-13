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
    <footer id="contact" className="culinary-dark border-t border-white/8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-jakarta text-lg font-extrabold tracking-tight text-[#E5E5E5]">
              Nutrilen<span className="text-[#A3A3A3]"> AI</span>
            </span>
            <p className="mt-4 text-sm text-[#A3A3A3] leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="mt-5">
              <LanguageSwitcher variant="light" />
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-[#E5E5E5] uppercase tracking-widest mb-4">
              {t("footer.features")}
            </h4>
            <ul className="space-y-2.5">
              {featureLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-[#E5E5E5] uppercase tracking-widest mb-4">
              {t("footer.about")}
            </h4>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-jakarta text-xs font-semibold text-[#E5E5E5] uppercase tracking-widest mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                <Mail className="h-4 w-4 mt-0.5 text-[#4ADE80] flex-shrink-0" />
                <span>hello@nutrilen.ai</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                <Phone className="h-4 w-4 mt-0.5 text-[#4ADE80] flex-shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                <MapPin className="h-4 w-4 mt-0.5 text-[#4ADE80] flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#A3A3A3]">
            © {new Date().getFullYear()} Nutrilen AI. {t("footer.rights")}
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => toast({ title: t("footer.privacy"), description: "This page is being prepared. Contact hello@nutrilen.ai for privacy questions." })}
              className="text-xs text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors"
            >
              {t("footer.privacy")}
            </button>
            <button
              onClick={() => toast({ title: t("footer.terms"), description: "This page is being prepared. Contact hello@nutrilen.ai for terms questions." })}
              className="text-xs text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors"
            >
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
