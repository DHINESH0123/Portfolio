import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, Briefcase, Award, Code2,
  GraduationCap, User, LogOut, ChevronLeft, ChevronRight, Menu, BarChart2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminLayout.css'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/internships', icon: Briefcase, label: 'Experience' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/skills', icon: Code2, label: 'Skills' },
  { to: '/admin/education', icon: GraduationCap, label: 'Education' },
  { to: '/admin/statistics', icon: BarChart2, label: 'Statistics' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/adminlogin')
  }

  return (
    <div className={`admin-layout${collapsed ? ' admin-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar${mobileOpen ? ' admin-sidebar--mobile-open' : ''}`} role="navigation" aria-label="Admin navigation">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__initials">DS</span>
            {!collapsed && <span className="admin-sidebar__title">Admin CMS</span>}
          </div>
          <button
            className="admin-sidebar__collapse"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
              }
              title={collapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          {!collapsed && (
            <p className="admin-sidebar__user" title={user?.email}>
              {user?.email}
            </p>
          )}
          <button
            className="admin-sidebar__logout"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar__preview">
            View Public Site ↗
          </a>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
