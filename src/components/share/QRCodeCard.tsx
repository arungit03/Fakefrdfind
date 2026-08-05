import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import { AppButton } from '../common/AppButton'
import { AppCard } from '../common/AppCard'

interface QRCodeCardProps {
  url: string
  fileName?: string
}

export function QRCodeCard({ url, fileName = 'vibecheck-qr' }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string>('')

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 1,
      color: { dark: '#4c1d95', light: '#ffffff' },
    }).catch(() => {})
    QRCode.toDataURL(url, { width: 512, margin: 1, color: { dark: '#4c1d95', light: '#ffffff' } })
      .then(setDataUrl)
      .catch(() => {})
  }, [url])

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${fileName}.png`
    link.click()
  }

  return (
    <AppCard className="flex flex-col items-center text-center">
      <canvas ref={canvasRef} className="rounded-2xl" aria-label="Quiz QR code" />
      <AppButton size="sm" variant="secondary" icon={<Download size={16} />} className="mt-4" onClick={handleDownload}>
        Download QR Code
      </AppButton>
    </AppCard>
  )
}
