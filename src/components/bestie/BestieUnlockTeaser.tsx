'use client'

import Link from 'next/link'

export default function BestieUnlockTeaser() {
  return (
    <div className="card p-0 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
            Bestie Finder
          </span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          Mới
        </span>
      </div>

      {/* Copy */}
      <div className="px-4 py-4">
        <p className="text-sm font-medium mb-1.5">
          Chia sẻ để mở khoá chân dung bạn thân suốt thời trung học!
        </p>
        <p className="text-xs text-stone-500 leading-relaxed mb-4">
          Đăng kết quả PathFinder lên TikTok → paste link → 8 câu hỏi → ra chân dung người bạn chưa
          gặp nhưng sẽ nhận ra ngay.
        </p>

        {/* Mini Bestie landing mockup */}
        <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden mb-4">

          {/* Mock browser bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-red-300" />
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            <span className="w-2 h-2 rounded-full bg-green-300" />
            <span className="flex-1 ml-2 text-xs text-stone-400 bg-white dark:bg-stone-900 rounded px-2 py-0.5 border border-stone-200 dark:border-stone-700">
              pathfinder.careerplan.vn/bestie
            </span>
          </div>

          {/* Page content preview */}
          <div className="px-4 py-4 space-y-3">
            <div>
              <p className="text-xs font-medium leading-snug">
                Tôi biết mày như nào —{' '}
                <span className="text-brand-600">kể cả chưa gặp.</span>
              </p>
              <p className="text-xs text-stone-400 mt-0.5">8 câu hỏi · personality fit · profile card</p>
            </div>

            {/* Galaxy Brain mini */}
            <div className="space-y-1.5">
              {[
                { emoji: '🧒', brain: '🧠',    text: 'Mày làm gì sau giờ học?' },
                { emoji: '⚡', brain: '🧠🧠🧠', text: 'Big Five + MBTI-lite + conflict style' },
                { emoji: '✨', brain: '🤯',     text: 'Chân dung bạn thân hoàn chỉnh', highlight: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm w-5 text-center">{row.emoji}</span>
                  <span className={`text-xs flex-1 ${row.highlight ? 'text-brand-600 font-medium' : 'text-stone-500'}`}>
                    {row.text}
                  </span>
                  <span className="text-xs">{row.brain}</span>
                </div>
              ))}
            </div>

            {/* Mock unlock row */}
            <div className="flex gap-1.5">
              <div className="flex-1 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center px-2">
                <span className="text-xs text-stone-400">tiktok.com/@bạn/video/...</span>
              </div>
              <div className="px-3 h-7 rounded-lg bg-brand-600 flex items-center">
                <span className="text-xs text-white font-medium">Mở khoá</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/bestie"
          className="btn-primary w-full justify-center text-sm"
        >
          Khám phá Bestie Finder →
        </Link>
      </div>
    </div>
  )
}
