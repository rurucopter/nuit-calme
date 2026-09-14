"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { playSound, stopSound, soundLabels } from "@/lib/sounds";
import { getUserData, saveUserData } from "@/lib/storage";
import {
  nightlightThemes,
  breathingExercises,
  getRecommendedTheme,
  getRecommendedExercise,
} from "@/lib/habits";
import { AmbientSound, NightlightTheme, BreathingExercise } from "@/lib/types";

type RitualPhase = "welcome" | "nightlight" | "breathing" | "complete";

const ambientSounds: AmbientSound[] = [
  "rain",
  "ocean",
  "forest",
  "wind",
  "whitenoise",
  "none",
];

export default function RitualPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<RitualPhase>("welcome");
  const [activeSound, setActiveSound] = useState<AmbientSound>("rain");
  const [volume, setVolume] = useState(0.5);
  const [selectedTheme, setSelectedTheme] = useState<NightlightTheme>("braise");
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise>("breathing-478");
  const [breathPhaseIdx, setBreathPhaseIdx] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const data = getUserData();
    if (data.verdict) {
      const rec = getRecommendedTheme(data.verdict.primaryCause);
      const recEx = getRecommendedExercise(data.verdict.primaryCause);
      setSelectedTheme(
        (data.ritualPreferences?.theme ?? rec) as NightlightTheme
      );
      setSelectedExercise(
        (data.ritualPreferences?.defaultExercise ?? recEx) as BreathingExercise
      );
      if (data.ritualPreferences?.defaultSound) {
        setActiveSound(data.ritualPreferences.defaultSound);
      }
    }
    return () => {
      stopSound();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathingRef.current) clearTimeout(breathingRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning]);

  const handleSoundChange = useCallback(
    (sound: AmbientSound) => {
      setActiveSound(sound);
      playSound(sound, volume);
    },
    [volume]
  );

  const startNightlight = useCallback(() => {
    setPhase("nightlight");
    playSound(activeSound, volume);
    setIsTimerRunning(true);
  }, [activeSound, volume]);

  const exercise = breathingExercises[selectedExercise];

  const startBreathing = useCallback(() => {
    setPhase("breathing");
    setBreathCount(0);
    setBreathPhaseIdx(0);
  }, []);

  useEffect(() => {
    if (phase !== "breathing") return;

    const ex = breathingExercises[selectedExercise];
    if (!ex) return;

    const runPhase = (phaseIdx: number, cycle: number) => {
      if (cycle >= ex.cycles) {
        setPhase("complete");
        setIsTimerRunning(false);
        return;
      }
      setBreathPhaseIdx(phaseIdx);
      const currentPhase = ex.phases[phaseIdx];
      breathingRef.current = setTimeout(() => {
        const nextPhaseIdx = phaseIdx + 1;
        if (nextPhaseIdx >= ex.phases.length) {
          setBreathCount(cycle + 1);
          runPhase(0, cycle + 1);
        } else {
          runPhase(nextPhaseIdx, cycle);
        }
      }, currentPhase.duration * 1000);
    };

    runPhase(0, 0);

    return () => {
      if (breathingRef.current) clearTimeout(breathingRef.current);
    };
  }, [phase, selectedExercise]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const endRitual = useCallback(() => {
    stopSound();
    setIsTimerRunning(false);
    saveUserData({
      ritualPreferences: {
        theme: selectedTheme,
        defaultSound: activeSound,
        defaultExercise: selectedExercise,
        durationMinutes: Math.ceil(timer / 60),
      },
    });
    router.push("/dashboard");
  }, [router, selectedTheme, activeSound, selectedExercise, timer]);

  const themeData = nightlightThemes[selectedTheme];
  const themeColors = themeData?.colors ?? ["#8B2500", "#FF6347", "#FFA500"];

  if (phase === "welcome") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-midnight via-navy to-midnight">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 text-muted hover:text-soft-white transition-colors text-sm"
        >
          ← Retour
        </button>

        <div
          className="w-24 h-24 rounded-full animate-breathe mb-8"
          style={{
            background: `radial-gradient(circle, ${themeColors[3]}, ${themeColors[1]}, ${themeColors[0]})`,
          }}
        />

        <h1 className="text-2xl font-bold text-center mb-3">
          Ton rituel du soir
        </h1>
        <p className="text-muted text-center mb-8 max-w-sm">
          Installe-toi confortablement, baisse la luminosite de ton ecran, et
          laisse-toi guider.
        </p>

        {/* Theme selector */}
        <div className="w-full max-w-sm mb-6">
          <p className="text-xs text-muted mb-3 text-center uppercase tracking-wider">
            Veilleuse
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(nightlightThemes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key as NightlightTheme)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  selectedTheme === key
                    ? "glass-accent scale-105"
                    : "glass-light hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${t.colors[3]}, ${t.colors[0]})`,
                  }}
                />
                <span className="text-[10px] text-muted">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exercise selector */}
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs text-muted mb-3 text-center uppercase tracking-wider">
            Exercice de respiration
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(breathingExercises).map(([key, ex]) => (
              <button
                key={key}
                onClick={() =>
                  setSelectedExercise(key as BreathingExercise)
                }
                className={`text-left p-3 rounded-xl transition-all text-sm ${
                  selectedExercise === key
                    ? "glass-accent text-amber"
                    : "glass-light text-muted hover:bg-white/[0.06]"
                }`}
              >
                <p className="font-medium text-xs">{ex.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startNightlight}
          className="px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          Commencer
        </button>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-midnight via-navy to-midnight animate-fade-in-slow">
        <div className="text-5xl mb-6">🌙</div>
        <h1 className="text-2xl font-bold text-center mb-3">Bonne nuit</h1>
        <p className="text-muted text-center mb-3 max-w-sm">
          Tu as suivi ton rituel pendant {formatTime(timer)}. Ton corps est pret
          pour une nuit reparatrice.
        </p>
        <p className="text-xs text-muted-dark text-center mb-10">
          N&apos;oublie pas ton check-in demain matin.
        </p>
        <button
          onClick={endRitual}
          className="px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98]"
        >
          Terminer
        </button>
      </div>
    );
  }

  const orbStyle = {
    background: `radial-gradient(circle at 40% 40%, ${themeColors[4] ?? themeColors[2]}88, ${themeColors[2]}66, ${themeColors[0]}44, transparent)`,
  };

  const bgFrom = themeColors[0] + "33";
  const bgVia = themeColors[1] + "1a";

  return (
    <div
      className="min-h-dvh flex flex-col transition-all duration-[3000ms]"
      style={{
        background: `linear-gradient(to bottom, ${bgFrom}, ${bgVia}, #0a0e27)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => {
            stopSound();
            setIsTimerRunning(false);
            setPhase("welcome");
          }}
          className="text-muted/50 hover:text-muted transition-colors text-sm glass-light rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
        <span className="text-muted/50 text-sm font-mono glass-light px-3 py-1 rounded-full">
          {formatTime(timer)}
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-muted/50 hover:text-muted transition-colors text-sm glass-light rounded-full w-8 h-8 flex items-center justify-center"
        >
          ⚙
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-6 mb-4 animate-fade-in">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted mb-3">Changer la veilleuse</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {Object.entries(nightlightThemes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key as NightlightTheme)}
                  className={`p-2 rounded-lg transition-all ${
                    selectedTheme === key ? "glass-accent" : "glass-light"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${t.colors[3]}, ${t.colors[0]})`,
                    }}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mb-2">Respiration</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(breathingExercises).map(([key, ex]) => (
                <button
                  key={key}
                  onClick={() =>
                    setSelectedExercise(key as BreathingExercise)
                  }
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    selectedExercise === key
                      ? "glass-accent text-amber"
                      : "glass-light text-muted"
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === "nightlight" && (
          <>
            {/* Themed orb */}
            <div className="relative w-48 h-48 mb-12">
              <div
                className="absolute inset-0 rounded-full blur-3xl animate-breathe"
                style={{ ...orbStyle, opacity: 0.5 }}
              />
              <div
                className="absolute inset-4 rounded-full blur-2xl animate-breathe delay-500"
                style={{ ...orbStyle, opacity: 0.6 }}
              />
              <div
                className="absolute inset-8 rounded-full blur-xl"
                style={{ ...orbStyle, opacity: 0.7 }}
              />
            </div>

            <p className="text-muted/60 text-sm text-center mb-2">
              {themeData?.description}
            </p>
            <p className="text-muted/40 text-xs text-center mb-8">
              Respire doucement. Laisse le calme s&apos;installer.
            </p>

            <button
              onClick={startBreathing}
              className="px-6 py-3 rounded-xl glass-btn text-amber text-sm"
            >
              {exercise?.label ?? "Meditation guidee"}
            </button>
          </>
        )}

        {phase === "breathing" && exercise && (
          <>
            {/* Breathing circle */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full transition-all duration-[3000ms] ease-in-out glass"
                style={{
                  transform:
                    exercise.phases[breathPhaseIdx]?.name === "Expire" ||
                    exercise.phases[breathPhaseIdx]?.name === "Pause"
                      ? "scale(0.75)"
                      : "scale(1)",
                  background: `radial-gradient(circle, ${themeColors[3]}44, ${themeColors[1]}22, transparent)`,
                  borderColor: `${themeColors[2]}33`,
                }}
              />
              <div
                className="absolute inset-6 rounded-full transition-all duration-[3000ms] ease-in-out"
                style={{
                  transform:
                    exercise.phases[breathPhaseIdx]?.name === "Expire" ||
                    exercise.phases[breathPhaseIdx]?.name === "Pause"
                      ? "scale(0.75)"
                      : "scale(1)",
                  background: `radial-gradient(circle, ${themeColors[3]}66, ${themeColors[1]}33)`,
                }}
              />
              <span
                className="relative text-xl font-medium"
                style={{ color: themeColors[3] }}
              >
                {exercise.phases[breathPhaseIdx]?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <span className="text-muted/60 text-xs">
                {exercise.phases[breathPhaseIdx]?.duration} secondes
              </span>
            </div>

            <div className="flex gap-1.5">
              {Array.from({ length: exercise.cycles }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors`}
                  style={{
                    backgroundColor:
                      i < breathCount ? themeColors[3] : "rgba(42,51,104,0.8)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sound controls */}
      <div className="px-6 pb-8">
        <div className="p-4 rounded-2xl glass">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted/60">Son d&apos;ambiance</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted/40">Vol.</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  playSound(activeSound, v);
                }}
                className="w-16 h-1 accent-amber"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ambientSounds.map((s) => (
              <button
                key={s}
                onClick={() => handleSoundChange(s)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  activeSound === s
                    ? "glass-accent text-amber"
                    : "glass-light text-muted hover:text-soft-white"
                }`}
              >
                {soundLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
