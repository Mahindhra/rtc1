import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bus,
  CheckCircle2,
  Clock3,
  FileDown,
  Filter,
  Layers,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Flame,
  Building2,
  Sparkles
} from 'lucide-react'
import api, { errorMessage } from '../services/api.js'
import { Status, Stat } from './PassengerDashboard.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function AdminDashboard() {
  const [params, setParams] = useSearchParams()
  const view = params.get('view') || 'overview'
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [complaints, setComplaints] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const [query, setQuery] = useState('')
  const { addToast } = useToast()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [metrics, people, cases] = await Promise.all([
        api.get('/admin/analytics/summary'),
        api.get('/admin/users'),
        api.get('/admin/complaints'),
      ])
      setSummary(metrics.data)
      setUsers(people.data)
      setComplaints(cases.data)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const officers = users.filter((person) => person.role === 'RTC_OFFICER')

  const filtered = useMemo(
    () =>
      (view === 'users' ? users : complaints).filter((item) =>
        `${item.fullName || item.complaintNumber} ${item.email || item.category || ''} ${
          item.status || item.role || ''
        }`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [users, complaints, view, query]
  )

  const assign = async (complaintId, officerId) => {
    if (!officerId) return
    setBusy(complaintId)
    setError('')
    try {
      await api.put(`/admin/complaints/${complaintId}/assign`, {
        officerId: Number(officerId),
      })
      addToast('Officer assigned successfully', 'success')
      await load()
    } catch (e) {
      const err = errorMessage(e)
      setError(err)
      addToast(err, 'error')
    } finally {
      setBusy(null)
    }
  }

  const setRole = async (personId, role) => {
    setBusy(personId)
    setError('')
    try {
      await api.put(`/admin/users/${personId}/role`, null, { params: { role } })
      addToast(`User role updated to ${role}`, 'success')
      await load()
    } catch (e) {
      const err = errorMessage(e)
      setError(err)
      addToast(err, 'error')
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-6">
          <div className="h-10 w-80 skeleton" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 skeleton" />
            ))}
          </div>
          <div className="h-96 skeleton" />
        </div>
      </div>
    )
  }

  const total = summary?.totalComplaints || complaints.length
  const resolved = summary?.resolvedComplaints || 0
  const pending = summary?.pendingComplaints || 0
  const investigation = summary?.underInvestigationComplaints || 0
  const highPriority = summary?.highPriorityComplaints || complaints.filter((c) => c.highPriority).length
  const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <section className="page-wrap space-y-8 animate-fade-in">
      {/* Top HQ Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1.5 shadow-glow-crimson">
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
              APSRTC EXECUTIVE HQ COMMAND
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Government of Andhra Pradesh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Statewide Grievance Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time oversight of complaint pipelines, officer dispatch, and depot compliance across 13 districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reports"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <FileDown className="w-4 h-4 text-cyan-400" /> Export Audit Reports
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          icon={Activity}
          label="Total Grievances"
          value={total}
          sub="Logged across all depots"
          accent="cyan"
        />
        <Stat
          icon={CheckCircle2}
          label="Resolved Cases"
          value={resolved}
          sub={`${resRate}% statewide SLA index`}
          accent="green"
        />
        <Stat
          icon={Clock3}
          label="Awaiting Officer"
          value={pending}
          sub="Ready for depot dispatch"
          accent="amber"
        />
        <Stat
          icon={Flame}
          label="High Priority"
          value={highPriority}
          sub="Urgent safety or route breach"
          accent="red"
        />
      </div>

      {/* View Switcher Pills */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          {[
            ['overview', 'HQ Overview'],
            ['complaints', `Complaints (${complaints.length})`],
            ['users', `People & Roles (${users.length})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setParams({ view: key })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                view === key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {view !== 'overview' && (
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${view}...`}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: EXECUTIVE OVERVIEW */}
      {view === 'overview' && (
        <div className="space-y-6">
          {/* Statewide Depot Command Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Regional Transport Divisions & Depot Radar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Active grievance dispatch status across major Andhra Pradesh transport clusters
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-lg">
                All 13 Divisions Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Vijayawada Region', cases: complaints.filter(c => c.busRoute?.toLowerCase().includes('vijayawada') || c.location?.toLowerCase().includes('vijayawada')).length || 14, status: 'Optimal' },
                { name: 'Visakhapatnam Hub', cases: complaints.filter(c => c.busRoute?.toLowerCase().includes('visakhapatnam') || c.location?.toLowerCase().includes('vizag')).length || 9, status: 'Optimal' },
                { name: 'Tirupati Division', cases: complaints.filter(c => c.busRoute?.toLowerCase().includes('tirupati') || c.location?.toLowerCase().includes('tirupati')).length || 6, status: 'Optimal' },
                { name: 'Guntur Metro', cases: complaints.filter(c => c.busRoute?.toLowerCase().includes('guntur') || c.location?.toLowerCase().includes('guntur')).length || 8, status: 'Active' },
              ].map((depot, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white">{depot.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      {depot.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                      {depot.cases}
                    </span>
                    <span className="text-[11px] text-slate-500">logged cases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Staff & Dispatch Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Officers roster */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white font-display">
                    Active RTC Officers ({officers.length})
                  </h4>
                </div>
                <button
                  onClick={() => setParams({ view: 'users' })}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Manage Roles →
                </button>
              </div>

              {officers.length ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {officers.map((off) => (
                    <div
                      key={off.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                          {off.fullName?.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{off.fullName}</span>
                          <span className="text-[10px] text-slate-400">{off.email}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                        OFFICER
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No RTC officers registered yet. Promote passengers from People & Roles.
                </div>
              )}
            </div>

            {/* Recent Unassigned / Critical Cases */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-white font-display">
                    Urgent & Unassigned Cases ({complaints.filter(c => !c.assignedOfficerId).length})
                  </h4>
                </div>
                <button
                  onClick={() => setParams({ view: 'complaints' })}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  View All Complaints →
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {complaints.filter(c => !c.assignedOfficerId).slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.category}</span>
                        {c.highPriority && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono font-bold animate-pulse">
                            HIGH
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.complaintNumber} • {c.passengerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        disabled={busy === c.id}
                        defaultValue=""
                        onChange={(e) => assign(c.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-cyan-400"
                      >
                        <option value="" disabled>Assign Officer</option>
                        {officers.map(o => (
                          <option key={o.id} value={o.id}>{o.fullName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {complaints.filter(c => !c.assignedOfficerId).length === 0 && (
                  <div className="p-8 text-center text-xs text-emerald-400">
                    ✓ All complaints currently assigned to investigating officers!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLAINTS & DISPATCH */}
      {view === 'complaints' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
          <div className="divide-y divide-slate-800/70">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-display font-bold text-sm flex-none">
                    {item.category?.slice(0, 1) || 'C'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/complaints/${item.id}`}
                        className="font-bold text-sm text-white hover:text-cyan-300 transition-colors"
                      >
                        {item.category}
                      </Link>
                      {item.highPriority && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-400">{item.complaintNumber}</span>
                      <span>•</span>
                      <span>Passenger: <strong className="text-slate-300">{item.passengerName}</strong></span>
                      <span>•</span>
                      <span>{item.busNumber || item.busRoute || 'APSRTC Route'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Status status={item.status} />

                  {/* Officer Assignment Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Officer:</span>
                    <select
                      value={item.assignedOfficerId || ''}
                      disabled={busy === item.id}
                      onChange={(e) => assign(item.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="" disabled>Unassigned</option>
                      {officers.map((off) => (
                        <option key={off.id} value={off.id}>
                          {off.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Link
                    to={`/complaints/${item.id}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="View Full Case Dossier"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400">
                No matching complaints found for "{query}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: PEOPLE & ROLES */}
      {view === 'users' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
          <div className="divide-y divide-slate-800/70">
            {filtered.map((person) => (
              <div
                key={person.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400">
                    {person.fullName?.slice(0, 1)?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{person.fullName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{person.email} • {person.mobileNumber || 'No phone'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 uppercase font-mono">Role:</span>
                  <select
                    value={person.role}
                    disabled={busy === person.id}
                    onChange={(e) => setRole(person.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-cyan-400 font-mono transition-colors"
                  >
                    <option value="PASSENGER">PASSENGER</option>
                    <option value="RTC_OFFICER">RTC_OFFICER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
