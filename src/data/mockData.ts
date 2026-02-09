// Mock data for thrifting marketplace

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
    title: "iPhone 14 Pro Max — 128GB, Deep Purple",
    price: 49999,
    originalPrice: 139900,
    images: [
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800",
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800",
    ],
    category: "iPhone",
    subcategory: "Pro Max",
    brand: "Apple",
    size: "128GB",
    condition: "gently-used",
    era: "2023",
    description: "iPhone 14 Pro Max in Deep Purple. 3 years used but well maintained. 128GB storage. Battery health is good. Minor wear on the frame but screen is clean. Comes with charger.",
    seller: mockSellers[0],
    tags: ["iphone", "14-pro-max", "apple", "purple", "128gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: true,
    createdAt: "2024-02-01T10:00:00Z",
    likes: 156,
    views: 890,
  },
  {
    id: "p2",
    title: "iPhone 16 Pro — 256GB, Space Grey",
    price: 69999,
    originalPrice: 159900,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", // Using 15 Pro placeholder for 16
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    ],
    category: "iPhone",
    subcategory: "Pro",
    brand: "Apple",
    size: "256GB",
    condition: "like-new",
    era: "2024",
    description: "iPhone 16 Pro in Space Grey. 2 years used, pristine condition. 256GB storage. Battery health 95%. No scratches or dents. Original box included.",
    seller: mockSellers[1],
    tags: ["iphone", "16-pro", "apple", "grey", "256gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: true,
    createdAt: "2024-02-02T11:30:00Z",
    likes: 289,
    views: 1205,
  },
  {
    id: "p3",
    title: "iPhone 15 Pro — 128GB, White Titanium",
    price: 65999,
    originalPrice: 134900,
    images: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800",
    ],
    category: "iPhone",
    subcategory: "Pro",
    brand: "Apple",
    size: "128GB",
    condition: "gently-used",
    era: "2023",
    description: "iPhone 15 Pro in White Titanium. 2 years used. 128GB storage. Fully functional, minor signs of usage. Screen protector applied since day one.",
    seller: mockSellers[2],
    tags: ["iphone", "15-pro", "apple", "white", "128gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: true,
    createdAt: "2024-02-03T09:15:00Z",
    likes: 112,
    views: 670,
  },
  {
    id: "p4",
    title: "MacBook Air M4 — 256GB, Midnight Blue",
    price: 45000,
    originalPrice: 114900,
    images: [
      "https://images.unsplash.com/photo-1611186871348-af283e9a3584?w=800",
      "https://images.unsplash.com/photo-1611186871348-af283e9a3584?w=800",
    ],
    category: "MacBook",
    subcategory: "Air",
    brand: "Apple",
    size: "256GB",
    condition: "like-new",
    era: "2025",
    description: "MacBook Air M4 in Midnight Blue. 1 year used. 256GB SSD. Incredible performance and battery life. Like new condition, barely used.",
    seller: mockSellers[0],
    tags: ["macbook", "air", "m4", "apple", "blue", "256gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: true,
    createdAt: "2024-02-04T14:20:00Z",
    likes: 345,
    views: 1560,
  },
  {
    id: "p5",
    title: "MacBook Air M4 — 512GB, Midnight Black",
    price: 60000,
    originalPrice: 134900,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],
    category: "MacBook",
    subcategory: "Air",
    brand: "Apple",
    size: "512GB",
    condition: "like-new",
    era: "2025",
    description: "MacBook Air M4 in Midnight Black. 1 year used. 512GB SSD for extra storage. Perfect for creative work. Flawless condition.",
    seller: mockSellers[1],
    tags: ["macbook", "air", "m4", "apple", "black", "512gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: false,
    createdAt: "2024-02-05T16:45:00Z",
    likes: 410,
    views: 2100,
  },
  {
    id: "p6",
    title: "MacBook Air M4 — 128GB, Midnight Black",
    price: 45000,
    originalPrice: 99900,
    images: [
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800", // Generic laptop image
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800",
    ],
    category: "MacBook",
    subcategory: "Air",
    brand: "Apple",
    size: "128GB",
    condition: "like-new",
    era: "2025",
    description: "MacBook Air M4 in Midnight Black. 1 year used. 128GB base model. Great entry-level Mac. Excellent condition.",
    seller: mockSellers[2],
    tags: ["macbook", "air", "m4", "apple", "black", "128gb"],
    allowOffers: true,
    shippingCost: 0,
    localPickup: true,
    createdAt: "2024-02-06T12:10:00Z",
    likes: 98,
    views: 450,
  },
];

export const mockCollections: Collection[] = [
  {
    id: "c1",
    title: "iPhone Deals",
    description: "Best prices on pre-owned iPhones",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800",
    itemCount: 124,
    slug: "iphone",
  },
  {
    id: "c2",
    title: "MacBook Collection",
    description: "Premium laptops at thrifted prices",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    itemCount: 89,
    slug: "macbook",
  },
  {
    id: "c3",
    title: "iPad Selection",
    description: "Tablets for work and play",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    itemCount: 156,
    slug: "ipad",
  },
  {
    id: "c4",
    title: "Premium Accessories",
    description: "AirPods, cases, and more",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
    itemCount: 67,
    slug: "accessories",
  },
];

export const categories = [
  { name: "All", count: 2450 },
  { name: "iPhone", count: 567 },
  { name: "MacBook", count: 423 },
  { name: "iPad", count: 312 },
  { name: "Cars", count: 89 },
  { name: "Accessories", count: 456 },
];

export const sizes = ["64GB", "128GB", "256GB", "512GB", "1TB"];
export const conditions = ["New with tags", "New", "Like new", "Gently used", "Worn"];
export const eras = ["2024", "2023", "2022", "2021", "2020", "Older"];
export const priceRanges = [
  { label: "Under ₹20,000", min: 0, max: 20000 },
  { label: "₹20,000 - ₹40,000", min: 20000, max: 40000 },
  { label: "₹40,000 - ₹60,000", min: 40000, max: 60000 },
  { label: "₹60,000 - ₹80,000", min: 60000, max: 80000 },
  { label: "Over ₹80,000", min: 80000, max: Infinity },
];
