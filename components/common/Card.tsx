import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export default function Card({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-surface-dark',
    bordered: 'bg-surface-dark border-2 border-gray-700',
    elevated: 'bg-surface-dark shadow-xl',
  }
  
  return (
    <div
      className={`
        rounded-xl p-6
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

