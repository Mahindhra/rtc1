import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BusFront,
  ShieldCheck,
  Search,
  ArrowRight,
  FilePlus2,
  Clock,
  CheckCircle2,
  PhoneCall,
  Activity,
  Layers,
  MapPin,
  Sparkles,
  ChevronRight,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import HeroScene3D from '../components/HeroScene3D'
import QuickTracker from '../components/QuickTracker'
import { useSession } from '../App'

export default function LandingPage() {
  const { user } = useSession()
  const navigate = useNavigate()
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [selectedHub, setSelectedHub] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const transitHubs = [
    {
      city: 'Vijayawada HQ',
      region: 'Krishna Central',
      activeBuses: '1,420',
      todayComplaints: 24,
      resolvedRate: '99.1%',
      status: 'Optimal',
      depots: 'Governorpet, Autonagar, Vidyadharapuram',
    },
    {
      city: 'Visakhapatnam',
      region: 'North Coastal',
      activeBuses: '1,280',
      todayComplaints: 18,
      resolvedRate: '98.7%',
      status: 'Optimal',
      depots: 'Maddilapalem, Waltair, Simhachalam',
    },
    {
      city: 'Tirupati Central',
      region: 'Rayalaseema South',
      activeBuses: '1,150',
      todayComplaints: 14,
      resolvedRate: '99.4%',
      status: 'Optimal',
      depots: 'Alipiri, Tirupati Central, Mangalam',
    },
    {
      city: 'Guntur Metro',
      region: 'Central Plains',
      activeBuses: '940',
      todayComplaints: 19,
      resolvedRate: '97.9%',
      status: 'High Volume',
      depots: 'Guntur-1, Guntur-2, Tenali',
    },
    {
      city: 'Kurnool Gateway',
      region: 'Rayalaseema West',
      activeBuses: '810',
      todayComplaints: 11,
      resolvedRate: '98.5%',
      status: 'Optimal',
      depots: 'Kurnool-1, Kurnool-2, Nandyal',
    },
  ]

  const faqs = [
    {
      q: 'How quickly does APSRTC investigate my complaint?',
      a: 'All complaints submitted via the Smart Passenger Care portal are categorized instantly and routed to the corresponding regional Depot Manager within 60 minutes. Standard grievances are addressed within 24–48 hours.',
    },
    {
      q: 'Can I track a complaint without logging in?',
      a: 'Yes. Every submitted grievance receives a unique tracking number (e.g. APSRTC-2026-XXXX). You can use the Track Complaint button directly from the landing page to view real-time investigation milestones.',
    },
    {
      q: 'What supporting evidence can I upload with my complaint?',
      a: 'You can upload high-resolution photos, bus tickets, QR booking screenshots, or incident PDFs up to 5 MB in size. Evidence is securely stored and only accessible to assigned inspecting officers.',
    },
    {
      q: 'What should I do during an emergency or safety hazard?',
      a: 'For immediate life safety or active crime emergencies, immediately call 112 (National Emergency) or 181 (Women Helpline). APSRTC dispatch also operates a 24x7 control helpline at 0866-2570005.',
    },
  ]

  const targetDashboard =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'RTC_OFFICER' ? '/officer' : '/dashboard'

  return (
    <div className="relative min-h-screen bg-[#040814] text-slate-100 overflow-hidden">
      {/* Quick Tracker Modal */}
      <QuickTracker isOpen={trackerOpen} onClose={() => setTrackerOpen(false)} />

      {/* Top Floating Glass Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 py-3.5 backdrop-blur-xl bg-[#070f22]/75 border-b border-cyan-500/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 p-0.5 shadow-glow-crimson group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#070f22] rounded-[10px] flex items-center justify-center">
                <BusFront className="w-5 h-5 text-rose-500 group-hover:text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white font-display text-lg">
                  APSRTC
                </span>
                <span className="text-cyan-400 font-bold text-lg">care</span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Government of Andhra Pradesh
              </p>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">
              Command Center
            </a>
            <a href="#radar" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Transit Radar
            </a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">
              How It Works
            </a>
            <a href="#faqs" className="hover:text-cyan-400 transition-colors">
              Passenger FAQ
            </a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrackerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-white text-xs font-semibold transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Track Status
            </button>

            {user ? (
              <Link
                to={targetDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all duration-200"
              >
                Go to Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-glow-crimson transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* FULL-SCREEN CINEMATIC HERO SECTION */}
      <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center">
        {/* Three.js 3D Background Scene with Light Trails */}
        <HeroScene3D />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          {/* High-tech Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-8 backdrop-blur-md shadow-glow-cyan animate-pulse">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>STATEWIDE PASSENGER CARE COMMAND</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-sans">{time || 'LIVE IST'}</span>
          </div>

          {/* Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6 font-display">
            Your Journey.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-rose-400 bg-clip-text text-transparent">
              Your Voice.
            </span>{' '}
            <br />
            Our Responsibility.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Next-generation grievance intelligence platform for Andhra Pradesh State Road Transport Corporation. Real-time depot investigation, ticket accountability, and passenger welfare across 11,400+ daily routes.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to={user ? '/raise-complaint' : '/login'}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-glow-crimson hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 group"
            >
              <FilePlus2 className="w-5 h-5 text-rose-200 group-hover:rotate-6 transition-transform" />
              Raise a Complaint
              <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setTrackerOpen(true)}
              className="px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-sm sm:text-base shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 backdrop-blur-md"
            >
              <Search className="w-5 h-5 text-cyan-400" />
              Track Complaint
            </button>
          </div>

          {/* Fast On-Hero Search Tracker Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="p-2 rounded-2xl bg-slate-900/70 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex items-center gap-2">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Complaint Token (e.g., APSRTC-2026-1048)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setTrackerOpen(true)
                }}
                className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 outline-none px-2"
              />
              <button
                onClick={() => setTrackerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Check Status
              </button>
            </div>
          </div>

          {/* Live Telemetry KPI Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'Active Fleet', value: '11,400+', sub: 'Daily Statewide Services', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', text: 'text-blue-400' },
              { label: 'Daily Commuters', value: '9.2 Million', sub: 'Safely Transported', color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
              { label: 'Resolution Rate', value: '98.4%', sub: 'Within Grievance SLA', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', text: 'text-emerald-400' },
              { label: 'Avg Turnaround', value: '< 24 Hours', sub: 'Fast Track Investigation', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', text: 'text-amber-400' },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-gradient-to-b ${kpi.color} border ${kpi.border} backdrop-blur-md text-left transition-transform hover:-translate-y-1 duration-200`}
              >
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  {kpi.label}
                </span>
                <span className={`text-2xl sm:text-3xl font-extrabold ${kpi.text} font-display block mb-1`}>
                  {kpi.value}
                </span>
                <span className="text-[11px] text-slate-400">{kpi.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATEWIDE TRANSIT RADAR / DEPOT MONITORING */}
      <section id="radar" className="py-24 relative border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-mono mb-4">
              <Activity className="w-3.5 h-3.5" />
              LIVE TELEMETRY
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mb-4">
              Statewide Transit Intelligence Radar
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Real-time monitoring across Andhra Pradesh’s key transport divisions. Select a regional hub to inspect current grievance dispatch and resolution metrics.
            </p>
          </div>

          {/* Regional Hub selector & preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Hub list */}
            <div className="lg:col-span-5 space-y-3">
              {transitHubs.map((hub, idx) => (
                <button
                  key={hub.city}
                  onClick={() => setSelectedHub(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    selectedHub === idx
                      ? 'bg-slate-900 border-cyan-500 shadow-glow-cyan'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        selectedHub === idx
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm font-display">{hub.city}</h4>
                      <p className="text-xs text-slate-400">{hub.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-400 block">
                      {hub.resolvedRate}
                    </span>
                    <span className="text-[10px] text-slate-500">{hub.activeBuses} buses</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Hub Telemetry Dossier */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                    APSRTC Regional Operations
                  </span>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {transitHubs[selectedHub].city}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Jurisdiction: {transitHubs[selectedHub].region}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {transitHubs[selectedHub].status}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Active Buses</span>
                  <span className="text-xl font-bold text-white font-mono">
                    {transitHubs[selectedHub].activeBuses}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">24h Grievances</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">
                    {transitHubs[selectedHub].todayComplaints}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Resolution SLA</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {transitHubs[selectedHub].resolvedRate}
                  </span>
                </div>
              </div>

              {/* Sub-depots */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 mb-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Operating Depots
                </span>
                <p className="text-sm text-slate-200">
                  {transitHubs[selectedHub].depots}
                </p>
              </div>

              {/* Officer Dispatch Guarantee */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Inspected by Certified RTC Depot Quality Officers
                </span>
                <button
                  onClick={() => setTrackerOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  Inspect Cases <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP HOLOGRAPHIC WORKFLOW */}
      <section id="workflow" className="py-24 relative border-t border-slate-800/80 bg-[#060c1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-mono mb-4">
              <Layers className="w-3.5 h-3.5" />
              INTELLIGENT LIFECYCLE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mb-4">
              How Grievances Move from Route to Resolution
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              From the moment you report a journey delay, rash driving, or ticketing issue, our automated workflow engages RTC field personnel with full transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Instant Registration',
                desc: 'Passenger logs the concern with bus number, route, photos, and journey timestamp.',
                badge: 'Passenger Portal',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                step: '02',
                title: 'Depot Dispatch',
                desc: 'Automated routing to the controlling Depot Officer and Division Inspection Unit.',
                badge: 'HQ Routing',
                color: 'from-blue-500 to-violet-500',
              },
              {
                step: '03',
                title: 'Field Investigation',
                desc: 'Vehicle telemetry, driver manifest, and ticket audits executed by assigned officers.',
                badge: 'Officer Action',
                color: 'from-violet-500 to-rose-500',
              },
              {
                step: '04',
                title: 'Official Redressal',
                desc: 'Action taken logged with verifiable officer notes and passenger SMS confirmation.',
                badge: 'Verified Resolution',
                color: 'from-rose-500 to-emerald-500',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 relative group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-display font-black text-xl text-white mb-5 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-2">
                  {item.badge}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSENGER FAQ SECTION */}
      <section id="faqs" className="py-24 relative border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Answers to common passenger queries about APSRTC grievance handling and safety.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800 bg-slate-900/70 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 flex-none transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY HELPLINE FOOTER RIBBON */}
      <section className="bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-slate-950 border-y border-rose-500/30 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 flex-none">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono font-bold text-rose-300 block">
                24x7 Immediate Emergency & Helpline
              </span>
              <p className="text-xs text-slate-300">
                National Emergency: <strong className="text-white">112</strong> • Women Helpline: <strong className="text-white">181</strong> • APSRTC Central Control: <strong className="text-white">0866-2570005</strong>
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-crimson"
          >
            Emergency Call 112
          </a>
        </div>
      </section>

      {/* OFFICIAL GOVERNMENT FOOTER */}
      <footer className="py-12 px-4 border-t border-slate-800/80 bg-[#030610] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BusFront className="w-6 h-6 text-rose-500" />
            <div>
              <span className="font-bold text-white text-sm">APSRTC Passenger Care</span>
              <p className="text-[11px] text-slate-500">
                Andhra Pradesh State Road Transport Corporation • Official Grievance Redressal Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">
              Passenger Login
            </Link>
            <Link to="/register" className="hover:text-cyan-400 transition-colors">
              New Account
            </Link>
            <button onClick={() => setTrackerOpen(true)} className="hover:text-cyan-400 transition-colors">
              Track Grievance
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} APSRTC. All Rights Reserved. Protected under IT Act 2000.
          </p>
        </div>
      </footer>
    </div>
  )
}
