import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { SITE_URL } from '../constants'
import axios from 'axios'

// Real Google Reviews - hardcoded defaults
const defaultReviews = [
  { _id: 'google-1', name: 'MOINA Begum', review: 'Sahanines Interiors is truly a reliable name for professional false ceiling work in Guwahati. Their designs are modern, attractive, and beautifully executed. I really appreciate the quality of materials, neat finishing, and attention to detail.', rating: 5, source: 'Google' },
  { _id: 'google-2', name: 'Mariam Purkite', review: 'Our experience with Sahanines Interiors for false ceiling work in Guwahati was excellent from beginning to end. The team provided a beautiful false ceiling design that completely transformed the appearance of our interior. The workmanship was outstanding.', rating: 5, source: 'Google' },
  { _id: 'google-3', name: 'Rifa Tamanna', review: 'Sahanines Interiors exceeded my expectations with their false ceiling work. The design suggestions were creative, and the finishing was flawless. They installed a beautiful gypsum false ceiling with perfect lighting arrangements, making my room look premium.', rating: 5, source: 'Google' },
  { _id: 'google-4', name: 'Raki Ahmed', review: 'Sahanines Interiors has done an amazing job with the false ceiling work in my home. The design was modern, elegant, and perfectly suited to the space. The finishing quality was excellent, and the entire work was completed professionally.', rating: 5, source: 'Google' },
  { _id: 'google-5', name: 'Naman Maloo', review: 'I highly recommend Sahanines Interiors for professional false ceiling and interior design services. Abhisekh Sahani deserves special appreciation for his excellent guidance, professional approach, and commitment to customer satisfaction.', rating: 5, source: 'Google' },
  { _id: 'google-6', name: 'Premsing Basumatary', review: 'I am extremely happy with the false ceiling work completed by Sahanines Interiors. The team designed a modern and elegant ceiling that completely transformed the appearance of my living room. Their attention to detail and quality materials are commendable.', rating: 5, source: 'Google' },
  { _id: 'google-7', name: 'Nancy Kumari', review: 'I had a great experience with Sahanines Decoration for the false ceiling work in my flat. Their team was knowledgeable and guided me with the best design options based on my room layout and lighting needs. The execution was smooth and professional.', rating: 5, source: 'Google' },
  { _id: 'google-8', name: 'Raj Karki', review: 'Sahanines Decoration transformed my space with a beautiful and modern false ceiling design. Their team was punctual, skilled, and maintained high-quality standards from start to finish. The workmanship was neat, durable, and aesthetically pleasing.', rating: 5, source: 'Google' },
  { _id: 'google-9', name: 'Khushi Gupta', review: 'Amazing experience with Sahanines Decoration. Their work quality and attention to detail are truly impressive. The false ceiling design gave my room a premium and elegant appearance. The staff members were friendly, skilled, and completed the work on time.', rating: 5, source: 'Google' },
  { _id: 'google-10', name: 'Sirajuddin Ali', review: 'Sahanines Decoration has completely transformed my flat with their exceptional false ceiling work. The entire process from consultation to execution was handled with professionalism and care. They offered creative design ideas and executed them perfectly.', rating: 5, source: 'Google' },
  { _id: 'google-11', name: 'N.K GAMER', review: 'If you are looking for professional false ceiling work, Sahanines Decoration is the right choice. Their designs are unique, and the finishing is top-class. They maintain proper timelines and provide excellent customer service. Overall, a highly satisfying experience.', rating: 5, source: 'Google' },
  { _id: 'google-12', name: 'Tulsi Routh', review: 'I had a great experience with Sahanines Decoration for my False Ceiling project. Their designs are modern, and the execution is flawless. The team maintained cleanliness and professionalism throughout the work. Highly recommended for anyone considering a False Ceiling upgrade.', rating: 5, source: 'Google' },
  { _id: 'google-13', name: 'Rev Illusions', review: 'Sahanines Decoration provides one of the best false ceiling design services with premium quality finishing and modern room interior decoration. Their POP false ceiling work, LED ceiling lighting, and creative ceiling designs completely transformed our space.', rating: 5, source: 'Google' },
  { _id: 'google-14', name: 'Ebraj Dorjee', review: 'If you are looking for reliable false ceiling experts, Sahanines Decoration is an excellent choice. Their attention to detail, professional approach, and commitment to customer satisfaction truly stand out. The entire project was completed on time.', rating: 5, source: 'Google' },
  { _id: 'google-15', name: 'Sajal Kanti Dutta', review: 'I am very happy with the false ceiling work done by Sahanines Decoration. The craftsmanship is impressive and the attention to detail is clearly visible. They listened carefully to our ideas and delivered exactly what we wanted. Clean work, polite staff, and great overall experience.', rating: 5, source: 'Google' },
  { _id: 'google-16', name: 'Krishna kamal', review: 'I am very impressed with Sahanines Decoration. Their false ceiling designs are stylish and well-executed, adding a premium look to the space. The team is skilled, punctual, and attentive to detail, ensuring complete customer satisfaction.', rating: 5, source: 'Google' },
  { _id: 'google-17', name: 'Gagandeep Singh', review: 'Very good interior decorator. I got my ceiling and lighting work done from Sahanines Decoration. The team did neat and clean work. The designs look modern and beautiful. They finished the work on time and kept the place clean during the entire process.', rating: 5, source: 'Google' },
  { _id: 'google-18', name: 'Gagori Mahanta', review: 'Sahanines Decoration delivers excellent craftsmanship, especially in false ceiling work. The finishing is precise, the design is modern, and the overall execution reflects professionalism. Highly recommended for anyone looking to enhance interiors with elegant and durable solutions.', rating: 5, source: 'Google' },
  { _id: 'google-19', name: 'Suchita Mitra', review: 'Sahanines Decoration has done an excellent job with the interior work. The false ceiling design is elegant, well-finished, and enhances the overall beauty of the space. Truly professional workmanship and great attention to detail.', rating: 5, source: 'Google' },
  { _id: 'google-20', name: 'Dadul Bhuyan', review: 'Sahanines Decoration delivered an exceptional setup with a beautifully designed false ceiling that enhanced the overall ambiance. The attention to detail, creativity, and finishing were remarkable, making the space look elegant and truly memorable.', rating: 5, source: 'Google' },
  { _id: 'google-21', name: 'Adheekha', review: 'Highly satisfied with the false ceiling installation and interior decoration work completed by Sahanines Decoration. Their expertise in modern false ceiling design, POP ceiling decoration, gypsum ceiling finishing, and room interior styling is outstanding.', rating: 5, source: 'Google' },
  { _id: 'google-22', name: 'Pansurika Phukan', review: 'Outstanding work by Sahanines Decoration. The false ceiling design done under the supervision of Abhisekh Sahani was exceptional, combining creativity with quality. The final result was both aesthetic and functional, making the space look truly refined.', rating: 5, source: 'Google' },
  { _id: 'google-23', name: 'ilva iswary', review: 'The work done by Sahanies Decoration was highly impressive, particularly the false ceiling design. It was beautifully crafted and perfectly matched with the theme. The team showed great dedication, discipline, and professionalism throughout the work.', rating: 5, source: 'Google' },
  { _id: 'google-24', name: 'Pritilata Das', review: 'The work executed by Sahanines Decoration reflects high-quality standards and creative excellence. Their ability to understand client requirements and convert them into elegant designs is commendable. The finishing, coordination, and execution were perfect.', rating: 5, source: 'Google' },
  { _id: 'google-25', name: 'NILUTPAL DAS', review: 'Truly impressed by Sahanines Decoration and their stunning false ceiling work. Abhisekh Sahani and his team showed great professionalism, creativity, and precision. The decoration was perfectly executed, adding charm and sophistication to the space.', rating: 5, source: 'Google' },
  { _id: 'google-26', name: 'liku deka', review: 'Amazing false ceiling work by Sahanines Decoration! The design, finishing, and overall quality look absolutely premium and professional.', rating: 5, source: 'Google' },
  { _id: 'google-27', name: 'Mohan Chetry', review: 'The false ceiling work by Sahanines Decoration completely changed the look of our home. Clean finishing, modern design, and very professional service.', rating: 5, source: 'Google' },
  { _id: 'google-28', name: 'Prem Adhikari', review: 'Sahanines Decoration gave our space a whole new life! The false ceiling design was both stylish and practical, and their team handled everything so professionally. They listened to every detail and executed it perfectly. Excellent service, high-quality materials, and very polite staff.', rating: 5, source: 'Google' },
  { _id: 'google-29', name: 'Puja Deka', review: 'I had a wonderful experience with Sahanines Decoration for my false ceiling project. They are very professional, reliable, and skilled. The entire process from design to execution was smooth and hassle-free. Their quality of work and attention to detail are commendable.', rating: 5, source: 'Google' },
  { _id: 'google-30', name: 'Lost Jester', review: 'I am extremely happy with the false ceiling work done by Sahanines Decoration at my home. The entire process was smooth, from design consultation to final execution. The team is well-trained and handled everything professionally.', rating: 5, source: 'Google' }
]

export default function Reviews() {
  const { settings } = useSite()
  const [testimonials, setTestimonials] = useState(defaultReviews)

  useEffect(() => {
    axios.get('/api/testimonials').then(res => {
      if (res.data.success && res.data.testimonials.length > 0) {
        setTestimonials(res.data.testimonials)
      }
    }).catch(console.error)
  }, [])

  const title = 'Client Reviews | Sahanines Interiors - 5.0★ Rated on Google with 319+ Reviews | False Ceiling Guwahati'
  const description = 'Read 319+ genuine Google reviews for Sahanines Interiors. Rated 5.0★ for false ceiling, gypsum ceiling, POP ceiling, and interior design services in Guwahati, Assam.'
  const ogImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: `${SITE_URL}/reviews` }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/reviews`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/reviews`} />
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
            <span>Reviews</span>
          </div>
          <h1>Client Reviews</h1>
          <p>Rated {settings?.googleRating || 5.0} on Google with {settings?.googleReviewsCount || 319}+ reviews</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: 8 }}>★★★★★</div>
            <h2 style={{ fontSize: '1.5rem' }}>{settings?.googleRating || 5.0} out of 5</h2>
            <p>Based on {settings?.googleReviewsCount || 319} Google reviews</p>
            <a href="https://www.google.com/maps/place/Sahanines+Interiors" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark" style={{ marginTop: 16 }}>
              View us on Google Maps
            </a>
          </div>

          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t._id} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.review}"</p>
                <div className="testimonial-author">
                  — {t.name}
                  {t.source && <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 8 }}>({t.source})</span>}
                </div>
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
