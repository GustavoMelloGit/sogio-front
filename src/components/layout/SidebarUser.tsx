'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/modules/auth/service/AuthService.hooks';
import { ROUTES } from '@/routes/routes';
import {
  CreditCard,
  EllipsisVertical,
  Languages,
  LogOut,
  Moon,
  Plug,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';

export const SidebarUser: FC = () => {
  const { logout } = useLogout();
  const { isMobile } = useSidebar();
  const user = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { t, language, changeLanguage } = useTranslation();

  const toggleLanguage = () => {
    changeLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarFallback className='rounded-lg'>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.name} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.changePassword}>
                  <ShieldCheck aria-hidden='true' />
                  {t('sidebar.security')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.connectedApps}>
                  <Plug />
                  {t('sidebar.connectedApps')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.billingSettings}>
                  <CreditCard />
                  {t('sidebar.billing')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={event => {
                  event.preventDefault();
                  setTheme(isDark ? 'light' : 'dark');
                }}
              >
                {isDark ? <Sun /> : <Moon />}
                {isDark ? t('sidebar.lightTheme') : t('sidebar.darkTheme')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={event => {
                  event.preventDefault();
                  toggleLanguage();
                }}
              >
                <Languages />
                {t('sidebar.switchLanguage')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              {t('sidebar.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
