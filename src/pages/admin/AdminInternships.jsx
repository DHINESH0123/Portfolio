import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const EMPTY = {
  role: '', company: '', location: '', start_date: '', end_date: '',
  is_ongoing: false, bullets: [''], is_published: true, display_order: 99,
}

export default function AdminInternships() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase.from('internships').select('*').order('display_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const startNew = () => { setForm(EMPTY); setEditing('new') }
  const startEdit = (item) => {
    setForm({
      ...item,
      bullets: Array.isArray(item.bullets) ? item.bullets : [''],
    })
    setEditing(item.id)
  }
  const cancel = () => { setEditing(null); setForm(EMPTY) }

  const setBullet = (i, val) => {
    setForm((p) => {
      const b = [...p.bullets]
      b[i] = val
      return { ...p, bullets: b }
    })
  }

  const addBullet = () => setForm((p) => ({ ...p, bullets: [...p.bullets, ''] }))
  const removeBullet = (i) => setForm((p) => ({ ...p, bullets: p.bullets.filter((_, idx) => idx !== i) }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      bullets: form.bullets.filter((b) => b.trim()),
      display_order: parseInt(form.display_order, 10) || 99,
    }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('internships').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not insert experience. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('internships').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update experience. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Entry created!' : 'Entry saved!')
    cancel(); load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('internships').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Deleted.')
    load()
  }

  const togglePublish = async (item) => {
    const { error } = await supabase.from('internships').update({ is_published: !item.is_published }).eq('id', item.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  const f = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }))

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">{editing === 'new' ? 'New Experience Entry' : 'Edit Experience Entry'}</h1>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Role *</label>
              <input className="admin-input" value={form.role} onChange={f('role')} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Company *</label>
              <input className="admin-input" value={form.company} onChange={f('company')} required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Location</label>
              <input className="admin-input" value={form.location || ''} onChange={f('location')} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Display Order</label>
              <input className="admin-input" type="number" value={form.display_order} onChange={f('display_order')} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Start Date (YYYY-MM)</label>
              <input className="admin-input" value={form.start_date || ''} onChange={f('start_date')} placeholder="2026-07" />
            </div>
            <div className="admin-field">
              <label className="admin-label">End Date (YYYY-MM) — leave blank if ongoing</label>
              <input className="admin-input" value={form.end_date || ''} onChange={f('end_date')} disabled={form.is_ongoing} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            <input type="checkbox" checked={form.is_ongoing} onChange={(e) => setForm((p) => ({ ...p, is_ongoing: e.target.checked, end_date: '' }))} />
            Currently ongoing (shows "Present")
          </label>

          <div className="admin-field">
            <label className="admin-label">Bullet Points</label>
            {form.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <input className="admin-input" value={b} onChange={(e) => setBullet(i, e.target.value)} placeholder={`Bullet ${i + 1}`} />
                <button type="button" className="btn btn-sm" onClick={() => removeBullet(i)} style={{ flexShrink: 0, color: '#c53030' }}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-secondary" onClick={addBullet} style={{ width: 'fit-content' }}>+ Add bullet</button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
            Published
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
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
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-sub">{items.length} entries.</p>
        </div>
        <button className="btn btn-primary" onClick={startNew}><Plus size={16} /> Add Entry</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Role</th><th>Company</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-navy)' }}>{item.role}</td>
                <td>{item.company}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {item.start_date} — {item.is_ongoing ? 'Present' : item.end_date}
                </td>
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

      {confirmDelete && <ConfirmDialog message="Delete this entry?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
