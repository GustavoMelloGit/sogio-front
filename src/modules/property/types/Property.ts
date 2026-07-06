import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import { tenantSexSchema } from '@/modules/stay/types/Stay';
import z from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  zip_code: z.string().min(1, 'CEP é obrigatório'),
  country: z.string(),
});

export type Address = z.infer<typeof addressSchema>;

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  user_id: z.string(),
  capacity: z.number(),
  address: addressSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Property = z.infer<typeof propertySchema>;

export const bookStayRequestSchema = z.object({
  check_in: z.iso.datetime(),
  check_out: z.iso.datetime(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  tenant: z.object({
    name: z.string(),
    phone: z.string(),
    sex: tenantSexSchema,
  }),
  guests: z.number(),
  property: z.uuidv4(),
  price: z.int().positive(),
  source: z.string().max(100),
});

export type BookStayRequest = z.infer<typeof bookStayRequestSchema>;

export const platformNameSchema = z.enum(['AIRBNB', 'BOOKING'], {
  message: 'Plataforma deve ser AIRBNB ou BOOKING',
});

export const externalBookingRequestSchema = z.object({
  platform_name: platformNameSchema,
  sync_url: z.url('URL deve ser válida'),
});

export type ExternalBookingRequest = z.infer<
  typeof externalBookingRequestSchema
>;

export const updatePropertyRequestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  capacity: z.number().min(1, 'Capacidade é obrigatória'),
  address: addressSchema,
});

export type UpdatePropertyRequest = z.infer<typeof updatePropertyRequestSchema>;

export const createPropertyRequestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: addressSchema.extend({
    country: z.string().min(1, 'País é obrigatório'),
  }),
  images: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos uma imagem é obrigatória'),
  capacity: z.coerce.number().int().min(1, 'Capacidade deve ser pelo menos 1'),
});

export type CreatePropertyRequest = z.infer<typeof createPropertyRequestSchema>;

export const CHECK_IN_HOUR = 15;
export const CHECK_OUT_HOUR = 9;
