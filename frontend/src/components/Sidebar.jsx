import {
  Activity,
  BusFront,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
  X,
  FileText,
  Home,
  ShieldAlert,
  ExternalLink
} from 'lucide-react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useSession } from '../App.jsx'

export default function Sidebar({ open, onNavigate }) {
  const { user, signOut } = useSession()
  const navigate = useNavigate()
  const admin = user?.role === 'ADMIN'
  const officer = user?.role === 'RTC_OFFICER'

  const links = admin
    ? [
        ['Overview', '/admin', LayoutDashboard],
        ['Complaints', '/admin?view=complaints', ClipboardList],
        ['People & Roles', '/admin?view=users', Users],
        ['Reports & Audit', '/admin/reports', FileText],
      ]
    : officer
    ? [['Assigned Cases', '/officer', ClipboardList]]
    : [
        ['Dashboard', '/dashboard', LayoutDashboard],
        ['Raise Complaint', '/raise-complaint', FilePlus2],
        ['My Complaints', '/complaints', ClipboardList],
        ['Notifications', '/notifications', Activity],
      ]

  const logout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  const roleBadge = () => {
    if (admin) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
          ADMIN HQ
        </span>
      )
    }
    if (officer) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
          RTC OFFICER
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 border border-blue-500/40 text-blue-300">
        PASSENGER
      </span>
    )
  }

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#060c1d] border-r border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 p-0.5 shadow-glow-crimson group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#070f22] rounded-[10px] flex items-center justify-center">
                <BusFront className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <strong className="font-extrabold text-white text-base font-display">APSRTC</strong>
                <span className="text-cyan-400 font-bold text-base">care</span>
              </div>
              <small className="text-[10px] text-slate-400 block tracking-wider uppercase">
                Passenger Command
              </small>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={onNavigate}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-6">
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            WORKSPACE NAVIGATION
          </div>
          <nav className="space-y-1.5">
            {links.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/admin' || path === '/dashboard' || path === '/officer'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-l-4 border-cyan-400 text-white shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-cyan-400/80 flex-none" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Public Portal Shortcut */}
        <div className="mt-6 pt-4 border-t border-slate-800/60">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-500" />
              Public Landing Page
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </Link>
        </div>
      </div>

      {/* Bottom User Profile & Sign Out */}
      <div className="pt-6 border-t border-slate-800/80 space-y-3">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`
          }
        >
          <UserRound className="w-4 h-4 text-slate-400" />
          <span>My Profile</span>
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-glow-cyan flex-none">
            {user?.fullName?.slice(0, 1)?.toUpperCase() || 'P'}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-white truncate">{user?.fullName}</h5>
            <div className="mt-0.5">{roleBadge()}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] flex-none" />
        </div>

        <p className="text-[10px] text-slate-500 text-center leading-tight">
          Andhra Pradesh State Road Transport Corporation
        </p>
      </div>
    </aside>
  )
}
