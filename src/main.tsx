import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import './index.css';
import './i18n';
import { router } from './routes/index.tsx';
import { queryClient } from './lib/query-client';
import { Toaster } from '@/components/ui/sonner';
import { ThemeColorMeta } from '@/components/ThemeColorMeta';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { setupPwaAutoUpdate } from '@/lib/pwa';
import { setupStaleChunkRecovery } from '@/lib/stale-chunk';

setupPwaAutoUpdate();
setupStaleChunkRecovery();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColorMeta />
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <RouterProvider router={router} />
        </AppErrorBoundary>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
