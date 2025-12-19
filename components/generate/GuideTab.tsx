'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useGenerateStore } from '@/store/generateStore'
import { Button, Spinner } from '@/components/common'

export default function GuideTab() {
  const {
    guideImage,
    guideImageUrl,
    guideText,
    guideStatus,
    setGuideImage,
    setGuideImageUrl,
    generateGuide,
  } = useGenerateStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setGuideImage(file)
        setGuideImageUrl(URL.createObjectURL(file))
      }
    },
    [setGuideImage, setGuideImageUrl]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  })

  const handleGenerate = async () => {
    await generateGuide()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(guideText)
    alert('복사되었습니다!')
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-primary/10 rounded-lg space-y-2">
        <p className="text-sm font-medium text-primary">
          💡 어떻게 작동하나요?
        </p>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>1. UI 스크린샷을 업로드하세요</li>
          <li>2. AI가 이미지를 분석하고 DB의 용어를 활용합니다</li>
          <li>3. 문서 스타일에 맞는 가이드가 자동 생성됩니다</li>
        </ul>
      </div>

      {/* Image Upload */}
      {!guideImageUrl ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-12
            cursor-pointer transition-all
            ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-700 hover:border-primary/50 hover:bg-surface-dark'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4 text-center">
            {isDragActive ? (
              <>
                <div className="text-6xl">📥</div>
                <p className="text-xl font-medium text-primary">
                  이미지를 여기에 놓으세요
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl">🖼️</div>
                <div className="space-y-2">
                  <p className="text-xl font-medium">
                    UI 스크린샷 업로드
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, WEBP 지원
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative">
            <img
              src={guideImageUrl}
              alt="UI Preview"
              className="w-full rounded-lg border border-gray-700"
            />
            <button
              onClick={() => {
                setGuideImage(null)
                setGuideImageUrl(null)
              }}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Generate Button */}
          {guideStatus === 'idle' && (
            <Button className="w-full" size="lg" onClick={handleGenerate}>
              🤖 가이드 자동 생성
            </Button>
          )}
        </div>
      )}

      {/* Processing */}
      {(guideStatus === 'analyzing' || guideStatus === 'generating') && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-400">
            {guideStatus === 'analyzing'
              ? '🔍 이미지를 분석하고 있습니다...'
              : '✍️ 가이드를 생성하고 있습니다...'}
          </p>
        </div>
      )}

      {/* Result */}
      {guideStatus === 'complete' && guideText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">✅ 생성된 가이드</h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                📋 복사
              </Button>
              <Button variant="secondary" size="sm">
                💾 저장
              </Button>
            </div>
          </div>

          <div className="p-6 bg-surface-dark rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
              {guideText}
            </pre>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              setGuideImage(null)
              setGuideImageUrl(null)
            }}
          >
            새로 생성하기
          </Button>
        </div>
      )}
    </div>
  )
}

