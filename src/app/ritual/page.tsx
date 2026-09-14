"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { playSound, stopSound, soundLabels } from "@/lib/sounds";
import { AmbientSound } from "@/lib/types";

type RitualPhase = "welcome" | "nightlight" | "breathing" | "complete";

const sounds: AmbientSound[] = [
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
  const [breathPhase, setBreathPhase] = useState<
    "inspire" | "hold" | "expire"
  >("inspire");
  const [breathCount, setBreathCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopSound();
      if (intervalRef.current) clearInterval(intervalRef.current);
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

  const startBreathing = useCallback(() => {
    setPhase("breathing");
    setBreathCount(0);
  }, []);

  useEffect(() => {
    if (phase !== "breathing") return;

    const cycle = () => {
      setBreathPhase("inspire");
      setTimeout(() => {
        setBreathPhase("hold");
        setTimeout(() => {
          setBreathPhase("expire");
          setTimeout(() => {
            setBreathCount((c) => {
              if (c + 1 >= 5) {
                setPhase("complete");
                setIsTimerRunning(false);
                return c + 1;
              }
              cycle();
              return c + 1;
            });
          }, 8000);
        }, 7000);
      }, 4000);
    };
    cycle();
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const endRitual = useCallback(() => {
    stopSound();
    setIsTimerRunning(false);
    router.push("/dashboard");
  }, [router]);

  if (phase === "welcome") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-midnight via-navy to-midnight">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 text-muted hover:text-soft-white transition-colors text-sm"
        >
          ← Retour
        </button>

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-light to-orange animate-breathe mb-8" />

        <h1 className="text-2xl font-bold text-center mb-3">
          Ton rituel du soir
        </h1>
        <p className="text-muted text-center mb-10 max-w-sm">
          Installe-toi confortablement, baisse la luminosite de ton ecran, et
          laisse-toi guider.
        </p>

        <button
          onClick={startNightlight}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber to-orange text-midnight font-semibold text-lg hover:shadow-lg hover:shadow-amber/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber to-orange text-midnight font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all"
        >
          Terminer
        </button>
      </div>
    );
  }

  const bgGradient =
    phase === "breathing"
      ? "from-[#1a0a05] via-[#2d1810] to-[#0a0e27]"
      : "from-[#2d1810] via-[#1a0a05] to-[#0a0e27]";

  return (
    <div
      className={`min-h-dvh flex flex-col bg-gradient-to-b ${bgGradient} transition-all duration-[3000ms]`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => {
            stopSound();
            setIsTimerRunning(false);
            setPhase("welcome");
          }}
          className="text-muted/50 hover:text-muted transition-colors text-sm"
        >
          ✕
        </button>
        <span className="text-muted/50 text-sm font-mono">
          {formatTime(timer)}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === "nightlight" && (
          <>
            {/* Warm orb */}
            <div className="relative w-48 h-48 mb-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange/30 to-amber/20 blur-3xl animate-breathe" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange/40 to-amber/30 blur-2xl animate-breathe delay-500" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-light/50 to-orange/40 blur-xl" />
            </div>

            <p className="text-amber-light/60 text-sm text-center mb-8">
              Respire doucement. Laisse le calme s&apos;installer.
            </p>

            <button
              onClick={startBreathing}
              className="px-6 py-3 rounded-xl bg-amber/10 border border-amber/20 text-amber text-sm hover:bg-amber/20 transition-colors mb-8"
            >
              Meditation guidee (4-7-8)
            </button>
          </>
        )}

        {phase === "breathing" && (
          <>
            {/* Breathing circle */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out ${
                  breathPhase === "inspire"
                    ? "scale-100 bg-amber/20"
                    : breathPhase === "hold"
                    ? "scale-100 bg-amber/30"
                    : "scale-75 bg-amber/10"
                }`}
              />
              <div
                className={`absolute inset-6 rounded-full transition-all duration-[4000ms] ease-in-out ${
                  breathPhase === "inspire"
                    ? "scale-100 bg-amber/30"
                    : breathPhase === "hold"
                    ? "scale-100 bg-amber/40"
                    : "scale-75 bg-amber/15"
                }`}
              />
              <span className="relative text-amber-light text-xl font-medium">
                {breathPhase === "inspire" && "Inspire"}
                {breathPhase === "hold" && "Retiens"}
                {breathPhase === "expire" && "Expire"}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <span className="text-muted/60 text-xs">
                {breathPhase === "inspire" && "4 secondes"}
                {breathPhase === "hold" && "7 secondes"}
                {breathPhase === "expire" && "8 secondes"}
              </span>
            </div>

            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < breathCount ? "bg-amber" : "bg-navy-lighter"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sound controls */}
      <div className="px-6 pb-8">
        <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-sm">
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
            {sounds.map((s) => (
              <button
                key={s}
                onClick={() => handleSoundChange(s)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  activeSound === s
                    ? "bg-amber/20 text-amber border border-amber/30"
                    : "bg-navy-lighter/40 text-muted hover:text-soft-white"
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
