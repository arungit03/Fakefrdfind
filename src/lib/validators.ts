import { z } from 'zod'
import {
  MAX_CREATOR_NAME_LENGTH,
  MAX_FRIEND_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NICKNAME_LENGTH,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_LENGTH,
  MAX_QUIZ_TITLE_LENGTH,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
} from './constants'

const noHtml = (value: string) => !/[<>]/.test(value)

export const creatorProfileSchema = z.object({
  creatorName: z
    .string()
    .trim()
    .min(1, 'Your name is required')
    .max(MAX_CREATOR_NAME_LENGTH, `Max ${MAX_CREATOR_NAME_LENGTH} characters`)
    .refine(noHtml, 'No special characters allowed'),
  nickname: z
    .string()
    .trim()
    .max(MAX_NICKNAME_LENGTH, `Max ${MAX_NICKNAME_LENGTH} characters`)
    .refine(noHtml, 'No special characters allowed')
    .optional()
    .or(z.literal('')),
  avatar: z.string().min(1, 'Pick an avatar'),
  theme: z.string().min(1),
  language: z.enum(['en', 'ta']),
  friendMessage: z
    .string()
    .trim()
    .max(MAX_MESSAGE_LENGTH, `Max ${MAX_MESSAGE_LENGTH} characters`)
    .refine(noHtml, 'No special characters allowed')
    .optional()
    .or(z.literal('')),
})

export type CreatorProfileFormValues = z.infer<typeof creatorProfileSchema>

export const answerOptionSchema = z
  .string()
  .trim()
  .min(1, 'Option cannot be empty')
  .max(MAX_OPTION_LENGTH, `Max ${MAX_OPTION_LENGTH} characters`)
  .refine(noHtml, 'No special characters allowed')

export const draftQuestionSchema = z
  .object({
    id: z.string(),
    question: z
      .string()
      .trim()
      .min(1, 'Question cannot be empty')
      .max(MAX_QUESTION_LENGTH, `Max ${MAX_QUESTION_LENGTH} characters`)
      .refine(noHtml, 'No special characters allowed'),
    options: z.array(z.object({ id: z.string(), text: answerOptionSchema })).length(4, 'Exactly 4 options required'),
    correctOptionId: z.string().min(1, 'Select the correct answer'),
    category: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    order: z.number(),
  })
  .refine(
    (q) => {
      const texts = q.options.map((o) => o.text.trim().toLowerCase())
      return new Set(texts).size === texts.length
    },
    { message: 'Answer options must be unique', path: ['options'] },
  )
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    message: 'Correct answer must be one of the options',
    path: ['correctOptionId'],
  })

export const quizQuestionsSchema = z
  .array(draftQuestionSchema)
  .min(MIN_QUESTIONS, `Add at least ${MIN_QUESTIONS} questions`)
  .max(MAX_QUESTIONS, `No more than ${MAX_QUESTIONS} questions`)

export const quizTitleSchema = z
  .string()
  .trim()
  .min(1, 'Quiz title is required')
  .max(MAX_QUIZ_TITLE_LENGTH, `Max ${MAX_QUIZ_TITLE_LENGTH} characters`)
  .refine(noHtml, 'No special characters allowed')

export const friendNameSchema = z
  .string()
  .trim()
  .min(1, 'Your name is required')
  .max(MAX_FRIEND_NAME_LENGTH, `Max ${MAX_FRIEND_NAME_LENGTH} characters`)
  .refine((v) => v.trim().length > 0, 'Name cannot be just spaces')
  .refine(noHtml, 'No special characters allowed')

export const friendIntroSchema = z.object({
  friendName: friendNameSchema,
  friendAvatar: z.string().min(1),
})

export type FriendIntroFormValues = z.infer<typeof friendIntroSchema>

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60).refine(noHtml, 'No special characters allowed'),
  email: z.string().trim().email('Enter a valid email'),
  message: z.string().trim().min(1, 'Message is required').max(1000).refine(noHtml, 'No special characters allowed'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
