import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-5 h-5 
            text-primary bg-surface-dark border-gray-600
            rounded
            focus:ring-2 focus:ring-primary/50
            cursor-pointer
            transition-all
            ${className}
          `}
          {...props}
        />
        {label && (
          <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

