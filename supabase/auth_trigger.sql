-- ============================================================
-- KPATA — Trigger de création automatique de profil
-- À exécuter dans le SQL Editor : sans lui, un compte créé via
-- supabase.auth.signUp() n'aura pas de ligne correspondante
-- dans la table `profiles`.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
