import { supabase } from "@/integrations/supabase/client";
import type { Product, UserProfile } from "@/types/product";
import type { Tables } from "@/integrations/supabase/types";

function mapUserRow(row: Tables<"users">): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar ?? "",
    location: row.location ?? "",
  };
}

function mapProductRow(
  row: Tables<"products">,
  user: UserProfile
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
    seller: user,
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

  const userIds = [...new Set(productRows.map((p) => p.seller_id))];
  const { data: userRows, error: usersError } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);

  if (usersError || !userRows?.length) {
    return [];
  }

  const userMap = new Map(userRows.map((u) => [u.id, mapUserRow(u)]));

  return productRows
    .map((row) => {
      const user = userMap.get(row.seller_id);
      if (!user) return null;
      return mapProductRow(row, user);
    })
    .filter(Boolean) as Product[];
}

export async function fetchProductByIdFromSupabase(
  id: string
): Promise<Product | null> {
  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) return null;

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", row.seller_id)
    .single();

  if (userError || !userRow) return null;

  return mapProductRow(row, mapUserRow(userRow));
}

export async function fetchUsersFromSupabase(): Promise<UserProfile[]> {
  const { data: rows, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !rows?.length) return [];
  return rows.map(mapUserRow);
}

/** Upsert a user row from Google login metadata. */
export async function upsertUser(user: {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
}): Promise<void> {
  await supabase.from("users").upsert(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      location: user.location ?? null,
    },
    { onConflict: "id" }
  );
}

/** Insert a product listing; listed_by_uid is set from current auth user. */
export async function insertProductListing(insert: {
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...insert,
      seller_id: user.id,
      listed_by_uid: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}
