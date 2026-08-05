import { motion } from 'framer-motion'
import { Medal } from 'lucide-react'
import { formatDate, formatDuration } from '../../lib/formatters'
import { EmptyState } from '../common/EmptyState'
import type { QuizResponse } from '../../types/response'

interface LeaderboardTableProps {
  responses: QuizResponse[]
}

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-700']

export function LeaderboardTable({ responses }: LeaderboardTableProps) {
  const sorted = [...responses].sort((a, b) => b.percentage - a.percentage)

  if (sorted.length === 0) {
    return <EmptyState title="No responses yet" description="Once friends take your quiz, the leaderboard will appear here." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-white/10">
            <th className="py-2.5 pr-3">Rank</th>
            <th className="py-2.5 pr-3">Friend</th>
            <th className="py-2.5 pr-3">Score</th>
            <th className="py-2.5 pr-3">Time</th>
            <th className="py-2.5 pr-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((response, index) => (
            <motion.tr
              key={response.responseId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-slate-50 dark:border-white/5"
            >
              <td className="py-3 pr-3 font-bold">
                {index < 3 ? (
                  <Medal size={18} className={medalColors[index]} fill="currentColor" />
                ) : (
                  <span className="text-slate-400">#{index + 1}</span>
                )}
              </td>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{response.playerAvatar}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{response.playerName}</span>
                </div>
              </td>
              <td className="py-3 pr-3">
                <span className="font-bold text-vibe-violet-600 dark:text-vibe-violet-300">{response.percentage}%</span>
                <span className="ml-1 text-xs text-slate-400">
                  ({response.correctCount}/{response.totalQuestions})
                </span>
              </td>
              <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{formatDuration(response.durationSeconds)}</td>
              <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{formatDate(response.createdAt)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
