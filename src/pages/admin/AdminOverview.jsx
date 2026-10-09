import { useState, useEffect } from 'react'
import { FolderOpen, Briefcase, Award, Code2, GraduationCap, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminOverview.css'

const tables = [
  { key: 'projects', label: 'Projects', icon: FolderOpen, color: 'blue' },
  { key: 'internships', label: 'Experience', icon: Briefcase, color: 'navy' },
  { key: 'certificates', label: 'Certificates', icon: Award, color: 'gold' },
  { key: 'skills', label: 'Skills', icon: Code2, color: 'blue' },
  { key: 'education', label: 'Education', icon: GraduationCap, color: 'navy' },
  { key: 'contact_messages', label: 'Messages', icon: MessageSquare, color: 'gold' },
]

export default function AdminOverview() {
  const [counts, setCounts] = useState({})
  const [updated, setUpdated] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      const results = {}
      const timestamps = {}
      for (const t of tables) {
        const { count } = await supabase
          .from(t.key)
          .select('*', { count: 'exact', head: true })
        results[t.key] = count || 0

        // Get last updated timestamp
        const { data } = await supabase
          .from(t.key)
          .select('updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        timestamps[t.key] = data?.updated_at
      }
      setCounts(results)
      setUpdated(timestamps)
      setLoading(false)
    }
    fetchCounts()
  }, [])

  const fmt = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="admin-overview">
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Real database counts and last-updated timestamps.</p>

      {loading ? (
        <div className="admin-overview__loading">Loading data…</div>
      ) : (
        <div className="admin-overview__grid">
          {tables.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className={`admin-stat-card admin-stat-card--${color}`}>
              <div className="admin-stat-card__icon">
                <Icon size={20} />
              </div>
              <div className="admin-stat-card__body">
                <span className="admin-stat-card__count">{counts[key] ?? '—'}</span>
                <span className="admin-stat-card__label">{label}</span>
                <span className="admin-stat-card__time">Updated: {fmt(updated[key])}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-overview__tips">
        <h2 className="admin-overview__tips-title">Quick tips</h2>
        <ul className="admin-overview__tips-list">
          <li>Use the sidebar to manage any section. Changes appear on the public site immediately after publishing.</li>
          <li>Draft items are never visible to public visitors.</li>
          <li>Upload your resume via <strong>Profile</strong> → Resume PDF field.</li>
          <li>Upload certificate files via <strong>Certificates</strong> → individual certificate edit.</li>
          <li>Toggle <em>Open to Work</em> badge in <strong>Profile</strong>.</li>
        </ul>
      </div>
    </div>
  )
}
