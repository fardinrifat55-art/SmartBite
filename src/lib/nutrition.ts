// Nutrition calculation utilities for Nutrilen AI
// Uses Mifflin-St Jeor equation for BMR, standard activity multipliers,
// and goal-based adjustments. All values are estimates, not medical advice.

export type Gender = "male" | "female" | "prefer_not_to_say";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "extreme";
export type GoalType =
  | "lose"
  | "maintain"
  | "gain"
  | "muscle"
  | "overall";

export interface UserProfile {
  gender: Gender;
  age: number; // years
  height: number; // cm
  currentWeight: number; // kg
  goalWeight: number; // kg
  activityLevel: ActivityLevel;
  goal: GoalType;
}

export interface NutritionTargets {
  maintenanceCalories: number;
  dailyCalories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  water: number; // liters
}

// Activity multipliers (TDEE = BMR * multiplier)
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

// Calorie adjustment by goal (relative to maintenance)
export const GOAL_ADJUSTMENTS: Record<GoalType, number> = {
  lose: -500, // ~0.5 kg/week deficit
  maintain: 0,
  gain: 400, // ~0.4 kg/week surplus
  muscle: 300, // mild surplus for muscle gain
  overall: -100, // slight deficit for overall health
};

// Macro distribution by goal (percentages of total calories)
export const GOAL_MACROS: Record<
  GoalType,
  { protein: number; carbs: number; fat: number }
> = {
  lose: { protein: 0.4, carbs: 0.35, fat: 0.25 }, // high protein, lower carb
  maintain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  gain: { protein: 0.3, carbs: 0.5, fat: 0.2 }, // higher carb for energy
  muscle: { protein: 0.35, carbs: 0.45, fat: 0.2 }, // high protein + carb
  overall: { protein: 0.3, carbs: 0.4, fat: 0.3 }, // balanced
};

// Mifflin-St Jeor BMR calculation
// Male:   BMR = 10*weight + 6.25*height - 5*age + 5
// Female: BMR = 10*weight + 6.25*height - 5*age - 161
// For "prefer not to say", use average of both (-78 offset midpoint)
export function calculateBMR(profile: UserProfile): number {
  const { weight: weightKg, height: heightCm, age, gender } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  switch (gender) {
    case "male":
      return base + 5;
    case "female":
      return base - 161;
    case "prefer_not_to_say":
      // Use midpoint between male and female averages
      return base - 78;
  }
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  return Math.round(bmr * multiplier);
}

export function calculateTargets(profile: UserProfile): NutritionTargets {
  const tdee = calculateTDEE(profile);
  const adjustment = GOAL_ADJUSTMENTS[profile.goal];
  const dailyCalories = Math.max(1200, Math.round(tdee + adjustment));
  const macros = GOAL_MACROS[profile.goal];

  // 1g protein = 4 kcal, 1g carb = 4 kcal, 1g fat = 9 kcal
  const protein = Math.round((dailyCalories * macros.protein) / 4);
  const carbs = Math.round((dailyCalories * macros.carbs) / 4);
  const fat = Math.round((dailyCalories * macros.fat) / 9);

  // Water: 35 ml per kg body weight, in liters
  const water = Math.round(profile.currentWeight * 0.035 * 10) / 10;

  return {
    maintenanceCalories: tdee,
    dailyCalories,
    protein,
    carbs,
    fat,
    water,
  };
}

// Unit conversion helpers
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54 * 10) / 10;
}

// Format number with thousands separator
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// Currency formatting (BDT)
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}
