import type { FC } from 'react';
import { StayForm, type StayFormData } from './StayForm';
import { useUpdateStay } from '../service/StayService.hooks';
import { queryClient } from '@/lib/query-client';
import type { Stay } from '../types/Stay';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Edit } from 'lucide-react';
import { Alert } from '@/components/Alert';
import { DateUtils } from '@/lib/date';
import { Currency } from '@/lib/currency';
import { useTranslation } from '@/i18n/useTranslation';

type Props = {
  stay: Stay;
  isOpen: boolean;
  onClose: () => void;
};

export const UpdateStay: FC<Props> = ({ stay, isOpen, onClose }) => {
  const { t } = useTranslation(['stay', 'common']);
  const { mutateAsync, error } = useUpdateStay({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stay', stay.id] });
    },
  });

  const handleSubmit = async (data: StayFormData) => {
    const payload = {
      check_in: data.check_in,
      check_out: data.check_out,
      guests: data.guests,
      price: Currency.toCents(data.price),
    };
    await mutateAsync({ stayId: stay.id, data: payload });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5' />
            {t('updateStay.title')}
          </SheetTitle>
          <SheetDescription>{t('updateStay.description')}</SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {error && (
            <Alert
              variant='destructive'
              title={t('updateStay.errorTitle')}
              message={error.message}
              className='mb-4'
            />
          )}

          <StayForm
            defaultValues={{
              check_in: DateUtils.isoToInputDateTimeLocal(stay.check_in),
              check_out: DateUtils.isoToInputDateTimeLocal(stay.check_out),
              guests: stay.guests,
              price: Currency.fromCents(stay.price),
            }}
            onSubmit={handleSubmit}
            submitButtonText={t('updateStay.submitButton')}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
