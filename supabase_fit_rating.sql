-- Add a "how does it fit" rating to posts (runs_small / true_to_size / runs_large)
alter table public.posts add column if not exists fit_rating text;

notify pgrst, 'reload schema';
