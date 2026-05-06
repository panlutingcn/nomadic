async function renderCanvas(element: HTMLElement) {
  const html2canvas = (await import('html2canvas')).default
  return html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null, logging: false })
}

function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) { reject(new Error('canvas.toBlob returned null')); return }
      resolve(new File([blob], 'nomadic-card.png', { type: 'image/png' }))
    }, 'image/png')
  })
}

export async function generateCardImage(element: HTMLElement): Promise<File> {
  const canvas = await renderCanvas(element)
  return canvasToFile(canvas)
}

export async function generateCardPreview(element: HTMLElement): Promise<{ dataUrl: string; file: File }> {
  const canvas = await renderCanvas(element)
  const dataUrl = canvas.toDataURL('image/png')
  const file = await canvasToFile(canvas)
  return { dataUrl, file }
}

export async function shareOrDownloadCard(element: HTMLElement): Promise<void> {
  const file = await generateCardImage(element)
  const canShare = typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  if (canShare) {
    await navigator.share({ files: [file], title: 'Nomadic 此时此地' })
  } else {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nomadic-card.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
