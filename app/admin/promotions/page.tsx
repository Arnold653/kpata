import { createClient } from "@/lib/supabase/server";
import AdminToggle from "@/components/admin/AdminToggle";
import PromotionForm from "@/components/admin/PromotionForm";

export default async function AdminPromotionsPage() {
  const supabase = createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Promotions</h1>

      <PromotionForm />

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Réduction</th>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {promotions?.map((p) => (
              <tr key={p.id} className="border-b border-neutral-50">
                <td className="px-4 py-3 font-medium text-navy">{p.title}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {p.discount_type === "percentage" ? `-${p.discount_value}%` : `-${p.discount_value} FCFA`}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(p.starts_at).toLocaleDateString("fr-FR")} → {new Date(p.ends_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <AdminToggle table="promotions" id={p.id} field="is_active" value={p.is_active} />
                </td>
              </tr>
            ))}
            {(!promotions || promotions.length === 0) && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">Aucune promotion.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
