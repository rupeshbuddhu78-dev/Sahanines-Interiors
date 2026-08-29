import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
const categories = ['False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial']

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: 'False Ceiling', location: 'Guwahati', description: '', coverImage: '', altText: '', seoTitle: '', seoDescription: '', isFeatured: false, isActive: true, sortOrder: 0 })

  const fetchProjects = async () => {
    const res = await axios.get('/api/projects/all', getToken())
    if (res.data.success) setProjects(res.data.projects)
  }
  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await axios.put(`/api/projects/${editing}`, form, getToken())
    else await axios.post('/api/projects', form, getToken())
    setForm({ title: '', category: 'False Ceiling', location: 'Guwahati', description: '', coverImage: '', altText: '', seoTitle: '', seoDescription: '', isFeatured: false, isActive: true, sortOrder: 0 })
    setEditing(null)
    fetchProjects()
  }

  const handleEdit = (p) => {
    setEditing(p._id)
    setForm({ title: p.title, category: p.category, location: p.location, description: p.description, coverImage: p.coverImage, altText: p.altText, seoTitle: p.seoTitle, seoDescription: p.seoDescription, isFeatured: p.isFeatured, isActive: p.isActive, sortOrder: p.sortOrder })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) { await axios.delete(`/api/projects/${id}`, getToken()); fetchProjects() }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    const res = await axios.post('/api/upload', fd, { headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
    if (res.data.success) setForm({ ...form, coverImage: res.data.url })
  }

  return (
    <div>
      <div className="admin-header"><h1>Projects</h1></div>
      <div className="admin-card">
        <h2>{editing ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-group"><label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="4" /></div>
          <div className="form-group"><label>Cover Image URL</label><input value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} /></div>
          <div className="form-group"><label>Upload Image</label><input type="file" accept="image/*" onChange={handleUpload} /></div>
          {form.coverImage && <img src={form.coverImage} alt="" style={{ width: 120, borderRadius: 8, marginBottom: 12 }} />}
          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} /></div>
          <div className="form-group"><label>SEO Title</label><input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} /></div>
          <div className="form-group"><label>SEO Description</label><textarea value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} rows="2" /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> Featured</label></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Active</label></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Create'} Project</button>
            {editing && <button type="button" className="admin-btn" onClick={() => { setEditing(null); setForm({ title: '', category: 'False Ceiling', location: 'Guwahati', description: '', coverImage: '', altText: '', seoTitle: '', seoDescription: '', isFeatured: false, isActive: true, sortOrder: 0 }) }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="admin-card">
        <h2>All Projects ({projects.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td><td>{p.category}</td><td>{p.location}</td><td>{p.isFeatured ? 'Yes' : 'No'}</td>
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
