import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import axios from 'axios'

export default function Reviews() {
  const { settings } = useSite()
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    axios.get('/api/testimonials').then(res => {
      if (res.data.success) setTestimonials(res.data.testimonials)
    }).catch(console.error)
  }, [])

  return (
    <>
      <Helmet>
        <title>Client Reviews | Sahanines Interiors - Rated 5.0 on Google | Guwahati</title>
        <meta name="description" content="Read what our clients say about Sahanines Interiors. Rated 5.0 on Google with 318+ reviews for false ceiling and interior work in Guwahati." />
        <link rel="canonical" href={`${window.location.origin}/reviews`} />
      </Helmet>

      <section className="page-header">
        <div className="container">
          <h1>Client Reviews</h1>
          <p>Rated {settings?.googleRating || 5.0} on Google with {settings?.googleReviewsCount || 318}+ reviews</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: 8 }}>★★★★★</div>
            <h2 style={{ fontSize: '1.5rem' }}>{settings?.googleRating || 5.0} out of 5</h2>
            <p>Based on {settings?.googleReviewsCount || 318} Google reviews</p>
            {settings?.googleBusinessUrl && (
              <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark" style={{ marginTop: 16 }}>
                View us on Google
              </a>
            )}
          </div>

          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t._id} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.review}"</p>
                <div className="testimonial-author">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience Quality Work?</h2>
          <p>Get a free consultation and let us transform your space.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Get a Free Consultation</Link>
          </div>
        </div>
      </section>
    </>
  )
}
