import type { Competency, Subject, Major, CompetencyCode, SubjectCode } from '@/types'

export const COMPETENCIES: Competency[] = [
  { code: 'ANALYTICAL',     name: 'Tư duy phân tích' },
  { code: 'TECHNICAL',      name: 'Kỹ thuật / Công nghệ' },
  { code: 'CREATIVE',       name: 'Sáng tạo' },
  { code: 'SOCIAL',         name: 'Làm việc với người' },
  { code: 'ENTREPRENEURIAL',name: 'Kinh doanh / Lãnh đạo' },
  { code: 'DESIGN',         name: 'Thiết kế / Thẩm mỹ' },
]

export const CORE_SUBJECTS: Subject[] = [
  { code: 'MATH',       name: 'Toán',       isCore: true },
  { code: 'LITERATURE', name: 'Ngữ văn',    isCore: true },
  { code: 'ENGLISH',    name: 'Ngoại ngữ',  isCore: true },
  { code: 'HISTORY',    name: 'Lịch sử',    isCore: true },
]

export const ELECTIVE_SUBJECTS: Subject[] = [
  { code: 'PHYSICS',     name: 'Vật lý',           isCore: false },
  { code: 'CHEMISTRY',   name: 'Hóa học',          isCore: false },
  { code: 'BIOLOGY',     name: 'Sinh học',         isCore: false },
  { code: 'INFORMATICS', name: 'Tin học',          isCore: false },
  { code: 'TECHNOLOGY',  name: 'Công nghệ',        isCore: false },
  { code: 'GEOGRAPHY',   name: 'Địa lý',           isCore: false },
  { code: 'CIVICS',      name: 'KT & Pháp luật',   isCore: false },
  { code: 'MUSIC',       name: 'Âm nhạc',          isCore: false },
  { code: 'ARTS',        name: 'Mỹ thuật',         isCore: false },
]

export const ALL_SUBJECTS = [...CORE_SUBJECTS, ...ELECTIVE_SUBJECTS]

export const MAX_ELECTIVES = 4

// ─── Knowledge graph ──────────────────────────────────────────────────────────
// requiredSubjects: học sinh PHẢI chọn những môn này → ngành mở
// bonusSubjects: bonus signal — dùng cho scoring sau này

export const MAJORS: Major[] = [
  {
    id: 'cs',
    name: 'Khoa học máy tính / CNTT',
    description: 'Lập trình, phần mềm, hệ thống',
    requiredSubjects: ['INFORMATICS'],
    bonusSubjects: ['PHYSICS', 'MATH', 'TECHNOLOGY'],
  },
  {
    id: 'ai',
    name: 'AI / Khoa học dữ liệu',
    description: 'Machine learning, phân tích dữ liệu',
    requiredSubjects: ['INFORMATICS'],
    bonusSubjects: ['PHYSICS', 'MATH'],
  },
  {
    id: 'electrical',
    name: 'Kỹ thuật điện / Tự động hóa',
    description: 'Điện tử, robot, hệ thống nhúng',
    requiredSubjects: ['PHYSICS'],
    bonusSubjects: ['INFORMATICS', 'TECHNOLOGY', 'MATH'],
  },
  {
    id: 'architecture',
    name: 'Kiến trúc / Xây dựng',
    description: 'Thiết kế công trình, kết cấu',
    requiredSubjects: ['PHYSICS'],
    bonusSubjects: ['MATH', 'ARTS'],
  },
  {
    id: 'economics',
    name: 'Kinh tế / Quản trị kinh doanh',
    description: 'Tài chính, marketing, quản lý',
    requiredSubjects: ['CIVICS'],
    bonusSubjects: ['MATH', 'ENGLISH', 'GEOGRAPHY'],
  },
  {
    id: 'law',
    name: 'Luật',
    description: 'Pháp lý, tư vấn, hành chính',
    requiredSubjects: ['CIVICS'],
    bonusSubjects: ['HISTORY', 'LITERATURE', 'ENGLISH'],
  },
  {
    id: 'medicine',
    name: 'Y khoa',
    description: 'Bác sĩ đa khoa, chuyên khoa',
    requiredSubjects: ['BIOLOGY', 'CHEMISTRY'],
    bonusSubjects: ['PHYSICS', 'MATH'],
  },
  {
    id: 'pharmacy',
    name: 'Dược học',
    description: 'Dược sĩ, nghiên cứu thuốc',
    requiredSubjects: ['CHEMISTRY', 'BIOLOGY'],
    bonusSubjects: ['MATH'],
  },
  {
    id: 'biotech',
    name: 'Công nghệ sinh học',
    description: 'Di truyền, sinh học phân tử',
    requiredSubjects: ['BIOLOGY', 'CHEMISTRY'],
    bonusSubjects: ['INFORMATICS', 'MATH'],
  },
  {
    id: 'tourism',
    name: 'Du lịch / Địa lý học',
    description: 'Quản lý du lịch, quy hoạch vùng',
    requiredSubjects: ['GEOGRAPHY'],
    bonusSubjects: ['HISTORY', 'ENGLISH', 'CIVICS'],
  },
  {
    id: 'music',
    name: 'Âm nhạc / Nghệ thuật biểu diễn',
    description: 'Thanh nhạc, nhạc cụ, sáng tác',
    requiredSubjects: ['MUSIC'],
    bonusSubjects: ['ARTS'],
  },
  {
    id: 'design',
    name: 'Mỹ thuật / Thiết kế đồ họa',
    description: 'UX/UI, truyền thông thị giác',
    requiredSubjects: ['ARTS'],
    bonusSubjects: ['MUSIC', 'INFORMATICS'],
  },
  {
    id: 'agriculture',
    name: 'Nông nghiệp / Môi trường',
    description: 'Nông nghiệp công nghệ cao, bảo vệ môi trường',
    requiredSubjects: ['BIOLOGY'],
    bonusSubjects: ['CHEMISTRY', 'GEOGRAPHY'],
  },
  {
    id: 'food',
    name: 'Công nghệ thực phẩm',
    description: 'Chế biến, kiểm soát chất lượng thực phẩm',
    requiredSubjects: ['CHEMISTRY', 'BIOLOGY'],
    bonusSubjects: ['TECHNOLOGY', 'MATH'],
  },
]

// ─── Engine ───────────────────────────────────────────────────────────────────

export function computeRecommendation(
  competencyScores: Record<CompetencyCode, number>,
  selectedElectives: SubjectCode[],
): {
  openPaths: string[]
  restrictedPaths: string[]
  strengths: string[]
  insights: string[]
} {
  const electiveSet = new Set(selectedElectives)

  const openPaths: string[] = []
  const restrictedPaths: string[] = []
  const insights: string[] = []

  for (const major of MAJORS) {
    const hasAll = major.requiredSubjects.every(s => electiveSet.has(s))
    if (hasAll) {
      openPaths.push(major.name)
    } else {
      restrictedPaths.push(major.name)
      const missing = major.requiredSubjects.filter(s => !electiveSet.has(s))
      if (missing.length <= 2) {
        const names = missing
          .map(c => ELECTIVE_SUBJECTS.find(s => s.code === c)?.name ?? c)
          .join(', ')
        insights.push(`Để mở ngành **${major.name}**, cần chọn thêm môn: ${names}.`)
      }
    }
  }

  // Strengths from top competency scores
  const strengths = Object.entries(competencyScores)
    .filter(([, v]) => v >= 4)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => COMPETENCIES.find(c => c.code === k)?.name)
    .filter(Boolean) as string[]

  // Contextual insights
  const tech = competencyScores['TECHNICAL'] ?? 0
  const analytical = competencyScores['ANALYTICAL'] ?? 0
  const creative = (competencyScores['CREATIVE'] ?? 0) + (competencyScores['DESIGN'] ?? 0)

  if (tech >= 4 && analytical >= 4 && !electiveSet.has('INFORMATICS') && !electiveSet.has('PHYSICS')) {
    insights.push('Bạn có thiên hướng kỹ thuật & phân tích mạnh nhưng chưa chọn Vật lý hay Tin học — đây là hai môn cốt lõi của ngành kỹ thuật và CNTT.')
  } else if (tech >= 4 && !electiveSet.has('INFORMATICS')) {
    insights.push('Bạn thích công nghệ nhưng chưa chọn Tin học. Tin học là cánh cửa trực tiếp vào CNTT và AI.')
  }

  if (creative >= 7 && electiveSet.has('ARTS')) {
    insights.push('Kết hợp năng khiếu sáng tạo với Mỹ thuật là nền tảng vững cho Thiết kế đồ họa và UX/UI.')
  }

  if (insights.length === 0) {
    insights.push(
      openPaths.length >= 5
        ? 'Tổ hợp môn của bạn mở ra nhiều cơ hội. Đây là lợi thế tốt nếu bạn chưa chắc chắn hướng đi.'
        : 'Hãy kiểm tra kỹ tổ hợp môn xét tuyển của các trường đại học mục tiêu.',
    )
  }

  return {
    openPaths: openPaths.slice(0, 8),
    restrictedPaths: restrictedPaths.slice(0, 6),
    strengths,
    insights: insights.slice(0, 4),
  }
}
