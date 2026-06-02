'use client'

import { useState } from 'react'

interface Props {
  email: string
  name: string
  grade: string
  school: string
  province: string
  subjects: string
  strengths: string
  openPaths: string[]
  restrictedPaths: string[]
  assessmentId: string
}

export default function ResultCRMCard(props: Props) {
  const [copied, setCopied] = useState<'csv' | 'json' | ''>('')

  const tags = [
    ...props.openPaths.slice(0, 3).map(p => `open:${p}`),
    ...props.restrictedPaths.slice(0, 2).map(p => `narrow:${p}`),
  ].join(', ')

  const today = new Date().toISOString().split('T')[0]

  const csvHeaders = 'Email,Họ tên,Lớp,Trường,Tỉnh/TP,Môn học,Điểm mạnh,Ngành mở,Thu hẹp,Tags,Nguồn,Ngày,Assessment ID'
  const csvRow = [
    props.email, props.name, `Lớp ${props.grade}`, props.school, props.province,
    props.subjects, props.strengths,
    props.openPaths.slice(0, 5).join('; '),
    props.restrictedPaths.slice(0, 4).join('; '),
    tags, 'PathFinder MVP', today, props.assessmentId,
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')

  const jsonData = JSON.stringify({
    email:        props.email,
    name:         props.name,
    grade:        `Lớp ${props.grade}`,
    school:       props.school,
    province:     props.province,
    subjects:     props.subjects,
    strengths:    props.strengths,
    open_paths:   props.openPaths.slice(0, 5),
    narrow_paths: props.restrictedPaths.slice(0, 4),
    tags,
    source:       'PathFinder MVP',
    created_at:   today,
    assessment_id: props.assessmentId,
  }, null, 2)

  function copy(type: 'csv' | 'json') {
    const text = type === 'csv' ? `${csvHeaders}\n${csvRow}` : jsonData
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const rows: [string, string][] = [
    ['Email',      props.email],
    ['Họ tên',     props.name || '—'],
    ['Lớp',        `Lớp ${props.grade}${props.school ? ' · ' + props.school : ''}${props.province ? ' · ' + props.province : ''}`],
    ['Môn học',    props.subjects],
    ['Điểm mạnh',  props.strengths || '—'],
    ['Ngành mở',   props.openPaths.slice(0, 3).join(', ')],
    ['Thu hẹp',    props.restrictedPaths.slice(0, 3).join(', ')],
    ['Tags',       tags],
    ['Nguồn',      `PathFinder MVP · ${today}`],
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="field-label mb-0">Dữ liệu CRM</div>
        <div className="flex gap-2">
          <button
            onClick={() => copy('csv')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
              copied === 'csv'
                ? 'bg-brand-50 border-brand-200 text-brand-600'
                : 'border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            {copied === 'csv' ? '✓ Đã chép' : '⬇ Copy CSV'}
          </button>
          <button
            onClick={() => copy('json')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
              copied === 'json'
                ? 'bg-brand-50 border-brand-200 text-brand-600'
                : 'border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            {copied === 'json' ? '✓ Đã chép' : '⬇ Copy JSON'}
          </button>
        </div>
      </div>

      <table className="w-full text-xs">
        <tbody>
          {rows.map(([key, val]) => (
            <tr key={key} className="border-b border-stone-100 last:border-0">
              <td className="py-1.5 pr-3 text-stone-400 font-medium w-24 align-top">{key}</td>
              <td className="py-1.5 text-stone-700 leading-relaxed break-all">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
