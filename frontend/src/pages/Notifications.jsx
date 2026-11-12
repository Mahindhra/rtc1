import { useEffect, useState } from 'react'
import { Bell, Check, CircleCheck, Clock, ExternalLink, AlertCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export default function Notifications() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    api
      .get('/passenger/notifications')
      .then(({ data }) => setItems(data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    try {
      await api.put(`/passenger/notifications/${id}/read`)
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, read: true } : item))
      )
      addToast('Notification marked as read', 'info')
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  if (loading) {
    return (
      <div className="page-wrap py-12">
        <div className="space-y-4">
          <div className="h-10 w-64 skeleton" />
          <div className="h-24 skeleton" />
          <div className="h-24 skeleton" />
          <div className="h-24 skeleton" />
        </div>
      </div>
    )
  }

  const unreadCount = items.filter((i) => !i.read).length

  return (
    <section className="page-wrap max-w-4xl space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              ALERTS & TELEMETRY
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Real-Time Dispatch Updates</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Notifications & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time notifications whenever an officer reviews, updates, or resolves your case.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            {unreadCount} Unread Alert{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
        {items.length ? (
          <div className="divide-y divide-slate-800/70">
            {items.map((item) => (
              <article
                key={item.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  item.read ? 'bg-slate-900/40' : 'bg-cyan-950/20 border-l-4 border-cyan-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${
                    item.read
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan'
                  }`}
                >
                  {item.read ? <CircleCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    {item.complaintId && (
                      <Link
                        to={`/complaints/${item.complaintId}`}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        Inspect Case Dossier <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={() => markRead(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors flex-none"
                    title="Mark as read"
                    aria-label="Mark notification as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 font-display">
              You're All Caught Up
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Any depot updates, officer assignments, or case resolutions will be streamed here in real time.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
