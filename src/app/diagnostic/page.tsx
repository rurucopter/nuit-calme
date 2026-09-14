"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions, analyzeDiagnostic } from "@/lib/diagnostic";
import { generatePlan } from "@/lib/plans";
import { saveUserData } from "@/lib/storage";
import { DiagnosticAnswers, Verdict } from "@/lib/types";

type FunnelPhase = "quiz" | "analyzing" | "consequences" | "solution" | "done";

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
      "La lumiere bleue bloque ta melatonine depuis des mois",
      "Ton cerveau est encore en mode alerte quand tu fermes les yeux",
      "Chaque scroll repousse ton endormissement de 15 a 30 min",
      "Ton sommeil profond est reduit de 20% — tu ne recuperes plus",
    ],
  },
  late_caffeine: {
    icon: "☕",
    lines: [
      "Ton cafe de l'apres-midi est encore actif a 23h",
      "La cafeine bloque tes recepteurs d'adenosine — le signal du sommeil",
      "Tu dors, mais ton cerveau ne descend pas en sommeil profond",
      "Apres des semaines, ton corps s'habitue — tu bois plus, tu dors moins",
    ],
  },
  stress_rumination: {
    icon: "🧠",
    lines: [
      "Ton systeme nerveux est bloque en mode 'combat ou fuite'",
      "Les pensees en boucle activent ton cortisol au moment de dormir",
      "Ton corps est epuise mais ton cerveau refuse de lacher prise",
      "Ce cercle vicieux s'aggrave : moins de sommeil = plus de stress",
    ],
  },
  irregular_schedule: {
    icon: "⏰",
    lines: [
      "Ton horloge interne ne sait plus quand produire la melatonine",
      "C'est comme changer de fuseau horaire tous les 2 jours",
      "Tes phases de sommeil profond sont desynchronisees",
      "La fatigue s'accumule meme quand tu 'rattrapes' le week-end",
    ],
  },
  late_exercise: {
    icon: "🏃",
    lines: [
      "Le sport du soir booste ta temperature corporelle",
      "L'adrenaline et le cortisol restent eleves 2-3h apres l'effort",
      "Ton corps veut dormir mais ta physiologie dit 'action'",
      "Tu t'endors 30 a 45 min plus tard qu'en faisant du sport le matin",
    ],
  },
  no_routine: {
    icon: "🌙",
    lines: [
      "Sans signal de fin de journee, ton cerveau reste en mode actif",
      "La transition eveil → sommeil prend du temps sans rituel",
      "Tu passes du canape au lit en esperant que ca marche",
      "Sans routine, ton sommeil depend du hasard — pas de regularite",
    ],
  },
};

function AnalyzingPhase({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyse de tes habitudes...",
    "Detection des patterns...",
    "Identification de la cause principale...",
    "Preparation de ton bilan...",
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 800));
    });
    timers.push(setTimeout(onDone, steps.length * 800 + 600));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full border-2 border-amber border-t-transparent animate-spin mb-8" />
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

function ConsequencesPhase({
  verdict,
  onDone,
}: {
  verdict: Verdict;
  onDone: () => void;
}) {
  const [lineIndex, setLineIndex] = useState(-1);
  const data = causeConsequences[verdict.primaryCause] ?? causeConsequences.no_routine;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    data.lines.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIndex(i), 1000 + i * 1800));
    });
    timers.push(
      setTimeout(onDone, 1000 + data.lines.length * 1800 + 1200)
    );
    return () => timers.forEach(clearTimeout);
  }, [data, onDone]);

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
        <div className="glass-accent rounded-2xl px-4 py-2 inline-block mb-8 transition-all duration-700"
          style={{ opacity: lineIndex >= 0 ? 1 : 0 }}
        >
          <span className="text-amber font-bold">{verdict.stat}</span>
          <span className="text-amber/60 text-xs ml-2">{verdict.statLabel}</span>
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
      </div>
    </div>
  );
}

function SolutionPhase({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3500),
      setTimeout(() => setStep(4), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className={`transition-all duration-1000 ${
            step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="inline-flex items-center gap-2 glass-accent rounded-full px-5 py-2 mb-6">
            <span className="text-amber text-sm font-medium">
              Top 10%
            </span>
          </div>
        </div>

        <h2
          className={`text-2xl sm:text-3xl font-bold mb-4 transition-all duration-700 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Tu fais partie des{" "}
          <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
            10% qui passent a l&apos;action
          </span>
        </h2>

        <p
          className={`text-muted leading-relaxed mb-6 transition-all duration-700 ${
            step >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          La plupart des gens savent qu&apos;ils dorment mal.
          <br />
          Toi, tu as pris 2 minutes pour comprendre <span className="text-soft-white font-medium">pourquoi</span>.
        </p>

        <div
          className={`glass rounded-2xl p-5 mb-8 text-left transition-all duration-700 ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xs text-amber uppercase tracking-widest mb-3">
            Ce qu&apos;on a prepare pour toi
          </p>
          <div className="space-y-3">
            {[
              { icon: "🎯", text: "Plan de 4 semaines adapte a ta cause" },
              { icon: "🌙", text: "Rituel du soir personnalise" },
              { icon: "📊", text: "Suivi de tes progres avec detection de patterns" },
              { icon: "✅", text: "Micro-habitudes quotidiennes pour ancrer le changement" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-sm text-muted">{item.text}</span>
              </div>
            ))}
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
          <p className="text-xs text-muted-dark mt-3">
            Resultat garanti ou rembourse
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
        let next = currentQ + 1;

        if (
          questions[next]?.id === "exerciseTime" &&
          updated.exerciseFrequency === "never"
        ) {
          const withSkip = { ...updated, exerciseTime: "morning" };
          setAnswers(withSkip);
          next++;
        }

        if (next >= totalQuestions) {
          const fullAnswers = updated as DiagnosticAnswers;
          if (!fullAnswers.exerciseTime) fullAnswers.exerciseTime = "morning";
          const v = analyzeDiagnostic(fullAnswers);
          const plan = generatePlan(v.primaryCause);

          saveUserData({
            onboardingComplete: true,
            answers: fullAnswers,
            verdict: v,
            plan,
            planStartDate: new Date().toISOString(),
            currentWeek: 1,
          });

          setVerdict(v);
          setPhase("analyzing");
        } else {
          setCurrentQ(next);
          setIsTransitioning(false);
        }
      }, 300);
    },
    [answers, currentQ, isTransitioning, question, totalQuestions]
  );

  const skipExerciseTime =
    question?.id === "exerciseTime" && answers.exerciseFrequency === "never";

  useEffect(() => {
    if (skipExerciseTime) {
      setAnswers((prev) => ({ ...prev, exerciseTime: "morning" }));
      setCurrentQ((prev) => prev + 1);
    }
  }, [skipExerciseTime]);

  const goToConsequences = useCallback(() => setPhase("consequences"), []);
  const goToSolution = useCallback(() => setPhase("solution"), []);
  const goToPaywall = useCallback(() => router.push("/offre"), [router]);

  if (phase === "analyzing") {
    return <AnalyzingPhase onDone={goToConsequences} />;
  }

  if (phase === "consequences" && verdict) {
    return <ConsequencesPhase verdict={verdict} onDone={goToSolution} />;
  }

  if (phase === "solution") {
    return <SolutionPhase onDone={goToPaywall} />;
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
                answers[question.id] === opt.value
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
