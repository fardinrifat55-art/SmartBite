"use client";

import React, { useMemo, useState } from "react";
import {
  ShoppingBasket,
  Plus,
  Search,
  Check,
  Trash2,
  Wallet,
  Sparkles,
  Leaf,
  Beef,
  Milk,
  Wheat,
  Tag,
  ShoppingCart,
  Calendar,
  TrendingDown,
  CircleDot,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Card } from "@/components/dashboard/Card";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Cat = "produce" | "protein" | "dairy" | "pantry" | "snacks";

interface ShopItem {
  id: string;
  name: string;
  nameBn: string;
  qty: string;
  price: number; // BDT
  cat: Cat;
  tag?: "high-protein" | "low-cal" | "fiber";
}

const ITEMS: ShopItem[] = [
  { id: "s1", name: "Spinach (bund)", nameBn: "পালং শাক", qty: "2 bunches", price: 40, cat: "produce", tag: "fiber" },
  { id: "s2", name: "Tomatoes", nameBn: "টমেটো", qty: "1 kg", price: 60, cat: "produce", tag: "low-cal" },
  { id: "s3", name: "Cucumber", nameBn: "শশা", qty: "0.5 kg", price: 30, cat: "produce", tag: "low-cal" },
  { id: "s4", name: "Rui Fish", nameBn: "রুই মাছ", qty: "500g", price: 220, cat: "protein", tag: "high-protein" },
  { id: "s5", name: "Chicken Breast", nameBn: "চিকেন ব্রেস্ট", qty: "1 kg", price: 180, cat: "protein", tag: "high-protein" },
  { id: "s6", name: "Eggs", nameBn: "ডিম", qty: "12 pcs", price: 150, cat: "protein", tag: "high-protein" },
  { id: "s7", name: "Lentils (Musur)", nameBn: "মসুর ডাল", qty: "1 kg", price: 120, cat: "pantry", tag: "high-protein" },
  { id: "s8", name: "Milk", nameBn: "দুধ", qty: "1 L", price: 90, cat: "dairy", tag: "high-protein" },
  { id: "s9", name: "Greek Yogurt", nameBn: "ইয়োগার্ট", qty: "500g", price: 110, cat: "dairy", tag: "high-protein" },
  { id: "s10", name: "Basmati Rice", nameBn: "বাসমতি চাল", qty: "2 kg", price: 160, cat: "pantry" },
  { id: "s11", name: "Mustard Oil", nameBn: "সরিষার তেল", qty: "500 ml", price: 180, cat: "pantry" },
  { id: "s12", name: "Mixed Nuts", nameBn: "মিক্সড নাটস", qty: "200g", price: 240, cat: "snacks", tag: "high-protein" },
  { id: "s13", name: "Bananas", nameBn: "কলা", qty: "6 pcs", price: 60, cat: "snacks", tag: "fiber" },
  { id: "s14", name: "Oats", nameBn: "ওটস", qty: "500g", price: 130, cat: "pantry", tag: "fiber" },
];

const CATS: { id: Cat; labelKey: string; bn: string; icon: React.ElementType; color: string }[] = [
  { id: "produce", labelKey: "", bn: "সবজি ও ফল", icon: Leaf, color: "#1E4D3B" },
  { id: "protein", labelKey: "", bn: "প্রোটিন", icon: Beef, color: "#E06D53" },
  { id: "dairy", labelKey: "", bn: "দুগ্ধ ও ডিম", icon: Milk, color: "#5BB8E8" },
  { id: "pantry", labelKey: "", bn: "প্যান্ট্রি", icon: Wheat, color: "#D4A843" },
  { id: "snacks", labelKey: "", bn: "স্ন্যাকস", icon: ShoppingBasket, color: "#E8940A" },
];

const CAT_LABEL: Record<Cat, { en: string; bn: string }> = {
  produce: { en: "Produce", bn: "সবজি ও ফল" },
  protein: { en: "Protein", bn: "প্রোটিন" },
  dairy: { en: "Dairy & Eggs", bn: "দুগ্ধ ও ডিম" },
  pantry: { en: "Pantry", bn: "প্যান্ট্রি" },
  snacks: { en: "Snacks", bn: "স্ন্যাকস" },
};

const TAG_LABEL: Record<string, { en: string; bn: string }> = {
  "high-protein": { en: "High Protein", bn: "উচ্চ প্রোটিন" },
  "low-cal": { en: "Low Cal", bn: "কম ক্যালরি" },
  fiber: { en: "Fiber", bn: "ফাইবার" },
};
const TAG_COLOR: Record<string, string> = {
  "high-protein": "#1E4D3B",
  "low-cal": "#5BB8E8",
  fiber: "#E8940A",
};

export function ShoppingScreen() {
  const { t, lang } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const { toast } = useToast();
  const [checked, setChecked] = useState<Record<string, boolean>>({ s4: true, s6: true, s7: true, s12: true });
  const [budget, setBudget] = useState(2000);
  const today = new Date();
  const dateStr = today.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "long", month: "long", day: "numeric" });

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const cartItems = ITEMS.filter((i) => checked[i.id]);
  const cartTotal = cartItems.reduce((a, i) => a + i.price, 0);
  const listTotal = ITEMS.reduce((a, i) => a + i.price, 0);
  const budgetPct = Math.min(100, (cartTotal / budget) * 100);
  const remaining = budget - cartTotal;

  const suggestions = useMemo(
    () => ITEMS.filter((i) => i.tag === "high-protein" && !checked[i.id]).slice(0, 3),
    [checked]
  );

  return (
    <AppShell activeView="shopping" urlPath="nutrilen.ai/shopping">
      <div className="p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8940A] to-[#E06D53] flex items-center justify-center shadow-sm">
              <ShoppingBasket className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">{t("sidebar.shopping")}</h1>
              <p className="text-sm text-[#4A5A55] mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr} · Weekly grocery run
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full bg-white border border-[#DCE4E1] text-[#4A5A55] text-sm w-52 shadow-sm">
              <Search className="h-4 w-4" />
              <span className="text-[#4A5A55]/70">{t("common.search")}</span>
            </div>
            <button
              onClick={() => setView("scanner")}
              className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#1E4D3B] text-white text-sm font-semibold shadow-sm hover:bg-[#163A2C] transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              {t("common.add")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: list by category */}
          <div className="lg:col-span-2 space-y-4">
            {/* Budget card */}
            <Card className="bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E4D3B]/10 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-[#1E4D3B]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">Weekly Budget</h3>
                    <p className="text-[11px] text-[#4A5A55]">৳{cartTotal} of ৳{budget} in cart</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-extrabold tabular-nums ${remaining < 0 ? "text-[#E06D53]" : "text-[#1E4D3B]"}`}>
                    ৳{Math.abs(remaining)} {remaining < 0 ? "over" : "left"}
                  </div>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-[#EEF1EE] overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", remaining < 0 ? "bg-[#E06D53]" : "bg-gradient-to-r from-[#1E4D3B] to-[#2C7E8F]")}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] text-[#4A5A55]">৳500</span>
                <input
                  type="range"
                  min={500}
                  max={3500}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="flex-1 accent-[#1E4D3B]"
                />
                <span className="text-[11px] text-[#4A5A55]">৳3500</span>
              </div>
            </Card>

            {CATS.map((cat) => {
              const items = ITEMS.filter((i) => i.cat === cat.id);
              const Icon = cat.icon;
              const label = lang === "bn" ? CAT_LABEL[cat.id].bn : CAT_LABEL[cat.id].en;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}1A` }}>
                      <Icon className="h-4 w-4" strokeWidth={2} style={{ color: cat.color }} />
                    </span>
                    <h2 className="font-jakarta text-base font-extrabold text-[#162623]">{label}</h2>
                    <span className="text-xs text-[#4A5A55]">· {items.length} items</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((it) => {
                      const on = !!checked[it.id];
                      return (
                        <Card key={it.id} className={cn("bg-white p-3 flex items-center gap-3", on && "ring-1 ring-[#1E4D3B]/30 bg-[#F4F7F6]")}>
                          <button
                            onClick={() => toggle(it.id)}
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                              on ? "bg-[#1E4D3B] border-[#1E4D3B] text-white" : "border-[#DCE4E1] text-transparent hover:border-[#1E4D3B]/50"
                            )}
                            aria-label={on ? t("common.remove") : t("common.add")}
                          >
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className={cn("font-jakarta text-sm font-bold truncate", on ? "text-[#162623]/60 line-through" : "text-[#162623]")}>
                                {lang === "bn" ? it.nameBn : it.name}
                              </h3>
                              {it.tag && (
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${TAG_COLOR[it.tag]}1A`, color: TAG_COLOR[it.tag] }}>
                                  {lang === "bn" ? TAG_LABEL[it.tag].bn : TAG_LABEL[it.tag].en}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#4A5A55]">{it.qty}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-jakarta text-sm font-extrabold text-[#162623] tabular-nums">৳{it.price}</div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: cart + suggestions */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#163A2C] p-5 border-none overflow-hidden relative">
              <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 200 40" fill="none" preserveAspectRatio="none" style={{ opacity: 0.3 }}>
                <path d="M0 28 Q40 12 80 22 T160 16 T200 20" stroke="#D4A843" strokeWidth="0.6" fill="none" />
              </svg>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-4 w-4 text-[#D4A843]" strokeWidth={2} />
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Your Cart</span>
                </div>
                <div className="text-3xl font-extrabold text-white tabular-nums leading-tight">৳{cartTotal}</div>
                <p className="text-xs text-white/60 mt-1">{cartItems.length} items · est. {cartItems.reduce((a, i) => a + (i.tag === "high-protein" ? 1 : 0), 0)} high-protein</p>
                <button
                  onClick={() => toast({ title: "Cart ready", description: `৳${cartTotal} · ${cartItems.length} items added to checkout.` })}
                  className="mt-4 w-full h-10 rounded-full bg-[#D4A843] text-[#162623] text-sm font-bold hover:bg-[#E8940A] hover:text-white transition-colors"
                >
                  Checkout · ৳{cartTotal}
                </button>
              </div>
            </Card>

            <Card className="bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#E8940A]/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#E8940A]" strokeWidth={2} />
                </div>
                <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">AI Suggestions</h3>
              </div>
              <p className="text-[11px] text-[#4A5A55] mb-3">Based on your protein goal of 254g/day.</p>
              <div className="space-y-2">
                {suggestions.length === 0 && <p className="text-xs text-[#4A5A55] text-center py-3">All high-protein picks are in your cart.</p>}
                {suggestions.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7F6]">
                    <CircleDot className="h-4 w-4 text-[#1E4D3B] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#162623] truncate">{lang === "bn" ? s.nameBn : s.name}</div>
                      <div className="text-[10px] text-[#4A5A55]">{s.qty} · ৳{s.price}</div>
                    </div>
                    <button
                      onClick={() => { toggle(s.id); toast({ title: lang === "bn" ? s.nameBn : s.name, description: "Added to cart." }); }}
                      className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#1E4D3B] text-white hover:bg-[#163A2C]"
                    >
                      {t("common.add")}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#FFF7E6] to-[#FBEED1] p-5 border-[#E8940A]/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-[#1E4D3B]" strokeWidth={2} />
                <h3 className="font-jakarta text-sm font-extrabold text-[#162623]">Smart Savings</h3>
              </div>
              <p className="text-xs text-[#4A5A55] leading-relaxed">
                Swapping branded yogurt for local <strong className="text-[#1E4D3B]">mishti doi</strong> saves ~৳40/week while keeping protein intake. Seasonal produce this week is 12% cheaper than last.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[#1E4D3B]">
                <Tag className="h-3.5 w-3.5" />
                Est. weekly savings ৳180
              </div>
            </Card>

            <Card className="bg-white p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#4A5A55] uppercase tracking-wide">List total</div>
                <div className="font-jakarta text-lg font-extrabold text-[#162623] tabular-nums">৳{listTotal}</div>
              </div>
              <button
                onClick={() => { setChecked({}); toast({ title: "List cleared", description: "All items unchecked." }); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E06D53] hover:text-[#C95B42]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </Card>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </AppShell>
  );
}
