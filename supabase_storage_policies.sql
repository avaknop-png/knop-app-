-- Allow signed-in users to upload photos to the post-photos bucket,
-- and allow anyone to view/download photos from it.

create policy "Authenticated users can upload post photos"
  on storage.objects for insert
  with check (bucket_id = 'post-photos' and auth.role() = 'authenticated');

create policy "Anyone can view post photos"
  on storage.objects for select
  using (bucket_id = 'post-photos');
