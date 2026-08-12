import type { FC } from 'react';
import { addDays } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { queryClient } from '@/lib/query-client';
import { Currency } from '@/lib/currency';
import { DateUtils } from '@/lib/date';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import { useBookStay } from '../service/PropertyService.hooks';
import { CHECK_IN_HOUR, CHECK_OUT_HOUR } from '../types/Property';
import { BookStayForm, type BookStayFormData } from './BookStayForm';

type Props = {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
};

const getDefaultValues = (): BookStayFormData => {
  const checkIn = new Date();
  checkIn.setHours(CHECK_IN_HOUR, 0, 0, 0);

  const checkOut = addDays(new Date(), 1);
  checkOut.setHours(CHECK_OUT_HOUR, 0, 0, 0);

  return {
    check_in: DateUtils.isoToInputDateTimeLocal(checkIn),
    check_out: DateUtils.isoToInputDateTimeLocal(checkOut),
    entrance_code: '',
    tenant_name: '',
    tenant_phone: '',
    tenant_sex: undefined as unknown as 'MALE' | 'FEMALE' | 'OTHER',
    guests: 1,
    price: 0,
  };
};

export const AddStay: FC<Props> = ({ propertyId, isOpen, onClose }) => {
  const { t } = useTranslation(['property']);
  const { mutate, isLoading, error } = useBookStay({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
      toast.success(t('addStay.successToast'));
      onClose();
    },
  });

  const handleSubmit = (data: BookStayFormData): void => {
    mutate({
      check_in: new Date(data.check_in).toISOString(),
      check_out: new Date(data.check_out).toISOString(),
      entrance_code: data.entrance_code,
      tenant: {
        name: data.tenant_name,
        phone: data.tenant_phone.replace(/\D/g, ''),
        sex: data.tenant_sex,
      },
      guests: Number(data.guests),
      property: propertyId,
      price: Currency.toCents(Number(data.price)),
      source: 'INTERNAL',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <PlusIcon className='size-5' />
            {t('addStay.title')}
          </SheetTitle>
          <SheetDescription>{t('addStay.description')}</SheetDescription>
        </SheetHeader>

        <div className='px-4 pb-6'>
          <BookStayForm
            defaultValues={getDefaultValues()}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            errorMessage={error?.message}
            submitButtonText={t('addStay.submitButton')}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
