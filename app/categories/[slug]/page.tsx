import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sous?: string };
}) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("slug", params.slug)
    .single();

  if (!category) notFound();

  // Sous-catégories directes de cette catégorie (vide si c'en est déjà une)
  const { data: subcategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("parent_id", category.id)
    .eq("is_active", true)
    .order("display_order");

  const activeSubSlug = searchParams.sous;
  const activeSub = subcategories?.find((s) => s.slug === activeSubSlug);

  // IDs de catégories à inclure dans la requête produits :
  // - la catégorie elle-même
  // - + toutes ses sous-catégories (si aucun filtre actif)
  // - ou uniquement la sous-catégorie sélectionnée (si filtre actif)
  const categoryIds = activeSub
    ? [activeSub.id]
    : [category.id, ...(subcategories || []).map((s) => s.id)];

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary)"
    )
    .in("category_id", categoryIds)
    .eq("is_published", true);

  const formatted = (products || []).map((p) => ({
    ...p,
    image_url:
      p.product_images?.find((i) => i.is_primary)?.url ||
      p.product_images?.[0]?.url,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/categories">
            <ChevronLeft size={24} className="text-navy" />
          </Link>
          <h1 className="text-xl font-bold text-navy">{category.name}</h1>
        </div>
        <Link href="/recherche" aria-label="Rechercher">
          <Search size={22} className="text-navy" />
        </Link>
      </header>

      {subcategories && subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          <Link
            href={`/categories/${params.slug}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              !activeSubSlug ? "bg-orange text-white" : "bg-blue-50 text-navy"
            }`}
          >
            Tous
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/categories/${params.slug}?sous=${sub.slug}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                activeSubSlug === sub.slug ? "bg-orange text-white" : "bg-blue-50 text-navy"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {formatted.length > 0 ? (
          formatted.map((p) => (
            <ProductCard key={p.slug} product={p} showQuickAdd />
          ))
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
