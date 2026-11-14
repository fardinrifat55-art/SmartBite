"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Flame,
  Beef,
  Check,
  Plus,
  Trophy,
  Calendar,
  Sun,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/nutrition";
import type { MealType } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

// Real food photos (sourced via image-search) keyed by the diary's imageQuery.
const FOOD_PHOTOS: Record<string, string> = {
  "paratha dal": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4459ca5f52f.jpg",
  banana: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/73fd0fa4f36a.jpg",
  "rice fish curry": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/472d689232cd.jpg",
  "cucumber salad": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b00ef05ebbca.jpg",
  "mixed nuts": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/05943486772f.jpg",
};

export function DashboardScreen() {
  const { t, lang } = useI18n();
  const user = useAppStore((s) => s.user);
  const targets = useAppStore((s) => s.targets);
  const foodDiary = useAppStore((s) => s.foodDiary);
  const streak = useAppStore((s) => s.streak);
  const weeklyActivity = useAppStore((s) => s.weeklyActivity);
  const getConsumedCalories = useAppStore((s) => s.getConsumedCalories);
  const getConsumedProtein = useAppStore((s) => s.getConsumedProtein);
  const getConsumedCarbs = useAppStore((s) => s.getConsumedCarbs);
  const getConsumedFat = useAppStore((s) => s.getConsumedFat);
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
  const consumedFiber = useMemo(
    () => foodDiary.reduce((s, f) => s + (f.fiber || 0), 0),
    [foodDiary]
  );

  // Today's Food Recap shows the main meals (first breakfast + first lunch),
  // matching the spec's two-row recap. Snacks and side dishes still count
  // toward the daily totals but aren't listed as separate rows.
  const recapMeals = useMemo(() => {
    const seen = new Set<string>();
    return foodDiary.filter((f) => {
      if (f.mealType === "snacks" || f.mealType === "dinner") return false;
      if (seen.has(f.mealType)) return false;
      seen.add(f.mealType);
      return true;
    });
  }, [foodDiary]);

  const dailyCal = targets?.dailyCalories ?? 2000;
  const proteinGoal = targets?.protein ?? 120;
  const proteinPct = Math.min(100, proteinGoal > 0 ? (consumedProtein / proteinGoal) * 100 : 0);

  const remainingCal = Math.max(0, dailyCal - consumedCal);
  const calPct = Math.min(100, (consumedCal / dailyCal) * 100);

  // 4-segment macro donut arcs: deep forest, warm amber, vibrant coral, bright blue.
  const macroArcs = useMemo(() => {
    const total = consumedProtein + consumedCarbs + consumedFat + consumedFiber || 1;
    const C = 2 * Math.PI * 36;
    const segs = [
      { v: consumedProtein, color: "#1E4D3B" },
      { v: consumedCarbs, color: "#D4A843" },
      { v: consumedFat, color: "#E06D53" },
      { v: consumedFiber, color: "#5BB8E8" },
    ];
    let acc = 0;
    return segs.map((s) => {
      const frac = s.v / total;
      const arc = C * frac;
      const offset = -C * acc;
      acc += frac;
      return { color: s.color, dasharray: `${arc} ${C}`, offset };
    });
  }, [consumedProtein, consumedCarbs, consumedFat, consumedFiber]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const userInitial = user?.fullName?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6EDE7] via-[#D6DEDA] to-[#C3CCC6]">
      <div className="lg:p-4">
        {/* Desktop window mockup */}
        <div className="max-w-[1400px] mx-auto bg-[#E3E5E3] lg:rounded-[32px] lg:overflow-hidden lg:shadow-[0_24px_70px_rgba(22,38,35,0.22)] flex flex-col lg:h-[calc(100vh-2rem)]">
          {/* Window title bar */}
          <div className="hidden lg:flex items-center gap-3 px-4 h-10 bg-white/75 border-b border-[#DCE4E1] flex-shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E06D53]" />
              <span className="w-3 h-3 rounded-full bg-[#E8940A]" />
              <span className="w-3 h-3 rounded-full bg-[#1E4D3B]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-0.5 rounded-full bg-[#E3E5E3] text-[10px] font-medium text-[#4A5A55] flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-[#1E4D3B]" strokeWidth={2} />
                nutrilen.ai/dashboard
              </div>
            </div>
            <div className="w-12" />
          </div>

          {/* Window body: sidebar + main */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            <DashboardSidebar activeView="dashboard" />

            {/* Main content */}
            <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">
              <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5">
                      {/* Sun-and-plant badge */}
                      <div className="relative w-9 h-9 flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5C842] to-[#E8940A] flex items-center justify-center shadow-sm">
                          <Sun className="h-4 w-4 text-white" strokeWidth={2.2} />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1E4D3B] flex items-center justify-center ring-2 ring-[#E3E5E3]">
                          <Leaf className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
                        {t("dash.welcome", { name: user?.fullName?.split(" ")[0] ?? "there" })}
                      </h1>
                    </div>
                    <p className="text-sm text-[#4A5A55] mt-1 flex items-center gap-1.5 ml-11">
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
                    {/* User avatar */}
                    <button
                      onClick={() => setView("settings")}
                      className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-[#E06D53] via-[#5B9B8F] to-[#2C7E8F] flex-shrink-0 shadow-sm hover:scale-105 transition-transform"
                      aria-label="Profile & Settings"
                    >
                      <div className="w-full h-full rounded-full bg-[#162623] flex items-center justify-center font-bold text-white text-sm">
                        {userInitial}
                      </div>
                    </button>
                  </div>
                </div>

                {/* === Top KPI Row — 3 cards === */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Daily Calories — dark forest→emerald gradient with gold wave lines + grain bowl photo */}
                  <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 relative overflow-visible border-none">
                    {/* Golden-orange wavy contour lines */}
                    <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none" style={{ opacity: 0.35 }}>
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
                      <div className="text-[11px] text-white/50 mt-0.5">
                        of {formatNumber(dailyCal)} kcal · {Math.round(calPct)}%
                      </div>
                      {/* Mini progress meter */}
                      <div className="mt-3 h-1.5 bg-white/15 rounded-full overflow-hidden max-w-[65%]">
                        <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8940A] rounded-full transition-all" style={{ width: `${calPct}%` }} />
                      </div>
                      <div className="text-[10px] text-white/45 mt-1.5">{formatNumber(remainingCal)} remaining</div>
                    </div>
                    {/* Overlapping grain bowl photo */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-xl hidden sm:block z-10">
                      <img
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop"
                        alt="Grain bowl"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>

                  {/* Protein Goal — cool mist-gray card with sage border + salmon photo */}
                  <Card className="bg-[#EDF1EC] border border-[#9CB0A8]/55 p-5 relative overflow-visible">
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
                      {/* Progress meter */}
                      <div className="mt-3 h-1.5 bg-[#9CB0A8]/25 rounded-full overflow-hidden max-w-[80%]">
                        <div className="h-full bg-gradient-to-r from-[#1E4D3B] to-[#2C7E8F] rounded-full transition-all" style={{ width: `${proteinPct}%` }} />
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

                  {/* Day Streak — sage card with Active Streak badge + 7-dot progress */}
                  <Card className="bg-[#A9BDA9] p-5 relative overflow-visible border-none">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-[#162623]" strokeWidth={2} />
                        <span className="text-xs font-semibold text-[#162623]/70 uppercase tracking-wide">{t("dash.streak.title")}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/55 text-[#162623] uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8940A]" />Active Streak
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#162623] tabular-nums">{streak}</span>
                      <span className="text-sm font-semibold text-[#162623]/55">{t("dash.streak.days")}</span>
                    </div>
                    {/* 7-dot day-progress indicators */}
                    <div className="flex items-center gap-1.5 mt-3">
                      {weeklyActivity.map((d, i) => {
                        const completed = i < Math.min(streak, 7);
                        return (
                          <div
                            key={i}
                            className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                              completed ? "bg-[#E8940A] shadow-sm" : "border border-[#162623]/20"
                            )}
                          >
                            {completed && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* === Middle row: Food recap (wide) + Weekly intake === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {/* Today's Food Recap — wide white card with ticket cutouts + circular food photos */}
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
                      <div className="w-10 flex-shrink-0" />
                      <div className="flex-1">Meal</div>
                      <div className="w-20 text-center hidden sm:block">Category</div>
                      <div className="w-12 text-center">Protein</div>
                      <div className="w-14 text-right">Calories</div>
                    </div>
                    {/* Meal rows */}
                    <div className="px-1">
                      {recapMeals.map((f) => (
                        <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-[#DCE4E1]/50 last:border-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#E3E5E3]">
                            {FOOD_PHOTOS[f.imageQuery] ? (
                              <img
                                src={FOOD_PHOTOS[f.imageQuery]}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
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
                  </Card>

                  {/* Weekly Intake — white card with dark slate + orange-amber bars */}
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
                            <div className="w-2.5 rounded-t-full bg-[#162623]" style={{ height: `${d.value}%` }} />
                            <div className="w-2.5 rounded-t-full bg-[#E8940A]" style={{ height: `${Math.max(15, d.value * 0.6)}%` }} />
                          </div>
                          <span className="text-[8px] text-[#4A5A55] font-medium">{lang === "bn" ? d.dayBn : d.day}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* === Bottom row: Macro Share + Calorie Trend === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Macro Share — 4-segment donut, no legend */}
                  <Card className="bg-white p-5 flex flex-col items-center justify-center relative">
                    <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3 self-start">Macro Share</h3>
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="36" fill="none" stroke="#EEF0F1" strokeWidth="12" />
                        {macroArcs.map((a, i) => (
                          <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="36"
                            fill="none"
                            stroke={a.color}
                            strokeWidth="12"
                            strokeDasharray={a.dasharray}
                            strokeDashoffset={a.offset}
                          />
                        ))}
                      </svg>
                      {/* White core with label */}
                      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-inner">
                        <span className="text-[10px] font-bold text-[#162623] text-center leading-tight">Macro<br />Share</span>
                      </div>
                    </div>
                  </Card>

                  {/* Calorie Trend — wide white card with dual gradient waves + tooltip */}
                  <Card className="lg:col-span-2 bg-white p-5 relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Calorie Trend</h3>
                      <div className="text-[10px] text-[#4A5A55]">Last 6 months</div>
                    </div>
                    <div className="relative h-28">
                      <svg className="w-full h-full" viewBox="0 0 280 90" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="goldCoralTrend" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#D4A843" />
                            <stop offset="100%" stopColor="#E06D53" />
                          </linearGradient>
                          <linearGradient id="slateTealFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2C7E8F" stopOpacity="0.34" />
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
                        <path d="M0,54 Q70,36 140,48 T280,44 L280,90 L0,90 Z" fill="url(#slateTealFill)" />
                        <path d="M0,54 Q70,36 140,48 T280,44" fill="none" stroke="url(#slateTealStroke)" strokeWidth="2" strokeLinecap="round" />
                        {/* Wave A — gold-to-coral gradient wave (upper, glowing) */}
                        <path d="M0,30 Q70,12 140,24 T280,20" fill="none" stroke="url(#goldCoralTrend)" strokeWidth="2.2" strokeLinecap="round" filter="url(#glowTrend)" opacity="0.95" />
                        {/* Tooltip marker at peak (x=140) */}
                        <circle cx="140" cy="24" r="4.5" fill="#E06D53" />
                        <circle cx="140" cy="24" r="2.2" fill="white" />
                      </svg>
                      {/* Tooltip callout */}
                      <div className="absolute" style={{ left: "50%", top: "-2px", transform: "translateX(-50%)" }}>
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

                <div className="h-6" />
              </div>
            </main>
          </div>
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
