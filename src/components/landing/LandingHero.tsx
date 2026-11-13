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
    <section id="home" className="relative">
      {/* === Sage-green hero === */}
      <div className="culinary-smoky relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* === Left column === */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              {/* White pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm mb-6 w-fit">
                <Sparkles className="h-3.5 w-3.5 text-[#2C5E53]" />
                <span className="text-xs font-semibold text-[#2C5E53] tracking-wide">
                  Personal AI Nutrition Companion
                </span>
              </div>

              {/* Massive headline */}
              <h1 className="font-jakarta text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight text-[#162623]">
                Eat Smarter.
                <br />
                Live Healthier.
                <br />
                <span className="text-[#162623]/45">Every Day.</span>
              </h1>

              {/* Paragraph */}
              <p className="mt-5 text-base sm:text-lg text-[#2C3F3A] leading-relaxed max-w-md">
                Your personal AI nutrition companion. Understand your food, track
                your nutrition, and build healthier habits with intelligent,
                personalized guidance.
              </p>

              {/* Buttons: coral primary + white secondary */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setView("signup")}
                  className="bg-[#E06D53] hover:bg-[#C95B42] text-white font-bold rounded-full px-6 py-3 text-sm transition-colors shadow-md flex items-center justify-center"
                >
                  {t("common.getStarted")}
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="bg-white border border-[#2C5E53] text-[#2C5E53] font-semibold rounded-full px-6 py-3 text-sm hover:bg-[#F4F7F6] transition-colors flex items-center justify-center"
                >
                  {t("hero.cta.secondary")}
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-[#A0B4AC] bg-[#E06D53] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-[#A0B4AC] bg-[#2C5E53] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">B</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-[#A0B4AC] bg-[#4A5A55] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">C</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-[#A0B4AC] bg-[#DCE4E1] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#4A5A55]">D</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#162623]">4.9 / 5</div>
                  <div className="text-xs text-[#2C3F3A]">Loved by 12,000+ users</div>
                </div>
              </div>
            </motion.div>

            {/* === Right column: food photo + white floating cards === */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Main food photography — rounded-3xl, soft shadow */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_24px_70px_rgba(22,38,35,0.20)]">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop"
                    alt="Fresh healthy food bowl with colorful ingredients"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Floating card 1: Top-left — Daily Calories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -top-3 -left-2 sm:-left-6 bg-white rounded-2xl shadow-lg p-3.5 w-48 animate-float-soft"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                      <Flame className="h-3.5 w-3.5 text-[#2C5E53]" />
                    </div>
                    <span className="text-xs font-semibold text-[#2C5E53]">Daily Calories</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#162623]">1,250</span>
                    <span className="text-xs text-[#4A5A55]">/ 2,000 kcal</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[#E3EDE9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2C5E53] rounded-full" style={{ width: "63%" }} />
                  </div>
                </motion.div>

                {/* Floating card 2: Middle-right — Protein Progress ring */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute top-1/3 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg p-3.5 w-44 animate-float-soft-delayed"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-[#2C5E53]" />
                    </div>
                    <span className="text-xs font-semibold text-[#2C5E53]">Protein Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
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
                      <div className="text-[10px] text-[#4A5A55]">/ 120g</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating card 3: Bottom-right — AI Recognition */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -bottom-3 right-4 sm:right-8 bg-white rounded-2xl shadow-lg p-3 w-40 animate-float-soft-slow"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                      <Camera className="h-4 w-4 text-[#2C5E53]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#162623]">AI Recognition</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E53] animate-pulse" />
                        <span className="text-[10px] text-[#4A5A55]">AI active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* === Sharp white transition section === */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#162623] tracking-tight"
          >
            Everything you need to eat well
          </motion.h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A5A55]">
            Smart tools that make healthy eating simple, personal, and sustainable.
          </p>
        </div>
      </div>
    </section>
  );
}
