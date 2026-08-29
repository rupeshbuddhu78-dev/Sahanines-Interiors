import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    axios.get('/api/services').then(res => {
      if (res.data.success) setServices(res.data.services)
    }).catch(console.error)
  }, [])

  return (
    <>
      <Helmet>
        <title>Our Services | False Ceiling & Interior Solutions in Guwahati | Sahanines Interiors</title>
        <meta name="description" content="Explore our range of false ceiling and interior services in Guwahati including gypsum ceiling, POP ceiling, ceiling lighting, residential and commercial solutions." />
        <link rel="canonical" href={`${window.location.origin}/services`} />
      </Helmet>

      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive false ceiling and interior solutions for every space</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
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
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Need a Custom Solution?</h2>
          <p>Every space is unique. Contact us to discuss your specific requirements and get a tailored quotation.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Discuss Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
