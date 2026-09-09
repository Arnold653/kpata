import { createClient } from "@/lib/supabase/server";
import PaymentStatusSelect from "@/components/admin/PaymentStatusSelect";

const METHOD_LABELS: Record<string, string> = {
  mobile_money: "Mobile Money",
  carte_bancaire: "Carte bancaire",
  paiement_livraison: "Paiement à la livraison",
};

export default async function AdminPaiementsPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total, payment_method, payment_status, created_at, customer:profiles(full_name)")
    .order("created_at", { ascending: false });

  const totalPaid = (orders || [])
    .filter((o) => o.payment_status === "paye")
    .reduce((s, o) => s + Number(o.total), 0);
  const totalPending = (orders || [])
    .filter((o) => o.payment_status === "en_attente")
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Paiements</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">Total encaissé</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {totalPaid.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">En attente</p>
          <p className="mt-1 text-xl font-bold text-orange">
            {totalPending.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
              <th className="px-4 py-3 font-medium">N° commande</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Méthode</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Statut paiement</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-b border-neutral-50">
                <td className="px-4 py-3 font-medium text-navy">{o.order_number}</td>
                <td className="px-4 py-3 text-neutral-600">{(o.customer as any)?.full_name || "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{METHOD_LABELS[o.payment_method]}</td>
                <td className="px-4 py-3 text-neutral-600">{Number(o.total).toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-3">
                  <PaymentStatusSelect orderId={o.id} currentStatus={o.payment_status} />
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400">Aucun paiement.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
