import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Set worker source for Vite bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function PdfViewer({ url, title, isThumbnail = false }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isCancelled = false
    let renderTask = null

    const loadAndRender = async () => {
      if (!url) return
      setLoading(true)
      setError(false)

      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4/cmaps/',
          cMapPacked: true,
        })
        const pdf = await loadingTask.promise
        if (isCancelled) return

        const page = await pdf.getPage(1)
        if (isCancelled) return

        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')

        // Determine render scale for crisp high-DPI display
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const baseViewport = page.getViewport({ scale: 1 })
        
        // Target display width: for thumbnail ~300px, for modal ~500-600px
        const targetWidth = isThumbnail ? 320 : 600
        const scale = (targetWidth / baseViewport.width) * dpr
        const viewport = page.getViewport({ scale })

        canvas.width = viewport.width
        canvas.height = viewport.height

        renderTask = page.render({
          canvasContext: context,
          viewport,
        })
        await renderTask.promise
        if (!isCancelled) setLoading(false)
      } catch (err) {
        console.warn('[PdfViewer] Could not render PDF to canvas, using fallback:', err)
        if (!isCancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    loadAndRender()

    return () => {
      isCancelled = true
      if (renderTask) {
        try { renderTask.cancel() } catch (_) {}
      }
    }
  }, [url, isThumbnail])

  if (error) {
    // If PDF.js fails (e.g. CORS or offline), use Google Docs Viewer fallback in an iframe
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    return (
      <iframe
        src={googleDocsUrl}
        className="cert-modal__pdf"
        title={title || 'Certificate document'}
        aria-label={`PDF document for ${title || 'certificate'}`}
      />
    )
  }

  return (
    <div className={`pdf-viewer-wrap${isThumbnail ? ' pdf-viewer-wrap--thumb' : ''}`}>
      {loading && (
        <div className="pdf-viewer__loading">
          <div className="pdf-viewer__spinner" />
          <span>Loading certificate…</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`pdf-viewer__canvas${loading ? ' pdf-viewer__canvas--hidden' : ''}`}
        aria-label={title || 'Certificate PDF'}
      />
    </div>
  )
}
