import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ image: '', title: '', category: 'General', altText: '', caption: '' })

  const fetchGallery = async () => {
    const res = await axios.get('/api/gallery/all', getToken())
    if (res.data.success) setImages(res.data.images)
  }
  useEffect(() => { fetchGallery() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/api/gallery', form, getToken())
    setForm({ image: '', title: '', category: 'General', altText: '', caption: '' })
    fetchGallery()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) { await axios.delete(`/api/gallery/${id}`, getToken()); fetchGallery() }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    const res = await axios.post('/api/upload', fd, { headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
    if (res.data.success) setForm({ ...form, image: res.data.url })
  }

  return (
    <div>
      <div className="admin-header"><h1>Gallery</h1></div>
      <div className="admin-card">
        <h2>Add Image</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} required /></div>
          <div className="form-group"><label>Upload Image</label><input type="file" accept="image/*" onChange={handleUpload} /></div>
          {form.image && <img src={form.image} alt="" style={{ width: 120, borderRadius: 8, marginBottom: 12 }} />}
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} /></div>
          <div className="form-group"><label>Caption</label><input value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} /></div>
          <button type="submit" className="admin-btn admin-btn-primary">Add Image</button>
        </form>
      </div>
      <div className="admin-card">
        <h2>Gallery Images ({images.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {images.map(img => (
            <div key={img._id} style={{ position: 'relative' }}>
              <img src={img.image} alt={img.altText || img.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(img._id)} style={{ position: 'absolute', top: 4, right: 4, fontSize: '0.7rem' }}>×</button>
              <p style={{ fontSize: '0.75rem', marginTop: 4 }}>{img.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
