import { env } from '@/lib/env';

export const APP_VERSION_ENDPOINT = '/api/version';

export const CURRENT_BUILD_ID = env.NEXT_PUBLIC_BUILD_ID;

interface AppVersionResponse {
  buildId?: unknown;
}

export async function fetchDeployedBuildId(
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const response = await fetch(APP_VERSION_ENDPOINT, {
      cache: 'no-store',
      signal,
    });

    if (!response.ok) return null;

    const { buildId } = (await response.json()) as AppVersionResponse;

    return typeof buildId === 'string' ? buildId : null;
  } catch {
    return null;
  }
}
