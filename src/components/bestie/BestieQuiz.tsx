'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  QUESTIONS, PROFILES_MALE, PROFILES_FEMALE,
  pickProfile, buildShareCaption,
  DEFAULT_SCORES,
  type ScoreDims, type GenderTarget, type BestieProfile,
} from '@/lib/bestie-data'

type Screen = 'gender' | 'quiz' | 'loading' | 'result'

const LOADING_STEPS = [
  { emoji: '🔍', text: 'Đang đọc câu trả lời', sub: 'Nhìn vào từng lựa chọn của bạn...' },
  { emoji: '🧩', text: 'Phân tích personality', sub: 'Big Five + Attachment style đang chạy...' },
  { emoji: '✨', text: 'Sắp xong rồi', sub: 'Chân dung đang hiện ra...' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-stone-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <div className="h-full bg-brand-400 rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-brand-600 w-8 text-right">{value}%</span>
    </div>
  )
}

function ProfileCard({
  profile,
  onTikTok,
  onCopy,
  copied,
}: {
  profile: BestieProfile
  onTikTok: () => void
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-7 pb-5 text-center border-b border-stone-100 dark:border-stone-800">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 border-2"
          style={{ background: profile.color, borderColor: profile.color }}
        >
          {profile.emoji}
        </div>
        <h2 className="text-xl font-medium mb-2">{profile.name}</h2>
        <span
          className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
          style={{ background: profile.color, color: profile.textColor }}
        >
          {profile.mbti}
        </span>
        <p className="text-sm text-stone-500 leading-relaxed">{profile.tagline}</p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Traits */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
            Điểm nổi bật
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.traits.map(t => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
            Sở thích chung
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.hobbies.map(h => (
              <span
                key={h}
                className="text-xs px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Compat bars */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">
            Chỉ số hợp nhau
          </p>
          <div className="space-y-2">
            {Object.entries(profile.compat).map(([label, value]) => (
              <CompatBar key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1.5">
            Tại sao hợp nhau?
          </p>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {profile.insight}
          </p>
        </div>

        {/* Quote */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
            {profile.quote}
          </p>
        </div>
      </div>

      {/* Share strip */}
      <div className="px-6 pb-6 flex gap-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <button
          onClick={onTikTok}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: '#010101' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z" />
          </svg>
          Đăng TikTok
        </button>
        <button
          onClick={onCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition ${
            copied
              ? 'bg-brand-50 text-brand-700 border-brand-200'
              : 'bg-transparent text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          {copied ? '✓ Đã copy!' : '📋 Copy caption'}
        </button>
      </div>
    </div>
  )
}

// ─── PathFinder mini-preview (page-in-page) ───────────────────────────────────

function PathFinderPreview() {
  const CAREERS = [
    { icon: '💻', label: 'CNTT' },
    { icon: '🤖', label: 'AI' },
    { icon: '⚡', label: 'Kỹ thuật' },
    { icon: '📈', label: 'Kinh tế' },
  ]

  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
        <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
          Khám phá thêm
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm font-medium mb-1.5">Tổ hợp môn của bạn mở ra ngành gì?</p>
        <p className="text-xs text-stone-500 leading-relaxed mb-4">
          Biết tính cách là bước một. Biết ngành học phù hợp là bước hai — PathFinder giúp bạn xem
          tác động của lựa chọn môn học trước khi đăng ký.
        </p>

        {/* Mini card */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#0a1a2e' }}>
          <div className="p-4 flex justify-between items-start gap-3">
            <div>
              <p style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>
                PathFinder
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.2 }}>
                4 ngành rộng cửa
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 3 }}>
                Vật lý · Tin học · Hóa · Công nghệ
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1 flex-shrink-0">
              {CAREERS.map(c => (
                <div
                  key={c.label}
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    border: '0.5px solid rgba(255,255,255,.14)',
                    borderRadius: 8,
                    padding: '5px 8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 14 }}>{c.icon}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderTop: '0.5px solid rgba(255,255,255,.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>pathfinder.careerplan.vn</span>
            <a
              href="https://pathfinder.careerplan.vn"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#5DCAA5', fontWeight: 500 }}
            >
              Thử ngay →
            </a>
          </div>
        </div>

        <a
          href="https://pathfinder.careerplan.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center text-sm"
        >
          Khám phá PathFinder →
        </a>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BestieQuiz() {
  const [screen, setScreen] = useState<Screen>('gender')
  const [gender, setGender] = useState<GenderTarget | null>(null)
  const [scores, setScores] = useState<ScoreDims>({ ...DEFAULT_SCORES })
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [qIdx, setQIdx] = useState(0)
  const [profile, setProfile] = useState<BestieProfile | null>(null)
  const [copied, setCopied] = useState(false)
  const [loadStep, setLoadStep] = useState(0)

  function handleGender(g: GenderTarget) {
    setGender(g)
  }

  function startQuiz() {
    if (!gender) return
    setQIdx(0)
    setScreen('quiz')
  }

  function handlePick(qId: keyof ScoreDims, val: number, ci: number) {
    const q = QUESTIONS[qIdx]
    const prev = answers[qId]
    const newScores = { ...scores }
    if (prev !== undefined) newScores[qId] -= prev
    newScores[qId] += val

    setScores(newScores)
    setAnswers(a => ({ ...a, [qId]: val }))

    // Auto-advance after short delay
    const isLast = qIdx === QUESTIONS.length - 1
    setTimeout(() => {
      if (isLast) {
        runLoading(newScores)
      } else {
        setQIdx(i => i + 1)
      }
    }, 320)
  }

  function runLoading(finalScores: ScoreDims) {
    setLoadStep(0)
    setScreen('loading')
    let step = 0
    const iv = setInterval(() => {
      step++
      if (step < LOADING_STEPS.length) setLoadStep(step)
    }, 900)
    setTimeout(() => {
      clearInterval(iv)
      const p = pickProfile(finalScores, gender!)
      setProfile(p)
      setScreen('result')
    }, 2800)
  }

  function handleCopy() {
    if (!profile) return
    navigator.clipboard.writeText(buildShareCaption(profile)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handleTikTok() {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod|android/.test(ua)) {
      window.location.href = 'tiktok://'
      setTimeout(() => window.open('https://www.tiktok.com', '_blank'), 1000)
    } else {
      window.open('https://www.tiktok.com/upload', '_blank')
    }
  }

  function restart() {
    setScreen('gender')
    setGender(null)
    setScores({ ...DEFAULT_SCORES })
    setAnswers({})
    setQIdx(0)
    setProfile(null)
  }

  const currentQ = QUESTIONS[qIdx]
  const ls = LOADING_STEPS[loadStep]

  return (
    <div className="max-w-lg mx-auto">

      {/* ── Gender selection ── */}
      {screen === 'gender' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1.5">
              Trước khi bắt đầu
            </p>
            <h2 className="text-lg font-medium mb-1">Bạn đang tìm bạn thân kiểu nào?</h2>
            <p className="text-sm text-stone-500">Chọn một, mình sẽ tạo chân dung phù hợp.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['nam', 'nu'] as const).map(g => (
              <button
                key={g}
                onClick={() => handleGender(g)}
                className={`py-5 rounded-xl border text-center transition font-medium ${
                  gender === g
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <span className="text-3xl block mb-2">{g === 'nam' ? '👦' : '👧'}</span>
                <span className="text-sm">Bạn {g}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button className="btn-primary" onClick={startQuiz} disabled={!gender}>
              Bắt đầu →
            </button>
          </div>
        </div>
      )}

      {/* ── Quiz ── */}
      {screen === 'quiz' && currentQ && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-0.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-300"
                style={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-stone-400 whitespace-nowrap">
              {qIdx + 1}/{QUESTIONS.length}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1">
              Câu {qIdx + 1}
            </p>
            <h2 className="text-base font-medium leading-snug mb-1">{currentQ.text}</h2>
            {currentQ.sub && (
              <p className="text-sm text-stone-500">{currentQ.sub}</p>
            )}
          </div>

          <div className="space-y-2">
            {currentQ.choices.map((c, ci) => {
              const sel = answers[currentQ.id] === c.val
              return (
                <button
                  key={ci}
                  onClick={() => handlePick(currentQ.id, c.val, ci)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                    sel
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">{c.emoji}</span>
                  <div>
                    <p className={`text-sm ${sel ? 'text-brand-700' : 'text-stone-700'}`}>{c.label}</p>
                    {c.sub && <p className="text-xs text-stone-400 mt-0.5">{c.sub}</p>}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-1">
            <button
              className="text-sm text-stone-400 hover:text-stone-600 transition"
              onClick={() => qIdx === 0 ? setScreen('gender') : setQIdx(i => i - 1)}
            >
              ← Quay lại
            </button>
            <button
              className="btn-primary text-sm"
              disabled={answers[currentQ.id] === undefined}
              onClick={() => {
                const isLast = qIdx === QUESTIONS.length - 1
                if (isLast) runLoading(scores)
                else setQIdx(i => i + 1)
              }}
            >
              {qIdx === QUESTIONS.length - 1 ? 'Xem kết quả →' : 'Tiếp theo →'}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {screen === 'loading' && (
        <div className="text-center py-16">
          <span className="text-5xl block mb-5 transition-all">{ls.emoji}</span>
          <p className="text-base font-medium mb-2">{ls.text}...</p>
          <p className="text-sm text-stone-500">{ls.sub}</p>
        </div>
      )}

      {/* ── Result ── */}
      {screen === 'result' && profile && (
        <div className="space-y-4">
          <ProfileCard
            profile={profile}
            onTikTok={handleTikTok}
            onCopy={handleCopy}
            copied={copied}
          />

          <PathFinderPreview />

          <div className="text-center">
            <button
              onClick={restart}
              className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition"
            >
              ↺ Thử lại từ đầu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
