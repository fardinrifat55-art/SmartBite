"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/AppProvider";

const steps = [
  { icon: UserPlus, titleKey: "how.step1.title", descKey: "how.step1.desc", number: "01" },
  { icon: Camera, titleKey: "how.step2.title", descKey: "how.step2.desc", number: "02" },
  { icon: Sparkles, titleKey: "how.step3.title", descKey: "how.step3.desc", number: "03" },
];

export function LandingHowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="bg-[#E3EDE9]/30 py-20 sm:py-24 lg:py-28 border-t border-[#DCE4E1]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#162623] tracking-tight">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A6E69]">
            {t("how.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 relative">
          <div className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-px bg-[#DCE4E1]" />

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
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="relative w-20 h-20 rounded-full bg-white border border-[#DCE4E1] shadow-sm flex items-center justify-center">
                      <Icon className="h-8 w-8 text-[#2C5E53]" strokeWidth={1.6} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#E06D53] text-white text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-jakarta text-xl font-bold text-[#162623] mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-[#5A6E69] leading-relaxed max-w-xs mx-auto">
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
