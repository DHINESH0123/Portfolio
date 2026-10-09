import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import AdminGuard from './components/Admin/AdminGuard.jsx'
import AdminLayout from './components/Admin/AdminLayout.jsx'
import './App.css'

// Public pages
import HomePage from './pages/HomePage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

// Admin pages (lazy loaded — keeps public bundle small)
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'))
const AdminInternships = lazy(() => import('./pages/admin/AdminInternships.jsx'))
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates.jsx'))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills.jsx'))
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation.jsx'))
const AdminStatistics = lazy(() => import('./pages/admin/AdminStatistics.jsx'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'))

function AdminFallback() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)'
    }}>
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public routes ── */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />

        {/* ── Admin login ── */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* ── Protected admin routes ── */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminOverview />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProjects />
              </Suspense>
            }
          />
          <Route
            path="internships"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminInternships />
              </Suspense>
            }
          />
          <Route
            path="certificates"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminCertificates />
              </Suspense>
            }
          />
          <Route
            path="skills"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminSkills />
              </Suspense>
            }
          />
          <Route
            path="education"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminEducation />
              </Suspense>
            }
          />
          <Route
            path="statistics"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminStatistics />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProfile />
              </Suspense>
            }
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '1rem',
              fontFamily: 'var(--font-body)', color: 'var(--color-navy)',
              background: 'var(--color-ivory)'
            }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700 }}>404</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>Page not found.</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
