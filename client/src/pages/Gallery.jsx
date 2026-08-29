import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../constants'
import axios from 'axios'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const categories = ['All', 'False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial']

  useEffect(() => {
    const url = activeCategory === 'All' ? '/api/gallery' : `/api/gallery?category=${activeCategory}`
    axios.get(url).then(res => {
      if (res.data.success) setImages(res.data.images)
    }).catch(console.error)
  }, [activeCategory])

  const title = 'Gallery | False Ceiling & Interior Work Photos | Sahanines Interiors Guwahati'
  const description = 'View our gallery of false ceiling and interior design work in Guwahati. Browse photos of gypsum, POP, lighting, residential and commercial ceiling projects by Sahanines Interiors.'
  const ogImage = 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${SITE_URL}/gallery` }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/gallery`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/gallery`} />
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
            <span>Gallery</span>
          </div>
          <h1>Our Gallery</h1>
          <p>Browse our collection of false ceiling and interior work</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="project-filters">
            {categories.map(cat => (
              <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {images.map(img => (
              <div key={img._id} className="gallery-item" onClick={() => setLightbox(img.image)}>
                <img src={img.image} alt={img.altText || img.title || 'False ceiling work in Guwahati'} width="400" height="400" loading="lazy" />
                <div className="gallery-item-overlay"><span>+</span></div>
              </div>
            ))}
          </div>
          {images.length === 0 && <p style={{ textAlign: 'center', padding: 40 }}>No images in this category.</p>}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">×</button>
          <img src={lightbox} alt="Gallery image" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
