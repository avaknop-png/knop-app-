-- Email the Knop admin whenever a new person signs up,
-- so they know to send a welcome message.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_admin_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_id uuid := '95cb042d-4372-4ae8-9041-9f99b9d9e161';
  admin_email text;
begin
  if new.id = admin_id then
    return new;
  end if;

  select email into admin_email from auth.users where id = admin_id;

  if admin_email is null then
    return new;
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer re_Fu8MzAhs_GYxfVPXATsT9pP3fUT59qDsM',
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Knop <notifications@knop-app.com>',
      'to', jsonb_build_array(admin_email),
      'subject', 'New Knop signup: ' || coalesce(new.email,'someone'),
      'html', '<p>A new person just joined Knop: <strong>' || coalesce(new.email,'unknown') || '</strong></p><p>Don''t forget to send them a welcome message!</p>'
    )
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_notify_admin on auth.users;
create trigger on_auth_user_created_notify_admin
  after insert on auth.users
  for each row execute function public.notify_admin_new_user();

notify pgrst, 'reload schema';
