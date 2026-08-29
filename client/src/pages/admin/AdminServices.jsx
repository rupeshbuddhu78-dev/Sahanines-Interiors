import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', shortDescription: '', description: '', image: '', altText: '', seoTitle: '', seoDescription: '', benefits: [], applications: [], isActive: true, sortOrder: 0 })

  const fetchServices = async () => {
    const res = await axios.get('/api/services/all', getToken())
    if (res.data.success) setServices(res.data.services)
  }

  useEffect(() => { fetchServices() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await axios.put(`/api/services/${editing}`, form, getToken())
      } else {
        await axios.post('/api/services', form, getToken())
      }
      setForm({ name: '', shortDescription: '', description: '', image: '', altText: '', seoTitle: '', seoDescription: '', benefits: [], applications: [], isActive: true, sortOrder: 0 })
      setEditing(null)
      fetchServices()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (s) => {
    setEditing(s._id)
    setForm({ name: s.name, shortDescription: s.shortDescription, description: s.description, image: s.image, altText: s.altText, seoTitle: s.seoTitle, seoDescription: s.seoDescription, benefits: s.benefits || [], applications: s.applications || [], isActive: s.isActive, sortOrder: s.sortOrder })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      await axios.delete(`/api/services/${id}`, getToken())
      fetchServices()
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    const res = await axios.post('/api/upload', formData, { ...getToken(), headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
    if (res.data.success) setForm({ ...form, image: res.data.url })
  }

  return (
    <div>
      <div className="admin-header"><h1>Services</h1></div>

      <div className="admin-card">
        <h2>{editing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Short Description</label><textarea value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} rows="2" /></div>
          <div className="form-group"><label>Full Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="5" /></div>
          <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Paste image URL or upload below" /></div>
          <div className="form-group"><label>Upload Image</label><input type="file" accept="image/*" onChange={handleUpload} /></div>
          {form.image && <img src={form.image} alt="" style={{ width: 120, borderRadius: 8, marginBottom: 12 }} />}
          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} /></div>
          <div className="form-group"><label>SEO Title</label><input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} /></div>
          <div className="form-group"><label>SEO Description</label><textarea value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} rows="2" /></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Active</label></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Create'} Service</button>
            {editing && <button type="button" className="admin-btn" onClick={() => { setEditing(null); setForm({ name: '', shortDescription: '', description: '', image: '', altText: '', seoTitle: '', seoDescription: '', benefits: [], applications: [], isActive: true, sortOrder: 0 }) }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All Services ({services.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.sortOrder}</td>
                <td>{s.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(s)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
