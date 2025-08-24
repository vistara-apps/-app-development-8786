import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default',
  error,
  leftIcon,
  rightIcon,
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
    xs: 'h-7 text-xs px-2 py-1',
    sm: 'h-8 text-sm px-3 py-1',
    default: 'h-10 text-sm px-3 py-2',
    lg: 'h-12 text-base px-4 py-2',
    xl: 'h-14 text-lg px-4 py-2'
  }

  const errorClasses = error ? 
    'border-destructive focus:border-destructive focus:ring-destructive/50' : 
    variants[variant]

  return (
    <div className={clsx('relative', isFullWidth && 'w-full')}>
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'rounded-md border bg-surface ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
          sizes[size],
          errorClasses,
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          isFullWidth && 'w-full',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted">
          {rightIcon}
        </div>
      )}
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
