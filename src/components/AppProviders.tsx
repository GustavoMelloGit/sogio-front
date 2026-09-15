'use client';

import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import '@/i18n';
import { queryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/sonner';
import { ThemeColorMeta } from '@/components/ThemeColorMeta';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute='class'
    defaultTheme='system'
    enableSystem
    disableTransitionOnChange
  >
    <ThemeColorMeta />
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>{children}</AppErrorBoundary>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
);
