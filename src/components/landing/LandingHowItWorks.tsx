"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/AppProvider";

const steps = [
  {
    icon: UserPlus,
    titleKey: "how.step1.title",
    descKey: "how.step1.desc",
    number: "01",
  },
  {
    icon: Camera,
    titleKey: "how.step2.title",
    descKey: "how.step2.desc",
    number: "02",
  },
  {
    icon: Sparkles,
    titleKey: "how.step3.title",
    descKey: "how.step3.desc",
    number: "03",
  },
];

export function LandingHowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="py-20 sm:py-24 lg:py-28 bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest/65">
            {t("how.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-lime/30 via-lime/50 to-lime/30" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative text-center"
                >
                  {/* Step number badge */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-lime/20 blur-md" />
                    <div className="relative w-20 h-20 rounded-full bg-white shadow-[0_8px_24px_rgba(11,29,22,0.10)] border border-lime/30 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-forest" strokeWidth={1.8} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-lime text-forest text-xs font-bold flex items-center justify-center shadow-sm">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-forest mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-forest/65 leading-relaxed max-w-xs mx-auto">
                    {t(step.descKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
