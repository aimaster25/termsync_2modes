'use client'

import { useState } from 'react'
import { useUnifyStore, TermGroup } from '@/store/unifyStore'
import { Card, Badge, Checkbox } from '@/components/common'

interface TermGroupCardProps {
  group: TermGroup
}

export default function TermGroupCard({ group }: TermGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { toggleGroup, toggleTerm, updateStandard } = useUnifyStore()

  const checkedOccurrences = group.occurrences.filter(o => o.checked).length

  return (
    <Card
      variant="bordered"
      className={`transition-all ${
        group.checked
          ? 'border-primary/50 bg-primary/5'
          : 'border-gray-700 opacity-60'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={group.checked}
              onChange={() => toggleGroup(group.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <Badge variant={group.source === 'db' ? 'primary' : 'success'}>
                  {group.source === 'db' ? '💾 DB 매칭' : '🤖 AI 분석'}
                </Badge>
                <span className="text-sm text-gray-400">
                  신뢰도 {group.confidence}%
                </span>
              </div>
              <p className="text-sm text-gray-400">
                총 {group.totalCount}건 발견
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 bg-surface-dark rounded"
          >
            {isExpanded ? '▲ 접기' : '▼ 상세 보기'}
          </button>
        </div>

        {/* Summary (Collapsed) */}
        {!isExpanded && (
          <div className="pl-11 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">변환:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {group.variants.map((variant, i) => (
                  <span key={i}>
                    <span className={`px-2 py-1 rounded ${
                      variant === group.standard
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {variant}
                    </span>
                    {i < group.variants.length - 1 && (
                      <span className="mx-2 text-gray-600">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {checkedOccurrences}/{group.occurrences.length}개 항목 선택됨
            </div>
          </div>
        )}

        {/* Detail (Expanded) */}
        {isExpanded && (
          <div className="pl-11 space-y-6 pt-4 border-t border-gray-700">
            {/* Standard Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                🎯 표준 용어 선택
              </label>
              <select
                value={group.standard}
                onChange={(e) => updateStandard(group.id, e.target.value)}
                className="w-full px-4 py-3 bg-surface-dark border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                disabled={!group.checked}
              >
                {group.variants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                💡 다른 용어들이 이 표준 용어로 통일됩니다
              </p>
            </div>

            {/* Occurrences */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">
                  📝 문서 내 발견 항목 ({group.occurrences.length}건)
                </h4>
                <span className="text-xs text-gray-500">
                  {checkedOccurrences}개 선택됨
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {group.occurrences.map((occ) => (
                  <div
                    key={occ.id}
                    className={`p-4 rounded-lg border transition-all ${
                      occ.checked
                        ? 'border-primary/30 bg-surface-dark'
                        : 'border-gray-700 bg-surface-dark/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={occ.checked}
                        onChange={() => toggleTerm(group.id, occ.id)}
                        disabled={!group.checked}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        {/* Before/After */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                            {occ.before}
                          </span>
                          <span className="text-gray-600">→</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                            {occ.after}
                          </span>
                          <span className="text-xs text-gray-500">
                            (Line {occ.line})
                          </span>
                        </div>

                        {/* Sentence */}
                        <p className="text-sm text-gray-300 leading-relaxed">
                          📄 {occ.sentence}
                        </p>

                        {/* Context */}
                        <p className="text-xs text-gray-500">
                          💡 문맥: {occ.context}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
              <button
                onClick={() => {
                  group.occurrences.forEach(occ => {
                    if (!occ.checked) toggleTerm(group.id, occ.id)
                  })
                }}
                disabled={!group.checked}
                className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                전체 선택
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => {
                  group.occurrences.forEach(occ => {
                    if (occ.checked) toggleTerm(group.id, occ.id)
                  })
                }}
                disabled={!group.checked}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                전체 해제
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

