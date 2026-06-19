import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserAttempt } from '@/features/quiz/schemas';
import { userAttemptSchema } from '@/features/quiz/schemas';

const HISTORY_CAP = 10;

interface QuizHistoryState {
  attempts: UserAttempt[];
  addAttempt: (attempt: Omit<UserAttempt, 'id'>) => void;
  clearHistory: () => void;
  getAttemptsByCategory: (categoryId: string) => UserAttempt[];
}

export const useQuizHistoryStore = create<QuizHistoryState>()(
  persist(
    (set, get) => ({
      attempts: [],

      addAttempt: (input) => {
        const attempt = userAttemptSchema.parse({ ...input, id: crypto.randomUUID() });
        set((state) => {
          const categoryAttempts = state.attempts.filter(
            (a) => a.categoryId === attempt.categoryId,
          );
          const otherAttempts = state.attempts.filter((a) => a.categoryId !== attempt.categoryId);
          const capped = [...categoryAttempts, attempt].slice(-HISTORY_CAP);
          return { attempts: [...otherAttempts, ...capped] };
        });
      },

      clearHistory: () => set({ attempts: [] }),

      getAttemptsByCategory: (categoryId) =>
        get().attempts.filter((a) => a.categoryId === categoryId),
    }),
    {
      name: 'quiz-history',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.attempts = z.array(userAttemptSchema).catch([]).parse(state.attempts);
        }
      },
    },
  ),
);
