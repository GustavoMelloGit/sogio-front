import { AlertCircle, CalendarX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { DataTableProps, JsonDataTableRow } from './types';
import { Checkbox } from '../ui/checkbox';
import { useDataTableSelection } from './useDataTableSelection';

const SKELETON_CARDS = 3;

export function DataTableMobile<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
  enableRowSelection = false,
  selectedRows = [],
  onSelectionChange,
  emptyState,
}: DataTableProps<T>) {
  const headerColumn = columns.find(column => column.mobile?.isHeader);
  const restColumns = columns.filter(column => !column.mobile?.isHeader);

  const { isRowSelected, handleSelectRow } = useDataTableSelection({
    data,
    selectedRows,
    onSelectionChange,
  });

  if (isLoading) {
    return (
      <div
        className='space-y-4'
        aria-busy='true'
        aria-label='Carregando estadias'
      >
        {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
          <Card key={i} aria-hidden='true'>
            <CardHeader className='flex flex-row items-center justify-between gap-2'>
              <Skeleton className='h-5 w-2/5' />
              {enableRowSelection && <Skeleton className='h-4 w-4 rounded' />}
            </CardHeader>
            <CardContent className='space-y-2'>
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className='h-4 w-full' />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (data.length === 0) {
    return (
      <div
        className='flex flex-col items-center gap-2 py-10 text-center'
        role='status'
      >
        <CalendarX className='size-8 text-muted-foreground' />
        <p className='font-medium'>
          {emptyState?.title ?? 'Nenhuma estadia encontrada'}
        </p>
        <p className='text-sm text-muted-foreground'>
          {emptyState?.description ?? 'Tente ajustar o período de check-in.'}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {data.map(row => {
        const isSelected = isRowSelected(row.id);
        return (
          <Card
            key={row.id}
            className={cn('gap-2', isSelected && 'ring-2 ring-primary')}
          >
            <CardHeader className='flex flex-row items-center justify-between gap-2'>
              <CardTitle>{headerColumn?.render(row)}</CardTitle>
              {enableRowSelection && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectRow(row.id)}
                  aria-label={`Selecionar linha ${row.id}`}
                />
              )}
            </CardHeader>
            <CardContent className='divide-y divide-border pb-2'>
              {restColumns.map(column => (
                <div
                  key={column.accessorKey}
                  {...column.cell}
                  className={cn(
                    'flex items-center justify-between gap-2 flex-wrap py-2',
                    column.cell?.className
                  )}
                >
                  <span className='text-sm text-muted-foreground'>
                    {column.header}
                  </span>
                  <span className='font-medium'>{column.render(row)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
