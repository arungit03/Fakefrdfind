import { ProgressBar } from '../common/ProgressBar'

interface QuizProgressProps {
  current: number
  total: number
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="mb-2">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-vibe-violet-500">
        <span>
          Question {current} of {total}
        </span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <ProgressBar value={current} max={total} />
    </div>
  )
}
