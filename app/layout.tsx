import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TermSync - AI 기반 용어 통일 서비스',
  description: '여러 문서에 흩어진 용어들을 AI가 자동으로 분석하고, 표준 용어로 일관되게 통일해 드립니다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}

