'use client'

import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useGenerateStore } from '@/store/generateStore'
import { Card } from '@/components/common'
import GuideTab from '@/components/generate/GuideTab'
import TermsTab from '@/components/generate/TermsTab'
import Chatbot from '@/components/generate/Chatbot'

export default function GeneratePage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { currentTab, setCurrentTab } = useGenerateStore()

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/workspace/${workspaceId}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">자동 생성 모드</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>💾 문서 {currentWorkspace?.documentCount || 0}개</span>
            <span>•</span>
            <span>📖 용어 {currentWorkspace?.termCount || 0}개</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left: Main Content */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">🤖 자동 문서/용어 생성</h1>
              <p className="text-gray-400 mt-1">
                DB에 저장된 문서와 용어를 활용하여 새로운 콘텐츠를 생성합니다
              </p>
            </div>

            {/* Tabs */}
            <Card>
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setCurrentTab('guide')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                    currentTab === 'guide'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📝 UI 가이드 작성
                </button>
                <button
                  onClick={() => setCurrentTab('terms')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                    currentTab === 'terms'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📖 용어 추천
                </button>
              </div>

              <div className="p-6">
                {currentTab === 'guide' ? <GuideTab /> : <TermsTab />}
              </div>
            </Card>
          </div>

          {/* Right: Chatbot */}
          <div className="w-96">
            <div className="sticky top-6">
              <Chatbot />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

