import { supabase } from "@/integrations/supabase/client";
import type { Product, Seller } from "@/types/product";
import type { Tables } from "@/integrations/supabase/types";

function mapSellerRow(row: Tables<"sellers">): Seller {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar ?? "",
    rating: row.rating,
    totalSales: row.total_sales,
    verified: row.verified,
    responseTime: row.response_time ?? "",
    location: row.location ?? "",
  };
}

function mapProductRow(
  row: Tables<"products">,
  seller: Seller
): Product {
  const images = Array.isArray(row.images) ? row.images : [];
  const measurements = row.measurements as Product["measurements"] | null;
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    images,
    category: row.category,
    subcategory: row.subcategory ?? "",
    brand: row.brand,
    size: row.size,
    condition: row.condition as Product["condition"],
    era: row.era ?? undefined,
    description: row.description,
    seller,
    status: (row.status as Product["status"]) ?? "live",
    listedByUid: row.listed_by_uid ?? undefined,
    measurements: measurements ?? undefined,
    tags: row.tags ?? [],
    allowOffers: row.allow_offers,
    shippingCost: row.shipping_cost,
    localPickup: row.local_pickup,
    createdAt: row.created_at,
    likes: row.likes,
    views: row.views,
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const { data: productRows, error: productsError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productsError || !productRows?.length) {
    return [];
  }

  const sellerIds = [...new Set(productRows.map((p) => p.seller_id))];
  const { data: sellerRows, error: sellersError } = await supabase
    .from("sellers")
    .select("*")
    .in("id", sellerIds);

  if (sellersError || !sellerRows?.length) {
    return [];
  }

  const sellerMap = new Map(sellerRows.map((s) => [s.id, mapSellerRow(s)]));

  return productRows.map((row) => {
    const seller = sellerMap.get(row.seller_id);
    if (!seller) return null;
    return mapProductRow(row, seller);
  }).filter(Boolean) as Product[];
}

export async function fetchProductByIdFromSupabase(id: string): Promise<Product | null> {
  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) return null;

  const { data: sellerRow, error: sellerError } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", row.seller_id)
    .single();

  if (sellerError || !sellerRow) return null;

  return mapProductRow(row, mapSellerRow(sellerRow));
}

export async function fetchSellersFromSupabase(): Promise<Seller[]> {
  const { data: rows, error } = await supabase
    .from("sellers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !rows?.length) return [];
  return rows.map(mapSellerRow);
}

/** Insert a product listing; listed_by_uid is set from current auth user. */
export async function insertProductListing(insert: {
  seller_id: string;
  title: string;
  price: number;
  original_price?: number | null;
  images: string[];
  category: string;
  subcategory?: string | null;
  brand: string;
  size: string;
  condition: string;
  era?: string | null;
  description: string;
  tags?: string[];
  allow_offers?: boolean;
  shipping_cost?: number;
  local_pickup?: boolean;
  status?: string;
}): Promise<{ id: string } | { error: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...insert,
      listed_by_uid: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}
