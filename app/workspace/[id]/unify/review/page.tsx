'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useUnifyStore } from '@/store/unifyStore'
import { Button, Input } from '@/components/common'
import StepIndicator from '@/components/layout/StepIndicator'
import TermGroupCard from '@/components/unify/TermGroupCard'
import StatsPanel from '@/components/unify/StatsPanel'

export default function UnifyReviewPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { termGroups } = useUnifyStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterSource, setFilterSource] = useState<'all' | 'db' | 'ai'>('all')

  const filteredGroups = termGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.variants.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterSource === 'all' || group.source === filterSource
    
    return matchesSearch && matchesFilter
  })

  const handleNext = () => {
    router.push(`/workspace/${workspaceId}/unify/confirm`)
  }

  const selectedCount = termGroups.filter(g => g.checked).length
  const totalOccurrences = termGroups.reduce((sum, g) => 
    g.checked ? sum + g.occurrences.filter(o => o.checked).length : sum, 0
  )

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/unify/analyze`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">용어 통일 모드</span>
          </div>
          
          <StepIndicator currentStep={3} totalSteps={5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left: Term Groups */}
          <div className="flex-1 space-y-6">
            {/* Title & Search */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">⚙️ 용어 그룹 검토</h1>
                <p className="text-gray-400 mt-1">
                  AI가 찾은 {termGroups.length}개 그룹을 확인하고 표준 용어를 선택하세요
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="🔍 용어 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 bg-surface-dark rounded-lg p-1">
                  <button
                    onClick={() => setFilterSource('all')}
                    className={`px-4 py-2 rounded text-sm transition-all ${
                      filterSource === 'all'
                        ? 'bg-primary text-background-dark font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setFilterSource('db')}
                    className={`px-4 py-2 rounded text-sm transition-all ${
                      filterSource === 'db'
                        ? 'bg-primary text-background-dark font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    💾 DB
                  </button>
                  <button
                    onClick={() => setFilterSource('ai')}
                    className={`px-4 py-2 rounded text-sm transition-all ${
                      filterSource === 'ai'
                        ? 'bg-primary text-background-dark font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🤖 AI
                  </button>
                </div>
              </div>
            </div>

            {/* Term Group Cards */}
            <div className="space-y-4">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <TermGroupCard key={group.id} group={group} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats Panel */}
          <div className="w-80">
            <div className="sticky top-6">
              <StatsPanel
                selectedCount={selectedCount}
                totalGroups={termGroups.length}
                totalOccurrences={totalOccurrences}
                onNext={handleNext}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

