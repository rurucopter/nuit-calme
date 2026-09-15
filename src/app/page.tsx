"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getUserData } from "@/lib/storage";

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

function LiveNightSky() {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; delay: number; dur: number }[]
  >([]);
  const [shootingStars, setShootingStars] = useState<
    { x: number; y: number; delay: number; angle: number }[]
  >([]);
  const [clouds, setClouds] = useState<
    { x: number; y: number; w: number; opacity: number; speed: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: Math.random() * 2.5 + 0.3,
        delay: Math.random() * 6,
        dur: 1.5 + Math.random() * 4,
      }))
    );
    setShootingStars(
      Array.from({ length: 3 }, () => ({
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 30,
        delay: 2 + Math.random() * 12,
        angle: 25 + Math.random() * 20,
      }))
    );
    setClouds(
      Array.from({ length: 4 }, (_, i) => ({
        x: -20 + i * 30,
        y: 15 + Math.random() * 40,
        w: 200 + Math.random() * 150,
        opacity: 0.03 + Math.random() * 0.04,
        speed: 60 + Math.random() * 40,
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
      {clouds.map((c, i) => (
        <div
          key={`c${i}`}
          className="absolute rounded-full animate-drift-cloud"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.w,
            height: c.w * 0.3,
            background: `radial-gradient(ellipse, rgba(148,163,184,${c.opacity}), transparent 70%)`,
            animationDuration: `${c.speed}s`,
            filter: "blur(20px)",
          }}
        />
      ))}
      <div
        className="absolute animate-breathe"
        style={{
          right: "12%",
          top: "8%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "14%",
          top: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #fde68a, #f5a623, #f0725c)",
          boxShadow:
            "0 0 40px rgba(245,166,35,0.3), 0 0 80px rgba(245,166,35,0.1)",
        }}
      />
    </div>
  );
}

const CTA_HREF = "/diagnostic";

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
      className={`group relative inline-block rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
        size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"
      } ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

const testimonials = [
  {
    name: "Lea, 22 — etudiante",
    text: "Periode de partiels, je dormais 4h. Maintenant je m'endors en 10 min.",
    result: "-35 min",
    rating: 5,
  },
  {
    name: "Thomas, 25 — dev",
    text: "Le rituel du soir me met KO. Plus besoin de scroller jusqu'a 2h.",
    result: "7 jours",
    rating: 5,
  },
  {
    name: "Sarah, 20 — en alternance",
    text: "Stress du taf + cours = insomnies. Le diagnostic a trouve la cause en 2 min.",
    result: "1 cause",
    rating: 5,
  },
  {
    name: "Julien, 27 — freelance",
    text: "Mon cerveau ne s'arretait jamais le soir. La respiration guidee, c'est game changer.",
    result: "x2",
    rating: 5,
  },
  {
    name: "Antoine, 19 — etudiant",
    text: "J'ai arrete le doom scroll au lit. 2 semaines plus tard, tout a change.",
    result: "14 jours",
    rating: 5,
  },
  {
    name: "Camille, 24 — infirmiere",
    text: "Horaires decales, stress permanent. La veilleuse ocean + pluie, mon combo magique.",
    result: "chaque soir",
    rating: 5,
  },
  {
    name: "Lucas, 26 — commercial",
    text: "L'anxiete me reveillait a 4h du mat. Maintenant je dors d'une traite.",
    result: "nuit entiere",
    rating: 5,
  },
  {
    name: "Marie, 21 — en master",
    text: "Les micro-habitudes sont geniales. Petits gestes, enorme difference sur mon stress.",
    result: "3 sem.",
    rating: 5,
  },
];

function ScrollingTestimonials() {
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-midnight to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-midnight to-transparent z-10 pointer-events-none" />
      <div className="flex gap-4 animate-scroll-left">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="flex-shrink-0 w-72 glass-light rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    className={`text-xs ${j < t.rating ? "text-amber" : "text-navy-lighter"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-bold text-amber glass-accent px-2 py-0.5 rounded-full">
                {t.result}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-3">
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="text-xs font-medium text-soft-white/70">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "C'est vraiment gratuit le diagnostic ?",
      a: "Oui. Le diagnostic est 100% gratuit, sans inscription et sans email. Tu as ton resultat en 2 minutes. Le programme complet est payant.",
    },
    {
      q: "Ca marche pour l'insomnie chronique ?",
      a: "Nuit Calme cible les mauvaises habitudes de sommeil. Pour l'insomnie chronique diagnostiquee, consulte un medecin. Nos outils peuvent completer un suivi medical.",
    },
    {
      q: "Combien de temps pour voir des resultats ?",
      a: "La plupart des utilisateurs sentent une difference des la premiere semaine. Les habitudes s'ancrent en 2-3 semaines.",
    },
    {
      q: "Mes donnees sont securisees ?",
      a: "Tes donnees restent sur ton appareil. Aucune information sensible ne transite par nos serveurs.",
    },
    {
      q: "Ca marche sur iPhone et Android ?",
      a: "Oui. L'app s'installe comme une app native — pas besoin de passer par l'App Store ou le Play Store.",
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

  const painRef = useReveal();
  const stepsRef = useReveal();
  const transformRef = useReveal();
  const ritualRef = useReveal();
  const objectionsRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 h-[110vh] overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-night.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/60 to-midnight" />
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
          <div className="flex items-center gap-3">
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
                text="Diagnostic gratuit"
                className="!rounded-full !px-5 !py-2 !text-sm"
              />
            )}
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO — hook + CTA above the fold             */}
      {/* ============================================ */}
      <section className="relative z-10 px-5 pt-10 pb-8 sm:pt-16 sm:pb-12 max-w-3xl mx-auto text-center">
        <p className="text-xs sm:text-sm text-amber/80 font-medium mb-4 animate-fade-in tracking-wide">
          Pour les 18-28 ans qui n&apos;arrivent plus a dormir
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5 animate-fade-in">
          Stresse. Epuise.
          <br />
          <span className="bg-gradient-to-r from-amber via-orange to-orange-deep bg-clip-text text-transparent">
            Tu merites de dormir.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-lg mx-auto mb-7 animate-fade-in delay-100 opacity-0 leading-relaxed">
          Exams, boulot, anxiete, ecrans — ton cerveau ne s&apos;arrete jamais.
          <br />
          <span className="text-soft-white font-medium">
            En 2 min, on trouve pourquoi tu dors mal. Pas un score — une vraie reponse.
          </span>
        </p>

        <div className="animate-fade-in delay-200 opacity-0 flex flex-col items-center gap-3">
          <CTAButton />
          <span className="text-xs text-muted-dark">
            Gratuit · Sans inscription · 2 minutes
          </span>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUST BAR — chiffres cles en un coup d'oeil  */}
      {/* ============================================ */}
      <section className="relative z-10 px-5 pb-10 sm:pb-14 animate-fade-in delay-500 opacity-0">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl px-4 py-3 flex items-center justify-around gap-2">
            {[
              { value: "4.8 ★", label: "note moyenne" },
              { value: "+2 340", label: "18-28 ans" },
              { value: "7 jours", label: "premiers resultats" },
              { value: "2 min", label: "diagnostic" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-sm sm:text-base font-bold text-amber">
                  {item.value}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-dark">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PAIN — "Tu reconnais ca?"                    */}
      {/* ============================================ */}
      <section
        className="relative z-10 px-5 py-16 sm:py-20 overflow-hidden"
        ref={painRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/night-stars.jpg"
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/85 to-midnight" />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
              Ca te parle ?
            </h2>
            <p className="text-muted text-sm sm:text-base">
              Ce n&apos;est pas &ldquo;juste du stress&rdquo;. C&apos;est un
              cercle vicieux qui ruine tes journees.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                emoji: "📱",
                text: "23h : TikTok, Insta, YouTube Shorts. \"Encore 5 min.\" Il est 1h30.",
              },
              {
                emoji: "🧠",
                text: "Lumiere eteinte. Ton cerveau : le partiel de lundi, le taf, ce message que t'as pas repondu...",
              },
              {
                emoji: "😰",
                text: "L'anxiete monte. Tu sens ton coeur qui bat. Impossible de lacher prise.",
              },
              {
                emoji: "⏰",
                text: "2h14. Tu calcules : \"il me reste 4h46 de sommeil.\" Ca empire.",
              },
              {
                emoji: "☕",
                text: "Le lendemain : 3 cafes, zero concentration, irritable. Et ca recommence ce soir.",
              },
              {
                emoji: "💊",
                text: "\"J'ai essaye la melatonine, les tisanes, le mode avion.\" Rien ne tient.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)} glass-light rounded-2xl px-5 py-4 flex items-center gap-4`}
              >
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <p className="text-sm text-soft-white/90 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-4 text-center mt-8">
            <p className="text-muted text-sm mb-1">
              Si tu as coche mentalement au moins 2 lignes :
            </p>
            <p className="text-soft-white font-semibold">
              Le probleme, c&apos;est pas que t&apos;es &ldquo;trop
              stresse&rdquo;.
              <br />
              C&apos;est que personne ne t&apos;a montre{" "}
              <span className="text-amber">comment couper</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SOCIAL PROOF — scrolling testimonials         */}
      {/* ============================================ */}
      <section className="relative z-10 py-4">
        <ScrollingTestimonials />
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS — 3 etapes                      */}
      {/* ============================================ */}
      <section
        id="comment-ca-marche"
        className="relative z-10 px-5 py-16 sm:py-20"
        ref={stepsRef}
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              Simple et rapide
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              3 etapes. Ce soir, tu dors mieux.
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-5">
            {[
              {
                step: "1",
                title: "Diagnostic",
                desc: "14 questions sur ton stress, tes habitudes, ton sommeil. On identifie LA cause.",
                time: "2 min",
                icon: "🔍",
              },
              {
                step: "2",
                title: "Ton plan anti-stress",
                desc: "4 semaines de micro-habitudes pour casser le cycle stress → insomnie.",
                time: "personnalise",
                icon: "📋",
              },
              {
                step: "3",
                title: "Rituel du soir",
                desc: "Respiration guidee + sons + veilleuse. Ton cerveau apprend a couper.",
                time: "10 min/soir",
                icon: "🌙",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`reveal reveal-delay-${i + 1} glass-light rounded-2xl p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-[10px] text-amber glass-accent px-2 py-0.5 rounded-full">
                    {item.time}
                  </span>
                </div>
                <h3 className="font-semibold mb-1.5">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-4 text-center mt-10">
            <CTAButton text="Commencer mon diagnostic" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRANSFORMATION — avant / apres               */}
      {/* ============================================ */}
      <section
        className="relative z-10 px-5 py-16 sm:py-20"
        ref={transformRef}
      >
        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center mb-10">
            <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
              La difference
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Sans Nuit Calme vs. avec
            </h2>
          </div>

          <div className="reveal reveal-delay-1 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Before */}
            <div className="glass rounded-2xl p-5 border-rose/10">
              <p className="text-rose text-xs font-medium uppercase tracking-widest mb-4">
                Avant
              </p>
              <div className="space-y-3">
                {[
                  "Scroll au lit → endormissement 45+ min",
                  "Anxiete, pensees en boucle, coeur qui bat",
                  "3 cafes pour tenir, crash a 15h",
                  "Zero motivation, zero concentration",
                  "Stress → mal dormir → plus de stress → repeat",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-rose/60 text-xs mt-0.5 flex-shrink-0">
                      ✕
                    </span>
                    <p className="text-xs text-muted leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="glass-accent rounded-2xl p-5">
              <p className="text-amber text-xs font-medium uppercase tracking-widest mb-4">
                Apres
              </p>
              <div className="space-y-3">
                {[
                  "Rituel de 10 min → tu t'endors sans t'en rendre compte",
                  "Nuit complete, pas de reveil a 4h",
                  "Tu te leves frais, sans alarme x5",
                  "Concentration, energie stable toute la journee",
                  "Moins de stress, meilleure humeur, tout suit",
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

          <div className="reveal reveal-delay-2 text-center mt-6">
            <p className="text-muted text-xs">
              La plupart des utilisateurs voient la difference{" "}
              <span className="text-soft-white font-medium">
                des la premiere semaine
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RITUAL PREVIEW — show the product            */}
      {/* ============================================ */}
      <section
        className="relative z-10 px-5 py-16 sm:py-20 overflow-hidden"
        ref={ritualRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/moon-clouds.jpg"
            alt=""
            fill
            className="object-cover opacity-12"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="reveal order-2 md:order-1">
              <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
                Le rituel du soir
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5 leading-tight">
                10 min pour calmer ton cerveau.
                <br />
                <span className="text-amber">8h de vrai repos.</span>
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  {
                    icon: "💡",
                    title: "Veilleuse adaptee",
                    desc: "5 ambiances calibrees sur ta cause",
                  },
                  {
                    icon: "🎵",
                    title: "Sons d'ambiance",
                    desc: "Pluie, ocean, foret — generes, pas en boucle",
                  },
                  {
                    icon: "🫁",
                    title: "Respiration guidee",
                    desc: "4-7-8, coherence cardiaque, phase par phase",
                  },
                  {
                    icon: "📱",
                    title: "Sur ton telephone",
                    desc: "S'installe comme une app native",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-base mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-soft-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <CTAButton size="md" text="Decouvrir mon rituel" />
            </div>

            <div className="reveal reveal-delay-2 order-1 md:order-2 flex justify-center">
              <div className="relative w-52 sm:w-60">
                <div className="rounded-[1.8rem] overflow-hidden glass-strong p-5 aspect-[9/16] flex flex-col items-center justify-center relative">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 35%, rgba(0,102,153,0.3), transparent 70%)",
                    }}
                  />
                  <div className="relative w-16 h-16 mb-5">
                    <div
                      className="absolute inset-0 rounded-full blur-xl animate-breathe"
                      style={{
                        background:
                          "radial-gradient(circle, #0077B6aa, #003366)",
                      }}
                    />
                    <div
                      className="absolute inset-3 rounded-full blur-md"
                      style={{
                        background:
                          "radial-gradient(circle, #006699, #001F3F)",
                      }}
                    />
                  </div>
                  <p className="text-[#0077B6] text-sm font-medium mb-0.5 relative">
                    Ocean profond
                  </p>
                  <p className="text-muted/30 text-[10px] mb-4 relative">
                    Calme le systeme nerveux
                  </p>
                  <div className="w-full glass-light rounded-lg p-2.5 relative">
                    <p className="text-[9px] text-muted/50 mb-1.5">
                      Son d&apos;ambiance
                    </p>
                    <div className="flex gap-1.5">
                      {["Pluie", "Ocean", "Foret"].map((s, i) => (
                        <span
                          key={s}
                          className={`px-2 py-0.5 rounded-full text-[8px] ${i === 1 ? "glass-accent text-amber" : "glass text-muted/40"}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full bg-midnight/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* OBJECTIONS — "Oui mais..."                   */}
      {/* ============================================ */}
      <section
        className="relative z-10 px-5 py-16 sm:py-20"
        ref={objectionsRef}
      >
        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              &ldquo;Oui mais moi c&apos;est different...&rdquo;
            </h2>
            <p className="text-muted text-sm">
              On a entendu ca 2 340 fois. Voici ce qu&apos;on repond.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                objection: "C'est juste du stress, ca va passer",
                answer:
                  "Le stress ne \"passe\" pas tout seul — il s'installe. 73% des 18-28 ans dorment mal a cause du stress. Plus tu attends, plus le cycle se renforce.",
                icon: "😤",
              },
              {
                objection: "J'ai deja essaye des apps de sommeil",
                answer:
                  "Elles te donnent un score. On te donne la CAUSE + un plan personnalise. Ton anxiete du soir n'a rien a voir avec un mauvais matelas — on cible le vrai probleme.",
                icon: "📱",
              },
              {
                objection: "J'ai pas le temps/la discipline pour un programme",
                answer:
                  "10 min le soir, c'est tout. Le rituel est guide — tu te laisses porter. Les micro-habitudes sont si petites que tu ne peux pas echouer. Concu pour les gens qui n'arrivent pas a tenir.",
                icon: "⏱️",
              },
              {
                objection: "C'est cher, je suis etudiant",
                answer:
                  "Le diagnostic est 100% gratuit. Le programme revient a 0.33€/jour — moins qu'un cafe. Et combien te coute le manque de sommeil en concentration, notes, et sante ?",
                icon: "💸",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-5`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 flex-shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-sm mb-2 text-soft-white">
                      &ldquo;{item.objection}&rdquo;
                    </p>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECOND TESTIMONIALS                          */}
      {/* ============================================ */}
      <section className="relative z-10 py-4">
        <ScrollingTestimonials />
      </section>

      {/* ============================================ */}
      {/* FINAL CTA                                    */}
      {/* ============================================ */}
      <section
        className="relative z-10 px-5 py-16 sm:py-24 overflow-hidden"
        ref={ctaRef}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/night-lake.jpg"
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/80 to-midnight" />
        </div>
        <div className="reveal max-w-xl mx-auto text-center glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-orange/5 pointer-events-none" />
          <div className="text-4xl mb-4">🌙</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 relative">
            Arrete de subir tes nuits.
            <br />
            <span className="text-amber">Reprends le controle ce soir.</span>
          </h2>
          <p className="text-muted text-sm sm:text-base mb-8 relative max-w-sm mx-auto">
            2 min de diagnostic. 1 cause identifiee. 1 plan.
            <br />
            Des la premiere semaine, tu sens la difference.
          </p>
          <div className="relative flex flex-col items-center gap-3">
            <CTAButton text="Faire mon diagnostic maintenant" />
            <span className="text-[10px] text-muted-dark">
              Gratuit · Sans inscription · Resultat immediat
            </span>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ                                          */}
      {/* ============================================ */}
      <section
        id="faq"
        className="relative z-10 px-5 py-16 sm:py-20"
        ref={faqRef}
      >
        <div className="max-w-xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
              Questions frequentes
            </h2>
          </div>
          <div className="reveal reveal-delay-1">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
