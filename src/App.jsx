import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Events from './pages/Events.jsx'
import Sermons from './pages/Sermons.jsx'
import Ministries from './pages/Ministries.jsx'
import Prayer from './pages/Prayer.jsx'
import Testimonies from './pages/Testimonies.jsx'
import Gallery from './pages/Gallery.jsx'
import Give from './pages/Give.jsx'
import PlanVisit from './pages/PlanVisit.jsx'
import Contact from './pages/Contact.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminRegister from './pages/admin/AdminRegister.jsx'
import ResetPassword from './pages/admin/ResetPassword.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminEvents from './pages/admin/AdminEvents.jsx'
import AdminSermons from './pages/admin/AdminSermons.jsx'
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx'
import AdminMinistries from './pages/admin/AdminMinistries.jsx'
import AdminLeadership from './pages/admin/AdminLeadership.jsx'
import AdminPrayer from './pages/admin/AdminPrayer.jsx'
import AdminTestimonies from './pages/admin/AdminTestimonies.jsx'
import AdminVisitors from './pages/admin/AdminVisitors.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminSignupRequests from './pages/admin/AdminSignupRequests.jsx'
import AdminResetPassword from './pages/admin/AdminResetPassword.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/prayer" element={<Prayer />} />
        <Route path="/testimonies" element={<Testimonies />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/give" element={<Give />} />
        <Route path="/visit" element={<PlanVisit />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/sermons" element={<AdminSermons />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/ministries" element={<AdminMinistries />} />
        <Route path="/admin/leadership" element={<AdminLeadership />} />
        <Route path="/admin/prayer" element={<AdminPrayer />} />
        <Route path="/admin/testimonies" element={<AdminTestimonies />} />
        <Route path="/admin/visitors" element={<AdminVisitors />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/signup-requests" element={<AdminSignupRequests />} />
      </Routes>
    </AuthProvider>
  )
}
