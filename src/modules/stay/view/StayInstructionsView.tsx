import { type FC } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  CarFront,
  DoorClosed,
  MapPin,
  PawPrint,
  Users,
  Wrench,
} from 'lucide-react';
import { useGetPublicStay } from '../service/StayService.hooks';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';

export const StayInstructionsView: FC = () => {
  const { t, language } = useTranslation(['stay', 'common']);
  const { stay_id } = useParams<{ stay_id: string }>();
  const { data: stay, isPending } = useGetPublicStay(stay_id || '');

  const dateFormatter = Intl.DateTimeFormat(INTL_LOCALES[language], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });

  if (isPending || !stay) {
    return (
      <div className='bg-[#fbf4ed] min-h-screen'>
        <div className='max-w-[40rem] mx-auto space-y-4 leading-none animate-pulse'>
          <img
            src='/stay-image.jpeg'
            alt={t('stayInstructions.imageAlt')}
            className='sm:rounded-2xl'
            width={764}
            height={429}
            loading='eager'
          />
          <div className='px-4 pb-10 space-y-4'>
            <div className='space-y-2'>
              <div className='h-6 w-52 bg-neutral-400/25 rounded-md' />
              <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
              <div className='h-4 w-3/4 bg-neutral-400/25 rounded-md' />
            </div>
            <div className='space-y-3'>
              <section className='space-y-2'>
                <div className='h-3.5 w-32 bg-neutral-400/25 rounded-md' />
                <div className='flex gap-2'>
                  <div className='size-5 shrink-0 bg-neutral-400/25 rounded' />
                  <div className='flex-1 space-y-1.5'>
                    <div className='h-4 w-20 bg-neutral-400/25 rounded-md' />
                    <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
                    <div className='h-4 w-2/3 bg-neutral-400/25 rounded-md' />
                  </div>
                </div>
                <div className='h-10 w-full bg-neutral-400/25 rounded-sm' />
              </section>
              <div className='h-px bg-neutral-400/25' />
              <section className='space-y-2'>
                <div className='h-3.5 w-44 bg-neutral-400/25 rounded-md' />
                <div className='grid grid-cols-2 rounded-lg ring ring-neutral-400/20'>
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={[
                        'p-2 space-y-1.5',
                        i < 2 ? 'border-b border-neutral-400/20' : '',
                        i % 2 === 0 ? 'border-r border-neutral-400/20' : '',
                      ].join(' ')}
                    >
                      <div className='h-3 w-16 bg-neutral-400/25 rounded-md' />
                      <div className='h-4 w-24 bg-neutral-400/25 rounded-md' />
                    </div>
                  ))}
                </div>
                <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-5/6 bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-2/3 bg-neutral-400/25 rounded-md' />
              </section>
              <div className='h-px bg-neutral-400/25' />
              <section className='space-y-2'>
                <div className='h-3.5 w-16 bg-neutral-400/25 rounded-md' />
                <div className='grid grid-cols-2 rounded-lg ring ring-neutral-400/20'>
                  {[0, 1].map(i => (
                    <div
                      key={i}
                      className={[
                        'p-2 space-y-1.5',
                        i === 0 ? 'border-r border-neutral-400/20' : '',
                      ].join(' ')}
                    >
                      <div className='h-3 w-16 bg-neutral-400/25 rounded-md' />
                      <div className='h-4 w-20 bg-neutral-400/25 rounded-md' />
                    </div>
                  ))}
                </div>
              </section>
              <div className='h-px bg-neutral-400/25' />
              <section className='space-y-2'>
                <div className='h-3.5 w-36 bg-neutral-400/25 rounded-md' />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='flex gap-2'>
                    <div className='size-5 shrink-0 bg-neutral-400/25 rounded' />
                    <div className='h-4 flex-1 bg-neutral-400/25 rounded-md' />
                  </div>
                ))}
              </section>
              <div className='h-px bg-neutral-400/25' />
              <section className='space-y-2'>
                <div className='h-3.5 w-48 bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-4/5 bg-neutral-400/25 rounded-md' />
                <div className='h-4 w-full bg-neutral-400/25 rounded-md' />
                <div className='aspect-video w-full bg-neutral-400/25 rounded-md' />
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const checkInDate = dateFormatter.format(stay.check_in);
  const checkOutDate = dateFormatter.format(stay.check_out);

  return (
    <div className='bg-[#fbf4ed] text-neutral-800'>
      <div className='max-w-[40rem] mx-auto space-y-4 leading-none'>
        <img
          src='/stay-image.jpeg'
          alt={t('stayInstructions.imageAlt')}
          className='sm:rounded-2xl'
          width={764}
          height={429}
          loading='eager'
        />
        <div className='px-4 pb-10 space-y-4'>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold'>
              {t('stayInstructions.greeting', { name: stay.tenant.name })}
            </h1>
            <h2 className='leading-tight'>
              {t('stayInstructions.welcomeMessage')}
            </h2>
          </div>

          <div className='space-y-3 [&>section]:space-y-2 [&_h3]:font-semibold'>
            <section>
              <h3>{t('stayInstructions.howToArrive.title')}</h3>
              <div className='flex gap-2'>
                <MapPin size={20} className='min-w-5' />
                <div className='space-y-1'>
                  <h4 className='font-semibold'>
                    {t('stayInstructions.howToArrive.addressLabel')}
                  </h4>
                  <p>
                    {t('stayInstructions.howToArrive.addressLine1')}
                    <br />
                    {t('stayInstructions.howToArrive.addressLine2')}
                  </p>
                </div>
              </div>
              <a
                href='https://maps.app.goo.gl/S5G5VZWHwgY7jZtR8'
                target='_blank'
                referrerPolicy='no-referrer'
                className='w-full ring ring-neutral-800 rounded-sm p-2 flex items-center gap-2 justify-center'
              >
                <MapPin size={20} className='size-5' />
                {t('stayInstructions.howToArrive.openInMaps')}
              </a>
            </section>
            <Separator />
            <section>
              <h3>{t('stayInstructions.checkInOut.title')}</h3>

              <div className='grid grid-cols-2 ring ring-neutral-300 border-neutral-300 rounded-lg [&>div]:p-2 [&>div]:space-y-0.5 [&_.value]:font-light [&_.label]:font-medium'>
                <div className='border-b border-r border-inherit'>
                  <p className='label'>
                    {t('stayInstructions.checkInOut.afterLabel')}
                  </p>
                  <span className='value'>{checkInDate}</span>
                </div>
                <div className='border-b border-inherit'>
                  <p className='label'>
                    {t('stayInstructions.checkInOut.untilLabel')}
                  </p>
                  <span className='value'>{checkOutDate}</span>
                </div>
                <div className='border-r border-inherit'>
                  <p className='label'>
                    {t('stayInstructions.checkInOut.cohostLabel')}
                  </p>
                  <a className='underline value' href='tel:+5528999849054'>
                    +55 28 99984-9054
                  </a>
                </div>
                <div>
                  <p className='label'>{t('stayInstructions.passwordLabel')}</p>
                  <span className='value'>{stay.entrance_code}</span>
                </div>
              </div>
              <p>
                {t('stayInstructions.checkInOut.cohostNoticeLead')}{' '}
                <strong>
                  {t('stayInstructions.checkInOut.cohostNoticeStrong')}
                </strong>
              </p>
              <p>
                {t('stayInstructions.checkInOut.passwordNoticeLead')}{' '}
                <strong>{stay.entrance_code}</strong>. <br />
                {t('stayInstructions.checkInOut.passwordNoticeRest')}
              </p>
            </section>
            <Separator />
            <section>
              <h3>{t('stayInstructions.wifi.title')}</h3>
              <div className='grid grid-cols-2 ring ring-neutral-300 border-neutral-300 rounded-lg [&>div]:p-2 [&>div]:space-y-0.5 [&_.value]:font-light [&_.label]:font-medium'>
                <div className='border-r border-inherit'>
                  <p className='label'>
                    {t('stayInstructions.wifi.nameLabel')}
                  </p>
                  <span className='value'>WIFI_BANDEIRA</span>
                </div>
                <div>
                  <p className='label'>{t('stayInstructions.passwordLabel')}</p>
                  <span className='value'>wmag2907</span>
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h3>{t('stayInstructions.houseRules.title')}</h3>
              <ul className='[&>li]:flex [&>li]:gap-1  [&_svg]:min-w-5 space-y-2'>
                <li>
                  <CarFront size={20} />{' '}
                  <span>{t('stayInstructions.houseRules.parking')}</span>
                </li>
                <li>
                  <PawPrint size={20} />{' '}
                  <span>{t('stayInstructions.houseRules.pets')}</span>
                </li>
                <li>
                  <Users size={20} />{' '}
                  <span>{t('stayInstructions.houseRules.guestsOnly')}</span>
                </li>
                <li>
                  <DoorClosed size={20} />{' '}
                  <span>{t('stayInstructions.houseRules.doors')}</span>
                </li>
                <li>
                  <Wrench size={20} />{' '}
                  <span>{t('stayInstructions.houseRules.maintenance')}</span>
                </li>
              </ul>
            </section>
            <Separator />
            <section>
              <h3>{t('stayInstructions.electronicLock.title')}</h3>
              <div className='space-y-2'>
                <ul className='space-y-2'>
                  <li>
                    <b>
                      {t('stayInstructions.electronicLock.enterPasswordLabel')}
                    </b>{' '}
                    {t('stayInstructions.electronicLock.enterPasswordText')}
                  </li>
                  <li>
                    <b>
                      {t('stayInstructions.electronicLock.avoidIssuesLabel')}
                    </b>{' '}
                    {t('stayInstructions.electronicLock.avoidIssuesText')}
                  </li>
                  <li>
                    <iframe
                      className='w-full aspect-video'
                      src='https://www.youtube.com/embed/Y8eaU1zkkB8'
                      title={t('stayInstructions.electronicLock.videoTitle')}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      referrerPolicy='strict-origin-when-cross-origin'
                      allowFullScreen
                    ></iframe>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
