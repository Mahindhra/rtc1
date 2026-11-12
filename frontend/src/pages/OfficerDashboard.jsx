import { useEffect, useState, useMemo } from 'react'
import {
  ArrowUpRight,
  ClipboardCheck,
  Clock3,
  Search,
  AlertTriangle,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Bus,
  User,
  Radio,
  FileCheck2,
  Flame
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { Status, Stat } from './PassengerDashboard.jsx'

export default function OfficerDashboard() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL') // ALL, HIGH_PRIORITY, ACTIVE, RESOLVED

  useEffect(() => {
    api
      .get('/officer/complaints')
      .then(({ data }) => setItems(data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const active = items.filter((item) => !['RESOLVED', 'CLOSED'].includes(item.status)).length
  const resolved = items.filter((item) => ['RESOLVED', 'CLOSED'].includes(item.status)).length
  const highPriorityCases = items.filter((item) => item.highPriority && !['RESOLVED', 'CLOSED'].includes(item.status))

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = `${item.complaintNumber} ${item.passengerName} ${item.category} ${item.busNumber || ''} ${item.busRoute || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())

      if (!matchSearch) return false

      if (filter === 'HIGH_PRIORITY') return item.highPriority
      if (filter === 'ACTIVE') return !['RESOLVED', 'CLOSED'].includes(item.status)
      if (filter === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(item.status)
      return true
    })
  }, [items, search, filter])

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-6">
          <div className="h-10 w-72 skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 skeleton" />
            ))}
          </div>
          <div className="h-96 skeleton" />
        </div>
      </div>
    )
  }

  return (
    <section className="page-wrap space-y-8 animate-fade-in">
      {/* Officer Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              OFFICER DISPATCH TERMINAL
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">APSRTC Field Jurisdiction</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Assigned Investigation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review passenger incident logs, interview drivers and conductors, inspect vehicle manifests, and update resolution outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            Active Cases: <strong className="text-amber-400 font-bold">{active}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Urgent High-Priority Alert Banner (if any) */}
      {highPriorityCases.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-950 border border-rose-500/50 shadow-glow-crimson flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/60 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider block">
                Urgent Action Required ({highPriorityCases.length} High-Priority Case{highPriorityCases.length > 1 ? 's' : ''})
              </span>
              <p className="text-xs text-slate-300">
                Incidents flagged for immediate depot safety audit or passenger escalation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('HIGH_PRIORITY')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-crimson whitespace-nowrap"
          >
            Filter High Priority
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat
          icon={ClipboardCheck}
          label="Assigned To You"
          value={items.length}
          sub="Total cases in dossier"
          accent="blue"
        />
        <Stat
          icon={Clock3}
          label="Awaiting Resolution"
          value={active}
          sub="In review or field investigation"
          accent="amber"
        />
        <Stat
          icon={CheckCircle2}
          label="Resolved / Closed"
          value={resolved}
          sub={`${items.length > 0 ? Math.round((resolved / items.length) * 100) : 0}% success rate`}
          accent="green"
        />
      </div>

      {/* Complaint Queue Table with Toolbar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by passenger, route, bus # or ID..."
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs overflow-x-auto">
            {[
              ['ALL', 'All Cases'],
              ['HIGH_PRIORITY', 'High Priority'],
              ['ACTIVE', 'Active Only'],
              ['RESOLVED', 'Resolved'],
            ].map(([f, label]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  filter === f
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        {filtered.length ? (
          <div className="divide-y divide-slate-800/70">
            {filtered.map((item) => (
              <Link
                key={item.id}
                to={`/complaints/${item.id}`}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-display font-bold text-sm group-hover:scale-105 group-hover:border-cyan-500/50 transition-all flex-none">
                    {item.category?.slice(0, 1) || 'C'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {item.category}
                      </span>
                      {item.highPriority ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                          HIGH PRIORITY
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          STANDARD
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-400 font-medium">
                        {item.complaintNumber}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {item.passengerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-slate-500" />
                        {item.busNumber || item.busRoute || 'Bus details pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <Status status={item.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors">
                    Investigate <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 font-display">
              No Cases Match Criteria
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All assigned complaints are up to date or no cases match your filter.
            </p>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {items.length} assigned cases</span>
          <span className="font-mono text-cyan-400">APSRTC Grievance Dispatch Active</span>
        </div>
      </div>
    </section>
  )
}
