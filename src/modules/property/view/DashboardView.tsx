import { type FC, type ElementType, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from '@/i18n/useTranslation';
import {
  Building2,
  CalendarCheck,
  Users,
  TrendingUp,
  ChevronRight,
  MapPin,
  CalendarIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { Currency } from '@/lib/currency';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFilters } from '@/hooks/useFilters';
import { useUserProperties } from '../service/PropertyService.hooks';
import { useDashboardOverview } from '../service/DashboardService.hooks';

const AVATAR_COLORS = [
  'bg-teal-500/20 text-teal-300',
  'bg-sky-500/20 text-sky-300',
  'bg-violet-500/20 text-violet-300',
  'bg-rose-500/20 text-rose-300',
  'bg-amber-500/20 text-amber-300',
];

const PROPERTY_ICON_STYLES = [
  'bg-gradient-to-br from-teal-500/25 to-teal-600/10 text-teal-400',
  'bg-gradient-to-br from-sky-500/25 to-sky-600/10 text-sky-400',
  'bg-gradient-to-br from-violet-500/25 to-violet-600/10 text-violet-400',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return parts[0][0].toUpperCase();
}

function getAvatarColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

type KpiCardProps = {
  title: string;
  value: string;
  icon: ElementType;
  cardClass: string;
};

const KpiCard: FC<KpiCardProps> = ({ title, value, icon: Icon, cardClass }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-2xl p-4 xl:p-6 transition-all duration-200 hover:-translate-y-1 hover:brightness-110',
      cardClass
    )}
  >
    <Icon
      className='absolute -right-2 -bottom-1 h-20 w-20 xl:h-28 xl:w-28 text-white/10'
      aria-hidden='true'
    />
    <div className='flex h-9 w-9 xl:h-11 xl:w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
      <Icon className='h-4 w-4 xl:h-5 xl:w-5 text-white' aria-hidden='true' />
    </div>
    <div className='relative mt-4'>
      <p className='text-lg sm:text-2xl lg:text-lg xl:text-2xl font-bold leading-tight tracking-tight text-white'>
        {value}
      </p>
      <p className='mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60 xl:text-xs'>
        {title}
      </p>
    </div>
  </div>
);

const DATE_FNS_LOCALES = { pt: ptBR, en: enUS } as const;
const INTL_LOCALES = { pt: 'pt-BR', en: 'en-US' } as const;
const LONG_DATE_FORMATS = {
  pt: "d 'de' MMMM 'de' yyyy",
  en: 'MMMM d, yyyy',
} as const;
const SHORT_DATE_FORMATS = {
  pt: "d 'de' MMM",
  en: 'MMM d',
} as const;

const DashboardView: FC = () => {
  const { t, language } = useTranslation(['dashboard', 'common']);
  const { filters, addFilter } = useFilters();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateFnsLocale = DATE_FNS_LOCALES[language];
  const intlLocale = INTL_LOCALES[language];
  const longDateFormat = LONG_DATE_FORMATS[language];
  const shortDateFormat = SHORT_DATE_FORMATS[language];

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const dateStr =
    typeof filters.dashboard_date === 'string'
      ? filters.dashboard_date
      : todayStr;
  const selectedDate = parseISO(dateStr);

  const { properties, isLoading: propertiesLoading } = useUserProperties();
  const { overview, isLoading: overviewLoading } =
    useDashboardOverview(dateStr);

  return (
    <Page.Container>
      <Page.Topbar nav={[{ label: 'Dashboard' }]} />
      <Page.Content>
        {/* Cabeçalho com date picker */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>{t('title')}</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {t('subtitle')}
            </p>
          </div>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start gap-2 sm:w-auto'
              >
                <CalendarIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                <span>
                  {format(selectedDate, longDateFormat, {
                    locale: dateFnsLocale,
                  }).replace(/^\w/, c => c.toUpperCase())}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='end'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={date => {
                  if (date) {
                    addFilter('dashboard_date', format(date, 'yyyy-MM-dd'));
                  }
                  setCalendarOpen(false);
                }}
                locale={dateFnsLocale}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* KPIs */}
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <KpiCard
            title={t('kpis.properties')}
            value={propertiesLoading ? '—' : properties.length.toString()}
            icon={Building2}
            cardClass='bg-gradient-to-br from-teal-500 to-teal-700'
          />
          <KpiCard
            title={t('kpis.occupiedToday')}
            value={
              overviewLoading
                ? '—'
                : (overview?.kpis.active_stays ?? 0).toString()
            }
            icon={Users}
            cardClass='bg-gradient-to-br from-sky-500 to-sky-700'
          />
          <KpiCard
            title={t('kpis.checkInsIn7Days')}
            value={
              overviewLoading
                ? '—'
                : (overview?.kpis.upcoming_check_ins ?? 0).toString()
            }
            icon={CalendarCheck}
            cardClass='bg-gradient-to-br from-amber-400 to-orange-600'
          />
          <KpiCard
            title={t('kpis.monthlyRevenue')}
            value={
              overviewLoading
                ? '—'
                : Currency.format(overview?.kpis.monthly_revenue ?? 0, {
                    locale: intlLocale,
                  })
            }
            icon={TrendingUp}
            cardClass='bg-gradient-to-br from-emerald-500 to-emerald-700'
          />
        </div>

        {/* Listas */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Card className='border-border/50 bg-card/60 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>
                {t('upcomingStays.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {overviewLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3'
                    >
                      <Skeleton className='h-9 w-9 shrink-0 rounded-full' />
                      <div className='flex-1 space-y-1.5'>
                        <Skeleton className='h-3.5 w-32 rounded' />
                        <Skeleton className='h-3 w-24 rounded' />
                      </div>
                      <Skeleton className='h-5 w-16 rounded-md' />
                    </div>
                  ))
                : (overview?.upcoming_stays ?? []).map(stay => (
                    <Link
                      key={stay.id}
                      to={ROUTES.property(stay.property_id)}
                      className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 text-sm transition-all duration-150 hover:border-border/70 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      aria-label={t('upcomingStays.viewStayAriaLabel', {
                        property: stay.property_name,
                        tenant: stay.tenant.name,
                      })}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          getAvatarColor(stay.tenant.name)
                        )}
                      >
                        {getInitials(stay.tenant.name)}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium text-foreground'>
                          {stay.tenant.name}
                        </p>
                        <p className='truncate text-xs text-muted-foreground'>
                          {stay.property_name}
                        </p>
                      </div>
                      <span className='shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary'>
                        {format(stay.check_in, shortDateFormat, {
                          locale: dateFnsLocale,
                        })}
                      </span>
                      <ChevronRight
                        className='h-4 w-4 shrink-0 text-muted-foreground/40'
                        aria-hidden='true'
                      />
                    </Link>
                  ))}
            </CardContent>
          </Card>

          <Card className='border-border/50 bg-card/60 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-3'>
              <CardTitle className='text-base font-semibold'>
                {t('yourProperties.title')}
              </CardTitle>
              <Link
                to={ROUTES.properties}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                {t('common:actions.viewAll')}
              </Link>
            </CardHeader>
            <CardContent className='space-y-2'>
              {propertiesLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3'
                    >
                      <Skeleton className='h-9 w-9 shrink-0 rounded-lg' />
                      <div className='flex-1 space-y-1.5'>
                        <Skeleton className='h-3.5 w-36 rounded' />
                        <Skeleton className='h-3 w-24 rounded' />
                      </div>
                    </div>
                  ))
                : properties.map((p, i) => (
                    <Link
                      key={p.id}
                      to={ROUTES.property(p.id)}
                      className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 text-sm transition-all duration-150 hover:border-border/70 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      aria-label={t('yourProperties.viewDetailsAriaLabel', {
                        name: p.name,
                      })}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          PROPERTY_ICON_STYLES[i % PROPERTY_ICON_STYLES.length]
                        )}
                      >
                        <Building2 className='h-4 w-4' aria-hidden='true' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium text-foreground'>
                          {p.name}
                        </p>
                        {p.address && (
                          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <MapPin
                              className='h-3 w-3 shrink-0'
                              aria-hidden='true'
                            />
                            <span className='truncate'>
                              {p.address.city}, {p.address.state}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className='h-4 w-4 shrink-0 text-muted-foreground/40'
                        aria-hidden='true'
                      />
                    </Link>
                  ))}
            </CardContent>
          </Card>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DashboardView;
