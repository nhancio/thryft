-- Sellers table (can later link to auth.users via seller_id)
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null unique,
  avatar text,
  rating numeric(2,1) default 5.0,
  total_sales int default 0,
  verified boolean default false,
  response_time text,
  location text,
  created_at timestamptz default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  title text not null,
  price int not null,
  original_price int,
  images jsonb not null default '[]', -- array of image URLs
  category text not null check (category in ('iPhone', 'MacBook', 'Watch')),
  subcategory text,
  brand text not null,
  size text not null,
  condition text not null check (condition in ('new', 'like-new', 'gently-used', 'worn')),
  era text,
  description text not null,
  measurements jsonb, -- { chest?, length?, waist?, inseam?, unit }
  tags text[] default '{}',
  allow_offers boolean default true,
  shipping_cost int default 0,
  local_pickup boolean default false,
  likes int default 0,
  views int default 0,
  created_at timestamptz default now()
);

-- Indexes for filtering and listing
create index if not exists products_category_idx on public.products(category);
create index if not exists products_created_at_idx on public.products(created_at desc);
create index if not exists products_seller_id_idx on public.products(seller_id);

-- RLS: allow public read for products and sellers (site visible without login)
alter table public.sellers enable row level security;
alter table public.products enable row level security;

create policy "Allow public read sellers"
  on public.sellers for select
  using (true);

create policy "Allow public read products"
  on public.products for select
  using (true);

-- Authenticated users can insert/update their own (optional; add when linking sellers to auth)
-- create policy "Allow insert products" on public.products for insert with check (auth.role() = 'authenticated');
