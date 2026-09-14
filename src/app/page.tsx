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

function Stars() {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; delay: number; dur: number }[]
  >([]);
  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 3,
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
            animationDuration: `${s.dur}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

const CTA_TEXT = "Decouvrir ma solution";
const CTA_HREF = "/diagnostic";

function CTAButton({ className = "", size = "lg" }: { className?: string; size?: "lg" | "md" }) {
  return (
    <Link
      href={CTA_HREF}
      className={`group relative inline-block rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
        size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"
      } ${className}`}
    >
      <span className="relative z-10">{CTA_TEXT}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

const testimonials = [
  { name: "Lea, 24", text: "Je m'endors en 10 min au lieu de 45. Le diagnostic a change ma vie.", rating: 5 },
  { name: "Thomas, 31", text: "Le rituel du soir est devenu sacre. La respiration guidee me met KO.", rating: 5 },
  { name: "Sarah, 27", text: "Mon score de sommeil est passe de 2 a 4 en 3 semaines.", rating: 5 },
  { name: "Julien, 29", text: "Enfin une app qui m'a dit POURQUOI je dormais mal. Pas juste un score.", rating: 5 },
  { name: "Marie, 35", text: "Les micro-habitudes sont geniales. Petits gestes, enorme difference.", rating: 4 },
  { name: "Antoine, 22", text: "J'ai arrete les ecrans au lit. 2 semaines plus tard, tout a change.", rating: 5 },
  { name: "Camille, 28", text: "La veilleuse ocean + pluie d'ambiance, c'est mon combo magique.", rating: 5 },
  { name: "Lucas, 33", text: "Plus besoin de somniferes. Le rituel fait le travail naturellement.", rating: 5 },
];

function ScrollingTestimonials() {
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-midnight to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-midnight to-transparent z-10 pointer-events-none" />
      <div className="flex gap-4 animate-scroll-left">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-72 glass-light rounded-2xl p-5"
          >
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <span
                  key={j}
                  className={`text-xs ${j < t.rating ? "text-amber" : "text-navy-lighter"}`}
                >
                  ★
                </span>
              ))}
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
      q: "En quoi Nuit Calme est different des autres apps ?",
      a: "Nuit Calme identifie LA cause specifique de ton mauvais sommeil (pas un score generique) et te donne un plan adapte a TOI. Le rituel du soir avec veilleuse, sons et respiration guidee est unique.",
    },
    {
      q: "Ca marche pour l'insomnie chronique ?",
      a: "Nuit Calme cible les mauvaises habitudes de sommeil. Pour l'insomnie chronique diagnostiquee, consulte un medecin. Nos outils peuvent completer un suivi medical.",
    },
    {
      q: "Combien de temps pour voir des resultats ?",
      a: "La plupart des utilisateurs sentent une difference des la premiere semaine. Les habitudes s'ancrent en 2-3 semaines. Le plan de 4 semaines est calibre pour des resultats durables.",
    },
    {
      q: "Mes donnees sont securisees ?",
      a: "Absolument. Tes donnees de sommeil restent sur ton appareil. Aucune information sensible ne transite par nos serveurs.",
    },
    {
      q: "Je peux utiliser Nuit Calme sur mon telephone ?",
      a: "Oui ! L'app est une PWA — elle s'installe comme une app native sur iPhone et Android. Pas besoin de passer par l'App Store.",
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

  const problemRef = useReveal();
  const stepsRef = useReveal();
  const featuresRef = useReveal();
  const ritualRef = useReveal();
  const testimonialsRef = useReveal();
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

      <Stars />

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
            <a
              href="#faq"
              className="hidden sm:block text-sm text-muted hover:text-soft-white transition-colors"
            >
              FAQ
            </a>
            {hasData ? (
              <Link
                href="/dashboard"
                className="text-sm glass-btn px-4 py-2 rounded-full text-amber font-medium"
              >
                Mon espace
              </Link>
            ) : (
              <CTAButton size="md" className="!rounded-full !px-5 !py-2 !text-sm" />
            )}
          </div>
        </div>
      </nav>

      {/* Hero — visual-first */}
      <section className="relative z-10 px-5 pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-3xl mx-auto text-center">
        {/* Phone mockup as hero visual */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative w-48 sm:w-56">
            <div className="rounded-[1.8rem] overflow-hidden glass-strong p-4 sm:p-5 aspect-[9/16] flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 40%, rgba(245,158,11,0.25), transparent 70%)" }} />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange/30 to-amber/20 blur-xl animate-breathe" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-light to-orange glow-amber" />
              </div>
              <p className="text-amber-light/80 text-base font-medium mb-0.5 relative">Inspire</p>
              <p className="text-muted/40 text-[10px] mb-4 relative">4 secondes</p>
              <div className="flex gap-1 mb-3 relative">
                {[1,2,3,4,5].map((_,i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 2 ? "bg-amber" : "bg-navy-lighter/60"}`} />
                ))}
              </div>
              <div className="flex gap-1.5 relative">
                {["🌧️", "🌊", "🌲"].map((s, i) => (
                  <span key={s} className={`px-2 py-0.5 rounded-full text-[9px] ${i === 0 ? "glass-accent text-amber" : "glass-light text-muted/50"}`}>{s}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-midnight/80" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5 animate-fade-in delay-100 opacity-0">
          Tu dors mal.
          <br />
          <span className="bg-gradient-to-r from-amber via-orange to-orange-deep bg-clip-text text-transparent">
            On sait pourquoi.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-md mx-auto mb-8 animate-fade-in delay-200 opacity-0 leading-relaxed">
          Nuit Calme identifie la cause exacte de tes insomnies et te guide
          chaque soir avec un rituel personnalise.
        </p>

        <div className="animate-fade-in delay-300 opacity-0">
          <CTAButton />
        </div>

        <p className="text-xs text-muted-dark mt-4 animate-fade-in delay-500 opacity-0">
          Resultat en 2 minutes. Sans engagement.
        </p>
      </section>

      {/* Scrolling testimonials */}
      <section className="relative z-10 pb-8">
        <ScrollingTestimonials />
      </section>

      {/* Problem section */}
      <section className="relative z-10 px-5 py-16 sm:py-20 overflow-hidden" ref={problemRef}>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image src="/images/night-stars.jpg" alt="" fill className="object-cover opacity-15" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/85 to-midnight" />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="reveal">
            <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
              Le probleme
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 leading-tight">
              Tu as tout essaye.
              <br />
              <span className="text-muted">Rien n&apos;a marche.</span>
            </h2>
            <p className="text-muted text-center text-sm sm:text-base mb-12 max-w-md mx-auto">
              Parce que le probleme n&apos;est pas ton matelas.
              C&apos;est ce que tu fais <span className="text-soft-white font-medium">avant</span> de te coucher.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "📱", title: "Scroll infini", desc: "45 min de TikTok au lit. La lumiere bleue bloque ta melatonine.", stat: "73%", sub: "scrollent au lit" },
              { icon: "☕", title: "Cafe tardif", desc: "Ton cafe de 16h est encore actif a 22h. La cafeine a 6h de demi-vie.", stat: "6h", sub: "demi-vie cafeine" },
              { icon: "🧠", title: "Cerveau en boucle", desc: "Stress, to-do list, ruminations. Ton cerveau refuse de se taire.", stat: "42%", sub: "des insomnies" },
            ].map((item, i) => (
              <div key={item.title} className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-5 hover:border-white/10 transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="text-right">
                    <p className="text-amber font-bold">{item.stat}</p>
                    <p className="text-[9px] text-muted-dark">{item.sub}</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-1.5">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="relative z-10 px-5 py-16 sm:py-20" ref={stepsRef}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal">
            <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
              Comment ca marche
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              3 etapes vers un sommeil repare
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-5">
            {[
              { step: "1", title: "Ton diagnostic", desc: "11 questions. On identifie la cause exacte — pas un score vague.", icon: "🔍" },
              { step: "2", title: "Ton plan", desc: "4 semaines progressives + micro-habitudes adaptees a ta cause.", icon: "📋" },
              { step: "3", title: "Ton rituel", desc: "Veilleuse, sons d'ambiance, respiration guidee. Chaque soir.", icon: "🌙" },
            ].map((item, i) => (
              <div key={item.step} className={`reveal reveal-delay-${i + 1} glass-light rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="font-semibold mb-1.5">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-4 text-center mt-10">
            <CTAButton />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-5 py-16 sm:py-20" ref={featuresRef}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal">
            <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
              L&apos;experience
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Tout pour reprendre le controle
              <br />
              <span className="text-amber">de tes nuits</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { emoji: "🔥", title: "5 veilleuses", desc: "Adaptees a ta cause de mauvais sommeil", color: "from-orange/20 to-amber/10" },
              { emoji: "🫁", title: "Respiration guidee", desc: "4 techniques phase par phase", color: "from-lavender/15 to-lavender/5" },
              { emoji: "✅", title: "Micro-habitudes", desc: "Specifiques a ta cause, suivi quotidien", color: "from-mint/15 to-mint/5" },
              { emoji: "📊", title: "Detection de patterns", desc: "Correlations habitudes / qualite de sommeil", color: "from-amber/15 to-amber/5" },
            ].map((item, i) => (
              <div key={item.title} className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-4 sm:p-5`}>
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} mb-3`}>
                  <span className="text-xl">{item.emoji}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual preview */}
      <section className="relative z-10 px-5 py-16 sm:py-20 overflow-hidden" ref={ritualRef}>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image src="/images/moon-clouds.jpg" alt="" fill className="object-cover opacity-12" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="reveal order-2 md:order-1">
              <p className="text-amber text-xs font-medium mb-3 uppercase tracking-widest">
                Le rituel du soir
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5 leading-tight">
                10 minutes qui changent
                <br />
                <span className="text-amber">tes 8 heures</span>
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "💡", text: "Veilleuse adaptee a ta cause" },
                  { icon: "🎵", text: "6 sons d'ambiance proceduraux" },
                  { icon: "🫁", text: "Respiration guidee phase par phase" },
                  { icon: "📱", text: "Installe comme une app sur ton telephone" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-muted">{item.text}</span>
                  </div>
                ))}
              </div>
              <CTAButton size="md" />
            </div>

            <div className="reveal reveal-delay-2 order-1 md:order-2 flex justify-center">
              <div className="relative w-52 sm:w-60">
                <div className="rounded-[1.8rem] overflow-hidden glass-strong p-5 aspect-[9/16] flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 50% 35%, rgba(0,102,153,0.3), transparent 70%)" }} />
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full blur-xl animate-breathe" style={{ background: "radial-gradient(circle, #0077B6aa, #003366)" }} />
                    <div className="absolute inset-3 rounded-full blur-md" style={{ background: "radial-gradient(circle, #006699, #001F3F)" }} />
                  </div>
                  <p className="text-[#0077B6] text-sm font-medium mb-0.5 relative">Ocean profond</p>
                  <p className="text-muted/30 text-[10px] mb-4 relative">Calme le systeme nerveux</p>
                  <div className="w-full glass-light rounded-lg p-2.5 relative">
                    <p className="text-[9px] text-muted/50 mb-1.5">Son d&apos;ambiance</p>
                    <div className="flex gap-1.5">
                      {["Pluie", "Ocean", "Foret"].map((s, i) => (
                        <span key={s} className={`px-2 py-0.5 rounded-full text-[8px] ${i === 1 ? "glass-accent text-amber" : "glass text-muted/40"}`}>{s}</span>
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

      {/* Second testimonials scroll */}
      <section className="relative z-10 py-8">
        <ScrollingTestimonials />
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-5 py-16 sm:py-20" ref={faqRef}>
        <div className="max-w-xl mx-auto">
          <div className="reveal">
            <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
              Questions frequentes
            </h2>
          </div>
          <div className="reveal reveal-delay-1">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-5 py-16 sm:py-24 overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image src="/images/night-lake.jpg" alt="" fill className="object-cover opacity-15" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/80 to-midnight" />
        </div>
        <div className="reveal max-w-xl mx-auto text-center glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-orange/5 pointer-events-none" />
          <div className="text-4xl mb-4">🌙</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 relative">
            Pret a reprendre le controle ?
          </h2>
          <p className="text-muted text-sm sm:text-base mb-8 relative max-w-sm mx-auto">
            Decouvre en 2 minutes ce qui empeche ton cerveau de lacher prise le
            soir.
          </p>
          <div className="relative">
            <CTAButton />
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
            <a href="#faq" className="text-xs text-muted-dark hover:text-muted transition-colors">FAQ</a>
            <span className="text-xs text-muted-dark">Fait avec soin pour tes nuits.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
