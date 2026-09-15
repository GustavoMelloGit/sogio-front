import type { FC } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, RefreshCw } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { SpecularButton } from '../SpecularButton';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useIsOnFreePlan } from '@/modules/billing/service/BillingService.hooks';
import { SidebarUser } from './SidebarUser';

type NavItem = {
  titleKey: string;
  url: string;
  icon: React.ElementType;
  isActive: (pathname: string) => boolean;
};

const navigationItems: NavItem[] = [
  {
    titleKey: 'sidebar.nav.dashboard',
    url: ROUTES.home,
    icon: LayoutDashboard,
    isActive: pathname => pathname === ROUTES.home,
  },
  {
    titleKey: 'sidebar.nav.properties',
    url: ROUTES.properties,
    icon: Building2,
    isActive: pathname =>
      pathname === ROUTES.properties ||
      pathname.startsWith(`${ROUTES.home}/property/`),
  },
  {
    titleKey: 'sidebar.nav.reconcileStays',
    url: ROUTES.reconcileStays,
    icon: RefreshCw,
    isActive: pathname => pathname === ROUTES.reconcileStays,
  },
];

export const AppSidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { isOnFreePlan } = useIsOnFreePlan();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='[&>img]:w-1/2 px-2'>
          <img
            src='/assets/sogio-fundo-claro.png'
            alt='Sogio'
            className='dark:hidden'
          />
          <img
            src='/assets/sogio-fundo-escuro.png'
            alt='Sogio'
            className='hidden dark:block'
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive(pathname)}
                    >
                      <Link href={item.url}>
                        <Icon className='h-4 w-4' />
                        <span>{t(item.titleKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {isOnFreePlan && (
          <SpecularButton
            size='sm'
            radius={12}
            tint='#111113'
            tintOpacity={0.92}
            textColor='#fafafa'
            lineColor='#ffffff'
            baseColor='#71717a'
            proximity={200}
            autoAnimate
            followMouse
            className='w-full'
            onClick={() => router.push(ROUTES.billingSettings)}
          >
            {t('sidebar.activatePro')}
          </SpecularButton>
        )}
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
