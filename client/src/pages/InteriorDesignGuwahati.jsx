import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'

export default function InteriorDesignGuwahati() {
  const title = 'Interior Design Service in Guwahati | Home & Office Interiors | Sahanines Interiors'
  const description = 'Interior design service in Guwahati by Sahanines Interiors. Complete home and office interior solutions including ceiling design, lighting and finishing. Call 076360 08047.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Interior Design Service in Guwahati',
        description: 'Complete interior design and ceiling decoration services for residential and commercial spaces in Guwahati, Assam. Includes ceiling design, lighting, colour consultation and finishing.',
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL, telephone: '076360 08047' },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/interior-design-guwahati`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Interior Design Guwahati', item: `${SITE_URL}/interior-design-guwahati` }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What interior design services do you offer in Guwahati?',
            acceptedAnswer: { '@type': 'Answer', text: 'Sahanines Interiors offers complete interior design services in Guwahati including false ceiling design and installation, ceiling lighting, wall treatments, colour consultation, space planning, woodwork, and complete finishing for homes and offices.' }
          },
          {
            '@type': 'Question',
            name: 'How much does interior design cost in Guwahati?',
            acceptedAnswer: { '@type': 'Answer', text: 'Interior design cost in Guwahati varies based on scope, materials and room size. We provide free consultations and transparent quotations. Contact Sahanines Interiors to discuss your specific requirements and budget.' }
          },
          {
            '@type': 'Question',
            name: 'Do you do both residential and commercial interior design?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, Sahanines Interiors handles both residential and commercial interior design in Guwahati. We design homes, apartments, offices, shops, restaurants, hotels and commercial buildings.' }
          }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/interior-design-guwahati`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/interior-design-guwahati`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link><span>/</span>
            <span>Interior Design Service in Guwahati</span>
          </div>
          <h1>Interior Design Service in Guwahati</h1>
          <p>Sahanines Interiors provides complete interior design solutions for homes, apartments and offices across Guwahati, Assam — from ceiling design and lighting to colour consultation and finishing.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2>Complete Interior Design Solutions in Guwahati</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              A well-designed interior transforms how you experience your space. Sahanines Interiors offers professional interior design services in Guwahati, combining aesthetics with functionality to create spaces that are beautiful, comfortable and practical.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Our interior design approach considers room proportions, furniture layout, lighting needs, colour scheme, ceiling design and your personal preferences. Whether you are building a new home, renovating an apartment, or setting up an office, we provide end-to-end interior solutions.
            </p>

            <h2>Our Interior Design Services Include</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20 }}>
              <li><strong>False ceiling design and installation:</strong> Gypsum, POP and PVC ceilings with integrated lighting</li>
              <li><strong>Ceiling lighting design:</strong> LED strips, cove lighting, recessed lights and pendant fixtures</li>
              <li><strong>Wall treatment:</strong> Texture painting, wallpaper, POP texturing and decorative elements</li>
              <li><strong>Colour consultation:</strong> Professional advice on colour schemes that suit your space</li>
              <li><strong>Space planning:</strong> Efficient layout design for rooms, offices and commercial spaces</li>
              <li><strong>Woodwork and fixtures:</strong> Custom shelving, cabinets, and decorative woodwork</li>
              <li><strong>Complete finishing:</strong> Painting, polishing, and final touches for a move-ready space</li>
            </ul>

            <h2>Residential Interior Design</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              For homes and apartments in Guwahati, we design interiors that reflect your personality and lifestyle. From the living room ceiling to the bedroom lighting, kitchen finishes to the drawing room decor, we handle every aspect of residential interior design with care and attention to detail.
            </p>

            <h2>Commercial Interior Design</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              For offices, shops, restaurants and commercial spaces in Guwahati, we create professional interiors that impress clients and motivate teams. Our commercial design service covers office cabins, conference rooms, reception areas, retail showrooms and restaurant interiors.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <Link to="/false-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>False Ceiling Service</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>View ceiling options →</span>
              </Link>
              <Link to="/projects" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>Our Projects</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>See our work →</span>
              </Link>
            </div>

            <h2 style={{ marginTop: 40 }}>Frequently Asked Questions</h2>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>What interior design services do you offer in Guwahati?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              Sahanines Interiors offers complete interior design services in Guwahati including false ceiling design and installation, ceiling lighting, wall treatments, colour consultation, space planning, woodwork, and complete finishing for homes and offices.
            </p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>How much does interior design cost in Guwahati?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              Interior design cost in Guwahati varies based on scope, materials and room size. We provide free consultations and transparent quotations. Contact Sahanines Interiors to discuss your specific requirements and budget.
            </p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>Do you do both residential and commercial interior design?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              Yes, Sahanines Interiors handles both residential and commercial interior design in Guwahati. We design homes, apartments, offices, shops, restaurants, hotels and commercial buildings.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Plan Your Interior Project in Guwahati</h2>
          <p>Contact Sahanines Interiors for a free consultation about your interior design requirements.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href="tel:07636008047" className="btn btn-outline btn-lg">Call 076360 08047</a>
          </div>
        </div>
      </section>
    </>
  )
}
