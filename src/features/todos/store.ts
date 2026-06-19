import { create } from 'zustand';

interface TodosUiState {
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: TodosUiState['filter']) => void;
}

export const useTodosUiStore = create<TodosUiState>((set) => ({
  filter: 'all',
  setFilter: (filter) => set({ filter }),
}));
