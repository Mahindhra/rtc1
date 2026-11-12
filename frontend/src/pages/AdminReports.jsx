import { useEffect, useState } from 'react'
import { ArrowDownToLine, FileText, ShieldCheck, CheckCircle2, Download, Table, AlertCircle } from 'lucide-react'
import api, { errorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

const columns = [
  'complaintNumber',
  'passengerName',
  'category',
  'status',
  'highPriority',
  'busNumber',
  'busRoute',
  'journeyDate',
  'location',
  'assignedOfficerName',
  'createdAt',
]

export default function AdminReports() {
  const [cases, setCases] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    api
      .get('/admin/complaints')
      .then(({ data }) => setCases(data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const exportCsv = () => {
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const content = [
      columns.join(','),
      ...cases.map((item) => columns.map((column) => quote(item[column])).join(',')),
    ].join('\n')

    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `APSRTC-Grievance-Audit-Report-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    addToast('Audit CSV report downloaded successfully', 'success')
  }

  return (
    <section className="page-wrap space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
              GOVERNMENT AUDIT EXPORT
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">APSRTC Compliance Registry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Statewide Grievance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate and export comprehensive compliance datasets for state transport audits and depot performance reviews.
          </p>
        </div>

        <button
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          disabled={loading || !cases.length}
          onClick={exportCsv}
        >
          <ArrowDownToLine className="w-4 h-4" /> Export CSV Dataset
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Report Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-none shadow-glow-cyan">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Comprehensive Complaint & Redressal Register
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
              Contains complete incident metadata including unique complaint IDs, passenger credentials, route details, vehicle numbers, high-priority flags, assigned officer logs, and final disposition stamps.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right flex-none">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Dataset Volume</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            {loading ? '...' : `${cases.length} Records`}
          </span>
        </div>
      </div>

      {/* Dataset Preview */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" /> Recent Dataset Records
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Showing top {Math.min(10, cases.length)} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Docket ID</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Route / Bus</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cases.slice(0, 10).map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {row.complaintNumber}
                  </td>
                  <td className="py-3 px-4">{row.passengerName}</td>
                  <td className="py-3 px-4">{row.category}</td>
                  <td className="py-3 px-4">{row.busNumber || row.busRoute || 'General'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{row.assignedOfficerName || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
