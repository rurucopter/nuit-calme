"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserData, getCurrentWeek } from "@/lib/storage";
import { Plan, CauseType } from "@/lib/types";
import { getHabitsForCause } from "@/lib/habits";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [cause, setCause] = useState<CauseType | null>(null);

  useEffect(() => {
    const data = getUserData();
    if (!data.plan) {
      router.push("/diagnostic");
      return;
    }
    setPlan(data.plan);
    setActiveWeek(getCurrentWeek());
    if (data.verdict) setCause(data.verdict.primaryCause);
  }, [router]);

  if (!plan) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentWeek = getCurrentWeek();
  const habits = cause ? getHabitsForCause(cause) : [];

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => router.back()}
          className="text-muted hover:text-soft-white transition-colors text-sm"
        >
          ← Retour
        </button>
        <Link href="/dashboard" className="text-sm glass-btn px-3 py-1.5 rounded-full text-amber">
          Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
        <p className="text-muted text-sm">{plan.description}</p>
      </div>

      {/* Week tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {plan.weeks.map((week) => {
          const isCurrent = week.number === currentWeek;
          const isActive = week.number === activeWeek;
          const isPast = week.number < currentWeek;
          return (
            <button
              key={week.number}
              onClick={() => setActiveWeek(week.number)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "glass-btn-solid text-midnight"
                  : isPast
                  ? "glass-light text-mint"
                  : "glass-light text-muted"
              } ${isCurrent && !isActive ? "ring-1 ring-amber/30" : ""}`}
            >
              S{week.number}
              {isPast && " ✓"}
            </button>
          );
        })}
      </div>

      {/* Active week content */}
      {plan.weeks
        .filter((w) => w.number === activeWeek)
        .map((week) => (
          <div key={week.number} className="animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{week.title}</h2>
                {week.number === currentWeek && (
                  <span className="px-2 py-0.5 rounded-full glass-btn text-amber text-xs">
                    En cours
                  </span>
                )}
              </div>
              <p className="text-muted text-sm">{week.subtitle}</p>
            </div>

            {/* Goals */}
            <div className="space-y-3 mb-8">
              {week.goals.map((goal, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl glass-light"
                >
                  <div className="w-6 h-6 rounded-full glass-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber text-xs">{i + 1}</span>
                  </div>
                  <p className="text-sm text-soft-white leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </div>

            {/* Daily habits */}
            {habits.length > 0 && (
              <div className="mb-8">
                <p className="text-xs text-muted mb-3 uppercase tracking-wider">Micro-habitudes quotidiennes</p>
                <div className="glass rounded-2xl p-4 space-y-2">
                  {habits.map((h) => (
                    <div key={h.id} className="flex items-center gap-3 py-2">
                      <span className="text-lg">{h.emoji}</span>
                      <span className="text-sm text-soft-white">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="p-4 rounded-xl glass border-lavender/15 mb-8" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
              <p className="text-xs text-lavender font-medium mb-1">
                💡 Conseil
              </p>
              <p className="text-sm text-muted leading-relaxed">{week.tip}</p>
            </div>
          </div>
        ))}

      {/* Bottom CTA */}
      <div className="mt-auto pt-6 space-y-3">
        <Link
          href="/ritual"
          className="block w-full text-center px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.01] active:scale-[0.99]"
        >
          Lancer le rituel du soir
        </Link>
        <Link
          href="/checkin"
          className="block w-full text-center px-6 py-3 rounded-2xl glass-btn text-amber text-sm"
        >
          Check-in du matin
        </Link>
      </div>
    </div>
  );
}
