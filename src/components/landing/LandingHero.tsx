"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Camera, TrendingUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

export function LandingHero() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden bg-[#F4F7F6]">
      {/* Ambient sage glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E3EDE9]/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* === Left column === */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            {/* Sage pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EDE9] text-[#2C5E53] mb-6 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold tracking-wide">
                Personal AI Nutrition Companion
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-jakarta text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#162623]">
              Eat Smarter.
              <br />
              Live Healthier.
              <br />
              <span className="text-[#5A6E69]">Every Day.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-[#5A6E69] leading-relaxed max-w-md">
              Your personal AI nutrition companion. Understand your food, track
              your nutrition, and build healthier habits with intelligent,
              personalized guidance.
            </p>

            {/* Action row: coral CTA + eucalyptus secondary */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setView("signup")}
                className="bg-[#E06D53] hover:bg-[#C95B42] text-white font-bold rounded-full px-6 py-3 text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {t("common.getStarted")}
              </button>
              <button
                onClick={scrollToFeatures}
                className="border border-[#2C5E53] text-[#2C5E53] font-semibold rounded-full px-6 py-3 text-sm hover:bg-[#E3EDE9] transition-colors flex items-center justify-center gap-2"
              >
                {t("hero.cta.secondary")}
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-[#E06D53]", "bg-[#2C5E53]", "bg-[#5A6E69]", "bg-[#E3EDE9]"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full border-2 border-[#F4F7F6] ${c} flex items-center justify-center`}
                  >
                    <span className="text-xs font-bold text-white/80">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-[#162623]">4.9 / 5</div>
                <div className="text-xs text-[#5A6E69]">Loved by 12,000+ users</div>
              </div>
            </div>
          </motion.div>

          {/* === Right column: food photo + frosted widgets === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square sm:aspect-[4/5] max-w-lg mx-auto">
              {/* Main food photography */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(22,38,35,0.15)]">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop"
                  alt="Fresh vegetable salad bowl"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Widget 1: Top-left — Daily Calories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-3 -left-2 sm:-left-6 bg-white/85 backdrop-blur-md border border-[#DCE4E1] rounded-2xl shadow-sm p-3.5 w-48 animate-float-soft"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                    <Flame className="h-3.5 w-3.5 text-[#2C5E53]" />
                  </div>
                  <span className="text-xs font-semibold text-[#2C5E53]">Daily Calories</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#162623]">1,250</span>
                  <span className="text-xs text-[#5A6E69]">/ 2,000 kcal</span>
                </div>
                <div className="mt-2 h-1.5 bg-[#E3EDE9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2C5E53] rounded-full" style={{ width: "63%" }} />
                </div>
              </motion.div>

              {/* Widget 2: Middle-right — Protein Progress ring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-1/3 -right-2 sm:-right-6 bg-white/85 backdrop-blur-md border border-[#DCE4E1] rounded-2xl shadow-sm p-3.5 w-44 animate-float-soft-delayed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-[#2C5E53]" />
                  </div>
                  <span className="text-xs font-semibold text-[#2C5E53]">Protein Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Circular ring */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#E3EDE9" strokeWidth="5" />
                      <circle
                        cx="28" cy="28" r="24" fill="none" stroke="#2C5E53" strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - 0.54)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#162623]">54%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#162623]">65g</div>
                    <div className="text-[10px] text-[#5A6E69]">/ 120g</div>
                  </div>
                </div>
              </motion.div>

              {/* Widget 3: Bottom-right — AI Food Recognition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-3 right-4 sm:right-8 bg-white/85 backdrop-blur-md border border-[#DCE4E1] rounded-2xl shadow-sm p-3 w-40 animate-float-soft-slow"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                    <Camera className="h-4 w-4 text-[#2C5E53]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#162623]">AI Recognition</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E53] animate-pulse" />
                      <span className="text-[10px] text-[#5A6E69]">AI active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
