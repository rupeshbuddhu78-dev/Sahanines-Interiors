import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
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

  return (
    <>
      <Helmet>
        <title>Gallery | False Ceiling & Interior Work Photos | Sahanines Interiors Guwahati</title>
        <meta name="description" content="View our gallery of false ceiling and interior design work in Guwahati. Browse photos of gypsum, POP, lighting, residential and commercial projects." />
        <link rel="canonical" href={`${window.location.origin}/gallery`} />
      </Helmet>

      <section className="page-header">
        <div className="container">
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
