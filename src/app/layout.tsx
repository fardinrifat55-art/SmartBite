import type { Metadata } from "next";
import { Inter, Manrope, Plus_Jakarta_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/components/providers/AppProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nutrilen AI — Eat Smarter. Live Healthier. Every Day.",
  description:
    "Your personal AI nutrition companion. Capture meals, track calories, and build healthier habits with intelligent, personalized guidance.",
  keywords: [
    "Nutrilen AI",
    "nutrition",
    "calorie tracker",
    "AI food scanner",
    "meal planner",
    "health goals",
    "Bangladesh nutrition",
  ],
  authors: [{ name: "Nutrilen AI" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Nutrilen AI — Eat Smarter. Live Healthier. Every Day.",
    description:
      "Your personal AI nutrition companion. Understand your food, track your nutrition, and build healthier habits.",
    siteName: "Nutrilen AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${jakarta.variable} ${notoBengali.variable} antialiased bg-background text-foreground`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
