import React from 'react'
import { clsx } from 'clsx'

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className, 
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary',
    outline: 'border border-gray-300 bg-surface hover:bg-gray-50 text-text focus:ring-primary',
    destructive: 'bg-destructive text-white hover:bg-destructive-600 focus:ring-destructive',
    secondary: 'bg-gray-100 text-text hover:bg-gray-200 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 text-text focus:ring-gray-500',
    link: 'text-primary underline-offset-4 hover:underline focus:ring-primary'
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg'
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button