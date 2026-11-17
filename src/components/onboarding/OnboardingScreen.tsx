"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User as UserIcon,
  Ruler,
  Weight,
  Activity,
  Target,
  Sparkles,
  TrendingDown,
  Minus,
  TrendingUp,
  Dumbbell,
  Heart,
  Flame,
  Egg,
  Wheat,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { AppShell } from "@/components/dashboard/AppShell";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import type { Gender, ActivityLevel, GoalType } from "@/lib/nutrition";
import { calculateTargets, formatNumber } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 8; // 0-7 = steps, 8 = final summary

export function OnboardingScreen() {
  const { t, lang } = useI18n();
  const step = useAppStore((s) => s.onboardingStep);
  const nextStep = useAppStore((s) => s.nextStep);
  const prevStep = useAppStore((s) => s.prevStep);
  const setView = useAppStore((s) => s.setView);
  const profile = useAppStore((s) => s.onboardingProfile);
  const updateProfile = useAppStore((s) => s.updateOnboardingProfile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const targets = useAppStore((s) => s.targets);

  const isFinal = step >= TOTAL_STEPS;
  const currentStep = Math.min(step, TOTAL_STEPS);
  const progressPct = ((currentStep) / TOTAL_STEPS) * 100;

  const canProceed = (): boolean => {
    if (!profile) return false;
    switch (step) {
      case 0: return !!profile.gender;
      case 1: return profile.age >= 13 && profile.age <= 100;
      case 2: return profile.height >= 120 && profile.height <= 250;
      case 3: return profile.currentWeight >= 30 && profile.currentWeight <= 300;
      case 4: return !!profile.activityLevel;
      case 5: return profile.goalWeight >= 30 && profile.goalWeight <= 300;
      case 6: return !!profile.goal;
      case 7: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 7) {
      // Calculate targets before moving to final
      useAppStore.getState().calculateAndSetTargets();
    }
    nextStep();
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  return (
    <AppShell activeView="onboarding">
      <div className="p-4 sm:p-6 lg:p-8 pb-28 sm:pb-8 max-w-3xl mx-auto flex flex-col min-h-full">
        {/* Top bar with back to dashboard */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (step === 0 ? setView("dashboard") : prevStep())}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#162623]/70 hover:text-[#162623] px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{step === 0 ? (lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard") : t("common.back")}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E53] bg-[#D1E2DE] px-3 py-1 rounded-full border border-[#CBDCD7]">
              {lang === "bn" ? "ব্যক্তিগতকরণ" : "Personalization"}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-forest/8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              {t("on.progress", { current: Math.min(step + 1, TOTAL_STEPS), total: TOTAL_STEPS })}
            </span>
            <span className="text-xs font-bold text-[#E06D53]">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="h-2 bg-forest/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2C5E53] via-[#E06D53] to-[#2C5E53] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Step dots */}
          <div className="hidden sm:flex items-center justify-between mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => i < step && useAppStore.getState().setOnboardingStep(i)}
                disabled={i >= step}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  i < step && "bg-[#2C5E53] cursor-pointer",
                  i === step && "bg-[#E06D53] w-6",
                  i > step && "bg-forest/15"
                )}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-start justify-center py-2">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {isFinal ? (
                  <FinalSummary
                    targets={targets}
                    profile={profile}
                    onFinish={handleFinish}
                  />
                ) : (
                  <StepContent
                    step={step}
                    profile={profile}
                    updateProfile={updateProfile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer actions */}
        {!isFinal && (
          <div className="pt-5 pb-24 sm:pb-6 mt-6 border-t border-forest/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => (step === 0 ? setView("dashboard") : prevStep())}
              className="rounded-full text-forest/70 hover:bg-white order-2 sm:order-1 h-12"
            >
              {t("common.back")}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="rounded-full bg-[#162623] hover:bg-[#2C5E53] text-white font-semibold px-8 h-12 shadow-md disabled:opacity-40 transition-all order-1 sm:order-2"
            >
              {t("common.continue")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ===== Step Content Router =====
function StepContent({
  step,
  profile,
  updateProfile,
}: {
  step: number;
  profile: ReturnType<typeof useAppStore.getState>["onboardingProfile"];
  updateProfile: (p: any) => void;
}) {
  const { t } = useI18n();
  switch (step) {
    case 0:
      return <StepGender profile={profile} updateProfile={updateProfile} />;
    case 1:
      return <StepAge profile={profile} updateProfile={updateProfile} />;
    case 2:
      return <StepHeight profile={profile} updateProfile={updateProfile} />;
    case 3:
      return <StepWeight profile={profile} updateProfile={updateProfile} />;
    case 4:
      return <StepActivity profile={profile} updateProfile={updateProfile} />;
    case 5:
      return <StepGoalWeight profile={profile} updateProfile={updateProfile} />;
    case 6:
      return <StepGoalType profile={profile} updateProfile={updateProfile} />;
    case 7:
      return <StepTargets profile={profile} />;
    default:
      return null;
  }
}

// ===== Selectable Card =====
function SelectCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  accent = "lime",
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description?: string;
  accent?: "lime" | "protein" | "carb" | "fat" | "hydration";
}) {
  const accents = {
    lime: { ring: "ring-lime", bg: "bg-lime-soft/50", text: "text-lime", check: "bg-lime" },
    protein: { ring: "ring-protein", bg: "bg-protein/15", text: "text-protein", check: "bg-protein" },
    carb: { ring: "ring-carb", bg: "bg-carb/15", text: "text-carb", check: "bg-carb" },
    fat: { ring: "ring-fat", bg: "bg-fat/15", text: "text-fat", check: "bg-fat" },
    hydration: { ring: "ring-hydration", bg: "bg-hydration/15", text: "text-hydration", check: "bg-hydration" },
  }[accent];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200",
        selected
          ? `${accents.bg} ${accents.ring} ring-2 border-transparent shadow-sm`
          : "border-forest/10 bg-white hover:border-forest/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            selected ? accents.check : "bg-forest/5"
          )}
        >
          <Icon
            className={cn("h-5 w-5", selected ? "text-forest" : "text-forest/60")}
            strokeWidth={1.8}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-forest text-sm sm:text-base">{title}</div>
          {description && (
            <div className="text-xs sm:text-sm text-forest/55 mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {selected && (
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", accents.check)}>
            <Check className="h-3 w-3 text-forest" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
}

// ===== Step 1: Gender =====
function StepGender({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const options: { value: Gender; label: string; icon: any }[] = [
    { value: "male", label: t("on.step1.male"), icon: UserIcon },
    { value: "female", label: t("on.step1.female"), icon: UserIcon },
  ];
  return (
    <StepShell heading={t("on.step1.heading")} question={t("on.step1.question")}>
      <div className="space-y-3">
        {options.map((o) => (
          <SelectCard
            key={o.value}
            selected={profile?.gender === o.value}
            onClick={() => updateProfile({ gender: o.value })}
            icon={o.icon}
            title={o.label}
          />
        ))}
      </div>
    </StepShell>
  );
}

// ===== Step 2: Age =====
function StepAge({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const age = profile?.age ?? 25;
  return (
    <StepShell heading={t("on.step2.heading")} question={t("on.step2.question")}>
      <div className="bg-white rounded-3xl border border-forest/10 p-8 text-center">
        <div className="text-6xl font-bold text-forest font-heading tabular-nums">
          {age}
        </div>
        <div className="text-sm text-forest/50 mt-1">years</div>
        <input
          type="range"
          min={13}
          max={90}
          value={age}
          onChange={(e) => updateProfile({ age: Number(e.target.value) })}
          className="w-full mt-6 accent-lime"
          style={{ accentColor: "#A5D52E" }}
        />
        <div className="flex justify-between text-xs text-forest/40 mt-1">
          <span>13</span>
          <span>90</span>
        </div>
        <div className="mt-4">
          <Input
            type="number"
            value={age}
            onChange={(e) => updateProfile({ age: Number(e.target.value) })}
            className="w-24 mx-auto text-center h-11 rounded-xl border-forest/15"
            min={13}
            max={90}
          />
        </div>
      </div>
    </StepShell>
  );
}

// ===== Step 3: Height =====
function StepHeight({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const height = profile?.height ?? 170;
  const feet = Math.floor(height / 30.48);
  const inches = Math.round((height / 2.54) % 12);
  return (
    <StepShell heading={t("on.step3.heading")} question={t("on.step3.question")}>
      <div className="bg-white rounded-3xl border border-forest/10 p-8 text-center">
        <div className="text-5xl font-bold text-forest font-heading tabular-nums">
          {height}
          <span className="text-xl text-forest/50 font-medium ml-1">cm</span>
        </div>
        <div className="text-sm text-forest/50 mt-2">
          ≈ {feet}′ {inches}″
        </div>
        <input
          type="range"
          min={120}
          max={220}
          value={height}
          onChange={(e) => updateProfile({ height: Number(e.target.value) })}
          className="w-full mt-6"
          style={{ accentColor: "#A5D52E" }}
        />
        <div className="flex justify-between text-xs text-forest/40 mt-1">
          <span>120 cm</span>
          <span>220 cm</span>
        </div>
      </div>
    </StepShell>
  );
}

// ===== Step 4: Current Weight =====
function StepWeight({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const weight = profile?.currentWeight ?? 70;
  const lbs = Math.round(weight * 2.205);
  return (
    <StepShell heading={t("on.step4.heading")} question={t("on.step4.question")}>
      <div className="bg-white rounded-3xl border border-forest/10 p-8 text-center">
        <div className="text-5xl font-bold text-forest font-heading tabular-nums">
          {weight}
          <span className="text-xl text-forest/50 font-medium ml-1">kg</span>
        </div>
        <div className="text-sm text-forest/50 mt-2">≈ {lbs} lbs</div>
        <input
          type="range"
          min={30}
          max={180}
          value={weight}
          onChange={(e) => updateProfile({ currentWeight: Number(e.target.value) })}
          className="w-full mt-6"
          style={{ accentColor: "#A5D52E" }}
        />
        <div className="flex justify-between text-xs text-forest/40 mt-1">
          <span>30 kg</span>
          <span>180 kg</span>
        </div>
      </div>
    </StepShell>
  );
}

// ===== Step 5: Activity Level =====
function StepActivity({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const options: { value: ActivityLevel; labelKey: string; descKey: string }[] = [
    { value: "sedentary", labelKey: "on.step5.sedentary", descKey: "on.step5.sedentary.desc" },
    { value: "light", labelKey: "on.step5.light", descKey: "on.step5.light.desc" },
    { value: "moderate", labelKey: "on.step5.moderate", descKey: "on.step5.moderate.desc" },
    { value: "very", labelKey: "on.step5.very", descKey: "on.step5.very.desc" },
    { value: "extreme", labelKey: "on.step5.extreme", descKey: "on.step5.extreme.desc" },
  ];
  return (
    <StepShell heading={t("on.step5.heading")} question={t("on.step5.question")}>
      <div className="space-y-2.5">
        {options.map((o) => (
          <SelectCard
            key={o.value}
            selected={profile?.activityLevel === o.value}
            onClick={() => updateProfile({ activityLevel: o.value })}
            icon={Activity}
            title={t(o.labelKey)}
            description={t(o.descKey)}
            accent="lime"
          />
        ))}
      </div>
    </StepShell>
  );
}

// ===== Step 6: Goal Weight =====
function StepGoalWeight({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const current = profile?.currentWeight ?? 70;
  const goal = profile?.goalWeight ?? current;
  const maintain = profile?.goalWeight === current;
  const diff = goal - current;
  const lbs = Math.round(goal * 2.205);
  return (
    <StepShell heading={t("on.step6.heading")} question={t("on.step6.question")}>
      {/* Current vs target visual */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-xs text-forest/50 mb-1">{t("on.step6.current")}</div>
            <div className="text-2xl font-bold text-forest tabular-nums">{current} kg</div>
          </div>
          <div className="px-4">
            <ArrowRight className="h-5 w-5 text-forest/30" />
          </div>
          <div className="text-center flex-1">
            <div className="text-xs text-forest/50 mb-1">{t("on.step6.target")}</div>
            <div className="text-2xl font-bold text-lime tabular-nums">{goal} kg</div>
          </div>
        </div>
        {diff !== 0 && (
          <div className={cn(
            "text-center text-sm font-medium py-2 rounded-lg",
            diff < 0 ? "bg-fat/10 text-fat" : "bg-protein/10 text-protein"
          )}>
            {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg {diff < 0 ? "to lose" : "to gain"}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-forest/10 p-6 text-center">
        <div className="text-4xl font-bold text-forest font-heading tabular-nums">
          {goal}
          <span className="text-lg text-forest/50 font-medium ml-1">kg</span>
        </div>
        <div className="text-sm text-forest/50 mt-1">≈ {lbs} lbs</div>
        <input
          type="range"
          min={Math.max(30, current - 40)}
          max={Math.min(180, current + 40)}
          value={goal}
          onChange={(e) => updateProfile({ goalWeight: Number(e.target.value) })}
          className="w-full mt-5"
          style={{ accentColor: "#A5D52E" }}
        />
        <button
          onClick={() => updateProfile({ goalWeight: current })}
          className={cn(
            "mt-4 text-sm font-medium px-4 py-2 rounded-full transition-colors",
            maintain ? "bg-lime text-forest" : "text-forest/60 hover:bg-lime-soft/40"
          )}
        >
          {maintain && <Check className="inline h-3.5 w-3.5 mr-1" />}
          {t("on.step6.maintain")}
        </button>
      </div>
    </StepShell>
  );
}

// ===== Step 7: Goal Type =====
function StepGoalType({ profile, updateProfile }: any) {
  const { t } = useI18n();
  const options: { value: GoalType; labelKey: string; descKey: string; icon: any; accent: any }[] = [
    { value: "lose", labelKey: "on.step7.lose", descKey: "on.step7.lose.desc", icon: TrendingDown, accent: "fat" },
    { value: "maintain", labelKey: "on.step7.maintain", descKey: "on.step7.maintain.desc", icon: Minus, accent: "carb" },
    { value: "gain", labelKey: "on.step7.gain", descKey: "on.step7.gain.desc", icon: TrendingUp, accent: "protein" },
    { value: "muscle", labelKey: "on.step7.muscle", descKey: "on.step7.muscle.desc", icon: Dumbbell, accent: "lime" },
    { value: "overall", labelKey: "on.step7.overall", descKey: "on.step7.overall.desc", icon: Heart, accent: "hydration" },
  ];
  return (
    <StepShell heading={t("on.step7.heading")} question={t("on.step7.question")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <SelectCard
            key={o.value}
            selected={profile?.goal === o.value}
            onClick={() => updateProfile({ goal: o.value })}
            icon={o.icon}
            title={t(o.labelKey)}
            description={t(o.descKey)}
            accent={o.accent}
          />
        ))}
      </div>
    </StepShell>
  );
}

// ===== Step 8: Calculated Targets Preview =====
function StepTargets({ profile }: any) {
  const { t } = useI18n();
  if (!profile) return null;
  const targets = calculateTargets(profile);

  const macroCards = [
    { label: t("on.step8.proteinTarget"), value: targets.protein, unit: "g", icon: Egg, color: "#9DC45C", bg: "bg-protein/10" },
    { label: t("on.step8.carbTarget"), value: targets.carbs, unit: "g", icon: Wheat, color: "#F2D15B", bg: "bg-carb/10" },
    { label: t("on.step8.fatTarget"), value: targets.fat, unit: "g", icon: Droplet, color: "#E77D6D", bg: "bg-fat/10" },
  ];

  return (
    <StepShell heading={t("on.step8.heading")} subtitle={t("on.step8.subtitle")}>
      {/* Calorie ring */}
      <div className="bg-white rounded-3xl border border-forest/10 p-8 mb-4">
        <div className="flex items-center gap-6">
          <BigRing
            value={targets.dailyCalories}
            label={t("on.step8.dailyTarget")}
            color="#A5D52E"
            unit="kcal"
          />
          <div className="flex-1">
            <div className="text-xs text-forest/50 mb-1">{t("on.step8.maintenance")}</div>
            <div className="text-2xl font-bold text-forest tabular-nums">
              {formatNumber(targets.maintenanceCalories)} kcal
            </div>
            <div className="text-xs text-forest/50 mt-1">
              Based on your activity & body composition
            </div>
          </div>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-3">
        {macroCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-forest/10 p-4 text-center">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="h-5 w-5" style={{ color: m.color }} strokeWidth={1.8} />
              </div>
              <div className="text-xs text-forest/50 mb-1">{m.label}</div>
              <div className="text-xl font-bold text-forest tabular-nums">
                {m.value}
                <span className="text-sm text-forest/40 ml-0.5">{m.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl bg-cream/60 border border-lime/20 p-4 text-xs text-forest/70 leading-relaxed">
        <Sparkles className="inline h-3.5 w-3.5 text-lime mr-1.5 -mt-0.5" />
        {t("on.step8.disclaimer")}
      </div>
      <div className="mt-2 text-xs text-forest/50">
        {t("on.step8.adjust")}
      </div>
    </StepShell>
  );
}

// ===== Final Summary =====
function FinalSummary({
  targets,
  profile,
  onFinish,
}: {
  targets: any;
  profile: any;
  onFinish: () => void;
}) {
  const { t } = useI18n();
  if (!targets || !profile) return null;

  const goalLabels: Record<GoalType, string> = {
    lose: t("on.step7.lose"),
    maintain: t("on.step7.maintain"),
    gain: t("on.step7.gain"),
    muscle: t("on.step7.muscle"),
    overall: t("on.step7.overall"),
  };

  return (
    <div className="text-center">
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lime shadow-xl shadow-lime/30 mb-6"
      >
        <Sparkles className="h-10 w-10 text-forest" />
      </motion.div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest tracking-tight">
        {t("on.final.heading")}
      </h1>
      <p className="mt-3 text-base text-forest/60">
        {t("on.final.subtitle")}
      </p>

      {/* Big calorie card */}
      <div className="mt-8 bg-white rounded-3xl border border-forest/10 shadow-lg shadow-forest/5 p-6">
        <div className="flex flex-col items-center">
          <BigRing
            value={targets.dailyCalories}
            label={t("on.step8.dailyTarget")}
            color="#A5D52E"
            unit="kcal"
            size="lg"
          />
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-soft/60 text-xs font-semibold text-forest">
            <Target className="h-3 w-3" />
            {goalLabels[profile.goal]}
          </div>
        </div>
      </div>

      {/* Macro summary */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MacroPill label={t("on.step8.proteinTarget")} value={targets.protein} unit="g" color="#9DC45C" />
        <MacroPill label={t("on.step8.carbTarget")} value={targets.carbs} unit="g" color="#F2D15B" />
        <MacroPill label={t("on.step8.fatTarget")} value={targets.fat} unit="g" color="#E77D6D" />
      </div>

      <Button
        onClick={onFinish}
        size="lg"
        className="mt-8 rounded-full bg-forest text-white font-semibold px-8 h-12 hover:bg-forest/90 shadow-lg shadow-forest/15 w-full sm:w-auto"
      >
        {t("on.final.cta")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

// ===== Big circular ring =====
function BigRing({
  value,
  label,
  color,
  unit,
  size = "md",
}: {
  value: number;
  label: string;
  color: string;
  unit: string;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? { box: "w-32 h-32", r: 56, stroke: 10, text: "text-3xl" } : { box: "w-24 h-24", r: 42, stroke: 8, text: "text-2xl" };
  const c = 2 * Math.PI * dims.r;
  // Use 100% for display (target = full ring)
  const offset = 0;
  return (
    <div className={`relative ${dims.box} flex-shrink-0`}>
      <svg className={`${dims.box} -rotate-90`} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={dims.r} fill="none" stroke="#E5E7E5" strokeWidth={dims.stroke} />
        <circle
          cx="60"
          cy="60"
          r={dims.r}
          fill="none"
          stroke={color}
          strokeWidth={dims.stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-forest tabular-nums ${dims.text}`}>
          {formatNumber(value)}
        </span>
        <span className="text-[10px] text-forest/50 font-medium">{unit}</span>
      </div>
    </div>
  );
}

// ===== Macro pill =====
function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-forest/10 p-3 text-center">
      <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ backgroundColor: color }} />
      <div className="text-xs text-forest/50 mb-0.5">{label}</div>
      <div className="text-lg font-bold text-forest tabular-nums">
        {value}
        <span className="text-xs text-forest/40 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

// ===== Step shell =====
function StepShell({
  heading,
  question,
  subtitle,
  children,
}: {
  heading: string;
  question?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-forest tracking-tight">
        {heading}
      </h2>
      {question && (
        <p className="mt-2 text-sm text-forest/60">{question}</p>
      )}
      {subtitle && (
        <p className="mt-2 text-sm text-forest/60">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
