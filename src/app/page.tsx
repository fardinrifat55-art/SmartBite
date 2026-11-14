"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { LandingScreen } from "@/components/landing/LandingScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { FoodDiaryScreen } from "@/components/fooddiary/FoodDiaryScreen";
import { ScannerScreen } from "@/components/scanner/ScannerScreen";
import { ShoppingScreen } from "@/components/shopping/ShoppingScreen";
import { MealPlannerScreen } from "@/components/mealplanner/MealPlannerScreen";
import { AnalyticsScreen } from "@/components/analytics/AnalyticsScreen";
import { SettingsScreen } from "@/components/settings/SettingsScreen";

/** easeInOut — a smooth symmetric curve for the watery crossfade between
 *  screens. Both the outgoing and incoming sides ease in and out together,
 *  so the two layers dissolve through each other instead of hitting an
 *  opaque-to-opaque hard midpoint. */
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

export default function Home() {
  const view = useAppStore((s) => s.view);
  const isAuthed = useAppStore((s) => s.isAuthed);
  const onboardingProfile = useAppStore((s) => s.onboardingProfile);
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand persist to rehydrate from localStorage.
  // We intentionally defer the first client render by one tick so the
  // persisted store state is available before we pick a view, avoiding
  // an SSR/client mismatch flash.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Guard rails: if trying to access protected views without auth, redirect
  useEffect(() => {
    if (!hydrated) return;
    const protectedViews = ["dashboard", "foodDiary", "scanner", "shopping", "mealPlanner", "analytics", "settings", "onboarding"];
    if (protectedViews.includes(view) && !isAuthed) {
      useAppStore.getState().setView("signin");
    }
    // If authed but on landing/signin/signup and already has profile, send to dashboard
    if (
      isAuthed &&
      onboardingProfile &&
      (view === "landing" || view === "signin" || view === "signup")
    ) {
      useAppStore.getState().setView("dashboard");
    }
  }, [hydrated, view, isAuthed, onboardingProfile]);

  // Show a minimal loader during initial hydration to avoid mismatch
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-3 border-forest/15 border-t-lime animate-spin" />
      </div>
    );
  }

  let screen: React.ReactNode;
  switch (view) {
    case "landing":
      screen = <LandingScreen />;
      break;
    case "signin":
    case "signup":
      screen = <AuthScreen />;
      break;
    case "onboarding":
      screen = <OnboardingScreen />;
      break;
    case "dashboard":
      screen = <DashboardScreen />;
      break;
    case "foodDiary":
      screen = <FoodDiaryScreen />;
      break;
    case "scanner":
      screen = <ScannerScreen />;
      break;
    case "shopping":
      screen = <ShoppingScreen />;
      break;
    case "mealPlanner":
      screen = <MealPlannerScreen />;
      break;
    case "analytics":
      screen = <AnalyticsScreen />;
      break;
    case "settings":
      screen = <SettingsScreen />;
      break;
    default:
      screen = <LandingScreen />;
  }

  // Watery crossfade between screens. `mode="popLayout"` pops the outgoing
  // screen out of normal flow (absolute, held at its last position) so the
  // incoming screen can overlap it, and both animate at once — a smooth
  // dissolve with a gentle scale, no hard cut and no blank gap in the
  // middle. `initial={false}` keeps the very first load instant.
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={view}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.01 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="min-h-screen lg:h-screen"
      >
        {screen}
      </motion.div>
    </AnimatePresence>
  );
}
