import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data.success) setSettings(res.data.settings)
    })
  }, [])

  const handleChange = (path, value) => {
    const keys = path.split('.')
    const newSettings = { ...settings }
    let obj = newSettings
    for (let i = 0; i < keys.length - 1; i++) { obj = obj[keys[i]] = { ...obj[keys[i]] } }
    obj[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    await axios.put('/api/settings', settings, getToken())
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('image', file)
      const res = await axios.post('/api/upload', fd, { headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) {
        handleChange(field, res.data.url)
        alert('Image uploaded successfully!')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please check Cloudinary configuration.')
    } finally {
      setUploading(false)
    }
  }

  if (!settings) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div>
      <div className="admin-header"><h1>Website Settings</h1></div>
      {saved && <div className="toast toast-success" style={{ position: 'fixed' }}>Settings saved!</div>}
      <form onSubmit={handleSave}>
        {uploading && <div style={{ background: '#fff3cd', padding: '12px 16px', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="spinner" style={{ width: 20, height: 20, border: '3px solid #ffc107', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span>Uploading image to Cloudinary...</span>
        </div>}
        <div className="admin-card">
          <h2>Business Information</h2>
          <div className="admin-form">
            <div className="form-group"><label>Business Name</label><input value={settings.businessName} onChange={e => handleChange('businessName', e.target.value)} /></div>
            <div className="form-group"><label>Tagline</label><input value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)} /></div>
            <div className="form-group"><label>Logo</label><input value={settings.logo} onChange={e => handleChange('logo', e.target.value)} /><input type="file" accept="image/*" onChange={e => handleUpload(e, 'logo')} style={{ marginTop: 4 }} /></div>
            <div className="form-group"><label>Phone</label><input value={settings.phone} onChange={e => handleChange('phone', e.target.value)} /></div>
            <div className="form-group"><label>WhatsApp (with country code, no +)</label><input value={settings.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} /></div>
            <div className="form-group"><label>Email</label><input value={settings.email} onChange={e => handleChange('email', e.target.value)} /></div>
            <div className="form-group"><label>Address Line 1</label><input value={settings.address.line1} onChange={e => handleChange('address.line1', e.target.value)} /></div>
            <div className="form-group"><label>Address Line 2</label><input value={settings.address.line2} onChange={e => handleChange('address.line2', e.target.value)} /></div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Hero Section</h2>
          <div className="admin-form">
            <div className="form-group"><label>Heading</label><input value={settings.hero.heading} onChange={e => handleChange('hero.heading', e.target.value)} /></div>
            <div className="form-group"><label>Subtitle</label><textarea value={settings.hero.subtitle} onChange={e => handleChange('hero.subtitle', e.target.value)} rows="3" /></div>
            <div className="form-group"><label>Hero Image</label><input value={settings.hero.image} onChange={e => handleChange('hero.image', e.target.value)} /><input type="file" accept="image/*" onChange={e => handleUpload(e, 'hero.image')} style={{ marginTop: 4 }} /></div>
            <div className="form-group"><label>Primary CTA Text</label><input value={settings.hero.ctaPrimary} onChange={e => handleChange('hero.ctaPrimary', e.target.value)} /></div>
            <div className="form-group"><label>Secondary CTA Text</label><input value={settings.hero.ctaSecondary} onChange={e => handleChange('hero.ctaSecondary', e.target.value)} /></div>
          </div>
        </div>

        <div className="admin-card">
          <h2>About Page</h2>
          <div className="admin-form">
            <div className="form-group">
              <label>About Page Image</label>
              <input value={settings.about?.image || ''} onChange={e => handleChange('about.image', e.target.value)} placeholder="Image URL" />
              <input type="file" accept="image/*" onChange={e => handleUpload(e, 'about.image')} style={{ marginTop: 4 }} />
              {settings.about?.image && <img src={settings.about.image} alt="About page preview" style={{ width: '100%', maxWidth: 300, marginTop: 8, borderRadius: 8 }} />}
            </div>
            <div className="form-group">
              <label>About Page Header Background Image</label>
              <input value={settings.about?.headerImage || ''} onChange={e => handleChange('about.headerImage', e.target.value)} placeholder="Background image URL" />
              <input type="file" accept="image/*" onChange={e => handleUpload(e, 'about.headerImage')} style={{ marginTop: 4 }} />
              {settings.about?.headerImage && <img src={settings.about.headerImage} alt="Header background preview" style={{ width: '100%', maxWidth: 300, marginTop: 8, borderRadius: 8 }} />}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Google & Social</h2>
          <div className="admin-form">
            <div className="form-group"><label>Google Rating</label><input type="number" step="0.1" min="0" max="5" value={settings.googleRating} onChange={e => handleChange('googleRating', parseFloat(e.target.value))} /></div>
            <div className="form-group"><label>Google Reviews Count</label><input type="number" min="0" value={settings.googleReviewsCount} onChange={e => handleChange('googleReviewsCount', parseInt(e.target.value))} /></div>
            <div className="form-group"><label>Google Maps URL</label><input value={settings.googleMapsUrl} onChange={e => handleChange('googleMapsUrl', e.target.value)} /></div>
            <div className="form-group"><label>Google Maps Embed</label><input value={settings.googleMapsEmbed} onChange={e => handleChange('googleMapsEmbed', e.target.value)} /></div>
            <div className="form-group"><label>Google Business URL</label><input value={settings.googleBusinessUrl} onChange={e => handleChange('googleBusinessUrl', e.target.value)} /></div>
            <div className="form-group"><label>Google Review URL</label><input value={settings.googleReviewUrl} onChange={e => handleChange('googleReviewUrl', e.target.value)} /></div>
            <div className="form-group"><label>Facebook</label><input value={settings.social.facebook} onChange={e => handleChange('social.facebook', e.target.value)} /></div>
            <div className="form-group"><label>Instagram</label><input value={settings.social.instagram} onChange={e => handleChange('social.instagram', e.target.value)} /></div>
            <div className="form-group"><label>YouTube</label><input value={settings.social.youtube} onChange={e => handleChange('social.youtube', e.target.value)} /></div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Theme Colors</h2>
          <div className="admin-form">
            <div className="form-group"><label>Primary Color</label><input type="color" value={settings.theme.primaryColor} onChange={e => handleChange('theme.primaryColor', e.target.value)} /></div>
            <div className="form-group"><label>Secondary Color</label><input type="color" value={settings.theme.secondaryColor} onChange={e => handleChange('theme.secondaryColor', e.target.value)} /></div>
            <div className="form-group"><label>Accent Color</label><input type="color" value={settings.theme.accentColor} onChange={e => handleChange('theme.accentColor', e.target.value)} /></div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Footer</h2>
          <div className="admin-form">
            <div className="form-group"><label>Footer Description</label><textarea value={settings.footer.description} onChange={e => handleChange('footer.description', e.target.value)} rows="3" /></div>
            <div className="form-group"><label>Copyright</label><input value={settings.footer.copyright} onChange={e => handleChange('footer.copyright', e.target.value)} /></div>
          </div>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginBottom: 40 }}>Save All Settings</button>
      </form>
    </div>
  )
}
