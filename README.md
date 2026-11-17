# SmartBite — Nutrition Intelligence & AI Grocery Platform

SmartBite is an intelligent nutrition platform tailored for regional dietary needs. It integrates multimodal computer vision for meal scanning, personalized macronutrient targets, and budget-calibrated grocery planning using local Dhaka retail benchmarks.

---

## Key Highlights

- **Multimodal Food Scanner**: Upload meal photos or use your camera to estimate calories, macronutrients, and glycemic indicators powered by Google Gemini vision models.
- **AI Smart Grocery Planner**: Formulates weekly shopping baskets optimized for health goals (Weight Loss, Muscle Gain, Glycemic Balance) within a strict BDT budget constraint.
- **Photo-to-Basket Intelligence**: Extracts produce and ingredients directly from market stall photos and prices them according to Dhaka market benchmarks without injecting unsolicited staples.
- **Dynamic Food Diary & Tracker**: Track daily caloric intake, log meals, manage task streaks, and monitor progress toward target macros.
- **Bilingual Interface**: Full English and Bengali (বাংলা) localization across all screens.
- **Offline & Local Persistence**: Stores profile data, dietary preferences, and grocery lists locally via Prisma and SQLite.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: Zustand with persistent storage
- **Animations**: Framer Motion
- **ORM & Database**: Prisma with SQLite
- **AI Models**: Google Gemini (`gemini-flash-lite-latest`)

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema definitions
│   └── db/custom.db         # Persistent SQLite database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scan-meal/            # Food photo analysis endpoint
│   │   │   ├── grocery/
│   │   │   │   ├── generate/         # In-budget grocery generator
│   │   │   │   ├── inspect-food/     # Market image produce extractor
│   │   │   │   ├── preferences/      # User dietary preferences API
│   │   │   │   └── saved/            # Saved grocery lists API
│   │   │   └── dietary-pivot/        # Nutrition adjustment suggestions
│   │   ├── layout.tsx                # App root layout
│   │   └── page.tsx                  # Main router view
│   ├── components/
│   │   ├── dashboard/                # Main dashboard screens & sidebar
│   │   ├── scanner/                  # Multimodal food scanner UI
│   │   ├── shopping/                 # Smart grocery planner interface
│   │   ├── fooddiary/                # Daily intake logger & history
│   │   ├── mealplanner/              # Weekly target planner
│   │   └── analytics/                # Progress charts & macros
│   ├── lib/
│   │   ├── services/
│   │   │   ├── ai-grocery.ts         # Grocery basket generation & budget engine
│   │   │   ├── bangladesh-food-db.ts # Regional Dhaka food catalog & benchmarks
│   │   │   └── pricing-engine.ts     # Package pricing & cost resolver
│   │   └── i18n.ts                   # English / Bengali translation keys
│   └── store/
│       └── useAppStore.ts            # Global client state
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ or Bun
- A Google Gemini API Key from Google AI Studio

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./db/custom.db"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-flash-lite-latest"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## Deployment Notes

- **Vercel / Netlify**: Supply `GEMINI_API_KEY` in the hosting platform's Environment Variables settings.
- If deploying to a serverless platform, connect an external PostgreSQL database (such as Supabase or Neon) by updating `provider = "postgresql"` in `prisma/schema.prisma`.
