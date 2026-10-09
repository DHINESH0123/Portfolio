import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, FileUpload, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const EMPTY = {
  title: '', issuer: '', issue_year: new Date().getFullYear(), expiry_year: '',
  credential_id: '', verification_url: '', image_url: null, description: '',
  is_published: true, display_order: 99,
}

export default function AdminCertificates() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase.from('certificates').select('*').order('display_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const startNew = () => { setForm(EMPTY); setEditing('new') }
  const startEdit = (item) => { setForm({ ...item }); setEditing(item.id) }
  const cancel = () => { setEditing(null); setForm(EMPTY) }
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      display_order: parseInt(form.display_order, 10) || 99,
      issue_year:    form.issue_year   ? parseInt(form.issue_year, 10)   : null,
      expiry_year:   form.expiry_year  ? parseInt(form.expiry_year, 10)  : null,
    }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('certificates').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not insert certificate. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('certificates').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update certificate. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Certificate created!' : 'Saved!')
    cancel(); load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Deleted.')
    load()
  }

  const togglePublish = async (item) => {
    const { error } = await supabase.from('certificates').update({ is_published: !item.is_published }).eq('id', item.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">{editing === 'new' ? 'New Certificate' : 'Edit Certificate'}</h1>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Title *</label>
              <input className="admin-input" value={form.title} onChange={f('title')} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Issuer *</label>
              <input className="admin-input" value={form.issuer} onChange={f('issuer')} required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Issue Year</label>
              <input className="admin-input" type="number" value={form.issue_year || ''} onChange={f('issue_year')} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Expiry Year (optional)</label>
              <input className="admin-input" type="number" value={form.expiry_year || ''} onChange={f('expiry_year')} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Credential ID</label>
            <input className="admin-input" value={form.credential_id || ''} onChange={f('credential_id')} placeholder="Leave blank if not yet available" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Verification URL</label>
            <input className="admin-input" type="url" value={form.verification_url || ''} onChange={f('verification_url')} placeholder="https://..." />
          </div>
          <div className="admin-field">
            <label className="admin-label">Description (optional)</label>
            <textarea className="admin-textarea" value={form.description || ''} onChange={f('description')} rows={3} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Certificate Image or PDF</label>
            <FileUpload
              bucket="portfolio-assets"
              path="certificates/cert"
              currentUrl={form.image_url}
              onUpload={(url) => setForm((p) => ({ ...p, image_url: url }))}
              accept="image/*,.pdf"
              label="Upload Certificate"
            />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Display Order</label>
              <input className="admin-input" type="number" value={form.display_order} onChange={f('display_order')} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
            Published
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Certificate'}</button>
            <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
          </div>
        </form>
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    )
  }

  return (
    <div>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-page-title">Certificates</h1>
          <p className="admin-page-sub">{items.length} total. Credential IDs and files can be added later.</p>
        </div>
        <button className="btn btn-primary" onClick={startNew}><Plus size={16} /> Add Certificate</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Issuer</th><th>Year</th><th>Credential ID</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-navy)' }}>{item.title}</td>
                <td>{item.issuer}</td>
                <td>{item.issue_year}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.credential_id || '—'}</td>
                <td><PublishToggle isPublished={item.is_published} onToggle={() => togglePublish(item)} /></td>
                <td style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => startEdit(item)}><Pencil size={13} /> Edit</button>
                  <button className="btn btn-sm" style={{ color: '#c53030' }} onClick={() => setConfirmDelete(item.id)}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirmDelete && <ConfirmDialog message="Delete this certificate?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
