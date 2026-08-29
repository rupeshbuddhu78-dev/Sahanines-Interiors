import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    if (!token) { navigate('/admin/login'); return }
    setAdmin(JSON.parse(user || '{}'))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (!admin) return null

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '◉' },
    { path: '/admin/services', label: 'Services', icon: '◆' },
    { path: '/admin/projects', label: 'Projects', icon: '◈' },
    { path: '/admin/gallery', label: 'Gallery', icon: '▣' },
    { path: '/admin/testimonials', label: 'Reviews', icon: '★' },
    { path: '/admin/faqs', label: 'FAQs', icon: '?' },
    { path: '/admin/enquiries', label: 'Enquiries', icon: '✉' },
    { path: '/admin/seo', label: 'SEO', icon: '◎' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙' },
  ]

  return (
    <div className="admin-layout">
      <Helmet>
        <title>Admin | Sahanines Interiors</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          Sahanines <span>Admin</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <span className="icon">{item.icon}</span> {item.label}
            </Link>
          ))}
          <Link to="/" target="_blank" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 16, paddingTop: 16 }}>
            <span className="icon">↗</span> View Website
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', width: '100%', textAlign: 'left' }}>
            <span className="icon">↩</span> Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
