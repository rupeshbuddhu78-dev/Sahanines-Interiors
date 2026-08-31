import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'

export default function GypsumFalseCeilingGuwahati() {
  const title = 'Gypsum False Ceiling in Guwahati | Installation & Design | Sahanines Interiors'
  const description = 'Gypsum false ceiling installation in Guwahati by Sahanines Interiors. Smooth finish, fire-resistant, sound insulation. Expert gypsum ceiling contractors. Call 076360 08047.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Gypsum False Ceiling in Guwahati',
        description: 'Gypsum false ceiling installation with smooth finish, fire-resistant materials and integrated lighting for homes and offices in Guwahati, Assam.',
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL, telephone: '076360 08047' },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/gypsum-false-ceiling-guwahati`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Gypsum False Ceiling Guwahati', item: `${SITE_URL}/gypsum-false-ceiling-guwahati` }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/gypsum-false-ceiling-guwahati`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/gypsum-false-ceiling-guwahati`} />
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
            <span>Gypsum False Ceiling in Guwahati</span>
          </div>
          <h1>Gypsum False Ceiling Installation in Guwahati</h1>
          <p>Sahanines Interiors specializes in gypsum false ceiling installation for homes and offices across Guwahati, Assam. Smooth finish, fire-resistant materials, and modern designs with integrated lighting.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2>Gypsum False Ceiling — The Popular Choice for Modern Interiors in Guwahati</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Gypsum false ceilings are the most widely used ceiling solution for modern homes and offices in Guwahati. Gypsum boards are made from naturally occurring calcium sulphate dihydrate, processed into lightweight panels that are easy to install and deliver a clean, smooth finish.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              At Sahanines Interiors, we install gypsum ceilings for living rooms, bedrooms, drawing rooms, office cabins, conference rooms and commercial spaces across Guwahati. Our installations include precise joint finishing, custom cutouts for lights and fans, and optional cove lighting for a premium look.
            </p>

            <h2>Advantages of Gypsum False Ceilings</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20 }}>
              <li><strong>Smooth and clean finish:</strong> Gypsum boards provide a seamless surface ideal for modern interiors</li>
              <li><strong>Fire-resistant:</strong> Gypsum is naturally fire-resistant, adding a layer of safety to your space</li>
              <li><strong>Sound insulation:</strong> Reduces noise transmission between rooms and from above</li>
              <li><strong>Thermal insulation:</strong> Helps maintain comfortable room temperature, reducing AC costs</li>
              <li><strong>Quick installation:</strong> Standard board sizes allow for fast, clean installation</li>
              <li><strong>Customizable:</strong> Can be cut to accommodate lights, fans, AC vents and speakers</li>
              <li><strong>Moisture-resistant options:</strong> Available in moisture-resistant variants for humid areas</li>
            </ul>

            <h2>Gypsum Ceiling Designs We Offer</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 16 }}>
              We offer a range of gypsum ceiling designs suitable for different rooms and styles:
            </p>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
              <li>Single-layer flat ceiling with recessed lights</li>
              <li>Multi-layered designer ceiling with cove lighting</li>
              <li>Peripheral ceiling with central light fixture</li>
              <li>Geometric patterns with LED strip lighting</li>
              <li>Bedroom ceilings with fan cutouts and ambient lighting</li>
              <li>Office ceilings with acoustic panels and grid systems</li>
            </ul>

            <h2>Where We Install Gypsum Ceilings in Guwahati</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              Sahanines Interiors installs gypsum false ceilings across Guwahati, Assam for residential and commercial clients. Our gypsum ceiling service covers independent houses, apartments, villas, office buildings, showrooms and retail spaces throughout the city.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <Link to="/false-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>False Ceiling Service</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>View all ceiling types →</span>
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
          <h2>Want a Gypsum False Ceiling for Your Space?</h2>
          <p>Contact Sahanines Interiors for a free consultation and quotation for gypsum ceiling installation in Guwahati.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href="tel:07636008047" className="btn btn-outline btn-lg">Call 076360 08047</a>
          </div>
        </div>
      </section>
    </>
  )
}
