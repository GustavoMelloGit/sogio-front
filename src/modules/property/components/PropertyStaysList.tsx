import { useState, useMemo, type FC } from 'react';
import { format, addDays } from 'date-fns';
import { usePropertyStays } from '../service/PropertyService.hooks';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CopyIcon,
  MoreHorizontal,
  X,
  EyeIcon,
  CalendarIcon,
  PlusIcon,
} from 'lucide-react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { AddStay } from './AddStay';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { DataTable } from '@/components/Table/DataTable';
import { ROUTES } from '@/routes/routes';
import { UpdateStay } from '@/modules/stay/components/UpdateStay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pluralize, toClipboard } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useNamespacedFilters } from '@/hooks/useNamespacedFilters';
import { useDebounce } from '@/hooks/useDebounce';

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

type Props = {
  propertyId: string;
};

export const PropertyStaysList: FC<Props> = ({ propertyId }) => {
  const { filters, addFilter, removeFilter } = useNamespacedFilters('stays');
  const currentPage = +filters.page || 1;
  const fromFilter =
    typeof filters.from === 'string' ? filters.from : undefined;
  const toFilter = typeof filters.to === 'string' ? filters.to : undefined;

  const defaults = useMemo(() => {
    const today = new Date();
    return {
      from: format(today, 'yyyy-MM-dd'),
      to: format(addDays(today, 30), 'yyyy-MM-dd'),
    };
  }, []);

  const effectiveFrom = fromFilter ?? defaults.from;
  const effectiveTo = toFilter ?? defaults.to;

  const debouncedFrom = useDebounce(effectiveFrom, 500);
  const debouncedTo = useDebounce(effectiveTo, 500);

  const handleFromChange = (value: string) => {
    if (value) addFilter('from', value);
    addFilter('page', 1);
  };

  const handleToChange = (value: string) => {
    if (value) addFilter('to', value);
    addFilter('page', 1);
  };

  const clearDateFilters = () => {
    removeFilter('from');
    removeFilter('to');
    addFilter('page', 1);
  };

  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [selectedStayIds, setSelectedStayIds] = useState<string[]>([]);
  const addStayDisclosure = useDisclosure();

  const { stays, isLoading, error } = usePropertyStays(propertyId, {
    from: debouncedFrom,
    to: debouncedTo,
    page: currentPage,
    limit: 10,
  });

  const copyText = (text: string) => {
    toClipboard(text);
    toast.success('Copiado com sucesso');
  };

  const getCohostData = (stay: WithTenant<Stay>): string => {
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ];
    return data.join('\n');
  };

  const copySelectedCohostData = () => {
    if (selectedStayIds.length === 0) return;

    const selectedStays = (stays?.data ?? []).filter(stay =>
      selectedStayIds.includes(stay.id)
    );

    const allData = selectedStays.map(getCohostData);

    copyText(allData.join('\n\n'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listagem de estadias</CardTitle>
        <CardDescription>
          Filtre pelo período de check-in para encontrar estadias
        </CardDescription>
        <CardAction>
          <Button size='sm' onClick={addStayDisclosure.open}>
            <PlusIcon className='size-4' />
            Nova Estadia
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
          <div className='flex flex-1 flex-col gap-3 sm:flex-row'>
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='filter-from'
                className='flex items-center gap-1.5'
              >
                <CalendarIcon className='size-3.5 text-muted-foreground' />
                Check-in de
              </Label>
              <Input
                id='filter-from'
                type='date'
                value={effectiveFrom}
                max={effectiveTo}
                onChange={e => handleFromChange(e.target.value)}
                className='w-full sm:w-44'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='filter-to'>até</Label>
              <Input
                id='filter-to'
                type='date'
                value={effectiveTo}
                min={effectiveFrom}
                onChange={e => handleToChange(e.target.value)}
                className='w-full sm:w-44'
              />
            </div>
          </div>
          {(fromFilter || toFilter) && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearDateFilters}
              className='self-end'
            >
              <X className='mr-2 size-4' />
              Limpar filtro
            </Button>
          )}
        </div>
        {selectedStayIds.length > 0 && (
          <div className='mb-4 flex items-center flex-wrap gap-2 justify-between rounded-lg border bg-muted/50 p-3'>
            <div className='flex items-center flex-wrap gap-2'>
              <span className='text-sm font-medium'>
                {selectedStayIds.length}{' '}
                {pluralize(selectedStayIds.length, 'estadia', 'estadias')}{' '}
                {pluralize(
                  selectedStayIds.length,
                  'selecionada',
                  'selecionadas'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <MoreHorizontal className='mr-2 size-4' />
                    Ações
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={copySelectedCohostData}>
                    <CopyIcon className='mr-2 size-4' />
                    Copiar dados para coanfitrião
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedStayIds([])}
              >
                <X className='mr-2 size-4' />
                Limpar seleção
              </Button>
            </div>
          </div>
        )}
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={stays?.data ?? []}
          enableRowSelection
          selectedRows={selectedStayIds}
          onSelectionChange={setSelectedStayIds}
          pagination={{
            page: currentPage,
            totalPages: stays?.pagination.total_pages ?? 1,
            onPageChange: page => {
              addFilter('page', page);
            },
          }}
          columns={[
            {
              header: 'Hóspede',
              accessorKey: 'tenant.name',
              render: row => row.tenant.name,
              mobile: {
                isHeader: true,
              },
            },
            {
              header: 'Hóspedes',
              accessorKey: 'guests',
              render: row => row.guests,
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Check-in',
              accessorKey: 'check_in',
              render: row => formatDate(row.check_in),
            },
            {
              header: 'Check-out',
              accessorKey: 'check_out',
              render: row => formatDate(row.check_out),
            },
            {
              header: 'Código',
              accessorKey: 'entrance_code',
              render: row => row.entrance_code,
            },
            {
              header: 'Valor',
              accessorKey: 'price',
              render: row => Currency.format(row.price),
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Ações',
              accessorKey: 'actions',
              render: row => (
                <div className='flex gap-2'>
                  <Link
                    to={ROUTES.stayDetail(propertyId, row.id)}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'icon',
                    })}
                  >
                    <EyeIcon className='size-4' />
                  </Link>
                </div>
              ),
            },
          ]}
        />
        {selectedStay && (
          <UpdateStay
            stay={selectedStay}
            isOpen={!!selectedStay}
            onClose={() => setSelectedStay(null)}
          />
        )}
        <AddStay
          propertyId={propertyId}
          isOpen={addStayDisclosure.isOpen}
          onClose={addStayDisclosure.close}
        />
      </CardContent>
    </Card>
  );
};
