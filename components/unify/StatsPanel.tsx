import { Card, Button } from '@/components/common'

interface StatsPanelProps {
  selectedCount: number
  totalGroups: number
  totalOccurrences: number
  onNext: () => void
}

export default function StatsPanel({
  selectedCount,
  totalGroups,
  totalOccurrences,
  onNext,
}: StatsPanelProps) {
  return (
    <Card variant="bordered" className="space-y-6">
      <h3 className="text-xl font-semibold">📊 통일 요약</h3>

      {/* Stats */}
      <div className="space-y-4">
        <div className="p-4 bg-surface-dark/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">선택한 그룹</span>
            <span className="text-2xl font-bold text-primary">
              {selectedCount}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            / {totalGroups}개 그룹
          </div>
        </div>

        <div className="p-4 bg-surface-dark/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">통일할 항목</span>
            <span className="text-2xl font-bold text-green-400">
              {totalOccurrences}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            건
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg space-y-2">
          <p className="text-sm text-primary font-medium">
            ✓ 문맥이 맞지 않는 항목은 체크 해제하세요
          </p>
        </div>
      </div>

      {/* Tip */}
      <div className="space-y-2 p-3 bg-blue-500/10 rounded-lg">
        <p className="text-sm font-medium text-blue-400">💡 검토 팁</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• 각 그룹을 펼쳐 문맥 확인</li>
          <li>• 표준 용어 변경 가능</li>
          <li>• 개별 항목 선택/해제 가능</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full"
          onClick={onNext}
          disabled={selectedCount === 0}
        >
          다음 단계 →
        </Button>
        <p className="text-xs text-center text-gray-500">
          선택 안 한 그룹은 건너뜁니다
        </p>
      </div>
    </Card>
  )
}

