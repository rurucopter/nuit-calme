"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addCheckIn, getUserData, saveUserData } from "@/lib/storage";
import { getHabitsForCause } from "@/lib/habits";
import { Habit, CauseType } from "@/lib/types";

const qualities = [
  { value: 1 as const, label: "Terrible", emoji: "😫" },
  { value: 2 as const, label: "Mauvaise", emoji: "😕" },
  { value: 3 as const, label: "Moyenne", emoji: "😐" },
  { value: 4 as const, label: "Bonne", emoji: "😊" },
  { value: 5 as const, label: "Super", emoji: "😴" },
];

const latencyOptions = [
  { value: "fast" as const, label: "Moins de 10 min", emoji: "⚡" },
  { value: "normal" as const, label: "10-20 min", emoji: "🙂" },
  { value: "long" as const, label: "20-45 min", emoji: "😐" },
  { value: "very-long" as const, label: "Plus de 45 min", emoji: "😩" },
];

const potentialCauses = [
  { value: "screen", label: "Ecrans", emoji: "📱" },
  { value: "stress", label: "Stress", emoji: "🧠" },
  { value: "caffeine", label: "Cafeine", emoji: "☕" },
  { value: "late_bed", label: "Coucher tardif", emoji: "🕐" },
  { value: "noise", label: "Bruit", emoji: "🔊" },
  { value: "other", label: "Autre", emoji: "❓" },
];

type Step = "quality" | "latency" | "cause" | "ritual" | "habits" | "done";

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("quality");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [latency, setLatency] = useState<string | null>(null);
  const [cause, setCause] = useState<string | null>(null);
  const [followedRitual, setFollowedRitual] = useState<boolean | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitChecks, setHabitChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = getUserData();
    if (data.verdict) {
      const h = getHabitsForCause(data.verdict.primaryCause);
      setHabits(h);
      const initial: Record<string, boolean> = {};
      h.forEach((hab) => (initial[hab.id] = false));
      setHabitChecks(initial);
    }
  }, []);

  const handleQuality = (q: 1 | 2 | 3 | 4 | 5) => {
    setQuality(q);
    setTimeout(() => setStep("latency"), 400);
  };

  const handleLatency = (l: string) => {
    setLatency(l);
    if (quality && quality <= 2) {
      setTimeout(() => setStep("cause"), 400);
    } else {
      setTimeout(() => setStep("ritual"), 400);
    }
  };

  const handleCause = (c: string) => {
    setCause(c);
    setTimeout(() => setStep("ritual"), 400);
  };

  const handleRitual = (followed: boolean) => {
    setFollowedRitual(followed);
    if (habits.length > 0) {
      setTimeout(() => setStep("habits"), 400);
    } else {
      finalize(followed, {});
    }
  };

  const finalize = (ritual: boolean, hChecks: Record<string, boolean>) => {
    if (quality) {
      const today = new Date().toISOString().split("T")[0];
      addCheckIn({
        date: today,
        sleepQuality: quality,
        followedRitual: ritual,
        sleepLatency: latency as "fast" | "normal" | "long" | "very-long" | undefined,
        potentialCause: cause ?? undefined,
        habits: Object.keys(hChecks).length > 0 ? hChecks : undefined,
      });
      const data = getUserData();
      const completions = { ...data.habitCompletions };
      if (Object.keys(hChecks).length > 0) {
        completions[today] = hChecks;
        saveUserData({ habitCompletions: completions });
      }
    }
    setTimeout(() => setStep("done"), 400);
  };

  const submitHabits = () => {
    finalize(followedRitual ?? false, habitChecks);
  };

  if (step === "done") {
    const isGood = quality && quality >= 4;
    const didRitual = followedRitual;
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="text-5xl mb-6">{isGood ? "🌟" : "💪"}</div>
        <h1 className="text-2xl font-bold text-center mb-3">
          {isGood ? "Belle nuit !" : "On continue !"}
        </h1>
        <p className="text-muted text-center mb-8 max-w-sm">
          {isGood && didRitual
            ? "Le rituel porte ses fruits. Continue comme ca."
            : isGood && !didRitual
            ? "Bien dormi meme sans le rituel ! Imagine avec."
            : !isGood && didRitual
            ? "Les resultats viendront. Le plus important, c'est la regularite."
            : "Essaie le rituel ce soir. Ca fait vraiment une difference."}
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98]"
        >
          Voir ma progression
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => router.back()}
          className="text-muted hover:text-soft-white transition-colors text-sm"
        >
          ← Retour
        </button>
        <div className="flex gap-1">
          {["quality", "latency", "ritual", "habits"].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                ["quality", "latency", "cause", "ritual", "habits"].indexOf(
                  step
                ) >= i
                  ? "bg-amber"
                  : "bg-navy-lighter"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === "quality" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">
              Check-in du matin
            </p>
            <h1 className="text-2xl font-bold mb-8">
              Comment tu as dormi cette nuit ?
            </h1>
            <div className="flex flex-col gap-3">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => handleQuality(q.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                    quality === q.value
                      ? "glass-accent"
                      : "glass-light hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{q.emoji}</span>
                    <span className="font-medium">{q.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "latency" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">
              Check-in du matin
            </p>
            <h1 className="text-2xl font-bold mb-8">
              Combien de temps pour t&apos;endormir ?
            </h1>
            <div className="flex flex-col gap-3">
              {latencyOptions.map((l) => (
                <button
                  key={l.value}
                  onClick={() => handleLatency(l.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                    latency === l.value
                      ? "glass-accent"
                      : "glass-light hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{l.emoji}</span>
                    <span className="font-medium">{l.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "cause" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">
              Check-in du matin
            </p>
            <h1 className="text-2xl font-bold mb-3">
              Qu&apos;est-ce qui a gene ton sommeil ?
            </h1>
            <p className="text-muted text-sm mb-8">
              Selectionne le facteur principal
            </p>
            <div className="grid grid-cols-2 gap-3">
              {potentialCauses.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleCause(c.value)}
                  className={`text-left px-4 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                    cause === c.value
                      ? "glass-accent"
                      : "glass-light hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-2xl block mb-1">{c.emoji}</span>
                  <span className="font-medium text-sm">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "ritual" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">
              Check-in du matin
            </p>
            <h1 className="text-2xl font-bold mb-8">
              Tu as suivi ton rituel hier soir ?
            </h1>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRitual(true)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  followedRitual === true
                    ? "glass-accent"
                    : "glass-light hover:bg-white/[0.06]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="font-medium">Oui</span>
                </span>
              </button>
              <button
                onClick={() => handleRitual(false)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  followedRitual === false
                    ? "glass-accent"
                    : "glass-light hover:bg-white/[0.06]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <span className="font-medium">Non</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {step === "habits" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">
              Check-in du matin
            </p>
            <h1 className="text-2xl font-bold mb-3">
              Tes habitudes d&apos;hier
            </h1>
            <p className="text-muted text-sm mb-8">
              Coche celles que tu as respectees
            </p>
            <div className="space-y-3 mb-8">
              {habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() =>
                    setHabitChecks((prev) => ({
                      ...prev,
                      [h.id]: !prev[h.id],
                    }))
                  }
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 ${
                    habitChecks[h.id]
                      ? "glass-accent"
                      : "glass-light"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{h.emoji}</span>
                    <span className="font-medium text-sm flex-1">
                      {h.label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        habitChecks[h.id]
                          ? "bg-amber border-amber text-midnight text-xs"
                          : "border-muted-dark"
                      }`}
                    >
                      {habitChecks[h.id] && "✓"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={submitHabits}
              className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.01] active:scale-[0.99]"
            >
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
