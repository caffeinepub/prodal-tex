import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FabricProduct, CustomerInquiry, ProductId, UserProfile } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<FabricProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getAllProducts();
      return result;
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useGetProduct(id: ProductId) {
  const { actor, isFetching } = useActor();

  return useQuery<FabricProduct>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
    retry: 2,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      email: string;
      phone: string;
      companyName: string | null;
      productId: ProductId;
      quantityRequired: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(
        params.customerName,
        params.email,
        params.phone,
        params.companyName,
        params.productId,
        params.quantityRequired,
        params.message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useGetAllInquiries(enabled: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<CustomerInquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
