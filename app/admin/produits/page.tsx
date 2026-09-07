import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishToggle from "@/components/admin/PublishToggle";

export default async function AdminProduitsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock_available, is_published")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
        {products && products.length > 0 ? (
          products.map((p) => (
            <Link
              key={p.id}
              href={`/admin/produits/${p.id}`}
              className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 last:border-0 hover:bg-neutral-50"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">{p.name}</p>
                <p className="text-xs text-neutral-500">
                  {p.price.toLocaleString("fr-FR")} FCFA · Stock : {p.stock_available}
                </p>
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <PublishToggle productId={p.id} isPublished={p.is_published} />
              </div>
            </Link>
          ))
        ) : (
          <p className="p-6 text-center text-sm text-neutral-400">
            Aucun produit. Créez-en un pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}
