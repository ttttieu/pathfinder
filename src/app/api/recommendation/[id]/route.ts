import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      created_at,
      selected_electives,
      competency_scores,
      open_paths,
      restricted_paths,
      strengths,
      insights,
      students (
        id, email, name, grade, school, province
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    assessmentId:     data.id,
    createdAt:        data.created_at,
    student:          data.students,
    selectedElectives: data.selected_electives,
    strengths:        data.strengths,
    openPaths:        data.open_paths,
    restrictedPaths:  data.restricted_paths,
    insights:         data.insights,
  })
}
