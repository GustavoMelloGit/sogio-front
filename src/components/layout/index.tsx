'use client';

import { Suspense, type FC, type PropsWithChildren } from 'react';
import '@/i18n/appNamespaces';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './Sidebar';
import { AuthLoadingSpinner } from '../AuthLoadingSpinner';
import { PullToRefresh } from './PullToRefresh';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense fallback={<AuthLoadingSpinner />}>
      <SidebarProvider>
        <AppSidebar />
        <PullToRefresh>{children}</PullToRefresh>
      </SidebarProvider>
    </Suspense>
  );
};
