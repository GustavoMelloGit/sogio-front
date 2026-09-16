import { useMutation } from '@tanstack/react-query';
import { AddressService } from './AddressService';

export const useZipCodeLookup = () => {
  const { mutate, isPending, isError, data, variables, reset } = useMutation({
    mutationFn: (zipCode: string) => AddressService.findByZipCode(zipCode),
  });

  return {
    lookUpZipCode: mutate,
    resetZipCodeLookup: reset,
    lookedUpZipCode: variables,
    isLookingUp: isPending,
    hasLookupFailed: isError || data === null,
  };
};
