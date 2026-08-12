import { useState, type FC, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Calendar,
  CircleX,
  CopyIcon,
  KeyRound,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Phone as PhoneIcon,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { ROUTES } from '@/routes/routes';
import { useCancelStay, useGetStay } from '../service/StayService.hooks';
import { queryClient } from '@/lib/query-client';
import { UpdateStay } from '../components/UpdateStay';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { toClipboard } from '@/lib/utils';
import type { Stay } from '../types/Stay';
import { WhatsApp } from '@/components/icons/WhatsApp';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

const SOURCE_LABEL_KEYS: Record<Stay['source'], string> = {
  INTERNAL: 'stayDetail.sourceLabels.internal',
  AIRBNB: 'stayDetail.sourceLabels.airbnb',
  BOOKING: 'stayDetail.sourceLabels.booking',
};

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
};

const MetricCard: FC<MetricCardProps> = ({
  icon,
  label,
  value,
  highlighted,
}) => (
  <Card className={cn('py-0', highlighted && 'border-primary/20 bg-primary/5')}>
    <CardContent className='px-4 py-4'>
      <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {icon}
        {label}
      </div>
      <p
        className={cn(
          'text-lg font-semibold tabular-nums',
          highlighted && 'text-primary'
        )}
      >
        {value}
      </p>
    </CardContent>
  </Card>
);

export const StayDetailView: FC = () => {
  const { t, language } = useTranslation(['stay', 'common']);
  const intlLocale = INTL_LOCALES[language];
  const { stay_id, property_id } = useParams<{
    stay_id: string;
    property_id: string;
  }>();
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const navigate = useNavigate();
  const { data: stay, isLoading, error } = useGetStay(stay_id || '');
  const { mutate: cancelStay, isPending: isCancelingStay } = useCancelStay({
    onSuccess: () => {
      toast.success(t('stayDetail.toasts.cancelSuccess'));
      queryClient.invalidateQueries({ queryKey: ['stayWithTenant'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
      queryClient.invalidateQueries({ queryKey: ['finance-movements'] });
      navigate(ROUTES.property(property_id || ''), { replace: true });
    },
    onError: () => {
      toast.error(t('stayDetail.toasts.cancelError'));
    },
  });

  const copyText = (text: string) => {
    toClipboard(text);
    toast.success(t('stayDetail.toasts.copySuccess'));
  };

  const getCohostData = (): string => {
    if (!stay) return '';
    return [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in, intlLocale)} - ${formatDate(stay.check_out, intlLocale)}`,
      t('stayDetail.cohostData.guestsCount', { count: stay.guests }),
    ].join('\n');
  };

  const copyApartmentInstructionsUrl = () => {
    if (!stay) return;
    const url = new URL(ROUTES.stayInstructions(stay.id), location.origin);
    copyText(url.toString());
  };

  const getWhatsAppHref = (): string => {
    if (!stay) return '';
    const url = new URL(ROUTES.stayInstructions(stay.id), location.origin);
    const text = t('stayDetail.whatsappMessage', {
      name: stay.tenant.name,
      url: url.toString(),
    });
    return `https://wa.me/${Phone.toAPI(stay.tenant.phone)}?text=${encodeURIComponent(text)}`;
  };

  const handleCancelStay = () => {
    if (!stay) return;
    cancelStay({ stayId: stay.id });
  };

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: t('stayDetail.breadcrumb.myProperties'), to: ROUTES.home },
            { label: t('stayDetail.breadcrumb.stayDetails') },
          ]}
        />
        <Page.Header
          title={t('stayDetail.loadingTitle')}
          description={t('stayDetail.loadingDescription')}
        />
        <Page.Content>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full' />
            ))}
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            <Skeleton className='h-48 md:col-span-2' />
            <Skeleton className='h-48' />
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  if (error || !stay) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: t('stayDetail.breadcrumb.myProperties'), to: ROUTES.home },
            { label: t('stayDetail.breadcrumb.stayDetails') },
          ]}
        />
        <Page.Content>
          <Alert
            variant='destructive'
            message={
              error ? t('stayDetail.errorTitle') : t('stayDetail.notFoundTitle')
            }
          >
            {error
              ? t('stayDetail.errorDescription')
              : t('stayDetail.notFoundDescription')}
          </Alert>
          <div className='mt-4'>
            <Link
              to={ROUTES.home}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full',
              })}
            >
              <ArrowLeft className='mr-2 size-4' />
              {t('stayDetail.backToHome')}
            </Link>
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('stayDetail.breadcrumb.myProperties'), to: ROUTES.home },
          { label: stay.tenant.name },
        ]}
      />
      <Page.Header
        title={stay.tenant.name}
        description={t('stayDetail.dateRange', {
          checkIn: formatDate(stay.check_in, intlLocale),
          checkOut: formatDate(stay.check_out, intlLocale),
        })}
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                const { tenant, ...stayWithoutTenant } = stay;
                setSelectedStay(stayWithoutTenant);
              }}
            >
              <Pencil className='mr-2 size-4' />
              {t('stayDetail.editButton')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  aria-label={t('stayDetail.moreActionsAriaLabel')}
                >
                  <MoreHorizontal className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => copyText(getCohostData())}>
                  <CopyIcon className='mr-2 size-4' />
                  {t('stayDetail.copyCohostData')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyApartmentInstructionsUrl}>
                  <LinkIcon className='mr-2 size-4' />
                  {t('stayDetail.copyInstructionsLink')}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={getWhatsAppHref()}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <WhatsApp className='mr-2 size-4' />
                    {t('stayDetail.sendViaWhatsApp')}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleCancelStay}
                  disabled={isCancelingStay}
                  className='text-destructive focus:text-destructive'
                >
                  <CircleX className='mr-2 size-4' />
                  {isCancelingStay
                    ? t('stayDetail.cancelingStay')
                    : t('stayDetail.cancelStay')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Page.Content>
        {/* Key metrics */}
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <MetricCard
            icon={<Calendar className='size-3.5' />}
            label={t('stayDetail.checkInLabel')}
            value={formatDate(stay.check_in, intlLocale)}
          />
          <MetricCard
            icon={<Calendar className='size-3.5' />}
            label={t('stayDetail.checkOutLabel')}
            value={formatDate(stay.check_out, intlLocale)}
          />
          <MetricCard
            icon={<Users className='size-3.5' />}
            label={t('stayDetail.guestsLabel')}
            value={String(stay.guests)}
          />
          <MetricCard
            icon={null}
            label={t('stayDetail.totalValueLabel')}
            value={Currency.format(stay.price, { locale: intlLocale })}
            highlighted
          />
        </div>

        {/* Detail cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          {/* Stay details — 2 cols */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>{t('stayDetail.stayDetailsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1.5'>
                <p className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  <KeyRound className='size-3.5' />
                  {t('stayDetail.entranceCodeLabel')}
                </p>
                <div className='flex items-center gap-2'>
                  <code className='flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm'>
                    {stay.entrance_code}
                  </code>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => copyText(stay.entrance_code)}
                    aria-label={t('stayDetail.copyEntranceCodeAriaLabel')}
                  >
                    <CopyIcon className='size-4' />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  {t('stayDetail.bookingSourceLabel')}
                </p>
                <p className='text-sm font-medium'>
                  {t(SOURCE_LABEL_KEYS[stay.source])}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guest card — 1 col */}
          <Card>
            <CardHeader>
              <CardTitle>{t('stayDetail.guestTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarFallback>
                    {getInitials(stay.tenant.name)}
                  </AvatarFallback>
                </Avatar>
                <p className='min-w-0 truncate font-medium'>
                  {stay.tenant.name}
                </p>
              </div>

              <Separator />

              <div className='flex items-center justify-between gap-2'>
                <div className='flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground'>
                  <PhoneIcon className='size-3.5 shrink-0' />
                  <span className='truncate'>
                    {Phone.toHumanReadable(stay.tenant.phone)}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() =>
                    copyText(Phone.toHumanReadable(stay.tenant.phone))
                  }
                  aria-label={t('stayDetail.copyPhoneAriaLabel')}
                >
                  <CopyIcon className='size-3.5' />
                </Button>
              </div>

              <a
                href={getWhatsAppHref()}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'w-full',
                })}
              >
                <WhatsApp className='mr-2 size-4' />
                {t('stayDetail.sendViaWhatsApp')}
              </a>
            </CardContent>
          </Card>
        </div>
      </Page.Content>

      {selectedStay && (
        <UpdateStay
          stay={selectedStay}
          isOpen={!!selectedStay}
          onClose={() => setSelectedStay(null)}
        />
      )}
    </Page.Container>
  );
};
