import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProduitPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("id, name, parent_id").order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Modifier le produit</h1>
      <ProductForm
        categories={categories || []}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          brand: product.brand || "",
          category_id: product.category_id,
          price: product.price,
          compare_at_price: product.compare_at_price,
          stock_available: product.stock_available,
          stock_alert_threshold: product.stock_alert_threshold,
          is_published: product.is_published,
        }}
      />
    </div>
  );
}
