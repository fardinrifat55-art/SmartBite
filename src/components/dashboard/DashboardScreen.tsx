"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Droplets,
  Utensils,
  Activity,
  Camera,
  Check,
  Plus,
  TrendingUp,
  PieChart,
  Leaf,
  Sparkles,
  ArrowRight,
  Trophy,
  Calendar,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/nutrition";
import { SAMPLE_INSIGHTS } from "@/lib/sample-data";
import type { FoodItem, MealType } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export function DashboardScreen() {
  const { t, lang } = useI18n();
  const user = useAppStore((s) => s.user);
  const targets = useAppStore((s) => s.targets);
  const foodDiary = useAppStore((s) => s.foodDiary);
  const tasks = useAppStore((s) => s.tasks);
  const reminders = useAppStore((s) => s.reminders);
  const streak = useAppStore((s) => s.streak);
  const weeklyActivity = useAppStore((s) => s.weeklyActivity);
  const getConsumedCalories = useAppStore((s) => s.getConsumedCalories);
  const getConsumedProtein = useAppStore((s) => s.getConsumedProtein);
  const getConsumedCarbs = useAppStore((s) => s.getConsumedCarbs);
  const getConsumedFat = useAppStore((s) => s.getConsumedFat);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const toggleReminder = useAppStore((s) => s.toggleReminder);
  const setView = useAppStore((s) => s.setView);
  const { toast } = useToast();

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

  const dailyCal = targets?.dailyCalories ?? 2000;
  const proteinGoal = targets?.protein ?? 120;
  const carbsGoal = targets?.carbs ?? 250;
  const fatGoal = targets?.fat ?? 70;

  const remainingCal = Math.max(0, dailyCal - consumedCal);
  const calPct = Math.min(100, (consumedCal / dailyCal) * 100);

  const completedTasks = tasks.filter((tk) => tk.completed).length;
  const taskPct = Math.round((completedTasks / tasks.length) * 100);

  const allMeals = foodDiary;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="min-h-screen bg-[#9CB0A8]">
      <div className="lg:p-4">
        <div className="max-w-[1400px] mx-auto bg-[#E3E5E3] lg:rounded-[32px] lg:overflow-hidden lg:shadow-[0_20px_60px_rgba(22,38,35,0.18)] flex flex-col lg:flex-row lg:h-[calc(100vh-2rem)]">
          <DashboardSidebar activeView="dashboard" />

          {/* Main content */}
          <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">
            <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5C842] to-[#E8940A] flex items-center justify-center flex-shrink-0">
                      <Sun className="h-4.5 w-4.5 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
                      {t("dash.welcome", { name: user?.fullName?.split(" ")[0] ?? "there" })}
                    </h1>
                  </div>
                  <p className="text-sm text-[#4A5A55] mt-1 flex items-center gap-1.5 ml-10">
                    <Calendar className="h-3.5 w-3.5" />
                    {dateStr} · {t("dash.welcomeSub")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* White pill search bar */}
                  <div className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full bg-white border border-[#DCE4E1] text-[#4A5A55] text-sm w-60 shadow-sm">
                    <Search className="h-4 w-4" />
                    <input
                      type="text"
                      placeholder={t("common.search")}
                      className="bg-transparent outline-none flex-1 placeholder:text-[#4A5A55]/60"
                    />
                  </div>
                  <button
                    onClick={() => toast({ title: "No new notifications", description: "You're all caught up for today." })}
                    className="relative w-11 h-11 rounded-full bg-white border border-[#DCE4E1] flex items-center justify-center text-[#4A5A55] hover:text-[#162623] transition-colors shadow-sm"
                    aria-label={t("common.notifications")}
                  >
                    <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E06D53] ring-2 ring-white" />
                  </button>
                </div>
              </div>

              {/* === Top KPI Row — 3 cards === */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Daily Calories — dark green gradient with gold contour lines + salad bowl photo */}
                <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 relative overflow-visible border-none">
                  {/* Gold wavy contour lines */}
                  <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none" style={{ opacity: 0.35 }}>
                    <path d="M0 35 Q40 18 80 30 T160 22 T200 28" stroke="#D4A843" strokeWidth="0.8" fill="none" />
                    <path d="M0 42 Q40 25 80 38 T160 30 T200 36" stroke="#D4A843" strokeWidth="0.6" fill="none" />
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
                    <div className="text-[11px] text-white/50 mt-0.5">
                      of {formatNumber(dailyCal)} kcal · {Math.round(calPct)}%
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-3 h-1.5 bg-white/15 rounded-full overflow-hidden max-w-[65%]">
                      <div className="h-full bg-white rounded-full transition-all" style={{ width: `${calPct}%` }} />
                    </div>
                    <div className="text-[10px] text-white/45 mt-1.5">{formatNumber(remainingCal)} remaining</div>
                  </div>
                  {/* Overlapping salad bowl photo */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-xl hidden sm:block z-10">
                    <img
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop"
                      alt="Grain bowl"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>

                {/* Protein Goal — light card with topographic contour lines + salmon photo */}
                <Card className="bg-[#F4F2F0] border border-[#D4D8D6] p-5 relative overflow-visible">
                  {/* Gray topographic contour lines */}
                  <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.28 }}>
                    <path d="M55 5 Q80 25 70 45 Q60 65 85 85" stroke="#9CB0A8" strokeWidth="0.7" fill="none" />
                    <path d="M62 8 Q87 28 77 48 Q67 68 92 88" stroke="#9CB0A8" strokeWidth="0.5" fill="none" />
                    <path d="M69 12 Q94 32 84 52 Q74 72 99 92" stroke="#9CB0A8" strokeWidth="0.4" fill="none" />
                  </svg>
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Beef className="h-4 w-4 text-[#1E4D3B]" strokeWidth={2} />
                      <span className="text-xs font-semibold text-[#162623]/60 uppercase tracking-wide">{t("dash.protein.title")}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#162623] tabular-nums">{consumedProtein}</span>
                      <span className="text-sm text-[#162623]/45">/ {proteinGoal}g</span>
                    </div>
                    <div className="text-[10px] text-[#162623]/45 mt-0.5">{Math.max(0, proteinGoal - consumedProtein)}g remaining</div>
                    {/* Mini carbs + fat */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MacroMini icon={Wheat} label={t("dash.carbs.title")} value={consumedCarbs} goal={carbsGoal} color="#162623" />
                      <MacroMini icon={Droplet} label={t("dash.fat.title")} value={consumedFat} goal={fatGoal} color="#E8940A" />
                    </div>
                  </div>
                  {/* Overlapping salmon+avocado photo */}
                  <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full overflow-hidden border-[3px] border-white shadow-xl hidden sm:block z-10">
                    <img
                      src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=120&fit=crop"
                      alt="Salmon avocado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>

                {/* Day Streak — sage card with orange checkmark badges + Active Streak pill */}
                <Card className="bg-[#A9BDA9] p-5 relative overflow-visible border-none">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-[#162623]" strokeWidth={2} />
                      <span className="text-xs font-semibold text-[#162623]/70 uppercase tracking-wide">{t("dash.streak.title")}</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/55 text-[#162623] uppercase tracking-wide">
                      Active Streak
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#162623] tabular-nums">{streak}</span>
                    <span className="text-sm font-semibold text-[#162623]/55">{t("dash.streak.days")}</span>
                  </div>
                  {/* Orange checkmark badges connected by dots */}
                  <div className="flex items-center gap-0 mt-3">
                    {weeklyActivity.map((d, i) => {
                      const completed = i < Math.min(streak, 6);
                      const isToday = i === Math.min(streak - 1, 6);
                      return (
                        <React.Fragment key={i}>
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                              completed
                                ? "bg-[#E8940A] shadow-sm"
                                : isToday
                                ? "bg-[#162623]/15"
                                : "border border-[#162623]/20"
                            )}
                          >
                            {completed && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />}
                          </div>
                          {i < weeklyActivity.length - 1 && (
                            <div className="h-px w-1.5 border-t border-dashed border-[#162623]/25 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-[10px] text-[#162623]/55">
                    {t("dash.streak.goalsCompleted")}: <span className="font-bold text-[#162623]">{completedTasks}/{tasks.length}</span>
                  </div>
                </Card>
              </div>

              {/* === Middle row: Food recap (wide) + Weekly intake === */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Today's Food Recap — wide white card with gold contours + ticket cutouts both edges */}
                <Card className="lg:col-span-2 bg-white p-5 relative overflow-visible">
                  {/* Gold wavy contour lines top-right */}
                  <svg className="absolute top-0 right-0 w-32 h-16 pointer-events-none" viewBox="0 0 130 60" fill="none" style={{ opacity: 0.22 }}>
                    <path d="M0 25 Q30 8 60 20 T130 16" stroke="#D4A843" strokeWidth="0.7" fill="none" />
                    <path d="M0 35 Q30 18 60 30 T130 26" stroke="#D4A843" strokeWidth="0.5" fill="none" />
                  </svg>
                  {/* Ticket cutouts — both edges */}
                  <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E3E5E3]" />
                  <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E3E5E3]" />
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
                    <div className="w-9 flex-shrink-0" />
                    <div className="flex-1">Meal</div>
                    <div className="w-20 text-center hidden sm:block">Category</div>
                    <div className="w-12 text-center">Protein</div>
                    <div className="w-14 text-right">Calories</div>
                  </div>
                  {/* Meal rows */}
                  <div className="max-h-48 overflow-y-auto scroll-soft">
                    {allMeals.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 px-1 py-2.5 border-b border-[#DCE4E1]/50 last:border-0">
                        <div className="w-9 h-9 rounded-full bg-[#E3E5E3] flex items-center justify-center flex-shrink-0 text-lg">
                          {foodEmoji(f.imageQuery)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#162623] truncate">{lang === "bn" ? f.nameBn : f.name}</div>
                        </div>
                        <div className="w-20 flex justify-center hidden sm:block">
                          <CategoryPill mealType={f.mealType} />
                        </div>
                        <div className="w-12 flex justify-center">
                          <div className="bg-[#D4A843] text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-[28px] text-center">{f.protein}g</div>
                        </div>
                        <div className="w-14 text-right text-xs font-bold text-[#162623] tabular-nums">{f.calories}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Weekly Intake — white card with gold contours + dark green + orange bars */}
                <Card className="bg-white p-5 relative overflow-hidden">
                  {/* Gold wavy contour lines top-right */}
                  <svg className="absolute top-0 right-0 w-24 h-12 pointer-events-none" viewBox="0 0 100 50" fill="none" style={{ opacity: 0.2 }}>
                    <path d="M0 18 Q25 6 50 15 T100 12" stroke="#D4A843" strokeWidth="0.6" fill="none" />
                    <path d="M0 26 Q25 14 50 23 T100 20" stroke="#D4A843" strokeWidth="0.45" fill="none" />
                  </svg>
                  <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-0.5 relative">{t("dash.streak.weekly")}</h3>
                  <p className="text-[10px] text-[#4A5A55] mb-3 relative">Statistics</p>
                  <div className="flex items-end justify-between gap-1.5 h-28 relative">
                    {weeklyActivity.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 90 }}>
                          <div className="w-2.5 rounded-t-full bg-[#1E4D3B]" style={{ height: `${d.value}%` }} />
                          <div className="w-2.5 rounded-t-full bg-[#E8940A]" style={{ height: `${Math.max(15, d.value * 0.6)}%` }} />
                        </div>
                        <span className="text-[8px] text-[#4A5A55] font-medium">{lang === "bn" ? d.dayBn : d.day}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* === Bottom row: Macro Share + Calorie Trend === */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Macro Share — multi-color glow donut */}
                <Card className="bg-white p-5 flex flex-col items-center justify-center relative">
                  <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3 self-start">Macro Share</h3>
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <filter id="glowMacro" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#EEF0F1" strokeWidth="11" />
                      {/* Protein — dark green */}
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#1E4D3B" strokeWidth="11" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 36 * (consumedProtein / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 36}`}
                        strokeDashoffset="0"
                      />
                      {/* Carbs — golden amber */}
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#D4A843" strokeWidth="11" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 36 * (consumedCarbs / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 36}`}
                        strokeDashoffset={`${-2 * Math.PI * 36 * (consumedProtein / (consumedProtein + consumedCarbs + consumedFat || 1))}`}
                      />
                      {/* Fat — blue with glow */}
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#5BB8E8" strokeWidth="11" strokeLinecap="round" filter="url(#glowMacro)"
                        strokeDasharray={`${2 * Math.PI * 36 * (consumedFat / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 36}`}
                        strokeDashoffset={`${-2 * Math.PI * 36 * ((consumedProtein + consumedCarbs) / (consumedProtein + consumedCarbs + consumedFat || 1))}`}
                      />
                    </svg>
                    {/* White core */}
                    <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#162623] text-center leading-tight">Macro<br/>Share</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3 text-[9px]">
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#1E4D3B]" />P</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#D4A843]" />C</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#5BB8E8]" />F</span>
                  </div>
                </Card>

                {/* Calorie Trend — wide white card with layered gold/orange/green waves */}
                <Card className="lg:col-span-2 bg-white p-5 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Calorie Trend</h3>
                    <div className="text-[10px] text-[#4A5A55]">Last 6 months</div>
                  </div>
                  <div className="relative h-28">
                    <svg className="w-full h-full" viewBox="0 0 280 90" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="greenGradTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1E4D3B" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#1E4D3B" stopOpacity="0.02" />
                        </linearGradient>
                        <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {/* Gold wave (top, glowing) */}
                      <path d="M0,38 Q47,18 93,28 T187,18 T280,24" fill="none" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" filter="url(#glowGold)" opacity="0.7" />
                      {/* Orange/coral wave (middle) */}
                      <path d="M0,48 Q47,30 93,38 T187,30 T280,36" fill="none" stroke="#E8940A" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                      {/* Dark green wave with fill (bottom) */}
                      <path d="M0,55 Q47,35 93,48 T187,38 T280,44 L280,90 L0,90 Z" fill="url(#greenGradTrend)" />
                      <path d="M0,55 Q47,35 93,48 T187,38 T280,44" fill="none" stroke="#1E4D3B" strokeWidth="2" strokeLinecap="round" />
                      {/* Tooltip marker dot — orange */}
                      <circle cx="120" cy="42" r="5" fill="#E8940A" />
                      <circle cx="120" cy="42" r="2.5" fill="white" />
                    </svg>
                    {/* Tooltip callout */}
                    <div className="absolute" style={{ left: "43%", top: "-2px", transform: "translateX(-50%)" }}>
                      <div className="bg-[#162623] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                        {formatNumber(consumedCal)} kcal
                      </div>
                      <div className="w-px h-3 bg-[#162623] mx-auto" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-[#4A5A55] px-1">
                    {months.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* === Scanner CTA + Tasks + Reminders + Insights === */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* AI Scanner CTA */}
                <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 relative overflow-hidden border-none">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#E06D53]/15 blur-2xl" />
                  {/* Gold contour accent */}
                  <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 40" fill="none" preserveAspectRatio="none" style={{ opacity: 0.2 }}>
                    <path d="M0 28 Q50 14 100 22 T200 18" stroke="#D4A843" strokeWidth="0.6" fill="none" />
                  </svg>
                  <div className="relative flex items-center gap-4">
                    <div className="hidden sm:flex flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#E06D53] flex items-center justify-center shadow-lg">
                        <Camera className="h-7 w-7 text-white" strokeWidth={1.6} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-jakarta text-base font-extrabold text-white">{t("dash.scanner.title")}</h3>
                      <p className="text-xs text-white/65 mt-1 leading-relaxed">{t("dash.scanner.desc")}</p>
                      <Button onClick={() => setView("scanner")} size="sm" className="mt-3 rounded-full bg-[#E06D53] text-white font-semibold hover:bg-[#C95B42] shadow-md h-9">
                        <Camera className="mr-1.5 h-3.5 w-3.5" />{t("dash.scanner.cta")}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Daily Tasks */}
                <Card className="bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-jakarta text-base font-extrabold text-[#162623]">{t("dash.tasks.title")}</h3>
                    <span className="text-xs font-semibold text-[#162623]/60 px-2 py-0.5 rounded-full bg-[#E3E5E3]">
                      {t("dash.tasks.completed", { done: completedTasks, total: tasks.length })}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto scroll-soft">
                    {tasks.map((task) => (
                      <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#E3E5E3]/40 text-left transition-colors">
                        <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all", task.completed ? "bg-[#1E4D3B] border-[#1E4D3B]" : "border-[#DCE4E1] bg-white")}>
                          {task.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={cn("text-sm flex-1", task.completed ? "text-[#162623]/40 line-through" : "text-[#162623]/80")}>
                          {lang === "bn" ? task.labelBn : task.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#DCE4E1]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#4A5A55]">Overall</span>
                      <span className="font-semibold text-[#162623]">{taskPct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E3E5E3] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E4D3B] rounded-full transition-all" style={{ width: `${taskPct}%` }} />
                    </div>
                  </div>
                </Card>

                {/* Reminders + Insights stacked */}
                <div className="space-y-4">
                  <Card className="bg-white p-5">
                    <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3">{t("dash.reminders.title")}</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto scroll-soft">
                      {reminders.slice(0, 3).map((r) => {
                        const Icon = iconMap[r.icon] ?? Bell;
                        return (
                          <div key={r.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#E3E5E3]/30">
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", r.completed ? "bg-[#1E4D3B]/15" : "bg-[#E3E5E3]")}>
                              <Icon className={cn("h-3.5 w-3.5", r.completed ? "text-[#1E4D3B]" : "text-[#162623]/60")} strokeWidth={1.8} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-semibold text-[#162623] block truncate">{lang === "bn" ? r.titleBn : r.title}</span>
                              <p className="text-[10px] text-[#4A5A55] truncate">{lang === "bn" ? r.descriptionBn : r.description}</p>
                            </div>
                            <button onClick={() => toggleReminder(r.id)} className={cn("w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5", r.completed ? "bg-[#1E4D3B] border-[#1E4D3B]" : "border-[#DCE4E1]")}>
                              {r.completed && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* AI Insights */}
                  <Card className="bg-[#A9BDA9] p-5 relative overflow-hidden border-none">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-white/25 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-[#162623]" strokeWidth={1.8} />
                      </div>
                      <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">{t("dash.insights.title")}</h3>
                    </div>
                    <div className="space-y-1.5">
                      {SAMPLE_INSIGHTS.slice(0, 2).map((ins) => {
                        const Icon = iconMap[ins.icon] ?? TrendingUp;
                        return (
                          <div key={ins.id} className="flex items-start gap-2 p-2 rounded-xl bg-white/15">
                            <Icon className="h-3.5 w-3.5 text-[#162623] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                            <p className="text-[11px] text-[#162623]/85 leading-relaxed">{lang === "bn" ? ins.textBn : ins.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="h-6" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ===== Helper components =====
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-[#DCE4E1] shadow-[0_2px_12px_rgba(22,38,35,0.05)] hover:shadow-[0_6px_24px_rgba(22,38,35,0.08)] transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function CategoryPill({ mealType }: { mealType: MealType }) {
  const styles: Record<MealType, string> = {
    breakfast: "bg-[#BEE8B8] text-[#1E4D3B]",
    lunch: "bg-[#5BB8E8] text-white",
    dinner: "bg-[#8B7AB8] text-white",
    snacks: "bg-[#E3E5E3] text-[#4A5A55]",
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

function MacroMini({ icon: Icon, label, value, goal, color }: { icon: React.ElementType; label: string; value: number; goal: number; color: string }) {
  const pct = Math.min(100, goal > 0 ? (value / goal) * 100 : 0);
  return (
    <div className="rounded-xl bg-white/70 p-2">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" style={{ color }} strokeWidth={2} />
        <span className="text-[9px] text-[#4A5A55] font-medium">{label}</span>
      </div>
      <div className="text-xs font-bold text-[#162623] tabular-nums">
        {value}<span className="text-[9px] text-[#162623]/40 font-medium">/{goal}g</span>
      </div>
      <div className="mt-1 h-1 bg-[#E3E5E3] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  beef: Beef,
  utensils: Utensils,
  activity: Activity,
  "trending-up": TrendingUp,
  "pie-chart": PieChart,
  leaf: Leaf,
};

function foodEmoji(query: string): string {
  const map: Record<string, string> = {
    "paratha dal": "🫓",
    banana: "🍌",
    "rice fish curry": "🍚",
    "cucumber salad": "🥒",
    "mixed nuts": "🥜",
  };
  return map[query] ?? "🍽️";
}
