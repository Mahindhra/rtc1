import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, ShieldCheck, BusFront, Sparkles, User, Lock, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../services/api.js'
import { useSession } from '../App.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useSession()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      signIn(data)
      addToast(`Welcome back, ${data.user.fullName}!`, 'success')
      navigate(
        data.user.role === 'ADMIN'
          ? '/admin'
          : data.user.role === 'RTC_OFFICER'
          ? '/officer'
          : '/dashboard',
        { replace: true }
      )
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email, password) => {
    setForm({ email, password })
    setError('')
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#040814] text-slate-100">
      {/* Left Cinematic Visual Pillar (7 cols) */}
      <section className="hidden lg:flex lg:col-span-7 relative p-12 flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-gradient-to-br from-[#070f22] via-[#040814] to-[#0a142e]">
        {/* Ambient lighting bokeh */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand */}
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 p-0.5 shadow-glow-crimson group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#070f22] rounded-[10px] flex items-center justify-center">
              <BusFront className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-xl font-extrabold text-white font-display">APSRTC</strong>
              <span className="text-cyan-400 font-bold text-xl">care</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Intelligent Grievance Platform
            </p>
          </div>
        </Link>

        {/* Story Centerpiece */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            GOVERNMENT OF ANDHRA PRADESH
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white font-display leading-[1.15] mb-6">
            Your journey deserves <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-rose-400 bg-clip-text text-transparent">
              to be heard and respected.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Access your personalized passenger portal, track ongoing depot inspections, or coordinate statewide transit operations in one secure system.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>11,400+ Active Buses</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>98.4% Resolution SLA</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between">
          <span>Andhra Pradesh State Road Transport Corporation</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </section>

      {/* Right Login Form (5 cols) */}
      <section className="col-span-12 lg:col-span-5 p-6 sm:p-12 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 pb-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white">
                <BusFront className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-lg font-bold text-white font-display">APSRTC care</strong>
              </div>
            </Link>
          </div>

          {/* Form Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" /> Official Passenger Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in with your credentials to access your dockets.
            </p>
          </div>

          {/* Demo account quick fill pills */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mb-2">
              Quick Test Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@example.com', 'admin123')}
                className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-[11px] font-mono transition-colors"
              >
                Admin HQ
              </button>
              <button
                type="button"
                onClick={() => fillDemo('officer@example.com', 'officer123')}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition-colors"
              >
                RTC Officer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('passenger@example.com', 'passenger123')}
                className="px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900/80 border border-blue-500/30 text-blue-300 text-[11px] font-mono transition-colors"
              >
                Passenger
              </button>
            </div>
          </div>

          {error && (
            <div
              className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-slide-up"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-none" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength="160"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl pl-4 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-glow-crimson transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            New to Passenger Care?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold">
              Create an account
            </Link>
          </p>

          <div className="text-center text-[10px] text-slate-500 pt-4 border-t border-slate-800/80">
            Your credentials and journey grievances are strictly governed under the Andhra Pradesh State Road Transport Corporation Citizen Charter.
          </div>
        </div>
      </section>
    </main>
  )
}
