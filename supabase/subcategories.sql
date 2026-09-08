-- ============================================================
-- KPATA — Sous-catégories réelles (hiérarchie parent_id)
-- ============================================================

-- Téléphones & électronique
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Téléphones', 'telephones', 1),
  ('Ordinateurs', 'ordinateurs', 2),
  ('Audio', 'audio', 3),
  ('Accessoires électroniques', 'accessoires-electroniques', 4)
) as sub(name, slug, ord)
where categories.slug = 'telephones-electronique'
on conflict (slug) do nothing;

-- Mode & vêtements
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Vêtements homme', 'vetements-homme', 1),
  ('Vêtements femme', 'vetements-femme', 2),
  ('Vêtements enfant', 'vetements-enfant', 3)
) as sub(name, slug, ord)
where categories.slug = 'mode-vetements'
on conflict (slug) do nothing;

-- Maison (meubles & décoration)
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Salon', 'salon', 1),
  ('Chambre', 'chambre', 2),
  ('Décoration', 'decoration', 3),
  ('Rangement', 'rangement', 4)
) as sub(name, slug, ord)
where categories.slug = 'meubles-decoration'
on conflict (slug) do nothing;

-- Beauté & soins
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Maquillage', 'maquillage', 1),
  ('Soins visage', 'soins-visage', 2),
  ('Soins corps', 'soins-corps', 3),
  ('Parfums', 'parfums', 4)
) as sub(name, slug, ord)
where categories.slug = 'beaute-soins'
on conflict (slug) do nothing;

-- Sport & loisirs
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Fitness', 'fitness', 1),
  ('Outdoor', 'outdoor', 2),
  ('Vêtements de sport', 'vetements-sport', 3)
) as sub(name, slug, ord)
where categories.slug = 'sport-loisirs'
on conflict (slug) do nothing;

-- Produits du quotidien
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Alimentation', 'alimentation', 1),
  ('Hygiène', 'hygiene', 2),
  ('Entretien ménager', 'entretien-menager', 3)
) as sub(name, slug, ord)
where categories.slug = 'produits-du-quotidien'
on conflict (slug) do nothing;

-- Jouets
insert into categories (parent_id, name, slug, display_order)
select id, sub.name, sub.slug, sub.ord
from categories, (values
  ('Jouets enfants', 'jouets-enfants', 1),
  ('Jeux de société', 'jeux-de-societe', 2),
  ('Loisirs créatifs', 'loisirs-creatifs', 3)
) as sub(name, slug, ord)
where categories.slug = 'jouets'
on conflict (slug) do nothing;

-- ============================================================
-- Réassignation des produits de démo vers leurs sous-catégories
-- ============================================================
update products set category_id = (select id from categories where slug = 'telephones')
where slug = 'smartphone-samsung-galaxy-a55';

update products set category_id = (select id from categories where slug = 'ordinateurs')
where slug = 'ordinateur-portable-15-6';

update products set category_id = (select id from categories where slug = 'audio')
where slug = 'casque-jbl-tune-510bt';

update products set category_id = (select id from categories where slug = 'accessoires-electroniques')
where slug = 'montre-xiaomi-redmi-watch-3';
