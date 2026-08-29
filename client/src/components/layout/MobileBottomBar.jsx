import { useSite } from '../../context/SiteContext'
import { Link } from 'react-router-dom'

export default function MobileBottomBar() {
  const { settings } = useSite()
  const phone = settings?.phone || '076360 08047'
  const whatsapp = settings?.whatsapp || '917636008047'

  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bottom-bar-inner">
        <a href={`tel:${phone}`} className="call-btn" aria-label="Call us">
          Call
        </a>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello Sahanines Interiors, I would like to enquire about false ceiling/interior work in Guwahati.')}`} className="wa-btn" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us">
          WhatsApp
        </a>
        <Link to="/contact" className="quote-btn">
          Get Quote
        </Link>
      </div>
    </div>
  )
}
