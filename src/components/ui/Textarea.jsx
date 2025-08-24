import React from 'react'
import { clsx } from 'clsx'

const Textarea = ({ 
  className, 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50'
  
  const variants = {
    default: 'min-h-[80px]',
    medium: 'min-h-[120px]'
  }

  return (
    <textarea
      className={clsx(
        baseClasses,
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export default Textarea