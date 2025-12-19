import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export default function Badge({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }
  
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-3 py-1 
        text-xs font-medium 
        rounded-full
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

