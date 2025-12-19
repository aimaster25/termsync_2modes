'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useUnifyStore, TermGroup } from '@/store/unifyStore'
import { Card, ProgressBar, Spinner } from '@/components/common'
import StepIndicator from '@/components/layout/StepIndicator'

export default function UnifyAnalyzePage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { 
    files, 
    dbEnabled,
    analysisProgress,
    logs,
    setAnalysisProgress,
    addLog,
    setTermGroups,
    setAnalysisStatus
  } = useUnifyStore()

  const [currentPhase, setCurrentPhase] = useState('파일 업로드 중...')

  useEffect(() => {
    if (files.length === 0) {
      router.push(`/workspace/${workspaceId}/unify/upload`)
      return
    }

    simulateAnalysis()
  }, [])

  const simulateAnalysis = async () => {
    setAnalysisStatus('analyzing')

    // Phase 1: 파일 업로드
    setCurrentPhase('📤 파일 업로드 중...')
    for (const file of files) {
      await delay(300)
      addLog(`✓ ${file.name} 업로드 완료`)
      setAnalysisProgress(prev => Math.min(prev + 10, 15))
    }

    await delay(500)
    setAnalysisProgress(20)

    // Phase 2: DB 매칭
    if (dbEnabled) {
      setCurrentPhase('💾 기존 용어 DB 매칭 중...')
      await delay(800)
      addLog('✓ DB에서 기존 용어 127개 발견')
      await delay(500)
      addLog('✓ 자동 매칭 완료 (신뢰도 100%)')
      setAnalysisProgress(40)
    }

    await delay(500)

    // Phase 3: AI 분석
    setCurrentPhase('🤖 GPT-4가 문서를 분석 중...')
    await delay(1000)
    addLog('✓ 문서 텍스트 추출 완료')
    setAnalysisProgress(50)
    
    await delay(1000)
    addLog('✓ 용어 후보 추출 중...')
    setAnalysisProgress(60)
    
    await delay(1200)
    addLog('✓ 문맥 기반 그룹화 진행...')
    setAnalysisProgress(75)
    
    await delay(1000)
    addLog('✓ 유사 용어 클러스터링...')
    setAnalysisProgress(85)

    await delay(800)
    setCurrentPhase('📊 결과 정리 중...')
    addLog('✓ 신뢰도 계산 완료')
    setAnalysisProgress(95)

    await delay(500)
    addLog('✓ 용어 그룹 17개 발견')
    setAnalysisProgress(100)

    // 목업 데이터 생성
    const mockGroups: TermGroup[] = generateMockGroups()
    setTermGroups(mockGroups)

    await delay(1000)
    setAnalysisStatus('complete')

    // 다음 페이지로 이동
    router.push(`/workspace/${workspaceId}/unify/review`)
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">용어 통일 모드</span>
          </div>
          
          <StepIndicator currentStep={2} totalSteps={5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <Spinner size="lg" />
            <h1 className="text-4xl font-bold mt-6">🤖 AI가 분석 중...</h1>
            <p className="text-gray-400">{currentPhase}</p>
          </div>

          {/* Progress */}
          <Card>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">진행률</span>
                  <span className="font-semibold">{analysisProgress}%</span>
                </div>
                <ProgressBar value={analysisProgress} showLabel={false} />
              </div>

              {/* Files Info */}
              <div className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">분석 중인 파일</p>
                  <p className="font-medium">{files.length}개 문서</p>
                </div>
                {dbEnabled && (
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-400">DB 활용</p>
                    <p className="font-medium text-primary">✓ ON</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Logs */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 분석 로그</h3>
              <div className="h-64 overflow-y-auto space-y-2 p-4 bg-surface-dark/50 rounded-lg font-mono text-sm">
                {logs.map((log, i) => (
                  <div key={i} className="text-gray-300">
                    {log}
                  </div>
                ))}
                {analysisProgress < 100 && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="animate-pulse">●</span>
                    <span>처리 중...</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Tip */}
          <div className="text-center text-sm text-gray-500">
            💡 Tip: 일반적으로 1-2분 소요됩니다
          </div>
        </div>
      </main>
    </div>
  )
}

// Mock data generator
function generateMockGroups(): TermGroup[] {
  return [
    {
      id: '1',
      name: '셔터 vs 셔터 버튼',
      checked: true,
      source: 'db',
      totalCount: 38,
      variants: ['셔터', '셔터 버튼', '촬영 버튼'],
      standard: '셔터 버튼',
      confidence: 100,
      occurrences: [
        {
          id: '1-1',
          before: '셔터',
          after: '셔터 버튼',
          sentence: '셔터를 반쯤 누르면 초점이 맞춰집니다',
          context: '기본 촬영 설명 중',
          line: 42,
          checked: true,
        },
        {
          id: '1-2',
          before: '촬영 버튼',
          after: '셔터 버튼',
          sentence: '촬영 버튼을 완전히 눌러 사진을 찍습니다',
          context: '촬영 방법 가이드',
          line: 58,
          checked: true,
        },
      ],
    },
    {
      id: '2',
      name: '노출 vs 노출값',
      checked: true,
      source: 'ai',
      totalCount: 24,
      variants: ['노출', '노출값', 'EV'],
      standard: '노출',
      confidence: 92,
      occurrences: [
        {
          id: '2-1',
          before: '노출값',
          after: '노출',
          sentence: '노출값을 조정하여 밝기를 변경할 수 있습니다',
          context: '수동 모드 설정',
          line: 103,
          checked: true,
        },
      ],
    },
  ]
}

