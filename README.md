# Kpata

Application e-commerce généraliste pour le marché béninois.
« Tout ce dont vous avez besoin, au même endroit. »

## Stack

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS
- **Backend** : Supabase (Postgres, Auth, Storage)
- **Déploiement** : Vercel (plan hobby)

## Démarrage

1. Copier `.env.example` vers `.env.local` et renseigner les clés Supabase.
2. Installer les dépendances : `npm install`
3. Appliquer le schéma : exécuter `supabase/schema.sql` dans l'éditeur SQL Supabase.
4. Lancer le serveur de développement : `npm run dev`

## Structure

- `app/` — pages et layouts (App Router)
- `components/` — composants UI réutilisables
- `lib/supabase/` — clients Supabase (navigateur et serveur)
- `supabase/schema.sql` — schéma de base de données complet

## Roadmap

Voir le cahier des charges pour le détail des fonctionnalités MVP / V2 / V3.
L'architecture (table `vendors`, `commission_rate` sur `vendors`, `vendor_id`
sur `products`/`orders`) est prête pour l'évolution vers une marketplace
multi-vendeurs sans refonte.
