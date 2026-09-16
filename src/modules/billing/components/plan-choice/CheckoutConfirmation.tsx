import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { PlanChoiceLayout } from './PlanChoiceLayout';

type Props = {
  isDelayed: boolean;
  onCheckAgain: () => void;
  onBackToPlans: () => void;
};

export const CheckoutConfirmation: FC<Props> = ({
  isDelayed,
  onCheckAgain,
  onBackToPlans,
}) => {
  const { t } = useTranslation('billing');

  return (
    <PlanChoiceLayout>
      <div
        role='status'
        className='mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center md:pt-24'
      >
        {!isDelayed && <Spinner size='lg' className='text-primary' />}
        <h1 className='text-2xl font-bold'>
          {isDelayed
            ? t('planChoice.checkout.delayedTitle')
            : t('planChoice.checkout.confirmingTitle')}
        </h1>
        <p className='text-muted-foreground'>
          {isDelayed
            ? t('planChoice.checkout.delayedDescription')
            : t('planChoice.checkout.confirmingDescription')}
        </p>
      </div>

      {isDelayed && (
        <div className='mx-auto flex w-full max-w-md flex-col gap-3'>
          <Button size='lg' className='h-11 w-full' onClick={onCheckAgain}>
            {t('planChoice.checkout.checkAgain')}
          </Button>
          <Button
            variant='ghost'
            size='lg'
            className='h-11 w-full'
            onClick={onBackToPlans}
          >
            {t('planChoice.checkout.backToPlans')}
          </Button>
        </div>
      )}
    </PlanChoiceLayout>
  );
};
