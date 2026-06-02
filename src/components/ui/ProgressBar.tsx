interface Props {
  current: number   // 1-based
  total: number
  labels: string[]
}

export default function ProgressBar({ current, total, labels }: Props) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i + 1 < current
                ? 'bg-brand-400'
                : i + 1 === current
                ? 'bg-brand-200'
                : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-stone-400">
        Bước {current}/{total} ·{' '}
        <strong className="text-stone-600">{labels[current - 1]}</strong>
      </p>
    </div>
  )
}
