import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() || "";
  const supabase = createClient();

  const { data: products } = query
    ? await supabase
        .from("products")
        .select(
          "slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary)"
        )
        .eq("is_published", true)
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    : { data: [] };

  const formatted = (products || []).map((p) => ({
    ...p,
    image_url:
      p.product_images?.find((i) => i.is_primary)?.url ||
      p.product_images?.[0]?.url,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white px-4 pb-3 pt-5">
        <form action="/recherche" method="GET">
          <label className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-neutral-500">
            <Search size={18} />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Que recherchez-vous ?"
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </label>
        </form>
      </header>

      <div className="px-4 pt-3">
        {query ? (
          <p className="mb-3 text-sm text-neutral-500">
            {formatted.length} résultat{formatted.length !== 1 && "s"} pour «{" "}
            {query} »
          </p>
        ) : (
          <p className="mb-3 text-sm text-neutral-400">
            Recherchez un produit, une marque ou une catégorie.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {formatted.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {query && formatted.length === 0 && (
          <p className="rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aucun résultat pour cette recherche.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
