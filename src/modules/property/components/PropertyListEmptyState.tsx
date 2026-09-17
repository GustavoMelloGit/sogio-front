import type { FC } from 'react';
import Link from 'next/link';
import { House, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';

type GhostCardProps = { highlighted?: boolean; className?: string };

const GhostCard: FC<GhostCardProps> = ({ highlighted = false, className }) => (
  <div
    className={cn(
      'w-20 space-y-1.5 rounded-lg border bg-card p-1.5 shadow-sm sm:w-24',
      className
    )}
  >
    <div
      className={cn(
        'flex aspect-video items-center justify-center rounded-md',
        highlighted ? 'bg-primary/15 text-primary' : 'bg-muted'
      )}
    >
      {highlighted && <House className='size-5' />}
    </div>
    <div className='h-1.5 w-3/4 rounded-full bg-muted' />
    <div className='h-1.5 w-1/2 rounded-full bg-muted' />
  </div>
);

export const PropertyListEmptyState: FC = () => {
  const { t } = useTranslation('property');

  return (
    <section
      aria-labelledby='property-list-empty-title'
      className='flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center sm:py-16'
    >
      <div aria-hidden='true' className='mb-8 flex items-end'>
        <GhostCard className='-mr-3 translate-y-2 -rotate-6 opacity-60' />
        <GhostCard highlighted className='relative z-10' />
        <GhostCard className='-ml-3 translate-y-2 rotate-6 opacity-60' />
      </div>

      <h2
        id='property-list-empty-title'
        className='text-lg font-semibold text-foreground'
      >
        {t('propertyList.emptyState.title')}
      </h2>
      <p className='mt-2 max-w-sm text-balance text-muted-foreground'>
        {t('propertyList.emptyState.description')}
      </p>

      <Link
        href={ROUTES.createProperty}
        className={buttonVariants({
          size: 'lg',
          className: 'mt-6 h-11 w-full sm:h-10 sm:w-auto',
        })}
      >
        <Plus aria-hidden='true' />
        {t('propertyList.emptyState.cta')}
      </Link>
    </section>
  );
};
