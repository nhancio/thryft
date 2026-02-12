-- Link product listings to the user who created them (Supabase Auth UID)
alter table public.products
  add column if not exists listed_by_uid uuid;

comment on column public.products.listed_by_uid is 'Supabase Auth user id of the lister';

-- Allow authenticated users to insert their own listing (listed_by_uid = auth.uid())
create policy "Allow authenticated insert own product"
  on public.products for insert
  to authenticated
  with check (listed_by_uid = auth.uid());
