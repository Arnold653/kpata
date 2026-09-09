import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoriePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: category }, { data: parents }] = await Promise.all([
    supabase.from("categories").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("id, name").is("parent_id", null).order("display_order"),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Modifier la catégorie</h1>
      <CategoryForm
        parents={(parents || []).filter((p) => p.id !== category.id)}
        initial={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon || "",
          parent_id: category.parent_id,
          display_order: category.display_order,
          is_active: category.is_active,
        }}
      />
    </div>
  );
}
