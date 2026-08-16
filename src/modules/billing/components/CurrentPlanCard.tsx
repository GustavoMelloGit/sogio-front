import { useMemo, type FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Alert } from '@/components/Alert';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import type {
  Plan,
  Subscription,
  SubscriptionStatus,
} from '../types/BillingTypes';

type Props = {
  subscription: Subscription;
  plan: Plan | undefined;
  isManaging: boolean;
  onManageSubscription: () => void;
};

const STATUS_BADGE_VARIANT: Record<
  SubscriptionStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'default',
  trialing: 'secondary',
  past_due: 'destructive',
  canceled: 'outline',
  incomplete: 'outline',
};

export const CurrentPlanCard: FC<Props> = ({
  subscription,
  plan,
  isManaging,
  onManageSubscription,
}) => {
  const { t, language } = useTranslation('billing');

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(INTL_LOCALES[language], { dateStyle: 'long' }),
    [language]
  );

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-2'>
        <div>
          <h2 className='text-lg font-semibold'>{t('currentPlan.title')}</h2>
          <p className='text-muted-foreground text-sm'>
            {plan?.name ?? subscription.planSlug}
          </p>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[subscription.status]}>
          {t(`currentPlan.status.${subscription.status}`)}
        </Badge>
      </CardHeader>

      <CardContent className='space-y-3'>
        {subscription.status === 'past_due' && (
          <Alert role='alert' message={t('currentPlan.pastDueWarning')} />
        )}

        {subscription.status === 'trialing' && subscription.trialEndsAt && (
          <p className='text-sm'>
            {t('currentPlan.trialEndsAt', {
              date: dateFormatter.format(new Date(subscription.trialEndsAt)),
            })}
          </p>
        )}

        {subscription.currentPeriodEnd && (
          <p className='text-sm text-muted-foreground'>
            {t(
              subscription.cancelAtPeriodEnd
                ? 'currentPlan.cancelAtPeriodEnd'
                : 'currentPlan.renewsAt',
              {
                date: dateFormatter.format(
                  new Date(subscription.currentPeriodEnd)
                ),
              }
            )}
          </p>
        )}
      </CardContent>

      {subscription.planSlug !== 'free' && (
        <CardFooter>
          <Button
            variant='outline'
            isLoading={isManaging}
            onClick={onManageSubscription}
          >
            {t('currentPlan.manageButton')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
