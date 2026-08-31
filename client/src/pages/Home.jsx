import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'
import axios from 'axios'
import Counter from '../components/common/Counter'

// Default Google Reviews - shown if no testimonials in database
const defaultTestimonials = [
  { _id: 'default-1', name: 'MOINA Begum', review: 'Sahanines Interiors is truly a reliable name for professional false ceiling work in Guwahati. Their designs are modern, attractive, and beautifully executed. I really appreciate the quality of materials, neat finishing, and attention to detail.', rating: 5 },
  { _id: 'default-2', name: 'Naman Maloo', review: 'I highly recommend Sahanines Interiors for professional false ceiling and interior design services. Abhisekh Sahani deserves special appreciation for his excellent guidance, professional approach, and commitment to customer satisfaction.', rating: 5 },
  { _id: 'default-3', name: 'Rifa Tamanna', review: 'Sahanines Interiors exceeded my expectations with their false ceiling work. The design suggestions were creative, and the finishing was flawless. They installed a beautiful gypsum false ceiling with perfect lighting arrangements.', rating: 5 }
]

export default function Home() {
  const { settings } = useSite()
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [testimonials, setTestimonials] = useState(defaultTestimonials)

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
        if (testRes.data.success && testRes.data.testimonials.length > 0) {
          setTestimonials(testRes.data.testimonials.slice(0, 3))
        }
      } catch (err) { console.error(err) }
    }
    fetchData()
  }, [])

  // Use a stable observer ref - only create once, never re-create on data change
  const observerRef = useRef(null)
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observerRef.current.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    return () => { if (observerRef.current) observerRef.current.disconnect() }
  }, [])

  useEffect(() => {
    if (!observerRef.current) return
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
      observerRef.current.observe(el)
    })
  }, [services, projects, testimonials])

  const heroImage = settings?.hero?.image || ''

  const title = 'Best False Ceiling Service in Guwahati | Gypsum, POP & PVC Ceiling | Sahanines Interiors'
  const description = 'Looking for the best false ceiling service in Guwahati? Sahanines Interiors provides gypsum, POP and PVC ceiling installation and interior solutions.'
  const ogImage = settings?.seo?.ogImage || ''

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
        areaServed: [
          { '@type': 'City', name: 'Guwahati' },
          { '@type': 'AdministrativeArea', name: 'Assam' }
        ],
        description: 'Professional false ceiling service provider and interior design company in Guwahati, Assam. Specializing in gypsum, POP, PVC ceilings, ceiling lighting and residential and commercial interior solutions.',
        priceRange: '$$',
        logo: `${SITE_URL}/logo.jpg`,
        image: `${SITE_URL}/logo.jpg`,
        sameAs: ['https://www.instagram.com/sahanines_interiors'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'False Ceiling & Interior Services in Guwahati',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'False Ceiling Installation in Guwahati', areaServed: { '@type': 'City', name: 'Guwahati' } } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gypsum False Ceiling in Guwahati', areaServed: { '@type': 'City', name: 'Guwahati' } } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'POP False Ceiling in Guwahati', areaServed: { '@type': 'City', name: 'Guwahati' } } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PVC Ceiling Installation in Guwahati', areaServed: { '@type': 'City', name: 'Guwahati' } } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Design Service in Guwahati', areaServed: { '@type': 'City', name: 'Guwahati' } } }
          ]
        }
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Sahanines Interiors',
        url: SITE_URL,
        telephone: settings?.phone || '076360 08047',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi',
          addressLocality: 'Guwahati',
          addressRegion: 'Assam',
          postalCode: '781009',
          addressCountry: 'IN'
        },
        logo: `${SITE_URL}/logo.jpg`
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
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="hero">
        {heroImage && <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }} role="img" aria-label="Modern gypsum false ceiling design for living room in Guwahati by Sahanines Interiors"></div>}
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Best False Ceiling Service in Guwahati</h1>
            <p>Sahanines Interiors provides professional false ceiling installation and interior design services across Guwahati, Assam. We specialize in gypsum, POP and PVC ceiling solutions with modern designs, quality materials and clean finishing for homes, offices and commercial spaces.</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary btn-lg">{settings?.hero?.ctaPrimary || 'Get Free Quote'}</Link>
              <Link to="/projects" className="btn btn-outline btn-lg">{settings?.hero?.ctaSecondary || 'View Our Projects'}</Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <span className="stars">★★★★★</span> {settings?.googleRating || 5.0} Google Rating
              </div>
              <div className="hero-trust-item">
                {settings?.googleReviewsCount || 319}+ Customer Reviews
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
              <Counter end={settings?.googleReviewsCount || 319} duration={2000} suffix="+" />
              <div className="label">Happy Customers</div>
            </div>
            <div className="trust-bar-item">
              <Counter end={services.length} duration={1500} />
              <div className="label">Services Offered</div>
            </div>
            <div className="trust-bar-item">
              <Counter end={500} duration={2000} suffix="+" />
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
              {settings?.about?.image && <img src={settings.about.image} alt="Sahanines Interiors office - false ceiling contractor in Guwahati, Assam" width="800" height="600" loading="lazy" />}
            </div>
            <div className="about-content">
              <span className="label">About Us</span>
              <h2>Sahanines Interiors — False Ceiling Service Provider in Guwahati, Assam</h2>
              <p>Sahanines Interiors is a professional false ceiling service provider in Guwahati, Assam, delivering modern designs, quality materials, clean finishing and complete customer satisfaction. Our team handles every project with precision and care, from design consultation to final installation.</p>
              <p>Based in Jyotikuchi, we serve residential and commercial clients across Guwahati. We are committed to delivering ceiling and interior work that meets the highest standards of craftsmanship, using verified gypsum boards, POP materials and PVC panels.</p>
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

      {/* False Ceiling Services in Guwahati - SEO Content Section */}
      <section className="section bg-alt" id="false-ceiling-services-guwahati">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Our Expertise</span>
            <h2>False Ceiling Services in Guwahati</h2>
            <p>Sahanines Interiors offers a complete range of false ceiling solutions for residential and commercial properties in Guwahati, Assam. Each type of ceiling material has its own advantages, and our team helps you choose the right option based on your space, budget and design preferences.</p>
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Gypsum False Ceiling Installation in Guwahati</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 24 }}>
              Gypsum false ceilings are the most popular choice for modern homes and offices in Guwahati. Gypsum boards are lightweight, fire-resistant, and provide a smooth, clean finish with precise joints. They offer excellent thermal and sound insulation, and can be customized with cutouts for LED lights, fans and AC vents. Our gypsum ceiling installations range from simple single-layer ceilings to multi-layered designer ceilings with cove lighting.
            </p>
            <Link to="/false-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 32 }}>Learn more about our gypsum false ceiling service →</Link>

            <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>POP Ceiling Design and Installation</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 24 }}>
              Plaster of Paris (POP) ceilings allow for the most creative and intricate designs. POP is applied as a paste, giving our craftsmen the flexibility to create curves, mouldings, geometric patterns and floral motifs. POP ceilings provide a seamless, monolithic finish and are cost-effective for complex designs. They are ideal for drawing rooms, banquet halls and spaces where you want a decorative statement ceiling.
            </p>
            <Link to="/pop-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 32 }}>Explore our POP ceiling designs →</Link>

            <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>PVC False Ceiling Services</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 24 }}>
              PVC ceiling panels are a practical and durable choice for spaces that need moisture resistance and easy maintenance. PVC panels are waterproof, termite-proof, lightweight, and available in a wide range of colours and finishes including wood grain and marble textures. They require no painting and are ideal for bathrooms, kitchens, balconies and commercial spaces across Guwahati.
            </p>
            <Link to="/pvc-ceiling-guwahati" style={{ color: 'var(--secondary)', fontWeight: 500, display: 'inline-block', marginBottom: 32 }}>View our PVC ceiling options →</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Our Services</span>
            <h2>Our False Ceiling & Interior Services</h2>
            <p>From modern false ceilings to integrated lighting, our team in Guwahati offers comprehensive interior solutions tailored to your space.</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div key={service._id} className="service-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="service-card-image">
                  {service.image && <img src={service.image} alt={service.altText || `${service.name} service in Guwahati by Sahanines Interiors`} width="600" height="375" loading="lazy" />}
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
      <section className="section bg-alt">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Why Choose Us</span>
            <h2>Why Choose Our False Ceiling Service in Guwahati</h2>
            <p>Sahanines Interiors stands out as a trusted false ceiling contractor in Guwahati because of our commitment to quality, transparency and customer satisfaction.</p>
          </div>
          <div className="why-grid">
            {[
              { icon: '✦', title: 'Expert Ceiling Designers', desc: 'Skilled designers creating contemporary ceiling looks tailored to your space and style' },
              { icon: '✦', title: 'Quality Materials', desc: 'We use only premium, verified gypsum boards, POP materials and PVC panels for every project' },
              { icon: '✦', title: 'Clean Finishing', desc: 'Attention to detail in every edge, joint and surface for a polished final result' },
              { icon: '✦', title: 'Professional Installation', desc: 'Experienced craftsmen with proven expertise in all types of ceiling work' },
              { icon: '✦', title: 'Lighting Integration', desc: 'Seamless LED strip, cove lighting and recessed light solutions built into ceiling designs' },
              { icon: '✦', title: 'Residential & Commercial', desc: 'Serving homes, apartments, offices, shops and commercial spaces across Guwahati' },
              { icon: '✦', title: 'Transparent Process', desc: 'Clear communication, honest project assessment and no hidden costs' },
              { icon: '✦', title: 'Customer-Focused', desc: 'Your satisfaction and vision guide every decision from design to completion' }
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
      <section className="section" id="projects">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Our Projects</span>
            <h2>Recent False Ceiling Work in Guwahati</h2>
            <p>Browse our portfolio of false ceiling and interior projects completed across Guwahati, Assam.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <div key={project._id} className="project-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="project-card-image">
                  {project.coverImage && <img src={project.coverImage} alt={project.altText || `${project.title} - false ceiling project in ${project.location || 'Guwahati'}`} width="600" height="450" loading="lazy" />}
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

      {/* Service Area - Local SEO */}
      <section className="section bg-alt" id="service-area">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Service Area</span>
            <h2>False Ceiling and Interior Services Across Guwahati, Assam</h2>
            <p>We provide false ceiling and interior design services across Guwahati, Assam, India, including residential homes, apartments, offices and commercial spaces.</p>
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              Sahanines Interiors is based in Guwahati, Assam and serves clients throughout the city. Whether you need a gypsum false ceiling for your living room, a POP ceiling for your bedroom, or a PVC ceiling for your office, our team delivers professional installation with quality materials and clean finishing.
            </p>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 20 }}>
              Our false ceiling services cover all types of properties in Guwahati including independent houses, apartments, villas, showrooms, retail shops, restaurants, hotels, and office buildings. We handle projects of all sizes, from a single room ceiling to complete interior solutions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
              {['Residential Homes', 'Apartments & Flats', 'Office Spaces', 'Retail Shops & Showrooms', 'Restaurants & Hotels', 'Commercial Buildings'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header fade-up">
            <span className="label">Client Reviews</span>
            <h2>What Our Clients Say</h2>
            <p>Rated {settings?.googleRating || 5.0} on Google with {settings?.googleReviewsCount || 319}+ reviews</p>
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
            <Link to="/reviews" className="btn btn-outline-dark">See All 319+ Reviews</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container fade-up">
          <h2>Ready to Transform Your Space?</h2>
          <p>Contact Sahanines Interiors to discuss your false ceiling and interior requirements in Guwahati. We provide free consultations and quotations for all ceiling and interior projects.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
            <a href={`tel:${settings?.phone || '07636008047'}`} className="btn btn-outline btn-lg">Call Now</a>
          </div>
        </div>
      </section>
    </>
  )
}
