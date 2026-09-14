"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCheckIn } from "@/lib/storage";

const qualities = [
  { value: 1 as const, label: "Terrible", emoji: "😫" },
  { value: 2 as const, label: "Mauvaise", emoji: "😕" },
  { value: 3 as const, label: "Moyenne", emoji: "😐" },
  { value: 4 as const, label: "Bonne", emoji: "😊" },
  { value: 5 as const, label: "Super", emoji: "😴" },
];

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<"quality" | "ritual" | "done">("quality");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [followedRitual, setFollowedRitual] = useState<boolean | null>(null);

  const handleQuality = (q: 1 | 2 | 3 | 4 | 5) => {
    setQuality(q);
    setTimeout(() => setStep("ritual"), 400);
  };

  const handleRitual = (followed: boolean) => {
    setFollowedRitual(followed);
    if (quality) {
      addCheckIn({
        date: new Date().toISOString().split("T")[0],
        sleepQuality: quality,
        followedRitual: followed,
      });
    }
    setTimeout(() => setStep("done"), 400);
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
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber to-orange text-midnight font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all"
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
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === "quality" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">Check-in du matin</p>
            <h1 className="text-2xl font-bold mb-8">
              Comment tu as dormi cette nuit ?
            </h1>
            <div className="flex flex-col gap-3">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => handleQuality(q.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                    quality === q.value
                      ? "border-amber bg-amber/10"
                      : "border-navy-lighter bg-navy-light/30 hover:bg-navy-light/60"
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

        {step === "ritual" && (
          <div className="animate-fade-in">
            <p className="text-amber text-sm font-medium mb-2">Check-in du matin</p>
            <h1 className="text-2xl font-bold mb-8">
              Tu as suivi ton rituel hier soir ?
            </h1>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRitual(true)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  followedRitual === true
                    ? "border-mint bg-mint/10"
                    : "border-navy-lighter bg-navy-light/30 hover:bg-navy-light/60"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="font-medium">Oui</span>
                </span>
              </button>
              <button
                onClick={() => handleRitual(false)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  followedRitual === false
                    ? "border-orange bg-orange/10"
                    : "border-navy-lighter bg-navy-light/30 hover:bg-navy-light/60"
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
      </div>
    </div>
  );
}
