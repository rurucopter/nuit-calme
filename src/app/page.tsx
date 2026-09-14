"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/storage";

function Stars() {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; delay: number }[]
  >([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      }))
    );
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse-soft"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setHasData(data.onboardingComplete);
  }, []);

  return (
    <div className="relative">
      <Stars />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold text-sm">
            NC
          </div>
          <span className="font-semibold text-lg text-soft-white">
            Nuit Calme
          </span>
        </div>
        {hasData ? (
          <Link
            href="/dashboard"
            className="text-sm glass-btn px-4 py-2 rounded-full text-amber font-medium"
          >
            Mon espace
          </Link>
        ) : (
          <Link
            href="/diagnostic"
            className="text-sm glass-btn px-4 py-2 rounded-full text-amber font-medium"
          >
            Commencer
          </Link>
        )}
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-24 max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full glass-btn text-amber text-sm font-medium mb-8 animate-fade-in">
          Diagnostic gratuit en 2 minutes
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in delay-100 opacity-0">
          Ton telephone
          <br />
          <span className="bg-gradient-to-r from-amber via-orange to-orange-deep bg-clip-text text-transparent">
            detruit ton sommeil.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-in delay-200 opacity-0">
          Nuit Calme identifie LA cause de tes mauvaises nuits et te guide chaque
          soir avec un rituel personnalise. Pas de blabla, des resultats.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300 opacity-0">
          <Link
            href="/diagnostic"
            className="px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Faire mon diagnostic gratuit
          </Link>
          <a
            href="#comment-ca-marche"
            className="px-6 py-4 text-muted hover:text-soft-white transition-colors"
          >
            Comment ca marche ?
          </a>
        </div>

        {/* Floating moon */}
        <div className="mt-16 flex justify-center animate-float">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-light to-amber opacity-20 blur-2xl" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-light/80 to-amber/60 opacity-30 blur-xl" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-light to-amber shadow-xl glow-amber" />
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Le probleme, c&apos;est pas que tu dors mal.
            <br />
            <span className="text-amber">
              C&apos;est que tu ne sais pas pourquoi.
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "Scroll infini",
                desc: "Tu scrolles 45 min avant de dormir sans t'en rendre compte. La lumiere bleue bloque ta melatonine.",
              },
              {
                icon: "☕",
                title: "Cafe a 17h",
                desc: "Ton dernier cafe est encore actif quand tu te couches. La cafeine a une demi-vie de 6 heures.",
              },
              {
                icon: "🧠",
                title: "Cerveau en boucle",
                desc: 'Tu te couches et ton cerveau refuse de se taire. Ruminations, stress, to-do list qui tourne.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl glass hover:border-amber/15 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Comment ca marche
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            3 etapes pour reparer ton sommeil. Pas de compte a creer, pas de
            carte bancaire.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Diagnostic",
                desc: "11 questions pour identifier LA cause principale de tes mauvaises nuits. Pas un score generique — un verdict precis.",
                time: "2 min",
              },
              {
                step: "2",
                title: "Plan personnalise",
                desc: "Un plan progressif de 4 semaines adapte a TA cause. Des paliers semaine par semaine, pas tout d'un coup.",
                time: "Sur mesure",
              },
              {
                step: "3",
                title: "Rituel du soir",
                desc: "Chaque soir, un rituel guide : veilleuse apaisante, sons d'ambiance, meditation. Le coeur de Nuit Calme.",
                time: "10-20 min",
              },
            ].map((item) => (
              <div key={item.step} className="relative glass-light p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  {item.desc}
                </p>
                <span className="text-xs text-amber/70 font-medium">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual preview */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Le rituel du soir
          </h2>
          <p className="text-muted mb-12 max-w-xl mx-auto">
            La fonctionnalite qui change tout. Chaque soir, un moment de calme
            guide qui prepare ton corps et ton esprit au sommeil.
          </p>

          {/* Ritual mockup */}
          <div className="max-w-sm mx-auto rounded-3xl overflow-hidden glass-strong p-8 aspect-[9/16] flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-light to-orange animate-breathe mb-8" />
            <p className="text-amber-light text-xl font-medium mb-2">22:30</p>
            <p className="text-muted text-sm mb-8">Ton rituel commence</p>
            <div className="flex gap-3">
              {["Pluie", "Ocean", "Foret"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full glass-light text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pret a mieux dormir ?
          </h2>
          <p className="text-muted text-lg mb-10">
            Le diagnostic est gratuit, prend 2 minutes, et te dit exactement
            pourquoi tu dors mal. Zero bullshit.
          </p>
          <Link
            href="/diagnostic"
            className="inline-block px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Lancer mon diagnostic
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber to-orange" />
            Nuit Calme
          </div>
          <p className="text-xs text-muted-dark">
            Fait avec soin pour tes nuits.
          </p>
        </div>
      </footer>
    </div>
  );
}
