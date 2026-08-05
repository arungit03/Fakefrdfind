import { HttpsError } from 'firebase-functions/v2/https'

export const MIN_QUESTIONS = 5
export const MAX_QUESTIONS = 15
export const MAX_QUESTION_LENGTH = 120
export const MAX_OPTION_LENGTH = 50
export const MAX_NAME_LENGTH = 30
export const MAX_TITLE_LENGTH = 60
export const MAX_MESSAGE_LENGTH = 120

export function assertString(value: unknown, field: string, maxLen: number): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpsError('invalid-argument', `${field} is required.`)
  }
  const trimmed = value.trim()
  if (trimmed.length > maxLen) {
    throw new HttpsError('invalid-argument', `${field} must be ${maxLen} characters or fewer.`)
  }
  if (/[<>]/.test(trimmed)) {
    throw new HttpsError('invalid-argument', `${field} contains disallowed characters.`)
  }
  return trimmed
}

export function assertOptionalString(value: unknown, field: string, maxLen: number): string {
  if (value === undefined || value === null || value === '') return ''
  return assertString(value, field, maxLen)
}

interface RawOption {
  id?: unknown
  text?: unknown
}

interface RawQuestion {
  id?: unknown
  question?: unknown
  options?: unknown
  correctOptionId?: unknown
  category?: unknown
  difficulty?: unknown
}

export interface ValidatedOption {
  id: string
  text: string
}

export interface ValidatedQuestion {
  id: string
  question: string
  options: ValidatedOption[]
  correctOptionId: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export function assertQuestions(raw: unknown): ValidatedQuestion[] {
  if (!Array.isArray(raw)) {
    throw new HttpsError('invalid-argument', 'Questions must be an array.')
  }
  if (raw.length < MIN_QUESTIONS || raw.length > MAX_QUESTIONS) {
    throw new HttpsError('invalid-argument', `Quiz must have between ${MIN_QUESTIONS} and ${MAX_QUESTIONS} questions.`)
  }

  return raw.map((item, index) => {
    const q = item as RawQuestion
    const id = assertString(q.id, `Question ${index + 1} id`, 64)
    const question = assertString(q.question, `Question ${index + 1} text`, MAX_QUESTION_LENGTH)

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new HttpsError('invalid-argument', `Question ${index + 1} must have exactly 4 options.`)
    }
    const options: ValidatedOption[] = (q.options as RawOption[]).map((opt, optIndex) => ({
      id: assertString(opt.id, `Question ${index + 1} option ${optIndex + 1} id`, 64),
      text: assertString(opt.text, `Question ${index + 1} option ${optIndex + 1} text`, MAX_OPTION_LENGTH),
    }))

    const texts = options.map((o) => o.text.toLowerCase())
    if (new Set(texts).size !== texts.length) {
      throw new HttpsError('invalid-argument', `Question ${index + 1} has duplicate answer options.`)
    }

    const correctOptionId = assertString(q.correctOptionId, `Question ${index + 1} correct answer`, 64)
    if (!options.some((o) => o.id === correctOptionId)) {
      throw new HttpsError('invalid-argument', `Question ${index + 1} correct answer must match an option.`)
    }

    const difficulty = q.difficulty
    if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
      throw new HttpsError('invalid-argument', `Question ${index + 1} has an invalid difficulty.`)
    }

    const category = assertString(q.category, `Question ${index + 1} category`, 30)

    return { id, question, options, correctOptionId, category, difficulty }
  })
}
