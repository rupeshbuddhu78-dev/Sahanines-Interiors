import { useState, useEffect } from 'react'
import axios from 'axios'

const getToken = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [filter, setFilter] = useState('')

  const fetchData = async () => {
    const url = filter ? `/api/enquiries?status=${filter}` : '/api/enquiries'
    const res = await axios.get(url, getToken())
    if (res.data.success) setEnquiries(res.data.enquiries)
  }
  useEffect(() => { fetchData() }, [filter])

  const updateStatus = async (id, status) => {
    await axios.put(`/api/enquiries/${id}`, { status }, getToken())
    fetchData()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry?')) { await axios.delete(`/api/enquiries/${id}`, getToken()); fetchData() }
  }

  return (
    <div>
      <div className="admin-header"><h1>Enquiries</h1></div>
      <div className="admin-card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['', 'New', 'Contacted', 'In Progress', 'Completed', 'Closed'].map(s => (
            <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Service</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {enquiries.map(e => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td><a href={`tel:${e.phone}`}>{e.phone}</a></td>
                <td>{e.email || '-'}</td>
                <td>{e.service || '-'}</td>
                <td>
                  <select value={e.status} onChange={ev => updateStatus(e._id, ev.target.value)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd', fontSize: '0.8rem' }}>
                    <option>New</option><option>Contacted</option><option>In Progress</option><option>Completed</option><option>Closed</option>
                  </select>
                </td>
                <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td>
                  {e.message && <details style={{ fontSize: '0.8rem' }}><summary>View</summary><p style={{ marginTop: 4 }}>{e.message}</p></details>}
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(e._id)} style={{ marginTop: 4 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 && <p>No enquiries found.</p>}
      </div>
    </div>
  )
}
