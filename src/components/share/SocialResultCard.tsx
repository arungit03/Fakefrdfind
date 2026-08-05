import { forwardRef } from 'react'
import { VibeCheckLogo } from '../common/VibeCheckLogo'
import { getTheme } from '../../data/themes'
import type { ThemeId } from '../../types/quiz'

interface SocialResultCardProps {
  friendName: string
  friendAvatar: string
  creatorName: string
  percentage: number
  score: number
  totalQuestions: number
  theme: ThemeId
}

export const SocialResultCard = forwardRef<HTMLDivElement, SocialResultCardProps>(
  ({ friendName, friendAvatar, creatorName, percentage, score, totalQuestions, theme }, ref) => {
    const themeData = getTheme(theme)

    return (
      <div
        ref={ref}
        className={`flex h-[600px] w-[400px] flex-col items-center justify-between rounded-[2.5rem] bg-gradient-to-br ${themeData.gradient} p-8 text-white`}
      >
        <div className="flex w-full items-center justify-between">
          <VibeCheckLogo size={32} />
          <span className="text-xs font-bold opacity-80">vibecheck.app</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-6xl">{friendAvatar}</span>
          <h2 className="mt-3 text-2xl font-extrabold font-display">{friendName}</h2>
          <p className="mt-1 text-sm opacity-80">took {creatorName}'s friendship quiz</p>

          <div className="mt-6 flex h-40 w-40 items-center justify-center rounded-full border-8 border-white/30 bg-white/10 backdrop-blur">
            <div className="text-center">
              <div className="text-5xl font-extrabold font-display">{Math.round(percentage)}%</div>
              <div className="text-xs opacity-80">
                {score}/{totalQuestions} correct
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-white/15 px-4 py-3 text-center text-xs font-semibold backdrop-blur">
          Think you know {creatorName} better? Take the quiz on VibeCheck.
        </div>
      </div>
    )
  },
)

SocialResultCard.displayName = 'SocialResultCard'
