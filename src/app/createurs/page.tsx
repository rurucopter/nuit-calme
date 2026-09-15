"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    num: "1",
    title: "Teste Nuit Calme",
    desc: "Fais le diagnostic toi-meme. Tu dois connaitre le produit pour en parler.",
  },
  {
    num: "2",
    title: "Cree ton contenu",
    desc: "TikTok, Reel, carrousel. Montre le diagnostic en action, les resultats, ton avis honnete.",
  },
  {
    num: "3",
    title: "Partage ton lien",
    desc: "Chaque vente via ton lien te rapporte une commission. Paiement mensuel automatique.",
  },
];

const benefits = [
  { icon: "💰", title: "30% de commission", desc: "Sur chaque vente generee par ton lien, recurremment." },
  { icon: "📊", title: "Dashboard en temps reel", desc: "Suis tes clics, conversions et revenus en direct." },
  { icon: "🎨", title: "Kit createur fourni", desc: "Visuels, hooks, scripts. Tu n'as qu'a filmer." },
  { icon: "🤝", title: "Support dedie", desc: "Un canal direct avec l'equipe pour tes questions." },
];

const contentIdeas = [
  "\"J'ai teste l'app qui analyse POURQUOI tu dors mal\" — TikTok face-cam",
  "\"3 erreurs qui tuent ton sommeil\" — Carrousel Instagram",
  "\"Mon avant/apres avec Nuit Calme\" — Story time",
  "\"Le rituel du soir qui m'endort en 10 min\" — Screen recording",
];

export default function CreateursPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-dvh">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass">
        <div className="flex items-center justify-between px-5 py-3.5 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold text-sm">
              NC
            </div>
            <span className="font-semibold text-lg text-soft-white">
              Nuit Calme
            </span>
          </Link>
          <a
            href="#postuler"
            className="text-sm glass-btn px-4 py-2 rounded-full text-amber font-medium"
          >
            Devenir createur
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 glass-accent rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <span className="text-amber text-xs font-medium">
            Programme createurs
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold leading-[1.1] mb-5 animate-fade-in delay-100 opacity-0">
          Monetise ton audience
          <br />
          <span className="bg-gradient-to-r from-amber via-orange to-orange-deep bg-clip-text text-transparent">
            en aidant les gens a dormir
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-md mx-auto mb-8 animate-fade-in delay-200 opacity-0 leading-relaxed">
          Gagne 30% de commission recurrente en recommandant Nuit Calme.
          Un produit qui se vend tout seul — tu l&apos;as teste, tu en parles.
        </p>
        <a
          href="#postuler"
          className="inline-block rounded-2xl glass-btn-solid text-midnight font-semibold px-8 py-4 text-lg hover:scale-[1.02] active:scale-[0.98] animate-fade-in delay-300 opacity-0"
        >
          Rejoindre le programme
        </a>
      </section>

      {/* How it works */}
      <section className="px-5 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
            Comment ca marche
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            3 etapes pour commencer
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div key={s.num} className="glass-light rounded-2xl p-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-orange flex items-center justify-center text-midnight font-bold text-sm mb-3">
                  {s.num}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-5 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
            Avantages
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Ce qu&apos;on t&apos;offre
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="glass rounded-2xl p-4 sm:p-5">
                <span className="text-2xl mb-3 block">{b.icon}</span>
                <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content ideas */}
      <section className="px-5 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber text-xs font-medium text-center mb-3 uppercase tracking-widest">
            Inspiration
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Idees de contenu
          </h2>
          <div className="space-y-3">
            {contentIdeas.map((idea) => (
              <div key={idea} className="glass-light rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="text-amber text-lg flex-shrink-0">→</span>
                <p className="text-sm text-muted">{idea}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="postuler" className="px-5 py-16 sm:py-24">
        <div className="max-w-md mx-auto glass rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-orange/5 pointer-events-none" />
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-3 relative">
            Pret a commencer ?
          </h2>
          <p className="text-muted text-sm mb-6 relative">
            Laisse ton email. On t&apos;envoie ton lien affilie + le kit createur.
          </p>

          {submitted ? (
            <div className="glass-accent rounded-2xl p-5 relative">
              <p className="text-amber font-medium mb-1">Candidature recue !</p>
              <p className="text-muted text-sm">
                On te recontacte sous 24h avec ton acces.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full px-5 py-3.5 rounded-2xl glass-input text-soft-white placeholder:text-muted-dark focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="w-full px-6 py-3.5 rounded-2xl glass-btn-solid text-midnight font-semibold hover:scale-[1.02] active:scale-[0.98]"
              >
                Envoyer ma candidature
              </button>
              <p className="text-[10px] text-muted-dark/60">
                Pas de spam. On te contacte uniquement pour le programme.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber to-orange" />
            Nuit Calme
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs text-muted-dark hover:text-muted transition-colors">
              Accueil
            </Link>
            <span className="text-xs text-muted-dark">Programme createurs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
