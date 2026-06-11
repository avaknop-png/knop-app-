-- Whenever a new person signs up, automatically make them "Friends"
-- (mutual accepted connection) with the Knop admin account.

create or replace function public.add_admin_friend()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_id uuid := '95cb042d-4372-4ae8-9041-9f99b9d9e161';
begin
  if new.id = admin_id then
    return new;
  end if;

  if not exists (
    select 1 from public.follows
    where follower_id = admin_id and following_id = new.id
  ) then
    insert into public.follows(follower_id,following_id,status)
    values (admin_id,new.id,'accepted');
  end if;

  if not exists (
    select 1 from public.follows
    where follower_id = new.id and following_id = admin_id
  ) then
    insert into public.follows(follower_id,following_id,status)
    values (new.id,admin_id,'accepted');
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_add_admin_friend on auth.users;
create trigger on_auth_user_created_add_admin_friend
  after insert on auth.users
  for each row execute function public.add_admin_friend();

notify pgrst, 'reload schema';
