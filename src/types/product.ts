// App types – all data comes from Supabase

export type ProductStatus = "hold" | "sold" | "live";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  size: string;
  condition: "new" | "like-new" | "gently-used" | "worn";
  era?: string;
  description: string;
  seller: Seller;
  status: ProductStatus;
  listedByUid?: string | null;
  measurements?: {
    chest?: number;
    length?: number;
    waist?: number;
    inseam?: number;
    unit: "cm" | "in";
  };
  tags: string[];
  allowOffers: boolean;
  shippingCost: number;
  localPickup: boolean;
  createdAt: string;
  likes: number;
  views: number;
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  totalSales: number;
  verified: boolean;
  responseTime: string;
  location: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  itemCount: number;
  slug: string;
}

export const CATEGORY_FILTERS = [
  { name: "All", count: 0 },
  { name: "iPhone", count: 0 },
  { name: "MacBook", count: 0 },
  { name: "Watch", count: 0 },
] as const;
