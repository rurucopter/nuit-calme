"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/storage";

const MONTHLY_PRICE = 9.9;
const ANNUAL_PRICE = 59.9;
const ANNUAL_MONTHLY = +(ANNUAL_PRICE / 12).toFixed(2);
const SAVINGS = Math.round((1 - ANNUAL_MONTHLY / MONTHLY_PRICE) * 100);
const DAILY_PRICE = +(ANNUAL_PRICE / 365).toFixed(2);

function computeSleepScore(answers: Record<string, string>): number {
  let score = 100;
  if (answers.eveningMind === "very-agitated") score -= 20;
  if (answers.eveningMind === "anxious") score -= 30;
  if (answers.eveningMind === "slightly-agitated") score -= 10;
  if (answers.screenTime === "30-60") score -= 10;
  if (answers.screenTime === "60+") score -= 20;
  if (answers.bedtime === "after-00") score -= 15;
  if (answers.bedtime === "23-00") score -= 5;
  if (answers.morningFeeling === "exhausted") score -= 15;
  if (answers.morningFeeling === "zombie") score -= 25;
  if (answers.morningFeeling === "slightly-tired") score -= 5;
  if (answers.nightWakeups === "often") score -= 10;
  if (answers.nightWakeups === "every-night") score -= 20;
  if (answers.caffeineCount === "3-4") score -= 5;
  if (answers.caffeineCount === "5+") score -= 15;
  return Math.max(12, Math.min(100, score));
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-mint";
  if (score >= 50) return "text-amber";
  if (score >= 30) return "text-orange";
  return "text-rose";
}

export default function OffrePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState(false);
  const [cause, setCause] = useState("");
  const [causeKey, setCauseKey] = useState("");
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [verdictTitle, setVerdictTitle] = useState("");

  useEffect(() => {
    const data = getUserData();
    if (data.verdict) {
      const labels: Record<string, string> = {
        screen_addiction: "l'addiction aux ecrans",
        late_caffeine: "la cafeine tardive",
        stress_rumination: "le stress et les ruminations",
        irregular_schedule: "les horaires irreguliers",
        late_exercise: "le sport tardif",
        no_routine: "l'absence de routine",
      };
      setCause(labels[data.verdict.primaryCause] ?? "tes habitudes");
      setCauseKey(data.verdict.primaryCause);
      setVerdictTitle(data.verdict.title);
    }
    if (data.answers) {
      const s = computeSleepScore(data.answers as unknown as Record<string, string>);
      setScore(s);
      setTargetScore(Math.min(s + 35, 92));
    }
  }, []);

  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/installation");
    }, 1500);
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="min-h-dvh flex flex-col px-5 py-6 max-w-lg mx-auto relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 text-muted-dark/30 hover:text-muted-dark text-xs p-2"
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Score recap */}
      {score > 0 && (
        <div className="glass rounded-2xl p-4 mb-5 mt-2">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="rgba(155,122,235,0.1)" strokeWidth="8"
                />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={score >= 75 ? "#10b981" : score >= 50 ? "#f5a623" : score >= 30 ? "#f0725c" : "#f43f5e"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 - (score / 100) * 2 * Math.PI * 54}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${scoreColor}`}>{score}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted mb-0.5">Ton score de sommeil</p>
              <p className="text-sm font-bold text-soft-white truncate">
                {verdictTitle}
              </p>
              <p className="text-xs text-muted">
                Cause : <span className="text-soft-white/80">{cause}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Headline */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          Ton programme est{" "}
          <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
            pret
          </span>
        </h1>
        <p className="text-muted text-sm max-w-xs mx-auto">
          4 semaines pour passer de{" "}
          <span className={`font-bold ${scoreColor}`}>{score}</span> a{" "}
          <span className="font-bold text-mint">{targetScore}</span>.
          {" "}Concu pour ta cause.
        </p>
      </div>

      {/* What's included */}
      <div className="glass rounded-2xl p-5 mb-5">
        <p className="text-xs text-amber uppercase tracking-widest mb-4 font-medium">
          Ce que tu debloques
        </p>
        <div className="space-y-3">
          {[
            { icon: "🎯", text: "Programme 4 semaines contre " + cause },
            { icon: "🌙", text: "Rituel du soir guide — 10 min pour couper ton cerveau" },
            { icon: "📊", text: "Suivi de ton score + detection de patterns" },
            { icon: "🔊", text: "Sons d'ambiance + respiration guidee" },
            { icon: "✅", text: "Micro-habitudes calibrees sur ta cause" },
            { icon: "🔓", text: "Questions approfondies pour affiner ton plan" },
            { icon: "📱", text: "App installable sur ton telephone" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{item.icon}</span>
              <span className="text-sm text-soft-white/90">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan selection */}
      <div className="space-y-3 mb-5">
        <button
          onClick={() => setPlan("annual")}
          className={`w-full text-left rounded-2xl p-4 transition-all duration-200 relative overflow-hidden ${
            plan === "annual"
              ? "glass-accent"
              : "glass-light hover:bg-white/[0.04]"
          }`}
        >
          {plan === "annual" && (
            <div className="absolute top-0 right-0 bg-amber text-midnight text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              -{SAVINGS}%
            </div>
          )}
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                plan === "annual" ? "border-amber bg-amber" : "border-muted-dark"
              }`}
            >
              {plan === "annual" && <div className="w-1.5 h-1.5 rounded-full bg-midnight" />}
            </div>
            <span className="font-semibold text-sm">Annuel</span>
            <span className="text-[10px] glass-accent px-2 py-0.5 rounded-full text-amber font-medium">
              Meilleur prix
            </span>
          </div>
          <p className="text-xs text-muted ml-7">
            {ANNUAL_MONTHLY.toFixed(2).replace(".", ",")}€/mois — soit{" "}
            <span className="text-soft-white font-medium">
              {DAILY_PRICE.toFixed(2).replace(".", ",")}€/jour
            </span>
            {" "}(moins qu&apos;un cafe)
          </p>
        </button>

        <button
          onClick={() => setPlan("monthly")}
          className={`w-full text-left rounded-2xl p-4 transition-all duration-200 ${
            plan === "monthly"
              ? "glass-accent"
              : "glass-light hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                plan === "monthly" ? "border-amber bg-amber" : "border-muted-dark"
              }`}
            >
              {plan === "monthly" && <div className="w-1.5 h-1.5 rounded-full bg-midnight" />}
            </div>
            <span className="font-semibold text-sm">Mensuel</span>
          </div>
          <p className="text-xs text-muted ml-7">
            {MONTHLY_PRICE.toFixed(2).replace(".", ",")}€/mois — sans engagement
          </p>
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-3"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" />
            Preparation...
          </span>
        ) : (
          <>
            Reparer mon sommeil —{" "}
            {plan === "annual"
              ? `${ANNUAL_PRICE.toFixed(2).replace(".", ",")}€/an`
              : `${MONTHLY_PRICE.toFixed(2).replace(".", ",")}€/mois`}
          </>
        )}
      </button>

      {/* Trust */}
      <div className="text-center space-y-2 mb-5">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-dark">
          <span>🔒 Paiement securise</span>
          <span>↩️ Satisfait ou rembourse 14j</span>
        </div>
        <p className="text-[10px] text-muted-dark/60">
          Resiliation en un clic. Zero engagement cache. Zero jugement.
        </p>
      </div>

      {/* Cost comparison */}
      <div className="glass-light rounded-2xl p-4 mb-4">
        <p className="text-xs text-muted mb-3 text-center">
          Ce que le manque de sommeil te coute deja :
        </p>
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          {[
            { value: "3-5 cafes", label: "par jour", price: "4-8€/j" },
            { value: "-40%", label: "concentration", price: "notes, taf" },
            { value: "x2", label: "risque burn-out", price: "ta sante" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-sm font-bold text-rose">{item.value}</p>
              <p className="text-[9px] text-muted-dark">{item.label}</p>
              <p className="text-[8px] text-rose/50">{item.price}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted">
          Nuit Calme :{" "}
          <span className="text-amber font-bold">
            {DAILY_PRICE.toFixed(2).replace(".", ",")}€/jour
          </span>
        </p>
      </div>

      {/* Social proof */}
      <div className="glass-light rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex -space-x-2">
            {["😊", "😴", "🙂", "😌"].map((e, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm border-2 border-midnight"
              >
                {e}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-soft-white font-medium">
              +2 340 personnes de 18-28 ans
            </p>
            <p className="text-[10px] text-muted">
              ont repare leur sommeil avec Nuit Calme
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-3 mb-6">
        {[
          {
            text: "Score passe de 35 a 78 en 3 semaines. Le rituel du soir c'est devenu sacre.",
            name: "Thomas, 25 — dev",
          },
          {
            text: "J'etais sceptique mais le diagnostic a tape en plein dans le mille. Je m'endors en 10 min maintenant.",
            name: "Lea, 22 — etudiante",
          },
          {
            text: "0,16€ par jour pour dormir correctement ? J'aurais paye le triple honnetement.",
            name: "Sarah, 20 — en alternance",
          },
        ].map((t) => (
          <div key={t.name} className="glass rounded-2xl p-4">
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-amber text-xs">★</span>
              ))}
            </div>
            <p className="text-sm text-muted leading-relaxed mb-2">
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="text-xs text-muted-dark">— {t.name}</p>
          </div>
        ))}
      </div>

      {/* Final nudge */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted mb-4">
          Chaque nuit que tu perds renforce le cycle.
          <br />
          <span className="text-soft-white font-medium">
            Ce soir peut etre le debut du changement.
          </span>
        </p>
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Preparation..." : "Commencer ce soir"}
        </button>
      </div>
    </div>
  );
}
