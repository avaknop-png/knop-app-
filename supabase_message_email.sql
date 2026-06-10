-- Send an email via Resend whenever a user receives a new direct message

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient_email text;
  sender_username text;
begin
  select email into recipient_email from auth.users where id = new.recipient_id;
  select username into sender_username from public.profiles where id = new.sender_id;

  if recipient_email is not null then
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer re_Fu8MzAhs_GYxfVPXATsT9pP3fUT59qDsM',
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'from', 'Knop <notifications@knop-app.com>',
        'to', jsonb_build_array(recipient_email),
        'subject', coalesce(sender_username,'Someone') || ' sent you a message on Knop',
        'html', '<p><strong>' || coalesce(sender_username,'Someone') || '</strong> sent you a message on Knop:</p><p>"' || new.body || '"</p><p><a href="https://knop-app.com">Open Knop to reply</a></p>'
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_new_message_notify on public.messages;
create trigger on_new_message_notify
  after insert on public.messages
  for each row
  execute function public.notify_new_message();

notify pgrst, 'reload schema';
