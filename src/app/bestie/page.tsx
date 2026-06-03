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
      <main className="min-h-screen flex flex-col items-center px-4 py-10">
        <div className="max-w-lg w-full mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setView('home')}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              ← Quay lại
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block" />
              <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                Bestie Finder
              </span>
            </div>
          </div>
          <p className="text-sm text-stone-500 text-center">
            Trả lời nhanh để mở khóa chân dung bạn thân hợp vibe nhất.
          </p>
        </div>
        <div className="max-w-lg w-full">
          <BestieQuiz />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block" />
          <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
            Bestie Finder
          </span>
        </div>

        {/* Headline */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight mb-4 text-stone-900">
            Tôi biết mày<br />
            như nào —<br />
            <span className="text-brand-600">kể cả chưa gặp.</span>
          </h1>
          <p className="text-stone-500 text-base leading-relaxed">
            8 câu hỏi nhỏ. Không có đáp án sai.<br />
            Kết quả thì... tuỳ mày tin không thôi.
          </p>
        </div>

        {/* Unlock card */}
        <div className="card p-0 overflow-hidden text-left">
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
                className="btn-primary text-sm px-4 py-2.5"
                onClick={unlock}
                disabled={ttLink.trim().length < 3}
              >
                Mở khoá
              </button>
            </div>            
          </div>
        </div>

        {/* Galaxy Brain meme */}
        <div className="mt-8">
          <GalaxyBrain />
        </div>

        {/* Footer link back */}
        <p className="text-xs text-stone-400 mt-8">
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
