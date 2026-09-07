import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminCommandesPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, total, payment_method, created_at, address:addresses(full_name, phone)"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Commandes</h1>

      <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {order.order_number}
                </p>
                <p className="text-xs text-neutral-500">
                  {(order.address as any)?.full_name} ·{" "}
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-sm font-semibold text-navy">
                  {order.total.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-sm text-neutral-400">
            Aucune commande pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
