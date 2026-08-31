import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'

export default function PvcCeilingGuwahati() {
  const title = 'PVC Ceiling Installation in Guwahati | Waterproof PVC Panels | Sahanines Interiors'
  const description = 'PVC false ceiling installation in Guwahati. Waterproof, termite-proof, low maintenance PVC panels for bathrooms, kitchens and offices. Call 076360 08047.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'PVC Ceiling Installation in Guwahati',
        description: 'Waterproof PVC ceiling panel installation for bathrooms, kitchens, offices and commercial spaces in Guwahati, Assam. Low maintenance, termite-proof, available in many finishes.',
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL, telephone: '076360 08047' },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/pvc-ceiling-guwahati`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'PVC Ceiling Guwahati', item: `${SITE_URL}/pvc-ceiling-guwahati` }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/pvc-ceiling-guwahati`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/pvc-ceiling-guwahati`} />
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
            <span>PVC Ceiling Installation in Guwahati</span>
          </div>
          <h1>PVC False Ceiling Services in Guwahati</h1>
          <p>Sahanines Interiors installs durable, waterproof PVC ceiling panels for bathrooms, kitchens, offices and commercial spaces across Guwahati, Assam. Low maintenance and available in many finishes.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2>PVC Ceiling — Practical, Durable and Low Maintenance</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              PVC (Polyvinyl Chloride) ceiling panels are a practical and cost-effective ceiling solution for spaces that require moisture resistance and easy maintenance. PVC panels are lightweight, waterproof, termite-proof, and available in a wide variety of colours, textures and finishes.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Sahanines Interiors provides PVC ceiling installation across Guwahati for bathrooms, kitchens, balconies, offices, shops and commercial buildings. PVC ceilings are especially popular in areas where moisture, humidity or water exposure makes gypsum or POP less suitable.
            </p>

            <h2>Advantages of PVC Ceiling Panels</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20 }}>
              <li><strong>Waterproof and moisture-resistant:</strong> Ideal for bathrooms, kitchens and humid areas</li>
              <li><strong>Termite-proof:</strong> Unlike wood-based materials, PVC is not affected by termites</li>
              <li><strong>Low maintenance:</strong> No painting needed — just wipe clean with a damp cloth</li>
              <li><strong>Lightweight:</strong> Easy and quick to install, reducing labour costs</li>
              <li><strong>Multiple finishes:</strong> Available in plain matte, glossy, wood grain, marble and textured options</li>
              <li><strong>Cost-effective:</strong> Affordable material and installation compared to other ceiling types</li>
              <li><strong>Long-lasting:</strong> Resistant to fading, cracking and warping</li>
            </ul>

            <h2>Where PVC Ceilings Work Best</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
              <li>Bathrooms and shower areas</li>
              <li>Kitchens and pantry areas</li>
              <li>Balconies and covered outdoor areas</li>
              <li>Office cabins and workstations</li>
              <li>Retail shops and showrooms</li>
              <li>Commercial spaces and warehouses</li>
            </ul>

            <h2>PVC Ceiling Installation by Sahanines Interiors</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              Our PVC ceiling installation process includes measuring your space, preparing the framework (typically aluminium or mild steel grids), cutting panels to size, fixing them securely, and finishing edges and corners for a clean look. We ensure proper alignment, tight joints and a neat appearance.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <Link to="/gypsum-false-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>Gypsum Ceiling</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Explore gypsum options →</span>
              </Link>
              <Link to="/pop-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>POP Ceiling</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Explore POP designs →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Need PVC Ceiling Installation in Guwahati?</h2>
          <p>Contact Sahanines Interiors for a free consultation and quotation for PVC ceiling panels.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href="tel:07636008047" className="btn btn-outline btn-lg">Call 076360 08047</a>
          </div>
        </div>
      </section>
    </>
  )
}
