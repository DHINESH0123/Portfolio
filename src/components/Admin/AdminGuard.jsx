import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminGuard.css'

export default function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="admin-guard-loading" role="status" aria-live="polite">
        <div className="admin-guard-spinner" />
        <span>Verifying session…</span>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/adminlogin" replace />
  }

  return children
}
