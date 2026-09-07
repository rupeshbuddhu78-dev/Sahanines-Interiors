import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminFalseCeilingGuides() {
  const [guides, setGuides] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    advantages: [],
    videoUrl: '',
    isPublished: true,
    sortOrder: 0
  })
  const [newAdvantage, setNewAdvantage] = useState('')
  const [uploading, setUploading] = useState(false)

  const fetchData = async () => {
    const res = await axios.get('/api/false-ceiling-guides/all', getToken())
    if (res.data.success) setGuides(res.data.guides)
  }
  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setForm({ title: '', description: '', advantages: [], videoUrl: '', isPublished: true, sortOrder: 0 })
    setEditing(null)
    setNewAdvantage('')
  }

  const handleAddAdvantage = () => {
    if (newAdvantage.trim()) {
      setForm({ ...form, advantages: [...form.advantages, newAdvantage.trim()] })
      setNewAdvantage('')
    }
  }

  const handleRemoveAdvantage = (index) => {
    setForm({ ...form, advantages: form.advantages.filter((_, i) => i !== index) })
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('video', file)

    try {
      // Upload video to Cloudinary via backend
      const res = await axios.post('/api/upload-video', formData, {
        ...getToken(),
        headers: {
          ...getToken().headers,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data.success) {
        setForm({ ...form, videoUrl: res.data.url })
      }
    } catch (err) {
      // If video upload fails, allow manual URL input
      alert('Video upload failed. You can paste a Cloudinary video URL directly in the Video URL field.')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await axios.put(`/api/false-ceiling-guides/${editing}`, form, getToken())
    } else {
      await axios.post('/api/false-ceiling-guides', form, getToken())
    }
    resetForm()
    fetchData()
  }

  const handleEdit = (g) => {
    setEditing(g._id)
    setForm({
      title: g.title,
      description: g.description,
      advantages: g.advantages || [],
      videoUrl: g.videoUrl || '',
      isPublished: g.isPublished,
      sortOrder: g.sortOrder || 0
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this guide?')) {
      await axios.delete(`/api/false-ceiling-guides/${id}`, getToken())
      fetchData()
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>False Ceiling Guides</h1>
      </div>

      <div className="admin-card">
        <h2>{editing ? 'Edit' : 'Add'} Guide</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Questions You Must Ask Your Contractor Before False Ceiling Construction"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows="5"
              placeholder="Detailed description for this guide..."
              required
            />
          </div>

          <div className="form-group">
            <label>Advantages (add one at a time)</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                value={newAdvantage}
                onChange={e => setNewAdvantage(e.target.value)}
                placeholder="Type an advantage and click Add"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAdvantage() } }}
              />
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleAddAdvantage} style={{ whiteSpace: 'nowrap' }}>Add</button>
            </div>
            {form.advantages.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {form.advantages.map((adv, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>✓</span>
                    <span style={{ flex: 1 }}>{adv}</span>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveAdvantage(i)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>Video URL (Cloudinary)</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="Paste Cloudinary video URL or upload below"
            />
            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 16px', background: '#f0f0f0', borderRadius: 6, fontSize: '0.9rem' }}>
                {uploading ? 'Uploading...' : 'Upload Video File'}
                <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: 'none' }} />
              </label>
            </div>
            {form.videoUrl && (
              <div style={{ marginTop: 8 }}>
                <video src={form.videoUrl} controls style={{ maxWidth: 300, borderRadius: 8 }} muted />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={e => setForm({ ...form, isPublished: e.target.checked })}
              /> Published
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Add'} Guide</button>
            {editing && <button type="button" className="admin-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All Guides ({guides.length})</h2>
        {guides.length === 0 ? <p>No guides yet. Add your first false ceiling guide above.</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Advantages</th>
                <th>Video</th>
                <th>Order</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map(g => (
                <tr key={g._id}>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</td>
                  <td>{g.advantages?.length || 0} items</td>
                  <td>{g.videoUrl ? 'Yes' : 'No'}</td>
                  <td>{g.sortOrder}</td>
                  <td>{g.isPublished ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(g)} style={{ marginRight: 8 }}>Edit</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(g._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
