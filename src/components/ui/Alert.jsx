import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle, 
  X,
  Bell
} from 'lucide-react'

const Alert = forwardRef(({ 
  children, 
  variant = 'default', 
  title,
  isDismissable = false,
  onDismiss,
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: 'border-gray-200 bg-surface text-text',
    primary: 'border-primary-100 bg-primary-50 text-primary-800',
    success: 'border-green-100 bg-green-50 text-green-800',
    warning: 'border-yellow-100 bg-yellow-50 text-yellow-800',
    error: 'border-red-100 bg-red-50 text-red-800',
    info: 'border-blue-100 bg-blue-50 text-blue-800',
    destructive: 'border-red-200 bg-red-50 text-red-800'
  }

  const icons = {
    default: Bell,
    primary: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
    destructive: AlertTriangle
  }

  const iconColors = {
    default: 'text-gray-500',
    primary: 'text-primary-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    destructive: 'text-red-500'
  }

  const Icon = icons[variant]

  return (
    <div
      ref={ref}
      role="alert"
      className={clsx(
        'flex items-start gap-3 rounded-md border p-4 shadow-sm transition-opacity duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className={clsx('h-5 w-5 mt-0.5 flex-shrink-0', iconColors[variant])} />
      <div className="flex-1">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className={clsx(title && 'text-sm')}>{children}</div>
      </div>
      {isDismissable && (
        <button 
          onClick={onDismiss} 
          className="ml-auto -mr-1 -mt-1 p-1 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  )
})

Alert.displayName = 'Alert'

export default Alert
