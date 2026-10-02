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
    thumbnailUrl: '',
    isPublished: true,
    sortOrder: 0
  })
  const [newAdvantage, setNewAdvantage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('') // '', 'uploading', 'success', 'error'
  const [uploadSpeed, setUploadSpeed] = useState(0) // bytes per second
  const [uploadTimeLeft, setUploadTimeLeft] = useState(0) // seconds remaining
  const [uploadFileSize, setUploadFileSize] = useState(0) // total file size in bytes
  const [uploadChunkInfo, setUploadChunkInfo] = useState('') // e.g., "Chunk 15/38"
  const [uploadingThumb, setUploadingThumb] = useState(false)

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
    setForm({ title: '', description: '', advantages: [], videoUrl: '', thumbnailUrl: '', isPublished: true, sortOrder: 0 })
    setEditing(null)
    setNewAdvantage('')
    setUploadProgress(0)
    setUploadStatus('')
    setUploadSpeed(0)
    setUploadTimeLeft(0)
    setUploadFileSize(0)
    setUploadChunkInfo('')
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

    // Check file size (max 1GB)
    const maxMB = 1024
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Video file size must be under ${maxMB}MB (1GB). Current: ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
      e.target.value = ''
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Session expired. Please login again.')
      navigate('/admin/login')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('uploading')
    setUploadSpeed(0)
    setUploadTimeLeft(0)
    setUploadFileSize(file.size)

    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1)

    try {
      // Step 1: Get Cloudinary signature from server
      const sigRes = await axios.post('/api/cloudinary-signature', { resourceType: 'video' }, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 30000
      })

      if (!sigRes.data.success) {
        throw new Error('Failed to get upload signature')
      }

      const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      const uniqueUploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Step 2: Chunked upload for reliability on slow networks
      const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      let bytesUploaded = 0
      let lastTime = Date.now()
      let lastBytes = 0

      setUploadChunkInfo(`Starting upload... 0/${totalChunks} chunks`)

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)
        const contentRange = `bytes ${start}-${end - 1}/${file.size}`

        setUploadChunkInfo(`Uploading chunk ${chunkIndex + 1}/${totalChunks}...`)

        // Retry each chunk up to 5 times
        let chunkSuccess = false
        for (let attempt = 1; attempt <= 5; attempt++) {
          try {
            const formData = new FormData()
            formData.append('file', chunk)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            formData.append('folder', folder)

            const res = await axios.post(uploadUrl, formData, {
              headers: {
                'X-Unique-Upload-Id': uniqueUploadId,
                'Content-Range': contentRange
              },
              timeout: 300000 // 5 min per chunk
            })

            // Last chunk returns the final URL
            if (chunkIndex === totalChunks - 1 && res.data.secure_url) {
              setForm(prev => ({ ...prev, videoUrl: res.data.secure_url }))
            }

            bytesUploaded += (end - start)
            chunkSuccess = true
            break
          } catch (chunkErr) {
            if (attempt < 5) {
              setUploadChunkInfo(`Chunk ${chunkIndex + 1}/${totalChunks} failed, retrying (${attempt}/5)...`)
              // Wait before retry (exponential backoff)
              await new Promise(r => setTimeout(r, attempt * 2000))
            } else {
              throw new Error(`Chunk ${chunkIndex + 1}/${totalChunks} failed after 5 attempts: ${chunkErr.message}`)
            }
          }
        }

        if (!chunkSuccess) {
          throw new Error(`Upload failed at chunk ${chunkIndex + 1}/${totalChunks}`)
        }

        // Update progress
        const percent = Math.round((bytesUploaded * 100) / file.size)
        setUploadProgress(percent)

        // Calculate speed and time remaining
        const now = Date.now()
        const elapsed = (now - lastTime) / 1000
        if (elapsed > 0.5) {
          const recentBytes = bytesUploaded - lastBytes
          const bytesPerSec = recentBytes / elapsed
          setUploadSpeed(bytesPerSec)

          const remainingBytes = file.size - bytesUploaded
          const secondsLeft = bytesPerSec > 0 ? remainingBytes / bytesPerSec : 0
          setUploadTimeLeft(secondsLeft)

          lastBytes = bytesUploaded
          lastTime = now
        }
      }

      setUploadChunkInfo('Upload complete!')
      setUploadStatus('success')
      setUploadProgress(100)
      setUploadSpeed(0)
      setUploadTimeLeft(0)
    } catch (err) {
      setUploadStatus('error')
      setUploadSpeed(0)
      setUploadTimeLeft(0)
      setUploadChunkInfo('')
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Unknown error'
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.')
        navigate('/admin/login')
      } else {
        alert(`Video upload failed: ${errorMsg}\n\nFile size: ${fileSizeMB}MB\n\nTip: Use Wi-Fi for large files, or paste a Cloudinary video URL directly.`)
      }
    }
    setUploading(false)
    setTimeout(() => {
      e.target.value = ''
      if (uploadStatus === 'error') setUploadStatus('')
    }, 1000)
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const maxMB = 10
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Image file size must be under ${maxMB}MB.`)
      e.target.value = ''
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Session expired. Please login again.')
      navigate('/admin/login')
      return
    }

    setUploadingThumb(true)

    try {
      // Get Cloudinary signature from server
      const sigRes = await axios.post('/api/cloudinary-signature', { resourceType: 'image' }, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 30000
      })

      if (!sigRes.data.success) {
        throw new Error('Failed to get upload signature')
      }

      const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data

      // Upload directly to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', apiKey)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)
      formData.append('folder', folder)

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const uploadRes = await axios.post(uploadUrl, formData, { timeout: 120000 })

      if (uploadRes.data.secure_url) {
        setForm(prev => ({ ...prev, thumbnailUrl: uploadRes.data.secure_url }))
      } else {
        throw new Error('Upload response missing URL')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.')
        navigate('/admin/login')
      } else {
        alert(`Thumbnail upload failed: ${err.response?.data?.error?.message || err.message}`)
      }
    }
    setUploadingThumb(false)
    e.target.value = ''
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
      thumbnailUrl: g.thumbnailUrl || '',
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
            <label>Thumbnail Image (Cloudinary)</label>
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="Upload thumbnail below or paste Cloudinary image URL directly"
              disabled={uploadingThumb}
            />
            <div style={{ marginTop: 10 }}>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: uploadingThumb ? 'wait' : 'pointer',
                padding: '10px 18px',
                background: uploadingThumb ? '#e0e0e0' : '#f0f0f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                pointerEvents: uploadingThumb ? 'none' : 'auto',
                border: '2px dashed #ccc'
              }}>
                {uploadingThumb ? 'Uploading...' : '🖼️ Upload Thumbnail Image (max 10MB)'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingThumb}
                />
              </label>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 6 }}>
                This image will be shown as the video poster/thumbnail on the Guides page. Recommended size: 720x1280 (9:16 ratio).
              </p>
            </div>

            {/* Thumbnail Preview */}
            {form.thumbnailUrl && !uploadingThumb && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6, wordBreak: 'break-all' }}>{form.thumbnailUrl}</p>
                <img
                  src={form.thumbnailUrl}
                  alt="Thumbnail preview"
                  style={{ maxWidth: 200, maxHeight: 350, borderRadius: 8, border: '1px solid #eee', objectFit: 'cover' }}
                />
              </div>
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
                {uploading ? 'Uploading...' : '📁 Upload Video File (max 1GB)'}
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
              <div style={{ marginTop: 14, padding: 16, background: '#f9f9f9', borderRadius: 10, border: '1px solid #e0e0e0' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333' }}>
                    Uploading video...
                  </span>
                  <span style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: uploadProgress >= 100 ? '#27ae60' : 'var(--primary)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {uploadProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: 24,
                  background: '#e0e0e0',
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: uploadProgress >= 100
                      ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                      : 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
                    borderRadius: 12,
                    transition: 'width 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Animated stripes */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px)',
                      animation: 'stripes-move 1s linear infinite'
                    }} />
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: uploadProgress > 50 ? 'white' : '#333',
                    textShadow: uploadProgress > 50 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                  }}>
                    {uploadProgress}%
                  </span>
                </div>

                {/* Stats row: File size, Uploaded, Speed, Time left */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '8px 16px',
                  marginTop: 12,
                  padding: '10px 12px',
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #eee'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>File Size</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                      {uploadFileSize >= 1024 * 1024 * 1024
                        ? (uploadFileSize / 1024 / 1024 / 1024).toFixed(2) + ' GB'
                        : (uploadFileSize / 1024 / 1024).toFixed(1) + ' MB'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Uploaded</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                      {((uploadFileSize * uploadProgress / 100) / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Speed</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                      {uploadSpeed >= 1024 * 1024
                        ? (uploadSpeed / 1024 / 1024).toFixed(1) + ' MB/s'
                        : uploadSpeed >= 1024
                          ? (uploadSpeed / 1024).toFixed(0) + ' KB/s'
                          : uploadSpeed > 0 ? 'Starting...' : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Time Left</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                      {uploadTimeLeft > 3600
                        ? Math.floor(uploadTimeLeft / 3600) + 'h ' + Math.floor((uploadTimeLeft % 3600) / 60) + 'm'
                        : uploadTimeLeft > 60
                          ? Math.floor(uploadTimeLeft / 60) + 'm ' + Math.floor(uploadTimeLeft % 60) + 's'
                          : uploadTimeLeft > 0
                            ? Math.floor(uploadTimeLeft) + 's'
                            : uploadSpeed > 0 ? 'Almost done...' : '—'}
                    </div>
                  </div>
                </div>

                {/* Chunk progress info */}
                {uploadChunkInfo && (
                  <div style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    background: '#fff8e1',
                    borderRadius: 6,
                    border: '1px solid #ffe082',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f57c00' }}>
                      {uploadChunkInfo}
                    </span>
                  </div>
                )}

                <p style={{ fontSize: '0.78rem', color: '#999', marginTop: 8, marginBottom: 0, textAlign: 'center' }}>
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
                <th>Thumbnail</th>
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
                  <td>
                    {g.thumbnailUrl ? (
                      <img src={g.thumbnailUrl} alt={g.title} style={{ width: 50, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                    ) : (
                      <span style={{ color: '#ccc', fontSize: '0.8rem' }}>No image</span>
                    )}
                  </td>
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

