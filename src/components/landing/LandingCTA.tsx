"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

export function LandingCTA() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);

  return (
    <section id="about" className="culinary-dark py-20 sm:py-24 border-t border-[#AFEEEE]/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl culinary-glass-strong px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center"
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#AFEEEE]/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#AFEEEE]/10 blur-3xl" />

          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0F7F7] tracking-tight">
              {t("hero.headline")}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#9BB0B3] leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="mt-8">
              <button
                onClick={() => setView("signup")}
                className="culinary-btn-solid rounded-lg px-8 py-3.5 text-sm inline-flex items-center gap-2 group"
              >
                {t("common.getStarted")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
