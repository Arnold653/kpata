import { createClient } from "@/lib/supabase/server";
import AdminToggle from "@/components/admin/AdminToggle";
import CouponForm from "@/components/admin/CouponForm";

export default async function AdminCouponsPage() {
  const supabase = createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Coupons</h1>

      <CouponForm />

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Réduction</th>
              <th className="px-4 py-3 font-medium">Utilisations</th>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((c) => (
              <tr key={c.id} className="border-b border-neutral-50">
                <td className="px-4 py-3 font-mono font-medium text-navy">{c.code}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {c.discount_type === "percentage" ? `-${c.discount_value}%` : `-${c.discount_value} FCFA`}
                </td>
                <td className="px-4 py-3 text-neutral-600">{c.used_count} / {c.max_uses ?? "∞"}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(c.starts_at).toLocaleDateString("fr-FR")} → {new Date(c.ends_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <AdminToggle table="coupons" id={c.id} field="is_active" value={c.is_active} />
                </td>
              </tr>
            ))}
            {(!coupons || coupons.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400">Aucun coupon.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
