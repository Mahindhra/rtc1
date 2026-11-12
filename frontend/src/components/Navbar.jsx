import { useState, useEffect } from 'react'
import { Bell, Menu, ShieldCheck, Home, User, Clock, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import api from '../services/api.js'

export default function Navbar({ onMenu, user }) {
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (user?.role !== 'PASSENGER') return
    api
      .get('/passenger/notifications/unread-count')
      .then(({ data }) => setUnread(data.unread || 0))
      .catch(() => setUnread(0))
  }, [location.pathname, user?.role])

  const getSectionTitle = () => {
    if (user?.role === 'ADMIN') return 'Administration Command'
    if (user?.role === 'RTC_OFFICER') return 'Field Officer Workspace'
    return 'Passenger Care Console'
  }

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-slate-800/80 bg-[#070f22]/85 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
      {/* Left Crumb & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Link
            to="/"
            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            title="Public Transit Portal"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APSRTC</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-semibold text-white tracking-wide font-display">
            {getSectionTitle()}
          </span>
        </div>
      </div>

      {/* Right User & Utility Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time IST clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time} IST</span>
        </div>

        {/* Unread Notifications (Passenger only) */}
        {user?.role === 'PASSENGER' && (
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              </span>
            )}
          </Link>
        )}

        {/* Security badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Portal</span>
        </div>

        {/* User profile avatar pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white">
            {user?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
            {user?.fullName?.split(' ')[0]}
          </span>
        </Link>
      </div>
    </header>
  )
}
