export type CauseType =
  | 'screen_addiction'
  | 'late_caffeine'
  | 'stress_rumination'
  | 'irregular_schedule'
  | 'late_exercise'
  | 'no_routine';

export interface DiagnosticAnswers {
  bedtime: string;
  wakeTime: string;
  caffeineCount: string;
  lastCaffeineTime: string;
  screenTime: string;
  beforeBedActivity: string;
  exerciseFrequency: string;
  exerciseTime: string;
  eveningMind: string;
  nightWakeups: string;
  morningFeeling: string;
  roomLight: string;
  roomTemp: string;
  eveningMeal: string;
}

export interface Verdict {
  primaryCause: CauseType;
  secondaryCauses: CauseType[];
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

export interface WeekPlan {
  number: number;
  title: string;
  subtitle: string;
  goals: string[];
  tip: string;
}

export interface Plan {
  title: string;
  description: string;
  weeks: WeekPlan[];
  startDate: string;
  meditationType: string;
}

export interface DailyCheckIn {
  date: string;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  followedRitual: boolean;
  sleepLatency?: 'fast' | 'normal' | 'long' | 'very-long';
  potentialCause?: string;
  habits?: Record<string, boolean>;
}

export interface Habit {
  id: string;
  label: string;
  emoji: string;
  cause: CauseType;
}

export type NightlightTheme = 'braise' | 'aurore' | 'ocean' | 'lavande' | 'foret';

export type BreathingExercise = 'breathing-478' | 'coherence' | 'box' | 'relaxation';

export interface RitualPreferences {
  theme: NightlightTheme;
  defaultSound: AmbientSound;
  defaultExercise: BreathingExercise;
  durationMinutes: number;
}

export interface PatternInsight {
  type: 'warning' | 'positive' | 'suggestion';
  title: string;
  description: string;
  emoji: string;
}

export interface UserData {
  onboardingComplete: boolean;
  answers: DiagnosticAnswers | null;
  verdict: Verdict | null;
  plan: Plan | null;
  ritualTime: string;
  checkIns: DailyCheckIn[];
  currentWeek: number;
  planStartDate: string | null;
  ritualPreferences: RitualPreferences | null;
  habitCompletions: Record<string, Record<string, boolean>>;
}

export interface Question {
  id: keyof DiagnosticAnswers;
  question: string;
  subtitle?: string;
  options: { value: string; label: string; emoji?: string }[];
}

export type AmbientSound = 'rain' | 'whitenoise' | 'ocean' | 'forest' | 'wind' | 'none';
