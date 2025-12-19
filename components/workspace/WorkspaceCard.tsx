import { Workspace } from '@/store/workspaceStore'
import { Card, Badge } from '@/components/common'

interface WorkspaceCardProps {
  workspace: Workspace
  onSelect: () => void
}

export default function WorkspaceCard({ workspace, onSelect }: WorkspaceCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diff === 0) return '오늘'
    if (diff === 1) return '어제'
    if (diff < 7) return `${diff}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <Card 
      variant="bordered"
      className="cursor-pointer hover:border-primary/50 transition-all group"
      onClick={onSelect}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📂</span>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {workspace.name}
            </h3>
          </div>
          {workspace.learningRate && workspace.learningRate > 80 && (
            <Badge variant="primary">⭐</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-400">
            <span>💾</span>
            <span>{workspace.termCount}개 용어</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span>•</span>
            <span>{workspace.documentCount}개 문서</span>
          </div>
        </div>

        {/* Description */}
        {workspace.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {workspace.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-500">
            마지막 작업: {formatDate(workspace.lastUpdated)}
          </span>
          {workspace.learningRate && (
            <span className="text-xs text-gray-400">
              📊 DB 학습률: {workspace.learningRate}%
            </span>
          )}
        </div>

        {/* Select Button */}
        <button
          className="w-full py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
        >
          선택 →
        </button>
      </div>
    </Card>
  )
}

