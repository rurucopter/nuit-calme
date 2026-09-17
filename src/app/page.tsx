"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getUserData } from "@/lib/storage";

const CTA_HREF = "/diagnostic";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((child) =>
            child.classList.add("visible")
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        className="absolute animate-float-orb-1"
        style={{
          top: "12%", left: "8%", width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.07), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute animate-float-orb-2"
        style={{
          top: "55%", right: "5%", width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,122,235,0.05), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute animate-float-orb-3"
        style={{
          bottom: "15%", left: "25%", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,114,92,0.04), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute animate-float-orb-2"
        style={{
          top: "30%", right: "30%", width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.03), transparent 70%)",
          filter: "blur(35px)",
        }}
      />
    </div>
  );
}

function useLiveCount(base: number, range: number) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    setCount(base + Math.floor(Math.random() * range));
    const id = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(base, Math.min(base + range, prev + delta));
      });
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, [base, range]);
  return count;
}

function LiveNightSky() {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; delay: number; dur: number }[]
  >([]);
  const [shootingStars, setShootingStars] = useState<
    { x: number; y: number; delay: number; angle: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: Math.random() * 2.5 + 0.3,
        delay: Math.random() * 6,
        dur: 1.5 + Math.random() * 4,
      }))
    );
    setShootingStars(
      Array.from({ length: 2 }, () => ({
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 30,
        delay: 3 + Math.random() * 15,
        angle: 25 + Math.random() * 20,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full bg-white animate-pulse-soft"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            opacity: 0.4,
          }}
        />
      ))}
      {shootingStars.map((ss, i) => (
        <div
          key={`ss${i}`}
          className="absolute animate-shooting-star"
          style={{
            left: `${ss.x}%`,
            top: `${ss.y}%`,
            width: 60,
            height: 1.5,
            background:
              "linear-gradient(to right, transparent, white 40%, rgba(255,255,255,0.8))",
            borderRadius: 1,
            transform: `rotate(${ss.angle}deg)`,
            animationDelay: `${ss.delay}s`,
            animationDuration: "1.2s",
          }}
        />
      ))}
      <div
        className="absolute animate-breathe"
        style={{
          right: "10%",
          top: "6%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "12%",
          top: "8%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #fde68a, #f5a623, #f0725c)",
          boxShadow:
            "0 0 40px rgba(245,166,35,0.25), 0 0 80px rgba(245,166,35,0.08)",
        }}
      />
    </div>
  );
}

function CTAButton({
  className = "",
  size = "lg",
  text = "Faire mon diagnostic gratuit",
}: {
  className?: string;
  size?: "lg" | "md";
  text?: string;
}) {
  return (
    <Link
      href={CTA_HREF}
      className={`group relative inline-block rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98] overflow-hidden transition-transform ${
        size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"
      } ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-3 pt-6 bg-gradient-to-t from-midnight via-midnight/95 to-transparent sm:hidden transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <Link
        href={CTA_HREF}
        className="block w-full text-center px-6 py-3.5 rounded-2xl glass-btn-solid text-midnight font-semibold text-base"
      >
        Diagnostic gratuit — 2 min
      </Link>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "C'est vraiment gratuit le diagnostic ?",
      a: "Oui. 6 questions, zero inscription, zero email. Tu as ton resultat en 2 minutes. Le programme personnalise est payant.",
    },
    {
      q: "En quoi c'est different des autres apps de sommeil ?",
      a: "Les autres te donnent un score. Nous, on identifie LA cause de ton probleme — ecrans, stress, cafeine, horaires — et on te donne un plan specifique pour la reparer. Pas de meditation generique.",
    },
    {
      q: "Ca marche pour l'insomnie chronique ?",
      a: "Nuit Calme cible les mauvaises habitudes qui detruisent ton sommeil. Pour l'insomnie diagnostiquee par un medecin, nos outils peuvent completer un suivi medical.",
    },
    {
      q: "Combien de temps pour voir des resultats ?",
      a: "La majorite des utilisateurs sentent une difference des la premiere semaine. Les habitudes s'ancrent en 2-3 semaines. Le programme complet dure 4 semaines.",
    },
    {
      q: "J'ai pas le temps pour un programme",
      a: "10 minutes le soir, c'est tout. Le rituel est guide — tu te laisses porter. Les micro-habitudes sont si petites que tu ne peux pas echouer.",
    },
    {
      q: "Ca marche sur iPhone et Android ?",
      a: "Oui. L'app s'installe comme une app native depuis ton navigateur — pas besoin de l'App Store ou du Play Store.",
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
          >
            <span className="font-medium text-sm">{item.q}</span>
            <span
              className={`text-amber text-lg transition-transform duration-300 flex-shrink-0 ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-48 pb-4" : "max-h-0"
            }`}
          >
            <p className="px-5 text-sm text-muted leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const testimonials = [
  {
    name: "Lea, 22",
    context: "Etudiante en droit",
    text: "Periode de partiels, je dormais 4h par nuit. Le diagnostic a trouve que c'etait les ecrans + le stress. En 2 semaines, je m'endors en 10 min.",
    result: "-35 min d'endormissement",
    avatar: "L",
  },
  {
    name: "Thomas, 25",
    context: "Developpeur web",
    text: "Mon cerveau ne s'arretait jamais le soir. La respiration 4-7-8 + les sons d'ocean, c'est devenu mon rituel sacre. Plus besoin de scroller jusqu'a 2h.",
    result: "7 jours pour le changement",
    avatar: "T",
  },
  {
    name: "Sarah, 20",
    context: "En alternance",
    text: "Stress du taf + cours = insomnies. J'etais sceptique mais le diagnostic a tape en plein dans le mille. Score passe de 38 a 76 en 3 semaines.",
    result: "Score x2 en 3 semaines",
    avatar: "S",
  },
];

export default function LandingPage() {
  const [hasData, setHasData] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setHasData(data.onboardingComplete);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const problemRef = useReveal();
  const bridgeRef = useReveal();
  const stepsRef = useReveal();
  const featuresRef = useReveal();
  const proofRef = useReveal();
  const costRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  const stat1 = useCountUp(87);
  const stat2 = useCountUp(35);
  const stat3 = useCountUp(2340);
  const liveCount = useLiveCount(12, 8);

  return (
    <div className="relative overflow-x-hidden">
      <FloatingOrbs />
      <StickyMobileCTA />

      {/* ==================== HERO ==================== */}
      <div className="relative min-h-dvh flex flex-col">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-night.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/60 to-midnight" />
        </div>

        <LiveNightSky />

        {/* Nav */}
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? "glass" : ""
          }`}
        >
          <div className="flex items-center justify-between px-5 py-3.5 max-w-6xl mx-auto">
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
              <CTAButton
                size="md"
                text="Diagnostic"
                className="!rounded-full !px-5 !py-2 !text-sm"
              />
            )}
          </div>
        </nav>

        {/* Hero content */}
        <section className="relative z-10 flex-1 flex flex-col justify-center px-5 pb-16 pt-4 sm:pt-0 max-w-3xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mx-auto mb-6 animate-fade-in">
            <span className="text-amber text-xs font-semibold">4.8 ★</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-xs text-muted">
              +2 340 membres de 18-28 ans
            </span>
          </div>

          <h1 className="text-[2rem] sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5 animate-fade-in">
            Tu scrolles. Tu rumines.
            <br />
            <span className="bg-gradient-to-r from-amber via-orange to-orange-deep bg-clip-text text-transparent">
              Tu ne dors pas.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-md mx-auto mb-8 animate-fade-in delay-100 opacity-0 leading-relaxed">
            En <span className="text-soft-white font-medium">2 minutes</span>,
            on identifie ta cause.
            <br />
            En{" "}
            <span className="text-soft-white font-medium">4 semaines</span>, on
            la repare.
          </p>

          <div className="animate-fade-in delay-200 opacity-0 flex flex-col items-center gap-3">
            <CTAButton />
            <span className="text-xs text-muted-dark">
              Gratuit · Sans inscription · Resultat immediat
            </span>
          </div>

          {/* Trust micro-bar */}
          <div className="mt-12 animate-fade-in delay-500 opacity-0">
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {[
                { value: "87%", label: "voient des resultats" },
                { value: "2 min", label: "de diagnostic" },
                { value: "-35 min", label: "d'endormissement" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-sm sm:text-base font-bold text-amber">
                    {s.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted-dark">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live counter */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 animate-fade-in delay-700 opacity-0">
          <div className="flex items-center gap-2 glass-light rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <p className="text-[11px] text-muted">
              <span className="text-soft-white font-medium">{liveCount} personnes</span>{" "}
              font le diagnostic en ce moment
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-float">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-amber/60 animate-pulse-soft" />
          </div>
        </div>
      </div>

      {/* ==================== PROBLEM ==================== */}
      <section
        className="relative z-10 px-5 py-20 sm:py-28 overflow-hidden"
        ref={problemRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/night-stars.jpg"
            alt=""
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center mb-12">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Chaque soir, meme scenario
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              Tu connais cette boucle.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                time: "23h",
                title: "Le soir",
                text: "Tu te couches. Tu prends ton telephone. \"Encore 5 min.\" TikTok, Insta, YouTube Shorts. Il est 1h30. Ton cerveau est en mode alerte.",
              },
              {
                time: "3h",
                title: "La nuit",
                text: "Tu eteins. Les pensees arrivent. Le partiel de lundi. Le taf. Ce truc que t'as dit hier. L'anxiete monte. Tu regardes l'heure : 3h14.",
              },
              {
                time: "7h",
                title: "Le matin",
                text: "Reveil. Epuise. 3 cafes pour tenir. Zero concentration. Irritable avec tout le monde. Et ce soir... meme scenario.",
              },
            ].map((scenario, i) => (
              <div
                key={scenario.time}
                className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-6 relative overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(155,122,235,0.08), transparent)`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-amber font-mono text-sm font-bold">
                      {scenario.time}
                    </span>
                    <span className="w-8 h-px bg-amber/30" />
                    <span className="text-xs text-muted uppercase tracking-wider">
                      {scenario.title}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-soft-white/85 leading-relaxed">
                    {scenario.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-4 text-center mt-10">
            <p className="text-muted text-sm mb-2">
              Si tu t&apos;es reconnu dans au moins une ligne :
            </p>
            <p className="text-soft-white font-semibold text-base sm:text-lg leading-snug">
              Le probleme, c&apos;est pas que tu es &ldquo;trop
              stresse&rdquo;.
              <br />
              C&apos;est que{" "}
              <span className="text-amber">
                personne ne t&apos;a montre comment couper
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ==================== BRIDGE ==================== */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24"
        ref={bridgeRef}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="reveal order-2 md:order-1">
              <p className="text-amber text-xs font-medium mb-4 uppercase tracking-widest">
                L&apos;approche Nuit Calme
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5 leading-tight">
                On ne te donne pas un score.
                <br />
                <span className="text-amber">
                  On trouve ta cause.
                </span>
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
                Les apps de sommeil te disent &ldquo;tu dors mal&rdquo;. Merci,
                tu le savais. Nuit Calme identifie{" "}
                <span className="text-soft-white font-medium">pourquoi</span>{" "}
                tu dors mal — ecrans, stress, cafeine, horaires — et te donne un
                plan pour reparer{" "}
                <span className="text-soft-white font-medium">ta</span> cause.
              </p>
              <div className="space-y-3">
                {[
                  "Addiction aux ecrans le soir",
                  "Stress et ruminations nocturnes",
                  "Cafeine trop tardive",
                  "Horaires de sommeil irreguliers",
                  "Absence de routine du soir",
                ].map((cause) => (
                  <div key={cause} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                    <span className="text-sm text-soft-white/80">{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* App mockup */}
            <div className="reveal reveal-delay-2 order-1 md:order-2 flex justify-center">
              <div className="relative w-56 sm:w-64">
                <div className="rounded-[2rem] overflow-hidden glass-strong p-6 aspect-[9/17] flex flex-col relative">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.06), transparent 70%)",
                    }}
                  />
                  <div className="relative flex-1 flex flex-col">
                    <p className="text-[10px] text-muted text-center mb-4">
                      Ton diagnostic
                    </p>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative w-20 h-20 mb-4">
                        <svg
                          viewBox="0 0 120 120"
                          className="w-full h-full -rotate-90"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="rgba(155,122,235,0.1)"
                            strokeWidth="6"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#f0725c"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={
                              2 * Math.PI * 50 - (42 / 100) * 2 * Math.PI * 50
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-orange">
                            42
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-soft-white mb-1">
                        Sommeil fragile
                      </p>
                      <p className="text-[10px] text-muted mb-4">
                        Cause : stress + ecrans
                      </p>
                    </div>
                    <div className="glass-light rounded-xl p-3">
                      <p className="text-[9px] text-amber font-medium mb-2 uppercase tracking-wider">
                        Ton plan
                      </p>
                      {["Sem. 1 — Routine ecrans", "Sem. 2 — Respiration", "Sem. 3 — Habitudes", "Sem. 4 — Ancrage"].map(
                        (w, i) => (
                          <div
                            key={w}
                            className="flex items-center gap-2 mb-1.5 last:mb-0"
                          >
                            <div
                              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                i === 0
                                  ? "bg-amber/20 border border-amber/40"
                                  : "bg-white/5 border border-white/10"
                              }`}
                            >
                              {i === 0 && (
                                <div className="w-1 h-1 rounded-full bg-amber" />
                              )}
                            </div>
                            <span
                              className={`text-[9px] ${i === 0 ? "text-soft-white" : "text-muted-dark"}`}
                            >
                              {w}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-midnight/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="comment-ca-marche"
        className="relative z-10 px-5 py-16 sm:py-24"
        ref={stepsRef}
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-14">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Comment ca marche
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold">
              3 etapes.{" "}
              <span className="text-amber">Ce soir, tu dors mieux.</span>
            </h2>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber/30 via-amber/10 to-transparent -translate-x-1/2 z-0" />

            <div className="space-y-6 sm:space-y-10 relative z-10">
              {[
                {
                  step: "01",
                  title: "Diagnostic — 2 min",
                  desc: "6 questions sur ton stress, tes habitudes, tes ecrans. Pas de bla-bla — on va droit a la cause.",
                  detail: "Gratuit et sans inscription",
                  icon: "🔍",
                },
                {
                  step: "02",
                  title: "Ton programme personnalise",
                  desc: "4 semaines de micro-habitudes calibrees sur TA cause. Pas un programme generique — un plan adapte a ce qui te fait mal dormir.",
                  detail: "Adapte a ta cause",
                  icon: "📋",
                },
                {
                  step: "03",
                  title: "Rituel du soir — 10 min",
                  desc: "Respiration guidee, sons d'ambiance, veilleuse. Ton cerveau apprend a couper. En 10 min, tu passes de 100 a 0.",
                  detail: "Chaque soir",
                  icon: "🌙",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`reveal reveal-delay-${i + 1}`}
                >
                  <div className="glass rounded-2xl p-6 sm:max-w-md sm:mx-auto">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber/20 to-orange/20 border border-amber/20 flex items-center justify-center text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-amber font-mono text-xs font-bold">
                            {item.step}
                          </span>
                          <span className="text-[10px] text-amber/60 glass-accent px-2 py-0.5 rounded-full">
                            {item.detail}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-4 text-center mt-12">
            <CTAButton text="Commencer mon diagnostic" />
            <p className="text-xs text-muted-dark mt-3">
              2 minutes. Resultat immediat.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24 overflow-hidden"
        ref={featuresRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/moon-clouds.jpg"
            alt=""
            fill
            className="object-cover opacity-8"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/95 to-midnight" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Ce que tu debloques
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Tout ce qu&apos;il faut pour{" "}
              <span className="text-amber">reparer ton sommeil</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🫁",
                title: "Respiration guidee",
                desc: "4-7-8, coherence cardiaque, technique militaire. Guidee phase par phase avec retour visuel.",
              },
              {
                icon: "🎵",
                title: "Sons d'ambiance",
                desc: "Pluie, ocean, foret, feu de camp. Des sons immersifs, pas des boucles de 30 secondes.",
              },
              {
                icon: "💡",
                title: "Veilleuse intelligente",
                desc: "5 ambiances calibrees sur ta cause. Lumiere douce qui baisse ton niveau d'eveil.",
              },
              {
                icon: "📊",
                title: "Suivi & patterns",
                desc: "Check-in matin + soir. On detecte tes patterns et on ajuste ton programme en temps reel.",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-6 relative overflow-hidden group hover:border-amber/15 transition-colors`}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%, rgba(245,166,35,0.04), transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROOF ==================== */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24"
        ref={proofRef}
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-14">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Les resultats
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Des chiffres, pas des promesses.
            </h2>
          </div>

          {/* Stats */}
          <div className="reveal reveal-delay-1 glass rounded-2xl p-6 sm:p-8 mb-10">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div ref={stat1.ref} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber">
                  {stat1.count}
                  <span className="text-2xl">%</span>
                </p>
                <p className="text-xs text-muted mt-1.5">
                  voient une amelioration
                  <br />
                  en 4 semaines
                </p>
              </div>
              <div ref={stat2.ref} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber">
                  -{stat2.count}
                  <span className="text-lg"> min</span>
                </p>
                <p className="text-xs text-muted mt-1.5">
                  de temps
                  <br />
                  d&apos;endormissement
                </p>
              </div>
              <div ref={stat3.ref} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-amber">
                  {stat3.count.toLocaleString("fr-FR")}
                </p>
                <p className="text-xs text-muted mt-1.5">
                  utilisateurs
                  <br />
                  de 18-28 ans
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`reveal reveal-delay-${i + 1} glass-light rounded-2xl p-5 sm:p-6`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber/20 to-orange/20 border border-amber/15 flex items-center justify-center text-amber font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-soft-white">
                        {t.name}
                      </span>
                      <span className="text-xs text-muted-dark">
                        — {t.context}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-amber text-[10px]">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-soft-white/80 leading-relaxed mb-2">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-amber glass-accent px-2.5 py-0.5 rounded-full">
                      {t.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BEFORE / AFTER ==================== */}
      <section className="relative z-10 px-5 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="glass rounded-2xl p-5">
              <p className="text-rose text-xs font-medium uppercase tracking-widest mb-4">
                Sans Nuit Calme
              </p>
              <div className="space-y-3">
                {[
                  "Scroll au lit → endormissement 45+ min",
                  "Pensees en boucle, anxiete qui monte",
                  "3 cafes, zero concentration",
                  "Cercle vicieux : stress → insomnie → stress",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-rose/50 text-xs mt-0.5 flex-shrink-0">
                      ✕
                    </span>
                    <p className="text-xs text-muted leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-accent rounded-2xl p-5">
              <p className="text-amber text-xs font-medium uppercase tracking-widest mb-4">
                Avec Nuit Calme
              </p>
              <div className="space-y-3">
                {[
                  "Rituel de 10 min → endormi sans t'en rendre compte",
                  "Nuit complete, pas de reveil a 4h",
                  "Frais au reveil, energie stable",
                  "Cercle vertueux : calme → sommeil → performance",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-amber text-xs mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <p className="text-xs text-soft-white/80 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COST ==================== */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24"
        ref={costRef}
      >
        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center mb-10">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Le vrai cout
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              Le manque de sommeil te coute
              <br />
              <span className="text-rose">
                bien plus que tu ne crois
              </span>
            </h2>
          </div>

          <div className="reveal reveal-delay-1 glass rounded-2xl p-6 sm:p-8 mb-6">
            <p className="text-xs text-muted text-center mb-5 uppercase tracking-wider">
              Ce que tu paies deja chaque jour
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center mb-6">
              {[
                {
                  value: "3-5",
                  unit: "cafes/j",
                  cost: "4-8€/jour",
                },
                {
                  value: "-40%",
                  unit: "focus",
                  cost: "notes, productivite",
                },
                {
                  value: "x2",
                  unit: "risque",
                  cost: "ta sante mentale",
                },
              ].map((item) => (
                <div key={item.unit}>
                  <p className="text-xl sm:text-2xl font-bold text-rose">
                    {item.value}
                  </p>
                  <p className="text-[10px] text-rose/60 mb-1">{item.unit}</p>
                  <p className="text-[9px] text-muted-dark">{item.cost}</p>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/5 mb-5" />
            <div className="text-center">
              <p className="text-xs text-muted mb-2">Nuit Calme</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber mb-1">
                0,16€
                <span className="text-base font-normal text-muted">
                  /jour
                </span>
              </p>
              <p className="text-xs text-muted">
                Moins qu&apos;un cafe. Pour reparer tes nuits.
              </p>
            </div>
          </div>

          <div className="reveal reveal-delay-2 text-center">
            <CTAButton size="md" text="Commencer gratuitement" />
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section
        id="faq"
        className="relative z-10 px-5 py-16 sm:py-24"
        ref={faqRef}
      >
        <div className="max-w-xl mx-auto">
          <div className="reveal text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Questions frequentes
            </h2>
          </div>
          <div className="reveal reveal-delay-1">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24 overflow-hidden"
        ref={ctaRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/night-lake.jpg"
            alt=""
            fill
            className="object-cover opacity-12"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/80 to-midnight" />
        </div>
        <div className="reveal max-w-lg mx-auto text-center glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-orange/5 pointer-events-none" />

          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-orange/20 border border-amber/15 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🌙</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
              Chaque nuit perdue
              <br />
              <span className="text-amber">renforce le cycle.</span>
            </h2>
            <p className="text-muted text-sm sm:text-base mb-8 max-w-xs mx-auto leading-relaxed">
              Ce soir, tu peux commencer a le casser. 2 min de diagnostic.
              1 cause. 1 plan.
            </p>

            <div className="flex flex-col items-center gap-3">
              <CTAButton text="Faire mon diagnostic maintenant" />
              <div className="flex items-center gap-2 text-[10px] text-muted-dark">
                <span>🔒 Gratuit</span>
                <span>·</span>
                <span>Sans inscription</span>
                <span>·</span>
                <span>Resultat immediat</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-1.5">
                  {["L", "T", "S", "J"].map((l, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full glass border border-midnight flex items-center justify-center text-[9px] text-amber font-medium"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted">
                  +2 340 personnes dorment mieux ce soir
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 px-5 py-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber to-orange" />
            Nuit Calme
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#faq"
              className="text-xs text-muted-dark hover:text-muted transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/createurs"
              className="text-xs text-muted-dark hover:text-muted transition-colors"
            >
              Createurs
            </Link>
            <span className="text-xs text-muted-dark">
              Fait avec soin pour tes nuits.
            </span>
          </div>
        </div>
      </footer>

      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-16 sm:hidden" />
    </div>
  );
}
