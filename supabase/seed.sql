-- Seed users and products (run after ALL migrations)
-- Usage: supabase db reset (runs migrations + seed) or paste into Supabase SQL Editor
-- NOTE: These seed users must first exist in auth.users. For local dev with
-- supabase CLI, you can create them via the Auth dashboard or the seed below
-- will only work if you manually insert matching auth.users rows.

-- ──────────────────────────────────────────
-- SEED USERS (public.users)
-- These UUIDs must match actual auth.users entries.
-- For testing, create Google-authenticated users first, then use their IDs here.
-- Or replace these UUIDs with your own auth user IDs.
-- ──────────────────────────────────────────
-- Example (replace with real auth user UUIDs after first Google login):
-- insert into public.users (id, name, email, avatar, location) values
--   ('YOUR-AUTH-UUID-HERE', 'Your Name', 'you@gmail.com', 'https://...avatar...', 'Mumbai, India')
-- on conflict (id) do nothing;

-- ──────────────────────────────────────────
-- PRODUCTS
-- After your first Google login, the useAuth hook auto-creates your user row.
-- Then you can list products via the Sell page, or seed them here using your user UUID.
-- ──────────────────────────────────────────
-- Example:
-- insert into public.products (seller_id, listed_by_uid, title, price, original_price, images, category, subcategory, brand, size, condition, era, description, tags, allow_offers, shipping_cost, local_pickup, likes, views, status) values
--   ('YOUR-AUTH-UUID', 'YOUR-AUTH-UUID', 'iPhone 14 Pro — 128GB, Deep Purple', 49999, 139900, '["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800"]', 'iPhone', 'Pro', 'Apple', '128GB', 'gently-used', '2023', 'Great condition iPhone.', '{iphone,apple}', true, 0, true, 0, 0, 'live');

-- TIP: The easiest way to seed products is:
-- 1. Start the app and login with Google (creates your user row automatically)
-- 2. Copy your user UUID from the Supabase Auth dashboard
-- 3. Run INSERT statements with that UUID as seller_id and listed_by_uid
