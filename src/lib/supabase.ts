import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Use in Client Components */
export function createClient() {
  return createBrowserClient(url, anon)
}

/** Use in Server Components / Route Handlers */
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get:    (name) => cookieStore.get(name)?.value,
      set:    () => {},   // read-only in server components
      remove: () => {},
    },
  })
}

/** Use in API routes that need elevated permissions */
export function createAdminClient() {
  const { createClient: createSC } = require('@supabase/supabase-js')
  return createSC(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}
