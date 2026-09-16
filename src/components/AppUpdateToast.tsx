'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import { CURRENT_BUILD_ID, fetchDeployedBuildId } from '@/lib/appVersion';

const CHECK_INTERVAL_MS = 60 * 1000;

const TOAST_ID = 'app-update-available';

export const AppUpdateToast = () => {
  const { t } = useTranslation();
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || hasNewVersion) return;

    const controller = new AbortController();

    const check = async () => {
      if (!navigator.onLine || document.visibilityState !== 'visible') return;

      const deployedBuildId = await fetchDeployedBuildId(controller.signal);

      if (deployedBuildId && deployedBuildId !== CURRENT_BUILD_ID) {
        setHasNewVersion(true);
      }
    };

    const runCheck = () => void check();
    const interval = setInterval(runCheck, CHECK_INTERVAL_MS);

    document.addEventListener('visibilitychange', runCheck);
    window.addEventListener('online', runCheck);

    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', runCheck);
      window.removeEventListener('online', runCheck);
    };
  }, [hasNewVersion]);

  useEffect(() => {
    if (!hasNewVersion) return;

    toast(t('appUpdate.title'), {
      id: TOAST_ID,
      description: t('appUpdate.description'),
      duration: Infinity,
      action: {
        label: t('appUpdate.action'),
        onClick: () => window.location.reload(),
      },
      cancel: {
        label: t('appUpdate.dismiss'),
        onClick: () => toast.dismiss(TOAST_ID),
      },
    });
  }, [hasNewVersion, t]);

  return null;
};
