'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import WorkspaceCard from '@/components/workspace/WorkspaceCard'
import WorkspaceCreateModal from '@/components/workspace/WorkspaceCreateModal'
import { Button, Input } from '@/components/common'

export default function WorkspacePage() {
  const router = useRouter()
  const { workspaces, selectWorkspace } = useWorkspaceStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectWorkspace = (id: string) => {
    selectWorkspace(id)
    router.push(`/workspace/${id}`)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-surface-dark px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← TermSync
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">기능</span>
            <span className="text-sm text-gray-400">자료실</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">워크스페이스 선택</h1>
            <p className="text-gray-400">프로젝트를 분리하여 관리하세요</p>
          </div>

          {/* Search & Create */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="🔍 워크스페이스 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              + 새 워크스페이스
            </Button>
          </div>

          {/* Workspace List */}
          <div className="min-h-[400px]">
            {filteredWorkspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    onSelect={() => handleSelectWorkspace(workspace.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
                <div className="text-6xl">📁</div>
                <div className="text-center space-y-2">
                  <p className="text-xl text-gray-300">워크스페이스가 없습니다</p>
                  <p className="text-gray-500">프로젝트별로 용어를 관리해보세요</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  + 워크스페이스 만들기
                </Button>
              </div>
            )}
          </div>

          {/* Tip */}
          <div className="text-center text-sm text-gray-500">
            💡 Tip: 워크스페이스별로 용어 DB가 별도 관리됩니다
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <WorkspaceCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

