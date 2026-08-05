import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Power, Trash2, RefreshCcw, Save, Eye, EyeOff, Users } from 'lucide-react'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { AppInput, AppTextarea } from '../components/common/AppInput'
import { AppButton } from '../components/common/AppButton'
import { AppModal } from '../components/common/AppModal'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { useCreatorAccess } from '../hooks/useCreatorAccess'
import { useDashboardData } from '../hooks/useDashboardData'
import { isFirebaseConfigured } from '../firebase/config'
import { callDeleteQuiz, callRegenerateQuizLink, callUpdateQuizSettings } from '../firebase/functions'
import { MAX_QUIZ_TITLE_LENGTH, MAX_MESSAGE_LENGTH } from '../lib/constants'
import { cn } from '../lib/utils'

export default function SettingsPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { hasAccess, isResolved, token } = useCreatorAccess(quizId)
  const { quiz, isLoading, refresh } = useDashboardData(quizId, token)

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [allowLeaderboard, setAllowLeaderboard] = useState(true)
  const [allowAnswerReview, setAllowAnswerReview] = useState(true)
  const [attemptPolicy, setAttemptPolicy] = useState<'one' | 'unlimited' | 'limited'>('unlimited')
  const [isSaving, setIsSaving] = useState(false)
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!quiz) return
    setTitle(quiz.quizTitle)
    setMessage(quiz.friendMessage)
    setIsActive(quiz.isActive)
    setAllowLeaderboard(quiz.allowLeaderboard)
    setAllowAnswerReview(quiz.allowAnswerReview)
  }, [quiz])

  if (!isResolved) return <LoadingScreen message="Checking access…" />
  if (isFirebaseConfigured && !hasAccess) {
    return <ErrorState title="Unauthorized dashboard access" description="Use the dashboard link from your share page." />
  }
  if (isFirebaseConfigured && isLoading) return <LoadingScreen message="Loading settings…" />

  const handleSave = async () => {
    if (!quizId || !token) return
    setIsSaving(true)
    try {
      if (isFirebaseConfigured) {
        await callUpdateQuizSettings({
          quizId,
          creatorToken: token,
          quizTitle: title,
          friendMessage: message,
          allowLeaderboard,
          allowAnswerReview,
        })
        refresh()
      }
      toast.success('Settings updated')
    } catch {
      toast.error('Could not save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!quizId || !token) return
    const next = !isActive
    try {
      if (isFirebaseConfigured) {
        await callUpdateQuizSettings({ quizId, creatorToken: token, isActive: next })
        refresh()
      }
      setIsActive(next)
      toast.success(next ? 'Quiz enabled' : 'Quiz disabled')
    } catch {
      toast.error('Could not update quiz status')
    } finally {
      setIsDisableModalOpen(false)
    }
  }

  const handleRegenerateLink = async () => {
    if (!quizId || !token) return
    try {
      if (isFirebaseConfigured) {
        const result = await callRegenerateQuizLink(quizId, token)
        toast.success('New quiz link generated')
        navigate(`/dashboard/${result.newQuizId}?token=${result.newToken}`)
        return
      }
      toast.success('New quiz link generated (demo mode)')
    } catch {
      toast.error('Could not regenerate link')
    }
  }

  const handleDeleteQuiz = async () => {
    if (!quizId || !token || deleteConfirmText !== 'DELETE') return
    setIsDeleting(true)
    try {
      if (isFirebaseConfigured) {
        await callDeleteQuiz(quizId, token)
      }
      toast.success('Quiz deleted')
      navigate('/')
    } catch {
      toast.error('Could not delete quiz')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell quizId={quizId ?? ''} quizTitle={quiz?.quizTitle ?? 'Settings'}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-2xl font-extrabold font-display">Quiz Settings</h1>

        <DashboardCard title="Basic details">
          <div className="space-y-4">
            <AppInput label="Quiz title" value={title} maxLength={MAX_QUIZ_TITLE_LENGTH} onChange={(e) => setTitle(e.target.value)} />
            <AppTextarea
              label="Friend message"
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
            />
            <AppButton icon={<Save size={16} />} isLoading={isSaving} onClick={handleSave}>
              Save Changes
            </AppButton>
          </div>
        </DashboardCard>

        <DashboardCard title="Response behavior">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Attempt policy</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'one', label: 'One attempt per browser' },
                  { id: 'unlimited', label: 'Multiple attempts allowed' },
                  { id: 'limited', label: 'Limited attempts' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAttemptPolicy(opt.id as typeof attemptPolicy)}
                    className={cn(
                      'rounded-xl px-3 py-2 text-xs font-semibold',
                      attemptPolicy === opt.id
                        ? 'bg-vibe-violet-500 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Users size={16} /> Show leaderboard
              </div>
              <button
                onClick={() => setAllowLeaderboard((v) => !v)}
                className={cn('h-6 w-11 rounded-full transition-colors', allowLeaderboard ? 'bg-vibe-violet-500' : 'bg-slate-300 dark:bg-white/20')}
                aria-pressed={allowLeaderboard}
                aria-label="Toggle leaderboard visibility"
              >
                <span className={cn('block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform', allowLeaderboard && 'translate-x-5')} />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {allowAnswerReview ? <Eye size={16} /> : <EyeOff size={16} />} Show answer review to friends
              </div>
              <button
                onClick={() => setAllowAnswerReview((v) => !v)}
                className={cn('h-6 w-11 rounded-full transition-colors', allowAnswerReview ? 'bg-vibe-violet-500' : 'bg-slate-300 dark:bg-white/20')}
                aria-pressed={allowAnswerReview}
                aria-label="Toggle answer review visibility"
              >
                <span className={cn('block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform', allowAnswerReview && 'translate-x-5')} />
              </button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Quiz status">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{isActive ? 'Quiz is live' : 'Quiz is disabled'}</p>
              <p className="text-xs text-slate-400">{isActive ? 'Friends can currently take this quiz.' : 'Friends cannot take this quiz right now.'}</p>
            </div>
            <AppButton
              variant={isActive ? 'danger' : 'primary'}
              size="sm"
              icon={<Power size={16} />}
              onClick={() => (isActive ? setIsDisableModalOpen(true) : handleToggleActive())}
            >
              {isActive ? 'Disable Quiz' : 'Reactivate Quiz'}
            </AppButton>
          </div>
        </DashboardCard>

        <DashboardCard title="Danger zone">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-vibe-yellow-400/30 bg-vibe-yellow-400/5 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Regenerate public link</p>
                <p className="text-xs text-slate-400">Disables the current link and creates a new one.</p>
              </div>
              <AppButton size="sm" variant="secondary" icon={<RefreshCcw size={14} />} onClick={handleRegenerateLink}>
                Regenerate
              </AppButton>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-vibe-coral-500/30 bg-vibe-coral-500/5 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delete this quiz</p>
                <p className="text-xs text-slate-400">Permanently removes the quiz and all responses.</p>
              </div>
              <AppButton size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </AppButton>
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      <AppModal isOpen={isDisableModalOpen} onClose={() => setIsDisableModalOpen(false)} title="Disable this quiz?">
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Friends won't be able to take this quiz until you reactivate it. Existing responses stay safe.
        </p>
        <div className="flex gap-3">
          <AppButton variant="secondary" fullWidth onClick={() => setIsDisableModalOpen(false)}>
            Cancel
          </AppButton>
          <AppButton variant="danger" fullWidth onClick={handleToggleActive}>
            Disable Quiz
          </AppButton>
        </div>
      </AppModal>

      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteConfirmText('')
        }}
        title="Delete this quiz permanently?"
      >
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          This deletes the quiz and every response forever. This cannot be undone. Type <strong>DELETE</strong> to confirm.
        </p>
        <AppInput
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder="DELETE"
          className="mb-4"
        />
        <div className="flex gap-3">
          <AppButton
            variant="secondary"
            fullWidth
            onClick={() => {
              setIsDeleteModalOpen(false)
              setDeleteConfirmText('')
            }}
          >
            Cancel
          </AppButton>
          <AppButton
            variant="danger"
            fullWidth
            disabled={deleteConfirmText !== 'DELETE'}
            isLoading={isDeleting}
            onClick={handleDeleteQuiz}
          >
            Delete Forever
          </AppButton>
        </div>
      </AppModal>
    </DashboardShell>
  )
}
