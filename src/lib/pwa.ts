import { registerSW } from 'virtual:pwa-register';

/**
 * How often an installed app checks Vercel for a new deploy while it is open.
 */
const UPDATE_CHECK_INTERVAL_MS = 60 * 1000;

/**
 * Registers the service worker and keeps it looking for new deploys.
 *
 * `registerType: 'autoUpdate'` already reloads the page once a new service
 * worker takes control, but on its own it only looks for one at page load —
 * an installed PWA can stay open for days without that ever happening. The
 * checks below run while the app is open, when it comes back to the
 * foreground and when connectivity returns.
 */
export function setupPwaAutoUpdate() {
  if (import.meta.env.DEV) return;

  registerSW({
    immediate: true,
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
