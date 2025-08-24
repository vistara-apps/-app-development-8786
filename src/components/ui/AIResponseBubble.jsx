import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Bot, User, Scissors } from 'lucide-react'

const AIResponseBubble = forwardRef(({ 
  children, 
  variant = 'agent', 
  timestamp, 
  isTyping = false,
  senderName,
  className,
  ...props 
}, ref) => {
  const isUser = variant === 'user'
  const isSalon = variant === 'salon'

  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4" />
    if (isSalon) return <Scissors className="h-4 w-4" />
    return <Bot className="h-4 w-4" />
  }

  const getIconBackground = () => {
    if (isUser) return 'bg-primary text-white'
    if (isSalon) return 'bg-accent text-white'
    return 'bg-primary/80 text-white'
  }

  const getBubbleStyle = () => {
    if (isUser) return 'bg-primary text-white rounded-br-sm shadow-sm'
    if (isSalon) return 'bg-accent text-white rounded-bl-sm shadow-sm'
    return 'bg-surface border border-gray-200 rounded-bl-sm shadow-sm'
  }

  // Typing animation dots
  const TypingIndicator = () => (
    <div className="flex space-x-1 items-center py-1">
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
    </div>
  )

  return (
    <div
      ref={ref}
      className={clsx(
        'flex gap-3 max-w-2xl',
        isUser ? 'ml-auto flex-row-reverse' : '',
        className
      )}
      {...props}
    >
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        getIconBackground()
      )}>
        {getIcon()}
      </div>
      
      <div className={clsx(
        'flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start'
      )}>
        {senderName && (
          <div className="text-xs font-medium text-muted px-1">
            {senderName}
          </div>
        )}
        
        <div className={clsx(
          'rounded-lg px-4 py-2 max-w-md transition-all',
          getBubbleStyle()
        )}>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <div className="text-sm leading-relaxed">
              {children}
            </div>
          )}
        </div>
        
        {timestamp && (
          <div className="text-xs text-muted px-1">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  )
})

AIResponseBubble.displayName = 'AIResponseBubble'

export default AIResponseBubble
