import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminFalseCeilingGuides() {
  const navigate = useNavigate()
  const [guides, setGuides] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('') // '', 'uploading', 'success', 'error'

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/false-ceiling-guides/all', getToken())
      if (res.data.success) setGuides(res.data.guides)
      setAuthError(false)
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthError(true)
        // Token expire ho gaya - redirect to login after 2 seconds
        setTimeout(() => {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          navigate('/admin/login')
        }, 2000)
      } else {
        console.error('Failed to fetch guides:', err)
      }
    }
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setForm({ title: '', description: '', advantages: [], videoUrl: '', isPublished: true, sortOrder: 0 })
    setEditing(null)
    setNewAdvantage('')
    setUploadProgress(0)
    setUploadStatus('')
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

    // Check file size (max 200MB)
    const maxMB = 200
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Video file size must be under ${maxMB}MB. Current: ${(file.size / 1024 / 1024).toFixed(1)}MB. Please compress the video or paste a Cloudinary URL directly.`)
      e.target.value = ''
      return
    }

    // Check token before upload
    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Session expired. Please login again.')
      navigate('/admin/login')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('uploading')
    const formData = new FormData()
    formData.append('video', file)

    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1)

    try {
      const res = await axios.post('/api/upload-video', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 600000, // 10 minutes timeout
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        }
      })
      if (res.data.success) {
        setForm(prev => ({ ...prev, videoUrl: res.data.url }))
        setUploadStatus('success')
        setUploadProgress(100)
      }
    } catch (err) {
      setUploadStatus('error')
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.')
        navigate('/admin/login')
      } else {
        alert(`Video upload failed: ${errorMsg}\n\nFile size: ${fileSizeMB}MB\n\nYou can paste a Cloudinary video URL directly in the Video URL field above.`)
      }
    }
    setUploading(false)
    // Reset file input after a delay so user can see the status
    setTimeout(() => {
      e.target.value = ''
      if (uploadStatus === 'error') setUploadStatus('')
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await axios.put(`/api/false-ceiling-guides/${editing}`, form, getToken())
      } else {
        await axios.post('/api/false-ceiling-guides', form, getToken())
      }
      resetForm()
      fetchData()
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.')
        navigate('/admin/login')
      } else {
        alert('Failed to save guide. Please try again.')
        console.error(err)
      }
    }
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
      try {
        await axios.delete(`/api/false-ceiling-guides/${id}`, getToken())
        fetchData()
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Session expired. Please login again.')
          navigate('/admin/login')
        }
      }
    }
  }

  if (authError) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <h2 style={{ color: '#e74c3c' }}>Session Expired</h2>
        <p>Redirecting to login...</p>
      </div>
    )
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
              placeholder="e.g. Questions to Ask Your False Ceiling Contractor in Guwahati Before Construction"
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
            <label>Video (Cloudinary)</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="Upload video below or paste Cloudinary URL directly"
              disabled={uploading}
            />
            <div style={{ marginTop: 10 }}>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: uploading ? 'wait' : 'pointer',
                padding: '10px 18px',
                background: uploading ? '#e0e0e0' : '#f0f0f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                pointerEvents: uploading ? 'none' : 'auto',
                border: '2px dashed #ccc'
              }}>
                {uploading ? 'Uploading...' : '📁 Upload Video File (max 200MB)'}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 6 }}>
                Video will be uploaded to Cloudinary. You can also paste any Cloudinary video URL directly in the field above.
              </p>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div style={{ marginTop: 14, padding: 14, background: '#f9f9f9', borderRadius: 8, border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Uploading video...</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: uploadProgress >= 100 ? '#27ae60' : 'var(--primary)' }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: 20,
                  background: '#e0e0e0',
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: uploadProgress >= 100
                      ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                      : 'linear-gradient(90deg, var(--primary), #4a90d9)',
                    borderRadius: 10,
                    transition: 'width 0.3s ease'
                  }} />
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: uploadProgress > 50 ? 'white' : '#333'
                  }}>
                    {uploadProgress}%
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 6 }}>
                  Please do not close this page. Large videos may take a few minutes.
                </p>
              </div>
            )}

            {/* Upload Success */}
            {!uploading && uploadStatus === 'success' && form.videoUrl && (
              <div style={{ marginTop: 14, padding: 12, background: '#e8f5e9', borderRadius: 8, border: '1px solid #a5d6a7' }}>
                <p style={{ fontSize: '0.9rem', color: '#2e7d32', fontWeight: 600, margin: 0 }}>
                  ✓ Video uploaded successfully!
                </p>
              </div>
            )}

            {/* Video Preview */}
            {form.videoUrl && !uploading && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6, wordBreak: 'break-all' }}>{form.videoUrl}</p>
                <video src={form.videoUrl} controls style={{ maxWidth: 320, borderRadius: 8, border: '1px solid #eee' }} muted />
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
            <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
              {uploading ? 'Please wait - uploading...' : (editing ? 'Update' : 'Add') + ' Guide'}
            </button>
            {editing && <button type="button" className="admin-btn" onClick={resetForm} disabled={uploading}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All Guides ({loading ? 'Loading...' : guides.length})</h2>
        {loading ? (
          <p>Loading guides...</p>
        ) : guides.length === 0 ? (
          <p>No guides yet. Add your first false ceiling guide above.</p>
        ) : (
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
                  <td>{g.videoUrl ? '✓' : '—'}</td>
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

