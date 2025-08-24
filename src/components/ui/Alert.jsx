import React from 'react'
import { clsx } from 'clsx'
import { AlertTriangle, CheckCircle } from 'lucide-react'

const Alert = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'border-gray-200 bg-surface text-text',
    destructive: 'border-red-200 bg-red-50 text-red-800'
  }

  const icons = {
    default: CheckCircle,
    destructive: AlertTriangle
  }

  const Icon = icons[variant]

  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-md border px-6 py-4',
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default Alert