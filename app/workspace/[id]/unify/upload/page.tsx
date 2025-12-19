'use client'

import { useRouter, useParams } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useUnifyStore } from '@/store/unifyStore'
import { Button, Card, Badge } from '@/components/common'
import FileUploader from '@/components/unify/FileUploader'
import StepIndicator from '@/components/layout/StepIndicator'

export default function UnifyUploadPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  
  const { currentWorkspace } = useWorkspaceStore()
  const { 
    files, 
    dbEnabled, 
    toggleDB, 
    removeFile 
  } = useUnifyStore()

  const handleNext = () => {
    if (files.length > 0) {
      router.push(`/workspace/${workspaceId}/unify/analyze`)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/workspace/${workspaceId}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <span className="font-medium">{currentWorkspace?.name || '매뉴얼'}</span>
            <span className="text-gray-500">용어 통일 모드</span>
          </div>
          
          <StepIndicator currentStep={1} totalSteps={5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">📁 문서 업로드</h1>
            <p className="text-gray-400">용어를 통일할 문서를 업로드하세요</p>
          </div>

          {/* File Uploader */}
          <FileUploader />

          {/* DB Settings */}
          {files.length > 0 && (
            <>
              <div className="border-t border-surface-dark my-8" />
              
              <Card>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    ⚙️ DB 용어 활용 설정
                  </h3>

                  <div className="space-y-4">
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                      <div>
                        <p className="font-medium">💾 기존 용어 DB 활용하기</p>
                        <p className="text-sm text-gray-400 mt-1">
                          📊 현재 저장된 용어: {currentWorkspace?.termCount || 0}개
                          {currentWorkspace?.termCount === 0 && ' (새 워크스페이스)'}
                        </p>
                      </div>
                      <button
                        onClick={toggleDB}
                        className={`relative w-16 h-8 rounded-full transition-colors ${
                          dbEnabled ? 'bg-primary' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            dbEnabled ? 'translate-x-8' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    {currentWorkspace?.termCount === 0 ? (
                      <div className="p-4 bg-blue-500/10 rounded-lg space-y-2">
                        <p className="text-sm text-blue-400">💡 첫 작업이므로 DB가 비어있습니다</p>
                        <p className="text-sm text-gray-400">
                          작업 완료 후 용어를 저장하면 다음부터 활용 가능
                        </p>
                      </div>
                    ) : (
                      dbEnabled && (
                        <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                          <p className="text-sm text-primary font-medium">✓ ON으로 설정하면:</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li>• DB에 있는 용어는 자동으로 매칭 (신뢰도 100%)</li>
                            <li>• 새로운 용어만 AI가 분석</li>
                            <li>• 분석 시간 단축 (예상: 30초 → 5초)</li>
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Card>

              <div className="border-t border-surface-dark my-8" />

              {/* Uploaded Files */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">업로드된 파일 ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <Card key={file.id} variant="bordered">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="text-center text-sm text-gray-500">
                💡 Tip: {files.length}개 문서를 AI가 비교 분석합니다
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/workspace/${workspaceId}`)}
            >
              ← 이전
            </Button>
            <Button
              disabled={files.length === 0}
              onClick={handleNext}
            >
              분석 시작 →
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

