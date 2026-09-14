"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions, analyzeDiagnostic } from "@/lib/diagnostic";
import { generatePlan } from "@/lib/plans";
import { saveUserData } from "@/lib/storage";
import { DiagnosticAnswers } from "@/lib/types";

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = questions.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;
  const question = questions[currentQ];

  const skipExerciseTime =
    question?.id === "exerciseTime" && answers.exerciseFrequency === "never";

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
          const verdict = analyzeDiagnostic(fullAnswers);
          const plan = generatePlan(verdict.primaryCause);

          saveUserData({
            onboardingComplete: true,
            answers: fullAnswers,
            verdict,
            plan,
            planStartDate: new Date().toISOString(),
            currentWeek: 1,
          });

          router.push("/verdict");
        } else {
          setCurrentQ(next);
          setIsTransitioning(false);
        }
      }, 300);
    },
    [answers, currentQ, isTransitioning, question, totalQuestions, router]
  );

  if (skipExerciseTime) {
    const updated = { ...answers, exerciseTime: "morning" };
    setAnswers(updated);
    setCurrentQ(currentQ + 1);
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
          <span className="text-xs text-muted">
            {currentQ + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-1 bg-navy-lighter rounded-full overflow-hidden">
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
              className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                answers[question.id] === opt.value
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-navy-lighter bg-navy-light/30 hover:border-navy-lighter hover:bg-navy-light/60 text-soft-white"
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
