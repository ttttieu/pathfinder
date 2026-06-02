import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PathFinder — Khám phá tác động của lựa chọn môn học',
  description:
    'Giúp học sinh THPT hiểu tác động của việc chọn môn học đối với cơ hội ngành nghề tương lai.',
  openGraph: {
    title: 'PathFinder',
    description: 'Khám phá tác động của lựa chọn môn học',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  )
}
