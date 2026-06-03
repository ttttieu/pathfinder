const STEPS = [
  {
    emoji: '🧒',
    bg: 'bg-stone-100 dark:bg-stone-800',
    ring: 'border-stone-200',
    brain: '🧠',
    title: 'Mày làm gì sau giờ học?',
    desc: 'Câu hỏi bình thường để hiểu bạn thích năng lượng kiểu nào',
  },
  {
    emoji: '🔍',
    bg: 'bg-brand-50',
    ring: 'border-brand-200',
    brain: '🧠🧠',
    title: 'Bạn thân nhắn "buồn lắm" — mày làm gì?',
    desc: 'Đo attachment style: mày cần được lắng nghe hay được giải quyết vấn đề',
  },
  {
    emoji: '⚡',
    bg: 'bg-purple-50 dark:bg-purple-950',
    ring: 'border-purple-200',
    brain: '🧠🧠🧠',
    title: '8 câu hỏi × pattern tâm lý học',
    desc: 'Big Five + MBTI-lite + conflict style = personality map của mày',
  },
  {
    emoji: '✨',
    bg: 'bg-brand-600',
    ring: 'border-brand-600',
    brain: '🤯',
    title: 'Chân dung bạn thân hoàn chỉnh',
    desc: 'Tên, tính cách, sở thích, câu nói đặc trưng — người chưa gặp nhưng mày sẽ nhận ra ngay',
    highlight: true,
  },
]

export default function GalaxyBrain() {
  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
        <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
          Galaxy Brain
        </span>
      </div>

      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 border ${step.bg} ${step.ring}`}
            >
              <span>{step.emoji}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-medium mb-0.5 ${
                  step.highlight ? 'text-brand-600' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">{step.desc}</p>
            </div>

            {/* Brain emoji */}
            <span className="text-base flex-shrink-0 mt-0.5">{step.brain}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
        <p className="text-xs text-stone-400 text-center italic">
          "Tôi biết mày như nào kể cả chưa gặp." — Bestie Finder
        </p>
      </div>
    </div>
  )
}
