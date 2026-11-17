import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, text } = body as { image?: string; text?: string };

    const detectedItems: string[] = [];

    // If text inspiration provided, parse simple food phrases
    if (text && typeof text === "string" && text.trim()) {
      const parts = text
        .split(/[,;\n+&]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);
      detectedItems.push(...parts);
    }

    // If image provided, analyze image or call vision
    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      const match = image.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,([\s\S]+)$/);
      const base64Raw = match ? match[1] : image;
      const rawBuffer = Buffer.from(base64Raw, "base64");
      
      // Optimize image before sending to vision API
      let buffer: Buffer;
      try {
        buffer = await sharp(rawBuffer)
          .rotate()
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      } catch {
        buffer = rawBuffer;
      }

      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      let visionAnalyzed = false;

      if (geminiKey) {
        const candidateModels = [
          process.env.GEMINI_MODEL,
          "gemini-flash-lite-latest",
          "gemini-3-flash-preview",
          "gemini-flash-latest",
        ].filter(Boolean) as string[];

        for (const model of candidateModels) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiKey)}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: "Look at this food, grocery, or ingredient photo carefully. Identify what raw groceries, whole foods, ingredients, or cooked dishes are visible. Return ONLY a comma-separated list of 2 to 8 specific grocery ingredients in plain English (e.g. 'Chicken, Farm Eggs, Rui Fish, Red Lentil Dal, Spinach, Tomato, Cucumber, Red Rice'). No sentences, no markdown formatting.",
                      },
                      { inlineData: { mimeType: "image/jpeg", data: buffer.toString("base64") } },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 200,
                },
              }),
            });
            if (res.ok) {
              const data = await res.json();
              const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResponse && typeof textResponse === "string" && textResponse.trim() && textResponse.trim().toLowerCase() !== "none") {
                const items = textResponse
                  .split(/[,;\n]/)
                  .map((s: string) => s.replace(/[\n*•-]/g, "").trim())
                  .filter((s: string) => s.length > 1 && s.toLowerCase() !== "none");
                if (items.length > 0) {
                  detectedItems.push(...items);
                  visionAnalyzed = true;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`[inspect-food] Model ${model} failed, trying next:`, e);
          }
        }
      }

      // If vision model didn't catch or no key is configured
      if (!visionAnalyzed) {
        if (!geminiKey) {
          return NextResponse.json(
            {
              success: false,
              error: "GEMINI_API_KEY is missing on the server. Please configure GEMINI_API_KEY in your Render/Vercel Environment Variables.",
            },
            { status: 400 }
          );
        }
        return NextResponse.json(
          {
            success: false,
            error: "Could not clearly identify grocery items in this image. Please upload a clear photo of food or ingredients.",
          },
          { status: 422 }
        );
      }
    }

    // Deduplicate
    const unique = Array.from(new Set(detectedItems)).slice(0, 8);

    return NextResponse.json({
      success: true,
      items: unique.length > 0 ? unique : ["Steamed Rice", "Farm Eggs", "Seasonal Vegetables"],
    });
  } catch (err) {
    console.error("[inspect-food] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to inspect food inspiration" },
      { status: 500 }
    );
  }
}
