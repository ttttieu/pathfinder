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
  const cookieStore = cookies() // Đối tượng này là một Promise trong Next.js 15/16

  return createServerClient(url, anon, {
    cookies: {
      // 1. Biến hàm get thành async và await cookieStore
      async get(name) {
        const store = await cookieStore
        return store.get(name)?.value
      },
      // 2. Cập nhật async/await cho set để đồng bộ cấu hình mới
      async set(name, value, options) {
        try {
          const store = await cookieStore
          store.set(name, value, options)
        } catch {
          // Hạn chế crash khi gọi ở môi trường Server Component chỉ đọc
        }
      },
      // 3. Cập nhật async/await cho remove
      async remove(name, options) {
        try {
          const store = await cookieStore
          store.set(name, '', { ...options, maxAge: 0 })
        } catch {
          // Hạn chế crash khi gọi ở môi trường Server Component chỉ đọc
        }
      },
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