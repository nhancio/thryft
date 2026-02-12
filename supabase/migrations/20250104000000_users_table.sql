-- Users table: filled from Google login (name, email, location)
-- Users can be both sellers and buyers
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar text,
  location text,
  created_at timestamptz default now()
);

-- RLS: users can read all users, update only their own row
alter table public.users enable row level security;

create policy "Allow public read users"
  on public.users for select
  using (true);

create policy "Allow users to insert own row"
  on public.users for insert
  to authenticated
  with check (id = auth.uid());

create policy "Allow users to update own row"
  on public.users for update
  to authenticated
  using (id = auth.uid());

-- Drop old FK on products (points to sellers)
alter table public.products
  drop constraint if exists products_seller_id_fkey;

-- Delete old seed products that reference non-existent users
-- (these were seeded against the old sellers table)
delete from public.products
  where seller_id not in (select id from public.users);

-- Now safely add the new FK pointing to users
alter table public.products
  add constraint products_seller_id_fkey
  foreign key (seller_id) references public.users(id) on delete cascade;

-- Drop old sellers table (no longer needed)
drop table if exists public.sellers cascade;
