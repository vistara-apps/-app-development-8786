import React from 'react'
import { clsx } from 'clsx'

const DataTable = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          'min-w-full divide-y divide-gray-200',
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
    <thead className={clsx('bg-gray-50', className)} {...props}>
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
    <tr className={clsx('hover:bg-gray-50', className)} {...props}>
      {children}
    </tr>
  )
}

const DataTableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

const DataTableCell = ({ children, className, ...props }) => {
  return (
    <td
      className={clsx('px-6 py-4 whitespace-nowrap text-sm text-text', className)}
      {...props}
    >
      {children}
    </td>
  )
}

DataTable.Header = DataTableHeader
DataTable.Body = DataTableBody
DataTable.Row = DataTableRow
DataTable.Head = DataTableHead
DataTable.Cell = DataTableCell

export default DataTable