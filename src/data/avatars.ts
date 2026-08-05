export interface AvatarGroup {
  label: string
  emojis: string[]
}

export const AVATAR_GROUPS: AvatarGroup[] = [
  {
    label: 'Faces',
    emojis: ['😄', '😎', '🥳', '🤩', '😇', '🙃', '😝', '🤗', '🥰', '😏'],
  },
  {
    label: 'Animals',
    emojis: ['🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🦄'],
  },
  {
    label: 'Gaming',
    emojis: ['🎮', '👾', '🕹️', '🎯', '🏆', '⚔️', '🛡️', '🎲'],
  },
  {
    label: 'Music',
    emojis: ['🎧', '🎤', '🎸', '🥁', '🎹', '🎺', '🎷', '🪕'],
  },
  {
    label: 'Sports',
    emojis: ['⚽', '🏀', '🏈', '🎾', '🏐', '🏓', '🥊', '🛹'],
  },
  {
    label: 'Minimal',
    emojis: ['⭐', '🔥', '✨', '💫', '🌈', '🍀', '🌙', '☀️'],
  },
]

export const ALL_AVATARS = AVATAR_GROUPS.flatMap((g) => g.emojis)

export const DEFAULT_AVATAR = '😄'
