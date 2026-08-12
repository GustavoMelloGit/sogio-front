import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
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
      pathname === ROUTES.properties || pathname.startsWith('/property/'),
  },
  {
    titleKey: 'sidebar.nav.reconcileStays',
    url: ROUTES.reconcileStays,
    icon: RefreshCw,
    isActive: pathname => pathname === ROUTES.reconcileStays,
  },
];

export const AppSidebar: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Building2 className='h-4 w-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>StayHub</span>
            <span className='truncate text-xs text-muted-foreground'>
              {t('sidebar.tagline')}
            </span>
          </div>
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
                      isActive={item.isActive(location.pathname)}
                    >
                      <Link to={item.url}>
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
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
