"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

export function LandingCTA() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);

  return (
    <section id="about" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-lime/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-lime/5 blur-3xl" />

          {/* Floating veggie emojis */}
          <div className="absolute top-8 left-8 text-3xl opacity-30 animate-float-soft">🥑</div>
          <div className="absolute bottom-8 right-8 text-3xl opacity-30 animate-float-soft-delayed">🍅</div>
          <div className="absolute top-12 right-16 text-2xl opacity-20 animate-float-soft-slow">🥬</div>

          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {t("hero.headline")}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="mt-8">
              <Button
                onClick={() => setView("signup")}
                size="lg"
                className="rounded-full bg-lime text-forest font-semibold px-8 h-13 py-3.5 hover:bg-lime/90 shadow-xl shadow-lime/20 hover:shadow-2xl transition-all group"
              >
                {t("common.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
