import { CauseType, Habit, DailyCheckIn, PatternInsight } from './types';

export const habitsByCause: Record<CauseType, Habit[]> = {
  screen_addiction: [
    { id: 'phone-away', label: 'Telephone pose hors de la chambre', emoji: '📵', cause: 'screen_addiction' },
    { id: 'night-mode', label: 'Mode nuit active des 20h', emoji: '🌙', cause: 'screen_addiction' },
    { id: 'no-scroll', label: 'Pas de scroll 30 min avant le coucher', emoji: '🚫', cause: 'screen_addiction' },
    { id: 'read-10min', label: '10 min de lecture physique', emoji: '📖', cause: 'screen_addiction' },
  ],
  late_caffeine: [
    { id: 'last-coffee-14h', label: 'Dernier cafe avant 14h', emoji: '☕', cause: 'late_caffeine' },
    { id: 'herbal-tea', label: 'Tisane du soir', emoji: '🍵', cause: 'late_caffeine' },
    { id: 'water-after-16', label: 'Eau seulement apres 16h', emoji: '💧', cause: 'late_caffeine' },
    { id: 'decaf-swap', label: 'Decafeine a la place du cafe', emoji: '🔄', cause: 'late_caffeine' },
  ],
  stress_rumination: [
    { id: 'journal-3', label: '3 pensees ecrites sur papier', emoji: '📝', cause: 'stress_rumination' },
    { id: 'breathing-5min', label: '5 min de respiration consciente', emoji: '🫁', cause: 'stress_rumination' },
    { id: 'gratitude-3', label: '3 choses pour lesquelles etre reconnaissant', emoji: '🙏', cause: 'stress_rumination' },
    { id: 'email-cutoff', label: 'Pas d\'emails apres 20h', emoji: '📧', cause: 'stress_rumination' },
  ],
  irregular_schedule: [
    { id: 'same-wake', label: 'Reveil a la meme heure', emoji: '⏰', cause: 'irregular_schedule' },
    { id: 'same-bed', label: 'Coucher dans le creneau prevu', emoji: '🛏️', cause: 'irregular_schedule' },
    { id: 'no-nap-20', label: 'Pas de sieste > 20 min', emoji: '😴', cause: 'irregular_schedule' },
    { id: 'light-morning', label: 'Lumiere naturelle des le reveil', emoji: '☀️', cause: 'irregular_schedule' },
  ],
  late_exercise: [
    { id: 'sport-before-18', label: 'Sport termine avant 18h', emoji: '🏃', cause: 'late_exercise' },
    { id: 'stretch-evening', label: 'Etirements doux le soir', emoji: '🧘', cause: 'late_exercise' },
    { id: 'cool-down', label: 'Douche tiede apres le sport', emoji: '🚿', cause: 'late_exercise' },
    { id: 'walk-evening', label: 'Marche calme le soir (pas de cardio)', emoji: '🚶', cause: 'late_exercise' },
  ],
  no_routine: [
    { id: 'ritual-fixed', label: 'Rituel lance a heure fixe', emoji: '🕐', cause: 'no_routine' },
    { id: 'skincare', label: 'Routine skincare / hygiene', emoji: '✨', cause: 'no_routine' },
    { id: 'herbal-tea-nr', label: 'Tisane ou boisson chaude', emoji: '🍵', cause: 'no_routine' },
    { id: 'dim-lights', label: 'Lumieres tamisees 1h avant', emoji: '💡', cause: 'no_routine' },
  ],
};

export function getHabitsForCause(cause: CauseType): Habit[] {
  return habitsByCause[cause] ?? [];
}

export function getHabitCompletionRate(
  habitCompletions: Record<string, Record<string, boolean>>,
  days: number = 7
): number {
  const completions: boolean[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayHabits = habitCompletions[dateStr];
    if (dayHabits) {
      const values = Object.values(dayHabits);
      const done = values.filter(Boolean).length;
      completions.push(done >= values.length / 2);
    }
  }
  if (completions.length === 0) return 0;
  return Math.round((completions.filter(Boolean).length / completions.length) * 100);
}

export function detectPatterns(checkIns: DailyCheckIn[]): PatternInsight[] {
  const insights: PatternInsight[] = [];
  if (checkIns.length < 3) return insights;

  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recent = sorted.slice(0, 7);

  const recentBadNights = recent.filter(c => c.sleepQuality <= 2).length;
  const recentGoodNights = recent.filter(c => c.sleepQuality >= 4).length;
  const ritualFollowed = recent.filter(c => c.followedRitual).length;
  const ritualNotFollowed = recent.filter(c => !c.followedRitual).length;

  // 3+ bad nights in a row
  let badStreak = 0;
  for (const c of recent) {
    if (c.sleepQuality <= 2) badStreak++;
    else break;
  }
  if (badStreak >= 3) {
    insights.push({
      type: 'warning',
      title: `${badStreak} mauvaises nuits d'affilee`,
      description:
        'Ton sommeil se degrade. Verifie si quelque chose a change cette semaine : stress, ecrans, cafeine tardive.',
      emoji: '⚠️',
    });
  }

  // Correlation: ritual skipped → bad sleep
  const noRitualBadSleep = recent.filter(
    c => !c.followedRitual && c.sleepQuality <= 2
  ).length;
  if (noRitualBadSleep >= 2 && ritualNotFollowed >= 2) {
    insights.push({
      type: 'suggestion',
      title: 'Le rituel fait la difference',
      description: `Les nuits ou tu sautes le rituel sont souvent moins bonnes. Essaie de le maintenir ce soir.`,
      emoji: '💡',
    });
  }

  // Positive trend
  if (recentGoodNights >= 4) {
    insights.push({
      type: 'positive',
      title: 'Belle serie !',
      description: `${recentGoodNights} bonnes nuits sur les 7 derniers jours. Tes habitudes payent.`,
      emoji: '🌟',
    });
  }

  // Ritual compliance improving
  if (ritualFollowed >= 5) {
    insights.push({
      type: 'positive',
      title: 'Rituel bien ancre',
      description: `Tu as suivi ton rituel ${ritualFollowed} fois sur ${recent.length} jours. La regularite, c'est la cle.`,
      emoji: '🔥',
    });
  }

  // Sleep latency pattern
  const longLatency = recent.filter(
    c => c.sleepLatency === 'long' || c.sleepLatency === 'very-long'
  ).length;
  if (longLatency >= 3) {
    insights.push({
      type: 'suggestion',
      title: 'Tu mets du temps a t\'endormir',
      description:
        'Essaie de ne te coucher que quand tu sens le sommeil venir. Si apres 20 min tu ne dors pas, leve-toi et fais quelque chose de calme.',
      emoji: '🛏️',
    });
  }

  // Detect potential cause from check-ins
  const causes = recent
    .filter(c => c.potentialCause)
    .map(c => c.potentialCause!);
  const causeCounts = causes.reduce<Record<string, number>>((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});
  const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0];
  if (topCause && topCause[1] >= 2) {
    const causeLabels: Record<string, string> = {
      screen: 'les ecrans',
      stress: 'le stress',
      caffeine: 'la cafeine',
      late_bed: 'le coucher tardif',
      noise: 'le bruit',
      other: 'un facteur externe',
    };
    insights.push({
      type: 'suggestion',
      title: `Pattern detecte : ${causeLabels[topCause[0]] ?? topCause[0]}`,
      description: `${topCause[1]} de tes mauvaises nuits recentes sont liees a ${causeLabels[topCause[0]] ?? topCause[0]}. Concentre-toi la-dessus cette semaine.`,
      emoji: '🔍',
    });
  }

  return insights;
}

export const nightlightThemes: Record<string, { label: string; emoji: string; colors: string[]; description: string }> = {
  braise: {
    label: 'Braise',
    emoji: '🔥',
    colors: ['#8B2500', '#CD4F39', '#FF6347', '#FF8C00', '#FFA500'],
    description: 'Lueur chaude de braises — ideal pour se detacher des ecrans',
  },
  aurore: {
    label: 'Aurore',
    emoji: '🌌',
    colors: ['#2E0854', '#4B0082', '#6A5ACD', '#7B68EE', '#9370DB'],
    description: 'Ondulations douces violettes — apaise les ruminations',
  },
  ocean: {
    label: 'Ocean profond',
    emoji: '🌊',
    colors: ['#001F3F', '#003366', '#004080', '#006699', '#0077B6'],
    description: 'Bleu profond apaisant — calme le systeme nerveux',
  },
  lavande: {
    label: 'Lavande',
    emoji: '💜',
    colors: ['#4A0E4E', '#6B3FA0', '#9B59B6', '#C39BD3', '#D7BDE2'],
    description: 'Brume mauve relaxante — pour un lacher-prise total',
  },
  foret: {
    label: 'Foret',
    emoji: '🌲',
    colors: ['#0B3D0B', '#1B5E1B', '#228B22', '#2E8B57', '#3CB371'],
    description: 'Vert profond et lucioles — ancrage et retour au calme',
  },
};

export const breathingExercises: Record<string, { label: string; description: string; phases: { name: string; duration: number }[]; cycles: number }> = {
  'breathing-478': {
    label: 'Respiration 4-7-8',
    description: 'Inspire 4s, retiens 7s, expire 8s. Active le systeme parasympathique.',
    phases: [
      { name: 'Inspire', duration: 4 },
      { name: 'Retiens', duration: 7 },
      { name: 'Expire', duration: 8 },
    ],
    cycles: 5,
  },
  coherence: {
    label: 'Coherence cardiaque',
    description: 'Inspire 5s, expire 5s. Synchronise le coeur et le cerveau.',
    phases: [
      { name: 'Inspire', duration: 5 },
      { name: 'Expire', duration: 5 },
    ],
    cycles: 6,
  },
  box: {
    label: 'Box breathing',
    description: 'Inspire 4s, retiens 4s, expire 4s, retiens 4s. Utilise par les Navy SEALs.',
    phases: [
      { name: 'Inspire', duration: 4 },
      { name: 'Retiens', duration: 4 },
      { name: 'Expire', duration: 4 },
      { name: 'Pause', duration: 4 },
    ],
    cycles: 5,
  },
  relaxation: {
    label: 'Relaxation progressive',
    description: 'Inspire 3s, expire 6s. L\'expiration longue favorise le relachement.',
    phases: [
      { name: 'Inspire', duration: 3 },
      { name: 'Expire', duration: 6 },
    ],
    cycles: 8,
  },
};

export function getRecommendedTheme(cause: CauseType): string {
  const map: Record<CauseType, string> = {
    screen_addiction: 'braise',
    late_caffeine: 'ocean',
    stress_rumination: 'aurore',
    irregular_schedule: 'lavande',
    late_exercise: 'foret',
    no_routine: 'lavande',
  };
  return map[cause] ?? 'braise';
}

export function getRecommendedExercise(cause: CauseType): string {
  const map: Record<CauseType, string> = {
    screen_addiction: 'relaxation',
    late_caffeine: 'coherence',
    stress_rumination: 'breathing-478',
    irregular_schedule: 'coherence',
    late_exercise: 'box',
    no_routine: 'breathing-478',
  };
  return map[cause] ?? 'breathing-478';
}
