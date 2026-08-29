import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', review: '', rating: 5, isPublished: true })

  const fetchData = async () => {
    const res = await axios.get('/api/testimonials/all', getToken())
    if (res.data.success) setTestimonials(res.data.testimonials)
  }
  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await axios.put(`/api/testimonials/${editing}`, form, getToken())
    else await axios.post('/api/testimonials', form, getToken())
    setForm({ name: '', review: '', rating: 5, isPublished: true })
    setEditing(null)
    fetchData()
  }

  const handleEdit = (t) => { setEditing(t._id); setForm({ name: t.name, review: t.review, rating: t.rating, isPublished: t.isPublished }) }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await axios.delete(`/api/testimonials/${id}`, getToken()); fetchData() } }

  return (
    <div>
      <div className="admin-header"><h1>Testimonials</h1></div>
      <div className="admin-card">
        <h2>{editing ? 'Edit' : 'Add'} Testimonial</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Review</label><textarea value={form.review} onChange={e => setForm({...form, review: e.target.value})} rows="4" required /></div>
          <div className="form-group"><label>Rating (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} /> Published</label></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="admin-btn" onClick={() => { setEditing(null); setForm({ name: '', review: '', rating: 5, isPublished: true }) }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="admin-card">
        <h2>All Testimonials ({testimonials.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Rating</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td><td>{'★'.repeat(t.rating)}</td><td>{t.isPublished ? 'Yes' : 'No'}</td>
                <td>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(t)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
