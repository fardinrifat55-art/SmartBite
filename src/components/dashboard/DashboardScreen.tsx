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

  // Group food by meal type
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

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar activeView="dashboard" />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {t("dash.welcome", { name: user?.fullName?.split(" ")[0] ?? "there" })}
              </h1>
              <p className="text-sm text-forest/60 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr} · {t("dash.welcomeSub")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-2 px-3.5 h-10 rounded-full bg-white border border-forest/10 text-forest/50 text-sm w-56">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className="bg-transparent outline-none flex-1 placeholder:text-forest/40"
                />
              </div>
              {/* Notifications */}
              <button
                className="relative w-10 h-10 rounded-full bg-white border border-forest/10 flex items-center justify-center text-forest/60 hover:text-forest hover:border-forest/20 transition-colors"
                aria-label={t("common.notifications")}
              >
                <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-fat ring-2 ring-white" />
              </button>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center font-bold text-forest text-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            </div>
          </div>

          {/* Dashboard grid */}
          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            {/* === Calorie Progress Card === */}
            <Card className="col-span-12 lg:col-span-5 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-forest">
                    {t("dash.calories.title")}
                  </h3>
                  <p className="text-xs text-forest/50 mt-0.5">
                    {t("dash.calories.goal")}: {formatNumber(dailyCal)} {t("common.kcal")}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-lime-soft/50 flex items-center justify-center">
                  <Flame className="h-4.5 w-4.5 text-forest" strokeWidth={1.8} />
                </div>
              </div>
              <div className="flex items-center justify-center py-2">
                <ProgressRing
                  value={consumedCal}
                  max={dailyCal}
                  size={200}
                  strokeWidth={16}
                  color="#A5D52E"
                  trackColor="#E5E7E5"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-forest/50 font-medium uppercase tracking-wide">
                      {t("common.consumed")}
                    </span>
                    <span className="text-3xl font-bold text-forest tabular-nums leading-tight">
                      {formatNumber(consumedCal)}
                    </span>
                    <span className="text-[11px] text-forest/50 mt-0.5">
                      / {formatNumber(dailyCal)} {t("common.kcal")}
                    </span>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-soft/60 text-[10px] font-semibold text-forest">
                      {Math.round(calPct)}%
                    </div>
                  </div>
                </ProgressRing>
              </div>
              {/* Remaining row */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-cream/50 py-2.5">
                  <div className="text-[10px] text-forest/50 uppercase">{t("common.consumed")}</div>
                  <div className="text-sm font-bold text-forest tabular-nums">{formatNumber(consumedCal)}</div>
                </div>
                <div className="rounded-xl bg-lime-soft/40 py-2.5">
                  <div className="text-[10px] text-forest/50 uppercase">{t("common.remaining")}</div>
                  <div className="text-sm font-bold text-forest tabular-nums">{formatNumber(remainingCal)}</div>
                </div>
                <div className="rounded-xl bg-forest/5 py-2.5">
                  <div className="text-[10px] text-forest/50 uppercase">{t("common.goal")}</div>
                  <div className="text-sm font-bold text-forest tabular-nums">{formatNumber(dailyCal)}</div>
                </div>
              </div>
            </Card>

            {/* === Macros + Streak column === */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Protein card */}
              <Card className="bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-protein/15 flex items-center justify-center">
                      <Beef className="h-4 w-4 text-protein" strokeWidth={1.8} />
                    </div>
                    <span className="font-semibold text-forest text-sm">{t("dash.protein.title")}</span>
                  </div>
                  <span className="text-xs text-forest/40 font-medium">g</span>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressRing
                    value={consumedProtein}
                    max={proteinGoal}
                    size={84}
                    strokeWidth={9}
                    color="#9DC45C"
                    showCenterText={false}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-forest tabular-nums leading-none">
                        {Math.round((consumedProtein / proteinGoal) * 100)}%
                      </div>
                    </div>
                  </ProgressRing>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-forest tabular-nums">
                      {consumedProtein}
                      <span className="text-sm text-forest/40 font-medium ml-1">/ {proteinGoal}g</span>
                    </div>
                    <div className="text-xs text-forest/50 mt-1">
                      {Math.max(0, proteinGoal - consumedProtein)}g {t("common.remaining")}
                    </div>
                  </div>
                </div>
                {/* Small carbs + fat row */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <MacroMini
                    icon={Wheat}
                    label={t("dash.carbs.title")}
                    value={consumedCarbs}
                    goal={carbsGoal}
                    color="#F2D15B"
                  />
                  <MacroMini
                    icon={Droplet}
                    label={t("dash.fat.title")}
                    value={consumedFat}
                    goal={fatGoal}
                    color="#E77D6D"
                  />
                </div>
              </Card>

              {/* Streak card */}
              <Card className="bg-forest text-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-lime/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-lime" strokeWidth={1.8} />
                      </div>
                      <span className="font-semibold text-white text-sm">{t("dash.streak.title")}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-bold text-lime tabular-nums">{streak}</span>
                    <span className="text-sm text-white/60">{t("dash.streak.days")}</span>
                  </div>
                  {/* Weekly mini bar chart */}
                  <div className="flex items-end gap-1.5 h-12 mt-2">
                    {weeklyActivity.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-white/8 rounded-full flex items-end overflow-hidden" style={{ height: 36 }}>
                          <div
                            className={cn(
                              "w-full rounded-full transition-all",
                              i === weeklyActivity.length - 1 ? "bg-lime" : "bg-lime/70"
                            )}
                            style={{ height: `${d.value}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-white/50 font-medium">
                          {lang === "bn" ? d.dayBn : d.day}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-white/50">{t("dash.streak.goalsCompleted")}</span>
                    <span className="font-semibold text-lime">{completedTasks}/{tasks.length}</span>
                  </div>
                </div>
              </Card>

              {/* AI Scanner CTA */}
              <Card className="col-span-1 sm:col-span-2 bg-gradient-to-br from-lime-soft/60 to-cream/50 p-5 relative overflow-hidden border-lime/20">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-lime/15 blur-2xl" />
                <div className="relative flex items-center gap-4">
                  {/* Visual */}
                  <div className="hidden sm:flex flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center shadow-lg shadow-forest/20">
                      <Camera className="h-9 w-9 text-lime" strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-bold text-forest">
                      {t("dash.scanner.title")}
                    </h3>
                    <p className="text-sm text-forest/65 mt-1 leading-relaxed">
                      {t("dash.scanner.desc")}
                    </p>
                    <Button
                      onClick={() => setView("scanner")}
                      size="sm"
                      className="mt-3 rounded-full bg-forest text-white font-semibold hover:bg-forest/90 shadow-md"
                    >
                      <Camera className="mr-1.5 h-3.5 w-3.5" />
                      {t("dash.scanner.cta")}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* === Calories Remaining Card === */}
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white p-5">
              <h3 className="font-heading text-base font-bold text-forest mb-1">
                {t("dash.remaining.title")}
              </h3>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold text-lime tabular-nums">
                  {formatNumber(remainingCal)}
                </span>
                <span className="text-sm text-forest/50 mb-1">{t("common.kcal")}</span>
              </div>
              <div className="mt-3 h-2 bg-forest/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime to-protein rounded-full transition-all"
                  style={{ width: `${calPct}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-forest/60 leading-relaxed flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-lime flex-shrink-0 mt-0.5" />
                {t("dash.remaining.message")}
              </p>
            </Card>

            {/* === Daily Tasks === */}
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base font-bold text-forest">
                  {t("dash.tasks.title")}
                </h3>
                <span className="text-xs font-semibold text-forest/60 px-2 py-0.5 rounded-full bg-lime-soft/50">
                  {t("dash.tasks.completed", { done: completedTasks, total: tasks.length })}
                </span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto scroll-soft">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/40 text-left transition-colors"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        task.completed
                          ? "bg-lime border-lime"
                          : "border-forest/20 bg-white"
                      )}
                    >
                      {task.completed && <Check className="h-3 w-3 text-forest" strokeWidth={3} />}
                    </div>
                    <span
                      className={cn(
                        "text-sm flex-1",
                        task.completed ? "text-forest/40 line-through" : "text-forest/80"
                      )}
                    >
                      {lang === "bn" ? task.labelBn : task.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-forest/8">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-forest/50">Overall</span>
                  <span className="font-semibold text-forest">{taskPct}%</span>
                </div>
                <div className="h-1.5 bg-forest/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime rounded-full transition-all"
                    style={{ width: `${taskPct}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* === Daily Reminders === */}
            <Card className="col-span-12 lg:col-span-4 bg-white p-5">
              <h3 className="font-heading text-base font-bold text-forest mb-3">
                {t("dash.reminders.title")}
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto scroll-soft">
                {reminders.map((r) => {
                  const Icon = iconMap[r.icon] ?? Bell;
                  return (
                    <div
                      key={r.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-cream/30"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          r.completed ? "bg-lime/20" : "bg-forest/8"
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4", r.completed ? "text-lime" : "text-forest/60")}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-forest">
                            {lang === "bn" ? r.titleBn : r.title}
                          </span>
                          <span className="text-[10px] text-forest/40 font-medium whitespace-nowrap">
                            {r.time}
                          </span>
                        </div>
                        <p className="text-xs text-forest/55 mt-0.5 leading-relaxed">
                          {lang === "bn" ? r.descriptionBn : r.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleReminder(r.id)}
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                          r.completed
                            ? "bg-lime border-lime"
                            : "border-forest/20 bg-white"
                        )}
                      >
                        {r.completed && <Check className="h-3 w-3 text-forest" strokeWidth={3} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* === Daily Food Recap === */}
            <Card className="col-span-12 lg:col-span-8 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base font-bold text-forest">
                  {t("dash.food.title")}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-forest/15 text-forest hover:bg-lime-soft/30 h-8 text-xs"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {t("dash.food.add")}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MealColumn
                  title={t("dash.food.breakfast")}
                  items={mealsByType.breakfast}
                  lang={lang}
                />
                <MealColumn
                  title={t("dash.food.lunch")}
                  items={mealsByType.lunch}
                  lang={lang}
                />
                <MealColumn
                  title={t("dash.food.dinner")}
                  items={mealsByType.dinner}
                  lang={lang}
                />
                <MealColumn
                  title={t("dash.food.snacks")}
                  items={mealsByType.snacks}
                  lang={lang}
                />
              </div>
            </Card>

            {/* === AI Insights === */}
            <Card className="col-span-12 lg:col-span-4 bg-gradient-to-br from-forest to-forest/90 text-white p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-lime/8 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-lime" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">
                      {t("dash.insights.title")}
                    </h3>
                    <p className="text-[11px] text-white/50">{t("dash.insights.subtitle")}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {SAMPLE_INSIGHTS.map((ins) => {
                    const Icon = iconMap[ins.icon] ?? TrendingUp;
                    return (
                      <div
                        key={ins.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/8"
                      >
                        <Icon className="h-4 w-4 text-lime flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                        <p className="text-xs text-white/80 leading-relaxed">
                          {lang === "bn" ? ins.textBn : ins.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile bottom padding for fixed bottom nav (none, just spacing) */}
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
        "rounded-3xl border border-forest/8 shadow-[0_2px_12px_rgba(11,29,22,0.04)] hover:shadow-[0_6px_24px_rgba(11,29,22,0.07)] transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function MacroMini({
  icon: Icon,
  label,
  value,
  goal,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  goal: number;
  color: string;
}) {
  const pct = Math.min(100, goal > 0 ? (value / goal) * 100 : 0);
  return (
    <div className="rounded-xl bg-forest/4 p-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="h-3 w-3" style={{ color }} strokeWidth={2} />
        <span className="text-[10px] text-forest/55 font-medium">{label}</span>
      </div>
      <div className="text-sm font-bold text-forest tabular-nums">
        {value}<span className="text-[10px] text-forest/40 font-medium">/{goal}g</span>
      </div>
      <div className="mt-1 h-1 bg-forest/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function MealColumn({
  title,
  items,
  lang,
}: {
  title: string;
  items: FoodItem[];
  lang: string;
}) {
  const totalCal = items.reduce((s, f) => s + f.calories, 0);
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-forest/12 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-forest/70">{title}</span>
        </div>
        <div className="text-center py-3 text-xs text-forest/40">
          Nothing logged yet
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-forest/8 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-cream/30">
        <span className="text-xs font-semibold text-forest/70">{title}</span>
        <span className="text-[10px] text-forest/50 font-medium tabular-nums">{totalCal} kcal</span>
      </div>
      <div className="p-2 space-y-1.5">
        {items.map((f) => (
          <div key={f.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-cream/30">
            <div className="w-10 h-10 rounded-lg bg-lime-soft/40 flex items-center justify-center flex-shrink-0 text-lg">
              {foodEmoji(f.imageQuery)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-forest truncate">
                {lang === "bn" ? f.nameBn : f.name}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-forest/50 tabular-nums">{f.calories} kcal</span>
                <span className="text-[10px] text-protein font-medium">P {f.protein}g</span>
                <span className="text-[10px] text-carb font-medium">C {f.carbs}g</span>
                <span className="text-[10px] text-fat font-medium">F {f.fat}g</span>
              </div>
            </div>
            <span className="text-[9px] text-forest/40 whitespace-nowrap">{f.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Icon map for dynamic icon names
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
