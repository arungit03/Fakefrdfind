import type { ThemeId } from '../types/quiz'

export interface QuizTheme {
  id: ThemeId
  name: string
  gradient: string
  accent: string
  soft: string
  emoji: string
}

export const QUIZ_THEMES: QuizTheme[] = [
  {
    id: 'purple-dream',
    name: 'Purple Dream',
    gradient: 'from-violet-500 via-indigo-500 to-purple-600',
    accent: '#8b5cf6',
    soft: '#f5f3ff',
    emoji: '💜',
  },
  {
    id: 'ocean-glow',
    name: 'Ocean Glow',
    gradient: 'from-cyan-400 via-sky-500 to-indigo-500',
    accent: '#06b6d4',
    soft: '#ecfeff',
    emoji: '🌊',
  },
  {
    id: 'sunset-pop',
    name: 'Sunset Pop',
    gradient: 'from-orange-400 via-pink-500 to-rose-500',
    accent: '#fb923c',
    soft: '#fff7ed',
    emoji: '🌅',
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
    accent: '#10b981',
    soft: '#ecfdf5',
    emoji: '🌿',
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    gradient: 'from-fuchsia-500 via-violet-600 to-indigo-800',
    accent: '#a855f7',
    soft: '#1e1b3a',
    emoji: '🌌',
  },
  {
    id: 'candy-pink',
    name: 'Candy Pink',
    gradient: 'from-pink-400 via-fuchsia-400 to-rose-400',
    accent: '#ec4899',
    soft: '#fdf2f8',
    emoji: '🍬',
  },
]

export function getTheme(id: ThemeId): QuizTheme {
  return QUIZ_THEMES.find((t) => t.id === id) ?? QUIZ_THEMES[0]
}
