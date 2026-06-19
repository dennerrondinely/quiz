import { create } from 'zustand';

interface {{Name}}UiState {
  filter: string;
  setFilter: (filter: string) => void;
}

export const use{{Name}}UiStore = create<{{Name}}UiState>((set) => ({
  filter: '',
  setFilter: (filter) => set({ filter }),
}));
