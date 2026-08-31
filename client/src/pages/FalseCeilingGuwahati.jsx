import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'

export default function FalseCeilingGuwahati() {
  const title = 'False Ceiling Contractor in Guwahati | Installation & Design | Sahanines Interiors'
  const description = 'Professional false ceiling contractor in Guwahati. Sahanines Interiors installs gypsum, POP and PVC ceilings for homes and offices. Free consultation. Call 076360 08047.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'False Ceiling Installation in Guwahati',
        description: 'Professional false ceiling installation service for residential and commercial spaces in Guwahati, Assam. Includes gypsum, POP and PVC ceiling solutions with integrated lighting.',
        provider: { '@type': 'LocalBusiness', name: 'Sahanines Interiors', url: SITE_URL, telephone: '076360 08047' },
        areaServed: { '@type': 'City', name: 'Guwahati' },
        url: `${SITE_URL}/false-ceiling-guwahati`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'False Ceiling Contractor in Guwahati', item: `${SITE_URL}/false-ceiling-guwahati` }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/false-ceiling-guwahati`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/false-ceiling-guwahati`} />
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
            <span>False Ceiling Contractor in Guwahati</span>
          </div>
          <h1>False Ceiling Contractor in Guwahati</h1>
          <p>Sahanines Interiors provides professional false ceiling installation and design services for homes, offices and commercial spaces across Guwahati, Assam.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2>Professional False Ceiling Service in Guwahati</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              A well-designed false ceiling transforms the look and feel of any room. Sahanines Interiors is a trusted false ceiling contractor in Guwahati, Assam, with experience installing ceilings in residential homes, apartments, offices, retail shops and commercial buildings throughout the city.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 20 }}>
              We work with all major ceiling materials including gypsum boards, Plaster of Paris (POP), and PVC panels. Each material has its own advantages in terms of design flexibility, durability, moisture resistance and cost. Our team helps you select the right material and design based on your room, budget and style preferences.
            </p>

            <h2>Types of False Ceilings We Install</h2>
            <h3>Gypsum Board Ceilings</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 16 }}>
              Gypsum boards are lightweight, fire-resistant, and deliver a smooth, clean finish. They are the most popular choice for living rooms, bedrooms and office cabins in Guwahati. Gypsum ceilings provide good thermal and sound insulation and can be customized with cutouts for lights and AC vents.
            </p>
            <Link to="/gypsum-false-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 24 }}>Read more about gypsum false ceilings →</Link>

            <h3>POP (Plaster of Paris) Ceilings</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 16 }}>
              POP ceilings allow for the most creative and intricate designs including curves, mouldings, and decorative patterns. POP is applied as a paste, giving our craftsmen flexibility to create custom shapes. Ideal for drawing rooms, banquet halls and spaces where you want a statement ceiling.
            </p>
            <Link to="/pop-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 24 }}>Explore POP ceiling designs →</Link>

            <h3>PVC Panel Ceilings</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 16 }}>
              PVC ceiling panels are waterproof, termite-proof, and require no painting. They come in many finishes including wood grain and marble textures. PVC ceilings are ideal for bathrooms, kitchens, balconies and commercial spaces where moisture resistance is important.
            </p>
            <Link to="/pvc-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 24 }}>View PVC ceiling options →</Link>

            <h2>Our False Ceiling Installation Process</h2>
            <ol style={{ fontSize: '1.02rem', lineHeight: 1.8, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Consultation:</strong> We visit your space in Guwahati, understand your requirements and take measurements.</li>
              <li style={{ marginBottom: 8 }}><strong>Design & Material Selection:</strong> We suggest ceiling designs and help you choose the right material — gypsum, POP or PVC.</li>
              <li style={{ marginBottom: 8 }}><strong>Quotation:</strong> We provide a transparent quotation with no hidden costs.</li>
              <li style={{ marginBottom: 8 }}><strong>Installation:</strong> Our skilled craftsmen install the ceiling with attention to every detail.</li>
              <li style={{ marginBottom: 8 }}><strong>Finishing & Handover:</strong> We complete all finishing work including painting, lighting integration and cleanup.</li>
            </ol>

            <h2>Areas We Serve in Guwahati</h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              We provide false ceiling installation services across Guwahati, Assam, including residential and commercial properties. Our team is equipped to handle projects of all sizes throughout the city.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Need a False Ceiling in Guwahati?</h2>
          <p>Contact Sahanines Interiors for a free consultation and quotation. Call 076360 08047.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href="tel:07636008047" className="btn btn-outline btn-lg">Call Now</a>
          </div>
        </div>
      </section>
    </>
  )
}
