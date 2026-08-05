import { useQuizBuilderStore } from '../store/quizBuilderStore'
import { estimateCompletionMinutes } from '../lib/formatters'

export function useQuizDraft() {
  const store = useQuizBuilderStore()

  const isProfileComplete = Boolean(store.profile.creatorName.trim())
  const isQuestionsComplete = store.questions.length >= 5 && store.questions.length <= 15
  const estimatedTime = estimateCompletionMinutes(store.questions.length)

  return {
    ...store,
    isProfileComplete,
    isQuestionsComplete,
    estimatedTime,
  }
}
