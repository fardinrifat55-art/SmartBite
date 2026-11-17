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
import { Logo } from "@/components/shared/Logo";

export function DashboardPreview() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "AI Scanner", icon: ScanLine },
    { label: "Smart Shopping", icon: ShoppingBasket },
    { label: "Analytics", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ];

  const meals = [
    { name: "Paratha with Dal", type: "Breakfast", protein: "24g", kcal: 525, img: "https://images.unsplash.com/photo-1631293861593-da3a2f6b8c5f?w=80&h=80&fit=crop" },
    { name: "Rice with Fish Curry", type: "Lunch", protein: "37g", kcal: 665, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&h=80&fit=crop" },
  ];

  // Weekly intake: each day has [darkBar, sageBar] heights (0-100)
  const weeklyBars = [
    { day: "Mon", dark: 55, sage: 40 },
    { day: "Tue", dark: 70, sage: 50 },
    { day: "Wed", dark: 45, sage: 60 },
    { day: "Thu", dark: 80, sage: 35 },
    { day: "Fri", dark: 35, sage: 75 },
    { day: "Sat", dark: 90, sage: 55 },
    { day: "Sun", dark: 60, sage: 45 },
  ];

  // Calorie trend: smooth wave points for two curves (Jan-Jun)
  const trendMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <section className="bg-[#DCE1E4] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-60px] left-[-40px] w-72 h-72 rounded-full bg-[#9CB0A8]/30 blur-sm pointer-events-none" />
      <div className="absolute top-1/2 right-[-60px] w-48 h-48 rounded-full bg-[#DCE1E4]/60 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
          className="rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(22,38,35,0.18)] border border-white/40 bg-white"
        >
          {/* Window title bar */}
          <div className="bg-[#162623] flex items-center gap-2 px-5 py-3">
            <div className="w-3 h-3 rounded-full bg-[#E06D53]" />
            <div className="w-3 h-3 rounded-full bg-[#9CB0A8]" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="flex-1 text-center text-xs font-medium text-white/40">
              SmartBite — Dashboard
            </div>
          </div>

          {/* Dashboard body */}
          <div className="flex" style={{ minHeight: 580 }}>
            {/* === Sidebar === */}
            <aside className="w-52 flex-shrink-0 bg-[#9CB0A8] relative flex flex-col">
              {/* Lighter green rounded header card */}
              <div className="m-3 bg-[#AEC0B6] rounded-2xl p-4">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-4">
                  <Logo size="sm" />
                </div>
                {/* Profile photo */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full ring-4 ring-white/80 overflow-hidden bg-[#162623]">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
                      alt="Arif Rahman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-[#162623] tracking-wide mt-2">ARIF RAHMAN</div>
                  <div className="text-[9px] text-[#162623]/60">arif@smartbite.ai</div>
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
                          ? "bg-white/85 rounded-xl mx-1 px-3 py-2 flex items-center gap-2 text-[10px] font-bold text-[#162623] tracking-wide shadow-sm"
                          : "px-3 py-2 mx-1 flex items-center gap-2 text-[10px] font-semibold text-[#162623]/65 tracking-wide"
                      }
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                      <span className="uppercase">{item.label}</span>
                    </div>
                  );
                })}
              </nav>

              {/* Botanical leaf illustrations at bottom */}
              <div className="h-24 relative overflow-hidden">
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 200 96" fill="none" preserveAspectRatio="xMidYMax meet">
                  {/* Solid dark green leaves */}
                  <path d="M30 90 Q15 60 20 35 Q30 50 35 75 Q33 82 30 90Z" fill="#162623" opacity="0.20" />
                  <path d="M55 92 Q45 65 48 40 Q56 55 60 78 Q58 86 55 92Z" fill="#162623" opacity="0.15" />
                  <path d="M165 90 Q175 60 170 35 Q162 50 158 75 Q160 82 165 90Z" fill="#162623" opacity="0.18" />
                  {/* Dotted outline leaves */}
                  <path d="M85 88 Q75 55 80 30 Q90 50 92 72 Q90 80 85 88Z" fill="none" stroke="#162623" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.25" />
                  <path d="M120 90 Q130 58 125 32 Q118 52 115 75 Q117 82 120 90Z" fill="none" stroke="#162623" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.22" />
                  {/* Small dots scattered */}
                  {[ [10,75],[25,50],[45,68],[70,45],[95,60],[110,40],[135,55],[155,45],[175,60],[185,40] ].map(([cx,cy],i) => (
                    <circle key={i} cx={cx} cy={cy} r="1" fill="#162623" opacity="0.15" />
                  ))}
                </svg>
              </div>
            </aside>

            {/* === Main canvas === */}
            <div className="flex-1 bg-[#DCE1E4] p-4 sm:p-5 space-y-3 overflow-hidden">
              {/* Top KPI row — 3 cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Daily Calories — sage card with overlapping food photo */}
                <div className="bg-[#9CB0A8] rounded-2xl p-4 relative overflow-visible">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wide">Daily Calories</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white leading-tight">1,370</div>
                  <div className="text-[10px] text-white/60">kcal · 63% of goal</div>
                  {/* Overlapping grain bowl photo */}
                  <div className="absolute -bottom-1 -right-2 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop" alt="Grain bowl" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Protein Goal — light card with sage border + overlapping salmon photo */}
                <div className="bg-[#EEF0F1] border border-[#9CB0A8] rounded-2xl p-4 relative overflow-visible">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Beef className="h-3.5 w-3.5 text-[#162623]" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-[#162623]/60 uppercase tracking-wide">Protein Goal</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#162623]">61</span>
                    <span className="text-xs text-[#162623]/50">/ 254g</span>
                  </div>
                  <div className="text-[10px] text-[#162623]/50">24% of daily target</div>
                  <div className="absolute -bottom-1 -right-2 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop" alt="Salmon avocado" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Day Streak — sage card with flame dots */}
                <div className="bg-[#9CB0A8] rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Trophy className="h-3.5 w-3.5 text-[#162623]" strokeWidth={2} />
                    <span className="text-[10px] font-semibold text-[#162623]/60 uppercase tracking-wide">Day Streak</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#162623] leading-tight">7 Days</div>
                  {/* 7 flame-shaped dots connected by dotted line */}
                  <div className="flex items-center gap-0 mt-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <React.Fragment key={i}>
                        <div className="w-2.5 h-3 flex-shrink-0">
                          <svg viewBox="0 0 10 12" fill="none">
                            <path d="M5 0 C5 3 8 4 8 7 C8 10 6.5 12 5 12 C3.5 12 2 10 2 7 C2 5 4 4 5 0Z" fill="#162623" />
                          </svg>
                        </div>
                        {i < 6 && <div className="h-px w-2 border-t border-dashed border-[#162623]/40 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle row: Food recap (wide) + Weekly intake */}
              <div className="grid grid-cols-3 gap-3">
                {/* Today's Food Recap — wide white card with ticket notch */}
                <div className="col-span-2 bg-white rounded-2xl p-4 relative">
                  {/* Ticket notch — right edge */}
                  <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#DCE1E4]" />
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-[#162623]">Today's Food Recap</div>
                      <div className="text-[10px] text-[#4A5A55]">Overview of daily meals</div>
                    </div>
                  </div>
                  {/* Table header */}
                  <div className="flex items-center gap-3 px-1 pb-1.5 border-b border-[#DCE1E4] text-[9px] font-bold text-[#4A5A55] uppercase tracking-wide">
                    <div className="w-9 flex-shrink-0" />
                    <div className="flex-1">Meal</div>
                    <div className="w-16 text-center">Category</div>
                    <div className="w-12 text-center">Protein</div>
                    <div className="w-14 text-right">Calories</div>
                  </div>
                  {/* Meal rows */}
                  <div className="space-y-0">
                    {meals.map((m) => (
                      <div key={m.name} className="flex items-center gap-3 px-1 py-2.5 border-b border-[#DCE1E4]/50 last:border-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#DCE1E4]">
                          <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#162623] truncate">{m.name}</div>
                        </div>
                        <div className="w-16 text-center text-[10px] text-[#4A5A55]">{m.type}</div>
                        {/* Sage protein pill */}
                        <div className="w-12 flex justify-center">
                          <div className="bg-[#9CB0A8] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            {m.protein}
                          </div>
                        </div>
                        <div className="w-14 text-right text-xs font-bold text-[#162623] tabular-nums">{m.kcal} kcal</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Intake — white card with grouped dual bars */}
                <div className="bg-white rounded-2xl p-4">
                  <div className="text-sm font-bold text-[#162623] mb-0.5">Weekly Intake</div>
                  <div className="text-[10px] text-[#4A5A55] mb-3">Statistics</div>
                  <div className="flex items-end justify-between gap-1 h-20">
                    {weeklyBars.map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 64 }}>
                          <div className="w-2 rounded-t-full bg-[#162623]" style={{ height: `${d.dark}%` }} />
                          <div className="w-2 rounded-t-full bg-[#9CB0A8]" style={{ height: `${d.sage}%` }} />
                        </div>
                        <span className="text-[8px] text-[#4A5A55] font-medium">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row: Macro Share + Calorie Trend */}
              <div className="grid grid-cols-3 gap-3">
                {/* Macro Share — donut with rounded segments */}
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-sm font-bold text-[#162623] mb-2">Macro Share</div>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#E5E7E5" strokeWidth="10" />
                      {/* Dark charcoal segment (45%) */}
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#162623" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30 * 0.45} ${2 * Math.PI * 30}`}
                        strokeDashoffset="0"
                      />
                      {/* Sage segment (35%) */}
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#9CB0A8" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30 * 0.35} ${2 * Math.PI * 30}`}
                        strokeDashoffset={`${-2 * Math.PI * 30 * 0.45}`}
                      />
                      {/* Light gray segment (20%) */}
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#DCE1E4" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30 * 0.20} ${2 * Math.PI * 30}`}
                        strokeDashoffset={`${-2 * Math.PI * 30 * 0.80}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#162623] text-center leading-tight">Macro<br/>Share</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[9px]">
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#162623]" />45%</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#9CB0A8]" />35%</span>
                    <span className="flex items-center gap-1 text-[#4A5A55]"><span className="w-2 h-2 rounded-full bg-[#DCE1E4] border border-[#9CB0A8]" />20%</span>
                  </div>
                </div>

                {/* Calorie Trend — wide white card with dual-curve area chart */}
                <div className="col-span-2 bg-white rounded-2xl p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-[#162623]">Calorie Trend</div>
                    <div className="text-[10px] text-[#4A5A55]">Last 6 months</div>
                  </div>
                  <div className="relative h-20">
                    <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9CB0A8" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#9CB0A8" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#162623" stopOpacity="0.20" />
                          <stop offset="100%" stopColor="#162623" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Sage area fill */}
                      <path d="M0,50 Q28,20 56,35 T112,25 T168,30 T224,20 T280,35 L280,80 L0,80 Z" fill="url(#sageGrad)" />
                      {/* Dark area fill */}
                      <path d="M0,55 Q28,40 56,45 T112,50 T168,40 T224,50 T280,42 L280,80 L0,80 Z" fill="url(#darkGrad)" />
                      {/* Sage curve line */}
                      <path d="M0,50 Q28,20 56,35 T112,25 T168,30 T224,20 T280,35" fill="none" stroke="#9CB0A8" strokeWidth="2" strokeLinecap="round" />
                      {/* Dark curve line */}
                      <path d="M0,55 Q28,40 56,45 T112,50 T168,40 T224,50 T280,42" fill="none" stroke="#162623" strokeWidth="1.5" strokeLinecap="round" />
                      {/* Highlighted node on dark curve */}
                      <circle cx="168" cy="40" r="4" fill="#162623" />
                      <circle cx="168" cy="40" r="2" fill="#9CB0A8" />
                    </svg>
                    {/* Tooltip callout */}
                    <div className="absolute" style={{ left: "60%", top: "-4px", transform: "translateX(-50%)" }}>
                      <div className="bg-[#162623] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                        1,370 kcal
                      </div>
                      <div className="w-px h-2 bg-[#162623] mx-auto" />
                    </div>
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-1 text-[8px] text-[#4A5A55] px-1">
                    {trendMonths.map((m) => (
                      <span key={m}>{m}</span>
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
