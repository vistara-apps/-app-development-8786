import React from 'react'
import { clsx } from 'clsx'

const DataTable = ({ children, className, responsive = true, ...props }) => {
  return (
    <div className={clsx("overflow-x-auto rounded-md", responsive && "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent")}>
      <table
        className={clsx(
          'min-w-full divide-y divide-gray-200 border-collapse',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

const DataTableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={clsx('bg-gray-50 sticky top-0 z-10', className)} {...props}>
      {children}
    </thead>
  )
}

const DataTableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={clsx('bg-surface divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  )
}

const DataTableRow = ({ children, className, ...props }) => {
  return (
    <tr className={clsx('hover:bg-gray-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  )
}

const DataTableHead = ({ children, className, hiddenOnMobile = false, ...props }) => {
  return (
    <th
      className={clsx(
        'px-4 md:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider',
        hiddenOnMobile && 'hidden md:table-cell',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

const DataTableCell = ({ children, className, hiddenOnMobile = false, ...props }) => {
  return (
    <td
      className={clsx(
        'px-4 md:px-6 py-3 md:py-4 text-sm text-text',
        hiddenOnMobile && 'hidden md:table-cell',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

// Card-style row for mobile view
const DataTableCardRow = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx(
        'md:hidden p-4 mb-3 bg-surface rounded-lg border border-gray-200 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Empty state component
const DataTableEmpty = ({ icon: Icon, title, description, action, className, ...props }) => {
  return (
    <div 
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-12 w-12 text-muted mx-auto mb-4" />}
      {title && <h3 className="text-lg font-medium text-text mb-2">{title}</h3>}
      {description && <p className="text-muted mb-6 max-w-md mx-auto">{description}</p>}
      {action}
    </div>
  )
}

// Loading state component
const DataTableLoading = ({ className, ...props }) => {
  return (
    <div 
      className={clsx(
        'py-8 px-4 flex items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="h-4 w-4 bg-primary/50 rounded-full animate-pulse delay-150"></div>
        <div className="h-4 w-4 bg-primary/70 rounded-full animate-pulse delay-300"></div>
        <span className="text-sm text-muted ml-2">Loading...</span>
      </div>
    </div>
  )
}

DataTable.Header = DataTableHeader
DataTable.Body = DataTableBody
DataTable.Row = DataTableRow
DataTable.Head = DataTableHead
DataTable.Cell = DataTableCell
DataTable.CardRow = DataTableCardRow
DataTable.Empty = DataTableEmpty
DataTable.Loading = DataTableLoading

export default DataTable
