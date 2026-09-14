import { DiagnosticAnswers, CauseType, Verdict, Question } from './types';

export const questions: Question[] = [
  {
    id: 'bedtime',
    question: 'A quelle heure tu te couches en general ?',
    options: [
      { value: 'before-22', label: 'Avant 22h', emoji: '🌅' },
      { value: '22-23', label: '22h - 23h', emoji: '🌙' },
      { value: '23-00', label: '23h - minuit', emoji: '🌑' },
      { value: 'after-00', label: 'Apres minuit', emoji: '🦉' },
    ],
  },
  {
    id: 'wakeTime',
    question: 'Et tu te reveilles a quelle heure ?',
    options: [
      { value: 'before-6', label: 'Avant 6h', emoji: '⏰' },
      { value: '6-7', label: '6h - 7h', emoji: '🌤' },
      { value: '7-8', label: '7h - 8h', emoji: '☀️' },
      { value: 'after-8', label: 'Apres 8h', emoji: '😴' },
    ],
  },
  {
    id: 'caffeineCount',
    question: 'Combien de cafes ou thes par jour ?',
    options: [
      { value: '0', label: 'Aucun', emoji: '🚫' },
      { value: '1-2', label: '1 a 2', emoji: '☕' },
      { value: '3-4', label: '3 a 4', emoji: '☕☕' },
      { value: '5+', label: '5 ou plus', emoji: '🫠' },
    ],
  },
  {
    id: 'lastCaffeineTime',
    question: 'Ton dernier cafe, c\'est vers quelle heure ?',
    subtitle: 'La cafeine reste active 5 a 6 heures dans ton corps.',
    options: [
      { value: 'before-12', label: 'Avant midi', emoji: '✅' },
      { value: '12-14', label: '12h - 14h', emoji: '🟡' },
      { value: '14-17', label: '14h - 17h', emoji: '🟠' },
      { value: 'after-17', label: 'Apres 17h', emoji: '🔴' },
    ],
  },
  {
    id: 'screenTime',
    question: 'Combien de temps sur ton telephone avant de dormir ?',
    subtitle: 'Sois honnete, on ne juge pas.',
    options: [
      { value: '0-15', label: 'Moins de 15 min', emoji: '👍' },
      { value: '15-30', label: '15 - 30 min', emoji: '📱' },
      { value: '30-60', label: '30 min - 1h', emoji: '📲' },
      { value: '60+', label: 'Plus d\'1 heure', emoji: '🕳️' },
    ],
  },
  {
    id: 'beforeBedActivity',
    question: 'Que fais-tu juste avant de dormir ?',
    options: [
      { value: 'social', label: 'Scroll reseaux sociaux', emoji: '📱' },
      { value: 'video', label: 'Series / videos', emoji: '📺' },
      { value: 'reading', label: 'Lecture', emoji: '📖' },
      { value: 'nothing', label: 'Rien de particulier', emoji: '🤷' },
    ],
  },
  {
    id: 'exerciseFrequency',
    question: 'Tu fais du sport ?',
    options: [
      { value: 'never', label: 'Jamais', emoji: '🛋️' },
      { value: '1-2', label: '1 a 2x / semaine', emoji: '🏃' },
      { value: '3-4', label: '3 a 4x / semaine', emoji: '💪' },
      { value: '5+', label: '5x ou plus', emoji: '🏋️' },
    ],
  },
  {
    id: 'exerciseTime',
    question: 'A quel moment de la journee ?',
    options: [
      { value: 'morning', label: 'Le matin', emoji: '🌅' },
      { value: 'noon', label: 'Le midi', emoji: '☀️' },
      { value: 'afternoon', label: 'L\'apres-midi', emoji: '🌤' },
      { value: 'evening', label: 'Le soir (apres 19h)', emoji: '🌙' },
    ],
  },
  {
    id: 'eveningMind',
    question: 'Le soir, ton esprit est plutot...',
    options: [
      { value: 'calm', label: 'Calme', emoji: '😌' },
      { value: 'slightly-agitated', label: 'Un peu agite', emoji: '🤔' },
      { value: 'very-agitated', label: 'Tres agite', emoji: '🌀' },
      { value: 'anxious', label: 'Anxieux', emoji: '😰' },
    ],
  },
  {
    id: 'nightWakeups',
    question: 'Tu te reveilles la nuit ?',
    options: [
      { value: 'never', label: 'Jamais', emoji: '😴' },
      { value: 'rarely', label: 'Rarement', emoji: '🌙' },
      { value: 'often', label: 'Souvent', emoji: '👀' },
      { value: 'every-night', label: 'Chaque nuit', emoji: '😩' },
    ],
  },
  {
    id: 'morningFeeling',
    question: 'Au reveil, tu te sens comment ?',
    options: [
      { value: 'rested', label: 'Repose(e)', emoji: '😊' },
      { value: 'slightly-tired', label: 'Un peu fatigue(e)', emoji: '😐' },
      { value: 'exhausted', label: 'Epuise(e)', emoji: '😫' },
      { value: 'zombie', label: 'Comme un zombie', emoji: '🧟' },
    ],
  },
];

interface CauseScore {
  cause: CauseType;
  score: number;
}

export function analyzeDiagnostic(answers: DiagnosticAnswers): Verdict {
  const scores: CauseScore[] = [
    { cause: 'screen_addiction', score: scoreScreenAddiction(answers) },
    { cause: 'late_caffeine', score: scoreLateCaffeine(answers) },
    { cause: 'stress_rumination', score: scoreStressRumination(answers) },
    { cause: 'irregular_schedule', score: scoreIrregularSchedule(answers) },
    { cause: 'late_exercise', score: scoreLateExercise(answers) },
    { cause: 'no_routine', score: scoreNoRoutine(answers) },
  ];

  scores.sort((a, b) => b.score - a.score);

  const primary = scores[0];
  const secondary = scores
    .filter((s, i) => i > 0 && s.score >= 3)
    .map(s => s.cause);

  return buildVerdict(primary.cause, secondary, answers);
}

function scoreScreenAddiction(a: DiagnosticAnswers): number {
  let score = 0;
  if (a.screenTime === '30-60') score += 3;
  if (a.screenTime === '60+') score += 5;
  if (a.screenTime === '15-30') score += 1;
  if (a.beforeBedActivity === 'social') score += 3;
  if (a.beforeBedActivity === 'video') score += 2;
  if (a.morningFeeling === 'exhausted' || a.morningFeeling === 'zombie') score += 1;
  return score;
}

function scoreLateCaffeine(a: DiagnosticAnswers): number {
  if (a.caffeineCount === '0') return 0;
  let score = 0;
  if (a.lastCaffeineTime === 'after-17') score += 5;
  if (a.lastCaffeineTime === '14-17') score += 3;
  if (a.lastCaffeineTime === '12-14') score += 1;
  if (a.caffeineCount === '3-4') score += 1;
  if (a.caffeineCount === '5+') score += 2;
  if (a.nightWakeups === 'often' || a.nightWakeups === 'every-night') score += 1;
  return score;
}

function scoreStressRumination(a: DiagnosticAnswers): number {
  let score = 0;
  if (a.eveningMind === 'very-agitated') score += 4;
  if (a.eveningMind === 'anxious') score += 5;
  if (a.eveningMind === 'slightly-agitated') score += 1;
  if (a.nightWakeups === 'often') score += 2;
  if (a.nightWakeups === 'every-night') score += 3;
  if (a.morningFeeling === 'exhausted' || a.morningFeeling === 'zombie') score += 1;
  return score;
}

function scoreIrregularSchedule(a: DiagnosticAnswers): number {
  let score = 0;
  if (a.bedtime === 'after-00') score += 3;
  if (
    a.bedtime === '23-00' &&
    (a.wakeTime === 'before-6' || a.wakeTime === 'after-8')
  )
    score += 2;
  if (a.morningFeeling === 'exhausted' || a.morningFeeling === 'zombie')
    score += 1;
  const sleepHours = estimateSleepHours(a.bedtime, a.wakeTime);
  if (sleepHours < 6) score += 2;
  if (sleepHours < 5) score += 1;
  return score;
}

function scoreLateExercise(a: DiagnosticAnswers): number {
  if (a.exerciseFrequency === 'never') return 0;
  let score = 0;
  if (a.exerciseTime === 'evening') score += 5;
  if (a.exerciseFrequency === '3-4' || a.exerciseFrequency === '5+')
    score += 1;
  return score;
}

function scoreNoRoutine(a: DiagnosticAnswers): number {
  let score = 0;
  if (a.beforeBedActivity === 'nothing') score += 3;
  if (a.eveningMind === 'slightly-agitated') score += 1;
  if (a.morningFeeling === 'slightly-tired') score += 1;
  if (a.screenTime === '0-15' && a.eveningMind !== 'calm') score += 2;
  return score;
}

function estimateSleepHours(bedtime: string, wakeTime: string): number {
  const bedHour: Record<string, number> = {
    'before-22': 21.5,
    '22-23': 22.5,
    '23-00': 23.5,
    'after-00': 1,
  };
  const wakeHour: Record<string, number> = {
    'before-6': 5.5,
    '6-7': 6.5,
    '7-8': 7.5,
    'after-8': 8.5,
  };
  let bed = bedHour[bedtime] ?? 23;
  const wake = wakeHour[wakeTime] ?? 7;
  if (bed > wake) bed -= 24;
  return wake - bed;
}

function buildVerdict(
  primaryCause: CauseType,
  secondaryCauses: CauseType[],
  answers: DiagnosticAnswers
): Verdict {
  const verdicts: Record<
    CauseType,
    Omit<Verdict, 'primaryCause' | 'secondaryCauses'>
  > = {
    screen_addiction: {
      title: 'Ton telephone sabote tes nuits',
      description: `Tu passes ${screenTimeLabel(answers.screenTime)} sur ton telephone avant de dormir, et tu ${activityLabel(answers.beforeBedActivity)}. La lumiere bleue de ton ecran bloque ta production de melatonine et le contenu stimulant maintient ton cerveau en mode alerte. Resultat : tu mets plus de temps a t'endormir et ton sommeil est moins profond.`,
      stat: screenTimeLabel(answers.screenTime),
      statLabel: 'de scroll avant de dormir',
    },
    late_caffeine: {
      title: 'La cafeine te trahit en silence',
      description: `Ton dernier cafe ${caffeineTimeLabel(answers.lastCaffeineTime)}, c'est trop tard. La cafeine a une demi-vie de 5 a 6 heures — quand tu te couches, il en reste encore une bonne partie dans ton organisme. Ton corps veut dormir, mais la cafeine lui dit "non".`,
      stat: caffeineTimeLabel(answers.lastCaffeineTime),
      statLabel: 'dernier cafe',
    },
    stress_rumination: {
      title: 'Ton cerveau refuse de se deconnecter',
      description: `Le soir, ton esprit est ${mindLabel(answers.eveningMind)}. Les ruminations et le stress activent ton systeme nerveux sympathique — le mode "combat ou fuite". C'est l'exact oppose de ce qu'il faut pour s'endormir. Ton corps est fatigue, mais ta tete tourne encore.`,
      stat: mindStatLabel(answers.eveningMind),
      statLabel: "niveau d'agitation le soir",
    },
    irregular_schedule: {
      title: 'Ton horloge interne est perdue',
      description: `En te couchant ${bedtimeLabel(answers.bedtime)} et en te reveillant ${wakeTimeLabel(answers.wakeTime)}, tu deregles ton rythme circadien. Ton corps ne sait plus quand produire la melatonine. C'est comme changer de fuseau horaire tous les jours.`,
      stat: `~${estimateSleepHours(answers.bedtime, answers.wakeTime)}h`,
      statLabel: 'de sommeil estime',
    },
    late_exercise: {
      title: 'Ton sport du soir te reveille',
      description: `Faire du sport le soir apres 19h booste ton metabolisme et ta temperature corporelle au moment exact ou ils devraient baisser. Ton corps met 2 a 3 heures a redescendre apres un effort intense — et pendant ce temps, impossible de t'endormir correctement.`,
      stat: 'Apres 19h',
      statLabel: 'sport trop tardif',
    },
    no_routine: {
      title: "Tu n'as aucun signal de fin de journee",
      description: `Tu n'as pas de routine du soir. Ton cerveau n'a aucun signal pour comprendre qu'il est temps de ralentir. Sans rituel de transition entre ta journee et ton sommeil, tu passes du mode "actif" au mode "dodo" sans transition — et ca ne marche pas.`,
      stat: '0 min',
      statLabel: 'de routine du soir',
    },
  };

  const v = verdicts[primaryCause];
  return { ...v, primaryCause, secondaryCauses };
}

function screenTimeLabel(value: string): string {
  const map: Record<string, string> = {
    '0-15': 'moins de 15 minutes',
    '15-30': '15 a 30 minutes',
    '30-60': '30 minutes a 1 heure',
    '60+': "plus d'1 heure",
  };
  return map[value] ?? value;
}

function activityLabel(value: string): string {
  const map: Record<string, string> = {
    social: 'scrolles les reseaux sociaux',
    video: 'regardes des series ou videos',
    reading: 'lis',
    nothing: 'ne fais rien de particulier',
  };
  return map[value] ?? value;
}

function caffeineTimeLabel(value: string): string {
  const map: Record<string, string> = {
    'before-12': 'avant midi',
    '12-14': 'entre 12h et 14h',
    '14-17': 'entre 14h et 17h',
    'after-17': 'apres 17h',
  };
  return map[value] ?? value;
}

function mindLabel(value: string): string {
  const map: Record<string, string> = {
    calm: 'calme',
    'slightly-agitated': 'un peu agite',
    'very-agitated': 'tres agite, plein de pensees',
    anxious: 'anxieux',
  };
  return map[value] ?? value;
}

function mindStatLabel(value: string): string {
  const map: Record<string, string> = {
    calm: 'Faible',
    'slightly-agitated': 'Modere',
    'very-agitated': 'Eleve',
    anxious: 'Tres eleve',
  };
  return map[value] ?? value;
}

function bedtimeLabel(value: string): string {
  const map: Record<string, string> = {
    'before-22': 'avant 22h',
    '22-23': 'entre 22h et 23h',
    '23-00': 'entre 23h et minuit',
    'after-00': 'apres minuit',
  };
  return map[value] ?? value;
}

function wakeTimeLabel(value: string): string {
  const map: Record<string, string> = {
    'before-6': 'avant 6h',
    '6-7': 'entre 6h et 7h',
    '7-8': 'entre 7h et 8h',
    'after-8': 'apres 8h',
  };
  return map[value] ?? value;
}
