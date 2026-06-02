import { z } from 'zod'

const CompetencyCodeSchema = z.enum([
  'ANALYTICAL', 'TECHNICAL', 'CREATIVE', 'SOCIAL', 'ENTREPRENEURIAL', 'DESIGN',
])

const SubjectCodeSchema = z.enum([
  'MATH', 'LITERATURE', 'ENGLISH', 'HISTORY',
  'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'INFORMATICS',
  'TECHNOLOGY', 'GEOGRAPHY', 'CIVICS', 'MUSIC', 'ARTS',
])

export const AssessmentSchema = z.object({
  profile: z.object({
    name:     z.string().max(100).optional(),
    email:    z.string().email('Email không hợp lệ'),
    phone:    z.string().max(20).optional(),
    grade:    z.enum(['10', '11', '12']),
    school:   z.string().max(200).optional(),
    province: z.string().max(100).optional(),
  }),
  competencyScores: z.record(CompetencyCodeSchema, z.number().int().min(1).max(5)),
  subjectScores:    z.record(SubjectCodeSchema, z.number().int().min(1).max(5)),
  selectedElectives: z
    .array(SubjectCodeSchema)
    .length(4, 'Phải chọn đúng 4 môn lựa chọn'),
})

export type AssessmentInput = z.infer<typeof AssessmentSchema>
