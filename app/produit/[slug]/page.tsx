import Link from "next/link";
import { ChevronLeft, Heart, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartBox from "@/components/AddToCartBox";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, description, brand, price, compare_at_price, stock_available, rating_average, rating_count, product_images(url, is_primary, display_order), product_variants(id, color, size, stock)"
    )
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!product) notFound();

  const images = (product.product_images || []).sort(
    (a, b) => a.display_order - b.display_order
  );
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : null;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-28">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-4 py-4 backdrop-blur">
        <Link href="/categories">
          <ChevronLeft size={22} />
        </Link>
        <button aria-label="Ajouter aux favoris">
          <Heart size={20} />
        </button>
      </header>

      <div className="aspect-square w-full bg-neutral-100">
        {images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0].url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="space-y-4 px-4 pt-5">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-neutral-400">
            {product.brand}
          </p>
        )}
        <h1 className="text-lg font-semibold text-neutral-900">
          {product.name}
        </h1>

        {product.rating_count ? (
          <div className="flex items-center gap-1 text-sm text-neutral-600">
            <Star size={14} className="fill-orange text-orange" />
            {product.rating_average} ({product.rating_count} avis)
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-navy">
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {product.compare_at_price!.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-semibold text-orange">
                -{discountPct}%
              </span>
            </>
          )}
        </div>

        <p
          className={`text-sm font-medium ${
            product.stock_available > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock_available > 0 ? "En stock" : "Rupture de stock"}
        </p>

        <AddToCartBox
          productId={product.id}
          variants={product.product_variants || []}
        />

        {product.description && (
          <div className="border-t border-neutral-100 pt-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
