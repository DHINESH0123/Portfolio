import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Toast, FileUpload, useToast } from '../../components/Admin/AdminCrud.jsx'
import '../../components/Admin/AdminCrud.css'
import './AdminProfile.css'

const DEFAULT = {
  name: '', title: '', hero_intro: '', about_text: '', location: '',
  email: '', linkedin: '', github: '', phone: '', phone_visible: false,
  open_to_work: true, resume_url: null, photo_url: null,
}

export default function AdminProfile() {
  const [form, setForm] = useState(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  useEffect(() => {
    supabase.from('profile').select('*').order('id', { ascending: true }).limit(1).maybeSingle().then(({ data, error }) => {
      if (error) console.error('[AdminProfile] Load error:', error)
      if (data) { setForm(data); setProfileId(data.id) }
    })
  }, [])

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const fCheck = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { id, created_at, updated_at, ...cleanForm } = form
    let error
    if (profileId) {
      const res = await supabase.from('profile').update(cleanForm).eq('id', profileId).select()
      error = res.error
      if (!error && (!res.data || res.data.length === 0)) {
        error = new Error('Could not update profile. Please check admin permissions.')
      }
    } else {
      const res = await supabase.from('profile').insert([cleanForm]).select().maybeSingle()
      error = res.error
      if (res.data) setProfileId(res.data.id)
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Profile saved! Changes are now live.')
  }

  return (
    <div>
      <h1 className="admin-page-title">Profile</h1>
      <p className="admin-page-sub">Changes go live immediately after saving.</p>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 760 }}>
        {/* Hero Fields */}
        <div className="admin-profile-section-label">Hero Section</div>
        <div className="admin-field">
          <label className="admin-label">Full Name</label>
          <input className="admin-input" value={form.name || ''} onChange={f('name')} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Title / Role Line</label>
          <input className="admin-input" value={form.title || ''} onChange={f('title')} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Hero Intro Text</label>
          <textarea className="admin-textarea" value={form.hero_intro || ''} onChange={f('hero_intro')} rows={3} />
        </div>

        {/* About */}
        <div className="admin-profile-section-label">About Section</div>
        <div className="admin-field">
          <label className="admin-label">About Text (separate paragraphs with a blank line)</label>
          <textarea className="admin-textarea" value={form.about_text || ''} onChange={f('about_text')} rows={10} />
        </div>

        {/* Contact Info */}
        <div className="admin-profile-section-label">Contact & Social</div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">Location</label>
            <input className="admin-input" value={form.location || ''} onChange={f('location')} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Email</label>
            <input className="admin-input" type="email" value={form.email || ''} onChange={f('email')} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">LinkedIn URL</label>
            <input className="admin-input" type="url" value={form.linkedin || ''} onChange={f('linkedin')} />
          </div>
          <div className="admin-field">
            <label className="admin-label">GitHub URL</label>
            <input className="admin-input" type="url" value={form.github || ''} onChange={f('github')} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">Phone Number</label>
            <input className="admin-input" type="tel" value={form.phone || ''} onChange={f('phone')} placeholder="Hidden by default" />
          </div>
          <div className="admin-field" style={{ justifyContent: 'flex-end', paddingBottom: 'var(--space-1)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', paddingTop: 'var(--space-8)' }}>
              <input type="checkbox" checked={form.phone_visible || false} onChange={fCheck('phone_visible')} />
              Show phone number publicly
            </label>
          </div>
        </div>

        {/* Availability */}
        <div className="admin-profile-section-label">Availability</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
          <input type="checkbox" checked={form.open_to_work || false} onChange={fCheck('open_to_work')} />
          Show "Open to opportunities" badge on hero
        </label>

        {/* Files */}
        <div className="admin-profile-section-label">Photo & Resume</div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">Profile Photo</label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              The current photo (DHINESH LINKEDIN.png) is bundled in assets. Upload here to override it via Supabase Storage.
            </p>
            <FileUpload
              bucket="portfolio-assets"
              path="profile/photo"
              currentUrl={form.photo_url}
              onUpload={(url) => setForm((p) => ({ ...p, photo_url: url }))}
              label="Replace Profile Photo"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Resume PDF</label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Upload your resume here. The Download Resume button will appear on the navbar and hero once a file is uploaded.
            </p>
            <FileUpload
              bucket="portfolio-assets"
              path="profile/resume"
              currentUrl={form.resume_url}
              onUpload={(url) => setForm((p) => ({ ...p, resume_url: url }))}
              accept=".pdf"
              label="Upload Resume PDF"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
