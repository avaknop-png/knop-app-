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
      'html', '<p>hey, welcome to knop.</p><p>we''re so glad you''re here — seriously.</p><p>knop is the app where real people share real sizing notes across every brand. no more guessing if you''re a 6 or an 8 at Zara. no more buying two sizes and returning one. just honest, crowdsourced sizing from people who''ve actually worn it.</p><p><strong>here''s what to do first:</strong></p><p>→ Add your sizes to your profile<br/>→ Browse brands you already shop<br/>→ Drop your first sizing note and help someone else out</p><p>we''re just getting started — and you''re part of it from the beginning. that means something.</p><p>see you in the app.</p><p>ava<br/><strong>founder, knop</strong></p>'
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
