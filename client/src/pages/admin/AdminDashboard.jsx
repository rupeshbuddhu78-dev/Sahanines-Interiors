import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ services: 0, projects: 0, gallery: 0, testimonials: 0, enquiries: 0, completed: 0 })
  const [recentEnquiries, setRecentEnquiries] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      try {
        const [serv, proj, gal, test, enq] = await Promise.all([
          axios.get('/api/services/all', config),
          axios.get('/api/projects/all', config),
          axios.get('/api/gallery/all', config),
          axios.get('/api/testimonials/all', config),
          axios.get('/api/enquiries', config)
        ])
        setStats({
          services: serv.data.services?.length || 0,
          projects: proj.data.projects?.length || 0,
          gallery: gal.data.images?.length || 0,
          testimonials: test.data.testimonials?.length || 0,
          enquiries: enq.data.enquiries?.filter(e => e.status === 'New').length || 0,
          completed: enq.data.enquiries?.filter(e => e.status === 'Completed').length || 0
        })
        setRecentEnquiries(enq.data.enquiries?.slice(0, 5) || [])
      } catch (err) { console.error(err) }
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>
      <div className="admin-stats">
        <div className="admin-stat-card"><div className="label">Services</div><div className="value">{stats.services}</div></div>
        <div className="admin-stat-card"><div className="label">Projects</div><div className="value">{stats.projects}</div></div>
        <div className="admin-stat-card"><div className="label">Gallery Images</div><div className="value">{stats.gallery}</div></div>
        <div className="admin-stat-card"><div className="label">Testimonials</div><div className="value">{stats.testimonials}</div></div>
        <div className="admin-stat-card"><div className="label">New Enquiries</div><div className="value">{stats.enquiries}</div></div>
        <div className="admin-stat-card"><div className="label">Completed</div><div className="value">{stats.completed}</div></div>
      </div>

      <div className="admin-card">
        <h2>Recent Enquiries</h2>
        {recentEnquiries.length === 0 ? <p>No enquiries yet.</p> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Service</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recentEnquiries.map(e => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.service || '-'}</td>
                  <td><span className={`status-badge status-${e.status.replace(' ', '')}`}>{e.status}</span></td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
