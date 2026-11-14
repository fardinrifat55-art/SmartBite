"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Flame,
  Beef,
  Check,
  Plus,
  Trophy,
  Calendar,
  LogOut,
  ArrowRight,
  Wheat,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "./AppShell";
import { Card } from "./Card";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/nutrition";
import type { MealType } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { FOOD_PHOTOS } from "@/lib/food-photos";

// The three recap rows shown in "Today's Food Recap", matching the spec
// exactly. Chira (a snack) is the third row; it is intentionally NOT part of
// SAMPLE_FOOD_DIARY, so the daily macro totals (61g protein / 184g carbs /
// 50g fat / 1,370 kcal) stay intact. The recap footer sums these three
// displayed meals → 66g protein · 1,370 kcal, exactly as specified.
const RECAP_ROWS: {
  id: string;
  name: string;
  nameBn: string;
  imageQuery: string;
  mealType: MealType;
  protein: number;
  calories: number;
}[] = [
  { id: "r1", name: "Paratha with Dal", nameBn: "পরোটা ও ডাল", imageQuery: "paratha dal", mealType: "breakfast", protein: 14, calories: 420 },
  { id: "r2", name: "Rice with Fish Curry", nameBn: "ভাত ও মাছের তরকারি", imageQuery: "rice fish curry", mealType: "lunch", protein: 38, calories: 620 },
  { id: "r3", name: "Chira with Doi & Banana", nameBn: "চিড়া ও দই-কলা", imageQuery: "chira doi banana", mealType: "snacks", protein: 14, calories: 330 },
];
const RECAP_TOTAL_PROTEIN = RECAP_ROWS.reduce((s, r) => s + r.protein, 0); // 66
const RECAP_TOTAL_CAL = RECAP_ROWS.reduce((s, r) => s + r.calories, 0); // 1,370

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const TREND_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function DashboardScreen() {
  const { t, lang } = useI18n();
  const user = useAppStore((s) => s.user);
  const targets = useAppStore((s) => s.targets);
  const streak = useAppStore((s) => s.streak);
  const weeklyActivity = useAppStore((s) => s.weeklyActivity);
  const getConsumedCalories = useAppStore((s) => s.getConsumedCalories);
  const getConsumedProtein = useAppStore((s) => s.getConsumedProtein);
  const getConsumedCarbs = useAppStore((s) => s.getConsumedCarbs);
  const getConsumedFat = useAppStore((s) => s.getConsumedFat);
  const setView = useAppStore((s) => s.setView);
  const signOut = useAppStore((s) => s.signOut);
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const consumedCal = getConsumedCalories();
  const consumedProtein = getConsumedProtein();
  const consumedCarbs = getConsumedCarbs();
  const consumedFat = getConsumedFat();

  const dailyCal = targets?.dailyCalories ?? 2902;
  const proteinGoal = targets?.protein ?? 254;
  const carbGoal = targets?.carbs ?? 326;
  const fatGoal = targets?.fat ?? 64;

  const proteinPct = Math.min(100, proteinGoal > 0 ? (consumedProtein / proteinGoal) * 100 : 0);
  const carbPct = Math.min(100, carbGoal > 0 ? (consumedCarbs / carbGoal) * 100 : 0);
  const fatPct = Math.min(100, fatGoal > 0 ? (consumedFat / fatGoal) * 100 : 0);
  const remainingCal = Math.max(0, dailyCal - consumedCal);
  const calPct = Math.min(100, (consumedCal / dailyCal) * 100);

  // 3-segment macro donut: Protein (deep forest) 24%, Carbs (warm amber) 55%,
  // Fat (bright blue) 21% — proportions taken from the spec, grams from totals.
  const macroSegs = [
    { label: "Protein", pct: 24, grams: consumedProtein, color: "#1E4D3B" },
    { label: "Carbs", pct: 55, grams: consumedCarbs, color: "#D4A843" },
    { label: "Fat", pct: 21, grams: consumedFat, color: "#5BB8E8" },
  ];
  const macroArcs = (() => {
    const C = 2 * Math.PI * 36;
    let acc = 0;
    return macroSegs.map((s) => {
      const frac = s.pct / 100;
      const arc = C * frac;
      const offset = -C * acc;
      acc += frac;
      return { color: s.color, dasharray: `${arc} ${C}`, offset };
    });
  })();

  const userInitial = user?.fullName?.charAt(0).toUpperCase() ?? "U";
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <AppShell activeView="dashboard" hideTitleBar>
      <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
              {t("dash.welcome", { name: firstName })} <span aria-hidden>🌟</span>
            </h1>
            <p className="text-sm text-[#4A5A55] mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr} · {t("dash.welcomeSub")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full bg-white border border-[#DCE4E1] text-[#4A5A55] text-sm w-56 shadow-sm">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="bg-transparent outline-none flex-1 placeholder:text-[#4A5A55]/60"
              />
            </div>
            {/* Bell */}
            <button
              onClick={() => toast({ title: "No new notifications", description: "You're all caught up for today." })}
              className="relative w-11 h-11 rounded-full bg-white border border-[#DCE4E1] flex items-center justify-center text-[#4A5A55] hover:text-[#162623] transition-colors shadow-sm"
              aria-label={t("common.notifications")}
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E06D53] ring-2 ring-white" />
            </button>
            {/* Avatar */}
            <button
              onClick={() => setView("settings")}
              className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-[#E06D53] via-[#D4A843] to-[#2C7E8F] flex-shrink-0 shadow-sm hover:scale-105 transition-transform"
              aria-label="Profile & Settings"
            >
              <div className="w-full h-full rounded-full bg-[#162623] flex items-center justify-center font-bold text-white text-sm">
                {userInitial}
              </div>
            </button>
            {/* Log Out — deep pine-charcoal pill, far top-right */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="hidden sm:flex items-center gap-1.5 h-11 px-4 rounded-full bg-[#162623] text-white text-xs font-semibold hover:bg-[#1E4D3B] transition-colors shadow-sm"
              aria-label={t("sidebar.logout")}
            >
              {t("sidebar.logout")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* === Top KPI Row — 3 cards === */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Daily Calories — dark forest→emerald gradient + gold waves + grain bowl */}
          <Card className="bg-gradient-to-br from-[#1E4D3B] via-[#235C44] to-[#2C7E8F] p-5 relative overflow-visible border-none">
            <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
              <path d="M0 35 Q40 18 80 30 T160 22 T200 28" stroke="#D4A843" strokeWidth="0.8" fill="none" />
              <path d="M0 42 Q40 25 80 38 T160 30 T200 36" stroke="#E8940A" strokeWidth="0.6" fill="none" />
              <path d="M0 48 Q40 32 80 45 T160 37 T200 43" stroke="#D4A843" strokeWidth="0.5" fill="none" />
            </svg>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="h-4 w-4 text-[#D4A843]" strokeWidth={2} />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{t("dash.calories.title")}</span>
              </div>
              <div className="text-3xl font-extrabold text-white tabular-nums leading-tight">
                {formatNumber(consumedCal)}
                <span className="text-base font-bold text-white/60 ml-1">kcal</span>
              </div>
              <div className="text-[11px] text-white/55 mt-0.5">
                of {formatNumber(dailyCal)} kcal · {Math.round(calPct)}%
              </div>
              <div className="mt-3 h-1.5 bg-white/15 rounded-full overflow-hidden max-w-[70%]">
                <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8940A] rounded-full transition-all" style={{ width: `${calPct}%` }} />
              </div>
              <div className="text-[10px] text-white/50 mt-1.5">{formatNumber(remainingCal)} remaining</div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-xl hidden sm:block z-10">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop" alt="Grain bowl" className="w-full h-full object-cover" />
            </div>
          </Card>

          {/* Protein Goal — main + Carbs/Fat sub-bars + salmon photo */}
          <Card delay={0.03} className="bg-[#EDF1EC] border border-[#9CB0A8]/55 p-5 relative overflow-visible">
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1">
                <Beef className="h-4 w-4 text-[#1E4D3B]" strokeWidth={2} />
                <span className="text-xs font-semibold text-[#162623]/65 uppercase tracking-wide">{t("dash.protein.goal")}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#162623] tabular-nums">{consumedProtein}</span>
                <span className="text-sm text-[#162623]/45">/ {proteinGoal}g</span>
              </div>
              <div className="text-[10px] text-[#162623]/45 mt-0.5">{Math.max(0, proteinGoal - consumedProtein)}g remaining</div>
              {/* Protein progress */}
              <div className="mt-2.5 h-1.5 bg-[#9CB0A8]/25 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1E4D3B] to-[#2C7E8F] rounded-full transition-all" style={{ width: `${proteinPct}%` }} />
              </div>
              {/* Carbs + Fat sub-progress bars (right-padded to clear the salmon photo) */}
              <div className="mt-3 space-y-2 pr-16">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-semibold text-[#162623]/65 mb-0.5">
                    <span className="flex items-center gap-1"><Wheat className="h-2.5 w-2.5 text-[#C9922F]" />{t("dash.carbs.title")}</span>
                    <span className="tabular-nums">{consumedCarbs}/{carbGoal}g</span>
                  </div>
                  <div className="h-1.5 bg-[#9CB0A8]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8940A] rounded-full" style={{ width: `${carbPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[9px] font-semibold text-[#162623]/65 mb-0.5">
                    <span className="flex items-center gap-1"><Droplet className="h-2.5 w-2.5 text-[#E06D53]" />{t("dash.fat.title")}</span>
                    <span className="tabular-nums">{consumedFat}/{fatGoal}g</span>
                  </div>
                  <div className="h-1.5 bg-[#9CB0A8]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E06D53] to-[#C95B42] rounded-full" style={{ width: `${fatPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full overflow-hidden border-[3px] border-white shadow-xl hidden sm:block z-10">
              <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=120&fit=crop" alt="Salmon avocado" className="w-full h-full object-cover" />
            </div>
          </Card>

          {/* Day Streak — sage card + Active Streak badge + 7 labeled day circles */}
          <Card delay={0.06} className="bg-[#A9BDA9] p-5 relative overflow-visible border-none">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-[#162623]" strokeWidth={2} />
                <span className="text-xs font-semibold text-[#162623]/70 uppercase tracking-wide">{t("dash.streak.title")}</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D4A843] text-[#162623] uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#162623]" />
                {t("dash.streak.active")}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#162623] tabular-nums">{streak}</span>
              <span className="text-sm font-semibold text-[#162623]/55">{t("dash.streak.days")}</span>
            </div>
            {/* 7 labeled day circles with checkmarks */}
            <div className="flex items-end justify-between gap-1 mt-3">
              {weeklyActivity.map((d, i) => {
                const completed = i < Math.min(streak, 7);
                const letter = DAY_LETTERS[i] ?? d.day.charAt(0);
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                        completed ? "bg-gradient-to-br from-[#E8940A] to-[#D4A843] shadow-sm" : "border border-[#162623]/20"
                      )}
                    >
                      {completed && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                    </div>
                    <span className="text-[9px] font-bold text-[#162623]/60">{letter}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#162623]/55 mt-2.5 font-medium">
              {t("dash.streak.goalsCompleted")}: 4/5
            </div>
          </Card>
        </div>

        {/* === Middle row: Food recap (wide) + Weekly intake === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Today's Food Recap — ticket-notched wide card, 3 rows + footer */}
          <Card delay={0.09} className="lg:col-span-2 bg-white p-5 relative overflow-visible">
            <svg className="absolute top-0 right-0 w-32 h-16 pointer-events-none" viewBox="0 0 130 60" fill="none" style={{ opacity: 0.22 }}>
              <path d="M0 25 Q30 8 60 20 T130 16" stroke="#D4A843" strokeWidth="0.7" fill="none" />
              <path d="M0 35 Q30 18 60 30 T130 26" stroke="#D4A843" strokeWidth="0.5" fill="none" />
            </svg>
            {/* Ticket cutouts — both edges */}
            <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E8ECE8]" />
            <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E8ECE8]" />
            <div className="flex items-center justify-between mb-3 relative">
              <div>
                <h3 className="font-jakarta text-base font-extrabold text-[#162623]">{t("dash.food.title")}</h3>
                <p className="text-[10px] text-[#4A5A55]">Overview of daily meals</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setView("scanner")} className="rounded-full border-[#DCE4E1] text-[#162623] hover:bg-[#F4F7F6] h-8 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" />{t("dash.food.add")}
              </Button>
            </div>
            {/* Table header */}
            <div className="flex items-center gap-3 px-1 pb-1.5 border-b border-[#DCE4E1] text-[9px] font-bold text-[#4A5A55] uppercase tracking-wide">
              <div className="w-10 flex-shrink-0" />
              <div className="flex-1">Meal</div>
              <div className="w-20 text-center hidden sm:block">Category</div>
              <div className="w-12 text-center">Protein</div>
              <div className="w-14 text-right">Calories</div>
            </div>
            {/* Rows */}
            <div className="px-1">
              {RECAP_ROWS.map((f) => (
                <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-[#DCE4E1]/50 last:border-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#E3E5E3]">
                    {FOOD_PHOTOS[f.imageQuery] ? (
                      <img src={FOOD_PHOTOS[f.imageQuery]} alt={f.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#162623] truncate">{lang === "bn" ? f.nameBn : f.name}</div>
                  </div>
                  <div className="w-20 flex justify-center hidden sm:block">
                    <CategoryPill mealType={f.mealType} />
                  </div>
                  <div className="w-12 flex justify-center">
                    <div className="bg-gradient-to-br from-[#D4A843] to-[#C9922F] text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-[28px] text-center shadow-sm">{f.protein}g</div>
                  </div>
                  <div className="w-14 text-right text-xs font-bold text-[#162623] tabular-nums">{f.calories}</div>
                </div>
              ))}
            </div>
            {/* Footer: Total Logged */}
            <div className="mt-2 pt-2 border-t border-dashed border-[#DCE4E1] px-1">
              <span className="text-[10px] font-bold text-[#162623]/70 uppercase tracking-wide">{t("dash.recap.totalLogged")}: </span>
              <span className="text-[11px] font-bold text-[#162623] tabular-nums">
                {RECAP_TOTAL_PROTEIN}g {t("dash.recap.protein")} · {formatNumber(RECAP_TOTAL_CAL)} kcal
              </span>
            </div>
          </Card>

          {/* Weekly Intake — dual bars + Y-axis 0–3k + gridlines */}
          <Card delay={0.12} className="bg-white p-5 relative overflow-hidden">
            <svg className="absolute top-0 right-0 w-24 h-12 pointer-events-none" viewBox="0 0 100 50" fill="none" style={{ opacity: 0.2 }}>
              <path d="M0 18 Q25 6 50 15 T100 12" stroke="#D4A843" strokeWidth="0.6" fill="none" />
              <path d="M0 26 Q25 14 50 23 T100 20" stroke="#D4A843" strokeWidth="0.45" fill="none" />
            </svg>
            <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-0.5 relative">{t("dash.streak.weekly")}</h3>
            <p className="text-[10px] text-[#4A5A55] mb-2 relative">Statistics</p>
            <div className="flex gap-2 h-36 relative">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[8px] text-[#4A5A55] font-medium w-5 text-right pr-0.5">
                <span>3k</span><span>2k</span><span>1k</span><span>0</span>
              </div>
              {/* Plot */}
              <div className="relative flex-1">
                {/* Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((g) => (
                    <div key={g} className="border-t border-[#C5CFC8]" />
                  ))}
                </div>
                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between gap-1">
                  {weeklyActivity.map((d, i) => (
                    <div key={i} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                      <div className="w-2.5 rounded-t-full bg-[#162623]" style={{ height: `${d.value}%` }} />
                      <div className="w-2.5 rounded-t-full bg-[#E8940A]" style={{ height: `${Math.max(15, d.value * 0.6)}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Day labels */}
            <div className="flex justify-between mt-1 pl-7 text-[8px] text-[#4A5A55] font-medium">
              {weeklyActivity.map((d, i) => (
                <span key={i} className="flex-1 text-center">{lang === "bn" ? d.dayBn : d.day}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* === Bottom row: Macro Share + Calorie Trend === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Macro Share — 3-segment donut + right legend */}
          <Card delay={0.15} className="bg-white p-5 relative">
            <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3">Macro Share</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#EEF0F1" strokeWidth="12" />
                  {macroArcs.map((a, i) => (
                    <circle key={i} cx="50" cy="50" r="36" fill="none" stroke={a.color} strokeWidth="12" strokeDasharray={a.dasharray} strokeDashoffset={a.offset} />
                  ))}
                </svg>
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <span className="text-[10px] font-bold text-[#162623] text-center leading-tight">Macro<br />Share</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 space-y-2">
                {macroSegs.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[11px] font-semibold text-[#162623]">{s.label}</span>
                    <span className="text-[11px] font-bold text-[#162623] tabular-nums ml-auto">{s.pct}%</span>
                    <span className="text-[10px] text-[#4A5A55] tabular-nums w-10 text-right">{s.grams}g</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Calorie Trend — dual-wave area + tooltip + Jan–Jun + Y 0–3k */}
          <Card delay={0.18} className="lg:col-span-2 bg-white p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Calorie Trend</h3>
              <div className="text-[10px] text-[#4A5A55]">Last 6 months</div>
            </div>
            <div className="flex gap-2 h-32">
              {/* Y-axis */}
              <div className="flex flex-col justify-between text-[8px] text-[#4A5A55] font-medium w-5 text-right pr-0.5">
                <span>3k</span><span>2k</span><span>1k</span><span>0</span>
              </div>
              {/* Plot */}
              <div className="relative flex-1">
                {/* Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((g) => (
                    <div key={g} className="border-t border-[#DCE4E1]" />
                  ))}
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="goldCoralTrend" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#D4A843" />
                      <stop offset="100%" stopColor="#E06D53" />
                    </linearGradient>
                    <linearGradient id="slateTealFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2C7E8F" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#2A3530" stopOpacity="0.04" />
                    </linearGradient>
                    <linearGradient id="slateTealStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2A3530" />
                      <stop offset="100%" stopColor="#2C7E8F" />
                    </linearGradient>
                    <filter id="glowTrend" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Wave B — dark-slate-to-teal filled area (lower) */}
                  <path d="M0,62 Q70,44 140,54 T280,50 L280,100 L0,100 Z" fill="url(#slateTealFill)" />
                  <path d="M0,62 Q70,44 140,54 T280,50" fill="none" stroke="url(#slateTealStroke)" strokeWidth="2" strokeLinecap="round" />
                  {/* Wave A — gold-to-coral gradient wave (upper, glowing) */}
                  <path d="M0,34 Q70,14 140,26 T280,22" fill="none" stroke="url(#goldCoralTrend)" strokeWidth="2.2" strokeLinecap="round" filter="url(#glowTrend)" opacity="0.95" />
                  {/* Peak marker */}
                  <circle cx="140" cy="26" r="4.5" fill="#E06D53" />
                  <circle cx="140" cy="26" r="2.2" fill="white" />
                </svg>
                {/* Tooltip callout at peak */}
                <div className="absolute" style={{ left: "50%", top: "-4px", transform: "translateX(-50%)" }}>
                  <div className="bg-[#162623] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {formatNumber(consumedCal)} kcal
                  </div>
                  <div className="w-px h-3 bg-[#162623] mx-auto" />
                </div>
              </div>
            </div>
            {/* X-axis */}
            <div className="flex justify-between mt-1 pl-7 text-[8px] text-[#4A5A55]">
              {TREND_MONTHS.map((m) => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </Card>
        </div>

        <div className="h-6" />
      </div>

      {/* Logout confirmation (header Log Out button) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#162623]/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#E06D53]/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-[#E06D53]" />
            </div>
            <h3 className="font-jakarta text-lg font-bold text-[#162623]">{t("sidebar.logout")}?</h3>
            <p className="mt-2 text-sm text-[#4A5A55]">You will be signed out of your account. Your data stays saved.</p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-full border-[#DCE4E1] text-[#162623]">
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut();
                }}
                className="flex-1 rounded-full bg-[#E06D53] text-white hover:bg-[#C95B42]"
              >
                {t("sidebar.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function CategoryPill({ mealType }: { mealType: MealType }) {
  const styles: Record<MealType, string> = {
    breakfast: "bg-[#BEE8B8] text-[#1E4D3B]",
    lunch: "bg-[#5BB8E8] text-white",
    dinner: "bg-[#8B7AB8] text-white",
    snacks: "bg-[#F0A830] text-white",
  };
  const labels: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snacks: "Snack",
  };
  return (
    <span className={cn("text-[9px] font-bold px-2 py-1 rounded-full capitalize whitespace-nowrap", styles[mealType])}>
      {labels[mealType]}
    </span>
  );
}
