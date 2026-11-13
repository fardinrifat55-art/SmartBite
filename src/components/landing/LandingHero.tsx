"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";

// Floating glass UI card component
function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`glass-card rounded-2xl shadow-[0_8px_32px_rgba(11,29,22,0.12)] border border-white/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Circular progress ring for hero card
function MiniRing({
  value,
  max,
  color,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  sublabel: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#E5E7E5" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-forest">{Math.round(pct)}%</span>
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-forest/60">{sublabel}</div>
        <div className="text-sm font-bold text-forest">
          {label}
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28 overflow-hidden"
    >
      {/* Soft background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-lime-soft/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cream/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-soft/60 border border-lime/30 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-forest" />
              <span className="text-xs font-semibold text-forest">
                {t("auth.welcomeBrand")}
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-forest">
              {t("hero.headline")}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-forest/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                onClick={() => setView("signup")}
                size="lg"
                className="rounded-full bg-forest text-white font-semibold px-7 h-12 hover:bg-forest/90 shadow-lg shadow-forest/20 hover:shadow-xl transition-all"
              >
                {t("hero.cta.primary")}
              </Button>
              <Button
                onClick={scrollToFeatures}
                size="lg"
                variant="outline"
                className="rounded-full border-forest/20 text-forest font-semibold px-7 h-12 hover:bg-lime-soft/30 bg-white/60"
              >
                {t("hero.cta.secondary")}
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["bg-protein", "bg-carb", "bg-fat", "bg-hydration"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white ${c}`}
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-forest">4.9 / 5</div>
                <div className="text-xs text-forest/60">Loved by 12,000+ users</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Hero visual with floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-square max-w-md mx-auto">
              {/* Main food composition image */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-forest/20">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop"
                  alt="Fresh vegetables and healthy meal composition"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-forest/20 via-transparent to-lime-soft/10" />
              </div>

              {/* Decorative vegetable elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-lime/90 shadow-lg flex items-center justify-center animate-float-soft-slow">
                <span className="text-3xl">🥦</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-cream shadow-lg flex items-center justify-center animate-float-soft">
                <span className="text-2xl">🥕</span>
              </div>

              {/* Floating card: Daily Calories */}
              <FloatingCard
                className="absolute -top-2 -left-4 sm:-left-12 p-3.5 w-44 animate-float-soft"
                delay={0.4}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-lime/20 flex items-center justify-center">
                    <Flame className="h-3.5 w-3.5 text-forest" />
                  </div>
                  <span className="text-xs font-semibold text-forest/70">
                    {t("hero.card.calories")}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-forest">1,250</span>
                  <span className="text-xs text-forest/50">/ 2,000 kcal</span>
                </div>
                <div className="mt-2 h-1.5 bg-forest/10 rounded-full overflow-hidden">
                  <div className="h-full bg-lime rounded-full" style={{ width: "63%" }} />
                </div>
              </FloatingCard>

              {/* Floating card: Protein Progress */}
              <FloatingCard
                className="absolute top-1/3 -right-2 sm:-right-10 p-3.5 w-48 animate-float-soft-delayed"
                delay={0.6}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-protein/20 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-protein" />
                  </div>
                  <span className="text-xs font-semibold text-forest/70">
                    {t("hero.card.protein")}
                  </span>
                </div>
                <MiniRing
                  value={65}
                  max={120}
                  color="#9DC45C"
                  label="65g / 120g"
                  sublabel="Protein"
                />
              </FloatingCard>

              {/* Floating card: AI Recognition */}
              <FloatingCard
                className="absolute -bottom-3 right-4 sm:right-8 p-3 w-40 animate-float-soft-slow"
                delay={0.8}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center">
                    <Camera className="h-4 w-4 text-lime" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-forest">{t("hero.card.recognition")}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                      <span className="text-[10px] text-forest/60">AI active</span>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
