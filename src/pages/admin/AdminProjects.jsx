import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Star, StarOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toast, ConfirmDialog, PublishToggle, FileUpload, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'

const EMPTY = {
  title: '', year: new Date().getFullYear(), description: '',
  tech_tags: '', github_url: '', demo_url: '',
  is_featured: false, is_published: true, display_order: 99,
  thumbnail_url: null, result_metric: '', result_note: '',
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null) // null = list, {} = new, {id} = edit
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('display_order')
    setProjects(data || [])
  }

  useEffect(() => { load() }, [])

  const startNew = () => { setForm(EMPTY); setEditing('new') }
  const startEdit = (p) => {
    setForm({
      ...p,
      tech_tags: Array.isArray(p.tech_tags) ? p.tech_tags.join(', ') : (p.tech_tags || ''),
    })
    setEditing(p.id)
  }
  const cancel = () => { setEditing(null); setForm(EMPTY) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tech_tags: typeof form.tech_tags === 'string' ? form.tech_tags.split(',').map((t) => t.trim()).filter(Boolean) : (form.tech_tags || []),
      year: parseInt(form.year, 10) || new Date().getFullYear(),
      display_order: parseInt(form.display_order, 10) || 99,
    }
    const { id, created_at, updated_at, ...cleanPayload } = payload
    let error
    if (editing === 'new') {
      const res = await supabase.from('projects').insert([cleanPayload]).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not insert project. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('projects').update(cleanPayload).eq('id', editing).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update project. Please check admin permissions.')
      }
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(editing === 'new' ? 'Project created!' : 'Project saved!')
    cancel()
    load()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    setConfirmDelete(null)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Project deleted.')
    load()
  }

  const togglePublish = async (p) => {
    const { error } = await supabase.from('projects').update({ is_published: !p.is_published }).eq('id', p.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  const toggleFeatured = async (p) => {
    // Unfeature all first, then feature this one
    if (!p.is_featured) {
      await supabase.from('projects').update({ is_featured: false }).neq('id', p.id).select()
    }
    const { error } = await supabase.from('projects').update({ is_featured: !p.is_featured }).eq('id', p.id).select()
    if (error) showToast(error.message, 'error')
    load()
  }

  const f = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }))

  if (editing !== null) {
    return (
      <div>
        <h1 className="admin-page-title">{editing === 'new' ? 'New Project' : 'Edit Project'}</h1>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-field">
            <label className="admin-label">Title *</label>
            <input className="admin-input" value={form.title} onChange={f('title')} required />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Year</label>
              <input className="admin-input" type="number" value={form.year} onChange={f('year')} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Display Order</label>
              <input className="admin-input" type="number" value={form.display_order} onChange={f('display_order')} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={f('description')} rows={5} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Tech Tags (comma-separated)</label>
            <input className="admin-input" value={form.tech_tags} onChange={f('tech_tags')} placeholder="PyTorch, FastAPI, React" />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">GitHub URL</label>
              <input className="admin-input" type="url" value={form.github_url || ''} onChange={f('github_url')} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Demo URL</label>
              <input className="admin-input" type="url" value={form.demo_url || ''} onChange={f('demo_url')} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Result / Metric</label>
            <input className="admin-input" value={form.result_metric || ''} onChange={f('result_metric')} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Result Note (accuracy context / disclaimer)</label>
            <textarea className="admin-textarea" value={form.result_note || ''} onChange={f('result_note')} rows={3} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Thumbnail Image</label>
            <FileUpload
              bucket="portfolio-assets"
              path={`projects/project-thumb`}
              currentUrl={form.thumbnail_url}
              onUpload={(url) => setForm((p) => ({ ...p, thumbnail_url: url }))}
              label="Upload Thumbnail"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
              Published (visible on public site)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} />
              Featured project
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</button>
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
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-sub">{projects.length} total. Drag to reorder via display_order field.</p>
        </div>
        <button className="btn btn-primary" onClick={startNew} id="admin-add-project-btn">
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-navy)' }}>{p.title}</td>
                <td>{p.year}</td>
                <td>
                  <PublishToggle
                    isPublished={p.is_published}
                    onToggle={() => togglePublish(p)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => toggleFeatured(p)}
                    title={p.is_featured ? 'Unfeature' : 'Set as featured'}
                    style={{ color: p.is_featured ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
                  >
                    {p.is_featured ? <Star size={15} /> : <StarOff size={15} />}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => startEdit(p)}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ color: '#c53030', borderColor: '#fc8181' }}
                    onClick={() => setConfirmDelete(p.id)}
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
          message="Delete this project? This cannot be undone."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
