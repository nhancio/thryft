import { supabase } from "@/integrations/supabase/client";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  /** Joined from products table when fetching */
  product?: {
    title: string;
    images: string[];
    category: string;
    brand: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

/** Create a pending order before initiating payment. */
export async function createOrder(params: {
  productId: string;
  amount: number;
  shippingAddress: ShippingAddress;
}): Promise<{ id: string } | { error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      product_id: params.productId,
      amount: params.amount,
      shipping_address: params.shippingAddress as unknown as Record<string, unknown>,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}

/** Update order with Razorpay payment details after successful payment. */
export async function markOrderPaid(params: {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}): Promise<{ ok: true } | { error: string }> {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_order_id: params.razorpayOrderId ?? null,
      razorpay_signature: params.razorpaySignature ?? null,
    })
    .eq("id", params.orderId);

  if (error) return { error: error.message };
  return { ok: true };
}

/** Cancel a pending order (e.g. payment was dismissed). */
export async function cancelOrder(orderId: string): Promise<void> {
  await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", "pending");
}

/** Fetch all orders for the current user, newest first. Joins product info. */
export async function fetchUserOrders(): Promise<Order[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, products:product_id(title, images, category, brand)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const product = row.products as { title: string; images: string[]; category: string; brand: string } | null;
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      product_id: row.product_id as string,
      amount: row.amount as number,
      razorpay_order_id: row.razorpay_order_id as string | null,
      razorpay_payment_id: row.razorpay_payment_id as string | null,
      razorpay_signature: row.razorpay_signature as string | null,
      status: row.status as OrderStatus,
      shipping_address: (row.shipping_address ?? {}) as ShippingAddress,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      product: product ?? undefined,
    };
  });
}

/** Fetch a single order by ID (only if it belongs to the current user via RLS). */
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products:product_id(title, images, category, brand)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const product = row.products as { title: string; images: string[]; category: string; brand: string } | null;
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    product_id: row.product_id as string,
    amount: row.amount as number,
    razorpay_order_id: row.razorpay_order_id as string | null,
    razorpay_payment_id: row.razorpay_payment_id as string | null,
    razorpay_signature: row.razorpay_signature as string | null,
    status: row.status as OrderStatus,
    shipping_address: (row.shipping_address ?? {}) as ShippingAddress,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    product: product ?? undefined,
  };
}
