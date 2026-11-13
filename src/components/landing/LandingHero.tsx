"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Play, ArrowRight, Sparkles, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

export function LandingHero() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const [query, setQuery] = useState("");

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen culinary-smoky overflow-hidden"
    >
      {/* Walnut wood surface at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 culinary-wood pointer-events-none z-0" />

      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#3A2618]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[calc(100vh-200px)]">
          {/* === Left column === */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full culinary-glass mb-6 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-[#4ADE80]" />
              <span className="text-xs font-semibold text-[#E5E5E5] tracking-wide uppercase">
                AI Nutrition Companion
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-jakarta text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-[#E5E5E5]">
              Eat Smarter.
              <br />
              <span className="text-[#A3A3A3]">Live Healthier.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-md">
              Your personal AI nutrition companion. Understand your food, track
              your nutrition, and build healthier habits.
            </p>

            {/* CTA row: solid button + play button + Watch Demo */}
            <div className="mt-7 flex items-center gap-4">
              <button
                onClick={() => setView("signup")}
                className="culinary-btn-solid rounded-lg px-6 py-3 text-sm flex items-center gap-2"
              >
                {t("common.getStarted")}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Play button + Watch Demo */}
              <div className="flex items-center gap-3">
                <button
                  onClick={scrollToFeatures}
                  className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center hover:border-white/60 transition-colors"
                  aria-label="Watch demo"
                >
                  <Play className="h-4 w-4 text-[#E5E5E5] ml-0.5" fill="currentColor" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-white/20" />
                  <span className="text-sm text-[#A3A3A3]">Watch Demo</span>
                </div>
              </div>
            </div>

            {/* Outlined input bar */}
            <div className="mt-7">
              <div className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 h-12 max-w-md hover:border-white/35 transition-colors">
                <Search className="h-4 w-4 text-[#A3A3A3] flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your dietary goal or meal..."
                  className="bg-transparent outline-none text-sm text-[#E5E5E5] placeholder:text-[#A3A3A3] flex-1"
                />
                <button
                  onClick={() => setView("signup")}
                  className="culinary-btn-solid rounded-md px-4 py-2 text-xs font-bold whitespace-nowrap"
                >
                  Analyze
                </button>
              </div>
            </div>
          </motion.div>

          {/* === Right column: food photo + floating micro-card === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden sm:flex items-end justify-end h-[420px] lg:h-[520px]"
          >
            {/* Food photography — resting on wood surface */}
            <div className="relative w-full max-w-md h-full">
              <div className="absolute bottom-0 right-0 w-[88%] h-[85%] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80&auto=format&fit=crop"
                  alt="Fresh healthy bowl with herbs"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating dark frosted-glass micro-card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-8 left-0 sm:left-4 culinary-glass-strong rounded-xl p-3.5 w-52 animate-float-soft"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#4ADE80]/20 flex items-center justify-center">
                    <Flame className="h-3.5 w-3.5 text-[#4ADE80]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-[#4ADE80] uppercase tracking-wide">
                      AI Nutrition Scan
                    </div>
                    <div className="text-xs text-[#A3A3A3]">Live analysis</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#E5E5E5]">1,250</span>
                  <span className="text-xs text-[#A3A3A3]">/ 2,000 kcal</span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ADE80] rounded-full" style={{ width: "63%" }} />
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#A3A3A3]">
                  <span>P 65g</span>
                  <span>C 78g</span>
                  <span>F 15g</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom edge: social links + scroll pill */}
        <div className="absolute bottom-6 left-4 sm:left-6 lg:left-8 z-20">
          <div className="flex items-center gap-3">
            {["FB", "TW", "LI"].map((s) => (
              <button
                key={s}
                className="text-xs font-semibold text-[#A3A3A3] hover:text-[#E5E5E5] tracking-widest transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
          <button
            onClick={scrollToFeatures}
            className="flex flex-col items-center gap-1.5"
            aria-label="Scroll down"
          >
            <span className="text-[10px] text-[#A3A3A3] uppercase tracking-widest">Scroll</span>
            <div className="w-7 h-11 rounded-full border border-white/20 flex items-start justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-[#E5E5E5] animate-scroll-pill" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
