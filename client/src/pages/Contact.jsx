import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { setStatus({ type: 'error', msg: 'Name and phone are required' }); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/enquiries', form)
      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Thank you! We will contact you soon.' })
        setForm({ name: '', phone: '', email: '', service: '', message: '' })
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' })
    }
    setLoading(false)
  }

  const phone = settings?.phone || '076360 08047'
  const whatsapp = settings?.whatsapp || '917636008047'
  const address = settings?.address?.full || 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009'

  const title = 'Contact Sahanines Interiors | False Ceiling Contractor in Guwahati, Assam'
  const description = 'Contact Sahanines Interiors for false ceiling and interior work in Guwahati. Call 076360 08047 or visit us at Jyotikuchi, Guwahati, Assam. Free consultation and quotation.'
  const ogImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'Sahanines Interiors',
        telephone: phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi',
          addressLocality: 'Guwahati',
          addressRegion: 'Assam',
          postalCode: '781009',
          addressCountry: 'IN'
        },
        url: SITE_URL,
        areaServed: { '@type': 'City', name: 'Guwahati' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link><span>/</span>
            <span>Contact</span>
          </div>
          <h1>Contact Us</h1>
          <p>Get in touch for a free consultation and quotation</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2 style={{ marginBottom: 24 }}>Get In Touch</h2>
              <div className="contact-info-item">
                <div className="icon">📍</div>
                <div>
                  <h4>Our Address</h4>
                  <p>{address}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p><a href={`tel:${phone}`} style={{ color: 'var(--secondary)' }}>{phone}</a></p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon">💬</div>
                <div>
                  <h4>WhatsApp</h4>
                  <p><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)' }}>Chat on WhatsApp</a></p>
                </div>
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={`tel:${phone}`} className="btn btn-primary">Call Now</a>
                <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello Sahanines Interiors, I would like to enquire about false ceiling/interior work in Guwahati.')}`} className="btn btn-outline-dark" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>

              <div className="map-container" style={{ marginTop: 32 }}>
                <iframe
                  src={settings?.googleMapsEmbed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.234!2d91.7503!3d26.1445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5d4c8fbbbbbb%3A0x4c3c3c3c3c3c3c3c!2sJyotikuchi%2C%20Guwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'}
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sahanines Interiors location on Google Maps"
                ></iframe>
              </div>
            </div>

            <div className="contact-form">
              <h3 style={{ marginBottom: 20 }}>Request a Free Quote</h3>
              {status && <div className={`toast toast-${status.type}`} style={{ position: 'static', marginBottom: 16 }}>{status.msg}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input type="tel" id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required placeholder="Your phone number" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Your email (optional)" />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service</label>
                  <select id="service" value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                    <option value="">Select a service</option>
                    <option value="False Ceiling">False Ceiling</option>
                    <option value="Gypsum False Ceiling">Gypsum False Ceiling</option>
                    <option value="POP False Ceiling">POP False Ceiling</option>
                    <option value="Ceiling Lighting">Ceiling Lighting</option>
                    <option value="Interior Ceiling Design">Interior Ceiling Design</option>
                    <option value="Residential False Ceiling">Residential False Ceiling</option>
                    <option value="Commercial False Ceiling">Commercial False Ceiling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Request a Free Quote'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
