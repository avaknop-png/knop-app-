-- One-way "follow" (separate from mutual friend requests in the follows table)
create table if not exists public.followers (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users(id) on delete cascade,
  followed_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, followed_id)
);

alter table public.followers enable row level security;

drop policy if exists "Anyone can view followers" on public.followers;
create policy "Anyone can view followers"
  on public.followers for select
  using (true);

drop policy if exists "Users can follow others" on public.followers;
create policy "Users can follow others"
  on public.followers for insert
  with check (auth.uid() = follower_id);

drop policy if exists "Users can unfollow" on public.followers;
create policy "Users can unfollow"
  on public.followers for delete
  using (auth.uid() = follower_id);

notify pgrst, 'reload schema';
