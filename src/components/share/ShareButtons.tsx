import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Check, Share2, MessageCircle } from 'lucide-react'
import { AppButton } from '../common/AppButton'
import { copyToClipboard, nativeShare, getWhatsAppShareUrl } from '../../lib/share'

interface ShareButtonsProps {
  url: string
  message: string
  title?: string
}

export function ShareButtons({ url, message, title = 'VibeCheck Quiz' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Could not copy link')
    }
  }

  const handleShare = async () => {
    const shared = await nativeShare({ title, text: message, url })
    if (!shared) {
      await handleCopy()
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <AppButton variant="secondary" icon={copied ? <Check size={16} /> : <Copy size={16} />} onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy Link'}
      </AppButton>
      <AppButton variant="secondary" icon={<Share2 size={16} />} onClick={handleShare}>
        Share
      </AppButton>
      <a
        href={getWhatsAppShareUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-2"
      >
        <AppButton fullWidth icon={<MessageCircle size={16} />} className="!bg-[#25D366] hover:!shadow-[0_0_40px_rgba(37,211,102,0.35)]">
          Share on WhatsApp
        </AppButton>
      </a>
    </div>
  )
}
