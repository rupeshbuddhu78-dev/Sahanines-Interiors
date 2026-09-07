import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function Guides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedGuide, setExpandedGuide] = useState(null)
  const observerRef = useRef(null)

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
  }, [guides])

  const toggleExpand = (id) => {
    setExpandedGuide(expandedGuide === id ? null : id)
  }

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
      <section className="guides-hero">
        <div className="guides-hero-overlay"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label">Expert Guides</span>
          <h1 className="guides-hero-title">
            False Ceiling Guides in Guwahati
          </h1>
          <p className="guides-hero-subtitle">
            Questions you must ask your contractor before false ceiling construction. Expert tips and video guides for gypsum, POP & PVC ceiling installation by Sahanines Interiors.
          </p>
          <div className="guides-hero-stats">
            <div className="guides-hero-stat">
              <span className="guides-hero-stat-number">{guides.length || '—'}</span>
              <span className="guides-hero-stat-label">Video Guides</span>
            </div>
            <div className="guides-hero-stat-divider"></div>
            <div className="guides-hero-stat">
              <span className="guides-hero-stat-number">100%</span>
              <span className="guides-hero-stat-label">Free Knowledge</span>
            </div>
            <div className="guides-hero-stat-divider"></div>
            <div className="guides-hero-stat">
              <span className="guides-hero-stat-number">Expert</span>
              <span className="guides-hero-stat-label">Tips & Advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Content */}
      <section className="section" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : guides.length === 0 ? (
            <div className="guides-empty fade-up">
              <div className="guides-empty-icon">📹</div>
              <h2>No Guides Available Yet</h2>
              <p>We are working on creating expert video guides for false ceiling installation. Check back soon for helpful tips and advice.</p>
              <Link to="/contact" className="btn btn-primary">Get Free Consultation</Link>
            </div>
          ) : (
            <>
              <div className="guides-intro fade-up">
                <p>
                  Planning a false ceiling for your home or office in Guwahati? Watch these expert video guides by Sahanines Interiors to make informed decisions, choose the right materials, and ask the right questions to your false ceiling contractor before construction begins.
                </p>
              </div>

              <div className="guides-grid">
                {guides.map((guide, i) => (
                  <div
                    key={guide._id}
                    className="guide-card fade-up"
                    style={{ transitionDelay: `${i * 0.08}s` }}
                  >
                    {/* Video Section */}
                    <div className="guide-card-video">
                      <video
                        src={guide.videoUrl || ''}
                        controls
                        preload="metadata"
                        playsInline
                        className="guide-video-player"
                        onClick={(e) => {
                          const video = e.target;
                          if (video.requestFullscreen) video.requestFullscreen();
                          else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                          else if (video.msRequestFullscreen) video.msRequestFullscreen();
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="guide-card-video-badge">
                        <span className="guide-badge-icon">▶</span>
                        <span>Guide #{i + 1}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="guide-card-content">
                      <h2 className="guide-card-title">{guide.title}</h2>

                      {guide.description && (
                        <p className="guide-card-description">{guide.description}</p>
                      )}

                      {guide.advantages?.length > 0 && (
                        <div className="guide-card-points">
                          <button
                            className="guide-points-toggle"
                            onClick={() => toggleExpand(guide._id)}
                          >
                            <span>Key Points ({guide.advantages.length})</span>
                            <span className={`guide-toggle-icon ${expandedGuide === guide._id ? 'open' : ''}`}>
                              ▼
                            </span>
                          </button>
                          <div className={`guide-points-list ${expandedGuide === guide._id ? 'expanded' : ''}`}>
                            {guide.advantages.map((adv, j) => (
                              <div key={j} className="guide-point-item">
                                <span className="guide-point-check">✓</span>
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
            </>
          )}

          {/* CTA Section */}
          <div className="guides-cta fade-up">
            <div className="guides-cta-inner">
              <h2>Need Expert Help with False Ceiling in Guwahati?</h2>
              <p>
                Sahanines Interiors provides free consultation and quotation for gypsum, POP and PVC false ceiling installation across Guwahati, Assam. Contact our expert team today.
              </p>
              <div className="guides-cta-buttons">
                <Link to="/contact" className="btn btn-primary btn-lg">Get Free Quote</Link>
                <Link to="/services" className="btn btn-outline-dark btn-lg">Our Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
