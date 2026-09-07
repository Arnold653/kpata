-- ============================================================
-- KPATA — Produits de démonstration
-- À exécuter après seed.sql (nécessite les catégories).
-- ============================================================

insert into products (category_id, name, slug, description, brand, price, compare_at_price, stock_available, is_published, rating_average, rating_count)
values
  ((select id from categories where slug='telephones-electronique'), 'Smartphone Samsung Galaxy A55', 'smartphone-samsung-galaxy-a55', 'Écran 6.6" Super AMOLED, 128 Go de stockage, appareil photo principal 50 MP, batterie longue durée.', 'Samsung', 249900, 279900, 25, true, 4.6, 82),
  ((select id from categories where slug='informatique'), 'Ordinateur portable 15.6"', 'ordinateur-portable-15-6', 'Processeur performant, 8 Go de RAM, 256 Go SSD, idéal pour le travail et les études.', 'Generic', 349900, null, 12, true, 4.4, 65),
  ((select id from categories where slug='telephones-electronique'), 'Casque JBL Tune 510BT', 'casque-jbl-tune-510bt', 'Casque sans fil Bluetooth, autonomie 40h, son JBL Pure Bass.', 'JBL', 39900, 79900, 40, true, 4.5, 44),
  ((select id from categories where slug='telephones-electronique'), 'Montre connectée Xiaomi Redmi Watch 3', 'montre-xiaomi-redmi-watch-3', 'Écran AMOLED, suivi santé et sport, autonomie 12 jours.', 'Xiaomi', 59900, null, 18, true, 4.3, 37),
  ((select id from categories where slug='chaussures'), 'Baskets homme running', 'baskets-homme-running', 'Baskets légères et respirantes, semelle amortissante pour un confort au quotidien.', 'Generic', 18500, null, 30, true, 4.2, 98),
  ((select id from categories where slug='mode-vetements'), 'Casque sans fil édition sport', 'casque-sans-fil-sport', 'Léger et résistant à la transpiration, parfait pour le sport.', 'Generic', 24900, null, 20, true, 4.1, 120),
  ((select id from categories where slug='maison'), 'Set de rangement cuisine', 'set-rangement-cuisine', 'Lot de 5 boîtes hermétiques empilables pour organiser votre cuisine.', 'Generic', 12900, 15900, 50, true, 4.0, 21),
  ((select id from categories where slug='beaute-soins'), 'Coffret soins visage', 'coffret-soins-visage', 'Routine complète : nettoyant, sérum et crème hydratante.', 'Generic', 15900, null, 35, true, 4.4, 29)
on conflict (slug) do nothing;

-- Images (une image principale par produit, via placeholder déterministe)
insert into product_images (product_id, url, display_order, is_primary)
select id, 'https://picsum.photos/seed/' || slug || '/600/600', 0, true
from products
where slug in (
  'smartphone-samsung-galaxy-a55','ordinateur-portable-15-6','casque-jbl-tune-510bt',
  'montre-xiaomi-redmi-watch-3','baskets-homme-running','casque-sans-fil-sport',
  'set-rangement-cuisine','coffret-soins-visage'
)
on conflict do nothing;

-- Variantes de couleur pour le smartphone et les baskets
insert into product_variants (product_id, color, stock)
select id, couleur, 8
from products, unnest(array['Noir','Bleu','Violet']) as couleur
where slug = 'smartphone-samsung-galaxy-a55';

insert into product_variants (product_id, size, stock)
select id, pointure, 6
from products, unnest(array['40','41','42','43','44']) as pointure
where slug = 'baskets-homme-running';
