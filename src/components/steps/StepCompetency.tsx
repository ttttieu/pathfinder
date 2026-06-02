'use client'

import { COMPETENCIES, CORE_SUBJECTS, ELECTIVE_SUBJECTS } from '@/lib/knowledge-graph'
import type { CompetencyCode, SubjectCode } from '@/types'

interface Props {
  competencyScores: Record<CompetencyCode, number>
  subjectScores: Record<SubjectCode, number>
  onChangeCompetency: (s: Record<CompetencyCode, number>) => void
  onChangeSubject: (s: Record<SubjectCode, number>) => void
  onBack: () => void
  onNext: () => void
}

function ScoreSlider({
  label,
  value,
  onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-stone-700">{label}</span>
        <span className="text-xs font-bold text-brand-600 w-4 text-right">{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-stone-200 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-1 bg-brand-400 rounded-full transition-all"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          className="absolute opacity-0 w-full cursor-pointer"
          style={{ position: 'relative', width: '100%', height: 16 }}
        />
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full mt-1 accent-brand-400"
      />
    </div>
  )
}

export default function StepCompetency({
  competencyScores,
  subjectScores,
  onChangeCompetency,
  onChangeSubject,
  onBack,
  onNext,
}: Props) {
  function setComp(code: CompetencyCode, val: number) {
    onChangeCompetency({ ...competencyScores, [code]: val })
  }

  function setSubj(code: SubjectCode, val: number) {
    onChangeSubject({ ...subjectScores, [code]: val })
  }

  return (
    <div className="space-y-4">
      {/* Competencies */}
      <div className="card">
        <div className="field-label">Tôi thích — đánh giá 1 đến 5</div>
        <p className="text-xs text-stone-400 mb-4">Hãy thành thật để kết quả phản ánh đúng bản thân.</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {COMPETENCIES.map(c => (
            <ScoreSlider
              key={c.code}
              label={c.name}
              value={competencyScores[c.code] ?? 3}
              onChange={v => setComp(c.code, v)}
            />
          ))}
        </div>
      </div>

      {/* Subject self-rating */}
      <div className="card">
        <div className="field-label">Tôi học tốt môn</div>
        <p className="text-xs text-stone-400 mb-4">Bao gồm môn bắt buộc và các môn đang học thêm.</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {[...CORE_SUBJECTS, ...ELECTIVE_SUBJECTS.slice(0, 5)].map(s => (
            <ScoreSlider
              key={s.code}
              label={s.name}
              value={subjectScores[s.code] ?? 3}
              onChange={v => setSubj(s.code, v)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>← Quay lại</button>
        <button className="btn-primary" onClick={onNext}>Tiếp theo →</button>
      </div>
    </div>
  )
}
