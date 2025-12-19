'use client'

import { useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { Modal, Input, Button, Spinner } from '@/components/common'

interface WorkspaceCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorkspaceCreateModal({ 
  isOpen, 
  onClose 
}: WorkspaceCreateModalProps) {
  const { addWorkspace } = useWorkspaceStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Add workspace
    addWorkspace({
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      termCount: 0,
      documentCount: 0,
      lastUpdated: new Date(),
    })
    
    setIsLoading(false)
    setFormData({ name: '', description: '' })
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', description: '' })
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="새 워크스페이스"
      size="md"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-400">워크스페이스를 생성하고 있습니다...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="이름"
            placeholder="카메라 매뉴얼"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setErrors({ ...errors, name: '' })
            }}
            error={errors.name}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              설명 (선택)
            </label>
            <textarea
              className="w-full px-4 py-3 bg-surface-dark border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="제품 매뉴얼 용어 통일 프로젝트"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
            <span className="text-primary">💡</span>
            <p className="text-sm text-gray-300">
              이름으로 나중에 찾을 수 있어요
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              만들기
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

