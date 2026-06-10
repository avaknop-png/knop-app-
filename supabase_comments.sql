-- Comments on posts
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  username text,
  body text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Anyone can view comments"
  on public.comments for select
  using (true);

create policy "Users can post their own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

notify pgrst, 'reload schema';
