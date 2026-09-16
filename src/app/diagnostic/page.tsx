"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions, analyzeDiagnostic } from "@/lib/diagnostic";
import { generatePlan } from "@/lib/plans";
import { saveUserData } from "@/lib/storage";
import { DiagnosticAnswers, Verdict } from "@/lib/types";

type FunnelPhase = "quiz" | "analyzing" | "locked";

const causeLabels: Record<string, string> = {
  screen_addiction: "addiction aux ecrans",
  late_caffeine: "cafeine tardive",
  stress_rumination: "stress et ruminations",
  irregular_schedule: "horaires irreguliers",
  late_exercise: "sport tardif",
  no_routine: "absence de routine",
};

const causeConsequences: Record<string, { icon: string; lines: string[] }> = {
  screen_addiction: {
    icon: "\u{1F4F1}",
    lines: [
      "La lumiere bleue detruit ta melatonine depuis des mois",
      "Ton cerveau est encore en alerte quand tu fermes les yeux",
      "Chaque scroll repousse ton endormissement de 15 a 30 min",
      "Ton sommeil profond est reduit de 20%",
    ],
  },
  late_caffeine: {
    icon: "☕",
    lines: [
      "Ton cafe de l'apres-midi est encore actif dans ton sang a 23h",
      "La cafeine bloque le signal du sommeil dans ton cerveau",
      "Tu crois dormir, mais ton cerveau ne descend jamais en sommeil profond",
      "Plus tu es fatigue, plus tu bois — c'est un cercle vicieux",
    ],
  },
  stress_rumination: {
    icon: "\u{1F9E0}",
    lines: [
      "Ton systeme nerveux est bloque en mode combat permanent",
      "Ton cortisol monte au moment exact ou il devrait baisser",
      "Ton corps est epuise mais ton cerveau refuse de lacher",
      "Moins tu dors, plus tu stresses. Plus tu stresses, moins tu dors.",
    ],
  },
  irregular_schedule: {
    icon: "⏰",
    lines: [
      "Ton horloge interne ne sait plus quand produire la melatonine",
      "C'est comme un jet lag permanent — ton corps est perdu",
      "Tes phases de sommeil profond sont desynchronisees",
      '"Rattraper le week-end" ne rattrape rien — la dette s\'accumule',
    ],
  },
  late_exercise: {
    icon: "\u{1F3C3}",
    lines: [
      "Le sport du soir booste ton adrenaline au mauvais moment",
      "Ta temperature corporelle reste elevee 2-3h apres l'effort",
      "Ton corps veut dormir mais ta physiologie dit 'action'",
      "Tu t'endors 30 a 45 min plus tard qu'en t'entrainant le matin",
    ],
  },
  no_routine: {
    icon: "\u{1F319}",
    lines: [
      "Ton cerveau n'a aucun signal pour comprendre que c'est fini",
      "Tu passes du mode actif au mode dodo sans transition",
      "Sans rituel, ton endormissement depend du hasard",
      "Chaque soir, c'est comme si ton cerveau decouvrait le concept de dormir",
    ],
  },
};

function computeSleepScore(answers: Partial<DiagnosticAnswers>): number {
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

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Correct", color: "text-mint" };
  if (score >= 50) return { label: "Degrade", color: "text-amber" };
  if (score >= 30) return { label: "Critique", color: "text-orange" };
  return { label: "Alarme", color: "text-rose" };
}

function AnalyzingPhase({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyse de tes reponses...",
    "Croisement avec 2 340 profils similaires...",
    "Identification du pattern principal...",
    "Calcul de ton score de sommeil...",
    "Generation de ton bilan personnalise...",
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 700));
    });
    timers.push(setTimeout(onDone, steps.length * 700 + 500));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-full border-2 border-amber border-t-transparent animate-spin mb-8" />
      <p className="text-xs text-muted-dark mb-6 uppercase tracking-widest">
        Ne ferme pas cette page
      </p>
      <div className="space-y-3 w-full max-w-sm">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-3 transition-all duration-500 ${
              i <= step ? "opacity-100" : "opacity-0 translate-y-2"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors duration-300 ${
                i < step
                  ? "bg-amber text-midnight"
                  : i === step
                    ? "border border-amber text-amber animate-pulse"
                    : "border border-muted-dark"
              }`}
            >
              {i < step ? "✓" : ""}
            </span>
            <span className="text-sm text-muted">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockedResultsPhase({
  score,
  verdict,
}: {
  score: number;
  verdict: Verdict;
}) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const { label, color } = getScoreLabel(score);
  const data =
    causeConsequences[verdict.primaryCause] ?? causeConsequences.no_routine;
  const yearsLost = score < 30 ? "5-7" : score < 50 ? "3-5" : "1-3";
  const targetScore = Math.min(score + 35, 92);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Background: score + consequences — always blurred */}
      <div
        className="min-h-dvh flex flex-col items-center justify-start px-6 pt-12 pb-32"
        style={{
          filter: "blur(12px)",
          transform: "scale(1.02)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="max-w-md w-full text-center">
          {/* Score circle */}
          <p className="text-xs uppercase tracking-widest text-muted-dark mb-4">
            Ton score de sommeil
          </p>
          <div className="relative w-36 h-36 mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="rgba(155,122,235,0.1)" strokeWidth="8"
              />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={
                  score >= 75 ? "#10b981" : score >= 50 ? "#f5a623" : score >= 30 ? "#f0725c" : "#f43f5e"
                }
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${color}`}>{score}</span>
              <span className="text-[10px] text-muted-dark">/100</span>
            </div>
          </div>

          <div className="inline-block glass-accent rounded-full px-4 py-1.5 mb-3">
            <span className={`text-sm font-bold ${color}`}>Niveau : {label}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{verdict.title}</h2>
          <p className="text-sm text-muted mb-8">
            Cause principale :{" "}
            <span className="text-soft-white font-medium">
              {causeLabels[verdict.primaryCause]}
            </span>
          </p>

          {/* Consequences */}
          <div className="text-5xl mb-4">{data.icon}</div>
          <div className="space-y-3 text-left mb-6">
            {data.lines.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-rose text-[10px]">!</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{line}</p>
              </div>
            ))}
          </div>

          {/* Cost card */}
          <div className="glass rounded-2xl p-4">
            <p className="text-rose text-xs uppercase tracking-widest mb-3 font-medium">
              Ce que ca te coute
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "-40%", l: "concentration" },
                { value: yearsLost + " ans", l: "esperance de vie" },
                { value: "x2", l: "risque burn-out" },
              ].map((item) => (
                <div key={item.l} className="text-center">
                  <p className="text-lg font-bold text-rose">{item.value}</p>
                  <p className="text-[9px] text-muted-dark">{item.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay CTA — appears when blur kicks in */}
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-all duration-700"
        style={{
          opacity: showOverlay ? 1 : 0,
          pointerEvents: showOverlay ? "auto" : "none",
        }}
      >
        {/* Gradient scrim — thin enough to see blurred content underneath */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/60 to-midnight/85" />

        <div className="relative z-10 max-w-sm w-full text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full glass-accent flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">{"\u{1F512}"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            Ton resultat est{" "}
            <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
              pret
            </span>
          </h2>

          <p className="text-muted text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            Score, cause, programme personnalise —{" "}
            <span className="text-soft-white font-medium">
              tout est la. Debloque-le.
            </span>
          </p>

          {/* Mini score preview */}
          <div className="glass rounded-2xl p-4 mb-5 text-left">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(155,122,235,0.1)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={score >= 75 ? "#10b981" : score >= 50 ? "#f5a623" : score >= 30 ? "#f0725c" : "#f43f5e"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (score / 100) * circumference}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold ${color}`}>{score}</span>
                </div>
              </div>
              <div>
                <p className="text-soft-white font-semibold text-sm">
                  Score : <span className="text-rose">{score}</span>
                  {" → "}
                  <span className="text-mint">{targetScore}</span>
                </p>
                <p className="text-xs text-muted">en 4 semaines</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                "\u{1F3AF} Programme personnalise contre " + causeLabels[verdict.primaryCause],
                "\u{1F319} Rituel du soir guide — 10 min",
                "\u{1F4CA} Suivi quotidien de tes progres",
              ].map((text) => (
                <p key={text} className="text-xs text-muted">{text}</p>
              ))}
            </div>
          </div>

          {/* Social proof line */}
          <p className="text-xs text-muted mb-4">
            <span className="text-amber font-bold">87%</span> de reussite —{" "}
            <span className="text-soft-white/80">+2 340 personnes</span> comme toi
          </p>

          {/* Main CTA */}
          <button
            onClick={() => router.push("/offre")}
            className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-bold text-lg hover:scale-[1.02] active:scale-[0.98] mb-3"
          >
            Debloquer mon resultat
          </button>

          <p className="text-[10px] text-muted-dark">
            0,16€/jour · Satisfait ou rembourse 14j · Resultat des la 1ere semaine
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<FunnelPhase>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [sleepScore, setSleepScore] = useState(0);

  const totalQuestions = questions.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;
  const question = questions[currentQ];

  const handleAnswer = useCallback(
    (value: string) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      const updated = { ...answers, [question.id]: value };
      setAnswers(updated);

      setTimeout(() => {
        const next = currentQ + 1;

        if (next >= totalQuestions) {
          const v = analyzeDiagnostic(updated);
          const score = computeSleepScore(updated);
          const plan = generatePlan(v.primaryCause);

          saveUserData({
            onboardingComplete: true,
            answers: updated as DiagnosticAnswers,
            verdict: v,
            plan,
            planStartDate: new Date().toISOString(),
            currentWeek: 1,
          });

          setVerdict(v);
          setSleepScore(score);
          setPhase("analyzing");
        } else {
          setCurrentQ(next);
          setIsTransitioning(false);
        }
      }, 300);
    },
    [answers, currentQ, isTransitioning, question, totalQuestions]
  );

  const goToLocked = useCallback(() => setPhase("locked"), []);

  if (phase === "analyzing") {
    return <AnalyzingPhase onDone={goToLocked} />;
  }

  if (phase === "locked" && verdict) {
    return <LockedResultsPhase score={sleepScore} verdict={verdict} />;
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (currentQ > 0) setCurrentQ(currentQ - 1);
              else router.push("/");
            }}
            className="text-muted hover:text-soft-white transition-colors text-sm"
          >
            ← Retour
          </button>
          <span className="text-xs glass-light px-3 py-1 rounded-full text-muted">
            {currentQ + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-1.5 glass rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber to-orange rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-dark text-right mt-1.5">
          Encore {totalQuestions - currentQ - 1} question
          {totalQuestions - currentQ - 1 > 1 ? "s" : ""}
        </p>
      </div>

      {/* Question */}
      <div
        className={`flex-1 flex flex-col justify-center transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
          {question.question}
        </h1>
        {question.subtitle && (
          <p className="text-muted text-sm mb-8">{question.subtitle}</p>
        )}
        {!question.subtitle && <div className="mb-8" />}

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                answers[question.id as keyof DiagnosticAnswers] === opt.value
                  ? "glass-accent text-amber"
                  : "glass-light hover:bg-white/[0.06] text-soft-white"
              }`}
            >
              <span className="flex items-center gap-3">
                {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                <span className="font-medium">{opt.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
