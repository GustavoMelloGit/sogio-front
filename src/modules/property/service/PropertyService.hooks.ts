import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { PropertyService } from './PropertyService';
import type {
  BookStayRequest,
  CreatePropertyRequest,
  ExternalBookingRequest,
  UpdatePropertyRequest,
  Property,
} from '../types/Property';
import type { Stay } from '@/modules/stay/types/Stay';
import type { AxiosError } from 'axios';

/**
 * Hook para obter todas as propriedades do usuário
 * Fornece lista de propriedades e estados relacionados
 */
export const useUserProperties = () => {
  const {
    data: properties,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertyService.getUserProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    properties: properties || [],
    isLoading,
    error,
  };
};

export const useCreateProperty = (
  options?: UseMutationOptions<Property, AxiosError, CreatePropertyRequest>
) => {
  const {
    data: property,
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: (data: CreatePropertyRequest) =>
      PropertyService.createProperty(data),
  });

  return { property, isLoading, error, mutate };
};

export const useReconcileExternalStays = () => {
  const {
    data: stays,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['reconcileExternalStays'],
    queryFn: () => PropertyService.reconcileExternalStays(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stays,
    isLoading,
    error,
  };
};

export const useBookStay = (
  options?: UseMutationOptions<Stay, AxiosError, BookStayRequest>
) => {
  const {
    data: stay,
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: (stayData: BookStayRequest) =>
      PropertyService.bookStay(stayData),
  });
  return {
    stay,
    isLoading,
    error,
    mutate,
  };
};

export const usePropertyStays = (
  ...params: Parameters<typeof PropertyService.getPropertyStays>
) => {
  const {
    data: stays,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['propertyStays', ...params],
    queryFn: () => PropertyService.getPropertyStays(...params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stays,
    isLoading,
    error,
  };
};

/**
 * Hook para obter uma propriedade específica por ID
 * @param id - ID da propriedade
 */
export const useProperty = (id: string) => {
  const {
    data: property,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => PropertyService.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    property,
    isLoading,
    error,
  };
};

/**
 * Hook para cadastrar link de plataforma externa
 * @param options - Opções de configuração da mutação
 */
export const useCreateExternalBooking = (
  options?: UseMutationOptions<
    { message: string },
    AxiosError,
    { propertyId: string; data: ExternalBookingRequest }
  >
) => {
  const {
    data: result,
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: ({ propertyId, data }) =>
      PropertyService.createExternalBooking(propertyId, data),
  });

  return {
    result,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook para atualizar propriedade
 * @param options - Opções de configuração da mutação
 */
export const useUpdateProperty = (
  options?: UseMutationOptions<
    Property,
    AxiosError,
    { propertyId: string; data: UpdatePropertyRequest }
  >
) => {
  const {
    data: property,
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: ({ propertyId, data }) =>
      PropertyService.updateProperty(propertyId, data),
  });

  return {
    property,
    isLoading,
    error,
    mutate,
  };
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: (propertyId: string) =>
      PropertyService.deleteProperty(propertyId),
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: ['property', propertyId],
        refetchType: 'none',
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });

  return {
    deleteProperty: mutate,
    isDeleting: isPending,
    error,
    reset,
  };
};
