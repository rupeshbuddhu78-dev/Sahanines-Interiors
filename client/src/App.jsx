import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/common/WhatsAppButton'
import MobileBottomBar from './components/layout/MobileBottomBar'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import Reviews from './pages/Reviews'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// SEO Landing Pages
import FalseCeilingGuwahati from './pages/FalseCeilingGuwahati'
import GypsumFalseCeilingGuwahati from './pages/GypsumFalseCeilingGuwahati'
import PopCeilingGuwahati from './pages/PopCeilingGuwahati'
import PvcCeilingGuwahati from './pages/PvcCeilingGuwahati'
import InteriorDesignGuwahati from './pages/InteriorDesignGuwahati'

// Admin
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminServices from './pages/admin/AdminServices'
import AdminProjects from './pages/admin/AdminProjects'
import AdminGallery from './pages/admin/AdminGallery'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminFAQs from './pages/admin/AdminFAQs'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSEO from './pages/admin/AdminSEO'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="seo" element={<AdminSEO />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<><Header /><Home /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/services" element={<><Header /><Services /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/services/:slug" element={<><Header /><ServiceDetail /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/projects" element={<><Header /><Projects /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/gallery" element={<><Header /><Gallery /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/reviews" element={<><Header /><Reviews /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/faq" element={<><Header /><FAQ /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/false-ceiling-guwahati" element={<><Header /><FalseCeilingGuwahati /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/gypsum-false-ceiling-guwahati" element={<><Header /><GypsumFalseCeilingGuwahati /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/pop-ceiling-guwahati" element={<><Header /><PopCeilingGuwahati /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/pvc-ceiling-guwahati" element={<><Header /><PvcCeilingGuwahati /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="/interior-design-guwahati" element={<><Header /><InteriorDesignGuwahati /><Footer /><WhatsAppButton /><MobileBottomBar /></>} />
        <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
      </Routes>
    </>
  )
}

export default App
