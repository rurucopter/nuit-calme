import { UserData, DailyCheckIn } from './types';

const STORAGE_KEY = 'nuit-calme-data';

const defaultData: UserData = {
  onboardingComplete: false,
  answers: null,
  verdict: null,
  plan: null,
  ritualTime: '22:30',
  checkIns: [],
  currentWeek: 1,
  planStartDate: null,
  ritualPreferences: null,
  habitCompletions: {},
};

export function getUserData(): UserData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveUserData(data: Partial<UserData>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getUserData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // storage full or unavailable
  }
}

export function addCheckIn(checkIn: DailyCheckIn): void {
  const data = getUserData();
  const existing = data.checkIns.findIndex(c => c.date === checkIn.date);
  if (existing >= 0) {
    data.checkIns[existing] = checkIn;
  } else {
    data.checkIns.push(checkIn);
  }
  saveUserData({ checkIns: data.checkIns });
}

export function getStreak(): number {
  const data = getUserData();
  if (data.checkIns.length === 0) return 0;

  const sorted = [...data.checkIns]
    .filter(c => c.followedRitual)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return 0;

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i].date);
    const prev = new Date(sorted[i + 1].date);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 1.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getCurrentWeek(): number {
  const data = getUserData();
  if (!data.planStartDate) return 1;
  const start = new Date(data.planStartDate);
  const now = new Date();
  const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.min(4, Math.max(1, Math.ceil(diffDays / 7)));
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
