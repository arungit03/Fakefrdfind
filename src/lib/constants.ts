export const APP_NAME = 'VibeCheck'
export const APP_TAGLINE = 'Who really knows you?'

export const MIN_QUESTIONS = 5
export const MAX_QUESTIONS = 15
export const RECOMMENDED_QUESTIONS = 10

export const MAX_CREATOR_NAME_LENGTH = 30
export const MAX_NICKNAME_LENGTH = 15
export const MAX_MESSAGE_LENGTH = 120
export const MAX_QUESTION_LENGTH = 120
export const MAX_OPTION_LENGTH = 50
export const MAX_FRIEND_NAME_LENGTH = 30
export const MAX_QUIZ_TITLE_LENGTH = 60

export const SECONDS_PER_QUESTION_ESTIMATE = 15

export const LOCAL_STORAGE_KEYS = {
  quizDraft: 'vibecheck.quizDraft',
  theme: 'vibecheck.theme',
  language: 'vibecheck.language',
  browserSubmissionPrefix: 'vibecheck.submission.',
  friendProgressPrefix: 'vibecheck.progress.',
  soundEnabled: 'vibecheck.soundEnabled',
}

export const SCORE_MESSAGES = [
  { min: 0, max: 30, message: 'You have some friendship homework to do 😅' },
  { min: 31, max: 50, message: 'Not bad, but there are still a few surprises.' },
  { min: 51, max: 70, message: 'You know your friend pretty well.' },
  { min: 71, max: 89, message: 'You are definitely a close friend.' },
  { min: 90, max: 100, message: 'Certified best-friend energy! 🏆' },
]

export function getScoreMessage(percentage: number): string {
  const found = SCORE_MESSAGES.find((s) => percentage >= s.min && percentage <= s.max)
  return found?.message ?? SCORE_MESSAGES[0].message
}

export const REPORT_REASONS = [
  'Bullying',
  'Harassment',
  'Inappropriate content',
  'Personal information',
  'Spam',
  'Other',
] as const

export const QUESTION_CATEGORIES = [
  'favorites',
  'personality',
  'food',
  'travel',
  'movies',
  'music',
  'gaming',
  'college',
  'childhood',
  'habits',
  'dreams',
  'funny',
  'friendship',
  'random',
] as const

export const DEMO_STATS = {
  quizzesCreated: 18420,
  friendsTested: 96500,
  answersSubmitted: 812300,
}
