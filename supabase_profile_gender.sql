-- Add a gender field to profiles (Male / Female / Other / Prefer not to say)
alter table public.profiles add column if not exists gender text;

notify pgrst, 'reload schema';
