'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  created_at: string
  email: string
  name: string
  grade: string
  school: string
  province: string
  open_paths: string[]
  restricted_paths: string[]
  strengths: string[]
  selected_electives: string[]
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads]   = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function fetchLeads() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'x-admin-secret': secret },
      })
      if (res.status === 401) { setError('Sai mật khẩu admin.'); setLoading(false); return }
      if (!res.ok) { setError('Lỗi server.'); setLoading(false); return }
      // Parse CSV manually for display
      const text = await res.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
      const rows = lines.slice(1).map(line => {
        // Simple CSV parse
        const vals: string[] = []
        let inQuote = false, cur = ''
        for (const ch of line) {
          if (ch === '"') { inQuote = !inQuote }
          else if (ch === ',' && !inQuote) { vals.push(cur); cur = '' }
          else cur += ch
        }
        vals.push(cur)
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
      })
      // Map to typed leads
      setLeads(rows.map(r => ({
        id: r['id'],
        created_at: r['created_at'],
        email: r['email'],
        name: r['name'],
        grade: r['grade'],
        school: r['school'],
        province: r['province'],
        open_paths: r['open_paths']?.split('; ').filter(Boolean) ?? [],
        restricted_paths: r['restricted_paths']?.split('; ').filter(Boolean) ?? [],
        strengths: r['strengths']?.split('; ').filter(Boolean) ?? [],
        selected_electives: r['selected_electives']?.split('; ').filter(Boolean) ?? [],
      })))
      setAuthed(true)
    } catch {
      setError('Không thể kết nối.')
    }
    setLoading(false)
  }

  function downloadCSV() {
    window.open(`/api/admin/leads`, '_blank')
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-sm w-full space-y-4">
          <div className="field-label">Admin Panel</div>
          <p className="text-xs text-stone-400">Nhập mật khẩu admin để xem danh sách leads.</p>
          <input
            className="input"
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchLeads()}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button className="btn-primary w-full justify-center" onClick={fetchLeads} disabled={loading}>
            {loading ? 'Đang tải...' : 'Đăng nhập'}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="field-label mb-0">Admin Panel · PathFinder</div>
            <p className="text-xs text-stone-400 mt-0.5">{leads.length} leads</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs" onClick={fetchLeads}>↺ Refresh</button>
            <button className="btn-primary text-xs" onClick={downloadCSV}>⬇ Download CSV</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Tổng leads',    value: leads.length },
            { label: 'Lớp 10',        value: leads.filter(l => l.grade === 'Lớp 10').length },
            { label: 'Lớp 11',        value: leads.filter(l => l.grade === 'Lớp 11').length },
            { label: 'Lớp 12',        value: leads.filter(l => l.grade === 'Lớp 12').length },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className="text-2xl font-semibold text-brand-600">{s.value}</div>
              <div className="text-xs text-stone-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-100">
                {['Ngày', 'Email', 'Tên', 'Lớp / Trường', 'Môn chọn', 'Ngành mở', 'Điểm mạnh'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-stone-400 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                  <td className="px-4 py-2.5 text-stone-400 whitespace-nowrap">
                    {l.created_at?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5 text-brand-600 font-medium">{l.email}</td>
                  <td className="px-4 py-2.5 text-stone-700">{l.name || '—'}</td>
                  <td className="px-4 py-2.5 text-stone-500">
                    {l.grade}{l.school ? ` · ${l.school}` : ''}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {l.selected_electives.map(e => (
                        <span key={e} className="px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded text-xs font-medium">{e}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-stone-600 max-w-48">
                    {l.open_paths.slice(0, 2).join(', ')}
                    {l.open_paths.length > 2 && <span className="text-stone-400"> +{l.open_paths.length - 2}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-stone-500">{l.strengths.slice(0, 2).join(', ')}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
