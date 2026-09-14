"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserData } from "@/lib/storage";
import { Verdict } from "@/lib/types";

const causeIcons: Record<string, string> = {
  screen_addiction: "📱",
  late_caffeine: "☕",
  stress_rumination: "🧠",
  irregular_schedule: "⏰",
  late_exercise: "🏃",
  no_routine: "🌙",
};

export default function VerdictPage() {
  const router = useRouter();
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const data = getUserData();
    if (!data.verdict) {
      router.push("/diagnostic");
      return;
    }
    setVerdict(data.verdict);
    setTimeout(() => setRevealed(true), 800);
  }, [router]);

  if (!verdict) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber border-t-transparent animate-spin" />
      </div>
    );
  }

  const icon = causeIcons[verdict.primaryCause] ?? "🌙";

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-amber text-sm font-medium mb-2">Ton diagnostic</p>
        <h1 className="text-sm text-muted">Voici ce qu&apos;on a trouve</h1>
      </div>

      {/* Verdict reveal */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Icon */}
        <div
          className={`text-6xl mb-6 transition-all duration-1000 ${
            revealed ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          {icon}
        </div>

        {/* Stat */}
        <div
          className={`mb-6 text-center transition-all duration-700 delay-300 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-block px-6 py-3 rounded-2xl glass-accent">
            <p className="text-3xl font-bold text-amber">{verdict.stat}</p>
            <p className="text-xs text-amber/70 mt-1">{verdict.statLabel}</p>
          </div>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl md:text-3xl font-bold text-center mb-4 transition-all duration-700 delay-500 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {verdict.title}
        </h2>

        {/* Description */}
        <p
          className={`text-muted text-center leading-relaxed mb-8 transition-all duration-700 delay-700 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {verdict.description}
        </p>

        {/* Secondary causes */}
        {verdict.secondaryCauses.length > 0 && (
          <div
            className={`w-full p-4 rounded-2xl glass mb-8 transition-all duration-700 delay-1000 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-xs text-muted mb-2">
              Facteurs secondaires detectes :
            </p>
            <div className="flex flex-wrap gap-2">
              {verdict.secondaryCauses.map((cause) => (
                <span
                  key={cause}
                  className="px-3 py-1 rounded-full glass-light text-xs text-muted"
                >
                  {causeIcons[cause]} {causeLabel(cause)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className={`w-full space-y-3 transition-all duration-700 delay-1000 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/plan"
            className="block w-full text-center px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.01] active:scale-[0.99]"
          >
            Voir mon plan personnalise
          </Link>
          <Link
            href="/ritual"
            className="block w-full text-center px-8 py-3 rounded-2xl glass-btn text-amber hover:text-amber-light"
          >
            Lancer le rituel du soir
          </Link>
        </div>
      </div>
    </div>
  );
}

function causeLabel(cause: string): string {
  const labels: Record<string, string> = {
    screen_addiction: "Ecrans",
    late_caffeine: "Cafeine",
    stress_rumination: "Stress",
    irregular_schedule: "Horaires",
    late_exercise: "Sport tardif",
    no_routine: "Pas de routine",
  };
  return labels[cause] ?? cause;
}
