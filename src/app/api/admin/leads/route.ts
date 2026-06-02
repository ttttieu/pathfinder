import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function requireAdmin(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-secret')
  return auth === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      created_at,
      selected_electives,
      open_paths,
      restricted_paths,
      strengths,
      students ( email, name, phone, grade, school, province )
    `)
    .order('created_at', { ascending: false })
    .limit(5000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Build CSV
  const headers = [
    'id', 'created_at', 'email', 'name', 'phone',
    'grade', 'school', 'province',
    'selected_electives', 'open_paths', 'restricted_paths', 'strengths',
  ]

  const rows = (data ?? []).map(row => {
    const s = row.students as Record<string, string> | null
    return [
      row.id,
      row.created_at,
      s?.email ?? '',
      s?.name ?? '',
      s?.phone ?? '',
      s?.grade ?? '',
      s?.school ?? '',
      s?.province ?? '',
      (row.selected_electives as string[]).join('; '),
      (row.open_paths as string[]).join('; '),
      (row.restricted_paths as string[]).join('; '),
      (row.strengths as string[]).join('; '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`)
  })

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pathfinder-leads-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
