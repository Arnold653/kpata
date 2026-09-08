import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Bell, ShoppingCart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug, icon")
    .eq("is_active", true)
    .order("display_order")
    .limit(6);

  const { data: products } = await supabase
    .from("products")
    .select(
      "slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const formattedProducts = (products || []).map((p) => ({
    ...p,
    image_url:
      p.product_images?.find((i) => i.is_primary)?.url ||
      p.product_images?.[0]?.url,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      {/* En-tête */}
      <header className="sticky top-0 z-10 bg-navy px-4 pb-4 pt-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-lg bg-white px-2 py-1">
            <Image
              src="/logo-horizontal.png"
              alt="Kpata"
              width={90}
              height={33}
              priority
              className="h-6 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications">
              <Bell size={22} />
            </button>
            <Link href="/panier" aria-label="Panier" className="relative">
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1 text-xs text-white/80">
          <MapPin size={14} />
          <span>Cotonou, Bénin</span>
        </div>

        <form action="/recherche" method="GET">
          <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-neutral-500">
            <Search size={18} />
            <input
              type="text"
              name="q"
              placeholder="Que recherchez-vous ?"
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </label>
        </form>
      </header>

      {/* Bannière principale */}
      <section className="px-4 pt-4">
        <div className="rounded-card bg-orange px-5 py-6 text-white">
          <p className="text-lg font-semibold leading-snug">
            Des produits de qualité à prix accessibles
          </p>
          <Link
            href="/categories"
            className="mt-3 inline-block rounded-full bg-navy px-4 py-2 text-sm font-medium"
          >
            Découvrir
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">
            Catégories
          </h2>
          <Link href="/categories" className="text-xs font-medium text-navy">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-card border border-neutral-100 bg-neutral-50 py-4"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-neutral-700">{cat.name}</span>
              </Link>
            ))
          ) : (
            <p className="col-span-3 rounded-card border border-dashed border-neutral-200 p-4 text-center text-xs text-neutral-400">
              Aucune catégorie trouvée — vérifiez que le seed a bien été exécuté.
            </p>
          )}
        </div>
      </section>

      {/* Offres du moment */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">
            Offres du moment
          </h2>
          <button className="text-xs font-medium text-navy">Voir tout</button>
        </div>
        {formattedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {formattedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aucun produit publié pour le moment. Exécutez le fichier
            supabase/demo_products.sql pour en voir ici.
          </p>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
