import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function Services() {
  const { settings } = useSite()
  const [services, setServices] = useState([])

  useEffect(() => {
    axios.get('/api/services').then(res => {
      if (res.data.success) setServices(res.data.services)
    }).catch(console.error)
  }, [])

  const title = 'False Ceiling Services in Guwahati | Sahanines Interiors'
  const description = 'Explore our false ceiling and interior services in Guwahati — gypsum, POP, PVC ceiling, ceiling lighting, residential and commercial solutions by Sahanines Interiors.'
  const ogImage = settings?.seo?.ogImage || ''

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` }
    ]
  }

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/services/${s.slug}`
    }))
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/services`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        {services.length > 0 && <script type="application/ld+json">{JSON.stringify(servicesJsonLd)}</script>}
      </Helmet>

      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link><span>/</span>
            <span>Services</span>
          </div>
          <h1>False Ceiling & Interior Services in Guwahati</h1>
          <p>Comprehensive false ceiling and interior design solutions for residential and commercial spaces across Guwahati, Assam</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <div className="service-card-image">
                  {service.image && <img src={service.image} alt={service.altText || service.name} width="600" height="375" loading="lazy" />}
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p>{service.shortDescription}</p>
                  <Link to={`/services/${service.slug}`} className="service-card-link">View Details →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="label">Why Choose Our Services</span>
            <h2>Professional Ceiling & Interior Solutions in Guwahati</h2>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Sahanines Interiors offers a complete range of false ceiling and interior design services in Guwahati, Assam. Whether you need a modern gypsum false ceiling for your living room, a decorative POP ceiling for your bedroom, or a durable PVC ceiling for your office, our team delivers quality craftsmanship with attention to every detail.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Our services include everything from design consultation to material selection, installation, and finishing. We integrate LED lighting, cove lighting, and recessed lights into ceiling designs to create stunning visual effects. We serve both residential and commercial clients across Guwahati.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
              {['Modern Designs', 'Quality Materials', 'LED Integration', 'Timely Delivery', 'Free Consultation', 'Guwahati Based'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Need a Custom Solution?</h2>
          <p>Every space is unique. Contact us to discuss your specific requirements and get a tailored quotation.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Discuss Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
