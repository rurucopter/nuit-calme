"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserData, getStreak, getCurrentWeek } from "@/lib/storage";
import { UserData, DailyCheckIn } from "@/lib/types";
import {
  detectPatterns,
  getHabitCompletionRate,
  getHabitsForCause,
} from "@/lib/habits";
import type { PatternInsight } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [streak, setStreak] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [habitRate, setHabitRate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const d = getUserData();
    if (!d.onboardingComplete) {
      router.push("/diagnostic");
      return;
    }
    setData(d);
    setStreak(getStreak());
    setCurrentWeek(getCurrentWeek());
    setInsights(detectPatterns(d.checkIns));
    setHabitRate(getHabitCompletionRate(d.habitCompletions));
  }, [router]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 10, bottom: 30, left: 30 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const last7 = getLast7Days(data.checkIns);

    ctx.strokeStyle = "rgba(148,163,184,0.1)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y = padding.top + chartH - (i / 5) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    last7.forEach((d, i) => {
      const x = padding.left + (i / (last7.length - 1 || 1)) * chartW;
      ctx.fillText(d.label, x, h - 8);
    });

    ctx.textAlign = "right";
    ctx.fillText("5", padding.left - 6, padding.top + 4);
    ctx.fillText("1", padding.left - 6, h - padding.bottom + 4);

    if (last7.some((d) => d.quality > 0)) {
      const gradient = ctx.createLinearGradient(
        0,
        padding.top,
        0,
        h - padding.bottom
      );
      gradient.addColorStop(0, "rgba(245,158,11,0.25)");
      gradient.addColorStop(1, "rgba(245,158,11,0)");

      const points = last7
        .map((d, i) => {
          if (d.quality === 0) return null;
          return {
            x: padding.left + (i / (last7.length - 1 || 1)) * chartW,
            y: padding.top + chartH - (d.quality / 5) * chartH,
          };
        })
        .filter(Boolean) as { x: number; y: number }[];

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, h - padding.bottom);
        ctx.lineTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const cp1x =
            points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
          const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
          ctx.bezierCurveTo(
            cp1x,
            points[i - 1].y,
            cp2x,
            points[i].y,
            points[i].x,
            points[i].y
          );
        }
        ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const cp1x =
            points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
          const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
          ctx.bezierCurveTo(
            cp1x,
            points[i - 1].y,
            cp2x,
            points[i].y,
            points[i].x,
            points[i].y
          );
        }
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();

        points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#f59e0b";
          ctx.fill();
        });
      }
    }
  }, [data]);

  useEffect(() => {
    drawChart();
    window.addEventListener("resize", drawChart);
    return () => window.removeEventListener("resize", drawChart);
  }, [drawChart]);

  if (!data) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber border-t-transparent animate-spin" />
      </div>
    );
  }

  const ritualRate = getRitualRate(data.checkIns);
  const avgQuality = getAvgQuality(data.checkIns);
  const habits = data.verdict
    ? getHabitsForCause(data.verdict.primaryCause)
    : [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayHabits = data.habitCompletions[todayStr] ?? {};

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Nuit Calme</h1>
          <p className="text-muted text-xs">Semaine {currentWeek} / 4</p>
        </div>
        <Link
          href="/"
          className="text-muted text-sm glass-btn px-3 py-1.5 rounded-full hover:text-soft-white transition-colors"
        >
          Accueil
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl glass text-center">
          <p className="text-2xl font-bold text-amber">{streak}</p>
          <p className="text-xs text-muted mt-1">jours de suite</p>
        </div>
        <div className="p-4 rounded-2xl glass text-center">
          <p className="text-2xl font-bold text-mint">{ritualRate}%</p>
          <p className="text-xs text-muted mt-1">rituels suivis</p>
        </div>
        <div className="p-4 rounded-2xl glass text-center">
          <p className="text-2xl font-bold text-lavender">
            {avgQuality > 0 ? avgQuality.toFixed(1) : "-"}
          </p>
          <p className="text-xs text-muted mt-1">qualite moy.</p>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2 mb-6">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl glass ${
                insight.type === "warning"
                  ? "border-rose/20"
                  : insight.type === "positive"
                  ? "border-mint/20"
                  : "border-amber/15"
              }`}
              style={{
                borderColor:
                  insight.type === "warning"
                    ? "rgba(244,63,94,0.2)"
                    : insight.type === "positive"
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(245,158,11,0.15)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{insight.emoji}</span>
                <div>
                  <p className="text-sm font-medium mb-0.5">{insight.title}</p>
                  <p className="text-xs text-muted leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="p-4 rounded-2xl glass mb-6">
        <p className="text-xs text-muted mb-3">
          Qualite du sommeil — 7 derniers jours
        </p>
        <canvas
          ref={canvasRef}
          className="w-full h-40"
          style={{ display: "block" }}
        />
        {data.checkIns.length === 0 && (
          <p className="text-xs text-muted-dark text-center mt-2">
            Pas encore de donnees. Fais ton premier check-in demain matin !
          </p>
        )}
      </div>

      {/* Habit completion */}
      {habits.length > 0 && (
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted uppercase tracking-wider">
              Habitudes du jour
            </p>
            {habitRate > 0 && (
              <span className="text-xs glass-btn px-2 py-0.5 rounded-full text-amber">
                {habitRate}% cette semaine
              </span>
            )}
          </div>
          <div className="space-y-2">
            {habits.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-3 py-1.5"
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                    todayHabits[h.id]
                      ? "bg-amber border-amber text-midnight"
                      : "border-muted-dark"
                  }`}
                >
                  {todayHabits[h.id] && "✓"}
                </span>
                <span className="text-sm">{h.emoji}</span>
                <span
                  className={`text-sm ${
                    todayHabits[h.id] ? "text-muted line-through" : ""
                  }`}
                >
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan progress */}
      {data.plan && (
        <Link
          href="/plan"
          className="block p-4 rounded-2xl glass mb-6 hover:border-amber/20 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{data.plan.title}</p>
            <span className="text-xs glass-btn px-2 py-0.5 rounded-full text-amber">
              S{currentWeek}/4 →
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((w) => (
              <div
                key={w}
                className={`flex-1 h-1.5 rounded-full ${
                  w < currentWeek
                    ? "bg-mint"
                    : w === currentWeek
                    ? "bg-amber"
                    : "bg-navy-lighter/50"
                }`}
              />
            ))}
          </div>
        </Link>
      )}

      {/* Verdict reminder */}
      {data.verdict && (
        <Link
          href="/verdict"
          className="block p-4 rounded-2xl glass-accent mb-6 hover:border-amber/25 transition-colors"
        >
          <p className="text-xs text-amber/60 mb-1">Ton diagnostic</p>
          <p className="text-sm font-medium">{data.verdict.title}</p>
        </Link>
      )}

      {/* Actions */}
      <div className="mt-auto space-y-3 pt-6">
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

function getLast7Days(
  checkIns: DailyCheckIn[]
): { label: string; quality: number; ritual: boolean }[] {
  const days: { label: string; quality: number; ritual: boolean }[] = [];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const check = checkIns.find((c) => c.date === dateStr);
    days.push({
      label: dayNames[d.getDay()],
      quality: check?.sleepQuality ?? 0,
      ritual: check?.followedRitual ?? false,
    });
  }
  return days;
}

function getRitualRate(checkIns: DailyCheckIn[]): number {
  if (checkIns.length === 0) return 0;
  const followed = checkIns.filter((c) => c.followedRitual).length;
  return Math.round((followed / checkIns.length) * 100);
}

function getAvgQuality(checkIns: DailyCheckIn[]): number {
  if (checkIns.length === 0) return 0;
  const sum = checkIns.reduce((acc, c) => acc + c.sleepQuality, 0);
  return sum / checkIns.length;
}
