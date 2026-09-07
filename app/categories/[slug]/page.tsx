import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default async function CategoryProductsPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", params.slug)
    .single();

  if (!category) notFound();

  const { data: products } = await supabase
    .from("products")
    .select(
      "slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary)"
    )
    .eq("category_id", category.id)
    .eq("is_published", true);

  const formatted = (products || []).map((p) => ({
    ...p,
    image_url:
      p.product_images?.find((i) => i.is_primary)?.url ||
      p.product_images?.[0]?.url,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/categories">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">{category.name}</h1>
      </header>

      <div className="px-4 pb-2">
        <label className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-neutral-500">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher dans cette catégorie..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {formatted.length > 0 ? (
          formatted.map((p) => <ProductCard key={p.slug} product={p} />)
        ) : (
          <p className="col-span-2 rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aucun produit dans cette catégorie pour le moment.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
