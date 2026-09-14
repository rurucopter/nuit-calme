import { CauseType, Plan } from './types';

interface PlanTemplate {
  title: string;
  description: string;
  weeks: {
    number: number;
    title: string;
    subtitle: string;
    goals: string[];
    tip: string;
  }[];
  meditationType: string;
}

const planTemplates: Record<CauseType, PlanTemplate> = {
  screen_addiction: {
    title: 'Decroche avant de dormir',
    description:
      'En 4 semaines, tu vas progressivement remplacer le scroll du soir par un rituel qui prepare ton cerveau au sommeil.',
    meditationType: 'sensory_calm',
    weeks: [
      {
        number: 1,
        title: 'Le sevrage doux',
        subtitle: "On ne te demande pas d'arreter d'un coup",
        goals: [
          'Couper les ecrans 30 min avant le coucher',
          'Activer le mode nuit sur ton telephone des 20h',
          'Lancer le rituel Nuit Calme chaque soir',
        ],
        tip: 'Pose ton telephone dans une autre piece 30 min avant de dormir. Si tu le gardes a portee de main, tu le reprendras.',
      },
      {
        number: 2,
        title: "L'extension",
        subtitle: 'On allonge la zone sans ecran',
        goals: [
          'Passer a 45 min sans ecran avant le coucher',
          'Charger ton telephone hors de la chambre',
          'Ajouter 10 min de lecture physique',
        ],
        tip: "Achete un reveil a 10 euros. C'est la seule chose qui te manquera si ton telephone n'est plus sur ta table de nuit.",
      },
      {
        number: 3,
        title: 'Le nouveau normal',
        subtitle: 'Le rituel devient automatique',
        goals: [
          '1h sans ecran avant le coucher',
          'Rituel Nuit Calme devenu une habitude',
          'Observer les premiers resultats sur ton sommeil',
        ],
        tip: "A ce stade, tu devrais commencer a sentir la difference au reveil. Note-la dans tes check-ins.",
      },
      {
        number: 4,
        title: 'Consolidation',
        subtitle: 'Ancrer le changement',
        goals: [
          'Maintenir 1h sans ecran en semaine',
          'Se permettre plus de flexibilite le weekend',
          'Viser 80% de compliance sur la semaine',
        ],
        tip: "La perfection n'est pas le but. 5 soirs sur 7 sans ecran, c'est deja une victoire enorme.",
      },
    ],
  },
  late_caffeine: {
    title: 'Recale ta cafeine',
    description:
      "En 4 semaines, tu vas avancer l'heure de ton dernier cafe pour que la cafeine ne sabote plus ton endormissement.",
    meditationType: 'muscle_relaxation',
    weeks: [
      {
        number: 1,
        title: 'Prise de conscience',
        subtitle: "Comprendre l'impact reel",
        goals: [
          'Dernier cafe avant 16h (pas apres)',
          "Remplacer le cafe d'apres-midi par du decafeine ou une tisane",
          'Lancer le rituel Nuit Calme pour compenser la transition',
        ],
        tip: "Le decafeine a le meme gout. Ce n'est pas la cafeine que tu aimes, c'est le rituel de boire un cafe.",
      },
      {
        number: 2,
        title: 'Le recalage',
        subtitle: "On avance encore l'heure limite",
        goals: [
          'Dernier cafe avant 14h',
          'Maximum 2 cafes par jour',
          'Tester une tisane relaxante le soir',
        ],
        tip: "Les infusions camomille-lavande sont de vrais allies du sommeil. Teste-en plusieurs pour trouver celle qui te plait.",
      },
      {
        number: 3,
        title: 'Le rythme installe',
        subtitle: "Ton corps s'adapte",
        goals: [
          'Maintenir le dernier cafe avant 14h',
          "Observer l'impact sur ton endormissement",
          'Rituel du soir bien ancre',
        ],
        tip: "Tu devrais sentir que tu t'endors plus vite. Note l'heure a laquelle tu sens le sommeil arriver.",
      },
      {
        number: 4,
        title: 'Autonomie',
        subtitle: 'Tu geres',
        goals: [
          'Garder la regle "dernier cafe avant 14h"',
          'Ecouter ton corps, ajuster si besoin',
          'Profiter de tes nuits reparees',
        ],
        tip: "Si tu te surprends a mieux dormir le weekend (sans cafe l'apres-midi), c'est la preuve que ca marche.",
      },
    ],
  },
  stress_rumination: {
    title: 'Apaise ton mental',
    description:
      'En 4 semaines, tu vas apprendre a deconnecter ton cerveau le soir grace a des techniques de lacher-prise progressives.',
    meditationType: 'letting_go',
    weeks: [
      {
        number: 1,
        title: 'Le carnet de decharge',
        subtitle: 'Sortir les pensees de ta tete',
        goals: [
          'Ecrire 3 pensees/inquietudes sur papier avant le rituel du soir',
          'Lancer le rituel Nuit Calme avec la meditation guidee',
          'Technique de respiration 4-7-8 au coucher',
        ],
        tip: 'Ecrire tes pensees sur papier les "sort" de ton cerveau. Ton inconscient les lache car elles sont "sauvegardees" quelque part.',
      },
      {
        number: 2,
        title: 'La respiration qui calme',
        subtitle: 'Ton outil anti-rumination',
        goals: [
          'Pratiquer la respiration 4-7-8 (inspire 4s, retiens 7s, expire 8s)',
          'Faire le body scan de la meditation guidee',
          'Identifier tes declencheurs de stress du soir',
        ],
        tip: "La respiration 4-7-8 active physiquement ton systeme parasympathique. Ce n'est pas du placebo, c'est de la physiologie.",
      },
      {
        number: 3,
        title: 'La frontiere soir/nuit',
        subtitle: 'Creer une vraie coupure',
        goals: [
          'Definir une "heure de fermeture" pour le travail/les soucis',
          "Aucune consultation d'emails ou messages apres cette heure",
          'Rituel complet chaque soir',
        ],
        tip: "L'heure de fermeture, c'est un contrat avec toi-meme : apres cette heure, les problemes attendront demain matin.",
      },
      {
        number: 4,
        title: 'Serenite acquise',
        subtitle: 'Le calme devient naturel',
        goals: [
          'Les techniques de lacher-prise sont devenues reflexes',
          'Les reveils nocturnes ont diminue',
          'Tu sais gerer une soiree stressante',
        ],
        tip: "Si une nuit difficile revient, ce n'est pas un echec. Tu as maintenant les outils pour la gerer.",
      },
    ],
  },
  irregular_schedule: {
    title: 'Recale ton horloge',
    description:
      'En 4 semaines, tu vas stabiliser tes horaires de sommeil pour que ton corps sache quand produire la melatonine.',
    meditationType: 'evening_anchor',
    weeks: [
      {
        number: 1,
        title: 'L\'heure fixe du reveil',
        subtitle: "C'est LE levier le plus puissant",
        goals: [
          'Se reveiller a la meme heure chaque jour (plus ou moins 30 min), weekend inclus',
          'Definir ton heure de coucher cible',
          'Lancer le rituel Nuit Calme chaque soir',
        ],
        tip: "Oui, meme le weekend. C'est dur les 2 premieres semaines, puis ton corps s'ajuste et tu te reveilles naturellement.",
      },
      {
        number: 2,
        title: 'Le coucher regulier',
        subtitle: 'Installer la regularite cote soir',
        goals: [
          'Se coucher dans un creneau de 30 min chaque soir',
          'Pas de sieste de plus de 20 min',
          'Rituel du soir a heure fixe',
        ],
        tip: "Si tu n'as pas sommeil a l'heure prevue, lance quand meme le rituel. Le signal regulier finira par declencher le sommeil.",
      },
      {
        number: 3,
        title: "Le rythme s'installe",
        subtitle: 'Ton horloge interne se recale',
        goals: [
          'Maintenir les horaires fixes',
          'Observer l\'endormissement plus rapide',
          'Reduire les reveils nocturnes',
        ],
        tip: "Ton corps commence a anticiper le sommeil. Tu devrais bailler naturellement pres de ton heure de coucher.",
      },
      {
        number: 4,
        title: 'Rythme circadien restaure',
        subtitle: 'Ton corps sait quelle heure il est',
        goals: [
          "Tu t'endors en moins de 20 min",
          "Tu te reveilles avant l'alarme",
          'Le weekend ne deregle plus ton rythme',
        ],
        tip: "Se reveiller naturellement avant l'alarme, c'est le signe que ton horloge interne fonctionne parfaitement.",
      },
    ],
  },
  late_exercise: {
    title: 'Decale ton sport',
    description:
      'En 4 semaines, tu vas deplacer tes seances de sport plus tot dans la journee pour ne plus saboter ton endormissement.',
    meditationType: 'muscle_relaxation',
    weeks: [
      {
        number: 1,
        title: 'Le test du decalage',
        subtitle: 'Essaie de bouger ton creneau',
        goals: [
          'Decaler au moins 2 seances avant 18h cette semaine',
          'Les soirs de sport tardif : rituel Nuit Calme obligatoire',
          'Etirements doux le soir a la place',
        ],
        tip: "Si tu ne peux vraiment pas changer l'horaire, reduis l'intensite les soirs : yoga ou marche plutot que HIIT.",
      },
      {
        number: 2,
        title: 'Le nouvel horaire',
        subtitle: 'Integrer le sport plus tot',
        goals: [
          'Toutes tes seances avant 18h (ou maximum 19h)',
          'Seance du soir remplacee par du yoga/etirements',
          'Rituel du soir fluide et regulier',
        ],
        tip: 'Le sport le matin booste ta journee ET ameliore ton sommeil le soir. Double benefice.',
      },
      {
        number: 3,
        title: 'Le rythme naturel',
        subtitle: 'Ton corps apprecie le changement',
        goals: [
          'Sport integre tot dans ta routine',
          "Endormissement plus rapide les soirs d'entrainement",
          'Energie stable toute la journee',
        ],
        tip: 'Compare tes check-ins des jours "sport le matin" vs anciens "sport le soir" — la difference parle d\'elle-meme.',
      },
      {
        number: 4,
        title: 'Equilibre trouve',
        subtitle: 'Performance + sommeil',
        goals: [
          'Maintenir le nouvel horaire',
          'Flexibilite sans retomber dans le sport tardif',
          'Sommeil et recuperation optimises',
        ],
        tip: "Un bon sommeil ameliore tes performances sportives. Tu ne perds rien en decalant, tu gagnes sur les deux tableaux.",
      },
    ],
  },
  no_routine: {
    title: 'Construis ton rituel',
    description:
      "En 4 semaines, tu vas creer un rituel du soir qui signale a ton cerveau qu'il est temps de ralentir.",
    meditationType: 'evening_anchor',
    weeks: [
      {
        number: 1,
        title: 'Le premier signal',
        subtitle: 'Donne un repere a ton cerveau',
        goals: [
          'Lancer le rituel Nuit Calme chaque soir a heure fixe',
          'Meme heure, meme endroit, meme sequence',
          'Juste 10 min pour commencer',
        ],
        tip: 'La regularite compte plus que la duree. 10 min chaque soir battent 1h de temps en temps.',
      },
      {
        number: 2,
        title: "L'enrichissement",
        subtitle: 'Ajouter des elements au rituel',
        goals: [
          'Passer a 15-20 min de rituel',
          'Ajouter un element physique : tisane, etirements, ou skincare',
          'Meditation guidee complete',
        ],
        tip: "Un rituel multi-sensoriel est plus puissant : quelque chose a boire (tisane), sentir (lavande), et ecouter (meditation).",
      },
      {
        number: 3,
        title: "L'automatisme",
        subtitle: 'Le rituel se declenche tout seul',
        goals: [
          'Tu penses naturellement au rituel en fin de soiree',
          'Le corps commence a se detendre des le debut du rituel',
          'Endormissement plus rapide',
        ],
        tip: "Quand tu bailles en lancant le rituel, c'est gagne : ton cerveau a associe le rituel au sommeil.",
      },
      {
        number: 4,
        title: 'Rituel ancre',
        subtitle: "C'est devenu ta routine",
        goals: [
          'Le rituel fait partie de ta vie',
          'Tu te sens "bizarre" si tu le sautes',
          'Qualite de sommeil nettement amelioree',
        ],
        tip: "Quand sauter le rituel te semble aussi bizarre que ne pas te brosser les dents, mission accomplie.",
      },
    ],
  },
};

export function generatePlan(cause: CauseType): Plan {
  const template = planTemplates[cause];
  return {
    ...template,
    startDate: new Date().toISOString(),
  };
}
