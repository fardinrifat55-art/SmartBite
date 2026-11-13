"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  ScanLine,
  ShoppingBasket,
  CalendarHeart,
  BarChart3,
  Settings,
  Flame,
  Beef,
  Trophy,
} from "lucide-react";

/**
 * DashboardPreview — a static SaaS dashboard showcase
 * rendered inside a rounded desktop window on a cool-gray studio backdrop.
 * Uses sage-green #9CB0A8 + mist-gray #DCE1E4 + white cards + #162623 text.
 */
export function DashboardPreview() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Food Diary", icon: BookOpen },
    { label: "AI Scanner", icon: ScanLine },
    { label: "Smart Shopping", icon: ShoppingBasket },
    { label: "Meal Planner", icon: CalendarHeart },
    { label: "Analytics", icon: BarChart3 },
    { label: "Profile & Settings", icon: Settings },
  ];

  const meals = [
    { name: "Paratha with Dal", type: "Breakfast", protein: "24g", kcal: 525, emoji: "🫓" },
    { name: "Rice with Fish Curry", type: "Lunch", protein: "37g", kcal: 665, emoji: "🍚" },
  ];

  const weeklyData = [62, 78, 45, 90, 70, 85, 63]; // Mon-Sun

  return (
    <section className="bg-[#DCE1E4] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#162623] tracking-tight">
            Your nutrition command center
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A5A55]">
            Track calories, macros, and meals in one calm, focused dashboard.
          </p>
        </motion.div>

        {/* Rounded desktop window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[1.75rem] overflow-hidden shadow-[0_24px_80px_rgba(22,38,35,0.18)] border border-white/40"
        >
          {/* Window title bar */}
          <div className="bg-[#162623] flex items-center gap-2 px-5 py-3">
            <div className="w-3 h-3 rounded-full bg-[#E06D53]" />
            <div className="w-3 h-3 rounded-full bg-[#9CB0A8]" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="flex-1 text-center text-xs font-medium text-white/40">
              Nutrilen AI — Dashboard
            </div>
          </div>

          {/* Dashboard body: sidebar + canvas */}
          <div className="flex bg-[#DCE1E4]" style={{ minHeight: 560 }}>
            {/* === Sidebar === */}
            <aside className="w-56 flex-shrink-0 bg-[#9CB0A8] relative flex flex-col">
              {/* Logo */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#162623] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20.5C8.5 17.5 6 14.5 6 11.5C6 9 7.8 7.5 10 7.5C11.1 7.5 12 8.2 12 9C12 8.2 12.9 7.5 14 7.5C16.2 7.5 18 9 18 11.5C18 14.5 15.5 17.5 12 20.5Z" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <span className="font-jakarta text-sm font-extrabold tracking-tight text-[#162623]">
                    Nutrilen<span className="text-[#E06D53]"> AI</span>
                  </span>
                </div>
              </div>

              {/* Profile */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#162623] ring-2 ring-white/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[#162623] tracking-wide truncate">ARIF RAHMAN</div>
                    <div className="text-[10px] text-[#162623]/60 truncate">demo@nutrilen.ai</div>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-2 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={
                        item.active
                          ? "bg-[#DCE1E4] rounded-l-xl ml-2 px-3 py-2.5 flex items-center gap-2.5 text-[11px] font-bold text-[#162623] tracking-wide"
                          : "px-4 py-2.5 flex items-center gap-2.5 text-[11px] font-semibold text-[#162623]/70 tracking-wide hover:text-[#162623]"
                      }
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                      <span className="uppercase">{item.label}</span>
                    </div>
                  );
                })}
              </nav>

              {/* Dotted botanical leaf pattern at bottom */}
              <div className="h-20 relative overflow-hidden">
                <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 200 80" fill="none">
                  <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#162623" />
                  </pattern>
                  <path d="M100 80 Q50 40 0 50 L0 80 Z" fill="url(#dots)" />
                  <path d="M100 80 Q150 40 200 50 L200 80 Z" fill="url(#dots)" />
                  <path d="M100 75 Q90 50 80 60 Q85 70 100 75 Z" fill="#162623" opacity="0.15" />
                  <path d="M100 75 Q110 50 120 60 Q115 70 100 75 Z" fill="#162623" opacity="0.15" />
                </svg>
              </div>
            </aside>

            {/* === Main canvas === */}
            <div className="flex-1 p-5 sm:p-6 space-y-4 overflow-hidden">
              {/* Top KPI row — 3 cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Daily Calories — sage card */}
                <div className="bg-[#9CB0A8] rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wide">Daily Calories</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">1,370</div>
                  <div className="text-[10px] text-white/60">kcal · 63% of goal</div>
                  {/* Overlapping food illustration */}
                  <div className="absolute -bottom-2 -right-2 text-3xl opacity-80">🥗</div>
                </div>

                {/* Protein Goal — mist card with sage border */}
                <div className="bg-[#DCE1E4] border border-[#9CB0A8] rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Beef className="h-3.5 w-3.5 text-[#162623]" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-[#162623]/60 uppercase tracking-wide">Protein Goal</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#162623]">61 / 254g</div>
                  <div className="text-[10px] text-[#162623]/50">24% of daily target</div>
                  <div className="absolute -bottom-2 -right-2 text-3xl opacity-80">🍣</div>
                </div>

                {/* Day Streak — sage card */}
                <div className="bg-[#9CB0A8] rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Trophy className="h-3.5 w-3.5 text-[#162623]" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-[#162623]/60 uppercase tracking-wide">Day Streak</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#162623]">7 Days</div>
                  {/* 7-dot progress */}
                  <div className="flex gap-1 mt-2">
                    {weeklyData.map((v, i) => (
                      <div
                        key={i}
                        className={i < 7 ? "w-2 h-2 rounded-full bg-[#162623]" : "w-2 h-2 rounded-full bg-[#162623]/20"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle row: Food recap (wide) + Weekly intake */}
              <div className="grid grid-cols-3 gap-3">
                {/* Today's Food Recap — wide white card with ticket notches */}
                <div className="col-span-2 bg-white rounded-2xl p-4 relative">
                  {/* Notch left */}
                  <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#DCE1E4]" />
                  {/* Notch right */}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#DCE1E4]" />
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-[#162623]">Today's Food Recap</div>
                      <div className="text-[10px] text-[#4A5A55]">Overview of daily meals</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {meals.map((m) => (
                      <div key={m.name} className="flex items-center gap-3 py-1.5">
                        {/* Circular meal photo */}
                        <div className="w-9 h-9 rounded-full bg-[#DCE1E4] flex items-center justify-center text-lg flex-shrink-0">
                          {m.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#162623] truncate">{m.name}</div>
                          <div className="text-[10px] text-[#4A5A55]">{m.type}</div>
                        </div>
                        {/* Sage protein pill */}
                        <div className="bg-[#9CB0A8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          P {m.protein}
                        </div>
                        <div className="text-xs font-bold text-[#162623] tabular-nums w-14 text-right">{m.kcal} kcal</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Intake — white card with bar chart */}
                <div className="bg-white rounded-2xl p-4">
                  <div className="text-sm font-bold text-[#162623] mb-1">Weekly Intake</div>
                  <div className="text-[10px] text-[#4A5A55] mb-3">Mon – Sun</div>
                  <div className="flex items-end justify-between gap-1.5 h-20">
                    {weeklyData.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col justify-end rounded-full overflow-hidden" style={{ height: 64 }}>
                          <div className="w-full bg-[#9CB0A8]" style={{ height: `${v * 0.6}%` }} />
                          <div className="w-full bg-[#162623]" style={{ height: `${v * 0.4}%` }} />
                        </div>
                        <span className="text-[8px] text-[#4A5A55] font-medium">
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row: Macro Share + Calorie Trend */}
              <div className="grid grid-cols-3 gap-3">
                {/* Macro Share — donut */}
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-sm font-bold text-[#162623] mb-2">Macro Share</div>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      {/* Deep pine arc (protein) */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#162623" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 32 * 0.3} ${2 * Math.PI * 32}`}
                        strokeDashoffset="0"
                      />
                      {/* Sage arc (carbs) */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#9CB0A8" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 32 * 0.5} ${2 * Math.PI * 32}`}
                        strokeDashoffset={`${-2 * Math.PI * 32 * 0.3}`}
                      />
                      {/* Mist arc (fat) */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#DCE1E4" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 32 * 0.2} ${2 * Math.PI * 32}`}
                        strokeDashoffset={`${-2 * Math.PI * 32 * 0.8}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#162623] text-center leading-tight">Macro<br/>Share</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex gap-3 mt-2 text-[9px]">
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#162623]" />30%</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#9CB0A8]" />50%</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#DCE1E4] border border-[#9CB0A8]" />20%</span>
                  </div>
                </div>

                {/* Calorie Trend — wide white card with wave chart */}
                <div className="col-span-2 bg-white rounded-2xl p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-[#162623]">Calorie Trend</div>
                    <div className="text-[10px] text-[#4A5A55]">Last 7 days</div>
                  </div>
                  {/* Wave area chart */}
                  <div className="relative h-20">
                    <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9CB0A8" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#9CB0A8" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      {/* Filled area */}
                      <path
                        d="M0,55 Q35,25 70,35 T140,28 T210,45 T280,30 L280,80 L0,80 Z"
                        fill="url(#sageGrad)"
                      />
                      {/* Line 1 (sage) */}
                      <path
                        d="M0,55 Q35,25 70,35 T140,28 T210,45 T280,30"
                        fill="none"
                        stroke="#9CB0A8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Line 2 (charcoal dashed) */}
                      <path
                        d="M0,48 Q35,32 70,42 T140,38 T210,50 T280,42"
                        fill="none"
                        stroke="#162623"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                      {/* Highlighted node */}
                      <circle cx="140" cy="28" r="4" fill="#162623" />
                      <circle cx="140" cy="28" r="2" fill="#9CB0A8" />
                    </svg>
                    {/* Tooltip callout */}
                    <div className="absolute" style={{ left: "50%", top: "0", transform: "translateX(-50%)" }}>
                      <div className="bg-[#162623] text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                        1,370 kcal
                      </div>
                      <div className="w-px h-3 bg-[#162623] mx-auto" />
                    </div>
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-1 text-[8px] text-[#4A5A55]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
