import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import { ELECTIVE_SUBJECTS } from '@/lib/knowledge-graph'
import ResultCRMCard from '@/components/ResultCRMCard'

interface Props {
  params: { id: string }
}

export default async function ResultPage({ params }: Props) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id, created_at, selected_electives,
      open_paths, restricted_paths, strengths, insights,
      students ( email, name, grade, school, province )
    `)
    .eq('id', params.id)
    .single()

  if (error || !data) notFound()

  const student = data.students as Record<string, string> | null
  const electives = (data.selected_electives as string[])
    .map(c => ELECTIVE_SUBJECTS.find(s => s.code === c)?.name ?? c)

  const coreNames = ['Toán', 'Ngữ văn', 'Ngoại ngữ', 'Lịch sử']
  const allSubjects = [...coreNames, ...electives]

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400">PathFinder · Kết quả</span>
          </div>
          {student?.name && (
            <h1 className="text-xl font-semibold text-stone-900">
              Xin chào, <span className="text-brand-600">{student.name}</span>!
            </h1>
          )}
          <p className="text-sm text-stone-500 mt-1">
            {student?.grade ? `Lớp ${student.grade}` : ''}
            {student?.school ? ` · ${student.school}` : ''}
          </p>
        </div>

        {/* Tổ hợp đã chọn */}
        <div className="card">
          <div className="field-label mb-3">Tổ hợp môn đã chọn</div>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map(name => (
              <span
                key={name}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  coreNames.includes(name)
                    ? 'bg-stone-100 text-stone-500'
                    : 'bg-brand-50 text-brand-600 border border-brand-200'
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Điểm mạnh */}
        {(data.strengths as string[]).length > 0 && (
          <div className="card">
            <div className="field-label mb-3">Điểm mạnh nổi bật</div>
            <div className="flex flex-wrap gap-2">
              {(data.strengths as string[]).map(s => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cánh cửa mở / thu hẹp */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card">
            <div className="field-label text-green-600 mb-3">🟢 Cánh cửa mở</div>
            <ul className="space-y-2">
              {(data.open_paths as string[]).map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-stone-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="field-label text-red-500 mb-3">🔴 Thu hẹp</div>
            <ul className="space-y-2">
              {(data.restricted_paths as string[]).slice(0, 5).map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gợi ý */}
        <div className="card">
          <div className="field-label mb-3">Gợi ý suy nghĩ</div>
          <ul className="space-y-3">
            {(data.insights as string[]).map((insight, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-700 leading-relaxed">
                <span className="flex-shrink-0">💬</span>
                <span dangerouslySetInnerHTML={{ __html: insight }} />
              </li>
            ))}
          </ul>
        </div>

        {/* CRM export card (client component) */}
        <ResultCRMCard
          email={student?.email ?? ''}
          name={student?.name ?? ''}
          grade={student?.grade ?? ''}
          school={student?.school ?? ''}
          province={student?.province ?? ''}
          subjects={allSubjects.join(', ')}
          strengths={(data.strengths as string[]).join(', ')}
          openPaths={(data.open_paths as string[])}
          restrictedPaths={(data.restricted_paths as string[])}
          assessmentId={data.id}
        />

        {/* Restart */}
        <div className="text-center pt-2">
          <Link href="/assessment" className="btn-secondary text-sm">
            ↺ Bắt đầu lại
          </Link>
        </div>
      </div>
    </main>
  )
}
