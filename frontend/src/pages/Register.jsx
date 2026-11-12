import { useState } from 'react'
import { ArrowRight, BusFront, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { useSession } from '../App.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    city: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useSession()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!/^[0-9+() -]{7,20}$/.test(form.mobileNumber)) {
      return setError('Enter a valid mobile number.')
    }
    if (form.password.length < 8 || form.password.length > 72) {
      return setError('Password must be between 8 and 72 characters.')
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.')
    }

    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const { data } = await api.post('/auth/register', payload)
      signIn(data)
      addToast('Passenger account registered successfully!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#040814] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 p-0.5 shadow-glow-crimson group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#070f22] rounded-[10px] flex items-center justify-center">
              <BusFront className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <strong className="text-lg font-extrabold text-white font-display">APSRTC</strong>
              <span className="text-cyan-400 font-bold text-lg">care</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Passenger Account Registration
            </p>
          </div>
        </Link>
        <span className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1">
            Sign In
          </Link>
        </span>
      </header>

      {/* Main Registration Form */}
      <section className="max-w-3xl mx-auto w-full my-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            APSRTC CITIZEN SERVICES
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Create Your Passenger Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register to raise service complaints, upload ticket receipts, and receive direct investigation notifications.
          </p>
        </div>

        {error && (
          <div
            className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3 animate-slide-up"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 flex-none" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={submit}
          className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full name
                <input
                  name="fullName"
                  autoComplete="name"
                  required
                  maxLength="120"
                  value={form.fullName}
                  onChange={change}
                  placeholder="Name as you'd like us to address you"
                  className="mt-1 w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength="160"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  className="mt-1 w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile number
                <input
                  name="mobileNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength="7"
                  maxLength="20"
                  value={form.mobileNumber}
                  onChange={change}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors font-mono"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender
                <select
                  name="gender"
                  value={form.gender}
                  onChange={change}
                  className="mt-1 w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                >
                  <option value="">Prefer not to say</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                City
                <input
                  name="city"
                  autoComplete="address-level2"
                  maxLength="100"
                  value={form.city}
                  onChange={change}
                  placeholder="e.g. Vijayawada, Visakhapatnam, Tirupati"
                  className="mt-1 w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
                <div className="relative mt-1">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength="8"
                    maxLength="72"
                    value={form.password}
                    onChange={change}
                    placeholder="At least 8 characters"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm password
                <div className="relative mt-1">
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={change}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-glow-crimson transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create passenger account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          By registering, you agree that your contact information will be used solely for APSRTC journey dispute resolution and service verification.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 py-4">
        © {new Date().getFullYear()} Andhra Pradesh State Road Transport Corporation
      </footer>
    </main>
  )
}
