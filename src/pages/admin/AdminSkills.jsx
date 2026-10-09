import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const CATEGORIES = [
  'Languages', 'Generative AI & NLP', 'Machine Learning & Deep Learning',
  'Backend & APIs', 'Databases', 'Tools',
]

const EMPTY = { name: '', category: CATEGORIES[0], is_published: true, display_order: 99 }

export default function AdminSkills() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filter, setFilter] = useState('All')
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('category').order('display_order')
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
    const payload = { ...form, display_order: parseInt(form.display_order, 10) || 99 }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('skills').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not add skill. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('skills').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update skill. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Skill added!' : 'Saved!')
    cancel(); load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Deleted.')
    load()
  }

  const togglePublish = async (item) => {
    const { error } = await supabase.from('skills').update({ is_published: !item.is_published }).eq('id', item.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter)

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">{editing === 'new' ? 'New Skill' : 'Edit Skill'}</h1>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Skill Name *</label>
              <input className="admin-input" value={form.name} onChange={f('name')} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <select className="admin-select" value={form.category} onChange={f('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Display Order</label>
            <input className="admin-input" type="number" value={form.display_order} onChange={f('display_order')} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
            Published (visible on public site)
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Skill'}</button>
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
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-sub">{items.length} total · {items.filter((i) => !i.is_published).length} drafts pending review</p>
        </div>
        <button className="btn btn-primary" onClick={startNew}><Plus size={16} /> Add Skill</button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm${filter === cat ? ' btn-primary' : ' btn-secondary'}`}
            onClick={() => setFilter(cat)}
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Category</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-navy)' }}>{item.name}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.category}</td>
                <td>{item.display_order}</td>
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
      {confirmDelete && <ConfirmDialog message="Delete this skill?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
