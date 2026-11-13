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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./ProgressRing";
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

  const mealsByType = useMemo(() => {
    const groups: Record<MealType, FoodItem[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    foodDiary.forEach((f) => groups[f.mealType]?.push(f));
    return groups;
  }, [foodDiary]);

  const allMeals = foodDiary;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#DCE1E4]">
      <DashboardSidebar activeView="dashboard" />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
                {t("dash.welcome", { name: user?.fullName?.split(" ")[0] ?? "there" })}
              </h1>
              <p className="text-sm text-[#4A5A55] mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr} · {t("dash.welcomeSub")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3.5 h-10 rounded-full bg-white border border-[#DCE4E1] text-[#4A5A55] text-sm w-56">
                <Search className="h-4 w-4" />
                <input type="text" placeholder={t("common.search")} className="bg-transparent outline-none flex-1 placeholder:text-[#4A5A55]" />
              </div>
              <button
                onClick={() => toast({ title: "No new notifications", description: "You're all caught up for today." })}
                className="relative w-10 h-10 rounded-full bg-white border border-[#DCE4E1] flex items-center justify-center text-[#4A5A55] hover:text-[#162623] transition-colors"
                aria-label={t("common.notifications")}
              >
                <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E06D53] ring-2 ring-white" />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#9CB0A8] flex items-center justify-center font-bold text-[#162623] text-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            </div>
          </div>

          {/* === Top KPI Row — 3 cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Daily Calories — sage card with ring + overlapping food photo */}
            <Card className="bg-[#9CB0A8] p-5 relative overflow-visible border-none">
              <div className="flex items-center gap-1.5 mb-2">
                <Flame className="h-4 w-4 text-white" strokeWidth={2} />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{t("dash.calories.title")}</span>
              </div>
              <div className="flex items-center gap-3">
                <ProgressRing
                  value={consumedCal}
                  max={dailyCal}
                  size={90}
                  strokeWidth={8}
                  color="#FFFFFF"
                  trackColor="rgba(255,255,255,0.2)"
                  showCenterText={false}
                >
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-white tabular-nums leading-none">{Math.round(calPct)}%</div>
                  </div>
                </ProgressRing>
                <div>
                  <div className="text-2xl font-extrabold text-white tabular-nums leading-tight">{formatNumber(consumedCal)}</div>
                  <div className="text-xs text-white/60">/ {formatNumber(dailyCal)} kcal</div>
                  <div className="text-[10px] text-white/50 mt-1">{formatNumber(remainingCal)} remaining</div>
                </div>
              </div>
              {/* Overlapping food photo */}
              <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md hidden sm:block">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop" alt="Meal" className="w-full h-full object-cover" />
              </div>
            </Card>

            {/* Protein Goal — light card with sage border + overlapping food photo */}
            <Card className="bg-[#EEF0F1] border border-[#9CB0A8] p-5 relative overflow-visible">
              <div className="flex items-center gap-1.5 mb-2">
                <Beef className="h-4 w-4 text-[#162623]" strokeWidth={2} />
                <span className="text-xs font-semibold text-[#162623]/60 uppercase tracking-wide">{t("dash.protein.title")}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#162623] tabular-nums">{consumedProtein}</span>
                <span className="text-sm text-[#162623]/50">/ {proteinGoal}g</span>
              </div>
              <div className="text-[10px] text-[#162623]/50 mt-1">{Math.max(0, proteinGoal - consumedProtein)}g remaining</div>
              {/* Mini carbs + fat */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MacroMini icon={Wheat} label={t("dash.carbs.title")} value={consumedCarbs} goal={carbsGoal} color="#162623" />
                <MacroMini icon={Droplet} label={t("dash.fat.title")} value={consumedFat} goal={fatGoal} color="#E06D53" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md hidden sm:block">
                <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop" alt="Protein" className="w-full h-full object-cover" />
              </div>
            </Card>

            {/* Day Streak — sage card with flame dots */}
            <Card className="bg-[#9CB0A8] p-5 relative overflow-hidden border-none">
              <div className="flex items-center gap-1.5 mb-2">
                <Trophy className="h-4 w-4 text-[#162623]" strokeWidth={2} />
                <span className="text-xs font-semibold text-[#162623]/60 uppercase tracking-wide">{t("dash.streak.title")}</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-extrabold text-[#162623] tabular-nums">{streak}</span>
                <span className="text-sm text-[#162623]/60">{t("dash.streak.days")}</span>
              </div>
              {/* 7 flame-shaped dots */}
              <div className="flex items-center gap-0">
                {weeklyActivity.map((d, i) => (
                  <React.Fragment key={i}>
                    <div className="w-2.5 h-3 flex-shrink-0">
                      <svg viewBox="0 0 10 12" fill="none">
                        <path d="M5 0 C5 3 8 4 8 7 C8 10 6.5 12 5 12 C3.5 12 2 10 2 7 C2 5 4 4 5 0Z" fill="#162623" opacity={i === weeklyActivity.length - 1 ? 1 : 0.5} />
                      </svg>
                    </div>
                    {i < weeklyActivity.length - 1 && <div className="h-px w-2 border-t border-dashed border-[#162623]/30 flex-shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-3 text-xs text-[#162623]/60">{t("dash.streak.goalsCompleted")}: <span className="font-bold text-[#162623]">{completedTasks}/{tasks.length}</span></div>
            </Card>
          </div>

          {/* === Middle row: Food recap (wide) + Weekly intake === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Today's Food Recap — wide white card with ticket notch */}
            <Card className="lg:col-span-2 bg-white p-5 relative">
              {/* Ticket notch — right edge */}
              <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#DCE1E4]" />
              <div className="flex items-center justify-between mb-3">
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
                <div className="w-16 text-center hidden sm:block">Category</div>
                <div className="w-12 text-center">Protein</div>
                <div className="w-14 text-right">Calories</div>
              </div>
              {/* Meal rows */}
              <div className="max-h-48 overflow-y-auto scroll-soft">
                {allMeals.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 px-1 py-2.5 border-b border-[#DCE4E1]/50 last:border-0">
                    <div className="w-9 h-9 rounded-full bg-[#DCE1E4] flex items-center justify-center flex-shrink-0 text-lg">
                      {foodEmoji(f.imageQuery)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#162623] truncate">{lang === "bn" ? f.nameBn : f.name}</div>
                    </div>
                    <div className="w-16 text-center text-[10px] text-[#4A5A55] hidden sm:block capitalize">{f.mealType}</div>
                    <div className="w-12 flex justify-center">
                      <div className="bg-[#9CB0A8] text-white text-[10px] font-bold px-2 py-1 rounded-full">{f.protein}g</div>
                    </div>
                    <div className="w-14 text-right text-xs font-bold text-[#162623] tabular-nums">{f.calories}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Intake — white card with grouped dual bars */}
            <Card className="bg-white p-5">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-0.5">{t("dash.streak.weekly")}</h3>
              <p className="text-[10px] text-[#4A5A55] mb-3">Statistics</p>
              <div className="flex items-end justify-between gap-1.5 h-24">
                {weeklyActivity.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 80 }}>
                      <div className="w-2.5 rounded-t-full bg-[#162623]" style={{ height: `${d.value}%` }} />
                      <div className="w-2.5 rounded-t-full bg-[#9CB0A8]" style={{ height: `${d.value * 0.7}%` }} />
                    </div>
                    <span className="text-[8px] text-[#4A5A55] font-medium">{lang === "bn" ? d.dayBn : d.day}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* === Bottom row: Macro Share + Calorie Trend + Scanner CTA === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Macro Share donut */}
            <Card className="bg-white p-5 flex flex-col items-center justify-center">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3">Macro Share</h3>
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#E5E7E5" strokeWidth="10" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#162623" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30 * (consumedProtein / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 30}`}
                    strokeDashoffset="0"
                  />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#9CB0A8" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30 * (consumedCarbs / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 30}`}
                    strokeDashoffset={`${-2 * Math.PI * 30 * (consumedProtein / (consumedProtein + consumedCarbs + consumedFat || 1))}`}
                  />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#DCE1E4" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30 * (consumedFat / (consumedProtein + consumedCarbs + consumedFat || 1))} ${2 * Math.PI * 30}`}
                    strokeDashoffset={`${-2 * Math.PI * 30 * ((consumedProtein + consumedCarbs) / (consumedProtein + consumedCarbs + consumedFat || 1))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#162623] text-center leading-tight">Macro<br/>Share</span>
                </div>
              </div>
              <div className="flex gap-3 mt-3 text-[9px]">
                <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#162623]" />P</span>
                <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#9CB0A8]" />C</span>
                <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#DCE1E4] border border-[#9CB0A8]" />F</span>
              </div>
            </Card>

            {/* Calorie Trend — wide white card with wave chart */}
            <Card className="lg:col-span-2 bg-white p-5 relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Calorie Trend</h3>
                <div className="text-[10px] text-[#4A5A55]">Last 7 days</div>
              </div>
              <div className="relative h-24">
                <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sageGradDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9CB0A8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#9CB0A8" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d="M0,50 Q40,20 80,35 T160,25 T240,30 T280,35 L280,80 L0,80 Z" fill="url(#sageGradDash)" />
                  <path d="M0,50 Q40,20 80,35 T160,25 T240,30 T280,35" fill="none" stroke="#9CB0A8" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0,55 Q40,40 80,45 T160,50 T240,40 T280,42" fill="none" stroke="#162623" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  <circle cx="160" cy="25" r="4" fill="#162623" />
                  <circle cx="160" cy="25" r="2" fill="#9CB0A8" />
                </svg>
                <div className="absolute" style={{ left: "57%", top: "0", transform: "translateX(-50%)" }}>
                  <div className="bg-[#162623] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">{formatNumber(consumedCal)} kcal</div>
                  <div className="w-px h-2 bg-[#162623] mx-auto" />
                </div>
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-[#4A5A55] px-1">
                {weeklyActivity.map((d, i) => (
                  <span key={i}>{lang === "bn" ? d.dayBn : d.day}</span>
                ))}
              </div>
            </Card>
          </div>

          {/* === Scanner CTA + Tasks + Reminders + Insights === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* AI Scanner CTA */}
            <Card className="bg-[#162623] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#E06D53]/10 blur-2xl" />
              <div className="relative flex items-center gap-4">
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#E06D53] flex items-center justify-center shadow-lg">
                    <Camera className="h-7 w-7 text-white" strokeWidth={1.6} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-jakarta text-base font-extrabold text-white">{t("dash.scanner.title")}</h3>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{t("dash.scanner.desc")}</p>
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
                <span className="text-xs font-semibold text-[#162623]/60 px-2 py-0.5 rounded-full bg-[#DCE1E4]">
                  {t("dash.tasks.completed", { done: completedTasks, total: tasks.length })}
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto scroll-soft">
                {tasks.map((task) => (
                  <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#DCE1E4]/40 text-left transition-colors">
                    <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all", task.completed ? "bg-[#9CB0A8] border-[#9CB0A8]" : "border-[#DCE4E1] bg-white")}>
                      {task.completed && <Check className="h-3 w-3 text-[#162623]" strokeWidth={3} />}
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
                <div className="h-1.5 bg-[#DCE1E4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9CB0A8] rounded-full transition-all" style={{ width: `${taskPct}%` }} />
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
                      <div key={r.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#DCE1E4]/30">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", r.completed ? "bg-[#9CB0A8]/20" : "bg-[#DCE1E4]")}>
                          <Icon className={cn("h-3.5 w-3.5", r.completed ? "text-[#9CB0A8]" : "text-[#162623]/60")} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-[#162623] block truncate">{lang === "bn" ? r.titleBn : r.title}</span>
                          <p className="text-[10px] text-[#4A5A55] truncate">{lang === "bn" ? r.descriptionBn : r.description}</p>
                        </div>
                        <button onClick={() => toggleReminder(r.id)} className={cn("w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5", r.completed ? "bg-[#9CB0A8] border-[#9CB0A8]" : "border-[#DCE4E1]")}>
                          {r.completed && <Check className="h-2.5 w-2.5 text-[#162623]" strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="bg-[#9CB0A8] p-5 relative overflow-hidden border-none">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-[#162623]" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">{t("dash.insights.title")}</h3>
                </div>
                <div className="space-y-1.5">
                  {SAMPLE_INSIGHTS.slice(0, 2).map((ins) => {
                    const Icon = iconMap[ins.icon] ?? TrendingUp;
                    return (
                      <div key={ins.id} className="flex items-start gap-2 p-2 rounded-xl bg-white/10">
                        <Icon className="h-3.5 w-3.5 text-[#162623] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                        <p className="text-[11px] text-[#162623]/80 leading-relaxed">{lang === "bn" ? ins.textBn : ins.text}</p>
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
        "rounded-2xl border border-[#DCE4E1] shadow-[0_2px_12px_rgba(22,38,35,0.04)] hover:shadow-[0_6px_24px_rgba(22,38,35,0.07)] transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function MacroMini({ icon: Icon, label, value, goal, color }: { icon: React.ElementType; label: string; value: number; goal: number; color: string }) {
  const pct = Math.min(100, goal > 0 ? (value / goal) * 100 : 0);
  return (
    <div className="rounded-xl bg-white/60 p-2">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" style={{ color }} strokeWidth={2} />
        <span className="text-[9px] text-[#4A5A55] font-medium">{label}</span>
      </div>
      <div className="text-xs font-bold text-[#162623] tabular-nums">
        {value}<span className="text-[9px] text-[#162623]/40 font-medium">/{goal}g</span>
      </div>
      <div className="mt-1 h-1 bg-[#DCE1E4] rounded-full overflow-hidden">
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
