-- Email a new user a welcome message via Resend as soon as they sign up.

create or replace function public.send_welcome_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
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
      'to', jsonb_build_array(new.email),
      'subject', 'Welcome to Knop!',
      'html', '<p>Hi there,</p><p>Welcome to <strong>Knop</strong> — we''re so glad you''re here!</p><p>Knop is a community for sharing real sizing info and fit notes so everyone can shop with more confidence. Jump in, share a fit, and say hello.</p><p>See you in the feed!<br/>— The Knop Team</p>'
    )
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_welcome_email on auth.users;
create trigger on_auth_user_created_welcome_email
  after insert on auth.users
  for each row execute function public.send_welcome_email();

notify pgrst, 'reload schema';
