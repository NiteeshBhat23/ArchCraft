import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completed: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  quizScores: Record<string, number>;
  darkMode: boolean;
  markComplete: (topicId: string) => void;
  markIncomplete: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  setQuizScore: (topicId: string, score: number) => void;
  toggleDarkMode: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completed: {},
      bookmarks: {},
      quizScores: {},
      darkMode: false,
      markComplete: (topicId) =>
        set((s) => ({ completed: { ...s.completed, [topicId]: true } })),
      markIncomplete: (topicId) =>
        set((s) => {
          const c = { ...s.completed };
          delete c[topicId];
          return { completed: c };
        }),
      toggleBookmark: (topicId) =>
        set((s) => ({
          bookmarks: { ...s.bookmarks, [topicId]: !s.bookmarks[topicId] },
        })),
      setQuizScore: (topicId, score) =>
        set((s) => ({ quizScores: { ...s.quizScores, [topicId]: score } })),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: next };
        }),
    }),
    { name: 'archcraft-progress' }
  )
);
