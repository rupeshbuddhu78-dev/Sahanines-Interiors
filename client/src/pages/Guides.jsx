import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function Guides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await axios.get('/api/false-ceiling-guides')
        if (res.data.success) {
          setGuides(res.data.guides.slice(0, 6))
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchGuides()
  }, [])

  const title = 'False Ceiling Guides in Guwahati | Expert Tips & Contractor Questions | Sahanines Interiors'
  const description = 'Expert false ceiling guides in Guwahati by Sahanines Interiors. Learn what questions to ask your contractor before false ceiling construction. Tips on gypsum, POP, PVC ceiling installation in Guwahati.'

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/guides`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/guides`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sahanines Interiors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Page Header */}
      <section style={{ background: 'var(--primary)', color: 'white', padding: '80px 0 60px' }}>
        <div className="container">
          <span className="label" style={{ color: '#c9a96e' }}>Expert Guides</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginTop: 8, lineHeight: 1.3 }}>
            False Ceiling Guides in Guwahati
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: 700, marginTop: 12, opacity: 0.9, lineHeight: 1.7 }}>
            Questions you must ask your contractor before false ceiling construction. Expert tips and guides for false ceiling installation in Guwahati by Sahanines Interiors.
          </p>
        </div>
      </section>

      {/* Guides Content */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: 40 }}>Loading guides...</p>
            ) : guides.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--primary)' }}>No Guides Published Yet</h2>
                <p style={{ color: '#666', lineHeight: 1.7 }}>
                  Our expert false ceiling guides for Guwahati are coming soon. In the meantime, contact us for free consultation on false ceiling installation.
                </p>
                <Link to="/contact" className="btn btn-primary btn-lg" style={{ marginTop: 20, display: 'inline-block' }}>Get Free Consultation</Link>
              </div>
            ) : (
              guides.map((guide, i) => (
                <div key={guide._id} className="fade-up" style={{
                  transitionDelay: `${i * 0.08}s`,
                  marginBottom: 36,
                  padding: 32,
                  background: 'white',
                  borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: 16, color: 'var(--primary)', lineHeight: 1.4 }}>
                    {guide.title}
                  </h2>
                  <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: '#444', marginBottom: guide.advantages?.length > 0 ? 20 : 0 }}>
                    {guide.description}
                  </p>

                  {guide.advantages?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--primary)' }}>
                        Key Advantages of False Ceiling Installation in Guwahati
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                        {guide.advantages.map((adv, j) => (
                          <div key={j} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '10px 14px',
                            background: '#f8f9fa',
                            borderRadius: 8,
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                          }}>
                            <span style={{ color: 'var(--secondary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                            <span>{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {guide.videoUrl && (
                    <div style={{ marginTop: 24 }}>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: 12, color: 'var(--primary)' }}>
                        Watch: {guide.title}
                      </h3>
                      <video
                        src={guide.videoUrl}
                        controls
                        preload="metadata"
                        playsInline
                        style={{
                          width: '280px',
                          maxWidth: '100%',
                          aspectRatio: '9/16',
                          borderRadius: 12,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                          objectFit: 'cover',
                          background: '#000'
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 40, padding: '40px 0', borderTop: '1px solid #eee' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: 12 }}>
              Need Expert Help with False Ceiling in Guwahati?
            </h2>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', color: '#555' }}>
              Sahanines Interiors provides free consultation and quotation for gypsum, POP and PVC false ceiling installation across Guwahati, Assam. Contact our expert team today.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
              <Link to="/services" className="btn btn-outline-dark btn-lg">Our Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
