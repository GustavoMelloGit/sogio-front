import { env } from '@/lib/env';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(
    { buildId: env.NEXT_PUBLIC_BUILD_ID },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
