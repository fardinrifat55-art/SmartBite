"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarHeart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Flame,
  Beef,
  Coffee,
  Moon,
  Cookie,
  Sparkles,
  Calendar,
  Check,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Card } from "@/components/dashboard/Card";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { foodPhoto } from "@/lib/food-photos";
import { cn } from "@/lib/utils";

type Slot = "breakfast" | "lunch" | "dinner" | "snacks";
interface Planned {
  name: string;
  nameBn: string;
  query: string;
  cal: number;
  p: number;
  c: number;
  f: number;
}
type DayPlan = Partial<Record<Slot, Planned>>;

const MEAL_META: Record<Slot, { labelKey: string; icon: React.ElementType; color: string }> = {
  breakfast: { labelKey: "dash.food.breakfast", icon: Sun, color: "#E8940A" },
  lunch: { labelKey: "dash.food.lunch", icon: Flame, color: "#E06D53" },
  dinner: { labelKey: "dash.food.dinner", icon: Moon, color: "#1E4D3B" },
  snacks: { labelKey: "dash.food.snacks", icon: Cookie, color: "#5BB8E8" },
};
const SLOT_ORDER: Slot[] = ["breakfast", "lunch", "dinner", "snacks"];

const POOL: Planned[] = [
  { name: "Paratha with Dal", nameBn: "পরোটা ও ডাল", query: "paratha dal", cal: 420, p: 14, c: 58, f: 16 },
  { name: "Banana", nameBn: "কলা", query: "banana", cal: 105, p: 1, c: 27, f: 0 },
  { name: "Rice with Fish Curry", nameBn: "ভাত ও মাছের তরকারি", query: "rice fish curry", cal: 620, p: 38, c: 82, f: 18 },
  { name: "Cucumber Salad", nameBn: "শসা সালাদ", query: "cucumber salad", cal: 45, p: 2, c: 10, f: 0 },
  { name: "Mixed Nuts", nameBn: "মিক্সড নাটস", query: "mixed nuts", cal: 180, p: 6, c: 7, f: 16 },
  { name: "Chicken Rice", nameBn: "চিকেন রাইস", query: "chicken rice", cal: 540, p: 32, c: 60, f: 18 },
  { name: "Vegetable Soup", nameBn: "সবজি স্যুপ", query: "vegetable soup", cal: 210, p: 8, c: 28, f: 6 },
  { name: "Fruit Bowl", nameBn: "ফলের বাটি", query: "fruit bowl", cal: 160, p: 2, c: 34, f: 1 },
  { name: "Egg Omelette", nameBn: "ডিমের অমলেট", query: "egg omelette", cal: 240, p: 18, c: 4, f: 18 },
  { name: "Lentil Soup", nameBn: "ডালের স্যুপ", query: "lentil soup", cal: 280, p: 18, c: 36, f: 8 },
];

// Build a 7-day plan (Mon..Sun). Today (Saturday) mirrors the real diary.
function buildWeek(today: Date): { date: Date; iso: string; isToday: boolean; plan: DayPlan }[] {
  const days: { date: Date; iso: string; isToday: boolean; plan: DayPlan }[] = [];
  const dow = today.getDay(); // 0 Sun .. 6 Sat
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    const isToday = d.toDateString() === today.toDateString();
    days.push({ date: d, iso: d.toISOString().slice(0, 10), isToday, plan: planFor(i) });
  }
  return days;
}

function planFor(i: number): DayPlan {
  // i: 0 Mon .. 6 Sun (today is Sat = i=5)
  const idx = (i + 7) % 7;
  const p = POOL;
  // today (Sat) mirrors the diary
  if (idx === 5) {
    return {
      breakfast: p[0],
      snacks: p[1],
      lunch: p[2],
      // dinner left to plan
    };
  }
  const plans: DayPlan[] = [
    { breakfast: p[8], lunch: p[5], snacks: p[7], dinner: p[6] }, // Mon
    { breakfast: p[0], lunch: p[2], snacks: p[4], dinner: p[9] }, // Tue
    { breakfast: p[8], lunch: p[5], snacks: p[7], dinner: p[6] }, // Wed
    { breakfast: p[0], lunch: p[9], snacks: p[1], dinner: p[5] }, // Thu
    { breakfast: p[8], lunch: p[2], snacks: p[4], dinner: p[6] }, // Fri
    {}, // Sat (set above)
    { breakfast: p[0], lunch: p[5], snacks: p[7], dinner: p[9] }, // Sun
  ];
  return plans[idx];
}

const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayTotal(plan: DayPlan) {
  return SLOT_ORDER.reduce(
    (a, s) => {
      const m = plan[s];
      if (!m) return a;
      return { cal: a.cal + m.cal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f };
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  );
}

export function MealPlannerScreen() {
  const { t, lang } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const { toast } = useToast();
  const today = useMemo(() => new Date(), []);
  const week = useMemo(() => buildWeek(today), [today]);
  const todayIdx = week.findIndex((d) => d.isToday);
  const [selected, setSelected] = useState(todayIdx >= 0 ? todayIdx : 0);
  const dateStr = today.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "long", year: "numeric" });

  const sel = week[selected];
  const selTot = dayTotal(sel.plan);
  const dailyCal = 2902;

  // weekly calories for the bar chart
  const weekCals = week.map((d) => dayTotal(d.plan).cal);
  const maxCal = Math.max(...weekCals, dailyCal);

  return (
    <AppShell activeView="mealPlanner" urlPath="nutrilen.ai/meal-planner">
      <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5BB8E8] to-[#1E4D3B] flex items-center justify-center shadow-sm">
              <CalendarHeart className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">{t("sidebar.mealPlanner")}</h1>
              <p className="text-sm text-[#4A5A55] mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Week of {week[0].date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric" })} · {dateStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 rounded-full bg-white border border-[#DCE4E1] flex items-center justify-center text-[#4A5A55] shadow-sm hover:bg-[#F4F7F6]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="w-11 h-11 rounded-full bg-white border border-[#DCE4E1] flex items-center justify-center text-[#4A5A55] shadow-sm hover:bg-[#F4F7F6]">
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView("scanner")}
              className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#1E4D3B] text-white text-sm font-semibold shadow-sm hover:bg-[#163A2C] transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              {t("dash.food.add")}
            </button>
          </div>
        </div>

        {/* Week strip */}
        <div className="grid grid-cols-7 gap-2 mb-5">
          {week.map((d, i) => {
            const tot = dayTotal(d.plan);
            const filled = SLOT_ORDER.filter((s) => d.plan[s]).length;
            return (
              <button
                key={d.iso}
                onClick={() => setSelected(i)}
                className={cn(
                  "flex flex-col items-center justify-start py-3 px-1 rounded-2xl border transition-all",
                  selected === i ? "bg-[#1E4D3B] border-[#1E4D3B] text-white shadow-md" : "bg-white border-[#DCE4E1] text-[#162623] hover:border-[#1E4D3B]/40"
                )}
              >
                <span className={cn("text-[10px] font-semibold uppercase tracking-wide", selected === i ? "text-white/70" : "text-[#4A5A55]")}>
                  {WEEKDAY_EN[d.date.getDay()]}
                </span>
                <span className="text-lg font-extrabold leading-none mt-1">{d.date.getDate()}</span>
                {d.isToday && <span className={cn("mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full", selected === i ? "bg-[#E8940A] text-white" : "bg-[#E06D53]/15 text-[#E06D53]")}>TODAY</span>}
                <span className={cn("text-[10px] mt-1 tabular-nums", selected === i ? "text-white/80" : "text-[#4A5A55]")}>{tot.cal}</span>
                <div className="flex gap-0.5 mt-1">
                  {SLOT_ORDER.map((s) => (
                    <span key={s} className={cn("w-1.5 h-1.5 rounded-full", d.plan[s] ? (selected === i ? "bg-[#D4A843]" : "bg-[#1E4D3B]") : selected === i ? "bg-white/20" : "bg-[#DCE4E1]")} />
                  ))}
                </div>
                <span className={cn("text-[9px] mt-1", selected === i ? "text-white/60" : "text-[#4A5A55]/70")}>{filled}/4</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: selected day meals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-jakarta text-lg font-extrabold text-[#162623]">
                {sel.date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h2>
              <span className="text-sm text-[#4A5A55]">{selTot.cal} {t("common.kcal")} · {selTot.p}{t("common.grams")} {t("dash.protein.title").toLowerCase()}</span>
            </div>

            {SLOT_ORDER.map((slot) => {
              const meta = MEAL_META[slot];
              const Icon = meta.icon;
              const m = sel.plan[slot];
              return (
                <div key={slot}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${meta.color}1A` }}>
                      <Icon className="h-4 w-4" strokeWidth={2} style={{ color: meta.color }} />
                    </span>
                    <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">{t(meta.labelKey)}</h3>
                  </div>
                  {m ? (
                    <Card className="bg-white p-3 flex items-center gap-3">
                      <img src={foodPhoto(m.query)} alt={lang === "bn" ? m.nameBn : m.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-jakarta text-sm font-bold text-[#162623] truncate">{lang === "bn" ? m.nameBn : m.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#1E4D3B]/10 text-[#1E4D3B]">P {m.p}{t("common.grams")}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#D4A843]/15 text-[#9A7A1F]">C {m.c}{t("common.grams")}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#E06D53]/12 text-[#C95B42]">F {m.f}{t("common.grams")}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-jakarta text-base font-extrabold text-[#162623] tabular-nums">{m.cal}</div>
                        <div className="text-[9px] text-[#4A5A55] uppercase tracking-wide">{t("common.kcal")}</div>
                      </div>
                    </Card>
                  ) : (
                    <button
                      onClick={() => { setView("scanner"); }}
                      className="w-full p-4 rounded-2xl border-2 border-dashed border-[#DCE4E1] bg-white/50 hover:border-[#1E4D3B]/40 hover:bg-[#F4F7F6] transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-[#4A5A55]"
                    >
                      <Plus className="h-4 w-4" />
                      {t("dash.food.add")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: weekly chart + suggestions */}
          <div className="space-y-4">
            <Card className="bg-white p-5">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-1">Weekly Calories</h3>
              <p className="text-[11px] text-[#4A5A55] mb-3">Planned vs goal 2,902 kcal</p>
              <div className="flex items-end justify-between gap-1.5 h-36">
                {week.map((d, i) => {
                  const tot = dayTotal(d.plan);
                  const h = Math.max(4, (tot.cal / maxCal) * 100);
                  const isSel = selected === i;
                  return (
                    <button key={d.iso} onClick={() => setSelected(i)} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] font-bold text-[#162623] tabular-nums">{tot.cal || ""}</span>
                      <div className="w-full flex flex-col justify-end rounded-t-lg overflow-hidden" style={{ height: "70%" }}>
                        <div
                          className={cn("w-full rounded-t-lg transition-all", isSel ? "bg-[#1E4D3B]" : "bg-[#1E4D3B]/40")}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className={cn("text-[9px] font-semibold", isSel ? "text-[#1E4D3B]" : "text-[#4A5A55]")}>{WEEKDAY_EN[d.date.getDay()].slice(0, 2)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#DCE4E1]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1E4D3B]" /><span className="text-[11px] text-[#4A5A55]">Planned</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E8940A]" /><span className="text-[11px] text-[#4A5A55]">Goal</span></div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 border-none overflow-hidden relative">
              <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 40" fill="none" preserveAspectRatio="none" style={{ opacity: 0.3 }}>
                <path d="M0 28 Q40 12 80 22 T160 16 T200 20" stroke="#D4A843" strokeWidth="0.6" fill="none" />
              </svg>
              <div className="relative">
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{sel.date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "long" })} Plan</span>
                <div className="text-3xl font-extrabold text-white tabular-nums leading-tight mt-1">{selTot.cal} <span className="text-base font-medium text-white/60">{t("common.kcal")}</span></div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[{ l: "Protein", v: selTot.p, c: "#D4A843" }, { l: "Carbs", v: selTot.c, c: "#E8940A" }, { l: "Fat", v: selTot.f, c: "#E06D53" }].map((m) => (
                    <div key={m.l}>
                      <div className="text-[10px] text-white/50 uppercase tracking-wide">{m.l}</div>
                      <div className="text-sm font-bold text-white tabular-nums">{m.v}{t("common.grams")}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-[#D4A843]" style={{ width: `${Math.min(100, (selTot.cal / dailyCal) * 100)}%` }} />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#FFF7E6] to-[#FBEED1] p-5 border-[#E8940A]/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#E8940A] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">AI Meal Suggestion</h3>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <img src={foodPhoto("lentil soup")} alt="Lentil Soup" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#162623] truncate">{lang === "bn" ? "ডালের স্যুপ" : "Lentil Soup"}</div>
                  <div className="text-[11px] text-[#4A5A55]">280 kcal · 18g protein · high fiber</div>
                </div>
              </div>
              <p className="text-xs text-[#4A5A55] leading-relaxed mt-3">
                A warm lentil soup fits tonight&apos;s dinner slot and adds <strong className="text-[#1E4D3B]">18g protein</strong> toward your goal.
              </p>
              <button
                onClick={() => toast({ title: lang === "bn" ? "ডালের স্যুপ" : "Lentil Soup", description: "Added to tonight's dinner." })}
                className="mt-3 w-full h-9 rounded-full bg-[#1E4D3B] text-white text-xs font-bold hover:bg-[#163A2C] flex items-center justify-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> Add to Dinner
              </button>
              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[#1E4D3B]">
                <TrendingUp className="h-3.5 w-3.5" /> Avg week protein 142g/day
              </div>
            </Card>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </AppShell>
  );
}
