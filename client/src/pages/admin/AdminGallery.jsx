import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
const galleryCategories = ['False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial']

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ image: '', title: '', category: 'False Ceiling', altText: '', caption: '' })
  const [uploading, setUploading] = useState(false)

  const fetchGallery = async () => {
    const res = await axios.get('/api/gallery/all', getToken())
    if (res.data.success) setImages(res.data.images)
  }
  useEffect(() => { fetchGallery() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/api/gallery', { ...form, isActive: true }, getToken())
    setForm({ image: '', title: '', category: 'False Ceiling', altText: '', caption: '' })
    fetchGallery()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) { await axios.delete(`/api/gallery/${id}`, getToken()); fetchGallery() }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('image', file)
      const res = await axios.post('/api/upload', fd, { headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) {
        const imageUrl = res.data.url.startsWith('http') ? res.data.url : res.data.url
        setForm({ ...form, image: imageUrl })
        alert('Image uploaded successfully!')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please check Cloudinary configuration.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="admin-header"><h1>Gallery</h1></div>
      <div className="admin-card">
        <h2>Add Image</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Image</label>
            {uploading && <div style={{ background: '#fff3cd', padding: '8px 12px', borderRadius: 6, marginBottom: 8, fontSize: '0.9rem' }}>Uploading to Cloudinary...</div>}
            {form.image && <img src={form.image} alt="Preview" style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginBottom: 8, display: 'block' }} />}
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Paste image URL" />
            <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 8 }} disabled={uploading} />
          </div>
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Image title" /></div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.95rem' }}>
              {galleryCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} placeholder="Describe the image" /></div>
          <div className="form-group"><label>Caption</label><input value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} placeholder="Optional caption" /></div>
          <button type="submit" className="admin-btn admin-btn-primary">Add Image</button>
        </form>
      </div>
      <div className="admin-card">
        <h2>Gallery Images ({images.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {images.map(img => (
              <tr key={img._id}>
                <td><img src={img.image} alt={img.altText || img.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td>{img.title || '-'}</td>
                <td><span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: 50, fontSize: '0.8rem' }}>{img.category || 'General'}</span></td>
                <td><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(img._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
