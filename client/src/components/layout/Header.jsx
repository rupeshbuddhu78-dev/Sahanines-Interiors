import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { settings } = useSite()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <Link to="/" className="logo">
              <span style={{ color: '#c9a96e', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>Interiors</span>
            </Link>

            <nav className="nav-links" aria-label="Main navigation">
              {links.map(link => (
                <Link key={link.to} to={link.to} className={isActive(link.to) ? 'active' : ''}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="header-cta">
              <Link to="/contact" className="btn btn-primary btn-sm">Get Free Quote</Link>
              <a href={`tel:${settings?.phone || '07636008047'}`} className="btn btn-outline-dark btn-sm">Call Now</a>
            </div>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map(link => (
          <Link key={link.to} to={link.to} className={isActive(link.to) ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
        <div className="mobile-cta">
          <Link to="/contact" className="btn btn-primary">Get Free Quote</Link>
          <a href={`tel:${settings?.phone || '07636008047'}`} className="btn btn-outline-dark">Call Now</a>
        </div>
      </div>
    </>
  )
}
