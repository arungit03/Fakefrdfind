import type { QuestionCategory, QuestionDifficulty } from '../../types/quiz'
import { cn } from '../../lib/utils'

const categoryLabels: Record<QuestionCategory, string> = {
  favorites: 'Favorites',
  personality: 'Personality',
  food: 'Food',
  travel: 'Travel',
  movies: 'Movies',
  music: 'Music',
  gaming: 'Gaming',
  college: 'College',
  childhood: 'Childhood',
  habits: 'Habits',
  dreams: 'Dreams',
  funny: 'Funny',
  friendship: 'Friendship',
  random: 'Random',
}

const difficultyClasses: Record<QuestionDifficulty, string> = {
  easy: 'bg-vibe-mint-500/15 text-vibe-mint-500',
  medium: 'bg-vibe-yellow-400/20 text-amber-600 dark:text-vibe-yellow-300',
  hard: 'bg-vibe-coral-500/15 text-vibe-coral-500',
}

export function CategoryBadge({ category }: { category: QuestionCategory }) {
  return (
    <span className="rounded-full bg-vibe-violet-100 px-2.5 py-1 text-xs font-bold text-vibe-violet-600 dark:bg-white/10 dark:text-vibe-violet-300">
      {categoryLabels[category] ?? category}
    </span>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: QuestionDifficulty }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold capitalize', difficultyClasses[difficulty])}>
      {difficulty}
    </span>
  )
}
