'use client'

import { useState } from 'react'
import GalaxyBrain from '@/components/bestie/GalaxyBrain'
import BestieQuiz from '@/components/bestie/BestieQuiz'

type View = 'home' | 'quiz'

export default function BestiePage() {
  const [view, setView] = useState<View>('home')
  const [ttLink, setTtLink] = useState('')

  function unlock() {
    setView('quiz')
  }

  if (view === 'quiz') {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-lg mx-auto mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('home')}
              className="text-sm text-stone-400 hover:text-stone-600 transition"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
              <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                Bestie Finder
              </span>
            </div>
          </div>
        </div>
        <BestieQuiz />
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
            Bestie Finder
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-3xl font-medium leading-tight mb-3">
            Tôi biết mày<br />
            như nào —<br />
            <span className="text-brand-600">kể cả chưa gặp.</span>
          </h1>
          <p className="text-stone-500 leading-relaxed">
            8 câu hỏi nhỏ. Không có đáp án sai.<br />
            Kết quả thì... tuỳ mày tin không thôi.
          </p>
        </div>

        {/* Unlock card */}
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
              Mở khoá chân dung bạn thân
            </p>
            <p className="text-xs text-stone-500">
              Paste link TikTok PathFinder của bạn để bắt đầu
            </p>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                className="input flex-1 text-sm"
                placeholder="https://tiktok.com/@bạn/video/..."
                value={ttLink}
                onChange={e => setTtLink(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ttLink.trim().length >= 3 && unlock()}
              />
              <button
                className="btn-primary text-sm px-4"
                onClick={unlock}
                disabled={ttLink.trim().length < 3}
              >
                Mở khoá
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Chưa đăng TikTok?{' '}
              <button
                onClick={unlock}
                className="underline underline-offset-2 hover:text-stone-600 transition"
              >
                Bỏ qua, vào thẳng quiz
              </button>
            </p>
          </div>
        </div>

        {/* Galaxy Brain meme */}
        <GalaxyBrain />

        {/* Footer link back */}
        <p className="text-center text-xs text-stone-400">
          Từ team{' '}
          <a
            href="/"
            className="underline underline-offset-2 hover:text-stone-600 transition"
          >
            PathFinder
          </a>{' '}
          · pathfinder.careerplan.vn
        </p>

      </div>
    </main>
  )
}
