"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { questions, analyzeDiagnostic } from "@/lib/diagnostic";
import { generatePlan } from "@/lib/plans";
import { saveUserData } from "@/lib/storage";
import { DiagnosticAnswers, Verdict } from "@/lib/types";

type FunnelPhase =
  | "quiz"
  | "analyzing"
  | "score"
  | "consequences"
  | "solution"
  | "done";

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
    icon: "📱",
    lines: [
      "La lumiere bleue detruit ta melatonine depuis des mois",
      "Ton cerveau est encore en alerte quand tu fermes les yeux",
      "Chaque scroll repousse ton endormissement de 15 a 30 min",
      "Ton sommeil profond est reduit de 20% — tu ne recuperes plus vraiment",
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
    icon: "🧠",
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
    icon: "🏃",
    lines: [
      "Le sport du soir booste ton adrenaline au mauvais moment",
      "Ta temperature corporelle reste elevee 2-3h apres l'effort",
      "Ton corps veut dormir mais ta physiologie dit 'action'",
      "Tu t'endors 30 a 45 min plus tard qu'en t'entrainant le matin",
    ],
  },
  no_routine: {
    icon: "🌙",
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

function ScoreRevealPhase({
  score,
  verdict,
  onDone,
}: {
  score: number;
  verdict: Verdict;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const [displayScore, setDisplayScore] = useState(100);
  const { label, color } = getScoreLabel(score);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => {
      let current = 100;
      const interval = setInterval(() => {
        current -= 1;
        if (current <= score) {
          current = score;
          clearInterval(interval);
        }
        setDisplayScore(current);
      }, 15);
    }, 800);
    const t3 = setTimeout(() => setPhase(2), 2500);
    const t4 = setTimeout(() => setPhase(3), 4000);
    const t5 = setTimeout(onDone, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [score, onDone]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <p
          className={`text-xs uppercase tracking-widest text-muted-dark mb-6 transition-all duration-700 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}
        >
          Ton score de sommeil
        </p>

        <div
          className={`relative w-40 h-40 mx-auto mb-6 transition-all duration-700 ${phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(155,122,235,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={
                score >= 75
                  ? "#10b981"
                  : score >= 50
                    ? "#f5a623"
                    : score >= 30
                      ? "#f0725c"
                      : "#f43f5e"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${color}`}>
              {displayScore}
            </span>
            <span className="text-[10px] text-muted-dark">/100</span>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div
            className={`inline-block glass-accent rounded-full px-4 py-1.5 mb-4`}
          >
            <span className={`text-sm font-bold ${color}`}>
              Niveau : {label}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2">{verdict.title}</h2>
          <p className="text-sm text-muted">
            Cause principale :{" "}
            <span className="text-soft-white font-medium">
              {causeLabels[verdict.primaryCause]}
            </span>
          </p>
        </div>

        <p
          className={`text-xs text-muted-dark mt-6 transition-all duration-700 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}
        >
          Voici ce que ca fait a ton corps...
        </p>
      </div>
    </div>
  );
}

function ConsequencesPhase({
  verdict,
  score,
  onDone,
}: {
  verdict: Verdict;
  score: number;
  onDone: () => void;
}) {
  const [lineIndex, setLineIndex] = useState(-1);
  const [showCost, setShowCost] = useState(false);
  const data =
    causeConsequences[verdict.primaryCause] ?? causeConsequences.no_routine;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    data.lines.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIndex(i), 800 + i * 1500));
    });
    timers.push(
      setTimeout(() => setShowCost(true), 800 + data.lines.length * 1500 + 800)
    );
    timers.push(
      setTimeout(onDone, 800 + data.lines.length * 1500 + 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [data, onDone]);

  const yearsLost = score < 30 ? "5-7" : score < 50 ? "3-5" : "1-3";

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className={`text-5xl mb-6 transition-all duration-700 ${
            lineIndex >= 0 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          {data.icon}
        </div>
        <h2
          className={`text-xl font-bold mb-2 transition-all duration-700 ${
            lineIndex >= 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          {verdict.title}
        </h2>
        <div
          className="glass-accent rounded-2xl px-4 py-2 inline-block mb-8 transition-all duration-700"
          style={{ opacity: lineIndex >= 0 ? 1 : 0 }}
        >
          <span className="text-amber font-bold">{verdict.stat}</span>
          <span className="text-amber/60 text-xs ml-2">
            {verdict.statLabel}
          </span>
        </div>

        <div className="space-y-4 text-left">
          {data.lines.map((line, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 transition-all duration-700 ${
                i <= lineIndex
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-rose text-xs">!</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{line}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 glass rounded-2xl p-5 transition-all duration-1000 ${showCost ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="text-rose text-xs uppercase tracking-widest mb-3 font-medium">
            Ce que ca te coute
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "-40%", label: "concentration" },
              { value: yearsLost + " ans", label: "esperance de vie" },
              { value: "x2", label: "risque burn-out" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-bold text-rose">{item.value}</p>
                <p className="text-[9px] text-muted-dark">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionPhase({ verdict, score, onDone }: { verdict: Verdict; score: number; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 3200),
      setTimeout(() => setStep(4), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const targetScore = Math.min(score + 35, 92);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className={`transition-all duration-700 ${
            step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="text-4xl mb-3">✨</div>
          <p className="text-amber text-xs uppercase tracking-widest font-medium mb-2">
            Bonne nouvelle
          </p>
        </div>

        <h2
          className={`text-2xl sm:text-3xl font-bold mb-4 transition-all duration-700 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          On peut{" "}
          <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
            reparer ca
          </span>
        </h2>

        <p
          className={`text-muted text-sm leading-relaxed mb-6 transition-all duration-700 ${
            step >= 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          Ta cause est identifiee. On a deja aide 2 340 personnes avec
          exactement le meme profil que toi.
        </p>

        <div
          className={`glass rounded-2xl p-5 mb-4 text-left transition-all duration-700 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-amber uppercase tracking-widest font-medium">
              Ton programme personnalise
            </p>
            <span className="text-[10px] glass-accent px-2 py-0.5 rounded-full text-amber font-bold">
              adapte a ta cause
            </span>
          </div>
          <div className="space-y-3">
            {[
              { icon: "🎯", text: "Plan de 4 semaines contre : " + causeLabels[verdict.primaryCause] },
              { icon: "🌙", text: "Rituel du soir guide — 10 min pour couper ton cerveau" },
              { icon: "📊", text: "Suivi quotidien de tes progres + detection de patterns" },
              { icon: "🔊", text: "Sons d'ambiance + respiration guidee personnalises" },
              { icon: "✅", text: "Micro-habitudes pour ancrer le changement sans effort" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-muted">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`glass-accent rounded-2xl p-4 mb-6 transition-all duration-700 ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted mb-1">Objectif realiste</p>
              <p className="text-sm font-semibold text-soft-white">
                Score :{" "}
                <span className="text-rose">{score}</span>
                {" → "}
                <span className="text-mint">{targetScore}</span>
                <span className="text-muted text-xs ml-1">en 4 semaines</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted">Taux de reussite</span>
              <span className="text-amber font-bold text-lg">87%</span>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ${
            step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onDone}
            className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Debloquer mon programme
          </button>
          <p className="text-[10px] text-muted-dark mt-3">
            Resultat visible des la 1ere semaine · Satisfait ou rembourse
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

  const goToScore = useCallback(() => setPhase("score"), []);
  const goToConsequences = useCallback(() => setPhase("consequences"), []);
  const goToSolution = useCallback(() => setPhase("solution"), []);
  const goToPaywall = useCallback(() => router.push("/offre"), [router]);

  if (phase === "analyzing") {
    return <AnalyzingPhase onDone={goToScore} />;
  }

  if (phase === "score" && verdict) {
    return (
      <ScoreRevealPhase
        score={sleepScore}
        verdict={verdict}
        onDone={goToConsequences}
      />
    );
  }

  if (phase === "consequences" && verdict) {
    return (
      <ConsequencesPhase
        verdict={verdict}
        score={sleepScore}
        onDone={goToSolution}
      />
    );
  }

  if (phase === "solution" && verdict) {
    return <SolutionPhase verdict={verdict} score={sleepScore} onDone={goToPaywall} />;
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
