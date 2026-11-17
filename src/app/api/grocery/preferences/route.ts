import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo_user";

    const pref = await db.userFoodPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      return NextResponse.json({
        success: true,
        preferences: {
          allergies: [],
          intolerances: [],
          dietaryRestrictions: ["halal"],
          dislikedFoods: [],
          defaultBudgetMode: "max",
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        allergies: JSON.parse(pref.allergies || "[]"),
        intolerances: JSON.parse(pref.intolerances || "[]"),
        dietaryRestrictions: JSON.parse(pref.dietaryRestrictions || "[\"halal\"]"),
        dislikedFoods: JSON.parse(pref.dislikedFoods || "[]"),
        defaultBudgetMode: pref.defaultBudgetMode || "max",
      },
    });
  } catch (err) {
    console.error("[api/grocery/preferences GET] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "demo_user",
      allergies = [],
      intolerances = [],
      dietaryRestrictions = ["halal"],
      dislikedFoods = [],
      defaultBudgetMode = "max",
    } = body;

    const upserted = await db.userFoodPreference.upsert({
      where: { userId },
      create: {
        userId,
        allergies: JSON.stringify(allergies),
        intolerances: JSON.stringify(intolerances),
        dietaryRestrictions: JSON.stringify(dietaryRestrictions),
        dislikedFoods: JSON.stringify(dislikedFoods),
        defaultBudgetMode,
      },
      update: {
        allergies: JSON.stringify(allergies),
        intolerances: JSON.stringify(intolerances),
        dietaryRestrictions: JSON.stringify(dietaryRestrictions),
        dislikedFoods: JSON.stringify(dislikedFoods),
        defaultBudgetMode,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        allergies: JSON.parse(upserted.allergies),
        intolerances: JSON.parse(upserted.intolerances),
        dietaryRestrictions: JSON.parse(upserted.dietaryRestrictions),
        dislikedFoods: JSON.parse(upserted.dislikedFoods),
        defaultBudgetMode: upserted.defaultBudgetMode,
      },
    });
  } catch (err) {
    console.error("[api/grocery/preferences PUT] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
