import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
const emptyForm = { name: '', shortDescription: '', description: '', image: '', altText: '', seoTitle: '', seoDescription: '', benefitsText: '', applicationsText: '', benefits: [], applications: [], isActive: true, sortOrder: 0 }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [uploading, setUploading] = useState(false)

  const fetchServices = async () => {
    const res = await axios.get('/api/services/all', getToken())
    if (res.data.success) setServices(res.data.services)
  }

  useEffect(() => { fetchServices() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...form,
        benefits: form.benefitsText ? form.benefitsText.split('\n').filter(b => b.trim()) : form.benefits,
        applications: form.applicationsText ? form.applicationsText.split('\n').filter(a => a.trim()) : form.applications
      }
      delete submitData.benefitsText
      delete submitData.applicationsText

      if (editing) {
        await axios.put(`/api/services/${editing}`, submitData, getToken())
      } else {
        await axios.post('/api/services', submitData, getToken())
      }
      setForm({ ...emptyForm })
      setEditing(null)
      fetchServices()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (s) => {
    setEditing(s._id)
    setForm({
      name: s.name || '',
      shortDescription: s.shortDescription || '',
      description: s.description || '',
      image: s.image || '',
      altText: s.altText || '',
      seoTitle: s.seoTitle || '',
      seoDescription: s.seoDescription || '',
      benefits: s.benefits || [],
      applications: s.applications || [],
      benefitsText: (s.benefits || []).join('\n'),
      applicationsText: (s.applications || []).join('\n'),
      isActive: s.isActive !== undefined ? s.isActive : true,
      sortOrder: s.sortOrder || 0
    })
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
        const imageUrl = res.data.url
        setForm(prev => ({ ...prev, image: imageUrl }))
        alert('Image uploaded! URL: ' + imageUrl)
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
      <div className="admin-header"><h1>Services</h1></div>

      <div className="admin-card">
        <h2>{editing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Short Description</label><textarea value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} rows="2" /></div>
          <div className="form-group"><label>Full Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="5" /></div>
          
          <div className="form-group">
            <label>Image</label>
            {uploading && <div style={{ background: '#fff3cd', padding: '8px 12px', borderRadius: 6, marginBottom: 8, fontSize: '0.9rem' }}>Uploading to Cloudinary...</div>}
            {form.image && (
              <div style={{ marginBottom: 8 }}>
                <img 
                  key={form.image}
                  src={form.image} 
                  alt="Preview" 
                  style={{ width: '100%', maxWidth: 200, borderRadius: 8, display: 'block', border: '1px solid #eee' }}
                  onError={(e) => { 
                    console.error('Image failed to load:', form.image);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none', padding: '8px', background: '#fee', borderRadius: 4, fontSize: '0.85rem', color: '#c00' }}>
                  Image failed to load. URL: {form.image}
                </div>
              </div>
            )}
            <input value={form.image} onChange={e => setForm(prev => ({...prev, image: e.target.value}))} placeholder="Paste image URL" />
            <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 8 }} disabled={uploading} />
          </div>

          <div className="form-group"><label>Alt Text</label><input value={form.altText} onChange={e => setForm({...form, altText: e.target.value})} /></div>
          <div className="form-group"><label>SEO Title</label><input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} /></div>
          <div className="form-group"><label>SEO Description</label><textarea value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} rows="2" /></div>
          
          <div className="form-group">
            <label>Benefits (one per line)</label>
            <textarea value={form.benefitsText} onChange={e => setForm({...form, benefitsText: e.target.value})} rows="4" placeholder={"Enhanced aesthetics\nImproved insulation\nConcealed wiring"} />
          </div>
          <div className="form-group">
            <label>Applications (one per line)</label>
            <textarea value={form.applicationsText} onChange={e => setForm({...form, applicationsText: e.target.value})} rows="4" placeholder={"Living rooms\nBedrooms\nOffices"} />
          </div>

          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Active</label></div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Create'} Service</button>
            {editing && <button type="button" className="admin-btn" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All Services ({services.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s._id}>
                <td>{s.image ? <img src={s.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="color:#999;font-size:0.8rem">No image</span>'; }} /> : <span style={{ color: '#999', fontSize: '0.8rem' }}>No image</span>}</td>
                <td>{s.name}</td>
                <td>{s.sortOrder}</td>
                <td>{s.isActive ? '✅' : '❌'}</td>
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
