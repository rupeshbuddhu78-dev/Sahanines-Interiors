import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
const categories = ['False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial']
const emptyForm = { title: '', category: 'False Ceiling', location: 'Guwahati', description: '', coverImage: '', altText: '', seoTitle: '', seoDescription: '', isFeatured: false, isActive: true, sortOrder: 0 }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [uploading, setUploading] = useState(false)

  const fetchProjects = async () => {
    const res = await axios.get('/api/projects/all', getToken())
    if (res.data.success) setProjects(res.data.projects)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await axios.put(`/api/projects/${editing}`, form, getToken())
      } else {
        await axios.post('/api/projects', form, getToken())
      }
      setForm({ ...emptyForm })
      setEditing(null)
      fetchProjects()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (p) => {
    setEditing(p._id)
    setForm({
      title: p.title || '',
      category: p.category || 'False Ceiling',
      location: p.location || 'Guwahati',
      description: p.description || '',
      coverImage: p.coverImage || '',
      altText: p.altText || '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      isFeatured: p.isFeatured || false,
      isActive: p.isActive !== undefined ? p.isActive : true,
      sortOrder: p.sortOrder || 0
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await axios.delete(`/api/projects/${id}`, getToken())
      fetchProjects()
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Upload response:', res.data)
      if (res.data.success && res.data.url) {
        setForm(prev => ({ ...prev, coverImage: res.data.url }))
        alert('Image uploaded! URL: ' + res.data.url)
      } else {
        alert('Upload response missing URL: ' + JSON.stringify(res.data))
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ ...emptyForm })
  }

  return (
    <div>
      <div className="admin-header"><h1>Projects</h1></div>

      <div className="admin-card">
        <h2>{editing ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="4" /></div>
          
          <div className="form-group">
            <label>Cover Image</label>
            {uploading && <div style={{ background: '#fff3cd', padding: '8px 12px', borderRadius: 6, marginBottom: 8, fontSize: '0.9rem' }}>Uploading to Cloudinary...</div>}
            {form.coverImage && (
              <div style={{ marginBottom: 8 }}>
                <img 
                  key={form.coverImage}
                  src={form.coverImage} 
                  alt="Preview" 
                  style={{ width: '100%', maxWidth: 200, borderRadius: 8, display: 'block', border: '1px solid #eee' }}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none', padding: '8px', background: '#fee', borderRadius: 4, fontSize: '0.85rem', color: '#c00' }}>
                  Image failed to load. URL: {form.coverImage}
                </div>
              </div>
            )}
            <input value={form.coverImage} onChange={e => setForm(prev => ({...prev, coverImage: e.target.value}))} placeholder="Paste image URL" />
            <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 8 }} disabled={uploading} />
          </div>

          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} /></div>
          <div className="form-group"><label>SEO Title</label><input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} /></div>
          <div className="form-group"><label>SEO Description</label><textarea value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} rows="2" /></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> Featured</label></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Active</label></div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Create'} Project</button>
            {editing && <button type="button" className="admin-btn" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All Projects ({projects.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Location</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id}>
                <td>{p.coverImage ? <img src={p.coverImage} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="color:#999;font-size:0.8rem">No image</span>'; }} /> : <span style={{ color: '#999', fontSize: '0.8rem' }}>No image</span>}</td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.location}</td>
                <td>{p.isFeatured ? '⭐' : '-'}</td>
                <td>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
