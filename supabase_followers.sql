-- One-way "follow" (separate from mutual friend requests in the follows table)
create table public.followers (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users(id) on delete cascade,
  followed_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, followed_id)
);

alter table public.followers enable row level security;

create policy "Anyone can view followers"
  on public.followers for select
  using (true);

create policy "Users can follow others"
  on public.followers for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.followers for delete
  using (auth.uid() = follower_id);

notify pgrst, 'reload schema';
