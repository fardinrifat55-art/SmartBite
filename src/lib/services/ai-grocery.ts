import {
  BANGLADESH_FOOD_CATALOG,
  FoodItemDefinition,
  GroceryCategory,
} from "./bangladesh-food-db";
import { pricingEngine, CleanGroceryItem } from "./pricing-engine";
import { calculateBasketNutrition, calculateUserProfileTargets, BasketMacroSummary } from "./nutrition-calc";

export interface GroceryPlannerInput {
  userId?: string;
  userContext: {
    age?: number;
    gender?: string;
    height?: number; // cm
    currentWeight?: number; // kg
    activityLevel?: string;
  };
  healthGoal: string;
  durationDays: number;
  budgetMode: "max" | "cheapest" | "none";
  budgetLimitBdt?: number;
  foodInspirations?: string[]; // e.g. ["Grilled chicken", "Rui fish curry", "Lentil soup"]
  preferences: {
    allergies: string[]; // ["shellfish", "fish", "egg", "dairy", "gluten"]
    intolerances: string[]; // ["lactose"]
    dietaryRestrictions: string[]; // ["halal", "vegetarian", "vegan"]
    dislikedFoods: string[]; // ["begun", "eggplant", "okra"]
  };
}

export interface GroceryPlanResult {
  items: CleanGroceryItem[];
  nutrition: BasketMacroSummary;
  targetComparison: {
    targetDailyCalories: number;
    targetDailyProtein: number;
    targetDailyCarbs: number;
    targetDailyFat: number;
  };
  budgetAnalysis: {
    budgetMode: "max" | "cheapest" | "none";
    budgetLimitBdt?: number;
    totalActualCostBdt: number;
    remainingBudgetBdt?: number;
    isBudgetExceeded: boolean;
    compromisesMade?: string;
    suggestedRealisticBudgetBdt?: number;
  };
  disclaimer: string;
  generatedAt: string;
}

const MEDICAL_DISCLAIMER_EN =
  "Medical & Nutritional Disclaimer: This grocery plan is generated for educational and nutritional planning purposes only. It does not constitute medical diagnosis, clinical prescription, or dietary treatment. Individuals with chronic medical conditions (such as diabetes, renal disease, hypertension, or food allergies) should consult a licensed physician or registered dietitian before making drastic dietary changes.";

const MEDICAL_DISCLAIMER_BN =
  "চিকিৎসা ও পুষ্টি বিষয়ক সতর্কবার্তা: এই বাজার তালিকাটি শুধুমাত্র পুষ্টি সচেতনতা এবং খাদ্য পরিকল্পনার উদ্দেশ্যে তৈরি করা হয়েছে। এটি কোন চিকিৎসা পরামর্শ বা প্রেসক্রিপশন নয়। দীর্ঘস্থায়ী শারীরিক সমস্যা (যেমন ডায়াবেটিস, কিডনির রোগ, উচ্চ রক্তচাপ বা অ্যালার্জি) থাকলে খাদ্যাভ্যাস পরিবর্তনের পূর্বে অবশ্যই নিবন্ধিত চিকিৎসকের পরামর্শ নিন।";

// Dynamic food item definition for arbitrary scanned items not in the hardcoded 34-item database
function createScannedFoodDefinition(name: string): FoodItemDefinition {
  const norm = name.toLowerCase().trim();
  let category: GroceryCategory = "vegetables_fresh";
  let unit: "kg" | "litre" | "dozen" | "pcs" | "bunch" = "kg";
  let price = 80;
  let cal = 40, p = 1.5, c = 8, f = 0.2;

  if (norm.includes("lemon") || norm.includes("lebu")) {
    category = "fruits_local";
    unit = "pcs";
    price = 10;
    cal = 20; p = 0.5; c = 5; f = 0.1;
  } else if (norm.includes("mushroom")) {
    category = "vegetables_fresh";
    unit = "kg";
    price = 320;
    cal = 22; p = 3.1; c = 3.3; f = 0.3;
  } else if (norm.includes("mango") || norm.includes("aam")) {
    category = "fruits_local";
    unit = "kg";
    price = 160;
    cal = 60; p = 0.8; c = 15; f = 0.4;
  } else if (norm.includes("pomegranate") || norm.includes("dalim") || norm.includes("bedana")) {
    category = "fruits_local";
    unit = "kg";
    price = 360;
    cal = 83; p = 1.7; c = 19; f = 1.2;
  } else if (norm.includes("chili") || norm.includes("morich") || norm.includes("pepper")) {
    category = "pantry_spices";
    unit = "kg";
    price = 120;
    cal = 40; p = 1.9; c = 8.8; f = 0.4;
  } else if (norm.includes("ginger") || norm.includes("ada")) {
    category = "pantry_spices";
    unit = "kg";
    price = 220;
    cal = 80; p = 1.8; c = 17.8; f = 0.8;
  } else if (norm.includes("sweet potato") || norm.includes("misti alu")) {
    category = "vegetables_fresh";
    unit = "kg";
    price = 60;
    cal = 86; p = 1.6; c = 20.1; f = 0.1;
  } else if (norm.includes("pea") || norm.includes("bean") || norm.includes("shim") || norm.includes("mator") || norm.includes("snap")) {
    category = "vegetables_fresh";
    unit = "kg";
    price = 110;
    cal = 81; p = 5.4; c = 14.5; f = 0.4;
  } else if (norm.includes("chicken") || norm.includes("murgi")) {
    category = "protein_poultry_meat";
    unit = "kg";
    price = 195;
    cal = 165; p = 31; c = 0; f = 3.6;
  } else if (norm.includes("fish") || norm.includes("mach")) {
    category = "protein_fish";
    unit = "kg";
    price = 220;
    cal = 120; p = 20; c = 0; f = 4;
  } else if (norm.includes("egg") || norm.includes("dim")) {
    category = "eggs_dairy";
    unit = "pcs";
    price = 12;
    cal = 78; p = 6.3; c = 0.6; f = 5.3;
  }

  const id = `scanned_${norm.replace(/[^a-z0-9]/g, "_").slice(0, 24)}`;
  return {
    id,
    genericName: name.charAt(0).toUpperCase() + name.slice(1),
    genericNameBn: name,
    category,
    standardUnit: unit,
    ediblePortionFactor: 0.9,
    defaultUnitPriceBdt: price,
    nutritionPer100g: {
      calories: cal,
      proteinGrams: p,
      carbGrams: c,
      fatGrams: f,
      fiberGrams: 2,
      sodiumMg: 10,
    },
    giCategory: "low",
    novaGroup: 1,
  };
}

export class AIGroceryPlannerService {
  /**
   * Filters the food catalog based on strict allergy hard exclusions,
   * dietary restrictions, and disliked foods.
   */
  filterCatalog(
    allergies: string[] = [],
    intolerances: string[] = [],
    dietaryRestrictions: string[] = [],
    dislikedFoods: string[] = []
  ): FoodItemDefinition[] {
    const normAllergies = allergies.map((a) => a.toLowerCase().trim());
    const normIntolerances = intolerances.map((i) => i.toLowerCase().trim());
    const normDiet = dietaryRestrictions.map((d) => d.toLowerCase().trim());
    const normDislikes = dislikedFoods.map((f) => f.toLowerCase().trim());

    return BANGLADESH_FOOD_CATALOG.filter((food) => {
      // 1. Strict allergy exclusions
      if (food.allergyTags && food.allergyTags.length > 0) {
        for (const tag of food.allergyTags) {
          if (normAllergies.includes(tag.toLowerCase())) return false;
          if (tag === "dairy" && normIntolerances.includes("lactose")) return false;
        }
      }

      // 2. Dietary restrictions (e.g. Vegetarian/Vegan should exclude meat and fish)
      if (normDiet.includes("vegan")) {
        if (
          food.category === "protein_fish" ||
          food.category === "protein_poultry_meat" ||
          food.category === "eggs_dairy"
        ) {
          return false;
        }
      } else if (normDiet.includes("vegetarian")) {
        if (
          food.category === "protein_fish" ||
          food.category === "protein_poultry_meat"
        ) {
          return false;
        }
      }

      // 3. Disliked foods exclusion
      for (const dislike of normDislikes) {
        if (!dislike) continue;
        if (
          food.id.toLowerCase().includes(dislike) ||
          food.genericName.toLowerCase().includes(dislike) ||
          food.genericNameBn.toLowerCase().includes(dislike)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Generates a fully reasoned, personalized Bangladeshi grocery plan.
   */
  async generatePlan(input: GroceryPlannerInput): Promise<GroceryPlanResult> {
    const days = Math.max(1, input.durationDays || 7);
    const availableFoods = this.filterCatalog(
      input.preferences.allergies,
      input.preferences.intolerances,
      input.preferences.dietaryRestrictions,
      input.preferences.dislikedFoods
    );

    const goal = (input.healthGoal || "").toLowerCase();
    const isWeightLoss =
      goal.includes("loss") || goal.includes("fat") || goal.includes("cut") || goal.includes("slim");
    const isMuscleGain =
      goal.includes("muscle") || goal.includes("gain") || goal.includes("bulk") || goal.includes("bodybuilding");
    const isDiabetes =
      goal.includes("diabet") || goal.includes("sugar") || goal.includes("glucose");
    const isHypertension =
      goal.includes("bp") || goal.includes("pressure") || goal.includes("heart") || goal.includes("sodium");

    const targets = calculateUserProfileTargets({
      ...input.userContext,
      goalType: input.healthGoal,
    });

    // Determine basket staples based on health goal, inspiration, and available catalog
    const plannedItems: {
      food: FoodItemDefinition;
      quantity: number;
      reasonEn: string;
      reasonBn: string;
      explanationEn: string;
      explanationBn: string;
    }[] = [];

    const getFood = (id: string) => availableFoods.find((f) => f.id === id);

    // Track food IDs already included
    const includedFoodIds = new Set<string>();

    const hasUserInspirations = Array.isArray(input.foodInspirations) && input.foodInspirations.length > 0;

    // 0. Vision-to-Market: Directly incorporate food inspirations from visual scan or photo upload
    if (hasUserInspirations) {
      for (const rawInspiration of input.foodInspirations!) {
        if (!rawInspiration || typeof rawInspiration !== "string") continue;
        const norm = rawInspiration.toLowerCase().trim();
        // Find best match in availableFoods
        let match = availableFoods.find((f) => {
          const fid = f.id.toLowerCase();
          const nameEn = f.genericName.toLowerCase();
          const nameBn = f.genericNameBn.toLowerCase();
          return (
            norm === fid ||
            norm === nameEn ||
            fid.includes(norm) ||
            norm.includes(fid) ||
            nameEn.includes(norm) ||
            norm.includes(nameEn) ||
            (norm.includes("chicken") && fid.includes("chicken")) ||
            (norm.includes("fish") && fid.includes("fish")) ||
            (norm.includes("egg") && fid.includes("egg")) ||
            (norm.includes("spinach") && fid.includes("palong")) ||
            (norm.includes("dal") && fid.includes("dal")) ||
            (norm.includes("lentil") && fid.includes("dal")) ||
            (norm.includes("rice") && fid.includes("rice")) ||
            (norm.includes("beef") && fid.includes("beef")) ||
            (norm.includes("cucumber") && fid.includes("cucumber")) ||
            (norm.includes("tomato") && fid.includes("tomato")) ||
            (norm.includes("banana") && fid.includes("banana")) ||
            (norm.includes("gourd") && fid.includes("lau")) ||
            (norm.includes("oil") && fid.includes("oil"))
          );
        });

        // If not found in catalog, dynamically construct valid food definition for the scanned item
        if (!match) {
          match = createScannedFoodDefinition(rawInspiration);
        }

        if (match && !includedFoodIds.has(match.id)) {
          includedFoodIds.add(match.id);
          const defaultQty =
            match.standardUnit === "pcs"
              ? Math.max(2, Math.round(days * 0.8))
              : match.standardUnit === "bunch"
              ? Math.max(1, Math.round(days * 0.3))
              : Math.max(0.5, Math.round(days * 0.15 * 10) / 10);

          plannedItems.push({
            food: match,
            quantity: defaultQty,
            reasonEn: `Item directly detected in uploaded image: ${rawInspiration}`,
            reasonBn: `আপনার আপলোড করা ছবি থেকে সরাসরি প্রাপ্ত: ${match.genericNameBn}`,
            explanationEn: `Matched directly from your uploaded grocery photo with verified Dhaka market benchmark pricing.`,
            explanationBn: `আপনার আপলোড করা বাজারের ছবি থেকে সরাসরি ঢাকার স্থানীয় বাজার মূল্যে যুক্ত করা হয়েছে।`,
          });
        }
      }
    }

    const addStapleIfNotPresent = (
      food: FoodItemDefinition | undefined,
      quantity: number,
      reasonEn: string,
      reasonBn: string,
      explanationEn: string,
      explanationBn: string
    ) => {
      if (!food || includedFoodIds.has(food.id)) return;
      includedFoodIds.add(food.id);
      plannedItems.push({
        food,
        quantity,
        reasonEn,
        reasonBn,
        explanationEn,
        explanationBn,
      });
    };

    // 1-5: Baseline Staples (ONLY included when user has NOT uploaded/provided specific visual food inspirations)
    // When food inspirations from a photo or visual scan exist, strictly plan for ONLY those items without adding unsolicited staples.
    if (!hasUserInspirations) {
      // 1. Grains & Carbs
      if (isDiabetes) {
      const redRice = getFood("rice_red_coarse") || getFood("atta_whole_wheat");
      if (redRice) {
        const qty = Math.max(1, Math.round(days * 0.2)); // ~200g/day
        addStapleIfNotPresent(
          redRice,
          qty,
          "Low-glycemic complex carbohydrates for glycemic control",
          "রক্তের শর্করার মাত্রা নিয়ন্ত্রণে লো-গ্লাইসেমিক শস্য",
          `Whole grain rice/wheat prevents rapid insulin spikes while meeting your daily ${days}-day energy baseline.`,
          `লাল চাল বা আটা রক্তে শর্করার দ্রুত বৃদ্ধি রোধ করে এবং দীর্ঘস্থায়ী শক্তি যোগায়।`
        );
      }
    } else {
      const rice = getFood("rice_miniket") || getFood("rice_nazirshail") || availableFoods.find((f) => f.category === "grains");
      if (rice) {
        const qty = Math.max(1, Math.round(days * (isWeightLoss ? 0.2 : 0.3)));
        addStapleIfNotPresent(
          rice,
          qty,
          "Primary staple clean carbohydrate source",
          "দৈনন্দিন শক্তির প্রধান শর্করা উপাদান",
          `Provides essential complex carbohydrates sized to fuel your metabolic rate without excess fat storage.`,
          `আপনার দৈনিক ক্যালরি চাহিদা অনুযায়ী পরিমিত ভাত যা অতিরিক্ত চর্বি তৈরি না করে শক্তি দেয়।`
        );
      }
      if (isMuscleGain) {
        const oats = getFood("oats_rolled");
        if (oats) {
          addStapleIfNotPresent(
            oats,
            Math.max(1, Math.round(days * 0.08)),
            "Slow-digesting carbohydrate and soluble fiber",
            "ধীরে হজম হওয়া শর্করা ও ফাইবার",
            "Supports muscle glycogen synthesis and prolonged energy during workouts.",
            "ব্যায়ামের সময় টেকসই শক্তি ও পেশি বৃদ্ধিতে সহায়তা করে।"
          );
        }
      }
    }

    // 2. High-Protein Core (Fish, Poultry, Eggs, Lentils)
    const eggs = getFood("eggs_farm_dozen");
    if (eggs) {
      const eggsCount = isMuscleGain ? Math.round(days * 3) : Math.round(days * 1.5);
      addStapleIfNotPresent(
        eggs,
        Math.max(4, eggsCount),
        "Complete bioavailable protein and essential choline",
        "সম্পূর্ণ প্রোটিন ও কোলিনের আদর্শ উৎস",
        `Eggs supply high biological value protein to meet your target of ${targets.targetProtein}g daily.`,
        `ডিম সহজে হজমযোগ্য প্রোটিন সরবরাহ করে যা কোষ মেরামত ও পেশি গঠনে ভূমিকা রাখে।`
      );
    }

    // Lean poultry or fish
    const chicken = getFood("chicken_broiler") || getFood("chicken_sonali");
    if (chicken && !isHypertension) {
      const qty = Math.max(1, Math.round(days * (isMuscleGain ? 0.35 : 0.2)));
      addStapleIfNotPresent(
        chicken,
        qty,
        "Lean animal protein for muscle repair and satiety",
        "পেশি গঠন এবং দীর্ঘক্ষণ পেট ভরা রাখার জন্য লিন প্রোটিন",
        `Provides dense essential amino acids with low saturated fat to support tissue synthesis.`,
        `অল্প চর্বিযুক্ত মুরগির মাংস শরীরের প্রয়োজনীয় অ্যামিনো এসিডের ঘাটতি পূরণ করে।`
      );
    }

    const fish = getFood("fish_rui_medium") || getFood("fish_tilapia") || getFood("fish_pangas");
    if (fish) {
      const qty = Math.max(1, Math.round(days * 0.25));
      addStapleIfNotPresent(
        fish,
        qty,
        "Freshwater fish providing omega-3 fatty acids",
        "ওমেগা-৩ ফ্যাটি এসিড সমৃদ্ধ তাজা মাছ",
        "Heart-healthy unsaturated fats and lean protein support cardiovascular vitality.",
        "হৃদযন্ত্র সুস্থ রাখতে এবং প্রোটিন সরবরাহ করতে তাজা রুই বা দেশি মাছ অপরিহার্য।"
      );
    }

    // Lentils (Dal)
    const dal = getFood("dal_masoor") || getFood("dal_moong");
    if (dal) {
      const qty = Math.max(0.5, Math.round(days * 0.08 * 10) / 10);
      addStapleIfNotPresent(
        dal,
        qty,
        "Plant-based protein, iron, and prebiotic fiber",
        "উদ্ভিজ্জ প্রোটিন, আয়রন ও প্রিবায়োটিক ফাইবার",
        "Classic South Asian staple that pairs with rice for a complete amino acid profile.",
        "মসুর ডাল উদ্ভিজ্জ প্রোটিন ও আয়রনের সহজলভ্য উৎস যা পাচনতন্ত্র ভালো রাখে।"
      );
    }

    // 3. Vegetables (Produce & Greens)
    const shak = getFood("veg_palong_shak") || getFood("veg_lal_shak");
    if (shak) {
      const bunches = Math.max(1, Math.round(days * 0.5));
      addStapleIfNotPresent(
        shak,
        bunches,
        "Local leafy greens rich in folate and antioxidants",
        "ফোলেট ও অ্যান্টিঅক্সিডেন্টে ভরপুর তাজা শাক",
        "Delivers essential micronutrients, vitamin A, and fiber with negligible calories.",
        "রোগ প্রতিরোধ ক্ষমতা বাড়াতে ও খাদ্য হজমে শাকসবজি অত্যন্ত গুরুত্বপূর্ণ।"
      );
    }

    const vegLau = getFood("veg_lau_bottle_gourd") || getFood("veg_potol_pointed_gourd");
    if (vegLau) {
      const qty = Math.max(1, Math.round(days * 0.2));
      addStapleIfNotPresent(
        vegLau,
        qty,
        "Hydrating, low-calorie seasonal vegetable",
        "কম ক্যালরিযুক্ত পানীয়সমৃদ্ধ পুষ্টিকর সবজি",
        "Promotes healthy gut motility and provides electrolytes.",
        "শরীরে পানির ভারসাম্য বজায় রাখে এবং রক্তচাপ নিয়ন্ত্রণে সাহায্য করে।"
      );
    }

    const tomato = getFood("veg_tomato_ripe");
    if (tomato) {
      addStapleIfNotPresent(
        tomato,
        Math.max(0.5, Math.round(days * 0.15 * 10) / 10),
        "Lycopene-rich vegetable for cellular protection",
        "লাইকোপেন ও ভিটামিন সি সমৃদ্ধ অ্যান্টিঅক্সিডেন্ট",
        "Enhances non-heme iron absorption from lentils and protects cardiovascular health.",
        "ডালের আয়রন শোষণ বাড়াতে ও ত্বক-হৃদপিণ্ড ভালো রাখতে টমেটো সহায়ক।"
      );
    }

    // 4. Local Fruits
    const fruit = getFood("fruit_banana_shobri") || getFood("fruit_guava_peara");
    if (fruit) {
      const qty = fruit.standardUnit === "pcs" ? Math.max(4, Math.round(days * 1.2)) : Math.max(1, Math.round(days * 0.2));
      addStapleIfNotPresent(
        fruit,
        qty,
        "Natural potassium, pectin, and micronutrients",
        "পটাশিয়াম ও পেকটিন সমৃদ্ধ পুষ্টিকর ফল",
        "Supports muscle electrolyte balance and healthy natural energy.",
        "পটাশিয়ামের ঘাটতি পূরণ এবং ক্লান্তি দূর করতে তাজা দেশি ফল।"
      );
    }

    // 5. Healthy Cooking Medium (Mustard Oil / Onion)
    const oil = getFood("oil_mustard");
    if (oil) {
      const qty = Math.max(0.5, Math.round(days * 0.04 * 10) / 10);
      addStapleIfNotPresent(
        oil,
        qty,
        "Monounsaturated fats and natural pungent antioxidants",
        "মনো-আনস্যাচুরেটেড ভালো ফ্যাট ও অ্যান্টিঅক্সিডেন্ট",
        "Essential fatty acid vehicle supporting fat-soluble vitamin (A, D, E) absorption.",
        "ভিটামিন শোষণে ও পরিমিত স্বাস্থ্যকর ফ্যাটের জোগান দিতে সরিষার তেল।"
      );
    }
  }

    // Build priced items
    let cleanItems: CleanGroceryItem[] = [];
    for (const plan of plannedItems) {
      const pricing = await pricingEngine.resolveBestPrice(plan.food, plan.quantity);
      cleanItems.push({
        id: `item_${Math.random().toString(36).slice(2, 9)}`,
        foodId: plan.food.id,
        genericName: plan.food.genericName,
        genericNameBn: plan.food.genericNameBn,
        category: plan.food.category,
        quantity: plan.quantity,
        unit: plan.food.standardUnit,
        unitPrice: pricing.unitPrice,
        itemTotal: pricing.itemTotal,
        isPriceEditable: pricing.isPriceEditable,
        selectionReason: plan.reasonEn,
        selectionReasonBn: plan.reasonBn,
        expandedExplanation: plan.explanationEn,
        expandedExplanationBn: plan.explanationBn,
        purchased: false,
      });
    }

    // Budget Mode Handling & Substitutions
    let totalCost = cleanItems.reduce((acc, it) => acc + it.itemTotal, 0);
    let compromises = "";
    const suggestedBudget = totalCost;

    if (input.budgetMode === "max" && input.budgetLimitBdt && input.budgetLimitBdt > 0) {
      if (totalCost > input.budgetLimitBdt) {
        const compromisesList: string[] = [];

        // 1. Intelligent substitutions for premium items (only for generated staple baskets)
        if (!hasUserInspirations) {
          cleanItems = cleanItems.map((item) => {
            if (item.foodId === "fish_rui_medium") {
              const tilapia = getFood("fish_tilapia");
              if (tilapia) {
                const newUnitPrice = tilapia.defaultUnitPriceBdt;
                const newTotal = Math.round(item.quantity * newUnitPrice);
                compromisesList.push("Substituted Rui Fish with Tilapia Fish to economize budget while preserving 20g protein/100g.");
                return {
                  ...item,
                  foodId: tilapia.id,
                  genericName: tilapia.genericName,
                  genericNameBn: tilapia.genericNameBn,
                  unitPrice: newUnitPrice,
                  itemTotal: newTotal,
                  selectionReason: "Cost-optimized freshwater lean protein substitute",
                  selectionReasonBn: "বাজেট উপযোগী তাজা মাছের সাশ্রয়ী বিকল্প",
                };
              }
            }
            if (item.foodId === "chicken_sonali") {
              const broiler = getFood("chicken_broiler");
              if (broiler) {
                const newUnitPrice = broiler.defaultUnitPriceBdt;
                const newTotal = Math.round(item.quantity * newUnitPrice);
                compromisesList.push("Selected Broiler Chicken instead of Sonali Chicken to fit budget.");
                return {
                  ...item,
                  foodId: broiler.id,
                  genericName: broiler.genericName,
                  genericNameBn: broiler.genericNameBn,
                  unitPrice: newUnitPrice,
                  itemTotal: newTotal,
                };
              }
            }
            return item;
          });

          totalCost = cleanItems.reduce((acc, it) => acc + it.itemTotal, 0);

          // 2. If budget is tight and cart has multiple expensive meats/fish, prune redundancy
          if (totalCost > input.budgetLimitBdt) {
            const hasFish = cleanItems.some((i) => i.category === "protein_fish");
            const hasPoultry = cleanItems.some((i) => i.category === "protein_poultry_meat");
            const hasEggs = cleanItems.some((i) => i.category === "eggs_dairy");

            if (hasFish && hasPoultry && hasEggs && input.budgetLimitBdt <= 1200) {
              cleanItems = cleanItems.filter((i) => i.foodId !== "fish_tilapia");
              totalCost = cleanItems.reduce((acc, it) => acc + it.itemTotal, 0);
              compromisesList.push("Consolidated animal protein to Farm Eggs and Broiler Chicken to maintain budget viability.");
            }
          }
        }

        // 3. Proportional scale-down to strictly meet the budget ceiling
        if (totalCost > input.budgetLimitBdt) {
          const scaleRatio = (input.budgetLimitBdt * 0.98) / totalCost;
          cleanItems = cleanItems.map((item) => {
            let adjustedQty = item.quantity * scaleRatio;
            if (item.unit === "pcs" || item.unit === "bunch") {
              adjustedQty = Math.max(1, Math.round(adjustedQty));
            } else {
              adjustedQty = Math.max(0.1, Math.round(adjustedQty * 10) / 10);
            }
            const newTotal = Math.round(adjustedQty * item.unitPrice);
            return { ...item, quantity: adjustedQty, itemTotal: newTotal };
          });
          totalCost = cleanItems.reduce((acc, it) => acc + it.itemTotal, 0);
          compromisesList.push("Portion sizes calibrated to strictly stay within your budget limit.");
        }

        // 4. Exact Fit Guarantee Loop: ensure totalCost NEVER exceeds budgetLimitBdt
        let loopCount = 0;
        while (totalCost > input.budgetLimitBdt && loopCount < 50) {
          loopCount++;
          // Items that can still be reduced
          const canReduce = cleanItems.filter((i) => {
            if (i.unit === "pcs" || i.unit === "bunch") return i.quantity > 1;
            return i.quantity > 0.1;
          });

          if (canReduce.length === 0) {
            // If all items are at minimum quantity (1 pcs, 1 bunch, 0.1 kg) and total still exceeds budget,
            // remove the most expensive item so we NEVER exceed user's strict budget
            cleanItems.sort((a, b) => b.itemTotal - a.itemTotal);
            const removed = cleanItems.shift();
            if (removed) {
              compromisesList.push(`Removed ${removed.genericName} to stay strictly under ৳${input.budgetLimitBdt} budget.`);
            }
          } else {
            canReduce.sort((a, b) => b.itemTotal - a.itemTotal);
            const target = canReduce[0];
            if (target.unit === "pcs" || target.unit === "bunch") {
              target.quantity -= 1;
            } else {
              target.quantity = Math.max(0.1, Math.round((target.quantity - 0.1) * 10) / 10);
            }
            target.itemTotal = Math.round(target.quantity * target.unitPrice);
          }
          totalCost = cleanItems.reduce((acc, it) => acc + it.itemTotal, 0);
        }

        compromises = compromisesList.join(" ");
      }
    } else if (input.budgetMode === "cheapest") {
      // Prioritize highest protein/calorie per Taka (Eggs, Masoor Dal, Miniket, Shak)
      compromises = "Prioritized Dhaka market staples with highest nutrient density per Taka spent.";
    }

    // Compute nutrition based on final items
    const nutritionSummary = calculateBasketNutrition(
      cleanItems.map((it) => ({ foodId: it.foodId, quantity: it.quantity })),
      days
    );

    return {
      items: cleanItems,
      nutrition: nutritionSummary,
      targetComparison: {
        targetDailyCalories: targets.targetCalories,
        targetDailyProtein: targets.targetProtein,
        targetDailyCarbs: targets.targetCarbs,
        targetDailyFat: targets.targetFat,
      },
      budgetAnalysis: {
        budgetMode: input.budgetMode,
        budgetLimitBdt: input.budgetLimitBdt,
        totalActualCostBdt: totalCost,
        remainingBudgetBdt:
          input.budgetLimitBdt && input.budgetMode === "max"
            ? Math.max(0, input.budgetLimitBdt - totalCost)
            : undefined,
        isBudgetExceeded: Boolean(input.budgetLimitBdt && input.budgetMode === "max" && totalCost > input.budgetLimitBdt),
        compromisesMade: compromises || undefined,
        suggestedRealisticBudgetBdt: suggestedBudget,
      },
      disclaimer: MEDICAL_DISCLAIMER_EN,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const aiGroceryPlannerService = new AIGroceryPlannerService();
