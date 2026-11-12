import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  Clock3,
  Plus,
  Search,
  Timer,
  Bus,
  AlertTriangle,
  Shield,
  PhoneCall,
  Sparkles,
  BarChart3,
  TrendingUp,
  MapPin
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import QuickTracker from '../components/QuickTracker.jsx'

export const statusLabel = (status) =>
  status?.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase())

export default function PassengerDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [trackerOpen, setTrackerOpen] = useState(false)

  useEffect(() => {
    api
      .get('/passenger/dashboard')
      .then(({ data: result }) => setData(result))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-6">
          <div className="h-10 w-72 skeleton" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 skeleton" />
            ))}
          </div>
          <div className="h-72 skeleton" />
        </div>
      </div>
    )
  }

  const totalCount = data?.total || 0
  const resolvedCount = data?.resolved || 0
  const pendingCount = data?.pending || 0
  const investigationCount = data?.investigation || 0

  const resolvedPercent = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0

  return (
    <section className="page-wrap space-y-8 animate-fade-in">
      {/* Quick Tracker Modal */}
      <QuickTracker isOpen={trackerOpen} onClose={() => setTrackerOpen(false)} />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              PASSENGER COMMAND
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">APSRTC Grievance Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Namaste, {data?.fullName?.split(' ')[0] || 'Passenger'}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your journeys, monitor real-time depot investigations, and hold transit standards accountable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTrackerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Track by ID
          </button>
          <Link
            to="/raise-complaint"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs shadow-glow-crimson hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Raise a Complaint
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 3D Glass Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={Search}
          label="Total Complaints"
          value={data?.total ?? '0'}
          sub="Logged in your account"
          accent="cyan"
        />
        <Stat
          icon={Clock3}
          label="Awaiting Action"
          value={data?.pending ?? '0'}
          sub="In queue for assignment"
          accent="amber"
        />
        <Stat
          icon={Timer}
          label="Under Investigation"
          value={data?.investigation ?? '0'}
          sub="Field officer active"
          accent="blue"
        />
        <Stat
          icon={CircleCheck}
          label="Resolved / Closed"
          value={data?.resolved ?? '0'}
          sub={`${resolvedPercent}% resolution rate`}
          accent="green"
        />
      </div>

      {/* Quick Visual Progress & Category Recognizer Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution Progress */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-display">
                Grievance Resolution Progress
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {resolvedPercent}% Redressed
            </span>
          </div>

          {/* Multi-color segmented progress bar */}
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
            {totalCount > 0 ? (
              <>
                <div
                  style={{ width: `${(resolvedCount / totalCount) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                  title={`Resolved: ${resolvedCount}`}
                />
                <div
                  style={{ width: `${(investigationCount / totalCount) * 100}%` }}
                  className="h-full bg-cyan-400 transition-all duration-500"
                  title={`Investigation: ${investigationCount}`}
                />
                <div
                  style={{ width: `${(pendingCount / totalCount) * 100}%` }}
                  className="h-full bg-amber-400 rounded-r-full transition-all duration-500"
                  title={`Awaiting: ${pendingCount}`}
                />
              </>
            ) : (
              <div className="h-full w-full bg-slate-800 rounded-full" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Resolved ({resolvedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Under Investigation ({investigationCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Awaiting Action ({pendingCount})</span>
            </div>
          </div>
        </div>

        {/* APSRTC Passenger Assurance Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-cyan-950/40 border border-cyan-500/20 backdrop-blur-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-2">
              <Shield className="w-4 h-4" />
              <span>Citizen Charter SLA</span>
            </div>
            <h4 className="text-base font-bold text-white font-display mb-1">
              Guaranteed Redressal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every complaint is logged with depot telemetry and reviewed by gazetted RTC officials under the AP Public Services Guarantee.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Escalation window:</span>
            <span className="font-mono text-cyan-300 font-bold">48 Hours Max</span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table Panel */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Recent Complaint Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live updates and timeline logs on your recent submissions
            </p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            View all ({data?.recent?.length || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recent?.length ? (
          <div className="divide-y divide-slate-800/70">
            {data.recent.map((item) => (
              <Link
                to={`/complaints/${item.id}`}
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-display font-bold text-sm group-hover:scale-105 group-hover:border-cyan-500/50 transition-all flex-none">
                    {item.category?.slice(0, 1) || 'G'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {item.category}
                      </span>
                      {item.highPriority && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-400/90 font-medium">
                        {item.complaintNumber}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-slate-500" />
                        {item.busRoute || item.busNumber || 'APSRTC Route Service'}
                      </span>
                      {item.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <Status status={item.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Search className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 font-display">
              No Complaints Logged Yet
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              If you experienced an issue with timing, bus conditions, or staff on an APSRTC trip, report it here.
            </p>
            <Link
              to="/raise-complaint"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold text-xs shadow-glow-crimson hover:scale-105 transition-transform"
            >
              Submit Your First Complaint <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Immediate Helpline Strip */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-none">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-200 block">Immediate Safety Concern?</strong>
            <span className="text-slate-400">
              For on-road emergencies or immediate assistance, dial 112 (National Emergency) or 181 (Women Helpline).
            </span>
          </div>
        </div>
        <a
          href="tel:112"
          className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-semibold transition-colors"
        >
          Call 112
        </a>
      </div>
    </section>
  )
}

/* 3D Glass Stat Card */
export function Stat({ icon: Icon, label, value, sub, accent = 'cyan' }) {
  const getStyles = () => {
    switch (accent) {
      case 'cyan':
        return {
          border: 'border-cyan-500/30',
          bg: 'from-cyan-950/30 to-slate-900/90',
          text: 'text-cyan-400',
          iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        }
      case 'amber':
        return {
          border: 'border-amber-500/30',
          bg: 'from-amber-950/30 to-slate-900/90',
          text: 'text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        }
      case 'blue':
        return {
          border: 'border-blue-500/30',
          bg: 'from-blue-950/30 to-slate-900/90',
          text: 'text-blue-400',
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        }
      case 'green':
        return {
          border: 'border-emerald-500/30',
          bg: 'from-emerald-950/30 to-slate-900/90',
          text: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        }
      case 'red':
      default:
        return {
          border: 'border-rose-500/30',
          bg: 'from-rose-950/30 to-slate-900/90',
          text: 'text-rose-400',
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        }
    }
  }

  const s = getStyles()

  return (
    <article
      className={`p-5 rounded-2xl bg-gradient-to-b ${s.bg} border ${s.border} backdrop-blur-xl shadow-card card-3d`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-semibold uppercase font-mono tracking-wider text-[11px]">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${s.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <strong className={`block text-3xl sm:text-4xl font-extrabold ${s.text} font-display my-1`}>
        {value}
      </strong>
      <span className="block text-[11px] text-slate-400 truncate">{sub}</span>
    </article>
  )
}

/* Status Pill */
export function Status({ status }) {
  const norm = status?.toLowerCase()
  return <span className={`status-pill status-${norm}`}>{statusLabel(status)}</span>
}
