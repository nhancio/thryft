import { useQuery } from "@tanstack/react-query";
import {
  fetchProductsFromSupabase,
  fetchProductByIdFromSupabase,
  fetchUsersFromSupabase,
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
