import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'

export default function PopCeilingGuwahati() {
  const title = 'POP Ceiling Design in Guwahati | Plaster of Paris Installation | Sahanines Interiors'
  const description = 'Custom POP false ceiling design and installation in Guwahati. Intricate mouldings, curves and decorative patterns. Expert POP ceiling contractors. Call 076360 08047.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'POP False Ceiling in Guwahati',
        description: 'Custom POP (Plaster of Paris) ceiling design and installation with intricate mouldings, curves and decorative patterns for homes and commercial spaces in Guwahati, Assam.',
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL, telephone: '076360 08047' },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/pop-ceiling-guwahati`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'POP Ceiling Guwahati', item: `${SITE_URL}/pop-ceiling-guwahati` }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the cost of POP ceiling in Guwahati?',
            acceptedAnswer: { '@type': 'Answer', text: 'POP ceiling cost in Guwahati ranges from ₹55 to ₹100 per sq ft. Simple designs cost less, while intricate mouldings, curves and multi-level designs cost more. Sahanines Interiors provides free quotations for POP ceiling work.' }
          },
          {
            '@type': 'Question',
            name: 'How long does a POP ceiling last?',
            acceptedAnswer: { '@type': 'Answer', text: 'A well-installed POP ceiling can last 15-20 years or more. POP is durable and maintains its appearance over time. Proper installation by experienced craftsmen ensures longevity.' }
          },
          {
            '@type': 'Question',
            name: 'Can POP ceiling be done in bedrooms?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, POP ceilings are excellent for bedrooms. You can create beautiful designs with cove lighting, peripheral mouldings, and central decorative elements. POP allows complete customization to match your bedroom interior.' }
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
        <link rel="canonical" href={`${SITE_URL}/pop-ceiling-guwahati`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/pop-ceiling-guwahati`} />
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
            <span>POP Ceiling Design in Guwahati</span>
          </div>
          <h1>POP Ceiling Design and Installation in Guwahati</h1>
          <p>Sahanines Interiors crafts custom POP (Plaster of Paris) ceilings with intricate mouldings, curves and decorative patterns for elegant interiors across Guwahati, Assam.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2>Custom POP Ceiling Designs for Your Space in Guwahati</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              POP (Plaster of Paris) ceilings offer unmatched design flexibility. Unlike pre-made boards, POP is applied as a wet paste, allowing our skilled craftsmen to create virtually any shape, curve or texture. This makes POP the preferred choice for elaborate, decorative ceilings that become the focal point of a room.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              Sahanines Interiors has extensive experience in designing and installing POP ceilings for drawing rooms, bedrooms, banquet halls, restaurants and temples across Guwahati. From classic floral motifs to modern geometric patterns, we bring your ceiling vision to life.
            </p>

            <h2>Advantages of POP False Ceilings</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20 }}>
              <li><strong>Intricate custom designs:</strong> Create curves, mouldings, floral patterns and artistic elements</li>
              <li><strong>Seamless monolithic finish:</strong> No visible joints or seams for a clean, continuous surface</li>
              <li><strong>Cost-effective for complex shapes:</strong> More affordable than gypsum for elaborate designs</li>
              <li><strong>Versatile moulding options:</strong> Cornices, medallions, and decorative borders</li>
              <li><strong>Durable and long-lasting:</strong> POP ceilings maintain their appearance for years</li>
              <li><strong>Paintable:</strong> Can be painted in any colour to match your interior theme</li>
            </ul>

            <h2>Popular POP Ceiling Designs in Guwahati</h2>
            <ul style={{ fontSize: '1.02rem', lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
              <li>Central medallion with peripheral moulding for drawing rooms</li>
              <li>Multi-level ceilings with cove lighting for bedrooms</li>
              <li>Geometric patterns with recessed lighting for offices</li>
              <li>Floral and classical motifs for banquet halls and restaurants</li>
              <li>Cornice and border designs for a traditional look</li>
              <li>Custom lighting niches and decorative elements</li>
            </ul>

            <h2>POP Ceiling Installation Process</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              Our POP ceiling installation involves preparing the base surface, fixing the framework, applying multiple layers of POP paste, shaping and moulding by hand, allowing proper drying time, sanding for smoothness, and finally painting and finishing. The entire process requires skilled craftsmanship and patience, which our experienced team delivers consistently.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <Link to="/gypsum-false-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>Gypsum Ceiling</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Explore gypsum options →</span>
              </Link>
              <Link to="/pvc-ceiling-guwahati" style={{ padding: '16px', background: 'var(--bg-alt, #f8f9fa)', borderRadius: 8, textAlign: 'center', color: 'var(--text)', textDecoration: 'none' }}>
                <strong>PVC Ceiling</strong><br />
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>View PVC panels →</span>
              </Link>
            </div>

            <h2 style={{ marginTop: 40 }}>Frequently Asked Questions</h2>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>What is the cost of POP ceiling in Guwahati?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              POP ceiling cost in Guwahati ranges from ₹55 to ₹100 per sq ft. Simple designs cost less, while intricate mouldings, curves and multi-level designs cost more. Sahanines Interiors provides free quotations for POP ceiling work.
            </p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>How long does a POP ceiling last?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              A well-installed POP ceiling can last 15-20 years or more. POP is durable and maintains its appearance over time. Proper installation by experienced craftsmen ensures longevity.
            </p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>Can POP ceiling be done in bedrooms?</h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
              Yes, POP ceilings are excellent for bedrooms. You can create beautiful designs with cove lighting, peripheral mouldings, and central decorative elements. POP allows complete customization to match your bedroom interior.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Want a Custom POP Ceiling Design?</h2>
          <p>Contact Sahanines Interiors to discuss your POP ceiling requirements in Guwahati. Free consultation and quotation.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href="tel:07636008047" className="btn btn-outline btn-lg">Call 076360 08047</a>
          </div>
        </div>
      </section>
    </>
  )
}
