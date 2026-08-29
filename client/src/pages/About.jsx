import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'

export default function About() {
  const { settings } = useSite()

  const title = 'About Sahanines Interiors | False Ceiling & Interior Experts in Guwahati'
  const description = 'Learn about Sahanines Interiors — professional false ceiling and interior design service providers based in Jyotikuchi, Guwahati, Assam. Quality materials, modern designs, and customer-focused service.'
  const ogImage = settings?.seo?.ogImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <section className="page-header about-page-header">
        <div className="about-header-bg" style={{ backgroundImage: `url(${settings?.about?.headerImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'})` }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="breadcrumbs">
            <Link to="/">Home</Link><span>/</span>
            <span>About</span>
          </div>
          <h1>About Sahanines Interiors</h1>
          <p>False Ceiling & Interior Specialists in Guwahati, Assam</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src={settings?.about?.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'} alt="Sahanines Interiors team at work in Guwahati" width="800" height="600" loading="lazy" />
            </div>
            <div className="about-content">
              <span className="label">Who We Are</span>
              <h2>Sahanines Interiors — False Ceiling & Interior Specialists in Guwahati</h2>
              <p>Sahanines Interiors provides professional false ceiling and interior solutions in Guwahati, Assam, with a focus on modern designs, quality materials, clean finishing and customer satisfaction.</p>
              <p>We are based at House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, and serve clients across the city and nearby areas. Our work spans residential homes, commercial offices, retail spaces, and more.</p>
              <p>Every project we undertake reflects our commitment to quality craftsmanship and attention to detail. From the initial consultation to the final finishing, we ensure a smooth and professional experience.</p>
              <div className="about-features">
                <div className="about-feature"><span className="icon">✓</span> Guwahati Based</div>
                <div className="about-feature"><span className="icon">✓</span> Residential & Commercial</div>
                <div className="about-feature"><span className="icon">✓</span> Modern Designs</div>
                <div className="about-feature"><span className="icon">✓</span> Quality Materials</div>
                <div className="about-feature"><span className="icon">✓</span> Professional Team</div>
                <div className="about-feature"><span className="icon">✓</span> Clean Finishing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="label">Our Service Area</span>
            <h2>Serving Guwahati & Nearby Areas</h2>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.05rem', marginBottom: 24 }}>We provide false ceiling and interior services across Guwahati, including Jyotikuchi, Shantipur, GS Road, Dispur, Khanapara, Christianbasti, Fancy Bazar, Aminjari, and surrounding localities.</p>
            <Link to="/contact" className="btn btn-primary">Discuss Your Project</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="label">Explore More</span>
            <h2>Our Services & Work</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-outline-dark">View Services</Link>
            <Link to="/projects" className="btn btn-outline-dark">View Projects</Link>
            <Link to="/gallery" className="btn btn-outline-dark">Browse Gallery</Link>
            <Link to="/reviews" className="btn btn-outline-dark">Read Reviews</Link>
          </div>
        </div>
      </section>
    </>
  )
}
