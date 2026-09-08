-- ============================================================
-- KPATA — Accès administrateur
-- Fonction is_admin() + politiques RLS pour le rôle 'admin'.
-- ============================================================

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- Produits : l'admin voit tout et peut tout gérer
create policy "Admin gère les produits" on products
  for all using (is_admin()) with check (is_admin());

-- Images produits : idem
create policy "Admin gère les images produits" on product_images
  for all using (is_admin()) with check (is_admin());

-- Variantes : idem
create policy "Admin gère les variantes" on product_variants
  for all using (is_admin()) with check (is_admin());

-- Commandes : l'admin voit toutes les commandes et peut changer leur statut
create policy "Admin voit toutes les commandes" on orders
  for select using (is_admin());
create policy "Admin modifie les commandes" on orders
  for update using (is_admin()) with check (is_admin());

-- Lignes de commande : lecture admin
create policy "Admin voit toutes les lignes de commande" on order_items
  for select using (is_admin());

-- Profils : lecture admin (pour les statistiques clients)
create policy "Admin voit tous les profils" on profiles
  for select using (is_admin());

-- ============================================================
-- Pour promouvoir un compte existant en administrateur,
-- remplacez l'email ci-dessous et exécutez cette ligne :
-- ============================================================
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'arnoldzanou65@gmail.com);
