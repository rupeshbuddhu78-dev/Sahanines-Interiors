import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const phone = settings?.phone || '076360 08047'
  const whatsapp = settings?.whatsapp || '917636008047'
  const address = settings?.address?.full || 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009'

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              {settings?.businessName || 'Sahanines'} <span>Interiors</span>
            </div>
            <p>{settings?.footer?.description || 'Professional false ceiling and interior solutions in Guwahati, Assam.'}</p>
            <div className="footer-social">
              {settings?.social?.facebook && <a href={settings.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>}
              {settings?.social?.instagram && <a href={settings.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">in</a>}
              {settings?.social?.youtube && <a href={settings.social.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer">yt</a>}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/services/false-ceiling">False Ceiling</Link>
            <Link to="/services/gypsum-false-ceiling">Gypsum Ceiling</Link>
            <Link to="/services/pop-false-ceiling">POP Ceiling</Link>
            <Link to="/services/ceiling-lighting">Ceiling Lighting</Link>
            <Link to="/services/residential-false-ceiling">Residential</Link>
            <Link to="/services/commercial-false-ceiling">Commercial</Link>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <p style={{ marginBottom: 12 }}>{address}</p>
            <a href={`tel:${phone}`} style={{ display: 'block', marginBottom: 8 }}>Phone: {phone}</a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            {settings?.googleBusinessUrl && (
              <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8, display: 'inline-block' }}>
                View us on Google
              </a>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{settings?.footer?.copyright || `© ${new Date().getFullYear()} Sahanines Interiors. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}
