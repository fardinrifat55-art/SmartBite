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

const features = [
  { icon: ScanLine, titleKey: "features.scanner.title", descKey: "features.scanner.desc" },
  { icon: Target, titleKey: "features.personalized.title", descKey: "features.personalized.desc" },
  { icon: BarChart3, titleKey: "features.tracking.title", descKey: "features.tracking.desc" },
  { icon: BellRing, titleKey: "features.reminders.title", descKey: "features.reminders.desc" },
  { icon: UtensilsCrossed, titleKey: "features.meals.title", descKey: "features.meals.desc" },
  { icon: LineChart, titleKey: "features.analytics.title", descKey: "features.analytics.desc" },
];

export function LandingFeatures() {
  const { t } = useI18n();

  return (
    <section id="features" className="bg-[#F4F7F6] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#162623] tracking-tight">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A6E69]">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.titleKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group bg-white rounded-2xl border border-[#DCE4E1] p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E3EDE9] flex items-center justify-center mb-5 group-hover:bg-[#2C5E53] transition-colors">
                  <Icon
                    className="h-6 w-6 text-[#2C5E53] group-hover:text-[#E3EDE9] transition-colors"
                    strokeWidth={1.6}
                  />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-[#162623] mb-2">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm text-[#5A6E69] leading-relaxed">
                  {t(f.descKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
