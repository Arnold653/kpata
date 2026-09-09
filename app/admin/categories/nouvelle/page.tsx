import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NouvelleCategoriePage() {
  const supabase = createClient();
  const { data: parents } = await supabase
    .from("categories")
    .select("id, name")
    .is("parent_id", null)
    .order("display_order");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Nouvelle catégorie</h1>
      <CategoryForm parents={parents || []} />
    </div>
  );
}
