import React from 'react'
import { clsx } from 'clsx'
import { Bot, User } from 'lucide-react'

const AIResponseBubble = ({ 
  children, 
  variant = 'agent', 
  timestamp, 
  className,
  ...props 
}) => {
  const isUser = variant === 'user'

  return (
    <div
      className={clsx(
        'flex gap-3 max-w-2xl',
        isUser ? 'ml-auto flex-row-reverse' : '',
        className
      )}
      {...props}
    >
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary text-white' : 'bg-accent text-white'
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className={clsx(
        'flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={clsx(
          'rounded-lg px-4 py-2 max-w-md',
          isUser 
            ? 'bg-primary text-white rounded-br-sm' 
            : 'bg-surface border border-gray-200 rounded-bl-sm'
        )}>
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </div>
        
        {timestamp && (
          <div className="text-xs text-muted px-1">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIResponseBubble