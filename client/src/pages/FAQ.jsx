import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../constants'
import axios from 'axios'

// Default FAQs - always shown if no FAQs in database
const defaultFAQs = [
  { _id: 'default-1', question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the main ceiling. It improves aesthetics, provides better insulation, hides wiring and pipes, and allows integration of modern lighting solutions.', sortOrder: 1 },
  { _id: 'default-2', question: 'What types of false ceilings do you provide?', answer: 'We provide Gypsum false ceilings, POP (Plaster of Paris) false ceilings, PVC ceilings, wooden ceilings, metal ceilings, and custom designer ceilings. Each type has its own benefits depending on your requirements.', sortOrder: 2 },
  { _id: 'default-3', question: 'What is the difference between Gypsum and POP ceiling?', answer: 'Gypsum ceilings come in ready-made boards and are quicker to install with a smooth finish. POP ceilings are applied as a paste and allow more intricate designs and curves. Gypsum is more durable and moisture-resistant, while POP is more cost-effective for complex designs.', sortOrder: 3 },
  { _id: 'default-4', question: 'How long does false ceiling installation take?', answer: 'Installation time depends on the room size and design complexity. A standard room (10x12 ft) typically takes 2-4 days. Complex designs with lighting integration may take 5-7 days.', sortOrder: 4 },
  { _id: 'default-5', question: 'Do you provide LED lighting integration?', answer: 'Yes, we specialize in integrating LED strip lights, recessed lights, cove lighting, and decorative lighting into false ceilings. We provide complete lighting solutions including installation.', sortOrder: 5 },
  { _id: 'default-6', question: 'What is the cost of false ceiling in Guwahati?', answer: 'The cost varies based on material, design complexity, and room size. Gypsum ceilings start from ₹65-85 per sq.ft, POP ceilings from ₹55-75 per sq.ft. Contact us for a free quotation based on your specific requirements.', sortOrder: 6 },
  { _id: 'default-7', question: 'Do you provide warranty on your work?', answer: 'Yes, we provide warranty on both materials and workmanship. Gypsum boards come with manufacturer warranty, and we provide 1-2 years warranty on our installation work.', sortOrder: 7 },
  { _id: 'default-8', question: 'Which areas in Guwahati do you serve?', answer: 'We serve all areas of Guwahati including Jyotikuchi, Shantipur, GS Road, Dispur, Khanapara, Christianbasti, Fancy Bazar, Aminjari, and surrounding areas. We also take projects in nearby towns.', sortOrder: 8 },
  { _id: 'default-9', question: 'Can false ceilings help with sound insulation?', answer: 'Yes, false ceilings can significantly reduce noise transmission. We use acoustic materials and proper insulation to improve soundproofing, which is especially useful for bedrooms, home theaters, and offices.', sortOrder: 9 },
  { _id: 'default-10', question: 'How do I get a quotation?', answer: 'You can call us at 076360 08047, WhatsApp us, or fill out the contact form on our website. We provide free site visits and quotations for projects in Guwahati.', sortOrder: 10 }
]

export default function FAQ() {
  const [faqs, setFaqs] = useState(defaultFAQs)
  const [openIndex, setOpenIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/faqs').then(res => {
      if (res.data.success && res.data.faqs.length > 0) {
        setFaqs(res.data.faqs)
      }
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
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
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
            ) : (
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
