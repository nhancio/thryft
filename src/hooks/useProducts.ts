import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductsFromSupabase,
  fetchProductByIdFromSupabase,
  fetchUsersFromSupabase,
  fetchSavedProductIds,
  saveProduct,
  unsaveProduct,
} from "@/lib/supabase-products";
import type { Product, UserProfile } from "@/types/product";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function useProductsFromSupabase() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProductsFromSupabase,
    staleTime: 60 * 1000,
    enabled: !!SUPABASE_URL,
  });
}

export function useProducts(): {
  products: Product[];
  isLoading: boolean;
  categoryCounts: Record<string, number>;
} {
  const { data: products = [], isLoading } = useProductsFromSupabase();

  const categoryCounts: Record<string, number> = {
    All: products.length,
    iPhone: products.filter((p) => p.category === "iPhone").length,
    MacBook: products.filter((p) => p.category === "MacBook").length,
    Watch: products.filter((p) => p.category === "Watch").length,
  };

  return {
    products,
    isLoading: !!SUPABASE_URL && isLoading,
    categoryCounts,
  };
}

export function useProduct(id: string | undefined): {
  product: Product | null;
  isLoading: boolean;
} {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      id ? fetchProductByIdFromSupabase(id) : Promise.resolve(null),
    enabled: !!SUPABASE_URL && !!id,
    staleTime: 60 * 1000,
  });

  return {
    product: product ?? null,
    isLoading,
  };
}

export function useUsers(): { users: UserProfile[]; isLoading: boolean } {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersFromSupabase,
    staleTime: 60 * 1000,
    enabled: !!SUPABASE_URL,
  });
  return {
    users,
    isLoading: !!SUPABASE_URL && isLoading,
  };
}

export function useSavedProducts(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["saved_products", userId];

  const { data: savedIds = [] } = useQuery({
    queryKey,
    queryFn: () => (userId ? fetchSavedProductIds(userId) : Promise.resolve([])),
    staleTime: 30 * 1000,
    enabled: !!SUPABASE_URL && !!userId,
  });

  const save = useMutation({
    mutationFn: (productId: string) => saveProduct(userId!, productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<string[]>(queryKey) ?? [];
      queryClient.setQueryData(queryKey, [...prev, productId]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const unsave = useMutation({
    mutationFn: (productId: string) => unsaveProduct(userId!, productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<string[]>(queryKey) ?? [];
      queryClient.setQueryData(queryKey, prev.filter((id) => id !== productId));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const isSaved = (productId: string) => savedIds.includes(productId);

  const toggleSave = (productId: string) => {
    if (!userId) return;
    if (isSaved(productId)) {
      unsave.mutate(productId);
    } else {
      save.mutate(productId);
    }
  };

  return { savedIds, isSaved, toggleSave };
}
