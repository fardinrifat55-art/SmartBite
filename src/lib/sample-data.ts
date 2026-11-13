// Sample data for Nutrilen AI dashboard
// Realistic Bangladeshi meals and daily tracking data

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface FoodItem {
  id: string;
  mealType: MealType;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  imageQuery: string; // used for placeholder image
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  time: string; // e.g. "08:30"
  ingredients: { name: string; nameBn: string; quantity: string; calories: number }[];
}

// Today's logged meals — realistic Bangladeshi breakfast + lunch
export const SAMPLE_FOOD_DIARY: FoodItem[] = [
  {
    id: "f1",
    mealType: "breakfast",
    name: "Paratha with Dal",
    nameBn: "পরোটা ও ডাল",
    description: "Whole wheat paratha served with spiced lentil dal",
    descriptionBn: "গমের পরোটা মসলাদার ডালের সাথে",
    imageQuery: "paratha dal",
    calories: 420,
    protein: 14,
    carbs: 58,
    fat: 16,
    fiber: 6,
    sugar: 3,
    time: "08:30",
    ingredients: [
      { name: "Whole wheat paratha", nameBn: "গমের পরোটা", quantity: "2 pcs", calories: 280 },
      { name: "Mixed lentil dal", nameBn: "মিশ্র ডাল", quantity: "1 cup", calories: 120 },
      { name: "Vegetable oil", nameBn: "সয়াবিন তেল", quantity: "1 tbsp", calories: 20 },
    ],
  },
  {
    id: "f2",
    mealType: "breakfast",
    name: "Banana",
    nameBn: "কলা",
    description: "Ripe banana",
    descriptionBn: "পাকা কলা",
    imageQuery: "banana",
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
    fiber: 3,
    sugar: 14,
    time: "09:00",
    ingredients: [
      { name: "Ripe banana", nameBn: "পাকা কলা", quantity: "1 medium", calories: 105 },
    ],
  },
  {
    id: "f3",
    mealType: "lunch",
    name: "Rice with Fish Curry",
    nameBn: "ভাত ও মাছের তরকারি",
    description: "Steamed basmati rice with rui fish curry and vegetables",
    descriptionBn: "বাসমতি ভাত, রুই মাছের তরকারি ও সবজি",
    imageQuery: "rice fish curry",
    calories: 620,
    protein: 38,
    carbs: 82,
    fat: 18,
    fiber: 5,
    sugar: 4,
    time: "13:00",
    ingredients: [
      { name: "Steamed rice", nameBn: "ভাত", quantity: "1.5 cups", calories: 300 },
      { name: "Rui fish curry", nameBn: "রুই মাছের তরকারি", quantity: "200g", calories: 220 },
      { name: "Mixed vegetables", nameBn: "মিশ্র সবজি", quantity: "1 cup", calories: 80 },
      { name: "Mustard oil", nameBn: "সরিষার তেল", quantity: "1 tbsp", calories: 20 },
    ],
  },
  {
    id: "f4",
    mealType: "lunch",
    name: "Cucumber Salad",
    nameBn: "শসা সালাদ",
    description: "Fresh cucumber salad with lemon and salt",
    descriptionBn: "লেবু ও লবণের সাথে তাজা শসা সালাদ",
    imageQuery: "cucumber salad",
    calories: 45,
    protein: 2,
    carbs: 10,
    fat: 0,
    fiber: 2,
    sugar: 5,
    time: "13:15",
    ingredients: [
      { name: "Cucumber", nameBn: "শসা", quantity: "1 medium", calories: 30 },
      { name: "Lemon juice", nameBn: "লেবুর রস", quantity: "1 tbsp", calories: 5 },
      { name: "Onion", nameBn: "পেঁয়াজ", quantity: "2 tbsp", calories: 10 },
    ],
  },
  {
    id: "f5",
    mealType: "snacks",
    name: "Mixed Nuts",
    nameBn: "মিক্সড নাটস",
    description: "Almonds, cashews, and walnuts",
    descriptionBn: "বাদাম, কাজু ও আখরোট",
    imageQuery: "mixed nuts",
    calories: 180,
    protein: 6,
    carbs: 7,
    fat: 16,
    fiber: 3,
    sugar: 1,
    time: "16:00",
    ingredients: [
      { name: "Almonds", nameBn: "বাদাম", quantity: "10 pcs", calories: 70 },
      { name: "Cashews", nameBn: "কাজু", quantity: "8 pcs", calories: 80 },
      { name: "Walnuts", nameBn: "আখরোট", quantity: "3 pcs", calories: 30 },
    ],
  },
];

export interface DailyTask {
  id: string;
  label: string;
  labelBn: string;
  completed: boolean;
}

export const SAMPLE_TASKS: DailyTask[] = [
  {
    id: "t1",
    label: "Complete breakfast tracking",
    labelBn: "নাস্তা ট্র্যাকিং সম্পন্ন করুন",
    completed: true,
  },
  {
    id: "t2",
    label: "Drink 2 glasses of water",
    labelBn: "২ গ্লাস পানি পান করুন",
    completed: true,
  },
  {
    id: "t3",
    label: "Eat a protein-rich meal",
    labelBn: "প্রোটিন-সমৃদ্ধ খাবার খান",
    completed: true,
  },
  {
    id: "t4",
    label: "Scan one meal using AI",
    labelBn: "AI দিয়ে একটি খাবার স্ক্যান করুন",
    completed: false,
  },
  {
    id: "t5",
    label: "Complete 20 minutes of activity",
    labelBn: "২০ মিনিট শারীরিক কার্যকলাপ সম্পন্ন করুন",
    completed: false,
  },
];

export interface Reminder {
  id: string;
  icon: string; // lucide icon name
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  time: string;
  completed: boolean;
}

export const SAMPLE_REMINDERS: Reminder[] = [
  {
    id: "r1",
    icon: "droplets",
    title: "Drink water",
    titleBn: "পানি পান করুন",
    description: "Stay hydrated — aim for 2.5L today",
    descriptionBn: "হাইড্রেটেড থাকুন — আজ ২.৫ লিটার লক্ষ্য",
    time: "Every 2 hours",
    completed: false,
  },
  {
    id: "r2",
    icon: "beef",
    title: "Reach protein target",
    titleBn: "প্রোটিন লক্ষ্যে পৌঁছান",
    description: "55g protein remaining for today",
    descriptionBn: "আজকের জন্য ৫৫ গ্রাম প্রোটিন বাকি",
    time: "Before dinner",
    completed: false,
  },
  {
    id: "r3",
    icon: "utensils",
    title: "Next meal on time",
    titleBn: "পরবর্তী খাবার সময়ে",
    description: "Dinner at 8:00 PM",
    descriptionBn: "রাত ৮:০০-এ রাতের খাবার",
    time: "20:00",
    completed: false,
  },
  {
    id: "r4",
    icon: "activity",
    title: "Daily activity",
    titleBn: "দৈনিক কার্যকলাপ",
    description: "20 minutes of walking or exercise",
    descriptionBn: "২০ মিনিট হাঁটা বা ব্যায়াম",
    time: "Evening",
    completed: false,
  },
];

export interface Insight {
  id: string;
  icon: string;
  text: string;
  textBn: string;
}

export const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: "i1",
    icon: "trending-up",
    text: "You're close to your daily protein goal — just 55g more to go.",
    textBn: "আপনি আপনার দৈনিক প্রোটিন লক্ষ্যের কাছে — মাত্র ৫৫ গ্রাম বাকি।",
  },
  {
    id: "i2",
    icon: "pie-chart",
    text: "Your breakfast contributed 26% of your calorie target.",
    textBn: "আপনার নাস্তা আপনার ক্যালরি লক্ষ্যের ২৬% দিয়েছে।",
  },
  {
    id: "i3",
    icon: "leaf",
    text: "Consider adding more vegetables to your next meal for better fiber intake.",
    textBn: "উন্নত ফাইবার গ্রহণের জন্য পরবর্তী খাবারে আরও সবজি যোগ করার কথা ভাবুন।",
  },
];

// Weekly streak data (last 7 days, calories met percentage)
export const SAMPLE_WEEKLY_ACTIVITY: { day: string; dayBn: string; value: number }[] = [
  { day: "Mon", dayBn: "সোম", value: 82 },
  { day: "Tue", dayBn: "মঙ্গল", value: 95 },
  { day: "Wed", dayBn: "বুধ", value: 70 },
  { day: "Thu", dayBn: "বৃহ", value: 100 },
  { day: "Fri", dayBn: "শুক্র", value: 88 },
  { day: "Sat", dayBn: "শনি", value: 92 },
  { day: "Sun", dayBn: "রবি", value: 63 }, // today, in progress
];

// Default demo user profile for pre-populated dashboard
export const DEMO_PROFILE = {
  fullName: "Arif Rahman",
  email: "arif@nutrilen.ai",
  gender: "male" as const,
  age: 28,
  height: 175,
  currentWeight: 72,
  goalWeight: 75,
  activityLevel: "moderate" as const,
  goal: "muscle" as const,
};

// Generate unique id
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
