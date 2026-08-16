import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/Table/DataTable';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import { useNamespacedFilters } from '@/hooks/useNamespacedFilters';
import { useSubscriptionHistory } from '../service/BillingService.hooks';
import type { SubscriptionHistoryEntry } from '../types/BillingTypes';

export const SubscriptionHistoryList: FC = () => {
  const { t, language } = useTranslation('billing');
  const intlLocale = INTL_LOCALES[language];
  const { filters, addFilter } = useNamespacedFilters('billingHistory');
  const currentPage = +filters.page || 1;

  const { history, pagination, isLoading, error } =
    useSubscriptionHistory(currentPage);

  const formatDateTime = (iso: string): string =>
    new Intl.DateTimeFormat(intlLocale, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));

  const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat(intlLocale, { dateStyle: 'short' }).format(
      new Date(iso)
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={history}
          pagination={{
            page: currentPage,
            totalPages: pagination?.total_pages ?? 1,
            onPageChange: page => addFilter('page', page),
          }}
          columns={[
            {
              header: t('history.columns.event'),
              accessorKey: 'type',
              render: (row: SubscriptionHistoryEntry) =>
                t(`history.eventType.${row.type}`),
              mobile: { isHeader: true },
            },
            {
              header: t('history.columns.plan'),
              accessorKey: 'plan_name',
              render: (row: SubscriptionHistoryEntry) => row.plan_name,
            },
            {
              header: t('history.columns.status'),
              accessorKey: 'resulting_status',
              render: (row: SubscriptionHistoryEntry) =>
                t(`currentPlan.status.${row.resulting_status}`),
            },
            {
              header: t('history.columns.occurredAt'),
              accessorKey: 'occurred_at',
              render: (row: SubscriptionHistoryEntry) =>
                formatDateTime(row.occurred_at),
            },
            {
              header: t('history.columns.accessUntil'),
              accessorKey: 'access_until',
              render: (row: SubscriptionHistoryEntry) =>
                row.access_until ? formatDate(row.access_until) : '—',
            },
            {
              header: t('history.columns.reason'),
              accessorKey: 'reason',
              render: (row: SubscriptionHistoryEntry) => row.reason ?? '—',
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
