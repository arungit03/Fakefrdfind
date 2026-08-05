import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { getFirebaseDb } from './config'
import type { PublicQuiz, QuizStats } from '../types/quiz'

/**
 * Only publicQuizzes and quizStats are directly client-readable per
 * firestore.rules. Everything under privateQuizzes (correct answers, owner
 * info, responses) and all writes go through Cloud Functions — see
 * src/firebase/functions.ts.
 */

export async function fetchPublicQuiz(quizId: string): Promise<PublicQuiz | null> {
  const ref = doc(getFirebaseDb(), 'publicQuizzes', quizId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as PublicQuiz
}

export function watchPublicQuiz(quizId: string, callback: (quiz: PublicQuiz | null) => void): Unsubscribe {
  const ref = doc(getFirebaseDb(), 'publicQuizzes', quizId)
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as PublicQuiz) : null)
  })
}

export async function fetchQuizStats(quizId: string): Promise<QuizStats | null> {
  const ref = doc(getFirebaseDb(), 'quizStats', quizId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as QuizStats
}

export function watchQuizStats(quizId: string, callback: (stats: QuizStats | null) => void): Unsubscribe {
  const ref = doc(getFirebaseDb(), 'quizStats', quizId)
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as QuizStats) : null)
  })
}
