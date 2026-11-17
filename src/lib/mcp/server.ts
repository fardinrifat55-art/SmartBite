/**
 * NutriTrack MCP (Model Context Protocol) Server
 * 
 * Exposes NutriTrack's Nutrition Intelligence and Vision-to-Market engine as standard
 * Model Context Protocol (MCP) tools for AI agents and LLMs.
 */

import { ragNutritionService } from "@/lib/services/rag-nutrition";
import { aiGroceryPlannerService } from "@/lib/services/ai-grocery";
import { BANGLADESH_FOOD_CATALOG } from "@/lib/services/bangladesh-food-db";

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const NUTRITRACK_MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: "get_dietary_pivot",
    description: "Evaluates a scanned food dish or menu and returns a clinical dietary pivot, glycemic load index, NOVA classification, and localized market alternative.",
    parameters: {
      type: "object",
      properties: {
        mealName: { type: "string", description: "Name of the detected dish or menu item" },
        ingredients: { type: "array", items: { type: "string" }, description: "List of detected ingredients" },
        userGoal: { type: "string", description: "Metabolic goal (e.g. diabetes, weight loss, muscle gain)" },
      },
      required: ["mealName"],
    },
  },
  {
    name: "generate_localized_grocery_plan",
    description: "Generates a budget-optimized localized grocery shopping list in Dhaka, Bangladesh (in BDT) based on visual food inspirations, metabolic targets, and allergens.",
    parameters: {
      type: "object",
      properties: {
        foodInspirations: { type: "array", items: { type: "string" }, description: "Staged visual items or dishes" },
        durationDays: { type: "number", description: "Duration in days (1 to 30)" },
        budgetLimitBdt: { type: "number", description: "Maximum budget in Bangladeshi Taka (BDT)" },
        healthGoal: { type: "string", description: "Health or metabolic goal" },
      },
      required: ["healthGoal"],
    },
  },
  {
    name: "query_rag_nutrition_guidelines",
    description: "Retrieves evidence-based clinical dietary guidelines from BIRDEM, ICMR, and Open Food Facts for metabolic coaching.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Food query or condition" },
        metabolicCondition: { type: "string", description: "Specific condition (diabetes, hypertension, celiac)" },
      },
      required: ["query"],
    },
  },
];

export async function handleMCPToolCall(toolName: string, args: any) {
  switch (toolName) {
    case "get_dietary_pivot":
      return ragNutritionService.generateDietaryPivot({
        mealName: args.mealName || args.dishName || "Nutritious Meal",
        ingredients: Array.isArray(args.ingredients) ? args.ingredients : [],
        userGoal: args.userGoal || args.healthGoal || "Metabolic health",
      });

    case "generate_localized_grocery_plan":
      return aiGroceryPlannerService.generatePlan({
        userContext: { age: 26, gender: "male", height: 172, currentWeight: 68 },
        healthGoal: args.healthGoal,
        durationDays: args.durationDays || 7,
        budgetMode: args.budgetLimitBdt ? "max" : "none",
        budgetLimitBdt: args.budgetLimitBdt,
        foodInspirations: args.foodInspirations || [],
        preferences: {
          allergies: [],
          intolerances: [],
          dietaryRestrictions: ["halal"],
          dislikedFoods: [],
        },
      });

    case "query_rag_nutrition_guidelines":
      return ragNutritionService.retrieveGuidelines(args.query, args.metabolicCondition);

    default:
      throw new Error(`Unknown MCP tool: ${toolName}`);
  }
}
