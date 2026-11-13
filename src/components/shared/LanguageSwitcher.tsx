"use client";

import React from "react";
import { Languages, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { LANGS, LANG_LABELS } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "light" | "default";
  className?: string;
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const { t } = useI18n();
  const isLight = variant === "light";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full px-3",
            isLight
              ? "text-[#F0F7F7]/90 hover:bg-[#AFEEEE]/10 hover:text-[#F0F7F7]"
              : "text-forest hover:bg-lime-soft/40"
          )}
          aria-label={t("settings.language")}
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {lang === "en" ? "EN" : "বাং"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className="cursor-pointer justify-between"
          >
            <span className={l === "bn" ? "lang-bn" : ""}>{LANG_LABELS[l]}</span>
            {lang === l && <Check className="h-4 w-4 text-lime" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
