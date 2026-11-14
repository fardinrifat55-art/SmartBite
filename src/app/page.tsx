"use client";

import React, { useEffect, useState } from "react";
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

  switch (view) {
    case "landing":
      return <LandingScreen />;
    case "signin":
    case "signup":
      return <AuthScreen />;
    case "onboarding":
      return <OnboardingScreen />;
    case "dashboard":
      return <DashboardScreen />;
    case "foodDiary":
      return <FoodDiaryScreen />;
    case "scanner":
      return <ScannerScreen />;
    case "shopping":
      return <ShoppingScreen />;
    case "mealPlanner":
      return <MealPlannerScreen />;
    case "analytics":
      return <AnalyticsScreen />;
    case "settings":
      return <SettingsScreen />;
    default:
      return <LandingScreen />;
  }
}
