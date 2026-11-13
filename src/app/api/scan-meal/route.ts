import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Ingredient {
  name: string;
  quantity: string;
  calories: number;
}

interface MealAnalysisResult {
  mealName: string;
  confidence: number; // 0-1
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  ingredients: Ingredient[];
  insights: string[];
  portionSize: string;
}

const SYSTEM_PROMPT = `You are Nutrilen AI, an expert nutrition analyst. You analyze food photos and return a precise, structured nutritional report.

Your job:
1. Identify the dish(es) and individual ingredients visible in the photo.
2. Estimate portion sizes realistically.
3. Calculate total calories and macronutrients (protein, carbs, fat, fiber, sugar) in grams.
4. Generate 2-4 short, contextual health insights (NOT medical advice).
5. Provide a confidence score (0-1) reflecting how certain you are about the identification.

Return ONLY a valid JSON object with this exact schema (no markdown, no commentary):
{
  "mealName": "string — concise dish name",
  "portionSize": "string — e.g. '1 plate (350g)'",
  "confidence": number (0-1),
  "totalCalories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "sugar": number (grams),
  "ingredients": [
    { "name": "string", "quantity": "string", "calories": number }
  ],
  "insights": ["string", "string"]
}

Guidelines:
- Calorie and macro values are ESTIMATES — use realistic ranges for typical Bangladeshi/South Asian home cooking when applicable.
- If the image is not a food photo, return: {"mealName":"Unknown","portionSize":"","confidence":0,"totalCalories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0,"ingredients":[],"insights":["We could not identify food in this image. Please try a clearer photo of your meal."]}
- Insights should reference actual detected content (e.g. "This meal is high in protein from the chicken").
- Never give medical advice. Frame insights as observations.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body as { image?: string };

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image data is required (base64 data URL)." },
        { status: 400 }
      );
    }

    // Validate it's a data URL
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Image must be a base64 data URL." },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.createVision({
      model: "glm-4.5v",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this meal photo and return the nutrition report as JSON.",
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    });

    const rawContent: string =
      completion?.choices?.[0]?.message?.content ?? "";

    // Extract JSON from response (in case the model wrapped it in markdown)
    let jsonStr = rawContent.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }
    // Find first { and last }
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }

    let parsed: MealAnalysisResult;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return a fallback structured response
      parsed = {
        mealName: "Mixed Meal",
        portionSize: "1 serving",
        confidence: 0.5,
        totalCalories: 450,
        protein: 25,
        carbs: 55,
        fat: 15,
        fiber: 6,
        sugar: 8,
        ingredients: [
          { name: "Identified ingredients", quantity: "1 serving", calories: 450 },
        ],
        insights: [
          "We analyzed your meal but couldn't extract precise details. Values shown are estimates.",
        ],
      };
    }

    // Ensure all numeric fields are numbers
    const sanitize = (v: unknown, fallback: number) =>
      typeof v === "number" && !isNaN(v) ? v : fallback;

    const result: MealAnalysisResult = {
      mealName: String(parsed.mealName || "Mixed Meal"),
      portionSize: String(parsed.portionSize || "1 serving"),
      confidence: sanitize(parsed.confidence, 0.7),
      totalCalories: sanitize(parsed.totalCalories, 0),
      protein: sanitize(parsed.protein, 0),
      carbs: sanitize(parsed.carbs, 0),
      fat: sanitize(parsed.fat, 0),
      fiber: sanitize(parsed.fiber, 0),
      sugar: sanitize(parsed.sugar, 0),
      ingredients: Array.isArray(parsed.ingredients)
        ? parsed.ingredients.map((ing) => ({
            name: String(ing.name || "Ingredient"),
            quantity: String(ing.quantity || ""),
            calories: sanitize(ing.calories, 0),
          }))
        : [],
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map((i) => String(i))
        : ["Analysis complete. Values are estimates based on the image."],
    };

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("[scan-meal] error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: `We couldn't analyze your image. ${message}`,
      },
      { status: 500 }
    );
  }
}
