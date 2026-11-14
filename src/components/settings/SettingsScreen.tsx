"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  User as UserIcon,
  Target,
  BellRing,
  Settings as SettingsIcon,
  ShieldCheck,
  Globe,
  Ruler,
  Moon,
  Sun,
  LogOut,
  Mail,
  Calendar,
  Check,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useI18n } from "@/components/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { LANGS, LANG_LABELS } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "personal" | "goals" | "reminders" | "notifications" | "preferences" | "privacy";

const sections: { id: SettingsSection; labelKey: string; icon: React.ElementType }[] = [
  { id: "profile", labelKey: "settings.profile", icon: UserIcon },
  { id: "personal", labelKey: "settings.personalInfo", icon: UserIcon },
  { id: "goals", labelKey: "settings.goals", icon: Target },
  { id: "reminders", labelKey: "settings.reminders", icon: BellRing },
  { id: "notifications", labelKey: "settings.notifications", icon: BellRing },
  { id: "preferences", labelKey: "settings.preferences", icon: SettingsIcon },
  { id: "privacy", labelKey: "settings.privacy", icon: ShieldCheck },
];

export function SettingsScreen() {
  const { t } = useI18n();
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.onboardingProfile);
  const targets = useAppStore((s) => s.targets);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const signOut = useAppStore((s) => s.signOut);
  const [active, setActive] = useState<SettingsSection>("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { toast } = useToast();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "November 2026";

  return (
    <div className="min-h-screen lg:h-screen bg-[#E3E5E3] flex flex-col lg:overflow-hidden">
      {/* Title bar */}
      <div className="hidden lg:flex items-center gap-3 px-4 h-10 bg-white/75 border-b border-[#DCE4E1] flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E06D53]" />
          <span className="w-3 h-3 rounded-full bg-[#E8940A]" />
          <span className="w-3 h-3 rounded-full bg-[#1E4D3B]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-0.5 rounded-full bg-[#E3E5E3] text-[10px] font-medium text-[#4A5A55] flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-[#1E4D3B]" strokeWidth={2} />
            nutrilen.ai/settings
          </div>
        </div>
        <div className="w-12" />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          <DashboardSidebar activeView="settings" />
          <main className="flex-1 min-w-0 lg:overflow-y-auto scroll-soft">
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setView("dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium text-forest/60 hover:text-forest mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("sidebar.dashboard")}
            </button>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {t("settings.title")}
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <aside className="col-span-12 sm:col-span-4 lg:col-span-3">
              <div className="bg-white rounded-3xl border border-forest/8 p-3 sticky top-6">
                <nav className="space-y-1">
                  {sections.map((s) => {
                    const Icon = s.icon;
                    const isActive = active === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                          isActive
                            ? "bg-lime-soft/50 text-forest"
                            : "text-forest/60 hover:bg-cream/40"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
                        <span className="flex-1 truncate">{t(s.labelKey)}</span>
                      </button>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-forest/8">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-fat hover:bg-fat/10"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
                      <span>{t("sidebar.logout")}</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            <div className="col-span-12 sm:col-span-8 lg:col-span-9">
              <div className="bg-white rounded-3xl border border-forest/8 p-6">
                {active === "profile" && (
                  <ProfileSection user={user} memberSince={memberSince} targets={targets} />
                )}
                {active === "personal" && <PersonalSection profile={profile} />}
                {active === "goals" && <GoalsSection targets={targets} profile={profile} />}
                {active === "reminders" && <RemindersSection />}
                {active === "notifications" && <NotificationsSection />}
                {active === "preferences" && (
                  <PreferencesSection lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
                )}
                {active === "privacy" && <PrivacySection />}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-fat/15 flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-fat" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forest">{t("sidebar.logout")}?</h3>
            <p className="mt-2 text-sm text-forest/60">
              You will be signed out of your account. Your data stays saved.
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut();
                }}
                className="flex-1 rounded-full bg-fat text-white hover:bg-fat/90"
              >
                {t("sidebar.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-bold text-forest">{title}</h2>
      {subtitle && <p className="text-sm text-forest/55 mt-1">{subtitle}</p>}
    </div>
  );
}

function ProfileSection({ user, memberSince, targets }: any) {
  const { t } = useI18n();
  return (
    <div>
      <SectionHeader title={t("settings.profile")} />
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-lime flex items-center justify-center font-bold text-forest text-xl">
          {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
        <div>
          <div className="font-heading text-lg font-bold text-forest">{user?.fullName ?? "User"}</div>
          <div className="text-sm text-forest/55 flex items-center gap-1.5 mt-0.5">
            <Mail className="h-3.5 w-3.5" />
            {user?.email ?? ""}
          </div>
          <div className="text-xs text-forest/40 flex items-center gap-1.5 mt-1">
            <Calendar className="h-3 w-3" />
            {t("settings.memberSince")} {memberSince}
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={() => toast({ title: "Edit profile", description: "Profile editing is coming in the next iteration." })} className="rounded-full border-forest/15 text-forest">
        {t("settings.editProfile")}
      </Button>
      {targets && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label={t("on.step8.dailyTarget")} value={`${targets.dailyCalories}`} unit="kcal" />
          <StatBox label={t("on.step8.proteinTarget")} value={`${targets.protein}`} unit="g" />
          <StatBox label={t("on.step8.carbTarget")} value={`${targets.carbs}`} unit="g" />
          <StatBox label={t("on.step8.fatTarget")} value={`${targets.fat}`} unit="g" />
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-forest/8 p-3 text-center">
      <div className="text-xs text-forest/55 mb-1">{label}</div>
      <div className="text-lg font-bold text-forest tabular-nums">
        {value}
        <span className="text-xs text-forest/40 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

function PersonalSection({ profile }: any) {
  const { t } = useI18n();
  if (!profile) {
    return (
      <div>
        <SectionHeader title={t("settings.personalInfo")} />
        <p className="text-sm text-forest/55">Complete onboarding to fill in your personal info.</p>
      </div>
    );
  }
  const rows = [
    { label: t("on.step1.question"), value: profile.gender === "male" ? t("on.step1.male") : profile.gender === "female" ? t("on.step1.female") : t("on.step1.preferNotSay") },
    { label: t("on.step2.heading"), value: `${profile.age} years` },
    { label: t("on.step3.heading"), value: `${profile.height} cm` },
    { label: t("on.step4.heading"), value: `${profile.currentWeight} kg` },
    { label: t("on.step6.heading"), value: `${profile.goalWeight} kg` },
    { label: t("on.step5.heading"), value: t(`on.step5.${profile.activityLevel}`) },
  ];
  return (
    <div>
      <SectionHeader title={t("settings.personalInfo")} subtitle="Update your personal details." />
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between p-3 rounded-xl bg-cream/30">
            <span className="text-sm text-forest/65">{r.label}</span>
            <span className="text-sm font-semibold text-forest">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsSection({ targets, profile }: any) {
  const { t } = useI18n();
  return (
    <div>
      <SectionHeader title={t("settings.goals")} subtitle="Manage your health goals." />
      {profile && (
        <div className="mb-4 p-3 rounded-xl bg-lime-soft/40 flex items-center gap-2">
          <Target className="h-4 w-4 text-forest" />
          <span className="text-sm font-semibold text-forest">{t(`on.step7.${profile.goal}`)}</span>
        </div>
      )}
      {targets && (
        <div className="grid grid-cols-2 gap-3">
          <StatBox label={t("on.step8.dailyTarget")} value={`${targets.dailyCalories}`} unit="kcal" />
          <StatBox label={t("on.step8.proteinTarget")} value={`${targets.protein}`} unit="g" />
          <StatBox label={t("on.step8.carbTarget")} value={`${targets.carbs}`} unit="g" />
          <StatBox label={t("on.step8.fatTarget")} value={`${targets.fat}`} unit="g" />
        </div>
      )}
    </div>
  );
}

function RemindersSection() {
  const { t } = useI18n();
  const reminders = [
    { label: "Water reminders", desc: "Stay hydrated throughout the day", enabled: true },
    { label: "Breakfast reminder", desc: "08:00 every day", enabled: true },
    { label: "Lunch reminder", desc: "13:00 every day", enabled: true },
    { label: "Dinner reminder", desc: "20:00 every day", enabled: false },
    { label: "Protein goal reminder", desc: "Alert if protein is behind by evening", enabled: true },
    { label: "Daily activity reminder", desc: "20 minutes of movement", enabled: true },
  ];
  return (
    <div>
      <SectionHeader title={t("settings.reminders")} subtitle="Configure your daily reminders." />
      <div className="space-y-2">
        {reminders.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream/30">
            <div>
              <div className="text-sm font-semibold text-forest">{r.label}</div>
              <div className="text-xs text-forest/55">{r.desc}</div>
            </div>
            <Switch defaultChecked={r.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const { t } = useI18n();
  const notifs = [
    { label: "Daily nutrition summary", enabled: true },
    { label: "Calorie goal progress", enabled: true },
    { label: "Protein goal reminders", enabled: true },
    { label: "Water reminders", enabled: true },
    { label: "Meal reminders", enabled: true },
    { label: "AI nutrition insights", enabled: false },
    { label: "Weekly progress reports", enabled: true },
  ];
  return (
    <div>
      <SectionHeader title={t("settings.notifications")} subtitle="Choose what to be notified about." />
      <div className="space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream/30">
            <span className="text-sm font-medium text-forest">{n.label}</span>
            <Switch defaultChecked={n.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferencesSection({
  lang,
  setLang,
  theme,
  setTheme,
}: {
  lang: string;
  setLang: (l: any) => void;
  theme: string;
  setTheme: (t: any) => void;
}) {
  const { t } = useI18n();
  return (
    <div>
      <SectionHeader title={t("settings.preferences")} subtitle="App preferences." />
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-forest/60" />
          <span className="text-sm font-semibold text-forest">{t("settings.language")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                lang === l
                  ? "border-lime bg-lime-soft/40 text-forest"
                  : "border-forest/10 bg-white text-forest/60 hover:border-forest/20"
              )}
            >
              <span className={l === "bn" ? "lang-bn" : ""}>{LANG_LABELS[l]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="h-4 w-4 text-forest/60" />
          <span className="text-sm font-semibold text-forest">{t("settings.theme")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
              theme === "light"
                ? "border-lime bg-lime-soft/40 text-forest"
                : "border-forest/10 bg-white text-forest/60 hover:border-forest/20"
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
              theme === "dark"
                ? "border-lime bg-lime-soft/40 text-forest"
                : "border-forest/10 bg-white text-forest/60 hover:border-forest/20"
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="h-4 w-4 text-forest/60" />
          <span className="text-sm font-semibold text-forest">{t("settings.units")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl border border-forest/10 bg-cream/30">
            <div className="text-xs text-forest/55">Weight</div>
            <div className="text-sm font-semibold text-forest">kg / lbs</div>
          </div>
          <div className="p-3 rounded-xl border border-forest/10 bg-cream/30">
            <div className="text-xs text-forest/55">Height</div>
            <div className="text-sm font-semibold text-forest">cm / ft</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySection() {
  const { t } = useI18n();
  const { toast } = useToast();
  const items = [
    { label: "Change password", desc: "Update your account password" },
    { label: "Manage account security", desc: "Two-factor authentication, sessions" },
    { label: "Privacy settings", desc: "Control your data visibility" },
    { label: "Download personal data", desc: "Export your account data" },
  ];
  return (
    <div>
      <SectionHeader title={t("settings.privacy")} subtitle="Account security and privacy." />
      <div className="space-y-2 mb-4">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => toast({ title: it.label, description: "This feature is coming in the next iteration." })}
            className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-cream/30 hover:bg-cream/50"
          >
            <div>
              <div className="text-sm font-semibold text-forest">{it.label}</div>
              <div className="text-xs text-forest/55">{it.desc}</div>
            </div>
            <ArrowLeft className="h-4 w-4 text-forest/30 rotate-180" />
          </button>
        ))}
      </div>
      <button onClick={() => toast({ title: "Delete account", description: "This action cannot be undone. Contact hello@nutrilen.ai to request account deletion.", variant: "destructive" })} className="w-full p-3 rounded-xl border-2 border-fat/20 text-fat hover:bg-fat/5 text-sm font-medium">
        Delete account
      </button>
    </div>
  );
}
