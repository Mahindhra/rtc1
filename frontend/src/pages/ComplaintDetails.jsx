import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bus,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MapPin,
  ShieldAlert,
  User,
  AlertTriangle,
  Building2,
  Send,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react'
import confetti from 'canvas-confetti'
import api, { errorMessage } from '../services/api.js'
import { useSession } from '../App.jsx'
import { Status } from './PassengerDashboard.jsx'
import { useToast } from '../context/ToastContext.jsx'

const actions = {
  ASSIGNED: ['UNDER_REVIEW', 'INVESTIGATION'],
  UNDER_REVIEW: ['INVESTIGATION'],
  INVESTIGATION: ['RESOLVED'],
  RESOLVED: ['CLOSED', 'INVESTIGATION'],
}

export default function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useSession()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [item, setItem] = useState(null)
  const [status, setStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const officer = user?.role === 'RTC_OFFICER'
  const admin = user?.role === 'ADMIN'

  const reload = () =>
    api
      .get(`/complaints/${id}`)
      .then(({ data }) => setItem(data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))

  useEffect(() => {
    reload()
  }, [id])

  const update = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await api.put(`/officer/complaints/${id}/status`, { status, remarks })
      setItem(data)
      setStatus('')
      setRemarks('')
      addToast(`Status updated to ${data.status}`, 'success')

      if (data.status === 'RESOLVED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#3b82f6', '#f43f5e'],
        })
      }
    } catch (e) {
      const err = errorMessage(e)
      setError(err)
      addToast(err, 'error')
    } finally {
      setSaving(false)
    }
  }

  const downloadEvidence = async (file) => {
    try {
      const response = await api.get(`/complaints/${id}/evidence/${file.id}`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      URL.revokeObjectURL(url)
      addToast(`Downloaded ${file.name}`, 'info')
    } catch (requestError) {
      const err = errorMessage(requestError)
      setError(err)
      addToast(err, 'error')
    }
  }

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-6">
          <div className="h-10 w-72 skeleton" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 skeleton" />
            <div className="h-96 skeleton" />
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <section className="page-wrap py-12 text-center">
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 max-w-md mx-auto mb-6">
          {error || 'Complaint not found.'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300"
        >
          Go Back
        </button>
      </section>
    )
  }

  const backUrl = officer ? '/officer' : admin ? '/admin?view=complaints' : '/complaints'
  const availableActions = actions[item.status] || []

  return (
    <section className="page-wrap max-w-6xl space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Queue
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 rounded-md">
                {item.complaintNumber}
              </span>
              <Status status={item.status} />
              {item.highPriority && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-rose-400" />
                  HIGH PRIORITY
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {item.category}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Registered on{' '}
              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'long',
              })}{' '}
              at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Controlling Officer
            </span>
            <span className="text-sm font-bold text-slate-200">
              {item.assignedOfficerName || 'Grievance HQ / Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Left Main Dossier, Right Timeline & Officer Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Dossier (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Journey Facts Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
              <Bus className="w-4 h-4" /> Transit & Journey Dossier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] mb-1">Bus Number</span>
                <span className="font-bold text-white font-mono text-sm">
                  {item.busNumber || 'APSRTC Fleet (Not Specified)'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] mb-1">Service Route</span>
                <span className="font-semibold text-slate-200">
                  {item.busRoute || 'Scheduled Route Service'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] mb-1">Journey Date</span>
                <span className="font-semibold text-slate-200">
                  {item.journeyDate
                    ? new Date(item.journeyDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Not Specified'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] mb-1">Location / Stop</span>
                <span className="font-semibold text-slate-200">
                  {item.location || 'Reported on Route'}
                </span>
              </div>
            </div>

            {/* Passenger details */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span>Passenger: <strong className="text-slate-200">{item.passengerName}</strong></span>
              {item.passengerMobile && <span>Mobile: <strong className="font-mono text-slate-200">{item.passengerMobile}</strong></span>}
              {item.passengerEmail && <span>Email: <strong className="font-mono text-slate-200">{item.passengerEmail}</strong></span>}
            </div>
          </div>

          {/* Description statement */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Passenger Statement
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {item.description}
            </p>
          </div>

          {/* Attached Evidence */}
          {item.evidence && item.evidence.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                <Download className="w-4 h-4" /> Supporting Evidence ({item.evidence.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.evidence.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => downloadEvidence(file)}
                    className="p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-none">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 block truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {(file.size / 1024).toFixed(0)} KB • {file.contentType}
                        </span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-none" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (5 cols): Timeline & Action Console */}
        <div className="lg:col-span-5 space-y-6">
          {/* Officer Action Console (Officer only) */}
          {officer && availableActions.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 backdrop-blur-xl shadow-glow-cyan">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Officer Resolution Console
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Advance case state and record official investigation remarks.
              </p>

              <form onSubmit={update} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Advance Status To:
                  </label>
                  <select
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold outline-none"
                  >
                    <option value="">Select target status...</option>
                    {availableActions.map((act) => (
                      <option key={act} value={act}>
                        {act.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Investigation Remarks / Action Taken:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter depot inspection notes, driver statement, or resolution summary..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || !status}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Commit Status Update
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 3D Animated Timeline Panel */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
              <Clock3 className="w-4 h-4" /> Investigation Audit Trail
            </h3>

            {item.timeline && item.timeline.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-slate-800">
                {item.timeline.map((event, idx) => {
                  const isLatest = idx === item.timeline.length - 1
                  return (
                    <div key={event.id || idx} className="relative flex items-start gap-4">
                      {/* Timeline Node */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 flex-none ${
                          isLatest
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_#00f0ff] ring-4 ring-cyan-500/20'
                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                        }`}
                      >
                        {isLatest ? '●' : '✓'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-white capitalize">
                            {event.status?.replace('_', ' ').toLowerCase()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(event.changedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {event.remarks && (
                          <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">
                            {event.remarks}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-500">
                          By: <strong className="text-slate-400">{event.changedByName || 'System'}</strong>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Awaiting initial depot investigation step.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
