import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Search, Download, Trash2, ArrowUpDown } from 'lucide-react'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { AppInput } from '../components/common/AppInput'
import { AppButton } from '../components/common/AppButton'
import { AppModal } from '../components/common/AppModal'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { useCreatorAccess } from '../hooks/useCreatorAccess'
import { useDashboardData } from '../hooks/useDashboardData'
import { isFirebaseConfigured } from '../firebase/config'
import { callDeleteQuizResponse } from '../firebase/functions'
import { formatDate, formatDuration } from '../lib/formatters'
import type { QuizResponse } from '../types/response'

type SortKey = 'date' | 'score'

const PAGE_SIZE = 10

export default function ResponsesPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { hasAccess, isResolved, token } = useCreatorAccess(quizId)
  const { quiz, responses, isLoading, refresh } = useDashboardData(quizId, token)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [minScore, setMinScore] = useState(0)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<QuizResponse | null>(null)

  const filtered = useMemo(() => {
    let result = responses.filter(
      (r) => r.playerName.toLowerCase().includes(search.toLowerCase()) && r.percentage >= minScore,
    )
    result = result.sort((a, b) =>
      sortKey === 'score' ? b.percentage - a.percentage : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return result
  }, [responses, search, sortKey, minScore])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const handleExportCsv = () => {
    const header = ['Name', 'Score', 'Percentage', 'Duration (s)', 'Date']
    const rows = filtered.map((r) => [r.playerName, `${r.correctCount}/${r.totalQuestions}`, `${r.percentage}%`, r.durationSeconds, r.createdAt])
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `vibecheck-responses-${quizId}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Export completed')
  }

  const handleDelete = async () => {
    if (!pendingDelete || !quizId) return
    try {
      if (isFirebaseConfigured && token) {
        await callDeleteQuizResponse(quizId, pendingDelete.responseId, token)
        refresh()
      }
      toast.success('Response deleted')
    } catch {
      toast.error('Could not delete response')
    } finally {
      setPendingDelete(null)
    }
  }

  if (!isResolved) return <LoadingScreen message="Checking access…" />
  if (isFirebaseConfigured && !hasAccess) {
    return <ErrorState title="Unauthorized dashboard access" description="Use the dashboard link from your share page." />
  }
  if (isFirebaseConfigured && isLoading) return <LoadingScreen message="Loading responses…" />

  return (
    <DashboardShell quizId={quizId ?? ''} quizTitle={quiz?.quizTitle ?? 'Responses'}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold font-display">Responses</h1>
          <AppButton size="sm" variant="secondary" icon={<Download size={16} />} onClick={handleExportCsv} disabled={filtered.length === 0}>
            Export CSV
          </AppButton>
        </div>

        <DashboardCard title="Filters">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <AppInput
                placeholder="Search by name"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm dark:bg-white/5 dark:border-white/10"
            >
              <option value="date">Sort by date</option>
              <option value="score">Sort by score</option>
            </select>
            <select
              value={minScore}
              onChange={(e) => {
                setMinScore(Number(e.target.value))
                setPage(1)
              }}
              className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm dark:bg-white/5 dark:border-white/10"
            >
              <option value={0}>All scores</option>
              <option value={50}>50%+</option>
              <option value={70}>70%+</option>
              <option value={90}>90%+</option>
            </select>
          </div>
        </DashboardCard>

        <div className="mt-6">
          {paginated.length === 0 ? (
            <EmptyState title="No responses match" description="Try adjusting your search or filters." />
          ) : (
            <div className="space-y-3">
              {paginated.map((response) => (
                <DashboardCard key={response.responseId} title="">
                  <div className="flex flex-wrap items-center justify-between gap-3 -mt-4">
                    <Link
                      to={`/dashboard/${quizId}/response/${response.responseId}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="text-2xl">{response.playerAvatar}</span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-700 dark:text-slate-200">{response.playerName}</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(response.createdAt)} · {formatDuration(response.durationSeconds)}
                        </p>
                      </div>
                    </Link>
                    <span className="rounded-full bg-vibe-violet-100 px-3 py-1 text-sm font-bold text-vibe-violet-600 dark:bg-white/10 dark:text-vibe-violet-300">
                      {response.percentage}%
                    </span>
                    <button
                      onClick={() => setPendingDelete(response)}
                      aria-label={`Delete response from ${response.playerName}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-vibe-coral-50 hover:text-vibe-coral-500 dark:hover:bg-white/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <AppButton size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </AppButton>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <ArrowUpDown size={14} /> Page {page} of {totalPages}
              </span>
              <AppButton size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </AppButton>
            </div>
          )}
        </div>
      </motion.div>

      <AppModal isOpen={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete this response?">
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          This will permanently remove {pendingDelete?.playerName}'s response. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <AppButton variant="secondary" fullWidth onClick={() => setPendingDelete(null)}>
            Cancel
          </AppButton>
          <AppButton variant="danger" fullWidth onClick={handleDelete}>
            Delete
          </AppButton>
        </div>
      </AppModal>
    </DashboardShell>
  )
}
