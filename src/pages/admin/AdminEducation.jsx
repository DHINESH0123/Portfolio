import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const EMPTY = { degree: '', institution: '', location: '', start_year: '', end_year: '', grade: '', is_published: true, display_order: 99 }

export default function AdminEducation() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase.from('education').select('*').order('display_order')
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
    const toInt = (v) => (v !== '' && v !== null && v !== undefined && !isNaN(parseInt(v, 10))) ? parseInt(v, 10) : null
    const payload = {
      ...form,
      start_year:    toInt(form.start_year),
      end_year:      toInt(form.end_year),
      display_order: parseInt(form.display_order, 10) || 99,
    }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('education').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not insert education entry. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('education').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update education entry. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Entry created!' : 'Saved!')
    cancel(); load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('education').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Deleted.')
    load()
  }

  const togglePublish = async (item) => {
    const { error } = await supabase.from('education').update({ is_published: !item.is_published }).eq('id', item.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">{editing === 'new' ? 'New Education Entry' : 'Edit Education'}</h1>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-field">
            <label className="admin-label">Degree / Qualification *</label>
            <input className="admin-input" value={form.degree} onChange={f('degree')} required />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Institution *</label>
              <input className="admin-input" value={form.institution} onChange={f('institution')} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Location</label>
              <input className="admin-input" value={form.location || ''} onChange={f('location')} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Start Year</label>
              <input className="admin-input" type="number" value={form.start_year || ''} onChange={f('start_year')} />
            </div>
            <div className="admin-field">
              <label className="admin-label">End Year</label>
              <input className="admin-input" type="number" value={form.end_year || ''} onChange={f('end_year')} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Grade / Score</label>
              <input className="admin-input" value={form.grade || ''} onChange={f('grade')} placeholder="8.07/10 or 86.5%" />
            </div>
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
          <h1 className="admin-page-title">Education</h1>
          <p className="admin-page-sub">{items.length} entries.</p>
        </div>
        <button className="btn btn-primary" onClick={startNew}><Plus size={16} /> Add Entry</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Degree</th><th>Institution</th><th>Years</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-navy)' }}>{item.degree}</td>
                <td>{item.institution}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.start_year} – {item.end_year}</td>
                <td>{item.grade}</td>
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
