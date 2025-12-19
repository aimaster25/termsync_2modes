'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useGenerateStore } from '@/store/generateStore'
import { Input, Button, Card, Badge, Spinner } from '@/components/common'

export default function TermsTab() {
  const {
    searchQuery,
    termRecommendations,
    selectedTerms,
    setSearchQuery,
    searchTerms,
    toggleTerm,
  } = useGenerateStore()

  const [hasSearched, setHasSearched] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  })

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchTerms(searchQuery)
      setHasSearched(true)
    }
  }

  const handleImageAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock terms based on image
    await searchTerms('UI 관련 용어')
    setHasSearched(true)
    setIsAnalyzing(false)
  }

  const handleExport = () => {
    const selected = termRecommendations.filter(t => selectedTerms.has(t.id))
    const text = selected
      .map(t => `${t.term}: ${t.definition}`)
      .join('\n\n')
    
    navigator.clipboard.writeText(text)
    alert('선택한 용어가 복사되었습니다!')
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-primary/10 rounded-lg space-y-2">
        <p className="text-sm font-medium text-primary">
          💡 어떻게 작동하나요?
        </p>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>1. UI 스크린샷을 업로드하거나 키워드를 입력하세요</li>
          <li>2. AI가 이미지를 분석하거나 DB에서 연관 용어를 찾습니다</li>
          <li>3. 정의와 출처를 확인하고 내보내기 하세요</li>
        </ul>
      </div>

      {/* Image Upload Option */}
      {!imageUrl && !hasSearched && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8
            cursor-pointer transition-all
            ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-700 hover:border-primary/50 hover:bg-surface-dark'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3 text-center">
            {isDragActive ? (
              <>
                <div className="text-5xl">📥</div>
                <p className="text-lg font-medium text-primary">
                  이미지를 여기에 놓으세요
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl">🖼️</div>
                <div className="space-y-1">
                  <p className="text-lg font-medium">
                    UI 스크린샷 업로드
                  </p>
                  <p className="text-sm text-gray-400">
                    이미지에서 관련 용어를 자동 추천
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && !hasSearched && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Uploaded UI"
              className="w-full rounded-lg border border-gray-700"
            />
            <button
              onClick={() => {
                setUploadedImage(null)
                setImageUrl(null)
              }}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleImageAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '분석 중...' : '🤖 관련 용어 추천받기'}
          </Button>
        </div>
      )}

      {/* Or Divider */}
      {!imageUrl && !hasSearched && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background-dark text-gray-500">또는</span>
          </div>
        </div>
      )}

      {/* Keyword Search */}
      {!imageUrl && !hasSearched && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="예: 셔터, 노출, 화이트밸런스..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
          </div>
          <Button onClick={handleSearch}>
            🔍 검색
          </Button>
        </div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-400">🔍 이미지를 분석하고 있습니다...</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isAnalyzing && (
        <>
          {termRecommendations.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  📖 추천 용어 ({termRecommendations.length}개)
                </h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setHasSearched(false)
                      setImageUrl(null)
                      setUploadedImage(null)
                      setSearchQuery('')
                    }}
                  >
                    새로 검색
                  </Button>
                  {selectedTerms.size > 0 && (
                    <Button variant="secondary" size="sm" onClick={handleExport}>
                      📋 선택 항목 내보내기 ({selectedTerms.size})
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {termRecommendations.map((term) => (
                  <Card
                    key={term.id}
                    variant="bordered"
                    className={`cursor-pointer transition-all ${
                      selectedTerms.has(term.id)
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:border-gray-600'
                    }`}
                    onClick={() => toggleTerm(term.id)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedTerms.has(term.id)}
                        onChange={() => toggleTerm(term.id)}
                        className="mt-1 w-5 h-5 text-primary bg-surface-dark border-gray-600 rounded focus:ring-2 focus:ring-primary/50"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold">
                              {term.term}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {term.definition}
                            </p>
                          </div>
                          <Badge
                            variant={
                              term.confidence === 100
                                ? 'primary'
                                : term.confidence >= 90
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {term.confidence}%
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>🏷️ {term.category}</span>
                          <span>•</span>
                          <span>📄 {term.source}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🔍</div>
              <div className="space-y-2">
                <p className="text-xl text-gray-300">
                  검색 결과가 없습니다
                </p>
                <p className="text-sm text-gray-500">
                  다른 키워드나 이미지로 시도해보세요
                </p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => {
                  setHasSearched(false)
                  setImageUrl(null)
                  setUploadedImage(null)
                  setSearchQuery('')
                }}
              >
                다시 시도
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

