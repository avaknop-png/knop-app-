-- Let posts be Public, Friends-only, or Followers-only
alter table public.posts add column if not exists visibility text not null default 'public';

notify pgrst, 'reload schema';
