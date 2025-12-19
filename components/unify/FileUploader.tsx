'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUnifyStore } from '@/store/unifyStore'

export default function FileUploader() {
  const { addFiles } = useUnifyStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles)
    },
    [addFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 10,
  })

  return (
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
              파일을 여기에 놓으세요
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl">📂</div>
            <div className="space-y-2">
              <p className="text-xl font-medium">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-400">
                DOCX, PDF 파일 지원 (최대 10개)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

