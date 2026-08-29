import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../constants'
import axios from 'axios'

const categories = ['All', 'False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const url = activeCategory === 'All' ? '/api/projects' : `/api/projects?category=${activeCategory}`
    axios.get(url).then(res => {
      if (res.data.success) setProjects(res.data.projects)
    }).catch(console.error)
  }, [activeCategory])

  const title = 'Our Projects | False Ceiling Work in Guwahati | Sahanines Interiors'
  const description = 'Browse our portfolio of false ceiling and interior projects in Guwahati, Assam. Residential, commercial, gypsum, POP ceiling and lighting work by Sahanines Interiors.'
  const ogImage = 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/projects`} />
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
            <span>Projects</span>
          </div>
          <h1>Our Projects</h1>
          <p>Explore our portfolio of false ceiling and interior projects across Guwahati</p>
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
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <div className="project-card-image">
                  <img src={project.coverImage || 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=600&q=80'} alt={project.altText || project.title} width="600" height="450" loading="lazy" />
                </div>
                <div className="project-card-overlay">
                  <span className="category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && <p style={{ textAlign: 'center', padding: 40 }}>No projects found in this category.</p>}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Want Results Like These?</h2>
          <p>Let's discuss your project and create something exceptional for your space.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">Start Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
