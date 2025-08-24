import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

const Card = forwardRef(({ 
  children, 
  className, 
  variant = 'default',
  isHoverable = false,
  isInteractive = false,
  isCompact = false,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-surface border border-gray-200 shadow-sm',
    elevated: 'bg-surface border border-gray-200 shadow-md',
    outline: 'bg-surface border border-gray-300',
    filled: 'bg-gray-50 border border-gray-200',
    ghost: 'bg-transparent',
    primary: 'bg-primary/5 border border-primary/20',
    accent: 'bg-accent/5 border border-accent/20',
  }

  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-lg transition-all duration-200',
        variants[variant],
        isHoverable && 'hover:shadow-md hover:border-gray-300',
        isInteractive && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

const CardHeader = forwardRef(({ 
  children, 
  className, 
  separator = true,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'px-4 md:px-6 py-4 md:py-5',
        separator && 'border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

const CardTitle = forwardRef(({ 
  children, 
  className,
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={clsx(
        'text-lg font-semibold text-text',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
})

const CardDescription = forwardRef(({ 
  children, 
  className,
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={clsx(
        'text-sm text-muted mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})

const CardContent = forwardRef(({ 
  children, 
  className,
  isPadded = true,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={clsx(
        isPadded && 'px-4 md:px-6 py-4 md:py-5',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
})

const CardFooter = forwardRef(({ 
  children, 
  className, 
  separator = true,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'px-4 md:px-6 py-4 md:py-5',
        separator && 'border-t border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
