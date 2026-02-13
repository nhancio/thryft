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
    walletPoints: row.wallet_points ?? 0,
  };
}

const PLACEHOLDER_IMG = "/images/placeholder-product.svg";

function mapProductRow(
  row: Tables<"products">,
  user: UserProfile
): Product {
  // Parse images — handle array or JSON string
  let parsedImages: string[] = [];
  const rawValue = row.images;
  if (Array.isArray(rawValue)) {
    parsedImages = rawValue.filter((v): v is string => typeof v === "string");
  } else if (typeof rawValue === "string") {
    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        parsedImages = parsed.filter((v: unknown): v is string => typeof v === "string");
      }
    } catch {
      if (rawValue.startsWith("http") || rawValue.startsWith("/")) {
        parsedImages = [rawValue];
      }
    }
  }

  // Filter out blob: URLs (they are ephemeral and don't work across sessions/users)
  const images = parsedImages.filter((url) => !url.startsWith("blob:"));
  if (images.length === 0) images.push(PLACEHOLDER_IMG);
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

  if (productsError || !productRows?.length) return [];

  const userIds = [...new Set(productRows.map((p) => p.seller_id))];
  const { data: userRows, error: usersError } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);

  if (usersError || !userRows?.length) return [];

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

/** Upload an image to Supabase Storage and return its public URL. */
export async function uploadProductImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

/** Fetch saved product IDs for a user. */
export async function fetchSavedProductIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_products")
    .select("product_id")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => r.product_id);
}

/** Save a product for the current user. */
export async function saveProduct(userId: string, productId: string): Promise<boolean> {
  const { error } = await supabase
    .from("saved_products")
    .insert({ user_id: userId, product_id: productId });
  return !error;
}

/** Unsave a product for the current user. */
export async function unsaveProduct(userId: string, productId: string): Promise<boolean> {
  const { error } = await supabase
    .from("saved_products")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  return !error;
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
