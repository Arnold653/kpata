import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NouveauProduitPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .order("display_order");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Nouveau produit</h1>
      <ProductForm categories={categories || []} />
    </div>
  );
}
