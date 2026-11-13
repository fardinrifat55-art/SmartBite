"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, type Lang } from "@/lib/i18n";

interface I18nContextValue {
  lang: Lang;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within AppProvider");
  }
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);

  // Apply language to <html> for proper font rendering + accessibility
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.classList.toggle("lang-bn", lang === "bn");
    }
  }, [lang]);

  // Apply theme class to <html>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = translations[lang] || translations.en;
    const t = (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    };
    return { lang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
