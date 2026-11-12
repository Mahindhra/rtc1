import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PassengerDashboard from './pages/PassengerDashboard.jsx'
import OfficerDashboard from './pages/OfficerDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import RaiseComplaint from './pages/RaiseComplaint.jsx'
import MyComplaints from './pages/MyComplaints.jsx'
import ComplaintDetails from './pages/ComplaintDetails.jsx'
import Notifications from './pages/Notifications.jsx'
import AdminReports from './pages/AdminReports.jsx'
import { UserRound, Mail, Phone, MapPin, ShieldCheck, BusFront, ArrowLeft } from 'lucide-react'

const SessionContext = createContext(null)
export const useSession = () => useContext(SessionContext)

function getInitialUser() {
  try {
    return JSON.parse(localStorage.getItem('rtc-user') || 'null')
  } catch {
    return null
  }
}

function PortalLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useSession()

  return (
    <div className="portal-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="portal-main">
        <Navbar onMenu={() => setMenuOpen(!menuOpen)} user={user} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      {menuOpen && (
        <button
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

function Profile() {
  const { user } = useSession()
  const dashboard =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'RTC_OFFICER' ? '/officer' : '/dashboard'

  return (
    <section className="page-wrap max-w-2xl space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
            IDENTITY & SECURITY
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your verified APSRTC Passenger Care credentials.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-glow-cyan">
            {user?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">{user?.fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {user?.role?.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400">APSRTC Verified User</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <Mail className="w-4 h-4 text-cyan-400 flex-none" />
            <div>
              <span className="text-slate-500 block text-[10px]">Email Address</span>
              <span className="font-semibold text-slate-200 font-mono">{user?.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <Phone className="w-4 h-4 text-emerald-400 flex-none" />
            <div>
              <span className="text-slate-500 block text-[10px]">Mobile Number</span>
              <span className="font-semibold text-slate-200 font-mono">
                {user?.mobileNumber || 'Not provided'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3 sm:col-span-2">
            <MapPin className="w-4 h-4 text-rose-400 flex-none" />
            <div>
              <span className="text-slate-500 block text-[10px]">Registered City / Region</span>
              <span className="font-semibold text-slate-200">{user?.city || 'Andhra Pradesh'}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated via APSRTC JWT
          </span>
          <span className="font-mono text-cyan-400">Status: Active</span>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [user, setUser] = useState(getInitialUser)

  const signIn = (session) => {
    localStorage.setItem('rtc-token', session.token)
    localStorage.setItem('rtc-user', JSON.stringify(session.user))
    setUser(session.user)
  }

  const signOut = () => {
    localStorage.removeItem('rtc-token')
    localStorage.removeItem('rtc-user')
    setUser(null)
  }

  const dashboard =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'RTC_OFFICER' ? '/officer' : '/dashboard'

  return (
    <SessionContext.Provider value={{ user, signIn, signOut }}>
      <ToastProvider>
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            {/* Public Cinematic Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to={dashboard} replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to={dashboard} replace /> : <Register />}
            />

            {/* Protected Portal Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PortalLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute roles={['PASSENGER']}>
                      <PassengerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/raise-complaint"
                  element={
                    <ProtectedRoute roles={['PASSENGER']}>
                      <RaiseComplaint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/complaints"
                  element={
                    <ProtectedRoute roles={['PASSENGER']}>
                      <MyComplaints />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/complaints/:id"
                  element={
                    <ProtectedRoute>
                      <ComplaintDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer"
                  element={
                    <ProtectedRoute roles={['RTC_OFFICER']}>
                      <OfficerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute roles={['PASSENGER']}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SessionContext.Provider>
  )
}

export default App
