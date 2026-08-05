export function getQuizUrl(quizId: string): string {
  return `${window.location.origin}/quiz/${quizId}`
}

export function getDashboardUrl(quizId: string, token: string): string {
  return `${window.location.origin}/dashboard/${quizId}?token=${token}`
}

export function buildWhatsAppMessage(creatorName: string, quizUrl: string): string {
  return `Hey! I created a friendship quiz 😄\nLet's see how well you know me, ${creatorName ? '' : ''}${creatorName ? `- ${creatorName}` : ''}.\nTake the quiz here:\n${quizUrl}`
}

export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      document.body.removeChild(textarea)
      return false
    }
  }
}

export async function nativeShare(data: { title: string; text: string; url: string }): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch {
      return false
    }
  }
  return false
}
