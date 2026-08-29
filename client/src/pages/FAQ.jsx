import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    axios.get('/api/faqs').then(res => {
      if (res.data.success) setFaqs(res.data.faqs)
    }).catch(console.error)
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }

  return (
    <>
      <Helmet>
        <title>FAQ | False Ceiling Questions Answered | Sahanines Interiors Guwahati</title>
        <meta name="description" content="Find answers to common questions about false ceiling services, gypsum and POP ceilings, lighting integration, and more from Sahanines Interiors in Guwahati." />
        <link rel="canonical" href={`${window.location.origin}/faq`} />
        {faqs.length > 0 && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <section className="page-header">
        <div className="container">
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
        </div>
      </section>
    </>
  )
}
