import React from 'react'
import { clsx } from 'clsx'

const Card = ({ children, className, withHeader, withFooter, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-surface rounded-lg border border-gray-200 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx('px-6 py-6 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={clsx('px-6 py-6', className)} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx('px-6 py-6 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card