import { useEffect, useState } from 'react'
import { fetchPublicQuiz } from '../firebase/firestore'
import { isFirebaseConfigured } from '../firebase/config'
import type { PublicQuiz } from '../types/quiz'

export type QuizLoadStatus = 'loading' | 'ready' | 'not-found' | 'disabled' | 'expired' | 'error'

export function useQuiz(quizId: string | undefined) {
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null)
  const [status, setStatus] = useState<QuizLoadStatus>('loading')

  useEffect(() => {
    if (!quizId) {
      setStatus('not-found')
      return
    }
    if (!isFirebaseConfigured) {
      setStatus('error')
      return
    }

    let cancelled = false
    setStatus('loading')

    fetchPublicQuiz(quizId)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setStatus('not-found')
          return
        }
        if (data.expiresAt && new Date(data.expiresAt).getTime() < Date.now()) {
          setStatus('expired')
          return
        }
        if (!data.isActive) {
          setStatus('disabled')
          return
        }
        setQuiz(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [quizId])

  return { quiz, status }
}
