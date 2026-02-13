-- Create a public bucket for product images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow anyone to read (public bucket)
create policy "Allow public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated users to upload
create policy "Allow authenticated upload product-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');
