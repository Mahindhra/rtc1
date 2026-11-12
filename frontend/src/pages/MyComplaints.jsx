import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Search, Plus, Filter, Bus, MapPin, Calendar, Clock3, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { Status } from './PassengerDashboard.jsx'

export default function MyComplaints({ notifications = false }) {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/complaints/my')
      .then(({ data }) => setItems(data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (filter === 'ALL' || item.status === filter) &&
          `${item.category} ${item.complaintNumber} ${item.busRoute || ''} ${item.busNumber || ''} ${item.location || ''}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [items, filter, query]
  )

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-6">
          <div className="h-10 w-64 skeleton" />
          <div className="h-12 skeleton" />
          <div className="h-80 skeleton" />
        </div>
      </div>
    )
  }

  const counts = {
    ALL: items.length,
    SUBMITTED: items.filter((i) => i.status === 'SUBMITTED').length,
    INVESTIGATION: items.filter((i) => ['UNDER_REVIEW', 'INVESTIGATION', 'ASSIGNED'].includes(i.status)).length,
    RESOLVED: items.filter((i) => ['RESOLVED', 'CLOSED'].includes(i.status)).length,
  }

  return (
    <section className="page-wrap space-y-8 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              CASE ARCHIVE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">APSRTC Redressal Docket</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            {notifications ? 'Notifications' : 'My Grievance Dockets'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track investigation steps, officer inspection notes, and official resolutions for all your journeys.
          </p>
        </div>

        {!notifications && (
          <Link
            to="/raise-complaint"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs shadow-glow-crimson hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Complaint
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search complaint ID, category, bus # or route..."
            aria-label="Search complaints"
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs overflow-x-auto" role="group" aria-label="Filter by status">
          {[
            ['ALL', 'All Cases', counts.ALL],
            ['SUBMITTED', 'Submitted', counts.SUBMITTED],
            ['INVESTIGATION', 'In Progress', counts.INVESTIGATION],
            ['RESOLVED', 'Resolved', counts.RESOLVED],
          ].map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                filter === val
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filter === val ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
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
                      {item.highPriority && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-400 font-medium">
                        {item.complaintNumber}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-slate-500" />
                        {item.busRoute || item.busNumber || 'Route details provided'}
                      </span>
                      {item.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <Status status={item.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
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
              No Matching Complaints
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search terms or selecting a different status filter.
            </p>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {items.length} total complaints</span>
          <span className="font-mono text-cyan-400">APSRTC Citizen Grievance Portal</span>
        </div>
      </div>
    </section>
  )
}
