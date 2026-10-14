import { UserProgress } from '../types';

const STORAGE_KEY = 'vocab4_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  totalStars: 15, // Tặng sẵn 15 sao khích lệ bé ngày đầu vào học
  learnedWordIds: [],
  favoriteWordIds: [],
  unitScores: {},
  phonicsCompleted: [],
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
};

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const data: UserProgress = JSON.parse(raw);
    
    // Check daily streak
    const today = new Date().toISOString().split('T')[0];
    if (data.lastStudyDate !== today) {
      const lastDate = new Date(data.lastStudyDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        data.streakDays += 1;
      } else if (diffDays > 1) {
        data.streakDays = 1;
      }
      data.lastStudyDate = today;
      saveUserProgress(data);
    }

    return data;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage quota errors
  }
}

export function addStars(count: number): number {
  const current = getUserProgress();
  current.totalStars += count;
  saveUserProgress(current);
  return current.totalStars;
}

export function toggleFavoriteWord(wordId: string): boolean {
  const current = getUserProgress();
  const exists = current.favoriteWordIds.includes(wordId);
  if (exists) {
    current.favoriteWordIds = current.favoriteWordIds.filter((id) => id !== wordId);
  } else {
    current.favoriteWordIds.push(wordId);
  }
  saveUserProgress(current);
  return !exists;
}

export function markWordLearned(wordId: string): void {
  const current = getUserProgress();
  if (!current.learnedWordIds.includes(wordId)) {
    current.learnedWordIds.push(wordId);
    current.totalStars += 2; // Tặng 2 sao mỗi khi thuộc 1 từ mới
    saveUserProgress(current);
  }
}

export function markPhonicsDone(lessonId: string): void {
  const current = getUserProgress();
  if (!current.phonicsCompleted.includes(lessonId)) {
    current.phonicsCompleted.push(lessonId);
    current.totalStars += 10; // Tặng 10 sao cho mỗi chuyên đề ngữ âm
    saveUserProgress(current);
  }
}

export function updateUnitQuizScore(unit: number, scorePercent: number): void {
  const current = getUserProgress();
  const prev = current.unitScores[unit] || 0;
  if (scorePercent > prev) {
    current.unitScores[unit] = scorePercent;
    current.totalStars += Math.round(scorePercent / 10);
    saveUserProgress(current);
  }
}
