'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useUnifyStore } from '@/store/unifyStore'
import { Button, Card, Checkbox, Spinner } from '@/components/common'
import StepIndicator from '@/components/layout/StepIndicator'

export default function UnifyConfirmPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { termGroups } = useUnifyStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [saveToDb, setSaveToDb] = useState(true)
  const [createBackup, setCreateBackup] = useState(true)

  const selectedGroups = termGroups.filter(g => g.checked)
  const totalChanges = selectedGroups.reduce(
    (sum, g) => sum + g.occurrences.filter(o => o.checked).length,
    0
  )

  const handleConfirm = async () => {
    setIsProcessing(true)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Navigate to result page
    router.push(`/workspace/${workspaceId}/unify/result`)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/unify/review`)}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isProcessing}
            >
              ←
            </button>
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">용어 통일 모드</span>
          </div>
          
          <StepIndicator currentStep={4} totalSteps={5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-24">
            <Spinner size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">📝 문서 변환 중...</h2>
              <p className="text-gray-400">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">✅ 최종 확인</h1>
              <p className="text-gray-400">아래 내용으로 적용됩니다</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <div className="space-y-3">
                  <div className="text-3xl">📊</div>
                  <div>
                    <p className="text-sm text-gray-400">적용할 그룹</p>
                    <p className="text-3xl font-bold text-primary">
                      {selectedGroups.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="space-y-3">
                  <div className="text-3xl">✏️</div>
                  <div>
                    <p className="text-sm text-gray-400">총 변경 건수</p>
                    <p className="text-3xl font-bold text-green-400">
                      {totalChanges}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Options */}
            <Card>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">⚙️ 추가 옵션</h3>

                <div className="space-y-4">
                  {/* Save to DB */}
                  <div className="flex items-start gap-3 p-4 bg-surface-dark/50 rounded-lg">
                    <Checkbox
                      checked={saveToDb}
                      onChange={() => setSaveToDb(!saveToDb)}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">💾 용어 DB에 저장하기</p>
                      <p className="text-sm text-gray-400">
                        다음 작업 시 자동 매칭에 활용됩니다 (권장)
                      </p>
                    </div>
                  </div>

                  {/* Save Unified Documents */}
                  <div className="flex items-start gap-3 p-4 bg-surface-dark/50 rounded-lg">
                    <Checkbox
                      checked={createBackup}
                      onChange={() => setCreateBackup(!createBackup)}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">📦 통일된 문서를 DB에 저장</p>
                      <p className="text-sm text-gray-400">
                        일관성 있게 생성한 문서를 DB에 저장합니다 (권장)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">📝 변환 미리보기</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedGroups.slice(0, 5).map((group) => (
                    <div
                      key={group.id}
                      className="p-4 bg-surface-dark/50 rounded-lg space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-xs text-gray-500">
                          ({group.occurrences.filter(o => o.checked).length}건)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {group.variants
                          .filter(v => v !== group.standard)
                          .map((v, i) => (
                            <span key={i}>
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                                {v}
                              </span>
                              {i < group.variants.filter(v => v !== group.standard).length - 1 && ', '}
                            </span>
                          ))}
                        <span className="text-gray-600">→</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {group.standard}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedGroups.length > 5 && (
                    <p className="text-center text-sm text-gray-500">
                      외 {selectedGroups.length - 5}개 그룹...
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Warning */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg space-y-2">
              <p className="text-sm font-medium text-yellow-400">
                ⚠️ 주의사항
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 실행 후에는 되돌릴 수 없습니다</li>
                <li>• 통일된 문서를 DB에 저장하는 것을 권장합니다</li>
                <li>• 변환된 파일은 ZIP으로 다운로드됩니다</li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/workspace/${workspaceId}/unify/review`)}
              >
                ← 이전
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                disabled={selectedGroups.length === 0}
              >
                확인 및 실행 →
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

