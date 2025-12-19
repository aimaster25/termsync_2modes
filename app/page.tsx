import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 selection:bg-primary selection:text-background-dark">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="size-12 flex items-center justify-center text-primary text-4xl">
            🔄
          </div>
          <h1 className="text-4xl font-bold">TermSync</h1>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h2 className="text-5xl font-bold leading-tight">
            기술 문서의 용어 통일을
            <br />
            <span className="text-primary">AI가 자동으로</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            여러 문서에 흩어진 용어들을 AI가 자동으로 분석하고,
            <br />
            표준 용어로 일관되게 통일해 드립니다
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background-dark font-semibold text-lg rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            시작하기 →
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-surface-dark">
          <div className="space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="text-xl font-semibold">빠른 분석</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>GPT-4 기반 AI</p>
              <p>자동 그룹화</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-4xl">📄</div>
            <h3 className="text-xl font-semibold">다양한 형식</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>DOCX, PDF 지원</p>
              <p>최대 10개 문서</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-4xl">🔒</div>
            <h3 className="text-xl font-semibold">정확한 통일</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>문맥 이해 매칭</p>
              <p>신뢰도 표시</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

