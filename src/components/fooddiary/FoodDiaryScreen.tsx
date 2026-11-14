"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  Calendar,
  Clock,
  Camera,
  Sparkles,
  ChevronRight,
  Sun,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Card } from "@/components/dashboard/Card";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/nutrition";
import { SAMPLE_FOOD_DIARY, type MealType } from "@/lib/sample-data";
import { foodPhoto } from "@/lib/food-photos";
import { cn } from "@/lib/utils";

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];
const MEAL_LABEL_KEY: Record<MealType, string> = {
  breakfast: "dash.food.breakfast",
  lunch: "dash.food.lunch",
  dinner: "dash.food.dinner",
  snacks: "dash.food.snacks",
};
const MEAL_ICON: Record<MealType, React.ElementType> = {
  breakfast: Sun,
  lunch: Flame,
  dinner: Beef,
  snacks: Leaf,
};
const MEAL_COLOR: Record<MealType, string> = {
  breakfast: "#E8940A",
  lunch: "#E06D53",
  dinner: "#1E4D3B",
  snacks: "#5BB8E8",
};

const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function last7Days() {
  const days: { label: string; date: number; iso: string; isToday: boolean }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      label: WEEKDAY_EN[d.getDay()],
      date: d.getDate(),
      iso: d.toISOString().slice(0, 10),
      isToday: i === 0,
    });
  }
  return days;
}

export function FoodDiaryScreen() {
  const { t, lang } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const targets = useAppStore((s) => s.targets);
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [selectedIdx, setSelectedIdx] = useState(6); // last = today

  const dailyCal = targets?.calories ?? 2902;
  const proteinGoal = targets?.protein ?? 254;
  const carbGoal = targets?.carbs ?? 350;
  const fatGoal = targets?.fat ?? 80;

  const totals = useMemo(
    () =>
      SAMPLE_FOOD_DIARY.reduce(
        (a, f) => ({
          cal: a.cal + f.calories,
          p: a.p + f.protein,
          c: a.c + f.carbs,
          fat: a.fat + f.fat,
          fib: a.fib + f.fiber,
        }),
        { cal: 0, p: 0, c: 0, fat: 0, fib: 0 }
      ),
    []
  );

  const remainingCal = Math.max(0, dailyCal - totals.cal);
  const calPct = Math.min(100, (totals.cal / dailyCal) * 100);
  const days = useMemo(() => last7Days(), []);
  const today = new Date();
  const dateStr = today.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const macroBars = [
    { label: t("dash.protein.title"), value: totals.p, goal: proteinGoal, color: "#1E4D3B", icon: Beef },
    { label: t("dash.carbs.title"), value: totals.c, goal: carbGoal, color: "#D4A843", icon: Wheat },
    { label: t("dash.fat.title"), value: totals.fat, goal: fatGoal, color: "#E06D53", icon: Droplet },
    { label: "Fiber", value: totals.fib, goal: 30, color: "#5BB8E8", icon: Leaf },
  ];

  // 4-segment macro donut arcs
  const donutArcs = useMemo(() => {
    const total = totals.p + totals.c + totals.fat + totals.fib || 1;
    const C = 2 * Math.PI * 34;
    const segs = [
      { v: totals.p, color: "#1E4D3B" },
      { v: totals.c, color: "#D4A843" },
      { v: totals.fat, color: "#E06D53" },
      { v: totals.fib, color: "#5BB8E8" },
    ];
    let acc = 0;
    return segs.map((s) => {
      const frac = s.v / total;
      const dash = frac * C;
      const arc = {
        color: s.color,
        dasharray: `${dash} ${C - dash}`,
        dashoffset: -acc * C,
      };
      acc += frac;
      return arc;
    });
  }, [totals]);

  return (
    <AppShell activeView="foodDiary" urlPath="nutrilen.ai/food-diary">
      <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E4D3B] to-[#2C7E8F] flex items-center justify-center shadow-sm">
              <BookOpen className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
                {t("sidebar.foodDiary")}
              </h1>
              <p className="text-sm text-[#4A5A55] mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast({ title: t("common.search"), description: "Search foods, brands, or recipes." })}
              className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full bg-white border border-[#DCE4E1] text-[#4A5A55] text-sm w-52 shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-[#4A5A55]/70">{t("common.search")}</span>
            </button>
            <button
              onClick={() => setView("scanner")}
              className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#1E4D3B] text-white text-sm font-semibold shadow-sm hover:bg-[#163A2C] transition-colors"
            >
              <Camera className="h-4 w-4" strokeWidth={2} />
              {t("dash.scanner.cta")}
            </button>
          </div>
        </div>

        {/* Day strip */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scroll-soft">
          {days.map((d, i) => (
            <button
              key={d.iso}
              onClick={() => setSelectedIdx(i)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all",
                selectedIdx === i
                  ? "bg-[#1E4D3B] border-[#1E4D3B] text-white shadow-md"
                  : "bg-white border-[#DCE4E1] text-[#162623] hover:border-[#1E4D3B]/40"
              )}
            >
              <span className={cn("text-[10px] font-semibold uppercase tracking-wide", selectedIdx === i ? "text-white/70" : "text-[#4A5A55]")}>{d.label}</span>
              <span className="text-lg font-extrabold leading-none mt-1">{d.date}</span>
              {d.isToday && (
                <span className={cn("mt-1 w-1.5 h-1.5 rounded-full", selectedIdx === i ? "bg-[#E8940A]" : "bg-[#E06D53]")} />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: meal sections */}
          <div className="lg:col-span-2 space-y-4">
            {/* Calories summary card */}
            <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 border-none overflow-hidden relative">
              <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 50" fill="none" preserveAspectRatio="none" style={{ opacity: 0.3 }}>
                <path d="M0 30 Q40 14 80 24 T160 18 T200 22" stroke="#D4A843" strokeWidth="0.7" fill="none" />
                <path d="M0 38 Q40 22 80 32 T160 26 T200 30" stroke="#E8940A" strokeWidth="0.5" fill="none" />
              </svg>
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="h-4 w-4 text-[#D4A843]" strokeWidth={2} />
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{t("dash.calories.title")}</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white tabular-nums leading-tight">
                    {formatNumber(totals.cal)} <span className="text-base font-medium text-white/60">{t("common.kcal")}</span>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {formatNumber(remainingCal)} {t("common.remaining")} · {Math.round(calPct)}% {t("common.completed").toLowerCase()}
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/20 w-56">
                    <div className="h-2 rounded-full bg-gradient-to-r from-[#D4A843] to-[#E8940A]" style={{ width: `${calPct}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wide text-white/50">{t("common.goal")}</div>
                  <div className="text-xl font-bold text-white">{formatNumber(dailyCal)}</div>
                  <div className="text-[10px] text-white/50">{t("common.kcal")}</div>
                </div>
              </div>
            </Card>

            {/* Meal sections */}
            {MEAL_ORDER.map((mt) => {
              const items = SAMPLE_FOOD_DIARY.filter((f) => f.mealType === mt);
              const Icon = MEAL_ICON[mt];
              const color = MEAL_COLOR[mt];
              const sectionCal = items.reduce((a, f) => a + f.calories, 0);
              const label = t(MEAL_LABEL_KEY[mt]);
              return (
                <div key={mt}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
                        <Icon className="h-4 w-4" strokeWidth={2} style={{ color }} />
                      </span>
                      <h2 className="font-jakarta text-base font-extrabold text-[#162623]">{label}</h2>
                      <span className="text-xs text-[#4A5A55]">· {formatNumber(sectionCal)} {t("common.kcal")}</span>
                    </div>
                    <button
                      onClick={() => setView("scanner")}
                      className="flex items-center gap-1 text-xs font-semibold text-[#1E4D3B] hover:text-[#163A2C]"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                      {t("common.add")}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.length === 0 && (
                      <Card className="p-4 bg-white/60 border-dashed">
                        <p className="text-sm text-[#4A5A55] text-center">No meals logged for {label.toLowerCase()}.</p>
                      </Card>
                    )}
                    {items.map((f) => (
                      <Card key={f.id} className="bg-white p-3 flex items-center gap-3">
                        <img
                          src={foodPhoto(f.imageQuery)}
                          alt={lang === "bn" ? f.nameBn : f.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-jakarta text-sm font-bold text-[#162623] truncate">
                              {lang === "bn" ? f.nameBn : f.name}
                            </h3>
                            <span className="flex items-center gap-0.5 text-[10px] text-[#4A5A55] flex-shrink-0">
                              <Clock className="h-3 w-3" />{f.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#1E4D3B]/10 text-[#1E4D3B] flex items-center gap-0.5">
                              <Beef className="h-2.5 w-2.5" />{f.protein}{t("common.grams")}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#D4A843]/15 text-[#9A7A1F] flex items-center gap-0.5">
                              <Wheat className="h-2.5 w-2.5" />{f.carbs}{t("common.grams")}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#E06D53]/12 text-[#C95B42] flex items-center gap-0.5">
                              <Droplet className="h-2.5 w-2.5" />{f.fat}{t("common.grams")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-jakarta text-base font-extrabold text-[#162623] tabular-nums">{f.calories}</div>
                          <div className="text-[9px] text-[#4A5A55] uppercase tracking-wide">{t("common.kcal")}</div>
                        </div>
                        <button
                          onClick={() => toast({ title: lang === "bn" ? f.nameBn : f.name, description: `${f.ingredients.length} ingredients · ${f.calories} kcal` })}
                          className="w-8 h-8 rounded-full bg-[#F4F7F6] hover:bg-[#E3E5E3] flex items-center justify-center text-[#4A5A55] flex-shrink-0"
                          aria-label={t("dash.food.viewDetails")}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: macro donut + insights */}
          <div className="space-y-4">
            <Card className="bg-white p-5">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-1">Macro Share</h3>
              <p className="text-[11px] text-[#4A5A55] mb-2">{t("common.today")}</p>
              <div className="relative w-44 h-44 mx-auto my-2">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#EEF1EE" strokeWidth="7" />
                  {donutArcs.map((a, i) => (
                    <circle key={i} cx="40" cy="40" r="34" fill="none" stroke={a.color} strokeWidth="7" strokeDasharray={a.dasharray} strokeDashoffset={a.dashoffset} strokeLinecap="butt" />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#4A5A55] uppercase tracking-wide">Total</span>
                  <span className="font-jakarta text-xl font-extrabold text-[#162623] tabular-nums">{formatNumber(totals.cal)}</span>
                  <span className="text-[10px] text-[#4A5A55]">{t("common.kcal")}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { label: t("dash.protein.title"), v: totals.p, color: "#1E4D3B" },
                  { label: t("dash.carbs.title"), v: totals.c, color: "#D4A843" },
                  { label: t("dash.fat.title"), v: totals.fat, color: "#E06D53" },
                  { label: "Fiber", v: totals.fib, color: "#5BB8E8" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-[11px] text-[#4A5A55] flex-1 truncate">{m.label}</span>
                    <span className="text-[11px] font-bold text-[#162623] tabular-nums">{m.v}{t("common.grams")}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white p-5">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-3">Macro Progress</h3>
              <div className="space-y-3">
                {macroBars.map((m) => {
                  const Icon = m.icon;
                  const pct = Math.min(100, (m.value / m.goal) * 100);
                  return (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#162623]">
                          <Icon className="h-3.5 w-3.5" style={{ color: m.color }} />
                          {m.label}
                        </span>
                        <span className="text-xs text-[#4A5A55] tabular-nums">{m.value}/{m.goal}{t("common.grams")}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#EEF1EE] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#FFF7E6] to-[#FBEED1] p-5 border-[#E8940A]/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#E8940A] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-jakarta text-base font-extrabold text-[#162623]">{t("dash.insights.title")}</h3>
              </div>
              <p className="text-xs text-[#4A5A55] leading-relaxed">
                You&apos;ve hit <strong className="text-[#1E4D3B]">{Math.round((totals.p / proteinGoal) * 100)}%</strong> of your protein goal. Dinner is a great chance to close the gap — try adding grilled chicken or lentils.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[#1E4D3B]">
                <TrendingUp className="h-3.5 w-3.5" />
                On track to beat last week by 8%
              </div>
            </Card>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </AppShell>
  );
}
