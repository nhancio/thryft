import { useQuery } from "@tanstack/react-query";
import { fetchProductsFromSupabase, fetchProductByIdFromSupabase, fetchSellersFromSupabase } from "@/lib/supabase-products";
import type { Product, Seller } from "@/types/product";

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
    queryFn: () => (id ? fetchProductByIdFromSupabase(id) : Promise.resolve(null)),
    enabled: !!SUPABASE_URL && !!id,
    staleTime: 60 * 1000,
  });

  return {
    product: product ?? null,
    isLoading,
  };
}

export function useSellers(): { sellers: Seller[]; isLoading: boolean } {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: fetchSellersFromSupabase,
    staleTime: 60 * 1000,
    enabled: !!SUPABASE_URL,
  });
  return {
    sellers,
    isLoading: !!SUPABASE_URL && isLoading,
  };
}
