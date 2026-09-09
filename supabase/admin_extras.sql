-- ============================================================
-- KPATA — Compléments admin : livraisons + liste clients
-- ============================================================

-- L'admin peut gérer les zones de livraison (créer/modifier/désactiver)
create policy "Admin gère les zones de livraison" on delivery_zones
  for all using (is_admin()) with check (is_admin());

-- L'admin peut créer/modifier/désactiver les promotions et coupons
create policy "Admin gère les promotions" on promotions
  for all using (is_admin()) with check (is_admin());

create policy "Admin gère les coupons" on coupons
  for all using (is_admin()) with check (is_admin());

-- L'admin peut consulter toutes les notifications envoyées
create policy "Admin voit toutes les notifications" on notifications
  for select using (is_admin());

-- Fonction sécurisée : liste des clients avec email (non exposé par RLS
-- directe sur auth.users), réservée aux admins.
create or replace function admin_list_clients()
returns table (
  id uuid,
  full_name text,
  email text,
  phone text,
  created_at timestamptz,
  orders_count bigint,
  total_spent numeric
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not is_admin() then
    raise exception 'Accès refusé';
  end if;

  return query
  select
    p.id,
    p.full_name,
    u.email::text,
    p.phone,
    p.created_at,
    count(o.id) as orders_count,
    coalesce(sum(o.total), 0) as total_spent
  from profiles p
  join auth.users u on u.id = p.id
  left join orders o on o.user_id = p.id
  where p.role = 'client'
  group by p.id, u.email
  order by p.created_at desc;
end;
$$;

grant execute on function admin_list_clients() to authenticated;
