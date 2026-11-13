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
  Flame,
  Camera,
} from "lucide-react";
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
  const colors = ["bg-[#DCE4E1]", "bg-[#E06D53]", "bg-[#F2D15B]", "bg-[#2C5E53]"];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? colors[score] : "bg-[#DCE4E1]"
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
                passed ? "text-[#2C5E53]" : "text-[#5A6E69]/50"
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
  const { toast } = useToast();

  const mode: AuthMode = view === "signup" ? "signup" : "signin";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (password.length < 8) return setError("Password must be at least 8 characters.");
      if (password !== confirmPassword) return setError("Passwords do not match.");
      if (!agree) return setError("Please agree to the Terms and Privacy Policy.");
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
        if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
          await signInDemo();
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
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: AuthMode) => {
    setError(null);
    setView(m === "signup" ? "signup" : "signin");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-5 sm:p-6">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-1.5 text-sm font-medium text-[#5A6E69] hover:text-[#2C5E53] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2C5E53] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C7 17 4 13.5 4 9.5C4 6 6.5 4 9.5 4C11 4 12 4.8 12 6C12 4.8 13 4 14.5 4C17.5 4 20 6 20 9.5C20 13.5 17 17 12 21Z" fill="#E3EDE9" />
              <circle cx="16.5" cy="7.5" r="1.5" fill="#E06D53" />
            </svg>
          </div>
          <span className="font-jakarta text-base font-extrabold tracking-tight text-[#162623]">
            Nutrilen<span className="text-[#E06D53]"> AI</span>
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Split-screen content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* === Left: Login card === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-[#DCE4E1] shadow-[0_8px_40px_rgba(22,38,35,0.08)] p-6 sm:p-8 flex flex-col justify-center"
            >
              {/* Sage badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3EDE9] text-[#2C5E53] mb-5 w-fit">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">
                  {mode === "signin" ? "Welcome back to Nutrilen AI" : "Join Nutrilen AI"}
                </span>
              </div>

              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#162623] tracking-tight">
                {mode === "signin" ? "Sign in to your account" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-[#5A6E69]">
                {mode === "signin" ? t("auth.welcomeSubtitle") : t("auth.startSubtitle")}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-[#DCE4E1] bg-white hover:bg-[#F4F7F6] text-[#162623] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <GoogleIcon className="h-4 w-4" />
                  {t("auth.continueGoogle")}
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#DCE4E1]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-[#5A6E69]">or</span>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#5A6E69] uppercase tracking-wide">
                      {t("auth.fullName")}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6E69]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arif Rahman"
                        className="culinary-input w-full pl-10 h-12 rounded-xl text-sm"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#5A6E69] uppercase tracking-wide">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6E69]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="culinary-input w-full pl-10 h-12 rounded-xl text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#5A6E69] uppercase tracking-wide">
                      {t("auth.password")}
                    </label>
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
                        className="text-xs text-[#2C5E53] hover:underline font-medium"
                      >
                        {t("auth.forgotPassword")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6E69]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="culinary-input w-full pl-10 pr-10 h-12 rounded-xl text-sm"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6E69] hover:text-[#2C5E53]"
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
                    <label className="text-xs font-medium text-[#5A6E69] uppercase tracking-wide">
                      {t("auth.confirmPassword")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6E69]" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="culinary-input w-full pl-10 pr-10 h-12 rounded-xl text-sm"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6E69] hover:text-[#2C5E53]"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signin" ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRemember((v) => !v)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all",
                        remember ? "bg-[#2C5E53] border-[#2C5E53]" : "border-[#DCE4E1]"
                      )}
                    >
                      {remember && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-sm text-[#5A6E69] cursor-pointer" onClick={() => setRemember((v) => !v)}>
                      {t("auth.remember")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => setAgree((v) => !v)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        agree ? "bg-[#2C5E53] border-[#2C5E53]" : "border-[#DCE4E1]"
                      )}
                    >
                      {agree && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-sm text-[#5A6E69] leading-relaxed cursor-pointer" onClick={() => setAgree((v) => !v)}>
                      {t("auth.agreeTerms")}
                    </span>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-[#E06D53]/10 border border-[#E06D53]/30 px-4 py-3 text-sm text-[#E06D53]">
                    {error}
                  </div>
                )}

                {/* Coral Sign In button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#E06D53] hover:bg-[#C95B42] text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading
                    ? "..."
                    : mode === "signup"
                      ? t("auth.createMyAccount")
                      : t("common.signIn")}
                </button>

                {/* Demo account — sign-in mode only */}
                {mode === "signin" && (
                  <div className="mt-2 rounded-xl border border-dashed border-[#2C5E53]/30 bg-[#E3EDE9]/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#2C5E53] flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-4 w-4 text-[#E3EDE9]" strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#162623]">Demo Account</div>
                        <div className="text-xs text-[#5A6E69] mt-0.5 leading-relaxed">
                          Skip onboarding and explore with pre-filled data.
                        </div>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-[#5A6E69]">
                            <Mail className="h-3 w-3" />
                            <span className="font-mono">{DEMO_EMAIL}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5A6E69]">
                            <Lock className="h-3 w-3" />
                            <span className="font-mono">{DEMO_PASSWORD}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemo}
                      disabled={loading}
                      className="w-full mt-3 h-10 rounded-lg bg-[#2C5E53] hover:bg-[#2C5E53]/90 text-[#E3EDE9] font-semibold text-sm transition-colors"
                    >
                      {loading ? "..." : "Try Demo Account"}
                    </button>
                  </div>
                )}
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-sm text-[#5A6E69]">
                {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                <button
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="text-[#2C5E53] font-semibold hover:underline underline-offset-2"
                >
                  {mode === "signin" ? t("auth.createAccount") : t("common.signIn")}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* === Right: Food photo with frosted widgets === */}
          <div className="hidden lg:block relative rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(22,38,35,0.12)] min-h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80&auto=format&fit=crop"
              alt="Fresh healthy meal"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162623]/30 via-transparent to-transparent" />

            {/* Widget: Daily Calories — top-left */}
            <div className="absolute top-6 left-6 bg-white/85 backdrop-blur-md border border-[#DCE4E1] rounded-2xl shadow-sm p-3.5 w-44 animate-float-soft">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                  <Flame className="h-3.5 w-3.5 text-[#2C5E53]" />
                </div>
                <span className="text-xs font-semibold text-[#2C5E53]">Daily Calories</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#162623]">1,250</span>
                <span className="text-xs text-[#5A6E69]">/ 2,000</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#E3EDE9] rounded-full overflow-hidden">
                <div className="h-full bg-[#2C5E53] rounded-full" style={{ width: "63%" }} />
              </div>
            </div>

            {/* Widget: AI Recognition — bottom-right */}
            <div className="absolute bottom-6 right-6 bg-white/85 backdrop-blur-md border border-[#DCE4E1] rounded-2xl shadow-sm p-3 w-40 animate-float-soft-delayed">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E3EDE9] flex items-center justify-center">
                  <Camera className="h-4 w-4 text-[#2C5E53]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#162623]">AI Recognition</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E53] animate-pulse" />
                    <span className="text-[10px] text-[#5A6E69]">AI active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  );
}
