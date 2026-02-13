-- Add wallet points to users
alter table public.users
  add column if not exists wallet_points int not null default 0;

-- Saved products table (user saves products)
create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.saved_products enable row level security;

-- Anyone can read saved counts (for showing save count)
create policy "Allow public read saved_products"
  on public.saved_products for select
  using (true);

-- Authenticated users can insert/delete their own saves
create policy "Allow authenticated insert saved_products"
  on public.saved_products for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Allow authenticated delete saved_products"
  on public.saved_products for delete
  to authenticated
  using (user_id = auth.uid());
