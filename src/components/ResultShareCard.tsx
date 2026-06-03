'use client'

import { useState, useCallback } from 'react'
import { ELECTIVE_SUBJECTS, MAJORS } from '@/lib/knowledge-graph'
import type { SubjectCode } from '@/types'

interface Props {
  selectedElectives: SubjectCode[]
  openPaths: string[]
  grade: string
}

const CAREER_MAP: Record<string, { icon: string; short: string; eng: string }> = {
  'Khoa học máy tính / CNTT':        { icon: '💻', short: 'Lập trình',    eng: 'Software Engineer' },
  'AI / Khoa học dữ liệu':           { icon: '🤖', short: 'AI & Data',    eng: 'Data Scientist' },
  'Kỹ thuật điện / Tự động hóa':     { icon: '⚡', short: 'Tự động hóa', eng: 'Automation Eng.' },
  'Kiến trúc / Xây dựng':            { icon: '🏛️', short: 'Kiến trúc',   eng: 'Architect' },
  'Kinh tế / Quản trị kinh doanh':   { icon: '📈', short: 'Kinh doanh',  eng: 'Business Analyst' },
  'Luật':                             { icon: '⚖️', short: 'Luật',        eng: 'Lawyer' },
  'Y khoa':                           { icon: '🩺', short: 'Y khoa',      eng: 'Doctor' },
  'Dược học':                         { icon: '💊', short: 'Dược',        eng: 'Pharmacist' },
  'Công nghệ sinh học':               { icon: '🧬', short: 'Sinh học',    eng: 'Biotech Researcher' },
  'Du lịch / Địa lý học':            { icon: '🗺️', short: 'Du lịch',     eng: 'Travel Manager' },
  'Âm nhạc / Nghệ thuật biểu diễn':  { icon: '🎵', short: 'Âm nhạc',    eng: 'Musician' },
  'Mỹ thuật / Thiết kế đồ họa':      { icon: '🎨', short: 'Thiết kế',    eng: 'Graphic Designer' },
  'Nông nghiệp / Môi trường':        { icon: '🌱', short: 'Nông nghiệp', eng: 'Agri Engineer' },
  'Công nghệ thực phẩm':             { icon: '🍃', short: 'Thực phẩm',   eng: 'Food Technologist' },
}

const THEME_PREF: Record<string, string[]> = {
  tech:     ['Khoa học máy tính / CNTT', 'AI / Khoa học dữ liệu', 'Kỹ thuật điện / Tự động hóa', 'Kiến trúc / Xây dựng'],
  nature:   ['Y khoa', 'Công nghệ sinh học', 'Nông nghiệp / Môi trường', 'Công nghệ thực phẩm'],
  creative: ['Mỹ thuật / Thiết kế đồ họa', 'Âm nhạc / Nghệ thuật biểu diễn', 'Kiến trúc / Xây dựng', 'AI / Khoa học dữ liệu'],
  social:   ['Kinh tế / Quản trị kinh doanh', 'Luật', 'Du lịch / Địa lý học', 'Dược học'],
}

const THEME_BG: Record<string, string> = {
  tech:     '#0a1a2e',
  nature:   '#0d2818',
  creative: '#1e0a2e',
  social:   '#2a1208',
}

// Default hashtags targeting lớp 10 / 2k11
const DEFAULT_HASHTAGS = '#chọntổhợpmôn #hướngnghiệp #pathfinder #lớp10 #2k11'

function getOpenPathsFromElectives(electives: SubjectCode[]): string[] {
  const s = new Set(electives)
  return MAJORS
    .filter(m => m.requiredSubjects.every(req => s.has(req)))
    .map(m => m.name)
}

function pickCareers(open: string[], theme: string): string[] {
  const pref = THEME_PREF[theme] ?? []
  const prefOpen = pref.filter(p => open.includes(p))
  const rest = open.filter(p => !pref.includes(p))
  return [...prefOpen, ...rest].slice(0, 4)
}

function buildCaption(
  electiveNames: string[],
  careers: string[],
  hashtags: string,
): string {
  const topCareers = careers
    .slice(0, 3)
    .map(c => CAREER_MAP[c]?.short ?? c)
    .join(', ')
  return (
    `Môn tự chọn của mình: ${electiveNames.join(', ')} 📚\n\n` +
    `PathFinder gợi ý các ngành mở rộng cửa với tổ hợp này: ${topCareers}... nghe có hợp không? 🤔\n\n` +
    `Bạn chọn tổ hợp nào? Thử xem kết quả của bạn thế nào nha 👉 pathfinder.careerplan.vn\n\n` +
    hashtags
  )
}

export default function ResultShareCard({ selectedElectives, openPaths, grade }: Props) {
  const [theme, setTheme] = useState<string>('tech')
  const [localElectives, setLocalElectives] = useState<SubjectCode[]>(selectedElectives)
  const [hashtags, setHashtags] = useState(DEFAULT_HASHTAGS)
  const [dlState, setDlState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [cpDone, setCpDone] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [stepsProgress, setStepsProgress] = useState({ s1: false, s2: false, s3: false })

  const localOpen = getOpenPathsFromElectives(localElectives)
  const careers = pickCareers(localOpen, theme)
  const electiveNames = localElectives.map(
    c => ELECTIVE_SUBJECTS.find(s => s.code === c)?.name ?? c,
  )
  const caption = buildCaption(electiveNames, careers, hashtags)

  function toggleElective(code: SubjectCode) {
    setLocalElectives(prev => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev
        return prev.filter(c => c !== code)
      }
      const next = prev.length >= 4 ? [...prev.slice(1), code] : [...prev, code]
      return next
    })
  }

  function markStep(n: 1 | 2 | 3) {
    setStepsProgress(p => ({ ...p, [`s${n}`]: true }))
    setStepsVisible(true)
  }

  async function handleDownload() {
    setDlState('loading')
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas' as string)).default as any
      const card = document.getElementById('pf-share-card')
      if (!card) throw new Error('card not found')
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const a = document.createElement('a')
      a.download = 'pathfinder-ket-qua.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch {
      alert('Hãy chụp màn hình thẻ kết quả để chia sẻ!')
    }
    setDlState('done')
    markStep(1)
    setTimeout(() => setDlState('idle'), 3000)
  }

  function handleCopyCaption() {
    navigator.clipboard.writeText(caption).then(() => {
      setCpDone(true)
      markStep(2)
      setTimeout(() => setCpDone(false), 2500)
    })
  }

  function handleOpenTikTok() {
    markStep(3)
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod|android/.test(ua)) {
      window.location.href = 'tiktok://'
      setTimeout(() => window.open('https://www.tiktok.com', '_blank'), 1000)
    } else {
      window.open('https://www.tiktok.com/upload', '_blank')
    }
  }

  function handleShareFB() {
    const url = encodeURIComponent('https://pathfinder.careerplan.vn')
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const cardBg = THEME_BG[theme] ?? THEME_BG.tech
  const gradeLabel = grade ? `Lớp ${grade}` : 'Lớp 10/11'

  return (
    <div className="space-y-4">

      {/* ── Section label ── */}
      <p className="text-xs font-semibold tracking-widest uppercase text-stone-400">
        Chia sẻ kết quả
      </p>

      {/* ── Card preview ── */}
      <div className="bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
        <div
          id="pf-share-card"
          className="rounded-2xl overflow-hidden w-full"
          style={{ aspectRatio: '4/5', background: cardBg, display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex flex-col h-full p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                PathFinder
              </span>
              <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {gradeLabel}
              </span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                Tổ hợp môn của mình mở ra
              </p>
              <p style={{ fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: 4 }}>
                {careers.length} ngành<br />rộng cửa
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                {careers.slice(0, 3).map(c => CAREER_MAP[c]?.short ?? c).join(' · ')}
              </p>
            </div>

            {/* Careers grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1, alignContent: 'start' }}>
              {careers.map(c => {
                const m = CAREER_MAP[c] ?? { icon: '🎯', short: c.slice(0, 12), eng: '' }
                return (
                  <div
                    key={c}
                    style={{ borderRadius: 10, padding: '9px 10px', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.14)' }}
                  >
                    <span style={{ fontSize: 17, display: 'block', marginBottom: 5 }}>{m.icon}</span>
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2 }}>{m.short}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>{m.eng}</p>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Môn tự chọn
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {electiveNames.map(n => (
                  <span key={n} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
                    {n}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>pathfinder.careerplan.vn</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Theme picker ── */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Chủ đề màu</p>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(THEME_BG) as [string, string][]).map(([key, bg]) => {
            const labels: Record<string, string> = { tech: 'Kỹ thuật', nature: 'Tự nhiên', creative: 'Sáng tạo', social: 'Xã hội' }
            return (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`h-8 rounded-lg text-[9px] font-medium text-white/70 uppercase tracking-wider transition ${theme === key ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                style={{ background: bg }}
              >
                {labels[key]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Elective toggle ── */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Thử đổi môn để xem thẻ thay đổi</p>
        <div className="flex flex-wrap gap-1.5">
          {ELECTIVE_SUBJECTS.map(s => {
            const isSel = localElectives.includes(s.code)
            return (
              <button
                key={s.code}
                onClick={() => toggleElective(s.code)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                  isSel
                    ? 'bg-brand-50 text-brand-800 border-brand-200'
                    : 'bg-transparent text-stone-500 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {isSel ? '✓ ' : ''}{s.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Caption ── */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Caption chia sẻ</p>
        <textarea
          className="input text-xs leading-relaxed"
          rows={5}
          value={caption}
          readOnly
        />
        {/* Hashtag editor */}
        <div className="mt-2">
          <label className="text-xs text-stone-400 mb-1 block">Chỉnh hashtag</label>
          <input
            className="input text-xs"
            type="text"
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
          />
          <p className="text-xs text-stone-400 mt-1">
            Mặc định nhắm tới học sinh lớp 10 và gen 2k11.
          </p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Download — full width */}
        <button
          className="col-span-2 btn-primary flex items-center justify-center gap-2"
          onClick={handleDownload}
          disabled={dlState === 'loading'}
        >
          {dlState === 'loading' && <span className="animate-spin text-sm">⏳</span>}
          {dlState === 'done'    && '✓ '}
          {dlState === 'loading' ? 'Đang tạo ảnh...' : dlState === 'done' ? 'Đã tải ảnh!' : '⬇ Tải ảnh về máy'}
        </button>

        {/* Copy caption */}
        <button
          className={`btn-secondary flex items-center justify-center gap-2 text-sm ${cpDone ? 'bg-brand-50 text-brand-700 border-brand-200' : ''}`}
          onClick={handleCopyCaption}
        >
          {cpDone ? '✓ Đã copy!' : '📋 Copy caption'}
        </button>

        {/* TikTok */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: '#010101' }}
          onClick={handleOpenTikTok}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
          </svg>
          Mở TikTok
        </button>

        {/* Facebook */}
        <button
          className="col-span-2 btn-secondary flex items-center justify-center gap-2 text-sm"
          onClick={handleShareFB}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
          Chia sẻ Facebook
        </button>
      </div>

      {/* ── TikTok 3-step guide — appears after first action ── */}
      {stepsVisible && (
        <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
            <span className="text-sm">📱</span>
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
              Cách đăng lên TikTok — 3 bước
            </span>
          </div>
          {[
            {
              n: 1 as const,
              done: stepsProgress.s1,
              title: 'Tải ảnh về máy',
              desc: 'Bấm "Tải ảnh về máy" — ảnh lưu vào thư viện điện thoại.',
            },
            {
              n: 2 as const,
              done: stepsProgress.s2,
              title: 'Copy caption',
              desc: 'Bấm "Copy caption" để lấy nội dung kèm hashtag.',
            },
            {
              n: 3 as const,
              done: stepsProgress.s3,
              title: 'Mở TikTok → đăng ảnh',
              desc: 'Bấm + → chọn Ảnh → chọn ảnh vừa tải → paste caption → đăng.',
            },
          ].map(step => (
            <div
              key={step.n}
              className="flex items-start gap-3 px-4 py-3 border-b border-stone-100 dark:border-stone-700 last:border-0"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 transition-colors ${
                  step.done
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                }`}
              >
                {step.done ? '✓' : step.n}
              </div>
              <div>
                <p className="text-xs font-medium text-stone-700 dark:text-stone-300 mb-0.5">{step.title}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
