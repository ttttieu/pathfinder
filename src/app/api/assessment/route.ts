import { NextRequest, NextResponse } from 'next/server'
import { AssessmentSchema } from '@/lib/schemas'
import { computeRecommendation, ELECTIVE_SUBJECTS, CORE_SUBJECTS } from '@/lib/knowledge-graph'
import { createAdminClient } from '@/lib/supabase'
import { buildCRMRecord, pushToCRM } from '@/lib/crm'
import type { CompetencyCode, SubjectCode } from '@/types'

export async function POST(req: NextRequest) {
  // 1. Parse & validate
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = AssessmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { profile, competencyScores, subjectScores, selectedElectives } = parsed.data

  // 2. Compute recommendation (pure logic — no DB needed)
  const result = computeRecommendation(
    competencyScores as Record<CompetencyCode, number>,
    selectedElectives as SubjectCode[],
  )

  // 3. Persist to Supabase
  const supabase = createAdminClient()

  // Upsert student by email
  const { data: student, error: studentErr } = await supabase
    .from('students')
    .upsert(
      {
        email:    profile.email,
        name:     profile.name ?? null,
        phone:    profile.phone ?? null,
        grade:    profile.grade,
        school:   profile.school ?? null,
        province: profile.province ?? null,
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )
    .select('id')
    .single()

  if (studentErr) {
    console.error('[assessment] student upsert error:', studentErr)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const { data: assessment, error: assessErr } = await supabase
    .from('assessments')
    .insert({
      student_id:         student.id,
      competency_scores:  competencyScores,
      subject_scores:     subjectScores,
      selected_electives: selectedElectives,
      open_paths:         result.openPaths,
      restricted_paths:   result.restrictedPaths,
      strengths:          result.strengths,
      insights:           result.insights,
    })
    .select('id')
    .single()

  if (assessErr) {
    console.error('[assessment] assessment insert error:', assessErr)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // 4. Push to CRM (fire-and-forget)
  const allSubjectNames = [
    ...CORE_SUBJECTS.map(s => s.name),
    ...selectedElectives.map(
      code => ELECTIVE_SUBJECTS.find(s => s.code === code)?.name ?? code,
    ),
  ]
  const crmRecord = buildCRMRecord({
    ...profile,
    selectedElectives,
    subjectNames:     allSubjectNames,
    strengths:        result.strengths,
    openPaths:        result.openPaths,
    restrictedPaths:  result.restrictedPaths,
  })
  pushToCRM(crmRecord) // non-blocking

  // 5. Respond
  return NextResponse.json({
    assessmentId: assessment.id,
    studentId:    student.id,
    ...result,
  })
}
