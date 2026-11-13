"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ScanLine,
  Target,
  BarChart3,
  BellRing,
  UtensilsCrossed,
  LineChart,
} from "lucide-react";
import { useI18n } from "@/components/providers/AppProvider";

interface Feature {
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  accent: string;
  bg: string;
}

const features: Feature[] = [
  {
    icon: ScanLine,
    titleKey: "features.scanner.title",
    descKey: "features.scanner.desc",
    accent: "text-lime",
    bg: "bg-lime-soft/40",
  },
  {
    icon: Target,
    titleKey: "features.personalized.title",
    descKey: "features.personalized.desc",
    accent: "text-protein",
    bg: "bg-protein/15",
  },
  {
    icon: BarChart3,
    titleKey: "features.tracking.title",
    descKey: "features.tracking.desc",
    accent: "text-carb",
    bg: "bg-carb/20",
  },
  {
    icon: BellRing,
    titleKey: "features.reminders.title",
    descKey: "features.reminders.desc",
    accent: "text-fat",
    bg: "bg-fat/15",
  },
  {
    icon: UtensilsCrossed,
    titleKey: "features.meals.title",
    descKey: "features.meals.desc",
    accent: "text-hydration",
    bg: "bg-hydration/15",
  },
  {
    icon: LineChart,
    titleKey: "features.analytics.title",
    descKey: "features.analytics.desc",
    accent: "text-lime",
    bg: "bg-lime-soft/40",
  },
];

export function LandingFeatures() {
  const { t } = useI18n();

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest/65">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.titleKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-white rounded-3xl p-6 border border-forest/8 shadow-[0_2px_12px_rgba(11,29,22,0.04)] hover:shadow-[0_12px_40px_rgba(11,29,22,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}
                >
                  <Icon className={`h-7 w-7 ${f.accent}`} strokeWidth={1.8} />
                </div>
                <h3 className="font-heading text-lg font-bold text-forest mb-2">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm text-forest/65 leading-relaxed">
                  {t(f.descKey)}
                </p>
                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-lime rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
