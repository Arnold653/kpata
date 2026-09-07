import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";

export default async function FavorisPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      "product:products(slug, name, price, compare_at_price, rating_average, rating_count, product_images(url, is_primary))"
    )
    .eq("user_id", user.id);

  const products = (favorites || [])
    .map((f: any) => f.product)
    .filter(Boolean)
    .map((p: any) => ({
      ...p,
      image_url:
        p.product_images?.find((i: any) => i.is_primary)?.url ||
        p.product_images?.[0]?.url,
    }));

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white px-4 pb-3 pt-5">
        <h1 className="text-lg font-semibold text-navy">Mes favoris</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.slug} product={p} />)
        ) : (
          <p className="col-span-2 rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Vous n&apos;avez pas encore de favoris.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
