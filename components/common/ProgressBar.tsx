interface ProgressBarProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function ProgressBar({ 
  value, 
  size = 'md', 
  showLabel = true 
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-sm text-gray-400 text-right">
          {clampedValue}%
        </div>
      )}
    </div>
  )
}

