import { AlertCircle, CalendarX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DataTableProps, JsonDataTableRow } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { useDataTableSelection } from './useDataTableSelection';

const SKELETON_ROWS = 5;

export function DataTableDesktop<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
  enableRowSelection = false,
  selectedRows = [],
  onSelectionChange,
  emptyState,
}: DataTableProps<T>) {
  const { allSelected, isRowSelected, handleSelectAll, handleSelectRow } =
    useDataTableSelection({
      data,
      selectedRows,
      onSelectionChange,
    });

  const colSpan = enableRowSelection ? columns.length + 1 : columns.length;

  return (
    <Table
      aria-busy={isLoading}
      aria-label={isLoading ? 'Carregando estadias' : undefined}
    >
      <TableHeader>
        <TableRow>
          {enableRowSelection && (
            <TableHead className='w-12'>
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label='Selecionar todas as linhas'
                disabled={isLoading || !!error}
              />
            </TableHead>
          )}
          {columns.map(column => (
            <TableHead key={column.accessorKey}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
            <TableRow key={rowIndex} aria-hidden='true'>
              {enableRowSelection && (
                <TableCell>
                  <Skeleton className='h-4 w-4 rounded' />
                </TableCell>
              )}
              {columns.map((column, colIndex) => (
                <TableCell key={column.accessorKey}>
                  <Skeleton
                    className='h-4'
                    style={{
                      width:
                        colIndex === 0
                          ? '60%'
                          : colIndex === columns.length - 1
                            ? '40%'
                            : '80%',
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {error && (
          <TableRow>
            <TableCell colSpan={colSpan}>
              <div
                className='flex flex-col items-center gap-2 py-10 text-center'
                role='alert'
              >
                <AlertCircle className='size-8 text-destructive' />
                <p className='font-medium text-destructive'>
                  Erro ao carregar estadias
                </p>
                <p className='text-sm text-muted-foreground'>{error}</p>
              </div>
            </TableCell>
          </TableRow>
        )}

        {!isLoading && !error && data.length === 0 && (
          <TableRow>
            <TableCell colSpan={colSpan}>
              <div
                className='flex flex-col items-center gap-2 py-10 text-center'
                role='status'
              >
                <CalendarX className='size-8 text-muted-foreground' />
                <p className='font-medium'>
                  {emptyState?.title ?? 'Nenhuma estadia encontrada'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {emptyState?.description ??
                    'Tente ajustar o período de check-in.'}
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          !error &&
          data.map(row => {
            const isSelected = isRowSelected(row.id);
            return (
              <TableRow
                key={row.id}
                data-state={isSelected ? 'selected' : undefined}
              >
                {enableRowSelection && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectRow(row.id)}
                      aria-label={`Selecionar linha ${row.id}`}
                    />
                  </TableCell>
                )}
                {columns.map(column => (
                  <TableCell key={column.accessorKey} {...column.cell}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
