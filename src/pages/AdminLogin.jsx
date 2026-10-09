import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import './AdminLogin.css'

export default function AdminLogin() {
  const { user, isAdmin, signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user && isAdmin) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      await signIn(form.email, form.password)
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login" role="main">
      <div className="admin-login__card">
        {/* Header */}
        <div className="admin-login__header">
          <div className="admin-login__logo">DS</div>
          <h1 className="admin-login__title">Admin Access</h1>
          <p className="admin-login__sub">Dhinesh AI Portfolio — CMS</p>
        </div>

        {/* Form */}
        <form
          className="admin-login__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Admin login form"
        >
          <div className="admin-login__field">
            <label htmlFor="admin-email" className="admin-login__label">
              <Mail size={15} />
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              className="admin-login__input"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="admin-password" className="admin-login__label">
              <Lock size={15} />
              Password
            </label>
            <div className="admin-login__pass-wrap">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                className="admin-login__input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="admin-login__eye"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login__error" role="alert">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg admin-login__submit"
            disabled={loading}
            id="admin-login-btn"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login__note">
          No public sign-up. Access requires explicit admin role assignment.
        </p>
      </div>
    </div>
  )
}
