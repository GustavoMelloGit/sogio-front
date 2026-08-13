import { useState, useMemo, type FC } from 'react';
import { format, startOfYear, endOfYear } from 'date-fns';
import { useTranslation } from '@/i18n/useTranslation';
import { usePropertyStays } from '../../service/PropertyService.hooks';
import { CoHostChart } from './CoHostChart';
import { IncomePerMonth } from './IncomePerMonth';
import { PropertyNumbers } from './PropertyNumbers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  propertyId: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export const PropertyDashboard: FC<Props> = ({ propertyId }) => {
  const { t } = useTranslation(['property']);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR.toString());

  const dateRange = useMemo(() => {
    const yearDate = new Date(Number(selectedYear), 0, 1);
    return {
      from: format(startOfYear(yearDate), 'yyyy-MM-dd'),
      to: format(endOfYear(yearDate), 'yyyy-MM-dd'),
    };
  }, [selectedYear]);

  const { stays } = usePropertyStays(propertyId, {
    ...dateRange,
    limit: 100,
    page: 1,
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue
              placeholder={t('propertyDashboard.yearSelectorPlaceholder')}
            />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_YEARS.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-4 xl:grid-cols-3'>
        <CoHostChart stays={stays?.data ?? []} />
        <PropertyNumbers stays={stays?.data ?? []} />
        <IncomePerMonth stays={stays?.data ?? []} />
      </div>
    </div>
  );
};
