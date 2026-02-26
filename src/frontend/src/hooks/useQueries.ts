import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FabricProduct, CustomerInquiry } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<FabricProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FabricProduct | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export interface InquiryFormData {
  customerName: string;
  email: string;
  phone: string;
  companyName: string | null;
  productId: bigint;
  quantityRequired: bigint;
  message: string;
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InquiryFormData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(
        data.customerName,
        data.email,
        data.phone,
        data.companyName,
        data.productId,
        data.quantityRequired,
        data.message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useGetAllInquiries(enabled: boolean = false) {
  const { actor } = useActor();

  return useQuery<CustomerInquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getAllInquiries();
      return result;
    },
    // Only require actor to be present and enabled flag to be true.
    // Removing isFetching check so the query fires immediately when password is entered.
    enabled: !!actor && enabled,
    retry: false,
    // Always treat data as fresh so refetch() always re-fetches from backend
    staleTime: 0,
  });
}
