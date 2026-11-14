"use client";

import React, { useState } from "react";
import { Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

interface TitleBarProps {
  /** Path shown in the centered URL pill, e.g. "nutrilen.ai/food-diary". */
  urlPath?: string;
}

/**
 * Slim full-width title bar shared by every authenticated screen.
 * Traffic-light dots on the left, a Leaf URL pill in the center, and a
 * boxed Logout button in the top-right corner. The logout button opens a
 * confirmation modal before signing the user out.
 */
export function TitleBar({ urlPath = "nutrilen.ai" }: TitleBarProps) {
  const { t } = useI18n();
  const signOut = useAppStore((s) => s.signOut);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <div className="hidden lg:flex items-center gap-3 px-4 h-10 bg-white/75 border-b border-[#DCE4E1] flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E06D53]" />
          <span className="w-3 h-3 rounded-full bg-[#E8940A]" />
          <span className="w-3 h-3 rounded-full bg-[#1E4D3B]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-0.5 rounded-full bg-[#E3E5E3] text-[10px] font-medium text-[#4A5A55] flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-[#1E4D3B]" strokeWidth={2} />
            {urlPath}
          </div>
        </div>
        {/* Boxed Logout — top-right corner */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-white/90 border border-[#DCE4E1] text-[11px] font-semibold text-[#4A5A55] hover:text-[#E06D53] hover:border-[#E06D53]/40 hover:bg-white transition-colors shadow-sm"
          aria-label={t("sidebar.logout")}
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#162623]/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#E06D53]/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-[#E06D53]" />
            </div>
            <h3 className="font-jakarta text-lg font-bold text-[#162623]">{t("sidebar.logout")}?</h3>
            <p className="mt-2 text-sm text-[#4A5A55]">You will be signed out of your account. Your data stays saved.</p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-full border-[#DCE4E1] text-[#162623]">
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut();
                }}
                className="flex-1 rounded-full bg-[#E06D53] text-white hover:bg-[#C95B42]"
              >
                {t("sidebar.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
