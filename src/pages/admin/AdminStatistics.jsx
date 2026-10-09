import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const EMPTY = { label: '', value: '', suffix: '', display_order: 99, is_published: true }

export default function AdminStatistics() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase
      .from('statistics')
      .select('*')
      .order('display_order')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  const startNew = () => { setForm(EMPTY); setEditing('new') }
  const startEdit = (item) => { setForm({ ...item }); setEditing(item.id) }
  const cancel = () => { setEditing(null); setForm(EMPTY) }
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.label.trim() || !form.value.trim()) {
      showToast('Label and Value are required.', 'error')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      display_order: parseInt(form.display_order, 10) || 99,
    }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('statistics').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not insert statistic. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('statistics').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update statistic. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Stat created!' : 'Saved!')
    cancel(); load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('statistics').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Deleted.')
    load()
  }

  const togglePublish = async (item) => {
    const { error } = await supabase.from('statistics').update({ is_published: !item.is_published }).eq('id', item.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">
          {editing === 'new' ? 'New Stat' : 'Edit Stat'}
        </h1>
        <p className="admin-page-sub">
          These appear in the dark blue stats strip on the public site.
        </p>

        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Value *</label>
              <input
                className="admin-input"
                value={form.value}
                onChange={f('value')}
                placeholder="e.g. 8.07 or 10,000"
                required
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                The big number shown on the card
              </p>
            </div>
            <div className="admin-field">
              <label className="admin-label">Suffix</label>
              <input
                className="admin-input"
                value={form.suffix}
                onChange={f('suffix')}
                placeholder="e.g. /10 or + or %"
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Small text shown after the number
              </p>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Label *</label>
            <input
              className="admin-input"
              value={form.label}
              onChange={f('label')}
              placeholder="e.g. Internships Completed"
              required
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Caption below the number
            </p>
          </div>

          <div className="admin-field">
            <label className="admin-label">Display Order</label>
            <input
              className="admin-input"
              type="number"
              value={form.display_order}
              onChange={f('display_order')}
              style={{ maxWidth: 140 }}
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Lower = shown first (left to right)
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
            />
            Published (visible on public site)
          </label>

          {/* Live preview */}
          <div className="stat-preview">
            <span className="stat-preview__value">
              {form.value || '—'}
              {form.suffix && <span className="stat-preview__suffix">{form.suffix}</span>}
            </span>
            <span className="stat-preview__label">{form.label || 'Label'}</span>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Stat'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancel}>
              Cancel
            </button>
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
          <h1 className="admin-page-title">Statistics</h1>
          <p className="admin-page-sub">
            {items.length} stats · these appear in the dark blue strip on the public site.
            Drag order via "Display Order" field.
          </p>
        </div>
        <button className="btn btn-primary" onClick={startNew} id="admin-add-stat-btn">
          <Plus size={16} /> Add Stat
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}>#</th>
              <th>Value</th>
              <th>Suffix</th>
              <th>Label</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                  <GripVertical size={14} />
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-navy)' }}>
                    {item.value}
                  </span>
                  <span style={{ color: 'var(--color-gold-dark)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {item.suffix}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {item.suffix || '—'}
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {item.label}
                </td>
                <td>
                  <PublishToggle
                    isPublished={item.is_published}
                    onToggle={() => togglePublish(item)}
                  />
                </td>
                <td style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ color: '#c53030' }}
                    onClick={() => setConfirmDelete(item.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          message="Delete this stat? It will disappear from the public site immediately."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
