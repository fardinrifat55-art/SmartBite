"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/sample-data";

type AuthMode = "signin" | "signup";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Upper & lower case", test: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
    { label: "Number", test: (p: string) => /\d/.test(p) },
  ];
  const score = checks.filter((c) => c.test(password)).length;
  const colors = ["bg-forest/15", "bg-fat", "bg-carb", "bg-lime"];
  const labels = ["Too short", "Weak", "Fair", "Strong"];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? colors[score] : "bg-forest/10"
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => {
          const passed = c.test(password);
          return (
            <div
              key={c.label}
              className={cn(
                "flex items-center gap-1 text-[11px]",
                passed ? "text-lime" : "text-forest/40"
              )}
            >
              <Check className="h-3 w-3" />
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AuthScreen() {
  const { t } = useI18n();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const signIn = useAppStore((s) => s.signIn);
  const signUp = useAppStore((s) => s.signUp);
  const signInDemo = useAppStore((s) => s.signInDemo);
  const isAuthed = useAppStore((s) => s.isAuthed);

  const mode: AuthMode = view === "signup" ? "signup" : "signin";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (!name.trim()) return setError("Please enter your full name.");
      if (!email.includes("@")) return setError("Please enter a valid email.");
      if (password.length < 8)
        return setError("Password must be at least 8 characters.");
      if (password !== confirmPassword)
        return setError("Passwords do not match.");
      if (!agree)
        return setError("Please agree to the Terms and Privacy Policy.");
    } else {
      if (!email.includes("@")) return setError("Please enter a valid email.");
      if (password.length < 1) return setError("Please enter your password.");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(name.trim(), email.trim(), password);
        setView("onboarding");
      } else {
        // Demo credentials → skip onboarding, go straight to dashboard
        if (
          email.trim().toLowerCase() === DEMO_EMAIL &&
          password === DEMO_PASSWORD
        ) {
          await signInDemo();
          // signInDemo sets view to "dashboard" directly
        } else {
          await signIn(email.trim(), password);
          setView("onboarding");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Mock Google auth — same fallback flow
    setLoading(true);
    setTimeout(async () => {
      await signIn("demo@nutrilen.ai", "google");
      setView("onboarding");
      setLoading(false);
    }, 800);
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await signInDemo();
      // signInDemo sets view to "dashboard" directly (skips onboarding)
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: AuthMode) => {
    setError(null);
    setView(m === "signup" ? "signup" : "signin");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: brand panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490645935447-551e8a1c1c45?w=900&q=80&auto=format&fit=crop"
            alt="Fresh healthy food"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/85 to-forest/60" />
        </div>

        {/* Decorative veggie emojis */}
        <div className="absolute top-16 right-12 text-4xl opacity-25 animate-float-soft">🥑</div>
        <div className="absolute bottom-24 left-12 text-3xl opacity-25 animate-float-soft-delayed">🥕</div>
        <div className="absolute top-1/3 left-20 text-2xl opacity-20 animate-float-soft-slow">🥬</div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Logo variant="light" size="lg" />
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
              <ShieldCheck className="h-3.5 w-3.5 text-lime" />
              <span className="text-xs font-medium text-white/90">
                {t("auth.welcomeBrand")}
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight">
              {mode === "signin" ? t("auth.welcomeBack") : t("auth.startJourney")}
            </h2>
            <p className="mt-4 text-base text-white/70 leading-relaxed">
              {mode === "signin" ? t("auth.welcomeSubtitle") : t("auth.startSubtitle")}
            </p>
            <p className="mt-8 text-sm text-white/55 leading-relaxed italic">
              "{t("auth.motivational")}"
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold text-lime">12K+</div>
              <div className="text-xs text-white/50">Active users</div>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <div className="text-2xl font-bold text-lime">4.9★</div>
              <div className="text-xs text-white/50">User rating</div>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <div className="text-2xl font-bold text-lime">850K</div>
              <div className="text-xs text-white/50">Meals scanned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex-1 lg:w-1/2 flex flex-col bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 sm:p-6">
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-1.5 text-sm font-medium text-forest/70 hover:text-forest transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.home")}</span>
          </button>
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <LanguageSwitcher />
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 pb-10">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                  {mode === "signin" ? t("auth.welcomeBack") : t("auth.startJourney")}
                </h1>
                <p className="mt-2 text-sm text-forest/60">
                  {mode === "signin" ? t("auth.welcomeSubtitle") : t("auth.startSubtitle")}
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-medium text-forest">
                        {t("auth.fullName")}
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Arif Rahman"
                          className="pl-10 h-12 rounded-xl bg-white border-forest/12 focus-visible:ring-lime focus-visible:border-lime"
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-forest">
                      {t("auth.email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10 h-12 rounded-xl bg-white border-forest/12 focus-visible:ring-lime focus-visible:border-lime"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-forest">
                        {t("auth.password")}
                      </Label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() =>
                            toast({
                              title: "Password reset",
                              description: email
                                ? `A reset link has been sent to ${email}.`
                                : "Enter your email first, then click this link again.",
                            })
                          }
                          className="text-xs text-lime hover:underline font-medium"
                        >
                          {t("auth.forgotPassword")}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 rounded-xl bg-white border-forest/12 focus-visible:ring-lime focus-visible:border-lime"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {mode === "signup" && password.length > 0 && (
                      <PasswordStrength password={password} />
                    )}
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm" className="text-sm font-medium text-forest">
                        {t("auth.confirmPassword")}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                        <Input
                          id="confirm"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 rounded-xl bg-white border-forest/12 focus-visible:ring-lime focus-visible:border-lime"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest"
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "signin" ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(v) => setRemember(v === true)}
                      />
                      <Label htmlFor="remember" className="text-sm text-forest/70 cursor-pointer">
                        {t("auth.remember")}
                      </Label>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agree"
                        checked={agree}
                        onCheckedChange={(v) => setAgree(v === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="agree" className="text-sm text-forest/70 cursor-pointer leading-relaxed">
                        {t("auth.agreeTerms")}
                      </Label>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl bg-fat/10 border border-fat/20 px-4 py-3 text-sm text-fat">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-forest text-white font-semibold hover:bg-forest/90 shadow-lg shadow-forest/15 transition-all disabled:opacity-60"
                  >
                    {loading
                      ? "..."
                      : mode === "signup"
                        ? t("auth.createMyAccount")
                        : t("common.signIn")}
                  </Button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-forest/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-3 text-xs text-forest/40">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    variant="outline"
                    className="w-full h-12 rounded-xl bg-white border-forest/15 text-forest font-medium hover:bg-cream/30"
                  >
                    <GoogleIcon className="h-4 w-4 mr-2" />
                    {t("auth.continueGoogle")}
                  </Button>

                  {/* Demo account — sign-in mode only */}
                  {mode === "signin" && (
                    <div className="mt-3 rounded-2xl border-2 border-dashed border-lime/40 bg-lime-soft/20 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="h-4.5 w-4.5 text-forest" strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-forest">Demo Account</div>
                          <div className="text-xs text-forest/55 mt-0.5 leading-relaxed">
                            Skip onboarding and explore the app with pre-filled data —
                            meals, targets, and a 7-day streak.
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
                            <div className="flex items-center gap-1.5 text-forest/60">
                              <Mail className="h-3 w-3" />
                              <span className="font-mono">demo@nutrilen.ai</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-forest/60">
                              <Lock className="h-3 w-3" />
                              <span className="font-mono">demo1234</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleDemo}
                        disabled={loading}
                        className="w-full mt-3 h-10 rounded-xl bg-lime text-forest font-semibold hover:bg-lime/90 shadow-sm"
                      >
                        {loading ? "..." : "Try Demo Account"}
                      </Button>
                    </div>
                  )}
                </form>

                {/* Footer link */}
                <p className="mt-6 text-center text-sm text-forest/60">
                  {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                  <button
                    onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                    className="text-lime font-semibold hover:underline"
                  >
                    {mode === "signin" ? t("auth.createAccount") : t("common.signIn")}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}
