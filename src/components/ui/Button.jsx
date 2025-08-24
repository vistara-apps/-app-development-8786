import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

const Button = forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className, 
  disabled,
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary shadow-sm hover:shadow',
    outline: 'border border-gray-300 bg-surface hover:bg-gray-50 active:bg-gray-100 text-text focus:ring-primary',
    destructive: 'bg-destructive text-white hover:bg-destructive-600 active:bg-destructive-700 focus:ring-destructive shadow-sm hover:shadow',
    secondary: 'bg-gray-100 text-text hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 active:bg-gray-200 text-text focus:ring-gray-500',
    link: 'text-primary underline-offset-4 hover:underline focus:ring-primary p-0 h-auto'
  }

  const sizes = {
    xs: 'h-7 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg'
  }

  // Loading spinner
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        isLoading && 'cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && (
        <span className={clsx('mr-2', size === 'xs' || size === 'sm' ? 'text-[0.9em]' : 'text-[1em]')}>
          {leftIcon}
        </span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className={clsx('ml-2', size === 'xs' || size === 'sm' ? 'text-[0.9em]' : 'text-[1em]')}>
          {rightIcon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
