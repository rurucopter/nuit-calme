"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Step = "install" | "tutorial" | "ready";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("install");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as Record<string, unknown>).MSStream;
    setIsIOS(ios);

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as Record<string, unknown>).standalone
    ) {
      setIsInstalled(true);
      setStep("tutorial");
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setIsInstalled(true);
        setStep("tutorial");
      }
      setDeferredPrompt(null);
    }
  };

  const tutorialSteps = [
    {
      emoji: "🌙",
      title: "Chaque soir, lance ton rituel",
      desc: "10 minutes de veilleuse + respiration guidee. Ton cerveau apprend a se deconnecter.",
    },
    {
      emoji: "☀️",
      title: "Chaque matin, fais ton check-in",
      desc: "Note ta nuit en 30 secondes. On detecte les patterns et on adapte ton programme.",
    },
    {
      emoji: "✅",
      title: "Suis tes micro-habitudes",
      desc: "4 petits gestes par jour, specifiques a ta cause. Le changement vient de la regularite.",
    },
    {
      emoji: "📊",
      title: "Observe tes progres",
      desc: "Ton tableau de bord suit tout. En 2-3 semaines, les resultats sont visibles.",
    },
  ];

  if (step === "install" && !isInstalled) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-6">📱</div>
          <h1 className="text-2xl font-bold mb-3">
            Installe Nuit Calme
          </h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            Ajoute l&apos;app a ton ecran d&apos;accueil pour y acceder en un tap
            chaque soir.
          </p>

          {isIOS ? (
            <div className="glass rounded-2xl p-5 text-left mb-6">
              <p className="text-xs text-amber uppercase tracking-widest mb-3">
                Sur iPhone / iPad
              </p>
              <div className="space-y-3">
                {[
                  'Appuie sur le bouton "Partager" ⬆️ en bas de Safari',
                  'Choisis "Sur l\'ecran d\'accueil"',
                  'Appuie sur "Ajouter"',
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full glass-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber text-[10px]">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : deferredPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] mb-4"
            >
              Installer l&apos;app
            </button>
          ) : (
            <div className="glass rounded-2xl p-5 text-left mb-6">
              <p className="text-xs text-amber uppercase tracking-widest mb-3">
                Installation
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Ouvre ce site dans Chrome ou Safari, puis utilise le menu
                du navigateur pour &ldquo;Ajouter a l&apos;ecran d&apos;accueil&rdquo;.
              </p>
            </div>
          )}

          <button
            onClick={() => setStep("tutorial")}
            className="text-sm text-muted hover:text-soft-white transition-colors"
          >
            Passer cette etape →
          </button>
        </div>
      </div>
    );
  }

  if (step === "tutorial" || (step === "install" && isInstalled)) {
    return (
      <div className="min-h-dvh flex flex-col px-6 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-amber text-xs font-medium mb-2 uppercase tracking-widest">
            Guide rapide
          </p>
          <h1 className="text-2xl font-bold">
            Comment ca marche
          </h1>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="animate-fade-in" key={tutorialStep}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">
                {tutorialSteps[tutorialStep].emoji}
              </div>
              <h2 className="text-xl font-bold mb-3">
                {tutorialSteps[tutorialStep].title}
              </h2>
              <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
                {tutorialSteps[tutorialStep].desc}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === tutorialStep ? "bg-amber" : "bg-navy-lighter"
                }`}
              />
            ))}
          </div>

          {tutorialStep < tutorialSteps.length - 1 ? (
            <button
              onClick={() => setTutorialStep(tutorialStep + 1)}
              className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={() => setStep("ready")}
              className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              C&apos;est parti !
            </button>
          )}
        </div>
      </div>
    );
  }

  // Ready — redirect to dashboard
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-center mb-3">
        Tout est pret !
      </h1>
      <p className="text-muted text-center mb-8 max-w-sm">
        Ton programme personnalise t&apos;attend. Lance ton premier rituel ce soir.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        Ouvrir mon tableau de bord
      </button>
    </div>
  );
}
