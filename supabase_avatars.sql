-- Add a profile picture column, and allow users to upload/view avatars
-- IMPORTANT: before running this, create a storage bucket named "avatars"
-- (Storage -> New bucket -> name it "avatars" -> turn ON "Public bucket")

alter table public.profiles add column if not exists avatar_url text;

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

notify pgrst, 'reload schema';
