"use client";

import React from "react";
import { Plus, ScanLine } from "lucide-react";
import { AppShell } from "./AppShell";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { formatNumber } from "@/lib/nutrition";
import type { MealType } from "@/lib/sample-data";
import { FOOD_PHOTOS, foodPhoto } from "@/lib/food-photos";

const TREND_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function DashboardScreen() {
  const { lang } = useI18n();
  const targets = useAppStore((s) => s.targets);
  const streak = useAppStore((s) => s.streak);
  const foodDiary = useAppStore((s) => s.foodDiary);
  const weeklyActivity = useAppStore((s) => s.weeklyActivity);
  const getConsumedCalories = useAppStore((s) => s.getConsumedCalories);
  const getConsumedProtein = useAppStore((s) => s.getConsumedProtein);
  const getConsumedCarbs = useAppStore((s) => s.getConsumedCarbs);
  const getConsumedFat = useAppStore((s) => s.getConsumedFat);
  const setView = useAppStore((s) => s.setView);

  const consumedCal = getConsumedCalories();
  const consumedProtein = getConsumedProtein();
  const consumedCarbs = getConsumedCarbs();
  const consumedFat = getConsumedFat();

  const dailyCal = targets?.dailyCalories ?? 2200;
  const proteinGoal = targets?.protein ?? 140;

  // Macro Share Donut — 3-segment palette matching the Landing Page (1st image):
  // Forest Eucalyptus (#2C5E53), Warm Coral (#E06D53), Sage Green (#A0B4AC)
  const totalMacroGrams = Math.max(1, consumedProtein + consumedCarbs + consumedFat);
  const pPct = Math.round((consumedProtein / totalMacroGrams) * 100) || 28;
  const cPct = Math.round((consumedCarbs / totalMacroGrams) * 100) || 48;
  const fPct = Math.max(0, 100 - pPct - cPct);

  const macroSegs = [
    { label: "Protein", pct: pPct, grams: consumedProtein, color: "#2C5E53" },
    { label: "Carbs", pct: cPct, grams: consumedCarbs, color: "#E06D53" },
    { label: "Fat", pct: fPct, grams: consumedFat, color: "#A0B4AC" },
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

  const displayedMeals = foodDiary.slice(0, 4);

  const categoryLabel = (mealType: MealType) => {
    switch (mealType) {
      case "breakfast":
        return "Breakfast";
      case "lunch":
        return "Lunch";
      case "dinner":
        return "Dinner";
      default:
        return "Snack";
    }
  };

  return (
    <AppShell activeView="dashboard" hideTitleBar>
      <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* === TOP ROW: 3 Colored KPI Banner Cards in Landing Page Palette === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Warm Coral (#E06D53) — Daily Calories */}
          <div className="bg-[#E06D53] text-white rounded-3xl p-6 relative overflow-hidden shadow-sm min-h-[132px] flex flex-col justify-between">
            {/* Subtle contour wave lines in background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
              viewBox="0 0 300 130"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M90 130 C130 65, 200 35, 300 15" stroke="#FFFFFF" strokeWidth="1.2" />
              <path d="M130 130 C170 75, 230 55, 300 40" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M175 130 C210 90, 255 75, 300 68" stroke="#FFFFFF" strokeWidth="0.8" />
            </svg>

            <div className="relative z-10">
              <div className="text-xs font-semibold text-white/90 tracking-wide">
                Daily Calories
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tabular-nums">
                {formatNumber(consumedCal)} kcal
              </div>
              <div className="text-[11px] text-white/85 mt-2">
                Target: {formatNumber(dailyCal)} kcal
              </div>
            </div>

            {/* Decorative floating plate illustration on the right */}
            <div className="absolute right-4 bottom-3 w-20 h-20 rounded-full border-2 border-white/85 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&h=160&fit=crop"
                alt="Healthy bowl"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Forest Eucalyptus (#2C5E53) — Protein Intake */}
          <div className="bg-[#2C5E53] text-white rounded-3xl p-6 relative overflow-hidden shadow-sm min-h-[132px] flex flex-col justify-between">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              viewBox="0 0 300 130"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M85 130 C125 60, 195 30, 300 12" stroke="#FFFFFF" strokeWidth="1.2" />
              <path d="M125 130 C165 70, 225 50, 300 38" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M170 130 C205 88, 250 72, 300 65" stroke="#FFFFFF" strokeWidth="0.8" />
            </svg>

            <div className="relative z-10">
              <div className="text-xs font-semibold text-white/90 tracking-wide">
                Protein Intake
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tabular-nums">
                {consumedProtein}g
              </div>
              <div className="text-[11px] text-[#DCE4E1] mt-2">
                Goal: {proteinGoal}g · Carbs {consumedCarbs}g
              </div>
            </div>

            <div className="absolute right-4 bottom-3 w-20 h-20 rounded-full border-2 border-[#A0B4AC] overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&h=160&fit=crop"
                alt="Protein dish"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 3: Forest Eucalyptus (#2C5E53) — Active Streak with Dotted Map */}
          <div className="bg-[#2C5E53] text-white rounded-3xl p-6 relative overflow-hidden shadow-sm min-h-[132px] flex flex-col justify-between">
            <div className="relative z-10">
              <div className="text-xs font-semibold text-white/90 tracking-wide">
                Active Streak
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tabular-nums">
                {streak} Days
              </div>
              <div className="text-[11px] text-[#E06D53] font-bold mt-2">
                {foodDiary.length} Meals Logged
              </div>
            </div>

            {/* Dotted network map + coral/sage arcs on the right */}
            <div className="absolute right-2 top-3 bottom-3 w-36 pointer-events-none">
              <svg viewBox="0 0 150 95" className="w-full h-full" fill="none">
                <pattern id="cardMapDots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.22)" />
                </pattern>
                <ellipse cx="45" cy="48" rx="34" ry="26" fill="url(#cardMapDots)" />
                <ellipse cx="108" cy="44" rx="36" ry="28" fill="url(#cardMapDots)" />
                <path d="M24 58 Q68 14 115 36" stroke="#E06D53" strokeWidth="1.5" fill="none" />
                <path d="M40 34 Q82 18 128 56" stroke="#A0B4AC" strokeWidth="1.3" fill="none" />
                <path d="M32 66 Q78 48 112 68" stroke="#E06D53" strokeWidth="1.2" fill="none" />
                <circle cx="24" cy="58" r="3" fill="#E06D53" />
                <circle cx="40" cy="34" r="3" fill="#A0B4AC" />
                <circle cx="115" cy="36" r="3" fill="#E06D53" />
                <circle cx="128" cy="56" r="3.5" fill="#A0B4AC" />
                <circle cx="112" cy="68" r="3" fill="#E06D53" />
              </svg>
            </div>
          </div>
        </div>

        {/* === MIDDLE ROW: Recent Meals (8 cols, Ticket Card) + Statistics (4 cols, Stacked Bar Chart) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 cols: Recent Meals */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 relative shadow-sm flex flex-col justify-between">
            {/* Ticket-style side cutouts matching #EEF3F1 canvas */}
            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EEF3F1]" />
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EEF3F1]" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-jakarta text-lg font-extrabold text-[#162623]">
                    Recent Meals
                  </h2>
                  <p className="text-xs text-[#4A5A55] mt-0.5">
                    Overview of latest scanned & logged meals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView("foodDiary")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#DCE4E1] hover:bg-[#F4F7F6] text-[#162623] text-xs font-bold transition-colors shadow-2xs"
                  >
                    View All
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("scanner")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E06D53] hover:bg-[#C95B42] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <ScanLine className="h-3.5 w-3.5 text-white" />
                    Scan Meal
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 items-center pb-3 border-b border-[#DCE4E1] text-[11px] font-bold text-[#4A5A55]">
                <div className="col-span-6">Meal</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-2 text-center">Protein</div>
                <div className="col-span-2 text-right">Calories</div>
              </div>

              {/* Meal Rows */}
              <div className="divide-y divide-dashed divide-[#DCE4E1]">
                {displayedMeals.map((meal) => {
                  const photoSrc =
                    FOOD_PHOTOS[meal.imageQuery] || foodPhoto(meal.imageQuery);
                  return (
                    <div
                      key={meal.id}
                      className="grid grid-cols-12 items-center py-4 gap-2"
                    >
                      <div className="col-span-6 flex items-center gap-3.5 min-w-0">
                        <img
                          src={photoSrc}
                          alt={meal.name}
                          className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-[#DCE4E1]"
                        />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-[#162623] truncate">
                            {lang === "bn" ? meal.nameBn : meal.name}
                          </div>
                          <div className="text-[11px] text-[#4A5A55] truncate">
                            {meal.description || `${meal.protein}g protein · ${meal.carbs}g carbs`}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center text-xs font-medium text-[#4A5A55]">
                        {categoryLabel(meal.mealType)}
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <div className="w-9 h-9 rounded-full bg-[#2C5E53] text-white text-xs font-extrabold flex items-center justify-center shadow-sm tabular-nums">
                          {meal.protein}g
                        </div>
                      </div>

                      <div className="col-span-2 text-right text-xs sm:text-sm font-extrabold text-[#162623] tabular-nums">
                        {meal.calories} kcal
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 4 cols: Statistics (vertical two-tone bar chart card) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-jakarta text-lg font-extrabold text-[#162623]">
                Statistics
              </h2>
              <p className="text-xs text-[#4A5A55] mt-0.5 mb-5">
                Weekly calorie goal adherence
              </p>
            </div>

            <div className="flex gap-3 h-48 items-stretch">
              {/* Y-axis numbers */}
              <div className="flex flex-col justify-between text-[10px] font-semibold text-[#4A5A55] pr-1 text-right">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* Vertical Two-Tone Slim Bars */}
              <div className="flex-1 relative flex items-end justify-between px-2 border-b border-[#DCE4E1]">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <div key={line} className="border-t border-dashed border-[#E8F0ED]" />
                  ))}
                </div>

                {weeklyActivity.map((d, i) => {
                  const totalH = Math.min(100, Math.max(20, d.value));
                  const darkH = Math.round(totalH * 0.58);
                  const coralH = totalH - darkH;
                  return (
                    <div
                      key={i}
                      className="relative z-10 flex flex-col items-center justify-end h-full flex-1"
                    >
                      <div className="w-1.5 flex flex-col items-center justify-end h-full">
                        <div
                          className="w-1.5 rounded-t-full bg-[#E06D53]"
                          style={{ height: `${coralH}%` }}
                        />
                        <div
                          className="w-1.5 bg-[#2C5E53]"
                          style={{ height: `${darkH}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis day labels */}
            <div className="flex justify-between pl-7 pr-2 mt-2.5 text-[10px] font-semibold text-[#4A5A55]">
              {weeklyActivity.map((d, i) => (
                <span key={i} className="flex-1 text-center">
                  {lang === "bn" ? d.dayBn : d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* === BOTTOM ROW: Macro Share Donut (4 cols) + Nutrition Schedule Wave Chart (8 cols) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 cols: Macro Share Donut */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <h2 className="font-jakarta text-lg font-extrabold text-[#162623] mb-4">
              Macro Share
            </h2>

            <div className="flex flex-col items-center justify-center my-auto">
              <div className="relative w-44 h-44">
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#E3EDE9"
                    strokeWidth="15"
                  />
                  {macroArcs.map((a, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke={a.color}
                      strokeWidth="15"
                      strokeDasharray={a.dasharray}
                      strokeDashoffset={a.offset}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-extrabold text-[#162623] text-center">
                    Macro Share
                  </span>
                </div>
              </div>

              {/* Compact legend row */}
              <div className="flex items-center justify-center gap-4 mt-5 w-full">
                {macroSegs.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-xs font-bold text-[#162623]">
                      {s.label}
                    </span>
                    <span className="text-[11px] text-[#4A5A55] tabular-nums">
                      {s.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 8 cols: Nutrition Schedule Wave Area Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-jakarta text-lg font-extrabold text-[#162623]">
                Nutrition Schedule
              </h2>
              <button
                type="button"
                onClick={() => setView("analytics")}
                className="text-xs font-bold text-[#2C5E53] hover:underline"
              >
                View Analytics →
              </button>
            </div>

            <div className="flex gap-3 h-48 items-stretch">
              {/* Y-axis */}
              <div className="flex flex-col justify-between text-[10px] font-semibold text-[#4A5A55] pr-1 text-right">
                <span>6</span>
                <span>5</span>
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>

              {/* Smooth Dual Spline Area Chart */}
              <div className="relative flex-1 border-b border-[#DCE4E1]">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((g) => (
                    <div key={g} className="border-t border-dashed border-[#E8F0ED]" />
                  ))}
                </div>

                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  viewBox="0 0 500 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="coralWaveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E06D53" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#E06D53" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="forestWaveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2C5E53" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#2C5E53" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Coral spline area + stroke */}
                  <path
                    d="M 0 95 C 50 45, 95 45, 145 92 C 195 135, 240 120, 290 78 C 340 35, 385 18, 425 45 C 460 70, 480 85, 500 72 L 500 160 L 0 160 Z"
                    fill="url(#coralWaveFill)"
                  />
                  <path
                    d="M 0 95 C 50 45, 95 45, 145 92 C 195 135, 240 120, 290 78 C 340 35, 385 18, 425 45 C 460 70, 480 85, 500 72"
                    fill="none"
                    stroke="#E06D53"
                    strokeWidth="2.2"
                  />

                  {/* Forest Eucalyptus spline area + stroke */}
                  <path
                    d="M 0 100 C 50 140, 100 130, 165 92 C 215 62, 240 62, 285 90 C 330 118, 370 118, 420 75 C 455 45, 480 50, 500 68 L 500 160 L 0 160 Z"
                    fill="url(#forestWaveFill)"
                  />
                  <path
                    d="M 0 100 C 50 140, 100 130, 165 92 C 215 62, 240 62, 285 90 C 330 118, 370 118, 420 75 C 455 45, 480 50, 500 68"
                    fill="none"
                    stroke="#2C5E53"
                    strokeWidth="2.2"
                  />

                  {/* Highlight dots */}
                  <circle cx="225" cy="69" r="5.5" fill="#2C5E53" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="385" cy="28" r="5.5" fill="#E06D53" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Forest Eucalyptus Callout Pill above the mid-peak dot */}
                <div
                  className="absolute z-10 flex flex-col items-center"
                  style={{ left: "45%", top: "4%", transform: "translateX(-50%)" }}
                >
                  <div className="bg-[#2C5E53] text-white px-4 py-1.5 rounded-xl shadow-md text-center">
                    <div className="text-xs font-extrabold tabular-nums leading-tight">
                      {formatNumber(consumedCal)}
                    </div>
                    <div className="text-[9px] text-white/80 leading-tight">
                      Calories
                    </div>
                  </div>
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid #2C5E53",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* X-axis month labels */}
            <div className="flex justify-between pl-7 pr-2 mt-2.5 text-[10px] font-semibold text-[#4A5A55]">
              {TREND_MONTHS.map((m) => (
                <span key={m} className="flex-1 text-center">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
