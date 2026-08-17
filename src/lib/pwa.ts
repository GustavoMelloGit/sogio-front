import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';
import i18n from '@/i18n';

/**
 * How often an installed app checks Vercel for a new deploy while it is open.
 */
const UPDATE_CHECK_INTERVAL_MS = 60 * 1000;

const UPDATE_TOAST_ID = 'pwa-update-available';

/**
 * Registers the service worker and keeps it looking for new deploys.
 *
 * The browser only looks for a new service worker on page load, and an
 * installed PWA can stay open for days without ever reloading. The checks
 * below run while the app is open, when it comes back to the foreground and
 * when connectivity returns. Once a new version is ready the user is prompted
 * to reload, and the prompt stays put until they do.
 */
export function setupPwaAutoUpdate() {
  if (import.meta.env.DEV) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      toast(i18n.t('appUpdate.title'), {
        id: UPDATE_TOAST_ID,
        description: i18n.t('appUpdate.description'),
        duration: Infinity,
        // Not dismissible on purpose: the old build keeps 404ing on chunks
        // it has not loaded yet, so updating is the only way forward.
        dismissible: false,
        action: {
          label: i18n.t('appUpdate.action'),
          onClick: () => void updateSW(true),
        },
      });
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      const checkForUpdate = async () => {
        if (registration.installing || !navigator.onLine) return;

        try {
          await registration.update();
        } catch {
          // Offline or a transient network failure — the next check retries.
        }
      };

      setInterval(() => void checkForUpdate(), UPDATE_CHECK_INTERVAL_MS);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void checkForUpdate();
      });

      window.addEventListener('online', () => void checkForUpdate());
    },
  });
}
