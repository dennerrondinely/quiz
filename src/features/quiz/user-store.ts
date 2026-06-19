import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storedUsernameSchema = z.string().trim().min(2).max(30).nullable().catch(null);

interface UserState {
  username: string | null;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (name) => set({ username: name }),
    }),
    {
      name: 'quiz-username',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.username = storedUsernameSchema.parse(state.username);
        }
      },
    },
  ),
);
