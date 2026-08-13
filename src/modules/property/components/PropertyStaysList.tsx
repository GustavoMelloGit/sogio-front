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
import { toClipboard } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useNamespacedFilters } from '@/hooks/useNamespacedFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';

type Props = {
  propertyId: string;
};

export const PropertyStaysList: FC<Props> = ({ propertyId }) => {
  const { t, language } = useTranslation(['property']);
  const intlLocale = INTL_LOCALES[language];

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

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
    toast.success(t('propertyStaysList.copiedSuccess'));
  };

  const getCohostData = (stay: WithTenant<Stay>): string => {
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      t('propertyStaysList.guestsCount', { count: stay.guests }),
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
        <CardTitle>{t('propertyStaysList.title')}</CardTitle>
        <CardDescription>{t('propertyStaysList.description')}</CardDescription>
        <CardAction>
          <Button size='sm' onClick={addStayDisclosure.open}>
            <PlusIcon className='size-4' />
            {t('propertyStaysList.newStayButton')}
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
                {t('propertyStaysList.filterFromLabel')}
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
              <Label htmlFor='filter-to'>
                {t('propertyStaysList.filterToLabel')}
              </Label>
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
              {t('propertyStaysList.clearFilter')}
            </Button>
          )}
        </div>
        {selectedStayIds.length > 0 && (
          <div className='mb-4 flex items-center flex-wrap gap-2 justify-between rounded-lg border bg-muted/50 p-3'>
            <div className='flex items-center flex-wrap gap-2'>
              <span className='text-sm font-medium'>
                {t('propertyStaysList.selectedStaysCount', {
                  count: selectedStayIds.length,
                })}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <MoreHorizontal className='mr-2 size-4' />
                    {t('propertyStaysList.actionsButton')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={copySelectedCohostData}>
                    <CopyIcon className='mr-2 size-4' />
                    {t('propertyStaysList.copyCohostData')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedStayIds([])}
              >
                <X className='mr-2 size-4' />
                {t('propertyStaysList.clearSelection')}
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
              header: t('propertyStaysList.columns.guest'),
              accessorKey: 'tenant.name',
              render: row => row.tenant.name,
              mobile: {
                isHeader: true,
              },
            },
            {
              header: t('propertyStaysList.columns.guests'),
              accessorKey: 'guests',
              render: row => row.guests,
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: t('propertyStaysList.columns.checkIn'),
              accessorKey: 'check_in',
              render: row => formatDate(row.check_in),
            },
            {
              header: t('propertyStaysList.columns.checkOut'),
              accessorKey: 'check_out',
              render: row => formatDate(row.check_out),
            },
            {
              header: t('propertyStaysList.columns.code'),
              accessorKey: 'entrance_code',
              render: row => row.entrance_code,
            },
            {
              header: t('propertyStaysList.columns.amount'),
              accessorKey: 'price',
              render: row => Currency.format(row.price, { locale: intlLocale }),
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: t('propertyStaysList.columns.actions'),
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
