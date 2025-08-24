import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

const Textarea = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  error,
  isFullWidth = true,
  ...props 
}, ref) => {
  const variants = {
    default: 'border-gray-300 focus:border-primary-500',
    filled: 'bg-gray-50 border-gray-300 focus:bg-surface',
    flushed: 'border-t-0 border-l-0 border-r-0 rounded-none border-b-2 px-0',
    unstyled: 'border-0 shadow-none px-0 bg-transparent focus:ring-0 focus:ring-offset-0'
  }
  
  const sizes = {
    default: 'min-h-[80px] text-sm px-3 py-2',
    sm: 'min-h-[60px] text-sm px-3 py-2',
    md: 'min-h-[120px] text-sm px-3 py-2',
    lg: 'min-h-[160px] text-base px-4 py-3'
  }

  const errorClasses = error ? 
    'border-destructive focus:border-destructive focus:ring-destructive/50' : 
    variants[variant]

  return (
    <div className={clsx('relative', isFullWidth && 'w-full')}>
      <textarea
        ref={ref}
        className={clsx(
          'rounded-md border bg-surface ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
          sizes[size],
          errorClasses,
          isFullWidth && 'w-full',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
