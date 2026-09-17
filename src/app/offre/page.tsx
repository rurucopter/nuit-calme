"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  if (score >= 75) return "#10b981";
  if (score >= 50) return "#f5a623";
  if (score >= 30) return "#f0725c";
  return "#f43f5e";
}

function getScoreColorClass(score: number): string {
  if (score >= 75) return "text-mint";
  if (score >= 50) return "text-amber";
  if (score >= 30) return "text-orange";
  return "text-rose";
}

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        className="absolute animate-float-orb-1"
        style={{
          top: "10%", left: "15%", width: 180, height: 180, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.06), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute animate-float-orb-2"
        style={{
          top: "55%", right: "8%", width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,122,235,0.05), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}

function useCountdown(minutes: number) {
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    const key = "nuitcalme_countdown_end";
    let end = Number(localStorage.getItem(key));
    if (!end || end < Date.now()) {
      end = Date.now() + minutes * 60 * 1000;
      localStorage.setItem(key, String(end));
    }
    const tick = () => {
      const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return { h, m, s, expired: remaining <= 0 };
}

function AnimatedScore({
  from,
  to,
  color,
  targetColor,
}: {
  from: number;
  to: number;
  color: string;
  targetColor: string;
}) {
  const [current, setCurrent] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const dur = 1200;
    const start = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCurrent(Math.round(from + (to - from) * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, from, to]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (current / 100) * circumference;
  const strokeColor = current >= to * 0.8 ? targetColor : color;

  return (
    <div ref={ref} className="flex items-center justify-center gap-6">
      <div className="text-center">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(155,122,235,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (from / 100) * circumference}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{from}</span>
            <span className="text-[8px] text-muted-dark">maintenant</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-muted-dark text-lg">→</span>
        <span className="text-[10px] text-muted-dark">4 sem.</span>
      </div>

      <div className="text-center">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(155,122,235,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color: targetColor }}>
              {current}
            </span>
            <span className="text-[8px] text-muted-dark">objectif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const journeyWeeks = [
  {
    week: 1,
    title: "Installation",
    desc: "On pose les bases : rituel du soir, hygiene de lumiere, premiere routine.",
    emoji: "\u{1F331}",
    change: "+8 pts",
  },
  {
    week: 2,
    title: "Ajustement",
    desc: "On affine ton plan selon tes retours. Les premiers effets apparaissent.",
    emoji: "\u{1F504}",
    change: "+10 pts",
  },
  {
    week: 3,
    title: "Consolidation",
    desc: "Le cerveau integre les nouvelles habitudes. Endormissement plus rapide.",
    emoji: "\u{26A1}",
    change: "+12 pts",
  },
  {
    week: 4,
    title: "Autonomie",
    desc: "Ton sommeil est repare. Tu as les outils pour maintenir le cap.",
    emoji: "\u{1F3C6}",
    change: "+5 pts",
  },
];

const faqItems = [
  {
    q: "Ca marche vraiment en 4 semaines ?",
    a: "87% de nos utilisateurs voient une amelioration des la premiere semaine. Le programme de 4 semaines cible ta cause specifique pour des resultats durables.",
  },
  {
    q: "Et si ca ne marche pas pour moi ?",
    a: "Tu as 14 jours pour tester. Si tu ne vois aucune amelioration, on te rembourse integralement. Pas de questions, pas de justification.",
  },
  {
    q: "C'est quoi exactement le programme ?",
    a: "Un plan d'action personnalise base sur ta cause de mauvais sommeil : micro-habitudes quotidiennes, rituel du soir guide, sons d'ambiance, et suivi de tes progres.",
  },
  {
    q: "Je peux resilier quand je veux ?",
    a: "Oui. Resiliation en un clic depuis l'app. Pas de frais caches, pas d'engagement force.",
  },
];

export default function OffrePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState(false);
  const [cause, setCause] = useState("");
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [verdictTitle, setVerdictTitle] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  const countdown = useCountdown(45);

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
      setVerdictTitle(data.verdict.title);
    }
    if (data.answers) {
      const s = computeSleepScore(data.answers as unknown as Record<string, string>);
      setScore(s);
      setTargetScore(Math.min(s + 35, 92));
    }
    requestAnimationFrame(() => setShow(true));
  }, []);

  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => router.push("/installation"), 1500);
  };

  const price = plan === "annual" ? ANNUAL_PRICE : MONTHLY_PRICE;

  return (
    <div className="min-h-dvh relative">
      <FloatingOrbs />

      {/* Sticky countdown bar */}
      {!countdown.expired && (
        <div className="sticky top-0 z-40 glass-accent py-2 px-4 flex items-center justify-center gap-3 text-center">
          <span className="text-[10px] text-amber uppercase tracking-widest">Offre de lancement</span>
          <div className="flex gap-1">
            {[
              { v: countdown.h, l: "h" },
              { v: countdown.m, l: "m" },
              { v: countdown.s, l: "s" },
            ].map((t) => (
              <div key={t.l} className="flex items-center gap-0.5">
                <span className="bg-midnight/60 text-amber font-mono font-bold text-xs px-1.5 py-0.5 rounded">
                  {String(t.v).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-muted-dark">{t.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="flex flex-col px-5 py-6 max-w-lg mx-auto transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(15px)" }}
      >
        {/* Close button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-12 right-4 text-muted-dark/30 hover:text-muted-dark text-xs p-2 z-50"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            Ton programme est{" "}
            <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
              pret
            </span>
          </h1>
          <p className="text-muted text-sm max-w-xs mx-auto">
            4 semaines pour passer de{" "}
            <span className={`font-bold ${getScoreColorClass(score)}`}>{score}</span>
            {" "}a{" "}
            <span className="font-bold text-mint">{targetScore}</span>
            . Programme cible sur {cause}.
          </p>
        </div>

        {/* Score animation */}
        {score > 0 && (
          <div className="glass rounded-2xl p-5 mb-5">
            <p className="text-xs text-amber uppercase tracking-widest mb-4 text-center font-medium">
              Ton evolution prevue
            </p>
            <AnimatedScore
              from={score}
              to={targetScore}
              color={getScoreColor(score)}
              targetColor="#10b981"
            />
          </div>
        )}

        {/* 4-week journey */}
        <div className="glass rounded-2xl p-5 mb-5">
          <p className="text-xs text-amber uppercase tracking-widest mb-4 font-medium">
            Ton plan de 4 semaines
          </p>
          <div className="space-y-4">
            {journeyWeeks.map((w, i) => (
              <div key={w.week} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full glass-accent flex items-center justify-center text-base">
                    {w.emoji}
                  </div>
                  {i < 3 && <div className="w-px h-6 bg-gradient-to-b from-amber/30 to-transparent mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-soft-white">
                      S{w.week} — {w.title}
                    </p>
                    <span className="text-[10px] text-mint font-medium">{w.change}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What&apos;s included */}
        <div className="glass rounded-2xl p-5 mb-5">
          <p className="text-xs text-amber uppercase tracking-widest mb-4 font-medium">
            Ce que tu debloques
          </p>
          <div className="space-y-3">
            {[
              { icon: "\u{1F3AF}", text: "Programme 4 semaines contre " + cause },
              { icon: "\u{1F319}", text: "Rituel du soir guide — 10 min pour couper ton cerveau" },
              { icon: "\u{1F4CA}", text: "Suivi de ton score + detection de patterns" },
              { icon: "\u{1F50A}", text: "Sons d'ambiance + respiration guidee" },
              { icon: "\u{2705}", text: "Micro-habitudes calibrees sur ta cause" },
              { icon: "\u{1F513}", text: "Questions approfondies pour affiner ton plan" },
              { icon: "\u{1F4F1}", text: "App installable sur ton telephone" },
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
              plan === "annual" ? "glass-accent" : "glass-light hover:bg-white/[0.04]"
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
              </span>{" "}
              (moins qu&apos;un cafe)
            </p>
          </button>

          <button
            onClick={() => setPlan("monthly")}
            className={`w-full text-left rounded-2xl p-4 transition-all duration-200 ${
              plan === "monthly" ? "glass-accent" : "glass-light hover:bg-white/[0.04]"
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

        {/* Main CTA */}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-bold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-3 relative overflow-hidden"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" />
              Preparation...
            </span>
          ) : (
            <span className="relative z-10">
              Reparer mon sommeil — {price.toFixed(2).replace(".", ",")}€
              {plan === "annual" ? "/an" : "/mois"}
            </span>
          )}
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </button>

        {/* Trust badges */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-dark">
            <span>{"\u{1F512}"} Paiement securise</span>
            <span>{"\u{21A9}\u{FE0F}"} Rembourse 14j</span>
          </div>
        </div>

        {/* Guarantee */}
        <div className="glass-accent rounded-2xl p-5 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{"\u{1F6E1}\u{FE0F}"}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-soft-white mb-1">
                Garantie &ldquo;sommeil repare&rdquo; — 14 jours
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Si tu ne vois aucune amelioration en 14 jours, on te rembourse
                integralement. Pas de questions, pas de formulaire.
                Un email suffit.
              </p>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="glass-light rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex -space-x-2">
              {["\u{1F60A}", "\u{1F634}", "\u{1F642}", "\u{1F60C}"].map((e, i) => (
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
                +2 340 utilisateurs de 18-28 ans
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
                  <span key={i} className="text-amber text-xs">{"\u{2605}"}</span>
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed mb-2">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-xs text-muted-dark">— {t.name}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-6">
          <p className="text-xs text-amber uppercase tracking-widest mb-4 font-medium">
            Questions frequentes
          </p>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-soft-white font-medium pr-4">
                    {item.q}
                  </span>
                  <span
                    className="text-muted-dark text-xs transition-transform duration-200 flex-shrink-0"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "none" }}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openFaq === i ? 200 : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p className="text-xs text-muted leading-relaxed px-4 pb-3">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost comparison */}
        <div className="glass-light rounded-2xl p-4 mb-5">
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

        {/* Final CTA */}
        <div className="text-center mb-8">
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
            className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-bold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {loading ? "Preparation..." : "Commencer ce soir"}
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </button>
          <p className="text-[10px] text-muted-dark mt-2">
            Resiliation en un clic. Zero engagement cache. Zero jugement.
          </p>
        </div>
      </div>
    </div>
  );
}
