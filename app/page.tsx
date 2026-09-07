import { Search, MapPin, Bell, ShoppingCart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
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
    .select("id, name, price, compare_at_price")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      {/* En-tête */}
      <header className="sticky top-0 z-10 bg-navy px-4 pb-4 pt-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Kpata</span>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications">
              <Bell size={22} />
            </button>
            <button aria-label="Panier" className="relative">
              <ShoppingCart size={22} />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold">
                3
              </span>
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1 text-xs text-white/80">
          <MapPin size={14} />
          <span>Cotonou, Bénin</span>
        </div>

        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-neutral-500">
          <Search size={18} />
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </label>
      </header>

      {/* Bannière principale */}
      <section className="px-4 pt-4">
        <div className="rounded-card bg-orange px-5 py-6 text-white">
          <p className="text-lg font-semibold leading-snug">
            Des produits de qualité à prix accessibles
          </p>
          <button className="mt-3 rounded-full bg-navy px-4 py-2 text-sm font-medium">
            Découvrir
          </button>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-base font-semibold text-neutral-900">
          Catégories
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.slug}
                className="flex flex-col items-center gap-2 rounded-card border border-neutral-100 bg-neutral-50 py-4"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-neutral-700">{cat.name}</span>
              </div>
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
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-card border border-neutral-100 p-3"
              >
                <div className="mb-2 h-24 w-full rounded-lg bg-neutral-100" />
                <p className="line-clamp-2 text-sm text-neutral-800">
                  {p.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">
                  {p.price.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aucun produit publié pour le moment. Ajoutez des produits depuis
            Supabase pour les voir apparaître ici.
          </p>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
