// Mock data for thrifting marketplace
import productJeans from "@/assets/product-jeans.jpg";
import productTshirt from "@/assets/product-tshirt.jpg";
import productJacket from "@/assets/product-jacket.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productDress from "@/assets/product-dress.jpg";

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

export const mockSellers: Seller[] = [
  {
    id: "s1",
    name: "Priya Sharma",
    username: "@priyavintage",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    rating: 4.9,
    totalSales: 342,
    verified: true,
    responseTime: "Usually responds in 1 hour",
    location: "Mumbai, India",
  },
  {
    id: "s2",
    name: "Arjun Mehta",
    username: "@arjunthrifts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    rating: 4.7,
    totalSales: 156,
    verified: true,
    responseTime: "Usually responds in 2 hours",
    location: "Delhi, India",
  },
  {
    id: "s3",
    name: "Zara Khan",
    username: "@zarafinds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zara",
    rating: 5.0,
    totalSales: 89,
    verified: false,
    responseTime: "Usually responds in 30 minutes",
    location: "Bangalore, India",
  },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    title: "Vintage Levi's 501 — 90s, high-waist, indigo",
    price: 1499,
    originalPrice: 3500,
    images: [productJeans, productJeans, productJeans],
    category: "Bottoms",
    subcategory: "Jeans",
    brand: "Levi's",
    size: "W30 L30",
    condition: "gently-used",
    era: "90s",
    description: "Classic 90s Levi's 501 in beautiful indigo wash. High-waisted fit that's perfect for tucking in your favorite vintage tee. Small fade on knee adds character. These are the real deal — made in USA.",
    seller: mockSellers[0],
    measurements: {
      waist: 76,
      inseam: 76,
      unit: "cm",
    },
    tags: ["vintage", "90s", "denim", "high-waist", "usa-made"],
    allowOffers: true,
    shippingCost: 150,
    localPickup: true,
    createdAt: "2024-01-15T10:30:00Z",
    likes: 89,
    views: 456,
  },
  {
    id: "p2",
    title: "Vintage Band Tee — Classic Rock Graphic",
    price: 899,
    images: [productTshirt, productTshirt],
    category: "Tops",
    subcategory: "T-Shirts",
    brand: "Unknown",
    size: "L",
    condition: "like-new",
    era: "80s",
    description: "Authentic vintage band tee with amazing graphic. Soft, broken-in cotton that gets better with every wash. Perfect oversized fit for that effortless cool look.",
    seller: mockSellers[1],
    measurements: {
      chest: 56,
      length: 72,
      unit: "cm",
    },
    tags: ["band-tee", "vintage", "80s", "graphic", "rock"],
    allowOffers: true,
    shippingCost: 100,
    localPickup: false,
    createdAt: "2024-01-14T15:20:00Z",
    likes: 134,
    views: 678,
  },
  {
    id: "p3",
    title: "Brown Leather Biker Jacket — Distressed",
    price: 4999,
    originalPrice: 12000,
    images: [productJacket, productJacket, productJacket],
    category: "Outerwear",
    subcategory: "Jackets",
    brand: "Unknown",
    size: "M",
    condition: "gently-used",
    era: "2000s",
    description: "Beautiful brown leather biker jacket with natural distressing. Real leather that's broken in perfectly. Classic asymmetrical zip with all hardware intact. A statement piece that'll last forever.",
    seller: mockSellers[2],
    measurements: {
      chest: 52,
      length: 62,
      unit: "cm",
    },
    tags: ["leather", "biker", "brown", "distressed", "statement"],
    allowOffers: true,
    shippingCost: 200,
    localPickup: true,
    createdAt: "2024-01-13T09:00:00Z",
    likes: 267,
    views: 1234,
  },
  {
    id: "p4",
    title: "Retro Sneakers — Two-Tone Colorway",
    price: 2199,
    images: [productSneakers, productSneakers],
    category: "Shoes",
    subcategory: "Sneakers",
    brand: "Vintage Sports",
    size: "EU 42",
    condition: "like-new",
    era: "90s",
    description: "Rare retro sneakers in a beautiful two-tone colorway. Barely worn with minimal sole wear. These are giving major 90s vibes and pair perfectly with baggy jeans or track pants.",
    seller: mockSellers[0],
    measurements: {
      length: 27,
      unit: "cm",
    },
    tags: ["sneakers", "retro", "90s", "two-tone", "rare"],
    allowOffers: false,
    shippingCost: 150,
    localPickup: true,
    createdAt: "2024-01-12T14:45:00Z",
    likes: 98,
    views: 543,
  },
  {
    id: "p5",
    title: "Floral Summer Dress — Cottagecore Vibes",
    price: 1299,
    images: [productDress, productDress],
    category: "Dresses",
    subcategory: "Casual",
    brand: "Unknown",
    size: "S",
    condition: "new",
    era: "90s",
    description: "The dreamiest floral dress with flutter sleeves and an elasticated waist. Never worn, tags still attached! Perfect for picnics, festivals, or just feeling cute on a random Tuesday.",
    seller: mockSellers[1],
    measurements: {
      chest: 44,
      length: 90,
      waist: 68,
      unit: "cm",
    },
    tags: ["floral", "cottagecore", "summer", "new-with-tags", "feminine"],
    allowOffers: true,
    shippingCost: 100,
    localPickup: false,
    createdAt: "2024-01-11T11:30:00Z",
    likes: 156,
    views: 789,
  },
  {
    id: "p6",
    title: "Vintage Denim Jacket — Oversized Fit",
    price: 1899,
    images: [productJacket, productJeans],
    category: "Outerwear",
    subcategory: "Jackets",
    brand: "Unknown Denim",
    size: "XL",
    condition: "gently-used",
    era: "80s",
    description: "Classic oversized denim jacket from the 80s. Perfect worn-in feel with that beautiful faded blue wash. Layer it over hoodies or wear it as a statement piece.",
    seller: mockSellers[2],
    measurements: {
      chest: 60,
      length: 68,
      unit: "cm",
    },
    tags: ["denim", "oversized", "80s", "vintage", "layering"],
    allowOffers: true,
    shippingCost: 150,
    localPickup: true,
    createdAt: "2024-01-10T16:00:00Z",
    likes: 78,
    views: 432,
  },
];

export const mockCollections: Collection[] = [
  {
    id: "c1",
    title: "90s Denim Dreams",
    description: "High-waisted, baggy, and beautifully faded",
    image: productJeans,
    itemCount: 124,
    slug: "90s-denim",
  },
  {
    id: "c2",
    title: "Vintage Band Tees",
    description: "Rock your favorite classics",
    image: productTshirt,
    itemCount: 89,
    slug: "band-tees",
  },
  {
    id: "c3",
    title: "Y2K Revival",
    description: "Low-rise, butterfly clips, and all that sparkle",
    image: productDress,
    itemCount: 156,
    slug: "y2k",
  },
  {
    id: "c4",
    title: "Leather & Layers",
    description: "Jackets that tell a story",
    image: productJacket,
    itemCount: 67,
    slug: "leather",
  },
];

export const categories = [
  { name: "All", count: 2450 },
  { name: "Tops", count: 567 },
  { name: "Bottoms", count: 423 },
  { name: "Dresses", count: 312 },
  { name: "Outerwear", count: 289 },
  { name: "Shoes", count: 456 },
  { name: "Accessories", count: 403 },
];

export const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
export const conditions = ["New with tags", "New", "Like new", "Gently used", "Worn"];
export const eras = ["2020s", "2010s", "2000s", "90s", "80s", "70s", "Vintage"];
export const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2500", min: 1000, max: 2500 },
  { label: "₹2500 - ₹5000", min: 2500, max: 5000 },
  { label: "Over ₹5000", min: 5000, max: Infinity },
];
