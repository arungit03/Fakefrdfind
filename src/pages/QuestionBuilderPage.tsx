import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Copy,
  Shuffle,
  GripVertical,
  ArrowRight,
  ArrowLeft,
  Wand2,
  BookOpen,
  Eye,
} from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { AppInput } from '../components/common/AppInput'
import { AppModal } from '../components/common/AppModal'
import { StepIndicator } from '../components/common/StepIndicator'
import { EmptyState } from '../components/common/EmptyState'
import { CategoryBadge, DifficultyBadge } from '../components/quiz/Badges'
import { AnswerOption } from '../components/quiz/AnswerOption'
import { useQuizDraft } from '../hooks/useQuizDraft'
import { QUESTION_BANK, getRandomQuestions } from '../data/questionBank'
import { QUESTION_CATEGORIES, MAX_QUESTIONS, MIN_QUESTIONS, MAX_OPTION_LENGTH, MAX_QUESTION_LENGTH } from '../lib/constants'
import { generateId, sanitizeText } from '../lib/security'
import type { DraftQuestion, QuestionCategory, QuestionDifficulty } from '../types/quiz'
import { cn } from '../lib/utils'

const BUILDER_STEPS = ['Profile', 'Questions', 'Review']

function makeDraftFromBank(bankId: string, order: number): DraftQuestion {
  const bank = QUESTION_BANK.find((q) => q.id === bankId)!
  const options = bank.options.map((text) => ({ id: generateId('opt'), text }))
  return {
    id: generateId('q'),
    question: bank.question,
    options,
    correctOptionId: options[0].id,
    category: bank.category,
    difficulty: bank.difficulty,
    order,
  }
}

function makeBlankQuestion(order: number): DraftQuestion {
  const options = [generateId('opt'), generateId('opt'), generateId('opt'), generateId('opt')].map((id) => ({ id, text: '' }))
  return {
    id: generateId('q'),
    question: '',
    options,
    correctOptionId: options[0].id,
    category: 'random',
    difficulty: 'medium',
    order,
  }
}

export default function QuestionBuilderPage() {
  const navigate = useNavigate()
  const { questions, addQuestion, updateQuestion, removeQuestion, duplicateQuestion, reorderQuestions } = useQuizDraft()
  const [isBankOpen, setIsBankOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [bankCategory, setBankCategory] = useState<QuestionCategory | 'all'>('all')

  const usedBankIds = new Set(questions.map((q) => q.question))

  const handleAddFromBank = (bankId: string) => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`You can add up to ${MAX_QUESTIONS} questions`)
      return
    }
    addQuestion(makeDraftFromBank(bankId, questions.length))
    toast.success('Question added')
  }

  const handleAddBlank = () => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`You can add up to ${MAX_QUESTIONS} questions`)
      return
    }
    addQuestion(makeBlankQuestion(questions.length))
  }

  const handleAddRandomBatch = () => {
    const remaining = MAX_QUESTIONS - questions.length
    if (remaining <= 0) {
      toast.error('You already have the maximum number of questions')
      return
    }
    const count = Math.min(5, remaining)
    const excludeIds = QUESTION_BANK.filter((q) => usedBankIds.has(q.question)).map((q) => q.id)
    const picks = getRandomQuestions(count, excludeIds)
    picks.forEach((bank, i) => addQuestion(makeDraftFromBank(bank.id, questions.length + i)))
    toast.success(`${picks.length} questions added`)
  }

  const handleRandomizeOptions = (question: DraftQuestion) => {
    const shuffled = [...question.options].sort(() => Math.random() - 0.5)
    updateQuestion(question.id, { options: shuffled })
  }

  const handleRemove = (id: string) => {
    if (questions.length <= MIN_QUESTIONS) {
      toast.error(`You need at least ${MIN_QUESTIONS} questions`)
      return
    }
    removeQuestion(id)
  }

  const validateQuestions = (): boolean => {
    if (questions.length < MIN_QUESTIONS) {
      toast.error(`Add at least ${MIN_QUESTIONS} questions`)
      return false
    }
    for (const q of questions) {
      if (!q.question.trim()) {
        toast.error('Every question needs text')
        return false
      }
      const texts = q.options.map((o) => o.text.trim().toLowerCase())
      if (texts.some((t) => !t)) {
        toast.error('Every option must be filled in')
        return false
      }
      if (new Set(texts).size !== texts.length) {
        toast.error('Answer options must be unique within a question')
        return false
      }
      if (!q.options.some((o) => o.id === q.correctOptionId)) {
        toast.error('Select a correct answer for every question')
        return false
      }
    }
    return true
  }

  const handleContinue = () => {
    if (!validateQuestions()) return
    navigate('/create/review')
  }

  const filteredBank = bankCategory === 'all' ? QUESTION_BANK : QUESTION_BANK.filter((q) => q.category === bankCategory)

  return (
    <div className="relative overflow-hidden py-10 sm:py-14">
      <AnimatedBackground variant="minimal" />
      <PageContainer maxWidth="max-w-3xl">
        <div className="mb-8">
          <StepIndicator steps={BUILDER_STEPS} currentStep={1} />
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold font-display">Build your questions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {questions.length} of {MAX_QUESTIONS} questions · minimum {MIN_QUESTIONS}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton size="sm" variant="secondary" icon={<BookOpen size={16} />} onClick={() => setIsBankOpen(true)}>
              Question Bank
            </AppButton>
            <AppButton size="sm" variant="secondary" icon={<Shuffle size={16} />} onClick={handleAddRandomBatch}>
              Add 5 Random
            </AppButton>
            <AppButton size="sm" icon={<Plus size={16} />} onClick={handleAddBlank}>
              Custom Question
            </AppButton>
          </div>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            title="No questions yet"
            description="Pull from our question bank or write your own to get started."
            actionLabel="Browse Question Bank"
            onAction={() => setIsBankOpen(true)}
          />
        ) : (
          <Reorder.Group axis="y" values={questions} onReorder={() => {}} className="space-y-4">
            <AnimatePresence initial={false}>
              {questions.map((question, index) => (
                <Reorder.Item
                  key={question.id}
                  value={question}
                  as="div"
                  drag={false}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  >
                    <AppCard padding="md">
                      <div className="mb-3 flex items-start gap-3">
                        <div className="mt-1 flex flex-col items-center gap-1">
                          <button
                            type="button"
                            className="cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing dark:text-slate-600"
                            disabled={index === 0}
                            onClick={() => index > 0 && reorderQuestions(index, index - 1)}
                            aria-label="Move question up"
                          >
                            <GripVertical size={18} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-vibe-violet-500">Q{index + 1}</span>
                            <select
                              value={question.category}
                              onChange={(e) => updateQuestion(question.id, { category: e.target.value as QuestionCategory })}
                              className="rounded-full border-0 bg-vibe-violet-100 px-2.5 py-1 text-xs font-bold text-vibe-violet-600 dark:bg-white/10 dark:text-vibe-violet-300"
                              aria-label="Question category"
                            >
                              {QUESTION_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <select
                              value={question.difficulty}
                              onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as QuestionDifficulty })}
                              className="rounded-full border-0 bg-vibe-yellow-400/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-vibe-yellow-300"
                              aria-label="Question difficulty"
                            >
                              <option value="easy">easy</option>
                              <option value="medium">medium</option>
                              <option value="hard">hard</option>
                            </select>
                            <div className="ml-auto flex gap-1">
                              <button
                                type="button"
                                onClick={() => setPreviewIndex(index)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-vibe-violet-600 dark:hover:bg-white/10"
                                aria-label="Preview question"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRandomizeOptions(question)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-vibe-violet-600 dark:hover:bg-white/10"
                                aria-label="Randomize option order"
                              >
                                <Shuffle size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => duplicateQuestion(question.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-vibe-violet-600 dark:hover:bg-white/10"
                                aria-label="Duplicate question"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemove(question.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-vibe-coral-50 hover:text-vibe-coral-500 dark:hover:bg-white/10"
                                aria-label="Delete question"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <AppInput
                            value={question.question}
                            maxLength={MAX_QUESTION_LENGTH}
                            placeholder="Write your question…"
                            onChange={(e) => updateQuestion(question.id, { question: sanitizeText(e.target.value) })}
                            aria-label={`Question ${index + 1} text`}
                          />

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {question.options.map((opt, optIndex) => (
                              <div key={opt.id} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuestion(question.id, { correctOptionId: opt.id })}
                                  aria-label={`Mark option ${optIndex + 1} as correct`}
                                  aria-pressed={question.correctOptionId === opt.id}
                                  className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold transition-colors',
                                    question.correctOptionId === opt.id
                                      ? 'border-vibe-mint-500 bg-vibe-mint-500 text-white'
                                      : 'border-slate-200 text-slate-400 dark:border-white/10',
                                  )}
                                  title="Set as correct answer"
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </button>
                                <input
                                  value={opt.text}
                                  maxLength={MAX_OPTION_LENGTH}
                                  onChange={(e) => {
                                    const newOptions = question.options.map((o) =>
                                      o.id === opt.id ? { ...o, text: sanitizeText(e.target.value) } : o,
                                    )
                                    updateQuestion(question.id, { options: newOptions })
                                  }}
                                  placeholder={`Option ${optIndex + 1}`}
                                  aria-label={`Option ${optIndex + 1} text`}
                                  className="min-h-[44px] w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-vibe-violet-500 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AppCard>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        <div className="mt-8 flex items-center justify-between">
          <AppButton variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate('/create/profile')}>
            Back
          </AppButton>
          <AppButton icon={<ArrowRight size={18} />} onClick={handleContinue}>
            Continue to Review
          </AppButton>
        </div>
      </PageContainer>

      {/* Question bank modal */}
      <AppModal isOpen={isBankOpen} onClose={() => setIsBankOpen(false)} title="Question Bank" maxWidth="max-w-2xl">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setBankCategory('all')}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold',
              bankCategory === 'all' ? 'bg-vibe-violet-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10',
            )}
          >
            All
          </button>
          {QUESTION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setBankCategory(cat)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold capitalize',
                bankCategory === cat ? 'bg-vibe-violet-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {filteredBank.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 dark:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{bank.question}</p>
                <div className="mt-1 flex gap-1.5">
                  <CategoryBadge category={bank.category} />
                  <DifficultyBadge difficulty={bank.difficulty} />
                </div>
              </div>
              <AppButton
                size="sm"
                variant="secondary"
                icon={<Plus size={14} />}
                onClick={() => handleAddFromBank(bank.id)}
                disabled={usedBankIds.has(bank.question)}
              >
                {usedBankIds.has(bank.question) ? 'Added' : 'Add'}
              </AppButton>
            </div>
          ))}
        </div>
      </AppModal>

      {/* Friend-experience preview modal */}
      <AppModal
        isOpen={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        title="Friend Preview"
        maxWidth="max-w-md"
      >
        {previewIndex !== null && questions[previewIndex] && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Wand2 size={16} className="text-vibe-violet-500" />
              <p className="text-xs font-semibold text-slate-400">This is what your friend will see</p>
            </div>
            <p className="mb-4 text-lg font-bold font-display">{questions[previewIndex].question || 'Untitled question'}</p>
            <div className="space-y-2.5">
              {questions[previewIndex].options.map((opt, i) => (
                <AnswerOption key={opt.id} letter={String.fromCharCode(65 + i)} text={opt.text || `Option ${i + 1}`} disabled />
              ))}
            </div>
          </div>
        )}
      </AppModal>
    </div>
  )
}
