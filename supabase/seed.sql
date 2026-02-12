-- Seed sellers and products (run after migrations)
-- Usage: supabase db reset (runs migrations + seed) or paste into Supabase SQL Editor

-- ──────────────────────────────────────────
-- SELLERS
-- ──────────────────────────────────────────
insert into public.sellers (id, name, username, avatar, rating, total_sales, verified, response_time, location) values
  ('a0000000-0000-0000-0000-000000000001', 'Priya Sharma', '@priyavintage', 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', 4.9, 342, true, 'Usually responds in 1 hour', 'Mumbai, India'),
  ('a0000000-0000-0000-0000-000000000002', 'Arjun Mehta', '@arjunthrifts', 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', 4.7, 156, true, 'Usually responds in 2 hours', 'Delhi, India'),
  ('a0000000-0000-0000-0000-000000000003', 'Zara Khan', '@zarafinds', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zara', 5.0, 89, false, 'Usually responds in 30 minutes', 'Bangalore, India')
on conflict (id) do nothing;

-- ──────────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────────
insert into public.products (seller_id, title, price, original_price, images, category, subcategory, brand, size, condition, era, description, tags, allow_offers, shipping_cost, local_pickup, likes, views, status) values
  -- iPhones
  ('a0000000-0000-0000-0000-000000000001', 'iPhone 14 Pro Max — 128GB, Deep Purple', 49999, 139900, '["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800"]', 'iPhone', 'Pro Max', 'Apple', '128GB', 'gently-used', '2023', 'iPhone 14 Pro Max in Deep Purple. Well maintained, minor micro-scratches on the frame. Battery health 89%. Comes with original box and charger.', '{iphone,apple,128gb,pro-max}', true, 0, true, 156, 890, 'live'),
  ('a0000000-0000-0000-0000-000000000002', 'iPhone 16 Pro — 256GB, Space Grey', 69999, 159900, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"]', 'iPhone', 'Pro', 'Apple', '256GB', 'like-new', '2024', 'iPhone 16 Pro in Space Grey. 2 months old, pristine condition. Battery health 100%. All accessories included.', '{iphone,apple,256gb,pro}', true, 0, true, 289, 1205, 'hold'),
  ('a0000000-0000-0000-0000-000000000003', 'iPhone 13 — 128GB, Midnight', 29999, 79900, '["https://images.unsplash.com/photo-1632633173522-47456de71b76?w=800"]', 'iPhone', 'Standard', 'Apple', '128GB', 'gently-used', '2022', 'iPhone 13 Midnight. Battery health 85%. No scratches on screen. Perfect daily driver.', '{iphone,apple,128gb}', true, 0, false, 98, 560, 'live'),
  ('a0000000-0000-0000-0000-000000000001', 'iPhone 15 — 512GB, Blue', 59999, 109900, '["https://images.unsplash.com/photo-1696348282481-0e1faab5b5c7?w=800"]', 'iPhone', 'Standard', 'Apple', '512GB', 'like-new', '2024', 'iPhone 15 Blue 512GB. Barely used, purchased as backup phone. Battery health 99%.', '{iphone,apple,512gb}', true, 0, true, 210, 940, 'sold'),

  -- MacBooks
  ('a0000000-0000-0000-0000-000000000003', 'MacBook Air M4 — 256GB, Midnight Blue', 45000, 114900, '["https://images.unsplash.com/photo-1611186871348-af283e9a3584?w=800"]', 'MacBook', 'Air', 'Apple', '256GB', 'like-new', '2025', 'MacBook Air M4 in Midnight Blue. 1 year used. Like new condition. 8GB RAM. 54 battery cycles.', '{macbook,apple,m4,air}', true, 0, true, 345, 1560, 'live'),
  ('a0000000-0000-0000-0000-000000000002', 'MacBook Pro M2 — 512GB, Space Grey', 72999, 149900, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"]', 'MacBook', 'Pro', 'Apple', '512GB', 'like-new', '2023', 'MacBook Pro 14" M2 Pro. 16GB RAM, 512GB SSD. 120 battery cycles. Perfect for development and creative work.', '{macbook,apple,m2-pro}', true, 0, true, 412, 2100, 'live'),
  ('a0000000-0000-0000-0000-000000000001', 'MacBook Air M1 — 256GB, Gold', 32000, 92900, '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"]', 'MacBook', 'Air', 'Apple', '256GB', 'gently-used', '2021', 'MacBook Air M1 Gold. 8GB RAM. 280 battery cycles. Minor scuff on bottom. Runs perfectly.', '{macbook,apple,m1,air}', true, 0, false, 178, 890, 'live'),

  -- Watches
  ('a0000000-0000-0000-0000-000000000001', 'Apple Watch Series 9 — 45mm, GPS + Cellular', 32999, 49900, '["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800"]', 'Watch', 'Series 9', 'Apple', '45mm', 'like-new', '2024', 'Apple Watch Series 9, 45mm, GPS + Cellular. Barely used. Comes with 3 bands (Sport, Leather, Milanese).', '{apple-watch,series-9,cellular}', true, 0, true, 201, 890, 'live'),
  ('a0000000-0000-0000-0000-000000000002', 'Apple Watch Ultra 2 — 49mm, GPS + Cellular', 52999, 89900, '["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800"]', 'Watch', 'Ultra 2', 'Apple', '49mm', 'like-new', '2024', 'Apple Watch Ultra 2. Titanium case, perfect condition. Includes Alpine Loop band and Trail Loop band.', '{apple-watch,ultra-2,titanium}', true, 0, true, 320, 1450, 'hold'),
  ('a0000000-0000-0000-0000-000000000003', 'Apple Watch SE 2nd Gen — 40mm, GPS', 12999, 29900, '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800"]', 'Watch', 'SE', 'Apple', '40mm', 'gently-used', '2023', 'Apple Watch SE 2nd Gen. GPS only. Great starter watch. Minor wear on sport band.', '{apple-watch,se,budget}', true, 0, false, 89, 430, 'live');
