import { describe, expect, it } from 'vitest';
import { AddressService } from './AddressService';

describe('AddressService.fromViaCep', () => {
  it('traduz o endereço do ViaCEP para os campos da propriedade', () => {
    expect(
      AddressService.fromViaCep({
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: 'de 612 a 1510 - lado par',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
      })
    ).toEqual({
      street: 'Avenida Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    });
  });

  it('mantém vazio o que o CEP de cidade inteira não traz', () => {
    expect(
      AddressService.fromViaCep({
        logradouro: '',
        bairro: '',
        localidade: 'Ubatuba',
        uf: 'SP',
      })
    ).toEqual({ street: '', neighborhood: '', city: 'Ubatuba', state: 'SP' });
  });

  it.each([{ erro: 'true' }, { erro: true }])(
    'devolve null quando o CEP não existe (%o)',
    response => {
      expect(AddressService.fromViaCep(response)).toBeNull();
    }
  );
});
