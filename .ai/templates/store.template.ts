// Template: Zustand store for feature UI state.
// Save in: src/features/<feature>/store.ts
// Remember: do NOT store server state here (that goes in TanStack Query).

import { create } from 'zustand';

interface {{Name}}UiState {
  // TODO: state shape
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const use{{Name}}UiStore = create<{{Name}}UiState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
