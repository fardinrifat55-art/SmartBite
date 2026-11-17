"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Flame,
  Beef,
  Calendar,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Download,
  Target,
  Award,
  Droplet,
  Wheat,
  Leaf,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Card } from "@/components/dashboard/Card";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

type Range = "week" | "month" | "quarter";

// Deterministic pseudo-random in [0,1) from a seed.
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 30-day calorie data wavering around the goal.
function calorieSeries(n: number, goal: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const base = goal - 380 + Math.sin(i / 3) * 220 + Math.cos(i / 5) * 120;
    const noise = (rand(i + 1) - 0.5) * 240;
    out.push(Math.round(Math.max(1500, Math.min(goal + 200, base + noise))));
  }
  return out;
}

function weightSeries(n: number, start: number, end: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const v = start + (end - start) * t + (rand(i + 50) - 0.5) * 0.4;
    out.push(Number(v.toFixed(1)));
  }
  return out;
}

export function AnalyticsScreen() {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const user = useAppStore((s) => s.user);
  const targets = useAppStore((s) => s.targets);
  const [range, setRange] = useState<Range>("month");

  const dailyCal = targets?.dailyCalories ?? 2902;
  const proteinGoal = targets?.protein ?? 254;

  const n = range === "week" ? 7 : range === "month" ? 30 : 90;
  const cals = useMemo(() => calorieSeries(n, dailyCal), [n, dailyCal]);
  const weights = useMemo(() => weightSeries(n, 78, 76.2), [n]);
  const avgCal = Math.round(cals.reduce((a, b) => a + b, 0) / cals.length);
  const maxCal = Math.max(...cals, dailyCal);
  const minCal = Math.min(...cals);
  const adherence = Math.round((cals.filter((c) => c <= dailyCal).length / cals.length) * 100);
  const proteinAvg = Math.round(avgCal * 0.18); // ~18% of cals from protein
  const wStart = weights[0];
  const wEnd = weights[weights.length - 1];
  const wDelta = Number((wEnd - wStart).toFixed(1));

  // macro distribution (avg)
  const macroDist = [
    { label: t("dash.protein.title"), pct: 24, color: "#1E4D3B" },
    { label: t("dash.carbs.title"), pct: 52, color: "#D4A843" },
    { label: t("dash.fat.title"), pct: 20, color: "#E06D53" },
    { label: "Fiber", pct: 4, color: "#5BB8E8" },
  ];

  // weekly activity (last 7 days)
  const weekly = [
    { day: "Mon", dayBn: "সোম", value: 72 },
    { day: "Tue", dayBn: "মঙ্গল", value: 88 },
    { day: "Wed", dayBn: "বুধ", value: 64 },
    { day: "Thu", dayBn: "বৃহঃ", value: 95 },
    { day: "Fri", dayBn: "শুক্র", value: 80 },
    { day: "Sat", dayBn: "শনি", value: 100 },
    { day: "Sun", dayBn: "রবি", value: 58 },
  ];

  // consistency heatmap: 12 weeks x 7 days
  const heat = useMemo(() => {
    const cells: number[] = [];
    for (let i = 0; i < 12 * 7; i++) cells.push(Math.round(rand(i + 200) * 100));
    return cells;
  }, []);

  // build polyline for calorie area chart
  const W = 100, H = 38;
  const calPts = cals.map((c, i) => {
    const x = (i / (cals.length - 1)) * W;
    const y = H - ((c - minCal + 80) / (maxCal - minCal + 160)) * H;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const calLine = calPts.join(" ");
  const calArea = `0,${H} ${calLine} ${W},${H}`;
  const goalY = H - ((dailyCal - minCal + 80) / (maxCal - minCal + 160)) * H;

  // weight line
  const wMin = Math.min(...weights), wMax = Math.max(...weights);
  const wPts = weights.map((w, i) => {
    const x = (i / (weights.length - 1)) * W;
    const y = H - ((w - wMin + 0.3) / (wMax - wMin + 0.6)) * H;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const wLine = wPts.join(" ");

  const kpis = [
    { label: "Avg Daily Calories", value: formatNumber(avgCal), unit: t("common.kcal"), icon: Flame, color: "#1E4D3B", sub: `${Math.round(((dailyCal - avgCal) / dailyCal) * 100)}% under goal` },
    { label: "Avg Protein", value: formatNumber(proteinAvg), unit: t("common.grams"), icon: Beef, color: "#D4A843", sub: `${Math.round((proteinAvg / proteinGoal) * 100)}% of target` },
    { label: "Goal Adherence", value: `${adherence}`, unit: t("common.percent"), icon: Target, color: "#E06D53", sub: `${cals.filter((c) => c <= dailyCal).length}/${cals.length} days on track` },
    { label: t("dash.streak.title"), value: "7", unit: t("dash.streak.days"), icon: Award, color: "#E8940A", sub: "ACTIVE STREAK" },
  ];

  const rangeTabs: { id: Range; en: string; bn: string }[] = [
    { id: "week", en: "Week", bn: "সপ্তাহ" },
    { id: "month", en: "Month", bn: "মাস" },
    { id: "quarter", en: "3 Months", bn: "৩ মাস" },
  ];

  return (
    <AppShell activeView="analytics" urlPath="smartbite.ai/analytics">
      <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2C7E8F] to-[#1E4D3B] flex items-center justify-center shadow-sm">
              <BarChart3 className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">{t("sidebar.analytics")}</h1>
              <p className="text-sm text-[#4A5A55] mt-0.5">{user?.fullName?.split(" ")[0] ?? "there"}'s nutrition progress at a glance.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#DCE4E1] shadow-sm">
              {rangeTabs.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={cn(
                    "px-3 h-8 rounded-full text-xs font-semibold transition-colors",
                    range === r.id ? "bg-[#1E4D3B] text-white" : "text-[#4A5A55] hover:text-[#162623]"
                  )}
                >
                  {lang === "bn" ? r.bn : r.en}
                </button>
              ))}
            </div>
            <button
              onClick={() => toast({ title: "Report exported", description: `Your ${range} analytics report is ready to download.` })}
              className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#1E4D3B] text-white text-sm font-semibold shadow-sm hover:bg-[#163A2C]"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.label} className="bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${k.color}1A` }}>
                    <Icon className="h-4 w-4" strokeWidth={2} style={{ color: k.color }} />
                  </span>
                </div>
                <div className="text-[11px] text-[#4A5A55] uppercase tracking-wide">{k.label}</div>
                <div className="font-jakarta text-2xl font-extrabold text-[#162623] tabular-nums leading-tight mt-0.5">
                  {k.value} <span className="text-xs font-medium text-[#4A5A55]">{k.unit}</span>
                </div>
                <div className="text-[10px] text-[#1E4D3B] font-semibold mt-1">{k.sub}</div>
              </Card>
            );
          })}
        </div>

        {/* Calorie trend */}
        <Card className="bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Calorie Trend</h3>
              <p className="text-[11px] text-[#4A5A55]">{n} days · avg {formatNumber(avgCal)} kcal · goal {formatNumber(dailyCal)}</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#4A5A55]"><span className="w-2.5 h-2.5 rounded-full bg-[#1E4D3B]" /> Consumed</span>
              <span className="flex items-center gap-1.5 text-[#4A5A55]"><span className="w-2.5 h-0.5 bg-[#E06D53]" /> Goal</span>
            </div>
          </div>
          <div className="relative w-full" style={{ height: 180 }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="calArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E4D3B" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#1E4D3B" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="#EEF1EE" strokeWidth="0.3" />
              ))}
              <line x1="0" y1={goalY} x2={W} y2={goalY} stroke="#E06D53" strokeWidth="0.5" strokeDasharray="2 1.5" />
              <polygon points={calArea} fill="url(#calArea)" />
              <polyline points={calLine} fill="none" stroke="#1E4D3B" strokeWidth="0.7" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#4A5A55] mt-1">
            <span>Day 1</span><span>Day {Math.round(n / 2)}</span><span>Day {n}</span>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Macro distribution donut */}
          <Card className="bg-white p-5">
            <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-1">Macro Distribution</h3>
            <p className="text-[11px] text-[#4A5A55] mb-2">Average over period</p>
            <div className="relative w-40 h-40 mx-auto my-2">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#EEF1EE" strokeWidth="9" />
                {(() => {
                  const C = 2 * Math.PI * 32;
                  let acc = 0;
                  return macroDist.map((m) => {
                    const dash = (m.pct / 100) * C;
                    const arc = { color: m.color, dasharray: `${dash} ${C - dash}`, dashoffset: -acc * C };
                    acc += m.pct / 100;
                    return <circle key={m.label} cx="40" cy="40" r="32" fill="none" stroke={arc.color} strokeWidth="9" strokeDasharray={arc.dasharray} strokeDashoffset={arc.dashoffset} />;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-[#4A5A55] uppercase tracking-wide">Avg</span>
                <span className="font-jakarta text-lg font-extrabold text-[#162623] tabular-nums">{formatNumber(avgCal)}</span>
                <span className="text-[9px] text-[#4A5A55]">{t("common.kcal")}</span>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              {macroDist.map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-[11px] text-[#4A5A55] flex-1">{m.label}</span>
                  <span className="text-[11px] font-bold text-[#162623] tabular-nums">{m.pct}{t("common.percent")}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly activity bars */}
          <Card className="bg-white p-5">
            <h3 className="font-jakarta text-base font-extrabold text-[#162623] mb-1">{t("dash.streak.weekly")}</h3>
            <p className="text-[11px] text-[#4A5A55] mb-3">Activity score this week</p>
            <div className="flex items-end justify-between gap-2 h-40">
              {weekly.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-bold text-[#162623] tabular-nums">{d.value}</span>
                  <div className="w-full flex flex-col justify-end rounded-t-full overflow-hidden" style={{ height: "78%" }}>
                    <div className="w-full rounded-t-full bg-[#1E4D3B]" style={{ height: `${d.value}%` }} />
                    <div className="w-full bg-[#E8940A]" style={{ height: `${Math.max(15, d.value * 0.5)}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#4A5A55]">{lang === "bn" ? d.dayBn : d.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Weight progress */}
          <Card className="bg-white p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Weight Progress</h3>
              <span className={cn("flex items-center gap-1 text-[11px] font-bold", wDelta < 0 ? "text-[#1E4D3B]" : "text-[#E06D53]")}>
                {wDelta < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                {wDelta > 0 ? "+" : ""}{wDelta} kg
              </span>
            </div>
            <p className="text-[11px] text-[#4A5A55] mb-2">{wStart}kg → {wEnd}kg · goal 74kg</p>
            <div className="relative w-full" style={{ height: 130 }}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
                <polyline points={wLine} fill="none" stroke="#2C7E8F" strokeWidth="0.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#DCE4E1]">
              <div><div className="text-[10px] text-[#4A5A55] uppercase">Start</div><div className="text-sm font-bold text-[#162623] tabular-nums">{wStart}kg</div></div>
              <div><div className="text-[10px] text-[#4A5A55] uppercase">Current</div><div className="text-sm font-bold text-[#1E4D3B] tabular-nums">{wEnd}kg</div></div>
              <div><div className="text-[10px] text-[#4A5A55] uppercase">Goal</div><div className="text-sm font-bold text-[#162623] tabular-nums">74kg</div></div>
            </div>
          </Card>
        </div>

        {/* Consistency heatmap + insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-white p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-jakarta text-base font-extrabold text-[#162623]">Consistency</h3>
                <p className="text-[11px] text-[#4A5A55]">Last 12 weeks · daily logging adherence</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#4A5A55]">
                <span>Less</span>
                {["#EEF1EE", "#B6D4C2", "#6FAE8B", "#2C7E5F", "#1E4D3B"].map((c) => (
                  <span key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto scroll-soft pb-1">
              {Array.from({ length: 12 }).map((_, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const v = heat[w * 7 + d];
                    const color = v < 20 ? "#EEF1EE" : v < 40 ? "#B6D4C2" : v < 60 ? "#6FAE8B" : v < 80 ? "#2C7E5F" : "#1E4D3B";
                    return <span key={d} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: color }} title={`${v}%`} />;
                  })}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#DCE4E1]">
              <div><div className="text-[10px] text-[#4A5A55] uppercase tracking-wide">Best Day</div><div className="text-sm font-bold text-[#162623]">Saturday</div></div>
              <div><div className="text-[10px] text-[#4A5A55] uppercase tracking-wide">Logged Days</div><div className="text-sm font-bold text-[#162623]">{Math.round(heat.filter((v) => v > 30).length)} / 84</div></div>
              <div><div className="text-[10px] text-[#4A5A55] uppercase tracking-wide">Avg Score</div><div className="text-sm font-bold text-[#1E4D3B]">{Math.round(heat.reduce((a, b) => a + b, 0) / heat.length)}%</div></div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#FFF7E6] to-[#FBEED1] p-5 border-[#E8940A]/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E8940A] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-jakarta text-base font-extrabold text-[#162623]">{t("dash.insights.title")}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <TrendingDown className="h-4 w-4 text-[#1E4D3B] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#4A5A55] leading-relaxed">You&apos;re trending <strong className="text-[#1E4D3B]">{Math.round(((dailyCal - avgCal) / dailyCal) * 100)}% under</strong> your calorie goal — sustainable for fat loss.</p>
              </div>
              <div className="flex gap-2">
                <Beef className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#4A5A55] leading-relaxed">Protein intake averages <strong className="text-[#9A7A1F]">{proteinAvg}g</strong> ({Math.round((proteinAvg / proteinGoal) * 100)}% of target). Add a protein source to breakfast.</p>
              </div>
              <div className="flex gap-2">
                <Award className="h-4 w-4 text-[#E8940A] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#4A5A55] leading-relaxed">7-day streak — your longest this quarter. Keep logging to unlock the 30-day badge.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="h-6" />
      </div>
    </AppShell>
  );
}
