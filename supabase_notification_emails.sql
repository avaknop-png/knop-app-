-- Send an email via Resend when a user gets a notification
-- (someone they follow posts, or someone comments on their post)

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient_email text;
  actor_username text;
  subject_line text;
  body_line text;
begin
  if new.type not in ('comment','new_post') then
    return new;
  end if;

  select email into recipient_email from auth.users where id = new.user_id;
  select username into actor_username from public.profiles where id = new.actor_id;

  if recipient_email is null then
    return new;
  end if;

  if new.type = 'comment' then
    subject_line := coalesce(actor_username,'Someone') || ' commented on your post on Knop';
    body_line := '<p><strong>' || coalesce(actor_username,'Someone') || '</strong> commented on your post.</p>';
  else
    subject_line := coalesce(actor_username,'Someone') || ' just posted on Knop';
    body_line := '<p><strong>' || coalesce(actor_username,'Someone') || '</strong> shared a new post.</p>';
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer re_Fu8MzAhs_GYxfVPXATsT9pP3fUT59qDsM',
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Knop <notifications@knop-app.com>',
      'to', jsonb_build_array(recipient_email),
      'subject', subject_line,
      'html', body_line || '<p><a href="https://knop-app.com">Open Knop to view</a></p>'
    )
  );

  return new;
end;
$$;

drop trigger if exists on_new_notification_email on public.notifications;
create trigger on_new_notification_email
  after insert on public.notifications
  for each row
  execute function public.notify_new_notification();

notify pgrst, 'reload schema';
