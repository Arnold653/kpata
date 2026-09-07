-- ============================================================
-- KPATA — Schéma Supabase (PostgreSQL)
-- Conçu pour un MVP "Kpata vendeur unique" évoluant vers une
-- marketplace multi-vendeurs sans refonte structurelle.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. PROFILS UTILISATEURS (étend auth.users de Supabase)
-- ------------------------------------------------------------
create type user_role as enum ('client', 'admin', 'vendor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role user_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. VENDEURS (vide en V1, prêt pour la marketplace en V2)
-- ------------------------------------------------------------
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  shop_name text not null,
  shop_slug text unique not null,
  description text,
  logo_url text,
  is_active boolean not null default true,
  commission_rate numeric(5,2) default 0, -- % prélevé par Kpata
  created_at timestamptz not null default now()
);

-- Vendeur "Kpata" par défaut pour le MVP (vendeur unique)
insert into vendors (id, shop_name, shop_slug, is_active, commission_rate)
values ('00000000-0000-0000-0000-000000000001', 'Kpata', 'kpata', true, 0);

-- ------------------------------------------------------------
-- 3. CATÉGORIES (hiérarchie flexible, réordonnable par l'admin)
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  icon text, -- emoji ou nom d'icône
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. PRODUITS
-- ------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references vendors(id) default '00000000-0000-0000-0000-000000000001',
  category_id uuid references categories(id),
  name text not null,
  slug text unique not null,
  description text,
  brand text,
  sku text unique,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2), -- ancien prix, pour affichage réduction
  stock_available integer not null default 0,
  stock_reserved integer not null default 0,
  stock_alert_threshold integer default 5,
  rating_average numeric(3,2) default 0,
  rating_count integer default 0,
  is_published boolean not null default false,
  view_count integer default 0,
  sales_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_vendor on products(vendor_id);
create index idx_products_published on products(is_published) where is_published = true;

-- Variantes (couleur / taille) — chaque variante a son propre stock
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  color text,
  size text,
  price_override numeric(12,2), -- si différent du prix de base
  stock integer not null default 0,
  sku_suffix text,
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  display_order integer not null default 0,
  is_primary boolean not null default false
);

-- ------------------------------------------------------------
-- 5. ADRESSES CLIENT
-- ------------------------------------------------------------
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  city text not null,
  neighborhood text, -- quartier
  landmark text,      -- point de repère
  delivery_instructions text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. ZONES ET FRAIS DE LIVRAISON
-- ------------------------------------------------------------
create table delivery_zones (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  base_fee numeric(10,2) not null default 0,
  estimated_days_min integer default 1,
  estimated_days_max integer default 3,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- 7. PANIER
-- ------------------------------------------------------------
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(user_id, product_id, variant_id)
);

-- ------------------------------------------------------------
-- 8. FAVORIS
-- ------------------------------------------------------------
create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ------------------------------------------------------------
-- 9. COMMANDES
-- ------------------------------------------------------------
create type order_status as enum (
  'nouvelle', 'confirmee', 'en_preparation', 'prete',
  'expediee', 'en_livraison', 'livree', 'annulee', 'retour'
);

create type delivery_method as enum ('domicile', 'point_relais', 'retrait_magasin');
create type payment_method as enum ('mobile_money', 'carte_bancaire', 'paiement_livraison');
create type payment_status as enum ('en_attente', 'paye', 'echoue', 'rembourse');

create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null, -- ex: KP-2026-001245
  user_id uuid not null references profiles(id),
  vendor_id uuid not null references vendors(id) default '00000000-0000-0000-0000-000000000001',
  address_id uuid references addresses(id),
  status order_status not null default 'nouvelle',
  delivery_method delivery_method not null,
  delivery_zone_id uuid references delivery_zones(id),
  delivery_fee numeric(10,2) not null default 0,
  payment_method payment_method not null,
  payment_status payment_status not null default 'en_attente',
  subtotal numeric(12,2) not null,
  discount_total numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  coupon_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  product_name text not null, -- snapshot au moment de la commande
  unit_price numeric(12,2) not null,
  quantity integer not null,
  line_total numeric(12,2) not null
);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  note text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 10. AVIS CLIENTS
-- ------------------------------------------------------------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id),
  order_id uuid references orders(id), -- pour vérifier achat confirmé
  rating integer not null check (rating between 1 and 5),
  comment text,
  photo_url text,
  is_approved boolean not null default true, -- modération admin
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 11. PROMOTIONS ET COUPONS
-- ------------------------------------------------------------
create table promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed_amount')),
  discount_value numeric(10,2) not null,
  category_id uuid references categories(id), -- null = toutes catégories
  product_id uuid references products(id),     -- null = pas ciblé produit
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true
);

create table coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed_amount')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(12,2) default 0,
  max_uses integer,
  used_count integer not null default 0,
  applicable_category_id uuid references categories(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ------------------------------------------------------------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type text, -- 'order_status', 'promotion', 'stock_alert', etc.
  related_order_id uuid references orders(id),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — politiques de base
-- ============================================================
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table cart_items enable row level security;
alter table favorites enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;
alter table products enable row level security;
alter table categories enable row level security;

-- Produits et catégories : lecture publique (visiteurs inclus)
create policy "Produits publiés visibles par tous"
  on products for select using (is_published = true);

create policy "Catégories actives visibles par tous"
  on categories for select using (is_active = true);

-- Profils : chacun voit et modifie le sien
create policy "Utilisateur voit son profil" on profiles
  for select using (auth.uid() = id);
create policy "Utilisateur modifie son profil" on profiles
  for update using (auth.uid() = id);

-- Adresses, panier, favoris, notifications : strictement privés
create policy "Adresses privées" on addresses
  for all using (auth.uid() = user_id);
create policy "Panier privé" on cart_items
  for all using (auth.uid() = user_id);
create policy "Favoris privés" on favorites
  for all using (auth.uid() = user_id);
create policy "Notifications privées" on notifications
  for all using (auth.uid() = user_id);

-- Commandes : le client voit uniquement les siennes
create policy "Client voit ses commandes" on orders
  for select using (auth.uid() = user_id);
create policy "Client crée ses commandes" on orders
  for insert with check (auth.uid() = user_id);

create policy "Client voit les lignes de ses commandes" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Avis : lecture publique si approuvé, écriture par l'auteur
create policy "Avis approuvés visibles par tous" on reviews
  for select using (is_approved = true);
create policy "Client écrit ses avis" on reviews
  for insert with check (auth.uid() = user_id);

-- NB: les politiques "admin a accès total" seront ajoutées via une
-- fonction is_admin() basée sur profiles.role, une fois le rôle
-- admin assigné manuellement dans Supabase.
