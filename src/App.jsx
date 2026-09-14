import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext.jsx'
import AdminRoute from './components/AdminRoute.jsx'

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

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* PUBLIC WEBSITE */}
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

        {/* PUBLIC AUTH */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/reset-password"
          element={<ResetPassword />}
        />

        {/* PROTECTED ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/sermons"
          element={
            <AdminRoute>
              <AdminSermons />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <AdminRoute>
              <AdminAnnouncements />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ministries"
          element={
            <AdminRoute>
              <AdminMinistries />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/leadership"
          element={
            <AdminRoute>
              <AdminLeadership />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/prayer"
          element={
            <AdminRoute>
              <AdminPrayer />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/testimonies"
          element={
            <AdminRoute>
              <AdminTestimonies />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <AdminRoute>
              <AdminVisitors />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
  path="/admin/signup-requests"
  element={
    <AdminRoute>
      <AdminSignupRequests />
    </AdminRoute>
  }
/>

      </Routes>
    </AuthProvider>
  )
}
