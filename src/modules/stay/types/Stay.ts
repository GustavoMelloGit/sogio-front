import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import z from 'zod';

export const staySchema = z.object({
  id: z.string(),
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  guests: z.number(),
  price: z.number(),
  source: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Stay = z.infer<typeof staySchema>;

export const tenantSexSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);
export type TenantSex = z.infer<typeof tenantSexSchema>;

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  sex: tenantSexSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Tenant = z.infer<typeof tenantSchema>;
export type WithTenant<T> = T & {
  tenant: Tenant;
};

/**
 * Reserva feita direto com o anfitrião, sem plataforma. A API aceita
 * qualquer rótulo em `source`, e estes dois são os que ela mesma emite para
 * esse caso: `INTERNAL` pelo painel e `DIRECT` pelo assistente.
 */
const DIRECT_SOURCES = new Set(['INTERNAL', 'DIRECT']);

export const isDirectSource = (source: string): boolean =>
  DIRECT_SOURCES.has(source.toUpperCase());

export const sourcePlatformSchema = z.enum(['BOOKING', 'AIRBNB']);
export type SourcePlatform = z.infer<typeof sourcePlatformSchema>;

export const externalStaySchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  sourcePlatform: sourcePlatformSchema,
  property: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type ExternalStay = z.infer<typeof externalStaySchema>;

export const publicStaySchema = z.object({
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  tenant: z.object({
    name: z.string(),
  }),
});

export type PublicStay = z.infer<typeof publicStaySchema>;

export const updateStayRequestSchema = z.object({
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  guests: z.int().positive().optional(),
  price: z.int().positive().optional(),
});

export type UpdateStayRequest = z.infer<typeof updateStayRequestSchema>;
