import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [relatedServices, setRelatedServices] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    axios.get(`/api/services/${slug}`).then(res => {
      if (res.data.success) setService(res.data.service)
    }).catch(console.error)
    axios.get('/api/services').then(res => {
      if (res.data.success) setRelatedServices(res.data.services.filter(s => s.slug !== slug).slice(0, 3))
    }).catch(console.error)
  }, [slug])

  if (!service) return <div className="loading"><div className="spinner"></div></div>

  const title = service.seoTitle || `${service.name} in Guwahati | Sahanines Interiors`
  const description = service.seoDescription || service.shortDescription
  const ogImage = service.image || 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.name,
        description: service.shortDescription,
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/services/${slug}`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}/services/${slug}` }
        ]
      }
    ]
  }

  // Add FAQ schema if service has FAQs
  if (service.faqs && service.faqs.length > 0) {
    jsonLd['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: service.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    })
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/services/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/services/${slug}`} />
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
            <Link to="/services">Services</Link><span>/</span>
            <span>{service.name}</span>
          </div>
          <h1>{service.name}</h1>
          <p>{service.shortDescription}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-content">
              {service.image && (
                <img src={service.image} alt={service.altText || service.name} style={{ width: '100%', borderRadius: 12, marginBottom: 32 }} width="800" height="500" loading="lazy" />
              )}
              <h2>About This Service</h2>
              <p>{service.description}</p>

              {service.applications && service.applications.length > 0 && (
                <>
                  <h2>Suitable Applications</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {service.applications.map((app, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                        <span style={{ color: 'var(--secondary)' }}>✓</span> {app}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {service.faqs && service.faqs.length > 0 && (
                <>
                  <h2 style={{ marginTop: 40 }}>Frequently Asked Questions</h2>
                  <div className="faq-list">
                    {service.faqs.map((faq, i) => (
                      <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                          {faq.question}
                          <span className="icon">+</span>
                        </button>
                        <div className="faq-answer"><p>{faq.answer}</p></div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="service-detail-sidebar">
              <h3>Key Benefits</h3>
              <ul className="benefit-list">
                {service.benefits?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div style={{ marginTop: 24 }}>
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get a Quote</Link>
              </div>
              <div style={{ marginTop: 12 }}>
                <a href={`tel:07636008047`} className="btn btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>Call Now</a>
              </div>

              {relatedServices.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <h3>Related Services</h3>
                  {relatedServices.map(s => (
                    <Link key={s._id} to={`/services/${s.slug}`} style={{ display: 'block', padding: '8px 0', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                      {s.name} →
                    </Link>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <h3>Explore More</h3>
                <Link to="/projects" style={{ display: 'block', padding: '8px 0', color: 'var(--secondary)', fontSize: '0.9rem' }}>View Our Projects →</Link>
                <Link to="/gallery" style={{ display: 'block', padding: '8px 0', color: 'var(--secondary)', fontSize: '0.9rem' }}>Browse Gallery →</Link>
                <Link to="/reviews" style={{ display: 'block', padding: '8px 0', color: 'var(--secondary)', fontSize: '0.9rem' }}>Read Client Reviews →</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Interested in {service.name}?</h2>
          <p>Contact us today for a free consultation and quotation.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Start Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
