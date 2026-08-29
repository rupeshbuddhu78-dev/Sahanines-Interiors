import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function About() {
  const { settings } = useSite()
  return (
    <>
      <Helmet>
        <title>About Us | Sahanines Interiors - False Ceiling & Interior Specialists in Guwahati</title>
        <meta name="description" content="Learn about Sahanines Interiors, professional false ceiling and interior design service providers in Guwahati, Assam. Quality materials, modern designs, and customer-focused service." />
        <link rel="canonical" href={`${window.location.origin}/about`} />
      </Helmet>

      <section className="page-header">
        <div className="container">
          <h1>About Sahanines Interiors</h1>
          <p>False Ceiling & Interior Specialists in Guwahati, Assam</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" alt="Sahanines Interiors team at work in Guwahati" width="800" height="600" loading="lazy" />
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
    </>
  )
}
