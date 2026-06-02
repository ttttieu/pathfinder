'use client'

import { ELECTIVE_SUBJECTS, MAX_ELECTIVES } from '@/lib/knowledge-graph'
import type { CompetencyCode, SubjectCode } from '@/types'

interface Props {
  competencyScores: Record<CompetencyCode, number>
  selectedElectives: SubjectCode[]
  onChange: (s: SubjectCode[]) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}

export default function StepSubjects({
  competencyScores,
  selectedElectives,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: Props) {
  const n = selectedElectives.length

  function toggle(code: SubjectCode) {
    if (selectedElectives.includes(code)) {
      onChange(selectedElectives.filter(c => c !== code))
    } else if (n < MAX_ELECTIVES) {
      onChange([...selectedElectives, code])
    }
  }

  // Real-time contextual hint
  let hint = ''
  if (n === MAX_ELECTIVES) {
    const sel = selectedElectives
    const hasTech = (competencyScores['TECHNICAL'] ?? 0) >= 4
    const hasSci  = sel.includes('PHYSICS') || sel.includes('CHEMISTRY') || sel.includes('BIOLOGY')

    if (hasTech && !sel.includes('INFORMATICS') && !sel.includes('PHYSICS')) {
      hint = '💡 Bạn có thiên hướng kỹ thuật — hãy cân nhắc đổi một môn để lấy Tin học hoặc Vật lý.'
    } else if (sel.includes('BIOLOGY') && sel.includes('CHEMISTRY') && !sel.includes('PHYSICS')) {
      hint = '💡 Sinh + Hóa mở ngành Y, Dược, Công nghệ sinh học. Thêm Vật lý nếu muốn hướng Kỹ thuật.'
    } else if (sel.includes('PHYSICS') && sel.includes('INFORMATICS')) {
      hint = '✅ Vật lý + Tin học là tổ hợp mạnh cho Kỹ thuật điện, CNTT và AI.'
    }
  }

  const counterColor =
    n === MAX_ELECTIVES ? 'text-brand-600 bg-brand-50 border-brand-200' :
    n > MAX_ELECTIVES   ? 'text-red-600 bg-red-50 border-red-200' :
                          'text-stone-500 bg-stone-100 border-stone-200'

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="field-label">Môn lựa chọn — chọn đúng 4 trong 9</div>

        <p className="text-xs text-stone-400 leading-relaxed mb-3 p-3 bg-stone-50 rounded-lg border border-stone-200 border-l-2 border-l-brand-200">
          Ngoài 4 môn bắt buộc (<strong className="text-stone-600">Toán, Ngữ văn, Ngoại ngữ, Lịch sử</strong>),
          học sinh chọn thêm <strong className="text-stone-600">đúng 4 môn</strong> trong nhóm dưới đây theo chương trình THPT 2018.
        </p>

        {/* Counter */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border mb-3 ${counterColor}`}>
          {n === MAX_ELECTIVES ? `✓ Đã chọn đủ ${MAX_ELECTIVES} môn` : `Đã chọn ${n}/${MAX_ELECTIVES} môn`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2">
          {ELECTIVE_SUBJECTS.map(s => {
            const selected = selectedElectives.includes(s.code)
            const disabled = !selected && n >= MAX_ELECTIVES
            return (
              <button
                key={s.code}
                onClick={() => !disabled && toggle(s.code)}
                className={`chip ${selected ? 'chip-selected' : ''} ${disabled ? 'chip-disabled' : ''}`}
              >
                {selected && <span className="mr-1 text-xs">✓</span>}
                {s.name}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        {hint && (
          <p className="mt-3 text-xs text-stone-700 leading-relaxed p-3 bg-amber-50 rounded-lg border border-amber-200 border-l-2 border-l-amber-400">
            {hint}
          </p>
        )}

        {/* Selected preview */}
        {n === MAX_ELECTIVES && (
          <div className="mt-3 p-3 bg-stone-50 rounded-lg text-xs text-stone-500 leading-relaxed">
            Tổ hợp:{' '}
            {selectedElectives.map(c => (
              <span key={c} className="font-medium text-brand-600 mr-1">
                {ELECTIVE_SUBJECTS.find(s => s.code === c)?.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button className="btn-secondary" onClick={onBack} disabled={submitting}>
          ← Quay lại
        </button>
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={n !== MAX_ELECTIVES || submitting}
        >
          {submitting ? 'Đang xử lý...' : 'Xem kết quả →'}
        </button>
      </div>

      <p className="text-center text-xs text-stone-400">
        Cần chọn đúng {MAX_ELECTIVES} môn để tiếp tục
      </p>
    </div>
  )
}
