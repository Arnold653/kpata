-- ============================================================
-- KPATA — Politiques RLS complémentaires
-- À exécuter après le schéma initial : ces tables ont été
-- activées en RLS par Supabase ("Run and enable RLS") sans
-- règles associées, ce qui bloquait totalement leur lecture.
-- ============================================================

-- Variantes et images : visibles si le produit parent est publié
create policy "Variantes visibles si produit publié" on product_variants
  for select using (
    exists (select 1 from products p where p.id = product_id and p.is_published = true)
  );

create policy "Images visibles si produit publié" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_id and p.is_published = true)
  );

-- Vendeurs actifs : visibles par tous (nom de boutique, logo, etc.)
create policy "Vendeurs actifs visibles par tous" on vendors
  for select using (is_active = true);

-- Zones de livraison actives : visibles par tous (frais, délais)
create policy "Zones de livraison visibles par tous" on delivery_zones
  for select using (is_active = true);

-- Promotions actives : visibles par tous
create policy "Promotions actives visibles par tous" on promotions
  for select using (is_active = true);

-- Coupons actifs : lecture nécessaire pour valider un code saisi par le client
create policy "Coupons actifs consultables" on coupons
  for select using (is_active = true);

-- Historique de statut de commande : visible uniquement par le client concerné
create policy "Historique visible par le client propriétaire" on order_status_history
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
