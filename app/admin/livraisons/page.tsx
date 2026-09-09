import { createClient } from "@/lib/supabase/server";
import AdminToggle from "@/components/admin/AdminToggle";
import DeliveryZoneForm from "@/components/admin/DeliveryZoneForm";

export default async function AdminLivraisonsPage() {
  const supabase = createClient();
  const { data: zones } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("city");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Zones de livraison</h1>

      <DeliveryZoneForm />

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
              <th className="px-4 py-3 font-medium">Ville</th>
              <th className="px-4 py-3 font-medium">Frais</th>
              <th className="px-4 py-3 font-medium">Délai estimé</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {zones?.map((z) => (
              <tr key={z.id} className="border-b border-neutral-50">
                <td className="px-4 py-3 font-medium text-navy">{z.city}</td>
                <td className="px-4 py-3 text-neutral-600">{z.base_fee.toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-3 text-neutral-600">
                  {z.estimated_days_min}-{z.estimated_days_max} jours
                </td>
                <td className="px-4 py-3">
                  <AdminToggle table="delivery_zones" id={z.id} field="is_active" value={z.is_active} />
                </td>
              </tr>
            ))}
            {(!zones || zones.length === 0) && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">Aucune zone.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
