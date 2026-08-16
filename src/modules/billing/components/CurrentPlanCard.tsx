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
  AccountStatus,
  Subscription,
  SubscriptionHistoryEntry,
} from '../types/BillingTypes';

type Props = {
  subscription: Subscription;
  latestEvent: SubscriptionHistoryEntry | undefined;
  isManaging: boolean;
  canManageSubscription: boolean;
  onManageSubscription: () => void;
};

const STATUS_BADGE_VARIANT: Record<
  AccountStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'default',
  trialing: 'secondary',
  past_due: 'destructive',
  canceled: 'outline',
  none: 'outline',
};

export const CurrentPlanCard: FC<Props> = ({
  subscription,
  latestEvent,
  isManaging,
  canManageSubscription,
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
            {latestEvent?.plan_name ?? '—'}
          </p>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[subscription.status]}>
          {t(`currentPlan.status.${subscription.status}`)}
        </Badge>
      </CardHeader>

      <CardContent className='space-y-3'>
        {!subscription.has_platform_access && subscription.blocked_reason && (
          <Alert
            role='alert'
            message={t(
              `currentPlan.blockedReason.${subscription.blocked_reason}`
            )}
          />
        )}

        {subscription.status === 'trialing' && latestEvent?.access_until && (
          <p className='text-sm'>
            {t('currentPlan.trialEndsAt', {
              date: dateFormatter.format(new Date(latestEvent.access_until)),
            })}
          </p>
        )}

        {subscription.status === 'active' && latestEvent?.access_until && (
          <p className='text-sm text-muted-foreground'>
            {t('currentPlan.renewsAt', {
              date: dateFormatter.format(new Date(latestEvent.access_until)),
            })}
          </p>
        )}
      </CardContent>

      {canManageSubscription && (
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
