import type { CRMRecord } from '@/types'

/**
 * Push a CRM record to an external webhook (Make, Zapier, Brevo, HubSpot…).
 * Set CRM_WEBHOOK_URL in .env.local to activate.
 * If the env var is absent the function is a no-op.
 */
export async function pushToCRM(record: CRMRecord): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
  } catch (err) {
    // Non-fatal — log but don't fail the assessment submission
    console.error('[CRM] webhook error:', err)
  }
}

/** Build the flat CRM record from assessment data */
export function buildCRMRecord(params: {
  email: string
  name?: string
  phone?: string
  grade: string
  school?: string
  province?: string
  selectedElectives: string[]
  subjectNames: string[]
  strengths: string[]
  openPaths: string[]
  restrictedPaths: string[]
}): CRMRecord {
  const tags = [
    ...params.openPaths.slice(0, 3).map(p => `open:${p}`),
    ...params.restrictedPaths.slice(0, 2).map(p => `narrow:${p}`),
  ].join(', ')

  return {
    email:        params.email,
    name:         params.name ?? '',
    phone:        params.phone ?? '',
    grade:        `Lớp ${params.grade}`,
    school:       params.school ?? '',
    province:     params.province ?? '',
    subjects:     params.subjectNames.join(', '),
    strengths:    params.strengths.join(', '),
    open_paths:   params.openPaths.slice(0, 5).join(', '),
    narrow_paths: params.restrictedPaths.slice(0, 4).join(', '),
    tags,
    source:       'PathFinder MVP',
    created_at:   new Date().toISOString().split('T')[0],
  }
}
