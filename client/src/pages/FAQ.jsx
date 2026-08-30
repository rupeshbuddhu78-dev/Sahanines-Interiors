import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/faqs').then(res => {
      if (res.data.success) setFaqs(res.data.faqs)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const title = 'FAQ | False Ceiling Questions Answered | Sahanines Interiors Guwahati'
  const description = 'Find answers to common questions about false ceiling services, gypsum and POP ceilings, lighting integration, pricing, and more from Sahanines Interiors in Guwahati, Assam.'
  const ogImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` }
        ]
      }
    ]
  }

  if (faqs.length > 0) {
    jsonLd['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    })
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/faq`} />
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

      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link><span>/</span>
            <span>FAQ</span>
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our false ceiling and interior services</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="spinner"></div>
                <p style={{ marginTop: 16, color: '#666' }}>Loading FAQs...</p>
              </div>
            ) : faqs.length > 0 ? (
              <>
                <div style={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
                  padding: '32px', 
                  borderRadius: 16, 
                  marginBottom: 40,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'white' }}>Have Questions? We've Got Answers!</h2>
                  <p style={{ opacity: 0.9, margin: 0 }}>Find answers to the most common questions about our false ceiling services in Guwahati</p>
                </div>

                <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {faqs.map((faq, i) => (
                    <div 
                      key={faq._id} 
                      className={`faq-item ${openIndex === i ? 'open' : ''}`}
                      style={{
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: openIndex === i 
                          ? '0 8px 24px rgba(0,0,0,0.12)' 
                          : '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        border: openIndex === i ? '2px solid var(--secondary)' : '2px solid transparent'
                      }}
                    >
                      <button 
                        className="faq-question" 
                        onClick={() => setOpenIndex(openIndex === i ? null : i)} 
                        aria-expanded={openIndex === i}
                        style={{
                          width: '100%',
                          padding: '20px 24px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                          textAlign: 'left',
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: openIndex === i ? 'var(--secondary)' : 'var(--primary)',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        <span style={{ flex: 1 }}>{faq.question}</span>
                        <span 
                          className="icon"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: openIndex === i ? 'var(--secondary)' : '#f0f0f0',
                            color: openIndex === i ? 'white' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                            flexShrink: 0
                          }}
                        >
                          +
                        </span>
                      </button>
                      <div 
                        className="faq-answer"
                        style={{
                          maxHeight: openIndex === i ? 500 : 0,
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease, padding 0.3s ease',
                          padding: openIndex === i ? '0 24px 20px 24px' : '0 24px'
                        }}
                      >
                        <p style={{ 
                          margin: 0, 
                          lineHeight: 1.7, 
                          color: '#555',
                          fontSize: '0.95rem'
                        }}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  textAlign: 'center', 
                  marginTop: 48,
                  padding: '40px 24px',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                  borderRadius: 16
                }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: 12, color: 'var(--primary)' }}>
                    Still Have Questions?
                  </h3>
                  <p style={{ marginBottom: 24, color: '#666' }}>
                    We're here to help! Contact us for a free consultation and quotation.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                    <a href="tel:07636008047" className="btn btn-outline-dark">Call Now</a>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 60,
                background: '#f9f9f9',
                borderRadius: 16
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>❓</div>
                <h3 style={{ marginBottom: 12 }}>FAQs Coming Soon</h3>
                <p style={{ color: '#666', marginBottom: 24 }}>
                  We're working on adding frequently asked questions. In the meantime, feel free to contact us directly.
                </p>
                <Link to="/contact" className="btn btn-primary">Contact Us</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .faq-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
        .faq-question:hover {
          color: var(--secondary) !important;
        }
        @media (max-width: 768px) {
          .faq-question {
            font-size: 0.95rem !important;
            padding: 16px 18px !important;
          }
          .faq-answer {
            padding: 0 18px !important;
          }
        }
      `}</style>
    </>
  )
}
