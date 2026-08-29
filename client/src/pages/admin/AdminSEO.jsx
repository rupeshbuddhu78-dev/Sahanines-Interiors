import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminSEO() {
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data.success) setSettings(res.data.settings)
    })
  }, [])

  const handleChange = (field, value) => {
    setSettings({ ...settings, seo: { ...settings.seo, [field]: value } })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    await axios.put('/api/settings', { seo: settings.seo }, getToken())
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    const res = await axios.post('/api/upload', fd, { headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' } })
    if (res.data.success) handleChange('ogImage', res.data.url)
  }

  if (!settings) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div>
      <div className="admin-header"><h1>SEO Settings</h1></div>
      {saved && <div className="toast toast-success" style={{ position: 'fixed' }}>SEO settings saved!</div>}
      <form onSubmit={handleSave}>
        <div className="admin-card">
          <h2>Default SEO</h2>
          <div className="admin-form">
            <div className="form-group"><label>Default Title</label><input value={settings.seo.defaultTitle} onChange={e => handleChange('defaultTitle', e.target.value)} /></div>
            <div className="form-group"><label>Default Meta Description</label><textarea value={settings.seo.defaultDescription} onChange={e => handleChange('defaultDescription', e.target.value)} rows="3" /></div>
            <div className="form-group"><label>OG Image</label><input value={settings.seo.ogImage} onChange={e => handleChange('ogImage', e.target.value)} /><input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 4 }} /></div>
            {settings.seo.ogImage && <img src={settings.seo.ogImage} alt="OG Preview" style={{ width: 200, borderRadius: 8, marginTop: 8 }} />}
          </div>
        </div>

        <div className="admin-card">
          <h2>Verification & Analytics</h2>
          <div className="admin-form">
            <div className="form-group"><label>Google Verification Code</label><input value={settings.seo.googleVerification} onChange={e => handleChange('googleVerification', e.target.value)} placeholder="Google site verification tag content" /></div>
            <div className="form-group"><label>Google Analytics ID</label><input value={settings.seo.analyticsId} onChange={e => handleChange('analyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
            <div className="form-group"><label>Search Console Verification</label><input value={settings.seo.searchConsoleVerification} onChange={e => handleChange('searchConsoleVerification', e.target.value)} /></div>
          </div>
        </div>

        <div className="admin-card" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
          <h2 style={{ color: '#856404' }}>Important Notes</h2>
          <ul style={{ color: '#856404', fontSize: '0.9rem', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>The sitemap is automatically generated at /sitemap.xml</li>
            <li style={{ marginBottom: 8 }}>robots.txt allows search engine crawling of public pages</li>
            <li style={{ marginBottom: 8 }}>Each service and project page has its own SEO title and description</li>
            <li style={{ marginBottom: 8 }}>FAQ structured data is added automatically when FAQs are displayed</li>
            <li>Make sure to add Google Analytics ID after deployment</li>
          </ul>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginBottom: 40 }}>Save SEO Settings</button>
      </form>
    </div>
  )
}
