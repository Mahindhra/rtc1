import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  Info,
  ShieldAlert,
  Bus,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Camera,
  CheckCircle2,
  FileText,
  UserX,
  Gauge,
  CircleSlash,
  Trash2,
  Ticket
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

const categoryMeta = [
  { name: 'Bus Not Stopping', icon: CircleSlash, desc: 'Bus failed to halt at designated stop' },
  { name: 'Rash Driving', icon: Gauge, desc: 'Dangerous speed, abrupt braking, safety risk' },
  { name: 'Rude Driver/Conductor', icon: UserX, desc: 'Unprofessional behavior or harassment' },
  { name: 'Overcrowding', icon: Bus, desc: 'Exceeding safe passenger capacity' },
  { name: 'Dirty Bus', icon: Trash2, desc: 'Unclean interior, broken seats, AC fault' },
  { name: 'Ticket Issues', icon: Ticket, desc: 'Fare discrepancy, refund, online booking' },
  { name: 'Late Bus', icon: Clock, desc: 'Significant route delay without notice' },
  { name: 'Route Deviation', icon: MapPin, desc: 'Driver deviated from official schedule' },
  { name: 'Lost Belongings', icon: Sparkles, desc: 'Items misplaced or left on board' },
  { name: 'Harassment', icon: ShieldAlert, desc: 'Passenger safety violation or distress' },
  { name: 'Other', icon: FileText, desc: 'General service feedback or enquiry' },
]

export default function RaiseComplaint() {
  const [form, setForm] = useState({
    category: '',
    busNumber: '',
    busRoute: '',
    journeyDate: '',
    location: '',
    description: '',
  })
  const [evidence, setEvidence] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleFileChange = (file) => {
    if (!file) {
      setEvidence(null)
      setPreviewUrl(null)
      return
    }

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setError('Evidence must be a JPG, PNG, or PDF file.')
      return
    }

    if (file.size > 5_000_000) {
      setError('Evidence file size must be under 5 MB.')
      return
    }

    setError('')
    setEvidence(file)

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.category) {
      return setError('Please select a complaint category.')
    }

    if (form.description.trim().length < 20) {
      return setError('Please provide at least 20 characters in the description so the depot team can investigate.')
    }

    const payload = new FormData()
    payload.append(
      'complaint',
      new Blob(
        [
          JSON.stringify({
            ...form,
            journeyDate: form.journeyDate || null,
          }),
        ],
        { type: 'application/json' }
      )
    )

    if (evidence) {
      payload.append('evidence', evidence)
    }

    setLoading(true)
    try {
      const { data } = await api.post('/complaints', payload)
      addToast(`Complaint ${data.complaintNumber} registered successfully!`, 'success')
      navigate(`/complaints/${data.id}`, { state: { submitted: true } })
    } catch (requestError) {
      const err = errorMessage(requestError)
      setError(err)
      addToast(err, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-wrap max-w-4xl space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
            PASSENGER GRIEVANCE INTAKE
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Raise a Service Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide your journey details and what transpired. Your complaint will be assigned to the controlling APSRTC Depot Officer with an official tracking docket.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Glass Form */}
      <form onSubmit={submit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card space-y-8">
        {/* Step 1: Category Selection */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-5">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Select Complaint Category <span className="text-rose-400">*</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose the primary issue experienced during your journey
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryMeta.map((cat) => {
              const Icon = cat.icon
              const isSelected = form.category === cat.name
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setForm({ ...form, category: cat.name })}
                  className={`p-3.5 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[92px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-glow-cyan text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs block leading-tight">{cat.name}</span>
                    <span className="text-[10px] text-slate-500 block line-clamp-1">{cat.desc}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Journey & Transit Details */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-5">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Journey & Bus Information
              </h3>
              <p className="text-[11px] text-slate-400">
                Helps APSRTC identify the driver, conductor, and depot ledger
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bus Registration Number
              </label>
              <div className="relative">
                <Bus className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength="30"
                  value={form.busNumber}
                  onChange={(e) => setForm({ ...form, busNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. AP 16 Z 1234 or fleet #"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bus Service / Route
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength="150"
                  value={form.busRoute}
                  onChange={(e) => setForm({ ...form, busRoute: e.target.value })}
                  placeholder="e.g. Vijayawada – Tirupati Express"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date of Incident / Journey
              </label>
              <div className="relative">
                <input
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={form.journeyDate}
                  onChange={(e) => setForm({ ...form, journeyDate: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Location / Bus Stop
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength="180"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Guntur Bus Stand, Platform 3"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Description & Evidence */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-5">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                What Happened? <span className="text-rose-400">*</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Detailed statement and optional evidence attachment
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                minLength={20}
                maxLength={3000}
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what occurred, including approximate time, conduct, or vehicle issues (minimum 20 characters)..."
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none transition-colors leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Minimum 20 characters required</span>
                <span className="font-mono">{form.description.length} / 3000</span>
              </div>
            </div>

            {/* Evidence Uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supporting Evidence (Optional)
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-xl p-5 bg-slate-950/60 transition-colors text-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {evidence ? (
                  <div className="flex items-center justify-center gap-4">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Evidence preview"
                        className="w-14 h-14 object-cover rounded-lg border border-cyan-500/40 shadow-glow-cyan"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block truncate max-w-xs">
                        {evidence.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(evidence.size / 1024).toFixed(0)} KB • Click or drop to replace
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mx-auto group-hover:scale-110 transition-transform">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">
                        Upload Photo, Ticket Screenshot, or PDF
                      </span>
                      <span className="text-[10px] text-slate-500">
                        JPG, PNG, or PDF up to 5 MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & submit */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 flex-none" />
            <span>Encrypted transmission. Your identity is protected under APSRTC Citizen Charter.</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-glow-crimson flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Complaint <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
        <ShieldAlert className="w-5 h-5 text-rose-400 flex-none" />
        <span>
          Safety emergency in progress? Contact local police or dial <strong>112</strong> immediately.
        </span>
      </div>
    </section>
  )
}
