import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CreatorProfileDraft, DraftQuestion, QuizDraft, QuizSettings } from '../types/quiz'
import { generateId } from '../lib/security'
import { LOCAL_STORAGE_KEYS } from '../lib/constants'

const defaultProfile: CreatorProfileDraft = {
  creatorName: '',
  nickname: '',
  avatar: '😄',
  theme: 'purple-dream',
  language: 'en',
  friendMessage: '',
}

const defaultSettings: QuizSettings = {
  attemptPolicy: 'unlimited',
  allowLeaderboard: true,
  allowAnswerReview: true,
  expiresAt: null,
  maxResponses: null,
}

interface QuizBuilderState {
  profile: CreatorProfileDraft
  quizTitle: string
  questions: DraftQuestion[]
  settings: QuizSettings
  updatedAt: number
  setProfile: (profile: Partial<CreatorProfileDraft>) => void
  setQuizTitle: (title: string) => void
  addQuestion: (question: Omit<DraftQuestion, 'order'>) => void
  updateQuestion: (id: string, patch: Partial<DraftQuestion>) => void
  removeQuestion: (id: string) => void
  duplicateQuestion: (id: string) => void
  reorderQuestions: (fromIndex: number, toIndex: number) => void
  setSettings: (settings: Partial<QuizSettings>) => void
  reset: () => void
  hydrateFromDraft: (draft: QuizDraft) => void
  getDraft: () => QuizDraft
}

export const useQuizBuilderStore = create<QuizBuilderState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      quizTitle: '',
      questions: [],
      settings: defaultSettings,
      updatedAt: Date.now(),

      setProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch }, updatedAt: Date.now() })),

      setQuizTitle: (title) => set({ quizTitle: title, updatedAt: Date.now() }),

      addQuestion: (question) =>
        set((state) => ({
          questions: [...state.questions, { ...question, order: state.questions.length, id: question.id || generateId('q') }],
          updatedAt: Date.now(),
        })),

      updateQuestion: (id, patch) =>
        set((state) => ({
          questions: state.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
          updatedAt: Date.now(),
        })),

      removeQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i })),
          updatedAt: Date.now(),
        })),

      duplicateQuestion: (id) =>
        set((state) => {
          const source = state.questions.find((q) => q.id === id)
          if (!source) return state
          const copy: DraftQuestion = {
            ...source,
            id: generateId('q'),
            options: source.options.map((o) => ({ ...o, id: generateId('opt') })),
            order: state.questions.length,
          }
          const correctText = source.options.find((o) => o.id === source.correctOptionId)?.text
          const matchingNewOption = copy.options.find((o) => o.text === correctText)
          copy.correctOptionId = matchingNewOption?.id ?? copy.options[0].id
          return { questions: [...state.questions, copy], updatedAt: Date.now() }
        }),

      reorderQuestions: (fromIndex, toIndex) =>
        set((state) => {
          const next = [...state.questions]
          const [moved] = next.splice(fromIndex, 1)
          next.splice(toIndex, 0, moved)
          return { questions: next.map((q, i) => ({ ...q, order: i })), updatedAt: Date.now() }
        }),

      setSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch }, updatedAt: Date.now() })),

      reset: () =>
        set({ profile: defaultProfile, quizTitle: '', questions: [], settings: defaultSettings, updatedAt: Date.now() }),

      hydrateFromDraft: (draft) =>
        set({
          profile: draft.profile,
          quizTitle: draft.quizTitle,
          questions: draft.questions,
          settings: draft.settings,
          updatedAt: draft.updatedAt,
        }),

      getDraft: () => {
        const state = get()
        return {
          profile: state.profile,
          quizTitle: state.quizTitle,
          questions: state.questions,
          settings: state.settings,
          updatedAt: state.updatedAt,
        }
      },
    }),
    { name: LOCAL_STORAGE_KEYS.quizDraft },
  ),
)
