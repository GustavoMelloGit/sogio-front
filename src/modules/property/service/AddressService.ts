import z from 'zod';
import api from '@/lib/api';
import type { Address } from '../types/Property';

export type ZipCodeAddress = Pick<
  Address,
  'street' | 'neighborhood' | 'city' | 'state'
>;

const viaCepAddressSchema = z.object({
  logradouro: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
});

export class AddressService {
  static async findByZipCode(zipCode: string): Promise<ZipCodeAddress | null> {
    const response = await api.get(
      `https://viacep.com.br/ws/${zipCode}/json/`,
      { withCredentials: false, skipAuthRedirect: true }
    );
    return AddressService.fromViaCep(response.data);
  }

  static fromViaCep(data: unknown): ZipCodeAddress | null {
    const parsed = viaCepAddressSchema.safeParse(data);
    if (!parsed.success) return null;

    return {
      street: parsed.data.logradouro,
      neighborhood: parsed.data.bairro,
      city: parsed.data.localidade,
      state: parsed.data.uf,
    };
  }
}
