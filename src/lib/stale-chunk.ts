/**
 * A deploy replaces every hashed chunk, so a tab still running the previous
 * build gets a 404 when it lazy-loads a route it had not visited yet. The SPA
 * rewrite answers that 404 with `index.html`, and the browser refuses to run
 * HTML as a module — the "MIME type of text/html" error the user sees. A full
 * reload picks up the new build and clears it.
 */
const STALE_CHUNK_MESSAGES = [
  'failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'importing a module script failed',
  'expected a javascript module script',
  'chunkloaderror',
];

export function isStaleChunkError(error: unknown): boolean {
  const description =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === 'string'
        ? error
        : '';

  const normalized = description.toLowerCase();

  return STALE_CHUNK_MESSAGES.some(message => normalized.includes(message));
}

const LAST_RELOAD_AT_KEY = 'sogio:stale-chunk-reload-at';

/**
 * A chunk that stays missing after a reload would loop forever, so recovery is
 * attempted at most once per cooldown — anything beyond that falls through to
 * the error screen.
 */
const RELOAD_COOLDOWN_MS = 10 * 1000;

let isReloadPending = false;

/**
 * Reloads the page to fetch the current build. Returns `false` when a reload
 * was already attempted moments ago, meaning it did not help.
 */
export function reloadForStaleChunk(): boolean {
  if (isReloadPending) return true;
  if (!canAttemptReload()) return false;

  isReloadPending = true;
  window.location.reload();

  return true;
}

function canAttemptReload(): boolean {
  try {
    const lastReloadAt = Number(
      window.sessionStorage.getItem(LAST_RELOAD_AT_KEY)
    );

    if (
      Number.isFinite(lastReloadAt) &&
      Date.now() - lastReloadAt < RELOAD_COOLDOWN_MS
    ) {
      return false;
    }

    window.sessionStorage.setItem(LAST_RELOAD_AT_KEY, String(Date.now()));

    return true;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Without a
    // way to detect a loop, showing the error screen is the safe fallback.
    return false;
  }
}

/**
 * Vite reports a failed chunk preload before React ever renders it, which is
 * the earliest point a stale build can be recovered from.
 */
export function setupStaleChunkRecovery(): void {
  window.addEventListener('vite:preloadError', () => {
    reloadForStaleChunk();
  });
}
