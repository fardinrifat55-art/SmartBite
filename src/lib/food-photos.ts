// Real food photos (sourced via image-search) keyed by the diary's imageQuery.
// Shared across Food Diary, Dashboard, and Meal Planner screens.
export const FOOD_PHOTOS: Record<string, string> = {
  "paratha dal": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4459ca5f52f.jpg",
  banana: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/73fd0fa4f36a.jpg",
  "rice fish curry": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/472d689232cd.jpg",
  "cucumber salad": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b00ef05ebbca.jpg",
  "mixed nuts": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/05943486772f.jpg",
  // Extras used by the Meal Planner / Shopping suggestions.
  "chicken rice": "https://images.unsplash.com/photo-1604908554049-29bf08f5d1ab?w=200&h=200&fit=crop",
  "vegetable soup": "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop",
  "fruit bowl": "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=200&h=200&fit=crop",
  "egg omelette": "https://images.unsplash.com/photo-1525351484163-7529d4a8e68d?w=200&h=200&fit=crop",
  "lentil soup": "https://images.unsplash.com/photo-1546548970-71785318a8b0?w=200&h=200&fit=crop",
  "grilled chicken": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop",
};

/** Resolve a photo URL for a food imageQuery, falling back to a placeholder. */
export function foodPhoto(query: string): string {
  return (
    FOOD_PHOTOS[query] ??
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=200&fit=crop"
  );
}
