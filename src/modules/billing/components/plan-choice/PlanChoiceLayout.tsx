import type { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { useLogout } from '@/modules/auth/service/AuthService.hooks';

const LOGO_WIDTH = 788;
const LOGO_HEIGHT = 240;

export const PlanChoiceLayout: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('billing');
  const { logout } = useLogout();

  return (
    <div className='bg-background min-h-dvh px-4 pt-4 pb-12 md:px-6 md:pt-6'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-8'>
        <header className='flex items-center justify-between gap-4'>
          <Image
            src='/assets/sogio-fundo-claro.png'
            alt='Sogio'
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            priority
            className='h-8 w-auto dark:hidden'
          />
          <Image
            src='/assets/sogio-fundo-escuro.png'
            alt='Sogio'
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            priority
            className='hidden h-8 w-auto dark:block'
          />
          <Button
            variant='ghost'
            className='h-11'
            onClick={() => void logout()}
          >
            <LogOut aria-hidden='true' />
            {t('planChoice.logout')}
          </Button>
        </header>

        <main className='flex flex-col gap-8'>{children}</main>
      </div>
    </div>
  );
};
