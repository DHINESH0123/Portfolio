import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import './AdminCrud.css'

/* ── Shared Toast ── */
export function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`admin-toast admin-toast--${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="admin-toast__close">✕</button>
    </div>
  )
}

/* ── Confirm Dialog ── */
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="admin-confirm-overlay" role="dialog" aria-modal="true">
      <div className="admin-confirm">
        <p className="admin-confirm__msg">{message}</p>
        <div className="admin-confirm__actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: '#c53030', borderColor: '#c53030' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Image/File Upload ── */
export function FileUpload({ bucket, path, currentUrl, onUpload, accept = 'image/*', label = 'Upload File' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${path}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onUpload(urlData.publicUrl)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload">
      {currentUrl && (
        <div className="file-upload__preview">
          {accept.includes('image') ? (
            <img src={currentUrl} alt="Current file" className="file-upload__img" />
          ) : (
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="file-upload__link">
              View current file ↗
            </a>
          )}
        </div>
      )}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      {error && <p className="file-upload__error">{error}</p>}
    </div>
  )
}

/* ── useToast hook ── */
export function useToast() {
  const [toast, setToast] = useState(null)
  const show = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }
  return { toast, show, hide: () => setToast(null) }
}

/* ── PublishToggle ── */
export function PublishToggle({ isPublished, onToggle, loading }) {
  return (
    <button
      className={`publish-toggle${isPublished ? ' publish-toggle--on' : ''}`}
      onClick={onToggle}
      disabled={loading}
      title={isPublished ? 'Unpublish' : 'Publish'}
    >
      <span className="publish-toggle__dot" />
      {isPublished ? 'Published' : 'Draft'}
    </button>
  )
}
