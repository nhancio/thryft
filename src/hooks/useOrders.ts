import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders, fetchOrderById } from "@/lib/orders";
import type { Order } from "@/lib/orders";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useUserOrders(userId: string | undefined) {
  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: fetchUserOrders,
    staleTime: 30 * 1000,
    enabled: !!SUPABASE_URL && !!userId,
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: () => (orderId ? fetchOrderById(orderId) : Promise.resolve(null)),
    staleTime: 30 * 1000,
    enabled: !!SUPABASE_URL && !!orderId,
  });
}
