-- Add a post_type column so posts can be a "fit" (sizing post) or a "discussion" (question/community post)

alter table public.posts add column if not exists post_type text not null default 'fit';

notify pgrst, 'reload schema';
