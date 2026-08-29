import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | Sahanines Interiors</title></Helmet>
      <div className="not-found">
        <div>
          <h1>404</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </div>
    </>
  )
}
