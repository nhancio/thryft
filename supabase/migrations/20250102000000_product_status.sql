-- Add status to products: hold, sold, live
alter table public.products
  add column if not exists status text not null default 'live'
  check (status in ('hold', 'sold', 'live'));
