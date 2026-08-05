import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Camera } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { AppInput, AppTextarea } from '../components/common/AppInput'
import { StepIndicator } from '../components/common/StepIndicator'
import { creatorProfileSchema, type CreatorProfileFormValues } from '../lib/validators'
import { useQuizDraft } from '../hooks/useQuizDraft'
import { AVATAR_GROUPS } from '../data/avatars'
import { QUIZ_THEMES } from '../data/themes'
import { sanitizeText } from '../lib/security'
import { VibeCheckLogo } from '../components/common/VibeCheckLogo'

const BUILDER_STEPS = ['Profile', 'Questions', 'Review']

export default function CreatorProfilePage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useQuizDraft()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreatorProfileFormValues>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      creatorName: profile.creatorName,
      nickname: profile.nickname,
      avatar: profile.avatar,
      theme: profile.theme,
      language: profile.language,
      friendMessage: profile.friendMessage ?? '',
    },
  })

  const watched = watch()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProfile({
        creatorName: sanitizeText(watched.creatorName || ''),
        nickname: sanitizeText(watched.nickname || ''),
        avatar: watched.avatar,
        theme: watched.theme as typeof profile.theme,
        language: watched.language as typeof profile.language,
        friendMessage: sanitizeText(watched.friendMessage || ''),
      })
    }, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.creatorName, watched.nickname, watched.avatar, watched.theme, watched.language, watched.friendMessage])

  const onSubmit = (values: CreatorProfileFormValues) => {
    setProfile({
      creatorName: sanitizeText(values.creatorName),
      nickname: sanitizeText(values.nickname || ''),
      avatar: values.avatar,
      theme: values.theme as typeof profile.theme,
      language: values.language as typeof profile.language,
      friendMessage: sanitizeText(values.friendMessage || ''),
    })
    navigate('/create/questions')
  }

  const selectedTheme = QUIZ_THEMES.find((t) => t.id === watched.theme) ?? QUIZ_THEMES[0]

  return (
    <div className="relative overflow-hidden py-10 sm:py-14">
      <AnimatedBackground variant="minimal" />
      <PageContainer maxWidth="max-w-5xl">
        <div className="mb-8">
          <StepIndicator steps={BUILDER_STEPS} currentStep={0} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <AppCard>
              <h1 className="mb-1 text-2xl font-extrabold font-display">Tell us about yourself</h1>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                This is what your friends will see before they take your quiz.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <AppInput
                  label="Your name"
                  placeholder="e.g. Arun"
                  maxLength={30}
                  {...register('creatorName')}
                  error={errors.creatorName?.message}
                />
                <AppInput
                  label="Nickname (optional)"
                  placeholder="e.g. The Legend"
                  maxLength={15}
                  {...register('nickname')}
                  error={errors.nickname?.message}
                />

                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Pick an avatar</span>
                  <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                      <div className="max-h-44 space-y-3 overflow-y-auto rounded-2xl border-2 border-slate-100 p-3 dark:border-white/10">
                        {AVATAR_GROUPS.map((group) => (
                          <div key={group.label}>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
                            <div className="flex flex-wrap gap-2">
                              {group.emojis.map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => field.onChange(emoji)}
                                  aria-pressed={field.value === emoji}
                                  aria-label={`Select avatar ${emoji}`}
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                                    field.value === emoji
                                      ? 'bg-vibe-gradient shadow-glow scale-110'
                                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Choose a theme</span>
                  <Controller
                    control={control}
                    name="theme"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {QUIZ_THEMES.map((theme) => (
                          <button
                            type="button"
                            key={theme.id}
                            onClick={() => field.onChange(theme.id)}
                            aria-pressed={field.value === theme.id}
                            className={`rounded-2xl bg-gradient-to-br ${theme.gradient} p-3 text-left text-white transition-transform ${
                              field.value === theme.id ? 'ring-4 ring-vibe-violet-300 scale-[1.03]' : 'hover:scale-[1.02]'
                            }`}
                          >
                            <span className="text-lg">{theme.emoji}</span>
                            <p className="mt-1 text-xs font-bold">{theme.name}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Quiz language</span>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {[
                          { id: 'en', label: 'English' },
                          { id: 'ta', label: 'தமிழ்' },
                        ].map((lang) => (
                          <button
                            type="button"
                            key={lang.id}
                            onClick={() => field.onChange(lang.id)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                              field.value === lang.id
                                ? 'bg-vibe-violet-500 text-white'
                                : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <AppTextarea
                  label="Message for friends (optional)"
                  placeholder="e.g. Let's see who actually pays attention 👀"
                  maxLength={120}
                  rows={3}
                  {...register('friendMessage')}
                  error={errors.friendMessage?.message}
                />

                <div className="flex justify-end pt-2">
                  <AppButton type="submit" icon={<ArrowRight size={18} />}>
                    Continue
                  </AppButton>
                </div>
              </form>
            </AppCard>
          </motion.div>

          {/* Live preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-3 text-center text-sm font-semibold text-slate-400">Live preview</p>
            <div className={`rounded-4xl bg-gradient-to-br ${selectedTheme.gradient} p-1 shadow-glow`}>
              <div className="rounded-[1.9rem] bg-white/95 p-6 text-center backdrop-blur dark:bg-vibe-navy-900/95">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-vibe-violet-100 text-3xl dark:bg-white/10">
                  {watched.avatar || '😄'}
                </div>
                <h3 className="text-lg font-extrabold font-display">
                  {watched.creatorName || 'Your Name'}
                  {watched.nickname ? ` "${watched.nickname}"` : ''}
                </h3>
                <p className="mt-1 text-xs font-semibold text-vibe-violet-500">{selectedTheme.name} theme</p>
                {watched.friendMessage && (
                  <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm italic text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    "{watched.friendMessage}"
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <VibeCheckLogo size={16} showWordmark={false} />
                  <span>Powered by VibeCheck</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Camera size={14} /> Draft is autosaved locally
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  )
}
