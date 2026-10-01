import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  minWidthClassName?: string;
  emptyState?: ReactNode;
};

export function DataTable<T>({
  columns,
  data,
  minWidthClassName = 'min-w-[960px]',
  emptyState,
}: DataTableProps<T>) {
  if (!data.length && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-left', minWidthClassName)}>
        <thead>
          <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn('px-space-md py-space-sm font-semibold', column.headerClassName, column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-body-md text-body-md text-on-surface">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors hover:bg-surface-container-low/60">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-space-md py-3.5 align-middle', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
