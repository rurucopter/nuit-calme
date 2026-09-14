"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/storage";

const MONTHLY_PRICE = 9.90;
const ANNUAL_PRICE = 59.90;
const ANNUAL_MONTHLY = +(ANNUAL_PRICE / 12).toFixed(2);
const SAVINGS = Math.round((1 - ANNUAL_MONTHLY / MONTHLY_PRICE) * 100);

export default function OffrePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState(false);
  const [cause, setCause] = useState("");

  useEffect(() => {
    const data = getUserData();
    if (data.verdict) {
      const labels: Record<string, string> = {
        screen_addiction: "les ecrans",
        late_caffeine: "la cafeine",
        stress_rumination: "le stress",
        irregular_schedule: "tes horaires",
        late_exercise: "le sport tardif",
        no_routine: "l'absence de routine",
      };
      setCause(labels[data.verdict.primaryCause] ?? "tes habitudes");
    }
  }, []);

  const handlePurchase = () => {
    setLoading(true);
    // Stripe integration placeholder
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-dvh flex flex-col px-5 py-8 max-w-lg mx-auto relative">
      {/* Discreet exit — conformity only */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 text-muted-dark/30 hover:text-muted-dark text-xs p-2"
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <div className="inline-flex items-center gap-2 glass-accent rounded-full px-4 py-1.5 mb-4">
          <span className="text-amber text-xs font-medium">
            Programme personnalise pret
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          Reprends le controle
          <br />
          <span className="bg-gradient-to-r from-amber to-orange bg-clip-text text-transparent">
            de tes nuits
          </span>
        </h1>
        {cause && (
          <p className="text-muted text-sm">
            Ton programme est calibre pour combattre {cause}.
          </p>
        )}
      </div>

      {/* What's included */}
      <div className="glass rounded-2xl p-5 mb-6">
        <p className="text-xs text-amber uppercase tracking-widest mb-4">
          Inclus dans ton programme
        </p>
        <div className="space-y-3">
          {[
            { icon: "🎯", text: "Plan de 4 semaines adapte a TA cause" },
            { icon: "🌙", text: "Rituel du soir avec veilleuse + sons + respiration" },
            { icon: "📊", text: "Tableau de bord avec suivi de progres" },
            { icon: "✅", text: "Micro-habitudes quotidiennes personnalisees" },
            { icon: "🧠", text: "Detection de patterns dans ton sommeil" },
            { icon: "📱", text: "App installable sur ton telephone (PWA)" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-soft-white">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan selection */}
      <div className="space-y-3 mb-6">
        {/* Annual — recommended */}
        <button
          onClick={() => setPlan("annual")}
          className={`w-full text-left rounded-2xl p-4 transition-all duration-200 relative overflow-hidden ${
            plan === "annual"
              ? "glass-accent border-amber/30"
              : "glass-light hover:bg-white/[0.04]"
          }`}
        >
          {plan === "annual" && (
            <div className="absolute top-0 right-0 bg-amber text-midnight text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              -{SAVINGS}%
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    plan === "annual"
                      ? "border-amber bg-amber"
                      : "border-muted-dark"
                  }`}
                >
                  {plan === "annual" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-midnight" />
                  )}
                </div>
                <span className="font-semibold text-sm">Annuel</span>
                <span className="text-[10px] glass-accent px-2 py-0.5 rounded-full text-amber font-medium">
                  Populaire
                </span>
              </div>
              <p className="text-xs text-muted ml-6">
                {ANNUAL_MONTHLY.toFixed(2).replace(".", ",")}€ / mois — facture{" "}
                {ANNUAL_PRICE.toFixed(2).replace(".", ",")}€ / an
              </p>
            </div>
          </div>
        </button>

        {/* Monthly */}
        <button
          onClick={() => setPlan("monthly")}
          className={`w-full text-left rounded-2xl p-4 transition-all duration-200 ${
            plan === "monthly"
              ? "glass-accent border-amber/30"
              : "glass-light hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    plan === "monthly"
                      ? "border-amber bg-amber"
                      : "border-muted-dark"
                  }`}
                >
                  {plan === "monthly" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-midnight" />
                  )}
                </div>
                <span className="font-semibold text-sm">Mensuel</span>
              </div>
              <p className="text-xs text-muted ml-6">
                {MONTHLY_PRICE.toFixed(2).replace(".", ",")}€ / mois — sans engagement
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full px-8 py-4 rounded-2xl glass-btn-solid text-midnight font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" />
            Chargement...
          </span>
        ) : (
          <>
            Commencer maintenant —{" "}
            {plan === "annual"
              ? `${ANNUAL_PRICE.toFixed(2).replace(".", ",")}€/an`
              : `${MONTHLY_PRICE.toFixed(2).replace(".", ",")}€/mois`}
          </>
        )}
      </button>

      {/* Trust signals */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-dark">
          <span>🔒 Paiement securise</span>
          <span>↩️ Garantie 14 jours</span>
        </div>
        <p className="text-[10px] text-muted-dark/60">
          Resiliation en un clic. Pas d&apos;engagement cache.
        </p>
      </div>

      {/* Social proof mini */}
      <div className="glass-light rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["😊", "😴", "🙂", "😌"].map((e, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm border-2 border-midnight"
              >
                {e}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-soft-white font-medium">
              +2 340 personnes
            </p>
            <p className="text-[10px] text-muted">
              ont ameliore leur sommeil ce mois-ci
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="glass rounded-2xl p-4">
        <div className="flex gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-amber text-xs">
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-muted italic mb-2">
          &ldquo;Je m&apos;endors en 10 min au lieu de 45. Le diagnostic a vraiment
          mis le doigt sur mon probleme.&rdquo;
        </p>
        <p className="text-xs text-muted-dark">— Lea, 24 ans</p>
      </div>
    </div>
  );
}
