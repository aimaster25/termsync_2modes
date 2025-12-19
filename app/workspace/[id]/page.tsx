'use client'

import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { Card, Button, Badge } from '@/components/common'
import { useEffect } from 'react'

export default function ModeSelectionPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  const { currentWorkspace, selectWorkspace } = useWorkspaceStore()

  useEffect(() => {
    selectWorkspace(workspaceId)
  }, [workspaceId, selectWorkspace])

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/workspace')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <span className="font-medium">
              {currentWorkspace?.name || '매뉴얼'}
            </span>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 1
                    ? 'bg-primary text-background-dark font-semibold'
                    : 'bg-surface-dark text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">📋 용어 통일 모드 선택</h1>
            <p className="text-gray-400">어떤 방식으로 통일할까요?</p>
          </div>

          {/* Mode Cards */}
          <div className="space-y-6">
            {/* 용어 통일 모드 */}
            <Card 
              variant="bordered" 
              className="hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => router.push(`/workspace/${workspaceId}/unify/upload`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📖</span>
                    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      용어 통일 모드
                    </h2>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  여러 문서를 비교해 GPT-4가 자동으로<br />
                  같은 개념의 다른 용어를 찾아드립니다
                </p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>처음 사용할 때</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>여러 문서의 용어를 한번에 정리</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>DB에 용어가 없거나 새로운 프로젝트</span>
                  </div>
                </div>

                <Button className="w-full" variant="primary">
                  선택 →
                </Button>
              </div>
            </Card>

            {/* 자동 문서/용어 생성 모드 */}
            <Card 
              variant="bordered" 
              className="hover:border-primary/50 transition-all cursor-pointer group relative"
              onClick={() => router.push(`/workspace/${workspaceId}/generate`)}
            >
              <Badge 
                variant="primary" 
                className="absolute top-4 right-4"
              >
                ⭐ 추천
              </Badge>

              <div className="space-y-4">
                <div className="flex items-start justify-between pr-20">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🤖</span>
                    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      자동 문서/용어 생성 모드
                    </h2>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  DB에 저장된 문서와 용어로 새 콘텐츠 생성<br />
                  UI 캡처 → 가이드 자동 작성 or 용어 추천
                </p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>DB에 충분한 용어가 쌓였을 때</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>UI 가이드를 빠르게 작성하고 싶을 때</span>
                  </div>
                </div>

                {/* DB Status */}
                {currentWorkspace && currentWorkspace.termCount > 0 && (
                  <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-primary">📊 DB 활용 가능:</p>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>• 문서 {currentWorkspace.documentCount}개 학습 완료</div>
                      <div>• 용어 {currentWorkspace.termCount}개 즉시 활용</div>
                      <div>• 문서 스타일 자동 적용</div>
                    </div>
                  </div>
                )}

                <Button className="w-full" variant="primary">
                  선택 →
                </Button>
              </div>
            </Card>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/workspace')}
            >
              ← 뒤로
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

