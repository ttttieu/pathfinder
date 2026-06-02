// ─── Domain types ────────────────────────────────────────────────────────────

export type CompetencyCode =
  | 'ANALYTICAL'
  | 'TECHNICAL'
  | 'CREATIVE'
  | 'SOCIAL'
  | 'ENTREPRENEURIAL'
  | 'DESIGN'

export type SubjectCode =
  | 'MATH' | 'LITERATURE' | 'ENGLISH' | 'HISTORY'   // core (always taken)
  | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'INFORMATICS'
  | 'TECHNOLOGY' | 'GEOGRAPHY' | 'CIVICS' | 'MUSIC' | 'ARTS'

export interface Competency {
  code: CompetencyCode
  name: string
}

export interface Subject {
  code: SubjectCode
  name: string
  isCore: boolean
}

export interface Major {
  id: string
  name: string
  description?: string
  requiredSubjects: SubjectCode[]
  bonusSubjects: SubjectCode[]
}

// ─── Assessment flow ──────────────────────────────────────────────────────────

export interface StudentProfile {
  name?: string
  email: string
  phone?: string
  grade: '10' | '11' | '12'
  school?: string
  province?: string
}

export interface AssessmentPayload {
  profile: StudentProfile
  competencyScores: Record<CompetencyCode, number>   // 1–5
  subjectScores: Record<SubjectCode, number>         // 1–5
  selectedElectives: SubjectCode[]                   // exactly 4
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface RecommendationResult {
  studentId: string
  strengths: string[]
  recommendedSubjects: SubjectCode[]
  openPaths: string[]
  restrictedPaths: string[]
  insights: string[]
}

export interface CRMRecord {
  email: string
  name: string
  phone: string
  grade: string
  school: string
  province: string
  subjects: string
  strengths: string
  open_paths: string
  narrow_paths: string
  tags: string
  source: string
  created_at: string
}

// ─── Database (Supabase) ──────────────────────────────────────────────────────

export interface DbStudent {
  id: string
  created_at: string
  email: string
  name: string | null
  phone: string | null
  grade: string
  school: string | null
  province: string | null
}

export interface DbAssessment {
  id: string
  student_id: string
  created_at: string
  competency_scores: Record<string, number>
  subject_scores: Record<string, number>
  selected_electives: string[]
  open_paths: string[]
  restricted_paths: string[]
  strengths: string[]
  insights: string[]
}
