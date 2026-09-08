import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, MoreHorizontal, Smartphone } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

const HOME_CATEGORIES = [
  { slug: "telephones-electronique", label: "Électronique" },
  { slug: "mode-vetements", label: "Mode" },
  { slug: "meubles-decoration", label: "Maison" },
  { slug: "beaute-soins", label: "Beauté" },
  { slug: "sport-loisirs", label: "Sport" },
  { slug: "produits-du-quotidien", label: "Quotidien" },
  { slug: "jouets", label: "Jouets" },
];

export default async function AccueilPage() {
  const supabase = createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("name, slug")
    .in("slug", HOME_CATEGORIES.map((c) => c.slug));

  const categories = HOME_CATEGORIES.map((hc) => ({
    ...hc,
    exists: categoriesData?.some((c) => c.slug === hc.slug),
  }));

  const { data: products } = await supabase
    .from("products")
    .select(
      "slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;
  if (user) {
    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", user.id);
    cartCount = (cartItems || []).reduce((sum, i) => sum + i.quantity, 0);
  }

  const formattedProducts = (products || []).map((p) => ({
    ...p,
    image_url:
      p.product_images?.find((i) => i.is_primary)?.url ||
      p.product_images?.[0]?.url,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-4 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <Image
            src="/logo-horizontal.png"
            alt="Kpata"
            width={110}
            height={41}
            priority
            className="h-7 w-auto"
          />
          <Link href="/panier" aria-label="Panier" className="relative">
            <ShoppingCart size={24} className="text-navy" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <form action="/recherche" method="GET">
          <label className="flex items-center justify-between gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5">
            <input
              type="text"
              name="q"
              placeholder="Rechercher un produit, une marque..."
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <Search size={18} className="shrink-0 text-navy" />
          </label>
        </form>
      </header>

      {/* Bannière principale */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-card bg-navy px-5 py-6">
          <Smartphone
            size={140}
            strokeWidth={1}
            className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 rotate-12 text-white/10"
          />
          <p className="relative text-lg font-extrabold leading-tight text-white">
            Des produits
            <br />
            <span className="text-orange">de qualité</span>
            <br />
            <span className="text-orange">à prix accessibles</span>
          </p>
          <Link
            href="/categories"
            className="relative mt-3 inline-block rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white"
          >
            Découvrir
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-4 gap-y-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-100 bg-white shadow-sm">
                <Image
                  src={`/categories/${cat.slug}.png`}
                  alt={cat.label}
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
              </span>
              <span className="text-xs font-medium text-navy">{cat.label}</span>
            </Link>
          ))}
          <Link href="/categories" className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <MoreHorizontal size={24} className="text-navy" />
            </span>
            <span className="text-xs font-medium text-navy">Plus</span>
          </Link>
        </div>
      </section>

      {/* Offres du moment */}
      <section className="px-4 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy">Offres du moment 🔥</h2>
          <Link href="/categories" className="text-xs font-medium text-navy">
            Voir tout
          </Link>
        </div>
        {formattedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {formattedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aucun produit publié pour le moment.
          </p>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
