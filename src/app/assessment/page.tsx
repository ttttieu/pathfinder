'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepProfile    from '@/components/steps/StepProfile'
import StepCompetency from '@/components/steps/StepCompetency'
import StepSubjects   from '@/components/steps/StepSubjects'
import ProgressBar    from '@/components/ui/ProgressBar'
import {
  COMPETENCIES, ELECTIVE_SUBJECTS, ALL_SUBJECTS,
} from '@/lib/knowledge-graph'
import type {
  StudentProfile, CompetencyCode, SubjectCode,
} from '@/types'

const STEP_NAMES = [
  'Hồ sơ học sinh',
  'Tự đánh giá năng lực',
  'Chọn môn lựa chọn',
]

const defaultCompetency = () =>
  Object.fromEntries(COMPETENCIES.map(c => [c.code, 3])) as Record<CompetencyCode, number>

const defaultSubjectScores = () =>
  Object.fromEntries(ALL_SUBJECTS.map(s => [s.code, 3])) as Record<SubjectCode, number>

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState<StudentProfile>({
    name: '', email: '', phone: '', grade: '11', school: '', province: '',
  })
  const [competencyScores, setCompetencyScores] = useState(defaultCompetency)
  const [subjectScores, setSubjectScores] = useState(defaultSubjectScores)
  const [selectedElectives, setSelectedElectives] = useState<SubjectCode[]>([])

  async function handleSubmit() {
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          competencyScores,
          subjectScores,
          selectedElectives,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Có lỗi xảy ra, vui lòng thử lại.')
        setSubmitting(false)
        return
      }

      router.push(`/result/${data.assessmentId}`)
    } catch {
      setError('Không thể kết nối máy chủ. Vui lòng thử lại.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
              PathFinder
            </span>
          </div>
          <h1 className="text-xl font-semibold text-stone-900">
            Khám phá tác động của lựa chọn môn học
          </h1>
        </div>

        {/* Progress */}
        <ProgressBar current={step} total={3} labels={STEP_NAMES} />

        {/* Steps */}
        {step === 1 && (
          <StepProfile
            value={profile}
            onChange={setProfile}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepCompetency
            competencyScores={competencyScores}
            subjectScores={subjectScores}
            onChangeCompetency={setCompetencyScores}
            onChangeSubject={setSubjectScores}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepSubjects
            competencyScores={competencyScores}
            selectedElectives={selectedElectives}
            onChange={setSelectedElectives}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}
      </div>
    </main>
  )
}
