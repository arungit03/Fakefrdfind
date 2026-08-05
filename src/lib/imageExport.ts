import { toPng } from 'html-to-image'

export async function toDataUrl(node: HTMLElement): Promise<string> {
  return toPng(node, { pixelRatio: 2, cacheBust: true })
}
