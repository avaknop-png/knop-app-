-- One-time: make the Knop admin account Friends with every existing user
-- (new signups already get this automatically from supabase_admin_autofriend.sql)

do $$
declare
  admin_id uuid := '95cb042d-4372-4ae8-9041-9f99b9d9e161';
  u record;
begin
  for u in select id from auth.users where id <> admin_id loop
    if not exists (
      select 1 from public.follows
      where follower_id = admin_id and following_id = u.id
    ) then
      insert into public.follows(follower_id,following_id,status)
      values (admin_id,u.id,'accepted');
    end if;

    if not exists (
      select 1 from public.follows
      where follower_id = u.id and following_id = admin_id
    ) then
      insert into public.follows(follower_id,following_id,status)
      values (u.id,admin_id,'accepted');
    end if;
  end loop;
end $$;
