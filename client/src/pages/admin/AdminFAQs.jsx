import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ question: '', answer: '', isPublished: true, sortOrder: 0 })

  const fetchData = async () => {
    const res = await axios.get('/api/faqs/all', getToken())
    if (res.data.success) setFaqs(res.data.faqs)
  }
  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await axios.put(`/api/faqs/${editing}`, form, getToken())
    else await axios.post('/api/faqs', form, getToken())
    setForm({ question: '', answer: '', isPublished: true, sortOrder: 0 })
    setEditing(null)
    fetchData()
  }

  const handleEdit = (f) => { setEditing(f._id); setForm({ question: f.question, answer: f.answer, isPublished: f.isPublished, sortOrder: f.sortOrder }) }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await axios.delete(`/api/faqs/${id}`, getToken()); fetchData() } }

  return (
    <div>
      <div className="admin-header"><h1>FAQs</h1></div>
      <div className="admin-card">
        <h2>{editing ? 'Edit' : 'Add'} FAQ</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Question</label><input value={form.question} onChange={e => setForm({...form, question: e.target.value})} required /></div>
          <div className="form-group"><label>Answer</label><textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows="4" required /></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} /> Published</label></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="admin-btn" onClick={() => { setEditing(null); setForm({ question: '', answer: '', isPublished: true, sortOrder: 0 }) }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="admin-card">
        <h2>All FAQs ({faqs.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Question</th><th>Order</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f._id}>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.question}</td>
                <td>{f.sortOrder}</td><td>{f.isPublished ? 'Yes' : 'No'}</td>
                <td>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(f)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(f._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
