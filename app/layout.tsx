import type { Metadata } from 'next'
import { Noto_Sans_Hebrew } from 'next/font/google'
import './globals.css'

const notoHebrew = Noto_Sans_Hebrew({
  variable: '--font-noto-hebrew',
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'זמני אדם',
  description: 'זמני התפילות והשיעורים ביישוב אדם',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={notoHebrew.variable}>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
