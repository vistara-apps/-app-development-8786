import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

const Label = forwardRef(({ 
  children, 
  className, 
  required = false,
  optional = false,
  htmlFor,
  error,
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={clsx(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-destructive',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
        {optional && <span className="ml-1 text-muted text-xs">(optional)</span>}
      </label>
      {error && typeof error === 'string' && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})

Label.displayName = 'Label'

export default Label
