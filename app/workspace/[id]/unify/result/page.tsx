'use client'

import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useUnifyStore } from '@/store/unifyStore'
import { Button, Card, Badge } from '@/components/common'
import StepIndicator from '@/components/layout/StepIndicator'

export default function UnifyResultPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { termGroups, reset } = useUnifyStore()

  const selectedGroups = termGroups.filter(g => g.checked)
  const totalChanges = selectedGroups.reduce(
    (sum, g) => sum + g.occurrences.filter(o => o.checked).length,
    0
  )

  const handleNewTask = () => {
    reset()
    router.push(`/workspace/${workspaceId}`)
  }

  const handleDownload = () => {
    // Simulate download
    alert('파일 다운로드 시작! (실제로는 Sionic API 호출)')
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">용어 통일 모드</span>
          </div>
          
          <StepIndicator currentStep={5} totalSteps={5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Success Icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-8xl">🎉</div>
            <h1 className="text-4xl font-bold">완료!</h1>
            <p className="text-xl text-gray-400">
              용어 통일이 성공적으로 완료되었습니다
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <div className="text-center space-y-2">
                <div className="text-3xl">📊</div>
                <p className="text-sm text-gray-400">처리한 그룹</p>
                <p className="text-3xl font-bold text-primary">
                  {selectedGroups.length}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center space-y-2">
                <div className="text-3xl">✏️</div>
                <p className="text-sm text-gray-400">변경 건수</p>
                <p className="text-3xl font-bold text-green-400">
                  {totalChanges}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center space-y-2">
                <div className="text-3xl">💾</div>
                <p className="text-sm text-gray-400">DB 저장</p>
                <p className="text-3xl font-bold text-blue-400">
                  ✓
                </p>
              </div>
            </Card>
          </div>

          {/* Download */}
          <Card>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">📦 파일 다운로드</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium">통일된 문서 (ZIP)</p>
                      <p className="text-sm text-gray-400">
                        {selectedGroups.length}개 그룹 적용 완료
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleDownload}>
                    다운로드 ⬇️
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-medium">변경 이력 (CSV)</p>
                      <p className="text-sm text-gray-400">
                        {totalChanges}건의 변경 내역
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary">
                    다운로드 ⬇️
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">📝 처리 요약</h3>
              <div className="space-y-3">
                {selectedGroups.slice(0, 5).map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={group.source === 'db' ? 'primary' : 'success'}>
                        {group.source === 'db' ? '💾 DB' : '🤖 AI'}
                      </Badge>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-400">
                          → {group.standard}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.occurrences.filter(o => o.checked).length}건
                    </span>
                  </div>
                ))}
                {selectedGroups.length > 5 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    외 {selectedGroups.length - 5}개 그룹...
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Info */}
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-2">
            <p className="text-sm font-medium text-primary">
              ✓ 용어 DB에 저장 완료
            </p>
            <p className="text-sm text-gray-400">
              다음 작업부터는 이 용어들이 자동으로 매칭됩니다
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={handleNewTask}
            >
              새 작업 시작
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/workspace')}
            >
              워크스페이스로
            </Button>
          </div>

          {/* Tip */}
          <div className="text-center text-sm text-gray-500">
            💡 Tip: 자동 생성 모드에서 이 용어들을 활용할 수 있습니다
          </div>
        </div>
      </main>
    </div>
  )
}

