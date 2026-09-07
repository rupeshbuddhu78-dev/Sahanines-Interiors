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
          setGuides(res.data.guides)
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
          {loading ? (
            <p style={{ textAlign: 'center', padding: 40 }}>Loading guides...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 28,
              maxWidth: 1200,
              margin: '0 auto'
            }}>
              {guides.map((guide, i) => (
                <div key={guide._id} className="guide-card fade-up" style={{
                  transitionDelay: `${i * 0.08}s`,
                  background: 'white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    width: '100%',
                    background: '#000',
                    cursor: 'pointer'
                  }}>
                    <video
                      src={guide.videoUrl || ''}
                      controls
                      preload="metadata"
                      playsInline
                      style={{
                        width: '100%',
                        aspectRatio: '9/16',
                        maxHeight: 480,
                        objectFit: 'cover',
                        display: 'block',
                        background: '#000'
                      }}
                      onClick={(e) => {
                        const video = e.target;
                        if (video.requestFullscreen) video.requestFullscreen();
                        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                        else if (video.msRequestFullscreen) video.msRequestFullscreen();
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: 12, color: 'var(--primary)', lineHeight: 1.4, fontWeight: 600 }}>
                      {guide.title}
                    </h2>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#444', flex: 1 }}>
                      {guide.description}
                    </p>

                    {guide.advantages?.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h3 style={{ fontSize: '0.95rem', marginBottom: 10, color: 'var(--primary)', fontWeight: 600 }}>
                          Key Points
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {guide.advantages.map((adv, j) => (
                            <div key={j} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              padding: '8px 12px',
                              background: '#f8f9fa',
                              borderRadius: 8,
                              fontSize: '0.88rem',
                              lineHeight: 1.4
                            }}>
                              <span style={{ color: 'var(--secondary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                              <span>{adv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
