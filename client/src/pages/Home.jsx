import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'
import axios from 'axios'
import Counter from '../components/common/Counter'

export default function Home() {
  const { settings } = useSite()
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, projRes, testRes] = await Promise.all([
          axios.get('/api/services'),
          axios.get('/api/projects'),
          axios.get('/api/testimonials')
        ])
        if (servRes.data.success) setServices(servRes.data.services)
        if (projRes.data.success) setProjects(projRes.data.projects.slice(0, 6))
        if (testRes.data.success) setTestimonials(testRes.data.testimonials.slice(0, 3))
      } catch (err) { console.error(err) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [services, projects, testimonials])

  const heroImage = settings?.hero?.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'

  const title = 'Sahanines Interiors | False Ceiling & Interior Design in Guwahati, Assam'
  const description = 'Sahanines Interiors provides professional false ceiling, gypsum ceiling, POP ceiling, ceiling lighting and interior design solutions in Guwahati, Assam. Contact us for a free quote.'
  const ogImage = settings?.seo?.ogImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: 'Sahanines Interiors',
        telephone: settings?.phone || '076360 08047',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi',
          addressLocality: 'Guwahati',
          addressRegion: 'Assam',
          postalCode: '781009',
          addressCountry: 'IN'
        },
        url: SITE_URL,
        areaServed: { '@type': 'City', name: 'Guwahati' },
        description: 'Professional false ceiling and interior design services in Guwahati, Assam.',
        priceRange: '$$'
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Sahanines Interiors',
        publisher: { '@id': `${SITE_URL}/#business` }
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/`} />
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

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }} role="img" aria-label="Premium false ceiling interior"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>{settings?.hero?.heading || 'Premium False Ceiling & Interior Solutions in Guwahati'}</h1>
            <p>{settings?.hero?.subtitle || 'Modern false ceiling designs, gypsum and POP ceiling work, lighting solutions and professional interior finishing by Sahanines Interiors.'}</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary btn-lg">{settings?.hero?.ctaPrimary || 'Get Free Quote'}</Link>
              <Link to="/projects" className="btn btn-outline btn-lg">{settings?.hero?.ctaSecondary || 'View Our Projects'}</Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <span className="stars">★★★★★</span> {settings?.googleRating || 5.0} Google Rating
              </div>
              <div className="hero-trust-item">
                {settings?.googleReviewsCount || 318}+ Customer Reviews
              </div>
              <div className="hero-trust-item">Professional Work</div>
              <div className="hero-trust-item">Quality Finishing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar-inner">
            <div className="trust-bar-item">
              <Counter end={settings?.googleRating || 5.0} decimals={1} duration={1500} />
              <div className="label">Google Rating</div>
            </div>
            <div className="trust-bar-item">
              <Counter end={settings?.googleReviewsCount || 318} duration={2000} suffix="+" />
              <div className="label">Happy Customers</div>
            </div>
            <div className="trust-bar-item">
              <Counter end={services.length} duration={1500} />
              <div className="label">Services Offered</div>
            </div>
            <div className="trust-bar-item">
              <Counter end={projects.length} duration={1800} suffix="+" />
              <div className="label">Projects Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid fade-up">
            <div className="about-image">
              <img src={settings?.about?.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'} alt="Sahanines Interiors - False Ceiling & Interior Specialists in Guwahati" width="800" height="600" loading="lazy" />
            </div>
            <div className="about-content">
              <span className="label">About Us</span>
              <h2>Sahanines Interiors — False Ceiling & Interior Specialists in Guwahati</h2>
              <p>Sahanines Interiors provides professional false ceiling and interior solutions in Guwahati, Assam, with a focus on modern designs, quality materials, clean finishing and customer satisfaction.</p>
              <p>Based in Jyotikuchi, we serve residential and commercial clients across Guwahati including Shantipur, Ashram Road, and nearby areas. Our team is committed to delivering ceiling and interior work that meets the highest standards of craftsmanship.</p>
              <div className="about-features">
                <div className="about-feature"><span className="icon">✓</span> Modern Designs</div>
                <div className="about-feature"><span className="icon">✓</span> Quality Materials</div>
                <div className="about-feature"><span className="icon">✓</span> Clean Finishing</div>
                <div className="about-feature"><span className="icon">✓</span> Timely Delivery</div>
              </div>
              <Link to="/about" className="btn btn-outline-dark" style={{ marginTop: 28 }}>Learn More About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-alt" id="services">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Our Services</span>
            <h2>Professional Ceiling & Interior Solutions</h2>
            <p>From modern false ceilings to integrated lighting, we offer comprehensive interior solutions tailored to your space.</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div key={service._id} className="service-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="service-card-image">
                  <img src={service.image || 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=600&q=80'} alt={service.altText || service.name} width="600" height="375" loading="lazy" />
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p>{service.shortDescription}</p>
                  <Link to={`/services/${service.slug}`} className="service-card-link">View Details →</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/services" className="btn btn-outline-dark">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Why Choose Us</span>
            <h2>The Sahanines Difference</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '✦', title: 'Modern Ceiling Designs', desc: 'Contemporary designs that complement your interior style' },
              { icon: '✦', title: 'Quality Materials', desc: 'We use only premium, verified materials for every project' },
              { icon: '✦', title: 'Clean Finishing', desc: 'Attention to detail in every edge, joint and surface' },
              { icon: '✦', title: 'Professional Installation', desc: 'Skilled craftsmen with proven expertise in ceiling work' },
              { icon: '✦', title: 'Lighting Integration', desc: 'Seamless LED and lighting solutions built into ceilings' },
              { icon: '✦', title: 'Residential & Commercial', desc: 'Serving homes, offices, shops and commercial spaces' },
              { icon: '✦', title: 'Transparent Process', desc: 'Clear communication and honest project assessment' },
              { icon: '✦', title: 'Customer-Focused', desc: 'Your satisfaction and vision guide every decision' }
            ].map((item, i) => (
              <div key={i} className="why-card fade-up" style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section bg-alt" id="projects">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Our Projects</span>
            <h2>Recent Work</h2>
            <p>Browse our portfolio of false ceiling and interior projects across Guwahati.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <div key={project._id} className="project-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="project-card-image">
                  <img src={project.coverImage || 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=600&q=80'} alt={project.altText || project.title} width="600" height="450" loading="lazy" />
                </div>
                <div className="project-card-overlay">
                  <span className="category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/projects" className="btn btn-outline-dark">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Client Reviews</span>
            <h2>What Our Clients Say</h2>
            <p>Rated {settings?.googleRating || 5.0} on Google with {settings?.googleReviewsCount || 318}+ reviews</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={t._id} className="testimonial-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.review}"</p>
                <div className="testimonial-author">— {t.name}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/reviews" className="btn btn-outline-dark">See More Reviews</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container fade-up">
          <h2>Ready to Transform Your Space?</h2>
          <p>Get in touch with us to discuss your false ceiling and interior requirements. We provide free consultations and quotations.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href={`tel:${settings?.phone || '07636008047'}`} className="btn btn-outline btn-lg">Call Now</a>
          </div>
        </div>
      </section>
    </>
  )
}
