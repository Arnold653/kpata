-- ============================================================
-- KPATA — Données initiales (seed)
-- Catégories et zones de livraison telles que listées dans le
-- cahier des charges. Peut être exécuté dans le SQL Editor.
-- ============================================================

insert into categories (name, slug, icon, display_order) values
  ('Téléphones & électronique', 'telephones-electronique', '📱', 1),
  ('Informatique', 'informatique', '💻', 2),
  ('Mode & vêtements', 'mode-vetements', '👗', 3),
  ('Chaussures', 'chaussures', '👟', 4),
  ('Sacs & accessoires', 'sacs-accessoires', '👜', 5),
  ('Maison', 'maison', '🏠', 6),
  ('Cuisine', 'cuisine', '🍳', 7),
  ('Meubles & décoration', 'meubles-decoration', '🪑', 8),
  ('Beauté & soins', 'beaute-soins', '💄', 9),
  ('Bébé & enfants', 'bebe-enfants', '👶', 10),
  ('Jouets', 'jouets', '🧸', 11),
  ('Sport & loisirs', 'sport-loisirs', '🏋️', 12),
  ('Produits du quotidien', 'produits-du-quotidien', '🛒', 13),
  ('Cadeaux', 'cadeaux', '🎁', 14),
  ('Livres', 'livres', '📚', 15),
  ('Auto & moto', 'auto-moto', '🚗', 16),
  ('Animaux', 'animaux', '🐾', 17),
  ('Autres', 'autres', '➕', 18)
on conflict (slug) do nothing;

insert into delivery_zones (city, base_fee, estimated_days_min, estimated_days_max) values
  ('Cotonou', 1000, 1, 2),
  ('Abomey-Calavi', 1200, 1, 2),
  ('Porto-Novo', 1500, 1, 3),
  ('Ouidah', 1800, 2, 3),
  ('Abomey', 2000, 2, 4),
  ('Bohicon', 2000, 2, 4),
  ('Parakou', 2500, 2, 5),
  ('Natitingou', 3000, 3, 5)
on conflict do nothing;
