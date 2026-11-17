import { NextRequest, NextResponse } from "next/server";
import { ragNutritionService } from "@/lib/services/rag-nutrition";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mealName = "Scanned Meal",
      ingredients = [],
      userGoal = "Healthy energy and blood sugar control",
      metabolicCondition = "General metabolic optimization",
      isMenuScan = false,
      allergies = [],
    } = body;

    // Cross-reference Open Food Facts for real-world verified data
    const externalFacts = await ragNutritionService.queryOpenFoodFacts(mealName);

    const pivot = ragNutritionService.generateDietaryPivot({
      mealName: String(mealName),
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      userGoal: String(userGoal),
      metabolicCondition: String(metabolicCondition),
      isMenuScan: Boolean(isMenuScan),
      allergies: Array.isArray(allergies) ? allergies : [],
    });

    return NextResponse.json({
      success: true,
      pivot,
      externalFacts,
    });
  } catch (err) {
    console.error("[api/dietary-pivot] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to generate dietary pivot",
      },
      { status: 500 }
    );
  }
}
