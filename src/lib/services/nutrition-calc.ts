import { BANGLADESH_FOOD_CATALOG, FoodItemDefinition } from "./bangladesh-food-db";

export interface BasketMacroSummary {
  basketCalories: number;
  basketProtein: number; // grams
  basketCarbs: number;   // grams
  basketFat: number;     // grams
  basketFiber: number;   // grams
  
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  
  durationDays: number;
  hasEstimatedData: boolean;
  label: string;
}

export interface BasketItemInput {
  foodId: string;
  quantity: number; // e.g. 2 (kg, pcs, etc.)
  customEdibleWeightGrams?: number;
}

/**
 * Converts a standard unit quantity into raw edible grams,
 * deducting inedible portions (bones, shells, peel, refuse).
 */
export function calculateRawEdibleGrams(
  food: FoodItemDefinition,
  quantity: number
): number {
  let grossGrams = 0;
  if (food.standardUnit === "kg") {
    grossGrams = quantity * 1000;
  } else if (food.standardUnit === "litre") {
    // 1 litre cow milk ~ 1030g, mustard oil ~ 920g; default ~1000g
    grossGrams = quantity * 1000;
  } else if (food.standardUnit === "pcs") {
    if (food.id.startsWith("eggs_")) {
      grossGrams = quantity * 55; // 1 medium egg ~55g gross
    } else if (food.id.startsWith("fruit_banana")) {
      grossGrams = quantity * 120; // 1 banana ~120g gross
    } else if (food.id.startsWith("veg_lau")) {
      grossGrams = quantity * 1400; // 1 medium bottle gourd ~1.4kg
    } else {
      grossGrams = quantity * 100;
    }
  } else if (food.standardUnit === "bunch") {
    // Shak bunch ~250g-300g gross
    grossGrams = quantity * 280;
  } else {
    grossGrams = quantity * 1000;
  }

  // Multiply by edible portion yield factor (0.0 to 1.0)
  const edibleGrams = grossGrams * food.edibleYield;
  return Math.round(edibleGrams);
}

/**
 * Aggregates the nutritional values of all items in the grocery basket,
 * computing total basket macros and estimated daily averages.
 */
export function calculateBasketNutrition(
  items: { foodId: string; quantity: number }[],
  durationDays: number
): BasketMacroSummary {
  const days = Math.max(1, durationDays || 7);
  let totalCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let hasEstimated = false;

  const catalogMap = new Map<string, FoodItemDefinition>(
    BANGLADESH_FOOD_CATALOG.map((f) => [f.id, f])
  );

  for (const item of items) {
    const food = catalogMap.get(item.foodId);
    if (!food) {
      hasEstimated = true;
      continue;
    }
    if (food.isFallbackEstimate) {
      hasEstimated = true;
    }

    const edibleGrams = calculateRawEdibleGrams(food, item.quantity);
    const factor = edibleGrams / 100;

    totalCal += food.caloriesPer100g * factor;
    totalProtein += food.proteinPer100g * factor;
    totalCarbs += food.carbsPer100g * factor;
    totalFat += food.fatPer100g * factor;
    totalFiber += food.fiberPer100g * factor;
  }

  return {
    basketCalories: Math.round(totalCal),
    basketProtein: Math.round(totalProtein),
    basketCarbs: Math.round(totalCarbs),
    basketFat: Math.round(totalFat),
    basketFiber: Math.round(totalFiber),

    dailyCalories: Math.round(totalCal / days),
    dailyProtein: Math.round(totalProtein / days),
    dailyCarbs: Math.round(totalCarbs / days),
    dailyFat: Math.round(totalFat / days),
    dailyFiber: Math.round(totalFiber / days),

    durationDays: days,
    hasEstimatedData: hasEstimated,
    label: "Estimated Daily Average (Raw edible portion basis)",
  };
}

/**
 * Calculates user baseline targets for comparison using Mifflin-St Jeor
 */
export function calculateUserProfileTargets(profile: {
  gender?: string;
  age?: number;
  height?: number; // cm
  currentWeight?: number; // kg
  activityLevel?: string;
  goalType?: string;
}) {
  const gender = profile.gender || "male";
  const age = profile.age || 26;
  const height = profile.height || 172;
  const weight = profile.currentWeight || 68;
  const activity = profile.activityLevel || "moderate";

  // Mifflin-St Jeor BMR
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr = gender === "female" ? bmr - 161 : bmr + 5;

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extreme: 1.9,
  };
  const tdee = Math.round(bmr * (multipliers[activity] || 1.45));

  let calorieTarget = tdee;
  const goal = (profile.goalType || "").toLowerCase();
  if (goal.includes("loss") || goal.includes("cut") || goal.includes("fat")) {
    calorieTarget = Math.max(1200, tdee - 450);
  } else if (goal.includes("gain") || goal.includes("muscle") || goal.includes("bulk")) {
    calorieTarget = tdee + 350;
  }

  const targetProtein = Math.round(weight * 1.8); // 1.8g/kg
  const targetFat = Math.round((calorieTarget * 0.25) / 9);
  const targetCarbs = Math.max(100, Math.round((calorieTarget - (targetProtein * 4 + targetFat * 9)) / 4));

  return {
    targetCalories: calorieTarget,
    targetProtein,
    targetCarbs,
    targetFat,
  };
}
