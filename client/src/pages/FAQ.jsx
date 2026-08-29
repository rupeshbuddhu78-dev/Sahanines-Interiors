import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    axios.get('/api/faqs').then(res => {
      if (res.data.success) setFaqs(res.data.faqs)
    }).catch(console.error)
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
          <p>Answers to common questions about our false ceiling and interior services</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={faq._id} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i}>
                  {faq.question}
                  <span className="icon">+</span>
                </button>
                <div className="faq-answer"><p>{faq.answer}</p></div>
              </div>
            ))}
          </div>
          {faqs.length === 0 && <p style={{ textAlign: 'center' }}>FAQs coming soon.</p>}

          {faqs.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <p style={{ marginBottom: 16 }}>Still have questions? We're happy to help.</p>
              <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
