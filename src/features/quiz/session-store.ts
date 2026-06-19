import { create } from 'zustand';

interface QuizSessionState {
  currentCategoryId: string | null;
  currentQuestionIndex: number;
  answers: number[];
  isSessionActive: boolean;
  isAnswered: boolean;
}

interface QuizSessionActions {
  startSession: (categoryId: string) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  resetSession: () => void;
}

const initialState: QuizSessionState = {
  currentCategoryId: null,
  currentQuestionIndex: 0,
  answers: [],
  isSessionActive: false,
  isAnswered: false,
};

export const useQuizSessionStore = create<QuizSessionState & QuizSessionActions>((set) => ({
  ...initialState,

  startSession: (categoryId) =>
    set({ ...initialState, currentCategoryId: categoryId, isSessionActive: true }),

  answerQuestion: (answerIndex) =>
    set((state) => ({ answers: [...state.answers, answerIndex], isAnswered: true })),

  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1, isAnswered: false })),

  resetSession: () => set(initialState),
}));
