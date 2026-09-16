import type { FC } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { planFeaturesOf } from '../constants/planFeatures';
import type { PlanCapabilities } from '../types/BillingTypes';

type Props = {
  capabilities: PlanCapabilities;
  className?: string;
};

export const PlanFeatureList: FC<Props> = ({ capabilities, className }) => {
  const { t } = useTranslation('billing');

  return (
    <ul className={cn('space-y-3 text-sm', className)}>
      {planFeaturesOf(capabilities).map(
        ({ labelKey, isIncluded, values }, index) => (
          <li
            key={labelKey}
            className={cn(
              'flex items-start gap-2',
              !isIncluded && 'text-muted-foreground'
            )}
          >
            {isIncluded ? (
              <Check
                className='mt-0.5 size-4 shrink-0 text-primary'
                aria-hidden='true'
              />
            ) : (
              <X className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
            )}
            <span className={cn(isIncluded && index === 0 && 'font-semibold')}>
              {!isIncluded && (
                <span className='sr-only'>
                  {t('pricing.features.notIncluded')}{' '}
                </span>
              )}
              {t(labelKey, values)}
            </span>
          </li>
        )
      )}
    </ul>
  );
};
