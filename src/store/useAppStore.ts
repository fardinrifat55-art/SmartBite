"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";
import type {
  Gender,
  ActivityLevel,
  GoalType,
  NutritionTargets,
} from "@/lib/nutrition";
import { calculateTargets } from "@/lib/nutrition";
import type {
  FoodItem,
  DailyTask,
  Reminder,
} from "@/lib/sample-data";
import {
  SAMPLE_FOOD_DIARY,
  SAMPLE_TASKS,
  SAMPLE_REMINDERS,
  DEMO_PROFILE,
  DEMO_EMAIL,
  uid,
} from "@/lib/sample-data";

export type View =
  | "landing"
  | "signin"
  | "signup"
  | "onboarding"
  | "dashboard"
  | "foodDiary"
  | "scanner"
  | "shopping"
  | "mealPlanner"
  | "analytics"
  | "settings";

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface OnboardingProfile {
  gender: Gender;
  age: number;
  height: number; // cm
  currentWeight: number; // kg
  goalWeight: number; // kg
  activityLevel: ActivityLevel;
  goal: GoalType;
}

export interface AppState {
  // Navigation
  view: View;
  setView: (v: View) => void;

  // Language
  lang: Lang;
  setLang: (l: Lang) => void;

  // Auth
  user: User | null;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => void;

  // Onboarding
  onboardingStep: number; // 0-7 (8 steps), 8 = final summary
  onboardingProfile: OnboardingProfile | null;
  targets: NutritionTargets | null;
  setOnboardingStep: (n: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateOnboardingProfile: (p: Partial<OnboardingProfile>) => void;
  calculateAndSetTargets: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Dashboard data
  foodDiary: FoodItem[];
  tasks: DailyTask[];
  reminders: Reminder[];
  streak: number;
  weeklyActivity: { day: string; dayBn: string; value: number }[];

  // Food diary actions
  addFood: (food: FoodItem) => void;
  removeFood: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleReminder: (id: string) => void;

  // Computed getters
  getConsumedCalories: () => number;
  getConsumedProtein: () => number;
  getConsumedCarbs: () => number;
  getConsumedFat: () => number;

  // Vision-to-Market Staging
  stagedVisionItems: string[] | null;
  stagedDietaryPivot: any | null;
  setStagedVisionItems: (items: string[]) => void;
  setStagedDietaryPivot: (pivot: any) => void;
  clearStagedVision: () => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

const initialTargets = calculateTargets({
  gender: DEMO_PROFILE.gender,
  age: DEMO_PROFILE.age,
  height: DEMO_PROFILE.height,
  currentWeight: DEMO_PROFILE.currentWeight,
  goalWeight: DEMO_PROFILE.goalWeight,
  activityLevel: DEMO_PROFILE.activityLevel,
  goal: DEMO_PROFILE.goal,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      view: "landing",
      setView: (v) => set({ view: v }),

      // Language
      lang: "en",
      setLang: (l) => set({ lang: l }),

      // Auth
      user: null,
      isAuthed: false,
      signIn: async (email) => {
        const name = email.split("@")[0].replace(/[._-]/g, " ");
        const capitalizedName = name
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        const profile = get().onboardingProfile ?? {
          gender: DEMO_PROFILE.gender,
          age: DEMO_PROFILE.age,
          height: DEMO_PROFILE.height,
          currentWeight: DEMO_PROFILE.currentWeight,
          goalWeight: DEMO_PROFILE.goalWeight,
          activityLevel: DEMO_PROFILE.activityLevel,
          goal: DEMO_PROFILE.goal,
        };
        const targets = get().targets ?? calculateTargets(profile);
        set({
          user: {
            id: uid(),
            fullName: capitalizedName || DEMO_PROFILE.fullName,
            email,
            createdAt: new Date().toISOString(),
          },
          isAuthed: true,
          onboardingProfile: profile,
          targets,
          view: "dashboard",
        });
      },
      signUp: async (name, email) => {
        const profile = get().onboardingProfile ?? {
          gender: DEMO_PROFILE.gender,
          age: DEMO_PROFILE.age,
          height: DEMO_PROFILE.height,
          currentWeight: DEMO_PROFILE.currentWeight,
          goalWeight: DEMO_PROFILE.goalWeight,
          activityLevel: DEMO_PROFILE.activityLevel,
          goal: DEMO_PROFILE.goal,
        };
        const targets = get().targets ?? calculateTargets(profile);
        set({
          user: {
            id: uid(),
            fullName: name,
            email,
            createdAt: new Date().toISOString(),
          },
          isAuthed: true,
          onboardingProfile: profile,
          targets,
          view: "dashboard",
        });
      },
      signInDemo: async () => {
        // Demo account: complete profile + targets + pre-populated food diary
        const demoProfile: OnboardingProfile = {
          gender: DEMO_PROFILE.gender,
          age: DEMO_PROFILE.age,
          height: DEMO_PROFILE.height,
          currentWeight: DEMO_PROFILE.currentWeight,
          goalWeight: DEMO_PROFILE.goalWeight,
          activityLevel: DEMO_PROFILE.activityLevel,
          goal: DEMO_PROFILE.goal,
        };
        const demoTargets = { ...calculateTargets(demoProfile), protein: 254 };
        set({
          user: {
            id: uid(),
            fullName: DEMO_PROFILE.fullName,
            email: DEMO_EMAIL,
            createdAt: new Date().toISOString(),
          },
          isAuthed: true,
          onboardingProfile: demoProfile,
          targets: demoTargets,
          foodDiary: SAMPLE_FOOD_DIARY,
          tasks: SAMPLE_TASKS,
          reminders: SAMPLE_REMINDERS,
          streak: 7,
          view: "dashboard",
        });
      },
      signOut: () => {
        set({
          user: null,
          isAuthed: false,
          view: "landing",
          onboardingProfile: null,
          targets: initialTargets,
          onboardingStep: 0,
        });
      },

      // Onboarding
      onboardingStep: 0,
      onboardingProfile: null,
      targets: initialTargets,
      setOnboardingStep: (n) => set({ onboardingStep: n }),
      nextStep: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),
      prevStep: () =>
        set((s) => ({ onboardingStep: Math.max(0, s.onboardingStep - 1) })),
      updateOnboardingProfile: (p) =>
        set((s) => ({
          onboardingProfile: {
            ...(s.onboardingProfile ?? {
              gender: "male",
              age: 25,
              height: 170,
              currentWeight: 70,
              goalWeight: 70,
              activityLevel: "moderate",
              goal: "overall",
            }),
            ...p,
          } as OnboardingProfile,
        })),
      calculateAndSetTargets: () => {
        const profile = get().onboardingProfile;
        if (!profile) return;
        const t = calculateTargets(profile);
        set({ targets: t });
      },
      completeOnboarding: () => {
        get().calculateAndSetTargets();
        set({
          view: "dashboard",
          foodDiary: SAMPLE_FOOD_DIARY,
          tasks: SAMPLE_TASKS,
          reminders: SAMPLE_REMINDERS,
          streak: 7,
        });
      },
      resetOnboarding: () =>
        set({ onboardingStep: 0, onboardingProfile: null }),

      // Dashboard data
      foodDiary: SAMPLE_FOOD_DIARY,
      tasks: SAMPLE_TASKS,
      reminders: SAMPLE_REMINDERS,
      streak: 7,
      weeklyActivity: [
        { day: "Mon", dayBn: "সোম", value: 82 },
        { day: "Tue", dayBn: "মঙ্গল", value: 95 },
        { day: "Wed", dayBn: "বুধ", value: 70 },
        { day: "Thu", dayBn: "বৃহ", value: 100 },
        { day: "Fri", dayBn: "শুক্র", value: 88 },
        { day: "Sat", dayBn: "শনি", value: 92 },
        { day: "Sun", dayBn: "রবি", value: 63 },
      ],

      // Actions
      addFood: (food) => set((s) => ({ foodDiary: [...s.foodDiary, food] })),
      removeFood: (id) =>
        set((s) => ({ foodDiary: s.foodDiary.filter((f) => f.id !== id) })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      toggleReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),

      // Computed
      getConsumedCalories: () =>
        get().foodDiary.reduce((sum, f) => sum + f.calories, 0),
      getConsumedProtein: () =>
        get().foodDiary.reduce((sum, f) => sum + f.protein, 0),
      getConsumedCarbs: () =>
        get().foodDiary.reduce((sum, f) => sum + f.carbs, 0),
      getConsumedFat: () => get().foodDiary.reduce((sum, f) => sum + f.fat, 0),

      // Vision-to-Market Staging
      stagedVisionItems: null,
      stagedDietaryPivot: null,
      setStagedVisionItems: (items) => set({ stagedVisionItems: items }),
      setStagedDietaryPivot: (pivot) => set({ stagedDietaryPivot: pivot }),
      clearStagedVision: () => set({ stagedVisionItems: null, stagedDietaryPivot: null }),

      // Theme
      theme: "light",
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: "smartbite-store",
      partialize: (state) => ({
        lang: state.lang,
        user: state.user,
        isAuthed: state.isAuthed,
        onboardingProfile: state.onboardingProfile,
        targets: state.targets,
        foodDiary: state.foodDiary,
        tasks: state.tasks,
        reminders: state.reminders,
        streak: state.streak,
        theme: state.theme,
      }),
    }
  )
);
