"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  ShoppingBasket,
  Utensils,
  Image as ImageIcon,
  Loader2,
  X,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookPlus,
  Save,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { formatNumber } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

type ScannerMode = "select" | "meal" | "shopping";
type AnalysisState = "idle" | "analyzing" | "success" | "error";

interface AnalysisResult {
  mealName: string;
  portionSize: string;
  confidence: number;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  ingredients: { name: string; quantity: string; calories: number }[];
  insights: string[];
}

const LOADING_MESSAGES = [
  "scanner.identifying",
  "scanner.recognizing",
  "scanner.estimating",
  "scanner.calculating",
  "scanner.preparing",
];

export function ScannerScreen() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const [mode, setMode] = useState<ScannerMode>("select");

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar activeView="scanner" />
      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setView("dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium text-forest/60 hover:text-forest mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("sidebar.dashboard")}
            </button>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {t("scanner.title")}
            </h1>
            <p className="mt-1 text-sm text-forest/60">{t("scanner.subtitle")}</p>
          </div>

          <AnimatePresence mode="wait">
            {mode === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <ModeCard
                  icon={Utensils}
                  title={t("scanner.mode.meal")}
                  desc={t("scanner.mode.meal.desc")}
                  accent="lime"
                  onClick={() => setMode("meal")}
                />
                <ModeCard
                  icon={ShoppingBasket}
                  title={t("scanner.mode.shopping")}
                  desc={t("scanner.mode.shopping.desc")}
                  accent="cream"
                  badge={t("scanner.comingSoon")}
                  onClick={() => setMode("shopping")}
                />
              </motion.div>
            )}

            {mode === "meal" && (
              <motion.div
                key="meal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MealAnalyzer onBack={() => setMode("select")} />
              </motion.div>
            )}

            {mode === "shopping" && (
              <motion.div
                key="shopping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ShoppingPlaceholder onBack={() => setMode("select")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ===== Mode selection card =====
function ModeCard({
  icon: Icon,
  title,
  desc,
  accent,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: "lime" | "cream";
  onClick: () => void;
  badge?: string;
}) {
  const { t } = useI18n();
  const isLime = accent === "lime";
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-3xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl",
        isLime
          ? "bg-lime-soft/40 border-lime/30 hover:border-lime/50"
          : "bg-cream/40 border-forest/8 hover:border-forest/15"
      )}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-forest/10 text-[10px] font-semibold text-forest/60">
          {badge}
        </span>
      )}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
          isLime ? "bg-forest" : "bg-forest/8"
        )}
      >
        <Icon className={cn("h-7 w-7", isLime ? "text-lime" : "text-forest")} strokeWidth={1.7} />
      </div>
      <h3 className="font-heading text-lg font-bold text-forest mb-2">{title}</h3>
      <p className="text-sm text-forest/65 leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-forest">
        {t("common.continue")}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}

// ===== Meal Analyzer =====
function MealAnalyzer({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const addFood = useAppStore((s) => s.addFood);
  const targets = useAppStore((s) => s.targets);
  const setView = useAppStore((s) => s.setView);

  const [image, setImage] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [addedToDiary, setAddedToDiary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Loading message rotation
  React.useEffect(() => {
    if (state !== "analyzing") return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [state]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      setState("idle");
      setAddedToDiary(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const analyze = async () => {
    if (!image) return;
    setState("analyzing");
    setErrorMsg("");
    setResult(null);
    setLoadingMsgIdx(0);
    setAddedToDiary(false);
    try {
      const res = await fetch("/api/scan-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      setResult(data.result);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t("scanner.error"));
      setState("error");
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setState("idle");
    setErrorMsg("");
    setAddedToDiary(false);
  };

  const addToDiary = () => {
    if (!result) return;
    addFood({
      id: Math.random().toString(36).slice(2),
      mealType: "snacks",
      name: result.mealName,
      nameBn: result.mealName,
      description: result.portionSize,
      descriptionBn: result.portionSize,
      imageQuery: "scanned",
      calories: result.totalCalories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      fiber: result.fiber,
      sugar: result.sugar,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      ingredients: result.ingredients.map((ing) => ({
        name: ing.name,
        nameBn: ing.name,
        quantity: ing.quantity,
        calories: ing.calories,
      })),
    });
    setAddedToDiary(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full text-forest/60">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("common.back")}
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-forest/8 p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-forest">
          {t("scanner.upload.heading")}
        </h2>
        <p className="mt-1 text-sm text-forest/60">{t("scanner.upload.desc")}</p>

        {/* Upload area */}
        {!image && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "mt-5 rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors",
              dragging
                ? "border-lime bg-lime-soft/30"
                : "border-forest/15 bg-cream/20"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-forest/40" strokeWidth={1.6} />
            </div>
            <p className="text-sm text-forest/60 mb-5">
              Drag & drop your meal photo here
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="rounded-full bg-forest text-white font-semibold hover:bg-forest/90"
              >
                <Camera className="mr-1.5 h-4 w-4" />
                {t("scanner.takePhoto")}
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="rounded-full border-forest/15 text-forest hover:bg-lime-soft/30"
              >
                <Upload className="mr-1.5 h-4 w-4" />
                {t("scanner.uploadGallery")}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {/* Image preview */}
        {image && state !== "analyzing" && (
          <div className="mt-5">
            <div className="relative rounded-2xl overflow-hidden bg-forest/5">
              <img src={image} alt="Meal preview" className="w-full max-h-80 object-contain" />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-forest/70 text-white flex items-center justify-center hover:bg-forest"
                aria-label={t("common.remove")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {state === "idle" && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={analyze}
                  className="flex-1 rounded-full bg-lime text-forest font-semibold hover:bg-lime/90 shadow-md"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  {t("scanner.analyze")}
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="rounded-full border-forest/15 text-forest"
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  {t("common.remove")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Analyzing state */}
        {state === "analyzing" && (
          <div className="mt-5 py-12 text-center">
            <div className="relative inline-flex">
              <div className="absolute inset-0 rounded-full bg-lime/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-forest flex items-center justify-center">
                <Loader2 className="h-9 w-9 text-lime animate-spin" />
              </div>
            </div>
            <div className="mt-5 space-y-2 max-w-xs mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm font-medium text-forest"
                >
                  {t(LOADING_MESSAGES[loadingMsgIdx])}
                </motion.div>
              </AnimatePresence>
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5">
                {LOADING_MESSAGES.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === loadingMsgIdx ? "w-6 bg-lime" : "w-1.5 bg-forest/15"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="mt-5 rounded-2xl bg-fat/10 border border-fat/20 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-fat/20 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-fat" />
            </div>
            <p className="text-sm text-forest/70 mb-4">{errorMsg}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={analyze} className="rounded-full bg-forest text-white">
                <RotateCcw className="mr-1.5 h-4 w-4" />
                {t("scanner.retry")}
              </Button>
              <Button onClick={reset} variant="outline" className="rounded-full">
                {t("common.remove")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {state === "success" && result && (
        <AnalysisResults
          result={result}
          image={image}
          targets={targets}
          onAddToDiary={addToDiary}
          addedToDiary={addedToDiary}
          onAnalyzeAnother={reset}
          onGoToDashboard={() => setView("dashboard")}
        />
      )}
    </div>
  );
}

// ===== Analysis Results =====
function AnalysisResults({
  result,
  image,
  targets,
  onAddToDiary,
  addedToDiary,
  onAnalyzeAnother,
  onGoToDashboard,
}: {
  result: AnalysisResult;
  image: string | null;
  targets: any;
  onAddToDiary: () => void;
  addedToDiary: boolean;
  onAnalyzeAnother: () => void;
  onGoToDashboard: () => void;
}) {
  const { t } = useI18n();

  const dailyCal = targets?.dailyCalories ?? 2000;
  const proteinGoal = targets?.protein ?? 120;
  const carbsGoal = targets?.carbs ?? 250;
  const fatGoal = targets?.fat ?? 70;

  const calPct = (result.totalCalories / dailyCal) * 100;

  const macroCards = [
    { label: t("scanner.results.protein"), value: result.protein, unit: "g", icon: Beef, color: "#9DC45C", bg: "bg-protein/10", goalPct: (result.protein / proteinGoal) * 100 },
    { label: t("scanner.results.carbs"), value: result.carbs, unit: "g", icon: Wheat, color: "#F2D15B", bg: "bg-carb/10", goalPct: (result.carbs / carbsGoal) * 100 },
    { label: t("scanner.results.fat"), value: result.fat, unit: "g", icon: Droplet, color: "#E77D6D", bg: "bg-fat/10", goalPct: (result.fat / fatGoal) * 100 },
    { label: t("scanner.results.fiber"), value: result.fiber, unit: "g", icon: Leaf, color: "#65C7E7", bg: "bg-hydration/10", goalPct: 0 },
  ];

  const confidenceLabel =
    result.confidence >= 0.8 ? "High" : result.confidence >= 0.6 ? "Medium" : "Low";
  const confidenceColor =
    result.confidence >= 0.8 ? "text-protein" : result.confidence >= 0.6 ? "text-carb" : "text-fat";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Meal overview */}
      <div className="bg-white rounded-3xl border border-forest/8 overflow-hidden shadow-sm">
        {image && (
          <div className="relative h-48 sm:h-64 bg-forest/5">
            <img src={image} alt={result.mealName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="text-white">
                <div className="text-xs font-medium text-white/80 uppercase tracking-wide">
                  {t("scanner.results.mealName")}
                </div>
                <div className="font-heading text-xl sm:text-2xl font-bold">{result.mealName}</div>
                {result.portionSize && (
                  <div className="text-xs text-white/70 mt-0.5">{result.portionSize}</div>
                )}
              </div>
              <div className="bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-right">
                <div className="text-[10px] text-forest/50 uppercase">{t("scanner.results.confidence")}</div>
                <div className={cn("text-sm font-bold", confidenceColor)}>
                  {confidenceLabel} · {Math.round(result.confidence * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nutrition summary */}
      <div className="bg-white rounded-3xl border border-forest/8 p-6 shadow-sm">
        <h3 className="font-heading text-lg font-bold text-forest mb-4">
          {t("scanner.results.calories")}
        </h3>
        <div className="flex items-center gap-6 mb-5">
          <div className="text-center">
            <div className="text-4xl font-bold text-lime tabular-nums">
              {formatNumber(result.totalCalories)}
            </div>
            <div className="text-xs text-forest/50 mt-1">{t("common.kcal")}</div>
          </div>
          <div className="flex-1 h-2 bg-forest/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime to-protein rounded-full" style={{ width: `${Math.min(100, calPct)}%` }} />
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-forest tabular-nums">{calPct.toFixed(1)}%</div>
            <div className="text-[10px] text-forest/50">{t("scanner.results.ofDailyTarget")}</div>
          </div>
        </div>
        {/* Macro grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {macroCards.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl border border-forest/8 p-3">
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center mb-2`}>
                  <Icon className="h-4 w-4" style={{ color: m.color }} strokeWidth={1.8} />
                </div>
                <div className="text-xs text-forest/55 mb-0.5">{m.label}</div>
                <div className="text-lg font-bold text-forest tabular-nums">
                  {m.value}
                  <span className="text-xs text-forest/40 ml-0.5">{m.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ingredient breakdown */}
      {result.ingredients.length > 0 && (
        <div className="bg-white rounded-3xl border border-forest/8 p-6 shadow-sm">
          <h3 className="font-heading text-lg font-bold text-forest mb-4">
            {t("scanner.results.ingredients")}
          </h3>
          <div className="space-y-2">
            {result.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-cream/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-lime-soft/40 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-forest/60" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-forest truncate">{ing.name}</div>
                    {ing.quantity && (
                      <div className="text-xs text-forest/50">{ing.quantity}</div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-forest tabular-nums flex-shrink-0">
                  {ing.calories} kcal
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health insights */}
      {result.insights.length > 0 && (
        <div className="bg-gradient-to-br from-forest to-forest/90 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-lime/8 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-lime" strokeWidth={1.8} />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                {t("scanner.results.insights")}
              </h3>
            </div>
            <div className="space-y-2.5">
              {result.insights.map((ins, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/8"
                >
                  <Info className="h-4 w-4 text-lime flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <p className="text-sm text-white/85 leading-relaxed">{ins}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goal comparison */}
      <div className="bg-white rounded-3xl border border-forest/8 p-6 shadow-sm">
        <h3 className="font-heading text-lg font-bold text-forest mb-4">
          {t("scanner.results.comparison")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <ComparisonBar
            label={t("scanner.results.calories")}
            value={result.totalCalories}
            goal={dailyCal}
            unit="kcal"
            color="#A5D52E"
          />
          <ComparisonBar
            label={t("scanner.results.protein")}
            value={result.protein}
            goal={proteinGoal}
            unit="g"
            color="#9DC45C"
          />
          <ComparisonBar
            label={t("scanner.results.carbs")}
            value={result.carbs}
            goal={carbsGoal}
            unit="g"
            color="#F2D15B"
          />
          <ComparisonBar
            label={t("scanner.results.fat")}
            value={result.fat}
            goal={fatGoal}
            unit="g"
            color="#E77D6D"
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-cream/50 border border-forest/8 p-4">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-forest/50 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-forest/60 leading-relaxed">
            {t("scanner.disclaimer")}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {addedToDiary ? (
          <div className="flex-1 rounded-full bg-protein/15 border border-protein/30 px-5 py-3 flex items-center justify-center gap-2 text-protein font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Added to your food diary
          </div>
        ) : (
          <Button
            onClick={onAddToDiary}
            className="flex-1 rounded-full bg-forest text-white font-semibold hover:bg-forest/90 shadow-md h-12"
          >
            <BookPlus className="mr-1.5 h-4 w-4" />
            {t("scanner.results.addToDiary")}
          </Button>
        )}
        <Button
          onClick={onAnalyzeAnother}
          variant="outline"
          className="rounded-full border-forest/15 text-forest hover:bg-lime-soft/30 h-12"
        >
          <RotateCcw className="mr-1.5 h-4 w-4" />
          {t("scanner.results.analyzeAnother")}
        </Button>
      </div>

      {addedToDiary && (
        <Button
          onClick={onGoToDashboard}
          className="w-full rounded-full bg-lime text-forest font-semibold hover:bg-lime/90 h-12"
        >
          {t("sidebar.dashboard")}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
}

function ComparisonBar({
  label,
  value,
  goal,
  unit,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min(100, goal > 0 ? (value / goal) * 100 : 0);
  return (
    <div className="rounded-2xl border border-forest/8 p-3">
      <div className="text-xs text-forest/55 mb-1.5">{label}</div>
      <div className="text-lg font-bold text-forest tabular-nums">
        {value}
        <span className="text-xs text-forest/40 ml-0.5">/{goal}{unit}</span>
      </div>
      <div className="mt-2 h-1.5 bg-forest/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-[10px] text-forest/40 mt-1">{pct.toFixed(0)}% of daily</div>
    </div>
  );
}

// ===== Shopping placeholder =====
function ShoppingPlaceholder({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <div className="bg-white rounded-3xl border border-forest/8 p-8 sm:p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream/60 flex items-center justify-center mx-auto mb-4">
        <ShoppingBasket className="h-8 w-8 text-forest/40" strokeWidth={1.6} />
      </div>
      <h3 className="font-heading text-xl font-bold text-forest mb-2">
        {t("scanner.mode.shopping")}
      </h3>
      <p className="text-sm text-forest/60 max-w-md mx-auto mb-6">
        {t("scanner.comingSoon")}. This feature will let you photograph groceries, set a budget,
        and get a personalized shopping list powered by AI.
      </p>
      <Button onClick={onBack} variant="outline" className="rounded-full">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        {t("common.back")}
      </Button>
    </div>
  );
}
