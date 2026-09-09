import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminToggle from "@/components/admin/AdminToggle";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon, is_active, parent_id, display_order")
    .order("display_order");

  const parents = (categories || []).filter((c) => !c.parent_id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">Catégories</h1>
        <Link href="/admin/categories/nouvelle" className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white">
          + Nouvelle catégorie
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        {parents.map((parent) => (
          <div key={parent.id} className="border-b border-neutral-100 last:border-0">
            <Link
              href={`/admin/categories/${parent.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50"
            >
              <span className="flex items-center gap-2 font-medium text-navy">
                <span>{parent.icon}</span>
                {parent.name}
              </span>
              <AdminToggle table="categories" id={parent.id} field="is_active" value={parent.is_active} />
            </Link>
            {(categories || [])
              .filter((c) => c.parent_id === parent.id)
              .map((child) => (
                <Link
                  key={child.id}
                  href={`/admin/categories/${child.id}`}
                  className="flex items-center justify-between border-t border-neutral-50 py-2.5 pl-10 pr-4 text-sm hover:bg-neutral-50"
                >
                  <span className="text-neutral-600">— {child.name}</span>
                  <AdminToggle table="categories" id={child.id} field="is_active" value={child.is_active} />
                </Link>
              ))}
          </div>
        ))}
        {parents.length === 0 && (
          <p className="px-4 py-8 text-center text-neutral-400">Aucune catégorie.</p>
        )}
      </div>
    </div>
  );
}
