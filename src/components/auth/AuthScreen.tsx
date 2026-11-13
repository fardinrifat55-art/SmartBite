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
  Sparkles,
} from "lucide-react";
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
  const colors = ["bg-white/15", "bg-[#EF4444]", "bg-[#F2D15B]", "bg-[#4ADE80]"];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? colors[score] : "bg-white/10"
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
                passed ? "text-[#4ADE80]" : "text-white/35"
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
        if (
          email.trim().toLowerCase() === DEMO_EMAIL &&
          password === DEMO_PASSWORD
        ) {
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
    <div className="culinary-smoky min-h-screen flex flex-col overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#3A2618]/20 blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between p-5 sm:p-6">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-1.5 text-sm font-medium text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("nav.home")}</span>
        </button>
        <span className="font-jakarta text-base font-extrabold tracking-tight text-[#E5E5E5]">
          Nutrilen<span className="text-[#A3A3A3]"> AI</span>
        </span>
        <LanguageSwitcher variant="light" />
      </div>

      {/* Centered glass card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="culinary-glass rounded-2xl p-6 sm:p-8"
            >
              {/* Heading */}
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#E5E5E5] tracking-tight">
                {mode === "signin" ? t("auth.welcomeBack") : t("auth.startJourney")}
              </h1>
              <p className="mt-2 text-sm text-[#A3A3A3]">
                {mode === "signin" ? t("auth.welcomeSubtitle") : t("auth.startSubtitle")}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wide">
                      {t("auth.fullName")}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
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
                  <label className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wide">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
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
                    <label className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wide">
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
                        className="text-xs text-[#4ADE80] hover:underline font-medium"
                      >
                        {t("auth.forgotPassword")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E5E5E5]"
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
                    <label className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wide">
                      {t("auth.confirmPassword")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
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
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E5E5E5]"
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
                        remember ? "bg-[#E5E5E5] border-[#E5E5E5]" : "border-white/20"
                      )}
                    >
                      {remember && <Check className="h-3 w-3 text-[#141414]" strokeWidth={3} />}
                    </button>
                    <span className="text-sm text-[#A3A3A3] cursor-pointer" onClick={() => setRemember((v) => !v)}>
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
                        agree ? "bg-[#E5E5E5] border-[#E5E5E5]" : "border-white/20"
                      )}
                    >
                      {agree && <Check className="h-3 w-3 text-[#141414]" strokeWidth={3} />}
                    </button>
                    <span className="text-sm text-[#A3A3A3] leading-relaxed cursor-pointer" onClick={() => setAgree((v) => !v)}>
                      {t("auth.agreeTerms")}
                    </span>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 text-sm text-[#EF4444]">
                    {error}
                  </div>
                )}

                {/* Solid off-white primary button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="culinary-btn-solid w-full h-12 rounded-xl disabled:opacity-60"
                >
                  {loading
                    ? "..."
                    : mode === "signup"
                      ? t("auth.createMyAccount")
                      : t("common.signIn")}
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/8" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-xs text-[#A3A3A3]">or</span>
                  </div>
                </div>

                {/* Dark glass Google button */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="culinary-btn-glass w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                >
                  <GoogleIcon className="h-4 w-4" />
                  {t("auth.continueGoogle")}
                </button>

                {/* Demo account — sign-in mode only */}
                {mode === "signin" && (
                  <div className="mt-3 rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#4ADE80]/15 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-4 w-4 text-[#4ADE80]" strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#E5E5E5]">Demo Account</div>
                        <div className="text-xs text-[#A3A3A3] mt-0.5 leading-relaxed">
                          Skip onboarding and explore with pre-filled data.
                        </div>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                            <Mail className="h-3 w-3" />
                            <span className="font-mono">{DEMO_EMAIL}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#A3A3A3]">
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
                      className="culinary-btn-solid w-full mt-3 h-10 rounded-lg text-sm"
                    >
                      {loading ? "..." : "Try Demo Account"}
                    </button>
                  </div>
                )}
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-sm text-[#A3A3A3]">
                {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                <button
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="text-[#4ADE80] font-semibold hover:underline"
                >
                  {mode === "signin" ? t("auth.createAccount") : t("common.signIn")}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
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
